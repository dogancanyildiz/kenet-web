// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import {
  THEME_BOOT_SCRIPT,
  THEME_STORAGE_KEY,
  applyThemeChoice,
  nextThemeChoice,
  readThemeChoice,
  resolveTheme,
  writeThemeChoice,
} from "@/lib/theme";

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-js");
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

function runBoot() {
  // The inline <head> script, executed as the browser would.
  new Function(THEME_BOOT_SCRIPT)();
}

describe("boot script", () => {
  it("pins a stored light or dark choice on <html>", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    runBoot();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("leaves the system in charge for no value or an unknown one", () => {
    runBoot();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    runBoot();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("survives blocked storage", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("SecurityError");
      },
    });
    try {
      expect(runBoot).not.toThrow();
      expect(readThemeChoice(null)).toBe("system");
    } finally {
      Object.defineProperty(window, "localStorage", original!);
    }
  });

  it("is plain ES5 with no em dash", () => {
    expect(THEME_BOOT_SCRIPT).not.toMatch(/=>|\bconst\b|\blet\b|`/);
    expect(THEME_BOOT_SCRIPT).not.toContain("—");
  });
});

describe("boot script while parsing", () => {
  it("re-points screenshot sources as they arrive, like applyThemeChoice", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    runBoot();
    expect(document.documentElement.hasAttribute("data-js")).toBe(true);
    document.body.innerHTML = `
      <picture><source media="(prefers-color-scheme: dark)" srcset="/d.webp"><img src="/l.webp" alt=""></picture>
      <picture><source media="(min-width: 800px)" srcset="/w.webp"><img src="/n.webp" alt=""></picture>`;
    await Promise.resolve();
    const boot = [...document.querySelectorAll("source")].map((s) => [
      s.getAttribute("media"),
      s.getAttribute("data-scheme-media"),
    ]);
    expect(boot[0]).toEqual(["not all", "(prefers-color-scheme: dark)"]);

    // Same result as the client-side function on fresh markup.
    document.body.innerHTML = document.body.innerHTML.replace(
      /media="not all" data-scheme-media="[^"]*"/,
      'media="(prefers-color-scheme: dark)"'
    );
    applyThemeChoice(document, "light");
    const client = [...document.querySelectorAll("source")].map((s) => [
      s.getAttribute("media"),
      s.getAttribute("data-scheme-media"),
    ]);
    expect(client).toEqual(boot);
  });

  it("stops watching once the document is parsed", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    runBoot();
    document.dispatchEvent(new Event("DOMContentLoaded"));
    document.body.innerHTML = `<picture><source media="(prefers-color-scheme: dark)" srcset="/d.webp"></picture>`;
    await Promise.resolve();
    expect(document.querySelector("source")!.getAttribute("media")).toBe(
      "(prefers-color-scheme: dark)"
    );
  });

  it("marks data-js even when nothing is pinned", () => {
    runBoot();
    expect(document.documentElement.hasAttribute("data-js")).toBe(true);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});

describe("choice", () => {
  it("resolves system to the system appearance", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("flips what is on screen and drops the pin when it matches the system", () => {
    // Light system: system -> dark -> back to system.
    expect(nextThemeChoice("system", false)).toBe("dark");
    expect(nextThemeChoice("dark", false)).toBe("system");
    // Dark system: system -> light -> back to system.
    expect(nextThemeChoice("system", true)).toBe("light");
    expect(nextThemeChoice("light", true)).toBe("system");
    // A pin that already matches the system still flips.
    expect(nextThemeChoice("dark", true)).toBe("light");
  });

  it("stores light and dark, and removes the key for system", () => {
    writeThemeChoice(localStorage, "light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readThemeChoice(localStorage)).toBe("light");
    writeThemeChoice(localStorage, "system");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("swallows storage errors", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readThemeChoice(broken)).toBe("system");
    expect(() => writeThemeChoice(broken, "dark")).not.toThrow();
  });
});

describe("applyThemeChoice", () => {
  function setUp() {
    document.head.innerHTML = `
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f3f3f6">
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e0f11">`;
    document.body.innerHTML = `
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="/a-dark.webp">
        <img src="/a-light.webp" alt="">
      </picture>
      <picture>
        <source media="(min-width: 800px)" srcset="/wide.webp">
        <img src="/narrow.webp" alt="">
      </picture>`;
    return {
      lightMeta: document.querySelector('meta[content="#f3f3f6"]')!,
      darkMeta: document.querySelector('meta[content="#0e0f11"]')!,
      darkSource: document.querySelector('source[srcset="/a-dark.webp"]')!,
      other: document.querySelector('source[srcset="/wide.webp"]')!,
    };
  }

  it("pinned dark forces the dark sources and theme-color on", () => {
    const el = setUp();
    applyThemeChoice(document, "dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(el.darkSource.getAttribute("media")).toBe("all");
    expect(el.darkMeta.getAttribute("media")).toBe("all");
    expect(el.lightMeta.getAttribute("media")).toBe("not all");
  });

  it("pinned light turns the dark sources off", () => {
    const el = setUp();
    applyThemeChoice(document, "light");
    expect(el.darkSource.getAttribute("media")).toBe("not all");
    expect(el.lightMeta.getAttribute("media")).toBe("all");
  });

  it("system restores the original queries after any pin", () => {
    const el = setUp();
    applyThemeChoice(document, "dark");
    applyThemeChoice(document, "light");
    applyThemeChoice(document, "system");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(el.darkSource.getAttribute("media")).toBe(
      "(prefers-color-scheme: dark)"
    );
    expect(el.lightMeta.getAttribute("media")).toBe(
      "(prefers-color-scheme: light)"
    );
  });

  it("leaves sources that are not theme switches alone", () => {
    const el = setUp();
    applyThemeChoice(document, "dark");
    expect(el.other.getAttribute("media")).toBe("(min-width: 800px)");
    expect(el.other.hasAttribute("data-scheme-media")).toBe(false);
  });
});
