import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";
import type { AppLocale, StaticPathname } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/** Public path of one static page in one locale, locale prefix included. */
export function pathnameForLocale(
  locale: AppLocale,
  href: StaticPathname
): string {
  return getPathname({ locale, href });
}
