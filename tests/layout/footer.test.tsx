// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";
import { site } from "@/lib/site";

let locale: AppLocale = "tr";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) =>
    createTranslator({
      locale,
      messages: await loadMessages(locale),
      namespace,
    }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

async function renderFooter(lang: AppLocale) {
  locale = lang;
  const { Footer } = await import("@/components/layout/footer");
  return render(await Footer());
}

describe("footer", () => {
  it("lists the three pages under a labelled navigation", async () => {
    await renderFooter("tr");
    const pages = screen.getByRole("navigation", { name: "Sayfalar" });
    expect(
      within(pages)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"))
    ).toEqual(["/", "/privacy", "/support"]);
  });

  it("sends every external link out with rel=noopener noreferrer", async () => {
    const { container } = await renderFooter("en");
    const external = [
      ...container.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]'),
    ];
    expect(external.map((a) => a.getAttribute("href")).sort()).toEqual(
      [site.appRepoUrl, site.appIssuesUrl, site.ownerUrl, site.ownerUrl].sort()
    );
    for (const a of external) {
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
      expect(a.hasAttribute("target")).toBe(false);
    }
  });

  it("links the maker's name inside the sentence", async () => {
    await renderFooter("tr");
    const maker = screen.getByRole("link", { name: site.ownerName });
    expect(maker).toHaveAttribute("href", site.ownerUrl);
    expect(maker.parentElement?.textContent).toContain("tarafından");
  });

  it("carries no em dash", async () => {
    const { container } = await renderFooter("en");
    expect(container.textContent).not.toContain("—");
  });
});
