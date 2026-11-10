"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * One link to the other locale's version of the current page. With a
 * `pathnames` map, usePathname returns the internal template (`/privacy`),
 * which is exactly what Link needs to localize.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("a11y");
  const target = routing.locales.find((other) => other !== locale);
  if (!target) return null;

  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      lang={target}
      aria-label={`${t("languageSwitcher")}: ${t("switchTo")}`}
      className="rounded-control px-3 py-2 text-sm font-medium text-text-secondary hover:bg-well hover:text-text"
    >
      {t("switchTo")}
    </Link>
  );
}
