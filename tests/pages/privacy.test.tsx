// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider, createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";
import PrivacyPage from "@/app/[lang]/privacy/page";

// Vitest resolves next-intl/server to its client stub, which throws for
// every call. The page only needs a translator for an explicit locale, so
// the mock builds one from the real catalogs, the same files the request
// config loads.
vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: AppLocale;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: await loadMessages(locale),
      namespace,
    }),
}));

// The client Link reads the current pathname for its active state; there is
// no router in jsdom.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
  redirect: () => {},
  permanentRedirect: () => {},
}));

const ROW_COUNT = 10;

async function renderPage(lang: AppLocale) {
  const tree = await PrivacyPage({ params: Promise.resolve({ lang }) });
  const messages = await loadMessages(lang);
  return render(
    <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
      {tree}
    </NextIntlClientProvider>
  );
}

const cases = [
  {
    lang: "tr" as const,
    h1: "Gizlilik politikası",
    sections: [
      "Özet",
      "Uygulamanın eriştiği veriler",
      "Toplanmayan veriler",
      "Bu site",
      "Değişiklikler ve iletişim",
    ],
    updated: "Son güncelleme: 10 Kasım 2026",
    supportHref: "/destek",
  },
  {
    lang: "en" as const,
    h1: "Privacy policy",
    sections: [
      "Summary",
      "Data the app accesses",
      "Data not collected",
      "This site",
      "Changes and contact",
    ],
    updated: "Last updated: November 10, 2026",
    supportHref: "/en/support",
  },
];

describe.each(cases)("privacy page ($lang)", (c) => {
  it("has one h1 followed by the section h2s in the fixed order", async () => {
    const { container } = await renderPage(c.lang);
    const headings = [...container.querySelectorAll("h1, h2")].map((el) => [
      el.tagName,
      el.textContent,
    ]);

    expect(headings).toEqual([
      ["H1", c.h1],
      ...c.sections.map((title) => ["H2", title]),
    ]);
  });

  it("renders every section as its own card, never one inside another", async () => {
    const { container } = await renderPage(c.lang);
    const cards = [...container.querySelectorAll(".card")];

    expect(cards).toHaveLength(c.sections.length);
    for (const card of cards) {
      expect(card.querySelector(".card")).toBeNull();
      expect(card.tagName).toBe("SECTION");
    }
  });

  it("shows the last updated date written for the locale", async () => {
    await renderPage(c.lang);
    const time = document.querySelector("time");

    expect(time?.getAttribute("dateTime")).toBe("2026-11-10");
    expect(time?.parentElement?.textContent).toBe(c.updated);
  });

  it("lists every data row with its three answers", async () => {
    await renderPage(c.lang);
    const region = screen.getByRole("region", { name: c.sections[1] });
    const list = within(region).getByRole("list", { name: c.sections[1] });
    const rows = within(list).getAllByRole("listitem");

    expect(rows).toHaveLength(ROW_COUNT);
    for (const row of rows) {
      expect(within(row).getAllByRole("heading", { level: 3 })).toHaveLength(1);
      const answers = row.querySelectorAll("dd");
      expect(answers).toHaveLength(3);
      for (const answer of answers) {
        expect(answer.textContent?.trim().length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("links to the localized support page", async () => {
    await renderPage(c.lang);
    const region = screen.getByRole("region", { name: c.sections[4] });
    const link = within(region).getByRole("link");

    expect(link.getAttribute("href")).toBe(c.supportHref);
  });

  it("has a non empty value for every privacy message key", async () => {
    const messages = (await loadMessages(c.lang)) as {
      privacy: Record<string, string>;
    };
    const empty = Object.entries(messages.privacy)
      .filter(([, value]) => value.trim() === "")
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it("marks every external link noopener noreferrer", async () => {
    const { container } = await renderPage(c.lang);
    const external = [...container.querySelectorAll("a[href]")].filter((a) =>
      /^https?:\/\//.test(a.getAttribute("href") ?? "")
    );

    for (const a of external) {
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
