import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";
import { site } from "@/lib/site";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: AppLocale;
    namespace: string;
  }) => {
    const messages = await loadMessages(locale);
    return createTranslator({ locale, messages, namespace });
  },
}));

const { buildFaqPage, homeStructuredData, serializeJsonLd } =
  await import("@/lib/structured-data");

type Node = Record<string, unknown>;

function nodes(graph: Node): Node[] {
  return graph["@graph"] as Node[];
}

function byType(graph: Node, type: string): Node | undefined {
  return nodes(graph).find((node) => node["@type"] === type);
}

describe("home structured data", () => {
  it("names the site on the Turkish root only", async () => {
    const tr = await homeStructuredData("tr");
    const en = await homeStructuredData("en");
    expect(byType(tr, "WebSite")).toMatchObject({
      url: "https://kenet.app/",
      name: "Kenet",
      inLanguage: "tr",
    });
    expect(byType(en, "WebSite")).toBeUndefined();
  });

  it.each<AppLocale>(["tr", "en"])(
    "%s: describes the app with the visible home lead",
    async (locale) => {
      const graph = await homeStructuredData(locale);
      const home = (await loadMessages(locale)).home as { lead: string };
      expect(graph["@context"]).toBe("https://schema.org");
      expect(byType(graph, "SoftwareApplication")).toMatchObject({
        "@id": "https://kenet.app/#app",
        name: "Kenet",
        description: home.lead,
        operatingSystem: "iOS, iPadOS",
        url: locale === "tr" ? "https://kenet.app/" : "https://kenet.app/en",
        author: { "@id": "https://kenet.app/#developer" },
      });
    }
  );

  it("makes no claim the product cannot back yet", async () => {
    for (const locale of ["tr", "en"] as const) {
      const json = JSON.stringify(await homeStructuredData(locale));
      for (const forbidden of [
        "offers",
        "aggregateRating",
        "review",
        "price",
        "macOS",
      ]) {
        expect(json, forbidden).not.toContain(forbidden);
      }
    }
  });

  it("credits the owner as a Person, not a made up organization", async () => {
    const graph = await homeStructuredData("tr");
    expect(byType(graph, "Person")).toEqual({
      "@type": "Person",
      "@id": "https://kenet.app/#developer",
      name: site.ownerName,
      url: site.ownerUrl,
      sameAs: ["https://github.com/dogancanyildiz"],
    });
    expect(byType(graph, "Organization")).toBeUndefined();
  });

  it("lists screenshots that exist under public/", async () => {
    const { existsSync } = await import("node:fs");
    const app = byType(await homeStructuredData("en"), "SoftwareApplication");
    const urls = app?.screenshot as string[];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of [...urls, app?.image as string]) {
      const path = new URL(url).pathname;
      expect(existsSync(`public${path}`), path).toBe(true);
    }
  });
});

describe("FAQPage", () => {
  it("maps each visible question and answer one to one", () => {
    const page = buildFaqPage({
      locale: "en",
      url: "https://kenet.app/en/support",
      items: [{ question: "Q?", answer: "A." }],
    });
    expect(page).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://kenet.app/en/support",
      inLanguage: "en",
      mainEntity: [
        {
          "@type": "Question",
          name: "Q?",
          acceptedAnswer: { "@type": "Answer", text: "A." },
        },
      ],
    });
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so a value cannot close the script element", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({
      text: "</script><script>alert(1)</script>",
    });
  });
});
