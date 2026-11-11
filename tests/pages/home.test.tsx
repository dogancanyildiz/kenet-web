// @vitest-environment jsdom
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, createTranslator } from "next-intl";
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

// The client Link reads the current pathname for its active state; there is
// no router in jsdom.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
  redirect: () => {},
  permanentRedirect: () => {},
}));

describe("home page", () => {
  let HomePage: typeof import("@/app/[lang]/page").default;

  beforeAll(async () => {
    ({ default: HomePage } = await import("@/app/[lang]/page"));
  });

  async function renderHome(lang: AppLocale) {
    const tree = await HomePage({ params: Promise.resolve({ lang }) });
    const messages = await loadMessages(lang);
    return render(
      <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
        {tree}
      </NextIntlClientProvider>
    );
  }

  it("embeds the SoftwareApplication graph as JSON-LD", async () => {
    for (const lang of ["tr", "en"] as const) {
      const { container, unmount } = await renderHome(lang);
      const scripts = container.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      expect(scripts).toHaveLength(1);
      const graph = JSON.parse(scripts[0]?.textContent ?? "")["@graph"];
      const types = graph.map((node: { "@type": string }) => node["@type"]);
      expect(types).toContain("SoftwareApplication");
      // WebSite only on the Turkish root, where Google reads the site name.
      expect(types.includes("WebSite")).toBe(lang === "tr");
      unmount();
    }
  });

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

    const tablet = images.find((img) =>
      (img.getAttribute("src") ?? "").includes("ipad-person-light")
    );
    expect(tablet).toBeTruthy();
    expect(tablet?.closest('[data-device="tablet"]')).toBeTruthy();

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

  it("shows the hero phone, four store-style phone tiles and one iPad", async () => {
    const { container } = await renderHome("tr");
    expect(container.querySelectorAll('[data-device="phone"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-device="tablet"]')).toHaveLength(
      1
    );
    const tiles = [...container.querySelectorAll("figure")].filter((figure) =>
      figure.querySelector('[data-device="phone"]')
    );
    expect(
      tiles.map((tile) => tile.querySelector("figcaption p")?.textContent)
    ).toEqual([
      "Kişinin geçmişi tek sayfada",
      "Kişiler ve konumlar",
      "Görevler Kanban'da da",
      "Hedefe miktarla ilerle",
    ]);
  });

  it("references only screenshots that exist, and every screenshot is used", async () => {
    const { container } = await renderHome("tr");
    const used = new Set<string>();
    for (const node of container.querySelectorAll("img, source")) {
      for (const attr of ["src", "srcset"]) {
        const value = node.getAttribute(attr);
        if (value?.startsWith("/screens/")) used.add(value.slice(9));
      }
    }
    const files = readdirSync(join(process.cwd(), "public/screens")).filter(
      (file) => file.endsWith(".webp")
    );
    expect([...used].sort()).toEqual([...files].sort());
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

  it("wraps the file samples instead of scrolling them", async () => {
    const { container } = await renderHome("tr");
    const blocks = container.querySelectorAll("pre");
    expect(blocks).toHaveLength(2);
    for (const pre of blocks) {
      // Wrapped text never scrolls, so no tab stop and no unrolled label.
      expect(pre.className).toContain("whitespace-pre-wrap");
      expect(pre.className).not.toContain("overflow-x-auto");
      expect(pre.hasAttribute("tabindex")).toBe(false);
      expect(pre.hasAttribute("aria-label")).toBe(false);
      // The name lives on the enclosing figure.
      const figure = pre.closest("figure");
      expect(figure?.querySelector("figcaption")?.textContent).toMatch(
        /^(Örnek gün dosyası|Dosyadaki örnek satır)$/
      );
    }
  });

  it("shows the coming-soon store entry as text, not as a control", async () => {
    const { container } = await renderHome("tr");
    for (const soon of screen.getAllByText("Yakında App Store'da")) {
      expect(soon.closest("a, button")).toBeNull();
      expect(soon.className).not.toMatch(/\b(border|bg-)/);
    }
    expect(container.querySelector("[aria-disabled]")).toBeNull();
  });

  it("marks any external link noopener noreferrer", async () => {
    const { container } = await renderHome("tr");
    for (const link of container.querySelectorAll("a[href^='http']")) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it.each(["tr", "en"] as const)(
    "uses one definition (%s): the hero lead is the meta description, 25 to 45 words",
    async (lang) => {
      const messages = (await loadMessages(lang)) as {
        home: { lead: string };
        metadata: { defaultDescription: string };
      };
      const lead = messages.home.lead;
      expect(messages.metadata.defaultDescription).toBe(lead);
      const words = lead.split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(25);
      expect(words).toBeLessThanOrEqual(45);
      // What it is, no account and plain Markdown come before a search
      // result cuts the description.
      const head = lead.slice(0, 150);
      expect(head).toContain("Markdown");
      expect(head).toMatch(lang === "tr" ? /hesap/ : /account/);
    }
  );

  it("links the privacy policy from the proof strip, the first promise and the closing", async () => {
    const { container } = await renderHome("tr");
    const proof = screen.getByRole("list", { name: "Kısaca" });
    expect(proof.querySelectorAll("li")).toHaveLength(4);
    const links = [...container.querySelectorAll('a[href="/gizlilik"]')].map(
      (a) => a.textContent
    );
    expect(links).toEqual([
      "Uygulama veri toplamaz",
      "Gizlilik politikasını oku",
      "Gizlilik politikası",
    ]);
  });

  it("states the platform status and the interface language in the closing", async () => {
    await renderHome("en");
    expect(
      screen.getByText("Mac: reaches the store after iPhone and iPad.")
    ).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: "Privacy policy" })[0]
    ).toHaveAttribute("href", "/en/privacy");
  });

  it("never claims the vault always survives deleting the app", async () => {
    for (const lang of ["tr", "en"] as const) {
      const text = JSON.stringify(await loadMessages(lang));
      expect(text).not.toMatch(
        /uygulama silinse de dosyalar kalır|files stay even if the app is deleted/i
      );
    }
  });
});
