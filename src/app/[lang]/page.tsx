import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/lib/route-params";
import { buildPageMetadata } from "@/lib/seo";
import { PageSection } from "@/components/layout/page-section";
import { Hero } from "@/components/home/hero";
import { Mechanism } from "@/components/home/mechanism";
import { Promises } from "@/components/home/promises";
import { Screens } from "@/components/home/screens";
import { Vault } from "@/components/home/vault";
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

  const phones = [
    {
      srcLight: "/screens/today-light.webp",
      srcDark: "/screens/today-dark.webp",
      alt: t("screenTodayAlt"),
      caption: t("screenToday"),
    },
    {
      srcLight: "/screens/tasks-light.webp",
      srcDark: "/screens/tasks-dark.webp",
      alt: t("screenTasksAlt"),
      caption: t("screenTasksList"),
    },
    {
      srcLight: "/screens/kanban-light.webp",
      srcDark: "/screens/kanban-dark.webp",
      alt: t("screenKanbanAlt"),
      caption: t("screenTasksKanban"),
    },
  ] as const;

  return (
    <>
      <PageSection as="header" top="pt-10 sm:pt-14 lg:pt-20">
        <Hero
          title={t("title")}
          lead={t("lead")}
          platformsShort={t("platformsShort")}
          storeBadge={t("storeBadge")}
          storeBadgeSoon={t("storeBadgeSoon")}
          phoneAlt={t("phoneAlt")}
        />
      </PageSection>

      <PageSection>
        <Mechanism
          label={t("howLabel")}
          title={t("howTitle")}
          wroteLabel={t("mechWrote")}
          sawLabel={t("mechSaw")}
          fileLabel={t("mechFile")}
          modeEvent={t("mechModeEvent")}
          modeTask={t("mechModeTask")}
          time={t("mechTime")}
          rawLine={t("mechRaw")}
          sawPrefix={t("mechSawPrefix")}
          person={t("mechPerson")}
          sawBetween={t("mechSawBetween")}
          place={t("mechPlace")}
          placeSuffix={t("mechPlaceSuffix")}
          sawRest={t("mechSawRest")}
          fileLine={t("mechFileLine")}
          fileNote={t("mechFileNote")}
          quickEntrySr={t("mechQuickEntrySr")}
          fileCodeLabel={t("mechFileCodeLabel")}
        />
      </PageSection>

      <PageSection>
        <Promises
          label={t("promisesLabel")}
          title={t("promisesTitle")}
          items={promises}
        />
      </PageSection>

      <PageSection>
        <Screens
          label={t("screensLabel")}
          title={t("screensTitle")}
          phones={phones}
          macAlt={t("macAlt")}
          macCaption={t("macCaption")}
        />
      </PageSection>

      <PageSection>
        <Vault
          label={t("vaultLabel")}
          title={t("vaultTitle")}
          note={t("vaultNote")}
          treeSelected={t("vaultTreeSelected")}
          treePeople={t("vaultTreePeople")}
          treePlaces={t("vaultTreePlaces")}
          treeTemplates={t("vaultTreeTemplates")}
          treeApp={t("vaultTreeApp")}
          fileLabel={t("vaultFileLabel")}
          lines={[
            t("vaultLine1"),
            t("vaultLine2"),
            t("vaultLine3"),
            t("vaultLine4"),
            t("vaultLine5"),
            t("vaultLine6"),
            t("vaultLine7"),
            t("vaultLine8"),
            t("vaultLine9"),
            t("vaultLine10"),
            t("vaultLine11"),
            t("vaultLine12"),
            t("vaultLine13"),
            t("vaultLine14"),
          ]}
        />
      </PageSection>

      <PageSection>
        <Closing
          line={t("closingLine")}
          note={t("closingNote")}
          storeBadge={t("storeBadge")}
          storeBadgeSoon={t("storeBadgeSoon")}
        />
      </PageSection>
    </>
  );
}
