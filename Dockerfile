# syntax=docker/dockerfile:1

# Pinned to a digest, not a floating tag; Dependabot's docker ecosystem tracks
# this line. node:24-alpine

# ---------------------------------------------------------------------------
# Stage 1: deps. Dependencies in an isolated layer so a source only change
# does not invalidate the npm cache. --ignore-scripts skips every package's
# install lifecycle script; the native addons listed resolve their prebuilt
# binary through a platform specific optionalDependency and are rebuilt
# explicitly.
# ---------------------------------------------------------------------------
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund --ignore-scripts && \
    npm rebuild sharp esbuild @swc/core unrs-resolver @parcel/watcher

# ---------------------------------------------------------------------------
# Stage 2: builder. NEXT_PUBLIC_SITE_URL must arrive as a build argument:
# next build inlines it into the client bundle. No default on purpose: a
# build that forgets it fails in resolveSiteUrl instead of inlining a wrong
# origin. CI, docker compose and Coolify all pass it explicitly.
# ---------------------------------------------------------------------------
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BUILD_SHA
ARG NEXT_PUBLIC_BUILD_DATE
# Coolify passes SOURCE_COMMIT into every Dockerfile build automatically.
ARG SOURCE_COMMIT=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BUILD_SHA=${NEXT_PUBLIC_BUILD_SHA:-$SOURCE_COMMIT}
ENV NEXT_PUBLIC_BUILD_DATE=$NEXT_PUBLIC_BUILD_DATE
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# An empty NEXT_PUBLIC_BUILD_DATE falls back to the current UTC time.
RUN NEXT_PUBLIC_BUILD_DATE="${NEXT_PUBLIC_BUILD_DATE:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}" npm run build

# ---------------------------------------------------------------------------
# Stage 3: runner. Only the standalone server, the static assets and public,
# run as the image's unprivileged "node" user.
# ---------------------------------------------------------------------------
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

# node's built in fetch: node:24-alpine ships no curl, and Coolify reports
# connection refused for curl and wget based checks in Node containers.
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/health`).then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
