import { describe, expect, it } from "vitest";
import { pathnames, routing } from "@/i18n/routing";

/**
 * Locks the public URL contract. The two legal paths are what the App Store
 * listing points at (Kenet decision log, 2026-10-21), so a rename here is a
 * broken store link, not a refactor.
 */
describe("locale routing", () => {
  it("serves Turkish on the root and English under /en", () => {
    expect(routing.defaultLocale).toBe("tr");
    expect(routing.localePrefix).toBe("as-needed");
    expect([...routing.locales].sort()).toEqual(["en", "tr"]);
  });

  it("keeps the URL as the only locale signal", () => {
    expect(routing.localeDetection).toBe(false);
    expect(routing.localeCookie).toBe(false);
    expect(routing.alternateLinks).toBe(false);
  });

  it("publishes the store facing legal paths", () => {
    expect(pathnames["/privacy"]).toEqual({ tr: "/gizlilik", en: "/privacy" });
    expect(pathnames["/support"]).toEqual({ tr: "/destek", en: "/support" });
  });

  it("uses ASCII only slugs in every locale", () => {
    const ascii = /^\/[a-z0-9/-]*$/;
    for (const value of Object.values(pathnames)) {
      const paths = typeof value === "string" ? [value] : Object.values(value);
      for (const path of paths) {
        expect(path).toMatch(ascii);
      }
    }
  });

  it("localizes every non root path in every routed locale", () => {
    for (const [key, value] of Object.entries(pathnames)) {
      if (key === "/") continue;
      expect(typeof value).toBe("object");
      expect(Object.keys(value).sort()).toEqual([...routing.locales].sort());
    }
  });
});
