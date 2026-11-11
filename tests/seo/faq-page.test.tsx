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

/**
 * The support page's FAQPage must describe exactly the questions a reader
 * sees in the <details> list: same count, same order, same words.
 */
describe.each(["tr", "en"] as const)("support FAQPage (%s)", (lang) => {
  it("matches the visible FAQ word for word", async () => {
    const tree = await SupportPage({ params: Promise.resolve({ lang }) });
    const { container } = render(tree);

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts).toHaveLength(1);
    const script = scripts[0]!;
    expect(script.getAttribute("src")).toBeNull();
    expect(script.innerHTML).not.toContain("<");

    const data = JSON.parse(script.textContent ?? "") as {
      "@type": string;
      inLanguage: string;
      url: string;
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(data["@type"]).toBe("FAQPage");
    expect(data.inLanguage).toBe(lang);
    expect(data.url).toBe(
      lang === "tr"
        ? "https://kenet.app/destek"
        : "https://kenet.app/en/support"
    );

    const visible = [...container.querySelectorAll("details")].map(
      (details) => {
        const question = details.querySelector("summary")?.textContent ?? "";
        const answer = (details.textContent ?? "").slice(question.length);
        return { question: question.trim(), answer: answer.trim() };
      }
    );
    expect(visible.length).toBeGreaterThan(0);
    expect(
      data.mainEntity.map((q) => ({
        question: q.name,
        answer: q.acceptedAnswer.text,
      }))
    ).toEqual(visible);
  });
});
