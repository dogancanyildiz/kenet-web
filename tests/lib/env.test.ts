import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/env";

describe("resolveSiteUrl", () => {
  it("returns the origin without a trailing slash", () => {
    expect(resolveSiteUrl("https://kenet.app/")).toBe("https://kenet.app");
    expect(resolveSiteUrl("  http://localhost:3000 ")).toBe(
      "http://localhost:3000"
    );
  });

  it("rejects a missing, relative, non http or path carrying value", () => {
    expect(() => resolveSiteUrl(undefined)).toThrow(/not set/);
    expect(() => resolveSiteUrl("")).toThrow(/not set/);
    expect(() => resolveSiteUrl("kenet.app")).toThrow(/absolute/);
    expect(() => resolveSiteUrl("ftp://kenet.app")).toThrow(/http or https/);
    expect(() => resolveSiteUrl("https://kenet.app/gizlilik")).toThrow(
      /origin/
    );
  });
});
