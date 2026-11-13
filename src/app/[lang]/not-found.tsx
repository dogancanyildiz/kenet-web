import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";

/**
 * Inert while experimental.globalNotFound routes every 404 to
 * src/app/global-not-found.tsx. Kept as the non-experimental path: turn the
 * flag off and this file is the boundary again.
 */
export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <>
      <PageHeader
        eyebrow={t("code")}
        title={t("title")}
        lead={t("description")}
      />
      <PageSection>
        <Link
          href="/"
          className="prose-link inline-flex min-h-11 items-center font-medium"
        >
          {t("backHome")}
        </Link>
      </PageSection>
    </>
  );
}
