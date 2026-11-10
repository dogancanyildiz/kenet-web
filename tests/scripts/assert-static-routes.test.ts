import { describe, expect, it } from "vitest";
import { pathnames, routing } from "@/i18n/routing";
import {
  LOCALE_PAGES,
  readLocales,
  requiredRoutes,
} from "../../scripts/assert-static-routes.mjs";

describe("assert-static-routes", () => {
  it("reads the same locales the app routes", async () => {
    expect((await readLocales()).sort()).toEqual([...routing.locales].sort());
  });

  it("requires every routed page in every locale", () => {
    const pages = Object.keys(pathnames).map((key) => (key === "/" ? "" : key));
    expect([...LOCALE_PAGES].sort()).toEqual(pages.sort());
    const required = requiredRoutes(["en", "tr"]);
    expect(required).toContain("/tr/privacy");
    expect(required).toContain("/en/support");
    expect(required).toContain("/sitemap.xml");
  });
});
