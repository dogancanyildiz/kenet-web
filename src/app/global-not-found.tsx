import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import { pathnameForLocale } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeFromPathname } from "@/lib/locale-from-pathname";

/**
 * 404 document for every path the router cannot match. The root layout lives
 * at src/app/[lang]/layout.tsx, so a request that never resolves to a locale
 * has no layout: this file renders its own html and body. The locale comes
 * from x-pathname, which src/proxy.ts writes on every request.
 *
 * The links are plain anchors on purpose: this document and the locale layout
 * each render their own html element, so a client side navigation between them
 * would try to swap one document root for another.
 */
async function documentLocale(): Promise<AppLocale> {
  const pathname = (await headers()).get("x-pathname") ?? "";
  return localeFromPathname(pathname);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await documentLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });
  return { title: t("title") };
}

export default async function GlobalNotFound() {
  const locale = await documentLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });
  const otherLocale = routing.locales.find((other) => other !== locale);
  const other = otherLocale
    ? await getTranslations({ locale: otherLocale, namespace: "notFound" })
    : null;

  return (
    <html lang={locale}>
      <body className="flex min-h-dvh items-center font-sans text-text">
        <main className="page-shell py-16">
          <p className="text-sm font-medium text-text-secondary">{t("code")}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-text-secondary">
            {t("description")}
          </p>
          <ul className="mt-8 flex flex-wrap gap-6">
            <li>
              <a
                href={pathnameForLocale(locale, "/")}
                className="prose-link font-medium"
              >
                {t("backHome")}
              </a>
            </li>
            {other && otherLocale ? (
              <li>
                <a
                  href={pathnameForLocale(otherLocale, "/")}
                  hrefLang={otherLocale}
                  lang={otherLocale}
                  className="prose-link font-medium"
                >
                  {other("backHome")}
                </a>
              </li>
            ) : null}
          </ul>
        </main>
      </body>
    </html>
  );
}
