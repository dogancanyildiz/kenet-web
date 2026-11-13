import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { pathnameForLocale } from "@/i18n/navigation";
import { pathnames, routing, type StaticPathname } from "@/i18n/routing";
import proxy from "@/proxy";

/**
 * The Kenet app links kenet.app/privacy and kenet.app/support. Those must land
 * on the Turkish legal pages without disturbing any real localized URL.
 */
const redirects = await nextConfig.redirects!();

/** Every public URL the site serves, in every locale. */
const publicPaths = routing.locales.flatMap((locale) =>
  (Object.keys(pathnames) as StaticPathname[]).map((href) =>
    pathnameForLocale(locale, href)
  )
);

/** First redirect whose source matches, with Next's own path matcher. */
function redirectFor(pathname: string) {
  return redirects.find((rule) => getPathMatch(rule.source)(pathname));
}

describe("legacy app redirects", () => {
  it("sends /privacy and /support permanently to the Turkish legal pages", () => {
    expect(redirectFor("/privacy")).toMatchObject({
      destination: pathnameForLocale("tr", "/privacy"),
      permanent: true,
    });
    expect(redirectFor("/support")).toMatchObject({
      destination: pathnameForLocale("tr", "/support"),
      permanent: true,
    });
    expect(pathnameForLocale("tr", "/privacy")).toBe("/gizlilik");
    expect(pathnameForLocale("tr", "/support")).toBe("/destek");
  });

  it("never matches a URL the site serves", () => {
    expect(publicPaths).toEqual(
      expect.arrayContaining(["/en/privacy", "/en/support", "/gizlilik"])
    );
    for (const path of publicPaths) {
      expect(redirectFor(path), path).toBeUndefined();
    }
  });

  it("points only at served URLs, so no chain or loop", () => {
    for (const rule of redirects) {
      expect(publicPaths).toContain(rule.destination);
      expect(redirectFor(rule.destination)).toBeUndefined();
    }
  });

  it("leaves the English pages to next-intl, served in place", () => {
    for (const path of ["/en/privacy", "/en/support"]) {
      const response = proxy(new NextRequest(`https://www.kenet.app${path}`));
      expect(response.status, path).toBe(200);
      expect(response.headers.get("location"), path).toBeNull();
      expect(response.headers.get("x-middleware-next"), path).toBe("1");
    }
  });

  // Without the config rule next-intl would still answer /privacy, but with a
  // temporary 307. The config rule runs first and makes it a cacheable 308.
  it("upgrades next-intl's own temporary answer to a permanent one", () => {
    const response = proxy(new NextRequest("https://www.kenet.app/privacy"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.kenet.app/gizlilik"
    );
    expect(redirectFor("/privacy")?.permanent).toBe(true);
  });
});
