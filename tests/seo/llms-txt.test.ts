import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadMessages } from "@/i18n/messages";
import { routing, type StaticPathname } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * public/llms.txt (llmstxt.org): an H1, a > summary, plain text, then link
 * lists. Every product sentence in it must already be approved copy in
 * messages/en, so the file cannot say something the site does not.
 */
const text = readFileSync("public/llms.txt", "utf8");
const lines = text.split("\n");
const catalog = JSON.stringify(await loadMessages("en"));

describe("llms.txt", () => {
  it("follows the llmstxt.org outline", () => {
    expect(lines[0]).toBe("# Kenet");
    expect(lines.filter((line) => line.startsWith("# "))).toHaveLength(1);
    expect(lines.some((line) => line.startsWith("> "))).toBe(true);
    expect(text).toContain("\n## Pages\n");
  });

  it("summarises with the English home lead", async () => {
    const home = (await loadMessages("en")).home as { lead: string };
    expect(lines.find((line) => line.startsWith("> "))).toBe(`> ${home.lead}`);
  });

  it("states nothing about the product that messages/en does not", () => {
    const start = lines.findIndex((line) => line.startsWith("> ")) + 2;
    const sentences = lines[start]!.split(/(?<=\.)\s+/);
    expect(sentences.length).toBeGreaterThan(1);
    for (const sentence of sentences) {
      const approved = catalog.includes(sentence.replace(/"/g, '\\"'));
      expect(approved, `not in messages/en: ${sentence}`).toBe(true);
    }
  });

  it("links every page in both languages and the source repository", () => {
    const links = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(
      (match) => match[1]
    );
    for (const path of ["/", "/privacy", "/support"] as StaticPathname[]) {
      for (const locale of routing.locales) {
        expect(links).toContain(absoluteUrl(locale, path));
      }
    }
    expect(links).toContain(site.appRepoUrl);
  });

  it("carries no em dash", () => {
    expect(text).not.toContain("—");
  });
});
