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
export const OG_LOCALES = { en: "en_US", tr: "tr_TR" } as const;

/**
 * Share card per locale, rendered by scripts/render-og.mjs. Both locales point
 * at one textless card for now: the screens on it are the Turkish UI tour, so
 * an English file would be the same pixels. The alt text and the title next
 * to it are per language.
 */
export const OG_IMAGES: Record<
  AppLocale,
  { path: string; width: number; height: number }
> = {
  tr: { path: "/og/kenet-2026-11.png", width: 1200, height: 630 },
  en: { path: "/og/kenet-2026-11.png", width: 1200, height: 630 },
};

/** og:image entry for one locale; the url is absolute on the site origin. */
export async function openGraphImage(locale: AppLocale) {
  const t = await getTranslations({ locale, namespace: "seo" });
  const image = OG_IMAGES[locale];
  return {
    url: `${siteUrl()}${image.path}`,
    width: image.width,
    height: image.height,
    alt: t("ogImageAlt"),
    type: "image/png",
  };
}

/**
 * Numeric App Store id out of a listing url
 * (https://apps.apple.com/tr/app/kenet/id1234567890). null when there is no
 * url yet or it carries no id.
 */
export function appStoreIdFromUrl(url: string | null): string | null {
  if (!url) return null;
  return url.match(/\/id(\d+)(?:[/?#]|$)/)?.[1] ?? null;
}

/**
 * Smart App Banner (<meta name="apple-itunes-app">). Absent while the app is
 * not in the store: a banner without an id does nothing. Filling
 * site.appStoreUrl turns it on.
 */
export function smartAppBanner(
  appStoreUrl: string | null
): Pick<Metadata, "itunes"> {
  const appId = appStoreIdFromUrl(appStoreUrl);
  return appId ? { itunes: { appId } } : {};
}

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
  const image = await openGraphImage(locale);

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: options.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
