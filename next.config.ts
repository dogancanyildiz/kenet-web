import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * The enforced policy keeps script-src 'unsafe-inline': the App Router streams
 * the RSC payload through inline script tags, and the only alternative is a
 * per request nonce, which forces every route out of the static prerender.
 * Every page here is statically generated and that is the property we keep.
 * 'unsafe-eval' and ws: are development only (React Refresh and HMR).
 */
function buildContentSecurityPolicy(isProduction: boolean): string {
  const scriptSrc = isProduction
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  const connectSrc = isProduction
    ? "connect-src 'self'"
    : "connect-src 'self' ws:";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    connectSrc,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

/**
 * HSTS lives here until the Traefik middleware owns it; then this entry is
 * removed rather than duplicated. preload is absent on purpose. Production
 * only: a year of https pinned to localhost would break plain http dev.
 */
const HSTS_HEADER = {
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains",
};

function staticSecurityHeaders(isProduction: boolean) {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=()",
        "usb=()",
        "serial=()",
        "midi=()",
        "display-capture=()",
        "browsing-topics=()",
        "interest-cohort=()",
      ].join(", "),
    },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    ...(isProduction ? [HSTS_HEADER] : []),
  ];
}

/**
 * Five minutes at the edge with a day of stale-while-revalidate for HTML:
 * Next's own one year s-maxage would pin every page at the edge the day a
 * Cloudflare Cache Rule is added. max-age=0 keeps the browser revalidating.
 */
const DEFAULT_CACHE = {
  key: "Cache-Control",
  value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
};

/** Restates the framework's own value for the hashed build output. */
const IMMUTABLE_BUILD_OUTPUT = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const ONE_DAY_CACHE = {
  key: "Cache-Control",
  value: "public, max-age=86400",
};

/**
 * Dashboards (Coolify's resource card) load the favicon in an <img> from their
 * own origin; same-origin CORP would make the browser block it. The icons are
 * public brand artwork, so only they opt back in to cross origin embedding.
 */
const ICON_CORP = {
  key: "Cross-Origin-Resource-Policy",
  value: "cross-origin",
};

const NO_STORE = { key: "Cache-Control", value: "no-store" };

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Lets src/app/global-not-found.tsx handle requests that never reach the
    // [lang] segment, with a stylesheet and an html lang attribute.
    globalNotFound: true,
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";

    return [
      {
        source: "/:path*",
        headers: [
          ...staticSecurityHeaders(isProduction),
          DEFAULT_CACHE,
          {
            key: "Content-Security-Policy",
            value: buildContentSecurityPolicy(isProduction),
          },
        ],
      },
      { source: "/icon.svg", headers: [ONE_DAY_CACHE, ICON_CORP] },
      { source: "/icon.png", headers: [ONE_DAY_CACHE, ICON_CORP] },
      { source: "/apple-icon.png", headers: [ONE_DAY_CACHE, ICON_CORP] },
      { source: "/_next/static/:path*", headers: [IMMUTABLE_BUILD_OUTPUT] },
      { source: "/api/:path*", headers: [NO_STORE] },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
