import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildPageMetadata(locale, "/privacy", {
    title: t("title"),
    description: t("lead"),
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <PageSection>
        <div className="card p-6">
          <p className="text-text-secondary">{t("placeholder")}</p>
        </div>
      </PageSection>
    </>
  );
}
