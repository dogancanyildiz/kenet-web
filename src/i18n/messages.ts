import type { AppLocale } from "./routing";

/**
 * One JSON file per page namespace under messages/<locale>/ so that two
 * people (or two agents) editing different pages never touch the same file.
 * common.json carries the shell: brand, nav, a11y, footer, notFound and the
 * site wide metadata; seo.json carries the share card text. Add a file here
 * when a page gets its own namespace; tests/i18n/messages.test.ts reads this
 * list.
 */
export const MESSAGE_FILES = [
  "common",
  "home",
  "privacy",
  "support",
  "seo",
] as const;

export type MessageFile = (typeof MESSAGE_FILES)[number];

export async function loadMessages(
  locale: AppLocale
): Promise<Record<string, unknown>> {
  const parts = await Promise.all(
    MESSAGE_FILES.map(
      async (file) =>
        (await import(`../../messages/${locale}/${file}.json`))
          .default as Record<string, unknown>
    )
  );
  return Object.assign({}, ...parts) as Record<string, unknown>;
}
