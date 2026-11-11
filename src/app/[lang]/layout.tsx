import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";
import {
  absoluteUrl,
  OG_LOCALES,
  openGraphImage,
  smartAppBanner,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

// Params outside generateStaticParams are rejected before any layout runs:
// every route stays prerendered and an unmatched path gets the full
// global-not-found.tsx document.
export const dynamicParams = false;

// Mirrors --paper in globals.css for the browser chrome.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f11" },
  ],
};

// Namespaces the client tree reads through useTranslations. Kept narrow so
// server-only namespaces (home, privacy, support, metadata) never prefetch
// into every locale's client bundle.
const CLIENT_MESSAGE_NAMESPACES = ["nav", "brand", "a11y"] as const;

function pickMessages(
  messages: Record<string, unknown>,
  namespaces: readonly string[]
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const namespace of namespaces) {
    if (namespace in messages) picked[namespace] = messages[namespace];
  }
  return picked;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();

  const t = await getTranslations({ locale: lang, namespace: "metadata" });
  const image = await openGraphImage(lang);

  // Every page replaces openGraph and twitter through buildPageMetadata, and
  // the 404 is the global not-found document, which skips this layout. These
  // stay as a safety net for any future route that forgets its own metadata.
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: absoluteUrl(lang, "/"),
      locale: OG_LOCALES[lang],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      images: [{ url: image.url, alt: image.alt }],
    },
    ...smartAppBanner(site.appStoreUrl),
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();

  // Enables static rendering for this layout and everything below it.
  setRequestLocale(lang);

  const t = await getTranslations({ locale: lang, namespace: "a11y" });
  const messages = await getMessages();
  const clientMessages = pickMessages(messages, CLIENT_MESSAGE_NAMESPACES);

  return (
    <html lang={lang}>
      <body className="flex min-h-dvh flex-col font-sans text-text">
        <NextIntlClientProvider messages={clientMessages}>
          <a href="#main" className="skip-link">
            {t("skipToContent")}
          </a>
          <Header />
          <main
            id="main"
            tabIndex={-1}
            className="flex-1 pb-12 outline-none sm:pb-16 lg:pb-20"
          >
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
