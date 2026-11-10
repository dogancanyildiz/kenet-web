import type { MetadataRoute } from "next";
import { routing, type StaticPathname } from "@/i18n/routing";
import {
  absoluteUrl,
  buildLanguageAlternates,
  staticLanguageUrls,
} from "@/lib/seo";

const STATIC_PAGES: Array<{
  path: StaticPathname;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/support", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // No lastModified: the build timestamp would claim every page changed on
  // every deploy. An omitted lastmod is a fact; a wrong one costs trust.
  for (const page of STATIC_PAGES) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(locale, page.path),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: buildLanguageAlternates(staticLanguageUrls(page.path)),
        },
      });
    }
  }

  return entries;
}
