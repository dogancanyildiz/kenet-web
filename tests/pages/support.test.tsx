// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import trMessages from "../../messages/tr/support.json";
import enMessages from "../../messages/en/support.json";

vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const messages = { tr: trMessages, en: enMessages };
  return {
    setRequestLocale: () => {},
    getTranslations: async ({
      locale,
      namespace,
    }: {
      locale: "tr" | "en";
      namespace: "support";
    }) => createTranslator({ locale, messages: messages[locale], namespace }),
  };
});

import SupportPage from "@/app/[lang]/support/page";

async function renderPage(lang: "tr" | "en") {
  const tree = await SupportPage({ params: Promise.resolve({ lang }) });
  return render(tree);
}

describe.each([
  ["tr", trMessages.support],
  ["en", enMessages.support],
] as const)("support page (%s)", (lang, m) => {
  it("has one h1 and h2s in order: channels, report, faq", async () => {
    const { container } = await renderPage(lang);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    const h2s = [...container.querySelectorAll("h2")].map((h) => h.textContent);
    expect(h2s).toEqual([m.channelsTitle, m.reportTitle, m.faqTitle]);
  });

  it("renders two channel cards with safe external links", async () => {
    const { container } = await renderPage(lang);
    expect(container.querySelectorAll("h3")).toHaveLength(2);
    const links = [...container.querySelectorAll("a")];
    expect(links).toHaveLength(2);
    for (const a of links) {
      expect(a.getAttribute("href")).toMatch(/^https:\/\//);
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("lists the report details and the privacy warning", async () => {
    const { container } = await renderPage(lang);
    // Scope to the section the "Hata bildirirken" heading introduces, so the
    // count does not depend on a style class or on the other lists.
    const heading = [...container.querySelectorAll("h2")].find(
      (h) => h.textContent === m.reportTitle
    );
    expect(heading).toBeDefined();
    expect(heading!.parentElement!.querySelectorAll("li")).toHaveLength(7);
    // Same accent markers as the privacy lists (shared bulletListClass).
    expect(heading!.parentElement!.querySelector("ul")!.className).toContain(
      "marker:text-accent"
    );
    // The footer's "report a bug" link lands on this anchor.
    expect(heading!.closest("section#report")).not.toBeNull();
    expect(container.textContent).toContain(m.reportPrivacy);
  });

  it("never nests a card inside a card", async () => {
    const { container } = await renderPage(lang);
    expect(container.querySelectorAll(".card").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".card .card")).toHaveLength(0);
  });

  it("renders four FAQ items as native details", async () => {
    const { container } = await renderPage(lang);
    const items = container.querySelectorAll("details");
    expect(items).toHaveLength(4);
    for (const d of items) {
      expect(d.querySelector("summary")?.textContent).toBeTruthy();
      expect(d.querySelector("p")?.textContent).toBeTruthy();
    }
  });

  it("carries no em dash and no mailto link", async () => {
    const { container } = await renderPage(lang);
    expect(container.textContent).not.toContain("—");
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});
