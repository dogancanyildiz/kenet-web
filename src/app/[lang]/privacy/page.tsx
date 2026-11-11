import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import {
  DataAccessList,
  type DataAccessRow,
} from "@/components/privacy/data-access-list";
import { PrivacySection } from "@/components/privacy/privacy-section";
import { PrivacyToc } from "@/components/privacy/privacy-toc";
import { bulletListClass } from "@/components/ui/bullet-list";

type PageProps = { params: Promise<{ lang: string }> };

/**
 * Date of the policy text in force. Change it together with the text; the
 * page formats it per locale. Midnight UTC so the day never shifts.
 */
const UPDATED = "2026-11-11";

const listClass = `${bulletListClass} grid gap-2 [&:not(:first-child)]:mt-4`;

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

  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${UPDATED}T00:00:00Z`));

  // Numbered keys instead of an array: the message test requires every key
  // to appear as a literal in the source. The row count is fixed.
  const rows: DataAccessRow[] = [
    {
      data: t("row1Data"),
      purpose: t("row1Purpose"),
      where: t("row1Where"),
      control: t("row1Control"),
    },
    {
      data: t("row2Data"),
      purpose: t("row2Purpose"),
      where: t("row2Where"),
      control: t("row2Control"),
    },
    {
      data: t("row3Data"),
      purpose: t("row3Purpose"),
      where: t("row3Where"),
      control: t("row3Control"),
    },
    {
      data: t("row4Data"),
      purpose: t("row4Purpose"),
      where: t("row4Where"),
      control: t("row4Control"),
    },
    {
      data: t("row5Data"),
      purpose: t("row5Purpose"),
      where: t("row5Where"),
      control: t("row5Control"),
    },
    {
      data: t("row6Data"),
      purpose: t("row6Purpose"),
      where: t("row6Where"),
      control: t("row6Control"),
    },
    {
      data: t("row7Data"),
      purpose: t("row7Purpose"),
      where: t("row7Where"),
      control: t("row7Control"),
    },
    {
      data: t("row8Data"),
      purpose: t("row8Purpose"),
      where: t("row8Where"),
      control: t("row8Control"),
    },
    {
      data: t("row9Data"),
      purpose: t("row9Purpose"),
      where: t("row9Where"),
      control: t("row9Control"),
    },
    {
      data: t("row10Data"),
      purpose: t("row10Purpose"),
      where: t("row10Where"),
      control: t("row10Control"),
    },
  ];

  const summary = [t("summary1"), t("summary2"), t("summary3")];
  const notCollected = [
    t("notCollected1"),
    t("notCollected2"),
    t("notCollected3"),
    t("notCollected4"),
    t("notCollected5"),
  ];
  const site = [t("site1"), t("site2"), t("site3"), t("site4")];

  return (
    <>
      <PageHeader
        title={t("title")}
        lead={t("lead")}
        meta={t.rich("updated", {
          date: updated,
          time: (chunks) => <time dateTime={UPDATED}>{chunks}</time>,
        })}
      />
      <PageSection as="div">
        <div className="grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
          <PrivacyToc
            label={t("tocLabel")}
            items={[
              { id: "summary", title: t("summaryTitle") },
              { id: "data", title: t("dataTitle") },
              { id: "not-collected", title: t("notCollectedTitle") },
              { id: "site", title: t("siteTitle") },
              { id: "changes", title: t("changesTitle") },
            ]}
          />
          <div className="grid min-w-0 gap-10">
            <PrivacySection id="summary" title={t("summaryTitle")}>
              <ul className={listClass}>
                {summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </PrivacySection>

            <PrivacySection id="data" title={t("dataTitle")}>
              <p className="leading-7 text-text-secondary">{t("dataIntro")}</p>
              <DataAccessList
                rows={rows}
                labelledBy="data-title"
                labels={{
                  purpose: t("colPurpose"),
                  where: t("colWhere"),
                  control: t("colControl"),
                }}
              />
            </PrivacySection>

            <PrivacySection id="not-collected" title={t("notCollectedTitle")}>
              <p className="leading-7">{t("notCollectedIntro")}</p>
              <ul className={listClass}>
                {notCollected.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 leading-7 text-text-secondary">
                {t("notCollectedNote")}
              </p>
            </PrivacySection>

            <PrivacySection id="site" title={t("siteTitle")}>
              <ul className={listClass}>
                {site.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </PrivacySection>

            <PrivacySection id="changes" title={t("changesTitle")}>
              <p className="leading-7">{t("changesBody")}</p>
              <p className="mt-2 leading-7">
                {t.rich("contactBody", {
                  link: (chunks) => (
                    <Link
                      href="/support"
                      className="prose-link inline-flex min-h-11 items-center font-medium"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </PrivacySection>
          </div>
        </div>
      </PageSection>
    </>
  );
}
