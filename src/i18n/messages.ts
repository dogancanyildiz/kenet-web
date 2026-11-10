import type { AppLocale } from "./routing";

/**
 * One JSON file per page namespace under messages/<locale>/ so that two
 * people (or two agents) editing different pages never touch the same file.
 * common.json carries the shell: brand, nav, a11y, footer, notFound and the
 * site wide metadata. Add a file here and in tests/i18n/messages.test.ts
 * when a page gets its own namespace.
 */
export const MESSAGE_FILES = ["common", "home", "privacy", "support"] as const;

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
