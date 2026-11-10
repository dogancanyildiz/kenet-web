import { routing, type AppLocale } from "@/i18n/routing";

/** Derives the document locale from a pathname (/en/... -> en, else default). */
export function localeFromPathname(pathname: string): AppLocale {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }
  return routing.defaultLocale;
}

/** Segments the router owns; next-intl must never rewrite them. */
const RESERVED_PREFIXES = ["/api", "/_next", "/_vercel"];

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);

/**
 * True when next-intl should handle the request. Locale prefixed paths always
 * qualify; anything else whose last segment carries a dot is a file
 * (robots.txt, icon.svg, static assets), not a page.
 */
export function isLocalizedRoutePath(pathname: string): boolean {
  if (
    RESERVED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return false;
  }
  if (LOCALE_PREFIX.test(pathname)) {
    return true;
  }
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return !lastSegment.includes(".");
}
