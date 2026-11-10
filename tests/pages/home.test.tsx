// @vitest-environment jsdom
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
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
    preload?: boolean;
    priority?: boolean;
    width?: number;
    height?: number;
  }) => {
    const { alt, src, className, width, height, preload, priority } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- test stand-in for next/image
      <img
        alt={alt}
        src={src}
        className={className}
        width={width}
        height={height}
        data-preload={preload || priority ? "true" : undefined}
      />
    );
  },
  getImageProps: ({
    alt,
    src,
    width,
    height,
    preload,
    priority,
  }: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    preload?: boolean;
    priority?: boolean;
  }) => ({
    props: {
      alt,
      src,
      srcSet: src,
      width,
      height,
      "data-preload": preload || priority ? "true" : undefined,
    },
  }),
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

    const preloaded = images.filter(
      (img) => img.getAttribute("data-preload") === "true"
    );
    expect(preloaded).toHaveLength(1);
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

  it("compiles .link-place with a dotted underline", () => {
    const roots = [
      join(process.cwd(), ".next", "static", "css"),
      join(process.cwd(), ".next", "static", "chunks"),
    ];
    const files: string[] = [];
    for (const root of roots) {
      try {
        for (const name of readdirSync(root)) {
          if (name.endsWith(".css")) files.push(join(root, name));
        }
      } catch {
        /* build output missing */
      }
    }
    if (files.length === 0) return;

    const css = files.map((file) => readFileSync(file, "utf8")).join("\n");
    // Compiled form may be the shorthand `underline dotted` or the longhand.
    expect(css).toMatch(
      /\.link-place[\s\S]{0,200}?(?:text-decoration(?:-style)?:\s*(?:underline\s+)?dotted|underline dotted)/
    );
  });
});
