import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { ReportCard } from "@/components/support/report-card";
import { FaqCard } from "@/components/support/faq-card";
import { PageSection } from "@/components/layout/page-section";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "support" });
  return buildPageMetadata(locale, "/support", {
    title: t("title"),
    description: t("lead"),
  });
}

export default async function SupportPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "support" });

  const channels = [
    {
      title: t("issuesTitle"),
      body: t("issuesBody"),
      href: site.appIssuesUrl,
      label: t("issuesLink"),
    },
    {
      title: t("contactTitle"),
      body: t("contactBody"),
      href: `${site.ownerUrl}/${locale === "tr" ? "iletisim" : "en/contact"}`,
      label: t("contactLink"),
    },
  ];

  const reportItems = [
    t("reportDevice"),
    t("reportSystem"),
    t("reportApp"),
    t("reportDid"),
    t("reportExpected"),
    t("reportHappened"),
    t("reportScreenshot"),
  ];

  const faqItems = [
    { question: t("faqVaultQ"), answer: t("faqVaultA") },
    { question: t("faqObsidianQ"), answer: t("faqObsidianA") },
    { question: t("faqBackupQ"), answer: t("faqBackupA") },
    { question: t("faqIcloudQ"), answer: t("faqIcloudA") },
  ];

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <PageSection>
        <h2 className="text-xl font-semibold">{t("channelsTitle")}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <li key={channel.title} className="card p-6">
              <h3 className="text-lg font-semibold">{channel.title}</h3>
              <p className="mt-2 leading-7 text-text-secondary">
                {channel.body}
              </p>
              <a
                href={channel.href}
                rel="noopener noreferrer"
                className="prose-link mt-4 inline-flex min-h-11 items-center font-medium"
              >
                {channel.label}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection>
        <h2 className="text-xl font-semibold">{t("reportTitle")}</h2>
        <div className="mt-4">
          <ReportCard
            intro={t("reportIntro")}
            items={reportItems}
            privacy={t("reportPrivacy")}
          />
        </div>
      </PageSection>
      <PageSection>
        <h2 className="text-xl font-semibold">{t("faqTitle")}</h2>
        <div className="mt-4">
          <FaqCard items={faqItems} />
        </div>
      </PageSection>
    </>
  );
}
