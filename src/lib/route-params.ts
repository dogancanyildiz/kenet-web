import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Awaits a `[lang]` route param and narrows it to a routed locale.
 * `dynamicParams = false` on the layout already rejects unknown segments;
 * this is the second line of defence that makes the return type honest.
 */
export async function resolveLocale(
  params: Promise<{ lang: string }>
): Promise<AppLocale> {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();
  return lang;
}
