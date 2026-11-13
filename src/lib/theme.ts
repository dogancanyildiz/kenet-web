/**
 * Site theme. By default the site follows the system appearance through
 * prefers-color-scheme. The header button can pin light or dark; the choice
 * lives in localStorage (never a cookie, never sent to the server) and in
 * <html data-theme>, which globals.css reads. Pinning the value the system
 * already shows stores nothing, so the site goes back to following it.
 */
export type ThemeChoice = "system" | "light" | "dark";
export type Theme = Exclude<ThemeChoice, "system">;

export const THEME_STORAGE_KEY = "kenet-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

/**
 * Runs inline in <head> before the first paint, so a pinned theme never
 * flashes the system one. Kept to plain ES5 and wrapped in try/catch:
 * storage can be blocked (private windows, disabled site data).
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var v=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(v==="light"||v==="dark")document.documentElement.setAttribute("data-theme",v)}catch(e){}})();`;

export function readThemeChoice(
  storage: Pick<Storage, "getItem"> | null
): ThemeChoice {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function writeThemeChoice(
  storage: Pick<Storage, "setItem" | "removeItem"> | null,
  choice: ThemeChoice
): void {
  try {
    if (choice === "system") storage?.removeItem(THEME_STORAGE_KEY);
    else storage?.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Blocked storage: the choice still holds for this page view.
  }
}

/** The theme on screen: the pinned one, or what the system asks for. */
export function resolveTheme(choice: ThemeChoice, systemDark: boolean): Theme {
  if (choice !== "system") return choice;
  return systemDark ? "dark" : "light";
}

/**
 * The button flips what is on screen. When the flip lands on the system's
 * own appearance the pin is dropped instead of stored.
 */
export function nextThemeChoice(
  choice: ThemeChoice,
  systemDark: boolean
): ThemeChoice {
  const next: Theme =
    resolveTheme(choice, systemDark) === "dark" ? "light" : "dark";
  const system: Theme = systemDark ? "dark" : "light";
  return next === system ? "system" : next;
}

/**
 * Applies a choice to the document: the data-theme attribute for the
 * stylesheet, and the media attribute of every theme-switched resource
 * (the dark <source> in each screenshot <picture>, the theme-color metas),
 * which CSS cannot reach. The original query is kept in
 * data-scheme-media so "system" restores it.
 */
export function applyThemeChoice(doc: Document, choice: ThemeChoice): void {
  const root = doc.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);

  const elements = doc.querySelectorAll<HTMLElement>(
    'source[media], meta[name="theme-color"][media]'
  );
  for (const element of elements) {
    let original = element.getAttribute("data-scheme-media");
    if (original === null) {
      original = element.getAttribute("media");
      if (original !== DARK_QUERY && original !== LIGHT_QUERY) continue;
      element.setAttribute("data-scheme-media", original);
    }
    const targets = original === DARK_QUERY ? "dark" : "light";
    const media =
      choice === "system" ? original : choice === targets ? "all" : "not all";
    if (element.getAttribute("media") !== media) {
      element.setAttribute("media", media);
    }
  }
}
