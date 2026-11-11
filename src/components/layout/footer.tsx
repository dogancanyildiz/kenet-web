import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { IconArrowUpRight } from "@/components/ui/icons";
import { buildInfo, copyrightRange } from "@/lib/build-info";
import { site } from "@/lib/site";

const columnLabel = "eyebrow";
const columnLink = "nav-link gap-1.5";

/**
 * Brand and maker on the left, two short link columns on the right, legal
 * line and build stamp in a bottom row. On a phone the columns sit side by
 * side under the brand block. Navigation links follow design rule 2
 * (secondary text, text colour on hover); the maker's name is a link inside
 * a sentence, so it keeps the prose underline.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const build = buildInfo();
  const range = copyrightRange();

  // The maker's site is already linked from the sentence on the left, so the
  // project column carries only the source and the bug report path.
  const external = [{ href: site.appRepoUrl, label: t("source") }];

  return (
    <footer className="mt-8 border-t border-rule text-sm text-text-secondary">
      <div className="page-shell grid gap-10 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16 sm:py-12">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-text">
            <BrandMark size={24} />
            <span>{tBrand("name")}</span>
          </p>
          <p className="mt-3 leading-6">
            {t.rich("madeBy", {
              name: site.ownerName,
              link: (chunks) => (
                <a
                  href={site.ownerUrl}
                  rel="noopener noreferrer"
                  className="prose-link"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-16">
          <nav aria-labelledby="footer-pages">
            <p id="footer-pages" className={columnLabel}>
              {t("pagesLabel")}
            </p>
            <ul className="mt-2">
              <li>
                <Link href="/" className={columnLink}>
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={columnLink}>
                  {tNav("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/support" className={columnLink}>
                  {tNav("support")}
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-project">
            <p id="footer-project" className={columnLabel}>
              {t("projectLabel")}
            </p>
            <ul className="mt-2">
              <li>
                {/* Bug reports go through the support page first: it lists
                    what to include and warns that GitHub issues are public. */}
                <Link
                  href={{ pathname: "/support", hash: "report" }}
                  className={columnLink}
                >
                  {t("issues")}
                </Link>
              </li>
              {external.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    rel="noopener noreferrer"
                    className={columnLink}
                  >
                    {item.label}
                    <IconArrowUpRight className="shrink-0 text-text-tertiary" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="page-shell flex flex-col gap-1 py-5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {range} {site.ownerName}. {t("rights")}
          </p>
          {build.sha && build.date ? (
            <p className="font-[family-name:var(--font-mono-stack)] text-[12px] text-text-tertiary tabular-nums">
              {t("build", { sha: build.sha, date: build.date.slice(0, 10) })}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
