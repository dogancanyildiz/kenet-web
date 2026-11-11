import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { ReportCard } from "@/components/support/report-card";
import { FaqCard } from "@/components/support/faq-card";
import { PageSection } from "@/components/layout/page-section";
import { IconArrowUpRight } from "@/components/ui/icons";

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
        <SectionHeading title={t("channelsTitle")} />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <li key={channel.title} className="card flex flex-col p-6">
              <h3 className="text-lg font-semibold">{channel.title}</h3>
              <p className="mt-2 flex-1 leading-7 text-text-secondary">
                {channel.body}
              </p>
              <a
                href={channel.href}
                rel="noopener noreferrer"
                className="prose-link mt-4 inline-flex min-h-11 items-center gap-1.5 self-start font-medium"
              >
                {channel.label}
                <IconArrowUpRight className="shrink-0 text-text-secondary" />
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="report">
        <SectionHeading title={t("reportTitle")} />
        <div className="mt-6">
          <ReportCard
            intro={t("reportIntro")}
            items={reportItems}
            privacy={t("reportPrivacy")}
          />
        </div>
      </PageSection>
      <PageSection>
        <SectionHeading title={t("faqTitle")} />
        <div className="mt-6">
          <FaqCard items={faqItems} />
        </div>
      </PageSection>
    </>
  );
}
