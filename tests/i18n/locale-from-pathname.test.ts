import { describe, expect, it } from "vitest";
import {
  isLocalizedRoutePath,
  localeFromPathname,
} from "@/lib/locale-from-pathname";

describe("localeFromPathname", () => {
  it("reads /en and /en/... as English and everything else as Turkish", () => {
    expect(localeFromPathname("/en")).toBe("en");
    expect(localeFromPathname("/en/privacy")).toBe("en");
    expect(localeFromPathname("/")).toBe("tr");
    expect(localeFromPathname("/gizlilik")).toBe("tr");
    // A slug that merely starts with "en" is not the English prefix.
    expect(localeFromPathname("/entry")).toBe("tr");
  });
});

describe("isLocalizedRoutePath", () => {
  it("hands pages to next-intl and skips files and reserved prefixes", () => {
    expect(isLocalizedRoutePath("/")).toBe(true);
    expect(isLocalizedRoutePath("/gizlilik")).toBe(true);
    expect(isLocalizedRoutePath("/en/support")).toBe(true);
    expect(isLocalizedRoutePath("/api/health")).toBe(false);
    expect(isLocalizedRoutePath("/_next/static/x.js")).toBe(false);
    expect(isLocalizedRoutePath("/robots.txt")).toBe(false);
    expect(isLocalizedRoutePath("/icon.svg")).toBe(false);
  });
});
