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
    loading?: "eager" | "lazy";
    width?: number;
    height?: number;
  }) => {
    const { alt, src, className, width, height, loading } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- test stand-in for next/image
      <img
        alt={alt}
        src={src}
        className={className}
        width={width}
        height={height}
        loading={loading}
      />
    );
  },
  getImageProps: ({
    alt,
    src,
    width,
    height,
    loading,
  }: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    loading?: "eager" | "lazy";
  }) => ({
    props: { alt, src, srcSet: src, width, height, loading },
  }),
}));

// Records the hero's per-scheme preloads; the real react-dom keeps the rest.
const preloadCalls: Array<
  [string, { media?: string; fetchPriority?: string }]
> = [];
vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    preload: (
      href: string,
      options: { media?: string; fetchPriority?: string }
    ) => {
      preloadCalls.push([href, options]);
    },
  };
});

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
    expect(person[0]?.textContent).toBe("Ece");
    expect(place[0]?.textContent).toBe("Kadıköy");
    expect(place[0]?.nextSibling?.textContent).toBe("'de");
  });

  it("uses picture with a dark source and a single matching img", async () => {
    const { container } = await renderHome("tr");
    const pictures = [...container.querySelectorAll("picture")];
    expect(pictures.length).toBeGreaterThanOrEqual(4);

    for (const picture of pictures) {
      const source = picture.querySelector('source[media*="dark"]');
      const img = picture.querySelector("img");
      expect(source).toBeTruthy();
      expect(img).toBeTruthy();
      const darkSet =
        source?.getAttribute("srcset") ?? source?.getAttribute("srcSet") ?? "";
      const lightSet =
        img?.getAttribute("srcset") ??
        img?.getAttribute("srcSet") ??
        img?.getAttribute("src") ??
        "";
      expect(darkSet).toMatch(/-dark/);
      expect(lightSet).toMatch(/-light/);
    }

    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(0);
    }

    const mac = images.find((img) =>
      (img.getAttribute("src") ?? "").includes("mac-kanban")
    );
    expect(mac).toBeTruthy();

    // One high priority, eagerly loaded image (the hero); every other
    // screenshot loads lazily.
    const high = images.filter(
      (img) => img.getAttribute("fetchpriority") === "high"
    );
    expect(high).toHaveLength(1);
    expect(high[0]!.getAttribute("src")).toContain("today-light");
    expect(high[0]!.getAttribute("loading")).toBe("eager");
    const rest = images.filter((img) => img !== high[0]);
    for (const img of rest) {
      expect(img.getAttribute("loading"), img.getAttribute("src") ?? "").toBe(
        "lazy"
      );
    }
  });

  it("preloads the hero once per colour scheme, each behind its media query", async () => {
    preloadCalls.length = 0;
    await renderHome("tr");
    const byMedia = Object.fromEntries(
      preloadCalls.map(([href, options]) => [options.media, href])
    );
    expect(preloadCalls).toHaveLength(2);
    expect(byMedia["(prefers-color-scheme: dark)"]).toContain("today-dark");
    expect(byMedia["(prefers-color-scheme: light)"]).toContain("today-light");
    for (const [, options] of preloadCalls) {
      expect(options.fetchPriority).toBe("high");
    }
  });

  it("gives every English image a non-empty alt", async () => {
    const { container } = await renderHome("en");
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(0);
    }
  });

  it("renders English vault sample lines, not Turkish copy", async () => {
    const { container } = await renderHome("en");
    expect(container.textContent).toContain(
      "Send the offer to [[Ahmet Yılmaz]]"
    );
    expect(container.textContent).toContain(
      "Talked through the offer with [[Ahmet Yılmaz|Ahmet]] at [[Kadıköy Ofis]]"
    );
    expect(container.textContent).toContain("Dinner with [[Elif]]");
    expect(container.textContent).not.toContain("'a teklifi gönder");
  });

  it("marks any external link noopener noreferrer", async () => {
    const { container } = await renderHome("tr");
    for (const link of container.querySelectorAll("a[href^='http']")) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
