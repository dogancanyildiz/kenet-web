import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");

  return (
    <header className="site-header sticky top-0 z-10 border-b border-rule py-3">
      <div className="page-shell flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${tBrand("name")}: ${t("home")}`}
          className="flex min-h-11 items-center gap-2 rounded-control text-[17px] font-semibold"
        >
          <BrandMark size={24} />
          <span>{tBrand("name")}</span>
        </Link>
        <nav aria-label={t("primary")} className="flex items-center gap-1">
          <Link
            href="/privacy"
            className="flex min-h-11 items-center rounded-control px-3 text-sm font-medium text-text-secondary hover:bg-well hover:text-text"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/support"
            className="flex min-h-11 items-center rounded-control px-3 text-sm font-medium text-text-secondary hover:bg-well hover:text-text"
          >
            {t("support")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
