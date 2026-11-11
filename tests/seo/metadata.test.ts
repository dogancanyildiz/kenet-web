import type { Metadata } from "next";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale, StaticPathname } from "@/i18n/routing";

vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: AppLocale;
    namespace: string;
  }) => {
    const messages = await loadMessages(locale);
    return createTranslator({ locale, messages, namespace });
  },
}));

const { generateMetadata: homeMetadata } = await import("@/app/[lang]/page");
const { generateMetadata: privacyMetadata } =
  await import("@/app/[lang]/privacy/page");
const { generateMetadata: supportMetadata } =
  await import("@/app/[lang]/support/page");
const { generateMetadata: layoutMetadata } =
  await import("@/app/[lang]/layout");
const { appStoreIdFromUrl, smartAppBanner } = await import("@/lib/seo");

/**
 * Locks the head every page ships: canonical, hreflang (both locales plus
 * x-default to the Turkish root), the share card and the twitter card. The
 * values are what Next turns into <link rel="alternate">, og:image:* and
 * twitter:* tags.
 */
const PAGES: Array<{
  path: StaticPathname;
  load: (args: { params: Promise<{ lang: string }> }) => Promise<Metadata>;
  urls: Record<AppLocale, string>;
}> = [
  {
    path: "/",
    load: homeMetadata,
    urls: { tr: "https://kenet.app/", en: "https://kenet.app/en" },
  },
  {
    path: "/privacy",
    load: privacyMetadata,
    urls: {
      tr: "https://kenet.app/gizlilik",
      en: "https://kenet.app/en/privacy",
    },
  },
  {
    path: "/support",
    load: supportMetadata,
    urls: {
      tr: "https://kenet.app/destek",
      en: "https://kenet.app/en/support",
    },
  },
];

const LOCALES: AppLocale[] = ["tr", "en"];

describe.each(PAGES)("head of $path", ({ load, urls }) => {
  it.each(LOCALES)("%s: canonical is the page's own url", async (lang) => {
    const metadata = await load({ params: Promise.resolve({ lang }) });
    expect(metadata.alternates?.canonical).toBe(urls[lang]);
    expect(metadata.openGraph?.url).toBe(urls[lang]);
  });

  it.each(LOCALES)(
    "%s: hreflang lists both locales and x-default",
    async (lang) => {
      const metadata = await load({ params: Promise.resolve({ lang }) });
      expect(metadata.alternates?.languages).toEqual({
        tr: urls.tr,
        en: urls.en,
        "x-default": urls.tr,
      });
    }
  );

  it.each(LOCALES)(
    "%s: share card is 1200x630 with alt text in the page language",
    async (lang) => {
      const metadata = await load({ params: Promise.resolve({ lang }) });
      const seo = (await loadMessages(lang)).seo as { ogImageAlt: string };
      const og = metadata.openGraph as {
        images: Array<Record<string, unknown>>;
        locale: string;
      };
      expect(og.locale).toBe(lang === "tr" ? "tr_TR" : "en_US");
      expect(og.images).toEqual([
        {
          url: "https://kenet.app/og/kenet.png",
          width: 1200,
          height: 630,
          alt: seo.ogImageAlt,
          type: "image/png",
        },
      ]);
      const twitter = metadata.twitter as {
        card: string;
        images: Array<Record<string, unknown>>;
      };
      expect(twitter.card).toBe("summary_large_image");
      expect(twitter.images).toEqual([
        { url: "https://kenet.app/og/kenet.png", alt: seo.ogImageAlt },
      ]);
    }
  );
});

describe("layout head", () => {
  it.each(LOCALES)(
    "%s: carries the share card for pages without their own",
    async (lang) => {
      const metadata = await layoutMetadata({
        params: Promise.resolve({ lang }),
      });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
      expect(
        (metadata.openGraph as { images: Array<{ url: string }> }).images[0]
          ?.url
      ).toBe("https://kenet.app/og/kenet.png");
    }
  );

  it("ships no Smart App Banner while the app is not in the store", async () => {
    const metadata = await layoutMetadata({
      params: Promise.resolve({ lang: "tr" }),
    });
    expect(metadata.itunes).toBeUndefined();
  });

  it("keeps snippets unlimited for search and answer engines", async () => {
    const metadata = await layoutMetadata({
      params: Promise.resolve({ lang: "en" }),
    });
    expect(metadata.robots).toMatchObject({
      index: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    });
  });
});

describe("smart app banner", () => {
  it("reads the numeric id out of an App Store url", () => {
    expect(
      appStoreIdFromUrl("https://apps.apple.com/tr/app/kenet/id1234567890")
    ).toBe("1234567890");
    expect(
      appStoreIdFromUrl("https://apps.apple.com/app/id987654321?l=en")
    ).toBe("987654321");
    expect(appStoreIdFromUrl(null)).toBeNull();
    expect(appStoreIdFromUrl("https://apps.apple.com/tr/app/kenet")).toBe(null);
  });

  it("adds itunes.appId only when the url carries an id", () => {
    expect(smartAppBanner(null)).toEqual({});
    expect(smartAppBanner("https://apps.apple.com/tr/app/kenet")).toEqual({});
    expect(
      smartAppBanner("https://apps.apple.com/tr/app/kenet/id1234567890")
    ).toEqual({ itunes: { appId: "1234567890" } });
  });
});
