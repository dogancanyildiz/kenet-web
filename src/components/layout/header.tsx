import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavLinks } from "@/components/layout/nav-links";

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");

  return (
    <header className="site-header sticky top-0 z-10 border-b border-rule">
      <div className="page-shell flex h-[4.25rem] items-center justify-between gap-3">
        <Link
          href="/"
          aria-label={`${tBrand("name")}: ${t("home")}`}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-control text-[17px] font-semibold tracking-tight"
        >
          <BrandMark size={24} />
          <span>{tBrand("name")}</span>
        </Link>
        {/* Two landmarks side by side, not nested: pages, then language. */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <nav aria-label={t("primary")}>
            <NavLinks />
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
