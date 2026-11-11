import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SEARCH_AGENTS, TRAINING_AGENTS } from "@/lib/crawlers";

type Rule = {
  userAgent?: string | string[];
  allow?: unknown;
  disallow?: unknown;
};

function ruleFor(agent: string): Rule | undefined {
  const rules = robots().rules as Rule[];
  const named = rules.find(
    (rule) => Array.isArray(rule.userAgent) && rule.userAgent.includes(agent)
  );
  return named ?? rules.find((rule) => rule.userAgent === "*");
}

describe("robots.txt", () => {
  it("keeps every search and answer crawler open, /api/ closed", () => {
    expect([...SEARCH_AGENTS]).toEqual(
      expect.arrayContaining([
        "Googlebot",
        "Bingbot",
        "OAI-SearchBot",
        "PerplexityBot",
        "Claude-SearchBot",
      ])
    );
    for (const agent of SEARCH_AGENTS) {
      expect(ruleFor(agent), agent).toMatchObject({
        allow: "/",
        disallow: "/api/",
      });
    }
  });

  // Owner decision pending (docs/decisions.md): until then training tokens
  // keep the behaviour the site always had, open like everyone else.
  it("leaves the training tokens open until the owner decides", () => {
    for (const agent of TRAINING_AGENTS) {
      expect(ruleFor(agent), agent).toMatchObject({
        allow: "/",
        disallow: "/api/",
      });
    }
  });

  it("names every agent in one group only, and points at the sitemap", () => {
    const named = (robots().rules as Rule[]).flatMap((rule) =>
      Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]
    );
    expect(new Set(named).size).toBe(named.length);
    expect(robots().sitemap).toBe("https://kenet.app/sitemap.xml");
  });
});

describe("sitemap.xml", () => {
  const entries = sitemap();

  it("lists every page in both languages", () => {
    expect(entries.map((entry) => entry.url).sort()).toEqual(
      [
        "https://kenet.app/",
        "https://kenet.app/en",
        "https://kenet.app/gizlilik",
        "https://kenet.app/en/privacy",
        "https://kenet.app/destek",
        "https://kenet.app/en/support",
      ].sort()
    );
  });

  it("gives each entry tr, en and an x-default on the Turkish url", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages as Record<string, string>;
      expect(Object.keys(languages).sort()).toEqual(["en", "tr", "x-default"]);
      expect(languages["x-default"]).toBe(languages.tr);
      expect(Object.values(languages)).toContain(entry.url);
    }
  });

  it("claims no lastmod", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBeUndefined();
    }
  });
});

describe("share card file", () => {
  it("is a 1200x630 png under 8 MB", async () => {
    const buffer = readFileSync("public/og/kenet.png");
    const meta = await sharp(buffer).metadata();
    expect(meta.format).toBe("png");
    expect([meta.width, meta.height]).toEqual([1200, 630]);
    expect(buffer.length).toBeLessThan(8 * 1024 * 1024);
  });
});
