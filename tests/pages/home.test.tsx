// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/routing";

vi.mock("next/image", () => ({
  default: (props: {
    alt: string;
    src: string;
    className?: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }) => {
    const { alt, src, className, width, height } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- test stand-in for next/image
      <img
        alt={alt}
        src={src}
        className={className}
        width={width}
        height={height}
      />
    );
  },
}));

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

  it("renders Turkish with one h1 and four statement h2s", async () => {
    await renderHome("tr");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Yaz; kim, nerede ve ne zaman kendiliğinden bağlansın."
    );

    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((node) => node.textContent)
    ).toEqual([
      "Sen yaz. Kişiyi, konumu ve zamanı Kenet bağlasın.",
      "Dosyalar hep senin.",
      "Her gün açılan ekran sade kalır; ayrıntı öteki sekmelerde.",
      "Obsidian ile aynı kasa. Dışa aktarma yok.",
    ]);

    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
    expect(screen.getAllByText("Yakında App Store'da")).toHaveLength(2);
    expect(screen.getByText("iPhone, iPad ve Mac için.")).toBeTruthy();
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
    ).toEqual([
      "You write. Kenet links the person, place and time.",
      "The files stay yours.",
      "The screen you open every day stays simple; detail lives in the other tabs.",
      "The same vault as Obsidian. No export.",
    ]);
    expect(screen.getAllByText("Coming soon to the App Store")).toHaveLength(2);
  });

  it("never nests a card inside a card", async () => {
    const { container } = await renderHome("tr");
    expect(container.querySelectorAll(".card").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".card .card")).toHaveLength(0);
  });

  it("keeps the place suffix outside the link-place span", async () => {
    const { container } = await renderHome("tr");
    const person = container.querySelectorAll(".link-person");
    const place = container.querySelectorAll(".link-place");
    expect(person).toHaveLength(1);
    expect(place).toHaveLength(1);
    expect(person[0]?.textContent).toBe("Ece Yalın");
    expect(place[0]?.textContent).toBe("Kadıköy");
    expect(place[0]?.nextElementSibling?.textContent).toBe("'de");
  });

  it("gives every image a non-empty alt and theme pair classes", async () => {
    const { container } = await renderHome("tr");
    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(0);
    }

    const lights = container.querySelectorAll("img.only-light");
    const darks = container.querySelectorAll("img.only-dark");
    expect(lights.length).toBe(darks.length);
    expect(lights.length).toBeGreaterThanOrEqual(4);
  });

  it("marks any external link noopener noreferrer", async () => {
    const { container } = await renderHome("tr");
    for (const link of container.querySelectorAll("a[href^='http']")) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
