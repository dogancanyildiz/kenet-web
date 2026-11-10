import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { PageSection } from "@/components/layout/page-section";
import { Intro } from "@/components/home/intro";
import { Promises } from "@/components/home/promises";
import { HowItWorks } from "@/components/home/how-it-works";
import { Platforms } from "@/components/home/platforms";
import { Closing } from "@/components/home/closing";

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
  const steps = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];
  const platforms = [t("platformIphone"), t("platformIpad"), t("platformMac")];
  const mastheadItems = [
    t("mastheadItem1"),
    t("mastheadItem2"),
    t("mastheadItem3"),
  ] as const;

  return (
    <>
      <PageSection as="header" className="pt-16 sm:pt-24">
        <Intro
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
          mastheadItems={mastheadItems}
          storeBadge={t("storeBadge")}
          storeBadgeSoon={t("storeBadgeSoon")}
        />
      </PageSection>

      <PageSection>
        <Promises title={t("promisesTitle")} items={promises} />
      </PageSection>

      <PageSection>
        <HowItWorks title={t("howTitle")} steps={steps} />
      </PageSection>

      <PageSection>
        <Platforms
          title={t("platformsTitle")}
          platforms={platforms}
          note={t("platformsNote")}
        />
      </PageSection>

      <PageSection>
        <Closing
          title={t("closingTitle")}
          body={t("closingBody")}
          storeBadge={t("storeBadge")}
          storeBadgeSoon={t("storeBadgeSoon")}
        />
      </PageSection>
    </>
  );
}
