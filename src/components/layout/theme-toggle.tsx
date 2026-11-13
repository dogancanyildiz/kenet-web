"use client";

import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { IconMoon, IconSun } from "@/components/ui/icons";
import {
  THEME_STORAGE_KEY,
  applyThemeChoice,
  nextThemeChoice,
  readThemeChoice,
  writeThemeChoice,
} from "@/lib/theme";

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** The choice on <html>, which also covers blocked storage. */
function currentChoice() {
  const pinned = document.documentElement.getAttribute("data-theme");
  return pinned === "light" || pinned === "dark" ? pinned : "system";
}

/**
 * One button that flips light and dark. Which glyph shows comes from CSS
 * (.theme-toggle rules in globals.css read data-theme and the system
 * query), so server HTML and the first client render agree and nothing
 * shifts on hydration. The label names the action and stays the same in
 * both states.
 */
export function ThemeToggle() {
  const t = useTranslations("a11y");
  const pathname = usePathname();

  // Screenshot <source> elements and the theme-color metas are
  // server-rendered with the system query; re-point them after hydration and
  // after every navigation, which brings new ones. Layout effect so a page
  // reached by client navigation never paints the other theme's image.
  useLayoutEffect(() => {
    applyThemeChoice(document, currentChoice());
  }, [pathname]);

  // Another tab changed the choice.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
      applyThemeChoice(document, readThemeChoice(storage()));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const choice = nextThemeChoice(currentChoice(), systemDark());
    writeThemeChoice(storage(), choice);
    applyThemeChoice(document, choice);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("themeToggle")}
      title={t("themeToggle")}
      className="theme-toggle nav-link min-w-11 justify-center px-0 hover:bg-well"
    >
      <IconMoon className="theme-icon-moon" />
      <IconSun className="theme-icon-sun" />
    </button>
  );
}
