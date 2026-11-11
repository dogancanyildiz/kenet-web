import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Locks the response headers next.config.ts emits. The assertions read the
 * real config module, not a copy of the values.
 */
type HeaderEntry = { key: string; value: string };

async function loadHeaders(nodeEnv: "production" | "development") {
  vi.stubEnv("NODE_ENV", nodeEnv);
  const { default: nextConfig } = await import("../../next.config");
  const rules = await nextConfig.headers!();
  return {
    rules,
    forSource(source: string): HeaderEntry[] {
      const rule = rules.find((entry) => entry.source === source);
      if (!rule) throw new Error(`No header rule for ${source}`);
      return rule.headers;
    },
  };
}

function value(headers: HeaderEntry[], key: string): string | undefined {
  return headers.find((entry) => entry.key === key)?.value;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("static security headers", () => {
  it("sets the baseline headers on every path", async () => {
    const { forSource } = await loadHeaders("production");
    const headers = forSource("/:path*");

    expect(value(headers, "X-Content-Type-Options")).toBe("nosniff");
    expect(value(headers, "Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(value(headers, "X-Frame-Options")).toBe("DENY");
    expect(value(headers, "Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(value(headers, "Cross-Origin-Resource-Policy")).toBe("same-origin");
  });

  it("locks the csp directives that stop framing, plugins and eval", async () => {
    const { forSource } = await loadHeaders("production");
    const csp = value(forSource("/:path*"), "Content-Security-Policy") ?? "";

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("ws:");
  });
});

describe("strict transport security", () => {
  it("sends a one year hsts without preload in production", async () => {
    const { forSource } = await loadHeaders("production");
    const hsts = value(forSource("/:path*"), "Strict-Transport-Security");
    expect(hsts).toBe("max-age=31536000; includeSubDomains");
  });

  it("stays out of development so plain http localhost keeps working", async () => {
    const { forSource } = await loadHeaders("development");
    expect(value(forSource("/:path*"), "Strict-Transport-Security")).toBe(
      undefined
    );
  });
});

describe("caching", () => {
  it("gives html a short edge ttl instead of the framework's one year", async () => {
    const { forSource } = await loadHeaders("production");
    expect(value(forSource("/:path*"), "Cache-Control")).toBe(
      "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
    );
  });

  it("keeps the hashed build output immutable and the api uncached", async () => {
    const { forSource } = await loadHeaders("production");
    expect(value(forSource("/_next/static/:path*"), "Cache-Control")).toBe(
      "public, max-age=31536000, immutable"
    );
    expect(value(forSource("/api/:path*"), "Cache-Control")).toBe("no-store");
  });

  it("never marks an unhashed asset immutable", async () => {
    const { rules } = await loadHeaders("production");
    const cacheValues = rules
      .filter((rule) => rule.source !== "/_next/static/:path*")
      .flatMap((rule) => rule.headers)
      .filter((header) => header.key === "Cache-Control")
      .map((header) => header.value);
    expect(cacheValues.length).toBeGreaterThan(0);
    for (const cacheValue of cacheValues) {
      expect(cacheValue).not.toContain("immutable");
    }
  });

  it("lets other origins embed the icon files, and nothing else", async () => {
    const { forSource } = await loadHeaders("production");
    for (const source of ["/icon.svg", "/icon.png", "/apple-icon.png"]) {
      expect(value(forSource(source), "Cross-Origin-Resource-Policy")).toBe(
        "cross-origin"
      );
      expect(value(forSource(source), "Cache-Control")).toBe(
        "public, max-age=86400"
      );
    }
    expect(value(forSource("/:path*"), "Cross-Origin-Resource-Policy")).toBe(
      "same-origin"
    );
  });

  it("lets link previews embed the share card for a day", async () => {
    const { forSource } = await loadHeaders("production");
    const headers = forSource("/og/:path*");
    expect(value(headers, "Cross-Origin-Resource-Policy")).toBe("cross-origin");
    expect(value(headers, "Cache-Control")).toBe("public, max-age=86400");
  });
});
