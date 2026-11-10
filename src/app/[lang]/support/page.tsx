import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/layout/page-header";
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

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <PageSection>
        <ul className="grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <li key={channel.title} className="card p-6">
              <h2 className="text-lg font-semibold">{channel.title}</h2>
              <p className="mt-2 leading-7 text-text-secondary">
                {channel.body}
              </p>
              <a
                href={channel.href}
                rel="noopener noreferrer"
                className="prose-link mt-4 inline-block font-medium"
              >
                {channel.label}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
