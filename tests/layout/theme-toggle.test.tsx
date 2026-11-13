// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadMessages } from "@/i18n/messages";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "@/components/layout/theme-toggle";

vi.mock("@/i18n/navigation", () => ({ usePathname: () => "/" }));

let systemDark = false;
beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("dark") ? systemDark : !systemDark,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  systemDark = false;
});

async function renderToggle(lang: "tr" | "en" = "tr") {
  const messages = await loadMessages(lang);
  render(
    <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
      <ThemeToggle />
    </NextIntlClientProvider>
  );
  return screen.getByRole("button", {
    name:
      lang === "tr"
        ? "Açık ve koyu tema arasında geç"
        : "Switch between light and dark theme",
  });
}

describe("theme toggle", () => {
  it("is a real button named by its action in the page language", async () => {
    const button = await renderToggle("en");
    expect(button).toHaveAttribute("type", "button");
  });

  it("on a light system pins dark, then goes back to following the system", async () => {
    const button = await renderToggle();
    fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    fireEvent.click(button);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("on a dark system pins light", async () => {
    systemDark = true;
    const button = await renderToggle();
    fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("follows a choice made in another tab", async () => {
    await renderToggle();
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_STORAGE_KEY })
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
