import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();

  // One rule for every crawler: the whole site is open except /api/.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
