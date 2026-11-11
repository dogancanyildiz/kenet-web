// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";
import { Header } from "@/components/layout/header";

// Replaces next-intl's navigation wrapper so the render never needs an App
// Router context. The stand-in Link writes the locale into a data attribute,
// enough to tell which language each switcher link targets.
let pathname = "/";
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => pathname,
  Link: ({
    href,
    locale,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    locale?: string;
  }) => (
    <a href={href} data-locale={locale} {...props}>
      {children}
    </a>
  ),
}));

async function renderHeader(lang: AppLocale, path: string) {
  pathname = path;
  const messages = await loadMessages(lang);
  return render(
    <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
      <Header />
    </NextIntlClientProvider>
  );
}

describe("header navigation", () => {
  it("marks the current page with aria-current=page and nothing else", async () => {
    await renderHeader("tr", "/privacy");
    const nav = screen.getByRole("navigation", { name: "Ana gezinme" });
    expect(within(nav).getByRole("link", { name: "Gizlilik" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      within(nav).getByRole("link", { name: "Destek" })
    ).not.toHaveAttribute("aria-current");
  });

  it("marks no page link on the home page", async () => {
    await renderHeader("en", "/");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("keeps the page and language landmarks separate, not nested", async () => {
    await renderHeader("tr", "/");
    const primary = screen.getByRole("navigation", { name: "Ana gezinme" });
    const language = screen.getByRole("navigation", { name: "Dil" });
    expect(primary.contains(language)).toBe(false);
    expect(language.contains(primary)).toBe(false);
  });
});

describe("language switcher", () => {
  it.each([
    ["tr", "/support"],
    ["en", "/privacy"],
  ] as const)(
    "on %s %s links both languages to the same page, Turkish first",
    async (lang, path) => {
      await renderHeader(lang, path);
      const nav = screen.getByRole("navigation", {
        name: lang === "tr" ? "Dil" : "Language",
      });
      const links = within(nav).getAllByRole("link");
      expect(links.map((a) => a.getAttribute("data-locale"))).toEqual([
        "tr",
        "en",
      ]);
      for (const link of links) {
        expect(link).toHaveAttribute("href", path);
        expect(link).toHaveAttribute(
          "hrefLang",
          link.getAttribute("data-locale")
        );
        expect(link).toHaveAttribute("lang", link.getAttribute("data-locale"));
      }
    }
  );

  it("names each language in its own words and flags the active one", async () => {
    await renderHeader("en", "/");
    const nav = screen.getByRole("navigation", { name: "Language" });
    const turkish = within(nav).getByRole("link", { name: "Türkçe" });
    const english = within(nav).getByRole("link", { name: "English" });
    expect(english).toHaveAttribute("aria-current", "true");
    expect(turkish).not.toHaveAttribute("aria-current");
    // The visible code is decoration; the name comes from the sr-only text.
    expect(turkish.textContent).toContain("TR");
  });

  it("shows both languages at every width", async () => {
    await renderHeader("tr", "/");
    const nav = screen.getByRole("navigation", { name: "Dil" });
    for (const li of nav.querySelectorAll("li")) {
      expect(li.className).not.toMatch(/(^|\s)hidden(\s|$)/);
    }
  });
});
