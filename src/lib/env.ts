/**
 * NEXT_PUBLIC_SITE_URL is a build time variable: next build inlines it into
 * the client bundle. resolveSiteUrl is pure so it can be unit tested without
 * touching process.env; siteUrl() must be called inside a request handler or a
 * metadata function, never at module scope of a route.
 */
export function resolveSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. It is a required build time variable: set it in .env.local for local builds and as a Build variable in Coolify."
    );
  }
  const withoutSlash = trimmed.replace(/\/+$/, "");

  let parsed: URL;
  try {
    parsed = new URL(withoutSlash);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not an absolute URL: "${trimmed}". Use scheme and host, for example https://kenet.app.`
    );
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must use http or https, got "${parsed.protocol}".`
    );
  }
  if (withoutSlash !== parsed.origin) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an origin without a path, query or fragment, got "${trimmed}".`
    );
  }

  return withoutSlash;
}

export function siteUrl(): string {
  return resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}
