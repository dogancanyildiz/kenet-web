import { afterEach, describe, expect, it, vi } from "vitest";
import { buildInfo, copyrightRange } from "@/lib/build-info";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildInfo", () => {
  it("shortens the sha and passes the date through", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_SHA", "0123456789abcdef");
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "2026-11-10T12:00:00Z");
    expect(buildInfo()).toEqual({
      sha: "0123456",
      date: "2026-11-10T12:00:00Z",
    });
  });

  it("hides both when unset or blank", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_SHA", " ");
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "");
    expect(buildInfo()).toEqual({ sha: null, date: null });
  });
});

describe("copyrightRange", () => {
  it("shows a single year while the build year is the founding year", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "2026-11-10T12:00:00Z");
    expect(copyrightRange()).toBe("2026");
  });

  it("extends the range to the build year and falls back to the clock", () => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "2028-01-02T00:00:00Z");
    expect(copyrightRange()).toBe("2026–2028");
    vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", "");
    expect(copyrightRange(new Date("2027-06-01T00:00:00Z"))).toBe("2026–2027");
  });
});
