// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";

vi.mock("next-intl/server", () => ({
  setRequestLocale: () => undefined,
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

describe("home page", () => {
  let HomePage: typeof import("@/app/[lang]/page").default;

  beforeAll(async () => {
    ({ default: HomePage } = await import("@/app/[lang]/page"));
  });

  async function renderHome(lang: AppLocale) {
    const tree = await HomePage({ params: Promise.resolve({ lang }) });
    return render(tree);
  }

  function headingLevels(): string[] {
    return [...document.querySelectorAll("h1, h2, h3")].map((node) =>
      node.tagName.toLowerCase()
    );
  }

  it("renders Turkish with one h1, then h2 sections and h3 cards", async () => {
    await renderHome("tr");

    const levels = headingLevels();
    expect(levels.filter((tag) => tag === "h1")).toHaveLength(1);
    expect(levels[0]).toBe("h1");
    expect(levels.slice(1).every((tag) => tag === "h2" || tag === "h3")).toBe(
      true
    );

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.map((node) => node.textContent)).toEqual([
      "Üç vaat",
      "Nasıl çalışır",
      "Platformlar",
      "Obsidian",
    ]);

    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(3);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Yaz; kim, nerede ve ne zaman kendiliğinden bağlansın."
    );
    expect(screen.getAllByText("Yakında App Store'da")).toHaveLength(2);
  });

  it("renders English with matching section structure", async () => {
    await renderHome("en");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Write; let who, where and when link themselves."
    );
    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((node) => node.textContent)
    ).toEqual(["Three promises", "How it works", "Platforms", "Obsidian"]);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getAllByText("Coming soon to the App Store")).toHaveLength(2);
  });

  it("exposes seven section cards and five how-it-works steps", async () => {
    const { container } = await renderHome("tr");

    expect(container.querySelectorAll(".card")).toHaveLength(7);

    const howHeading = screen.getByRole("heading", {
      level: 2,
      name: "Nasıl çalışır",
    });
    const howSection = howHeading.closest("section");
    expect(howSection).not.toBeNull();
    const steps = within(howSection as HTMLElement).getAllByRole("listitem");
    expect(steps).toHaveLength(5);
  });

  it("never nests a card inside a card", async () => {
    const { container } = await renderHome("tr");
    expect(container.querySelectorAll(".card").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".card .card")).toHaveLength(0);
  });
});
