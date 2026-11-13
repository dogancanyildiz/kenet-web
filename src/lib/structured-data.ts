import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";
import { absoluteUrl, OG_IMAGES } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * schema.org JSON-LD for the pages. Every string a reader sees comes from the
 * same message keys the page renders, so the markup cannot drift from the
 * visible text. Deliberately absent until the app is in the store and the
 * price is decided: offers, aggregateRating, review (no rating exists; a
 * made up one is structured data spam) and macOS in operatingSystem (the Mac
 * app reaches the store later, docs/product.md).
 */

type JsonLdNode = Record<string, unknown>;

/**
 * App Store category from Google's applicationCategory list. Journals sit in
 * Lifestyle on the store; change it together with the store listing.
 */
export const APPLICATION_CATEGORY = "LifestyleApplication";

/** Platforms the store build runs on today. */
export const OPERATING_SYSTEM = "iOS, iPadOS";

/** Real screens the app markup lists; files under public/screens/. */
const SCREENSHOTS = [
  "today-light.webp",
  "person-light.webp",
  "ipad-today-light.webp",
];

/** GitHub profile of the owner, derived from the app repository url. */
function ownerGithubUrl(): string {
  const { origin, pathname } = new URL(site.appRepoUrl);
  return `${origin}/${pathname.split("/")[1]}`;
}

export function nodeIds(origin: string) {
  return {
    website: `${origin}/#website`,
    app: `${origin}/#app`,
    developer: `${origin}/#developer`,
  };
}

/**
 * Home page graph. WebSite only on the Turkish root: Google reads the site
 * name from the domain's home page, and /en is not one.
 */
export function buildHomeGraph(options: {
  locale: AppLocale;
  origin: string;
  homeUrl: string;
  siteName: string;
  description: string;
}): JsonLdNode {
  const { locale, origin, homeUrl, siteName, description } = options;
  const ids = nodeIds(origin);

  const developer: JsonLdNode = {
    "@type": "Person",
    "@id": ids.developer,
    name: site.ownerName,
    url: site.ownerUrl,
    sameAs: [ownerGithubUrl()],
  };

  const app: JsonLdNode = {
    "@type": "SoftwareApplication",
    "@id": ids.app,
    name: siteName,
    description,
    applicationCategory: APPLICATION_CATEGORY,
    operatingSystem: OPERATING_SYSTEM,
    inLanguage: ["tr", "en"],
    url: homeUrl,
    image: `${origin}${OG_IMAGES[locale].path}`,
    screenshot: SCREENSHOTS.map((file) => `${origin}/screens/${file}`),
    author: { "@id": ids.developer },
  };

  const graph: JsonLdNode[] = [];
  if (locale === "tr") {
    graph.push({
      "@type": "WebSite",
      "@id": ids.website,
      url: `${origin}/`,
      name: siteName,
      alternateName: [new URL(origin).host],
      inLanguage: locale,
      publisher: { "@id": ids.developer },
    });
  }
  graph.push(app, developer);

  return { "@context": "https://schema.org", "@graph": graph };
}

/** FAQPage for questions that are visible on the page, word for word. */
export function buildFaqPage(options: {
  locale: AppLocale;
  url: string;
  items: ReadonlyArray<{ question: string; answer: string }>;
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: options.url,
    inLanguage: options.locale,
    mainEntity: options.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Home graph with the page's own translated strings. */
export async function homeStructuredData(
  locale: AppLocale
): Promise<JsonLdNode> {
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  return buildHomeGraph({
    locale,
    origin: siteUrl(),
    homeUrl: absoluteUrl(locale, "/"),
    siteName: tMeta("siteName"),
    description: tHome("lead"),
  });
}

/**
 * JSON for an inline <script type="application/ld+json">. "<" is escaped so
 * a string can never close the script element (Next.js JSON-LD guide).
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
