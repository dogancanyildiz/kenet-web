import { getTranslations } from "next-intl/server";
import { BrandMark } from "@/components/brand/brand-mark";
import { buildInfo, copyrightRange } from "@/lib/build-info";
import { site } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const build = buildInfo();
  const range = copyrightRange();

  return (
    <footer className="mt-16 border-t border-rule py-8 text-sm text-text-secondary">
      <div className="page-shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <BrandMark size={20} />
          <span>
            © {range} {site.ownerName}. {t("rights")}
          </span>
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a
              href={site.ownerUrl}
              rel="noopener noreferrer"
              className="prose-link"
            >
              {t("madeBy", { name: site.ownerName })}
            </a>
          </li>
          <li>
            <a
              href={site.appRepoUrl}
              rel="noopener noreferrer"
              className="prose-link"
            >
              {t("source")}
            </a>
          </li>
          {build.sha && build.date ? (
            <li className="text-text-tertiary">
              {t("build", { sha: build.sha, date: build.date.slice(0, 10) })}
            </li>
          ) : null}
        </ul>
      </div>
    </footer>
  );
}
