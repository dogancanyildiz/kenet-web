import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { PageSection } from "@/components/layout/page-section";
import { StoreBadge } from "@/components/store-badge";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata(locale, "/", {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const promises = [
    { title: t("promise1Title"), body: t("promise1Body") },
    { title: t("promise2Title"), body: t("promise2Body") },
    { title: t("promise3Title"), body: t("promise3Body") },
  ];
  const principles = [t("principle1"), t("principle2"), t("principle3")];

  return (
    <>
      <PageSection as="header" className="pt-16 sm:pt-24">
        <p className="text-sm font-medium text-text-secondary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
          {t("lead")}
        </p>
        <div className="mt-8">
          <StoreBadge label={t("storeBadge")} soonLabel={t("storeBadgeSoon")} />
        </div>
      </PageSection>

      <PageSection>
        <h2 className="text-sm font-medium text-text-secondary">
          {t("promisesTitle")}
        </h2>
        <ul className="mt-3 grid gap-4 sm:grid-cols-3">
          {promises.map((promise) => (
            <li key={promise.title} className="card p-6">
              <h3 className="text-lg font-semibold">{promise.title}</h3>
              <p className="mt-2 leading-7 text-text-secondary">
                {promise.body}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection>
        <h2 className="text-sm font-medium text-text-secondary">
          {t("principlesTitle")}
        </h2>
        <ol className="card mt-3 divide-y divide-rule">
          {principles.map((principle, index) => (
            <li key={principle} className="flex gap-4 px-6 py-4">
              <span className="w-6 shrink-0 font-semibold text-accent tabular-nums">
                {index + 1}
              </span>
              <span className="leading-7">{principle}</span>
            </li>
          ))}
        </ol>
      </PageSection>
    </>
  );
}
