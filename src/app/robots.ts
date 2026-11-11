import type { MetadataRoute } from "next";
import { SEARCH_AGENTS, TRAINING_AGENTS } from "@/lib/crawlers";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();

  // A crawler that matches a named group ignores the * group, so every group
  // repeats the /api/ rule.
  return {
    rules: [
      { userAgent: [...SEARCH_AGENTS], allow: "/", disallow: "/api/" },
      { userAgent: [...TRAINING_AGENTS], allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
