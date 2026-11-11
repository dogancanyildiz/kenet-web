"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

/** Short code on screen, the language's own name for assistive technology. */
const LOCALES: Record<
  AppLocale,
  { code: string; nameKey: "localeTr" | "localeEn" }
> = {
  tr: { code: "TR", nameKey: "localeTr" },
  en: { code: "EN", nameKey: "localeEn" },
};

/**
 * Both languages side by side, Turkish first (it lives on the root). The
 * active one carries aria-current and the accent underline; the other links
 * to the same page in that language. With a `pathnames` map, usePathname
 * returns the internal template (`/privacy`), which is exactly what Link
 * needs to localize.
 *
 * Below 640 px only the other language shows: the header row has to hold the
 * mark, two page links and this switcher at 320 px without overflowing.
 */
export function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("a11y");
  const ordered = [
    routing.defaultLocale,
    ...routing.locales.filter((locale) => locale !== routing.defaultLocale),
  ];

  return (
    <nav aria-label={t("languageSwitcher")} className="flex items-center">
      <ul className="flex items-center">
        {ordered.map((locale, index) => {
          const isActive = locale === active;
          const { code, nameKey } = LOCALES[locale];
          return (
            <li
              key={locale}
              className={`items-center ${isActive ? "hidden sm:flex" : "flex"}`}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-3.5 w-px bg-line sm:block"
                />
              ) : null}
              <Link
                href={pathname}
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-current={isActive ? "true" : undefined}
                className="nav-link min-w-11 justify-center px-2 tracking-wide hover:bg-well"
              >
                <span aria-hidden="true">{code}</span>
                <span className="sr-only">{t(nameKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
