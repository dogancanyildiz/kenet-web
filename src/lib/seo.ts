import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pathnameForLocale } from "@/i18n/navigation";
import { routing, type AppLocale, type StaticPathname } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";

export function absoluteUrl(locale: AppLocale, path: StaticPathname): string {
  return `${siteUrl()}${pathnameForLocale(locale, path)}`;
}

/** Absolute url of one static page, for every routed locale. */
export function staticLanguageUrls(
  path: StaticPathname
): Record<AppLocale, string> {
  const urls = {} as Record<AppLocale, string>;
  for (const locale of routing.locales) {
    urls[locale] = absoluteUrl(locale, path);
  }
  return urls;
}

/**
 * hreflang map: every locale plus x-default, which points at the default
 * locale (Turkish). Shared by the page heads and the sitemap so the two can
 * never disagree about which languages exist.
 */
export function buildLanguageAlternates(
  urlsByLocale: Record<AppLocale, string>
): Record<string, string> {
  return {
    ...urlsByLocale,
    "x-default": urlsByLocale[routing.defaultLocale],
  };
}

/** og:locale values; Facebook and LinkedIn expect the underscore form. */
const OG_LOCALES = { en: "en_US", tr: "tr_TR" } as const;

/**
 * Complete metadata for one static page: title, description, canonical,
 * hreflang set and a full openGraph object. Next merges metadata shallowly, so
 * every page has to build its own openGraph or it would inherit the home url.
 */
export async function buildPageMetadata(
  locale: AppLocale,
  path: StaticPathname,
  options: { title: string; description: string; absoluteTitle?: boolean }
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteName = t("siteName");
  const canonical = absoluteUrl(locale, path);
  const openGraphTitle = options.absoluteTitle
    ? options.title
    : `${options.title} | ${siteName}`;

  return {
    title: options.absoluteTitle ? { absolute: options.title } : options.title,
    description: options.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(staticLanguageUrls(path)),
    },
    openGraph: {
      type: "website",
      siteName,
      title: openGraphTitle,
      description: options.description,
      url: canonical,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => OG_LOCALES[candidate]),
    },
    twitter: {
      card: "summary",
      title: openGraphTitle,
      description: options.description,
    },
  };
}
