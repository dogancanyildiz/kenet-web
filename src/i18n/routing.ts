import { defineRouting } from "next-intl/routing";

/**
 * Public pathnames. Internal file routes stay English
 * (`app/[lang]/privacy/page.tsx`); next-intl rewrites the localized URLs onto
 * them. ASCII only: no dotted or dotless i in a slug.
 *
 * The two legal pages are fixed by the Kenet decision log (2026-10-21): the
 * App Store listing points at kenet.app/gizlilik and kenet.app/destek.
 */
export const pathnames = {
  "/": "/",
  "/privacy": {
    tr: "/gizlilik",
    en: "/privacy",
  },
  "/support": {
    tr: "/destek",
    en: "/support",
  },
} as const;

/**
 * Single source of truth for locale routing.
 *
 * Turkish is the default locale and lives on the root (`/`, `/gizlilik`);
 * English is prefixed (`/en`, `/en/privacy`). localePrefix "as-needed" omits
 * the prefix on the default locale and redirects a superfluous `/tr/...` onto
 * the unprefixed URL. Locale detection and the cookie stay off: the URL is the
 * only signal, so every page stays cacheable and crawlable.
 */
export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  // hreflang comes from the <head> that buildAlternates fills, not from the
  // HTTP Link header, so one source publishes the language set.
  alternateLinks: false,
  pathnames,
});

export type AppLocale = (typeof routing.locales)[number];
export type StaticPathname = keyof typeof pathnames;
