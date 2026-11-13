"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const ITEMS = [
  { href: "/privacy", key: "privacy" },
  { href: "/support", key: "support" },
] as const;

/**
 * Primary navigation. Client side only for usePathname: with the pathnames
 * map it returns the internal template (`/privacy`), so the comparison is the
 * same in both locales. The current page gets aria-current="page"; its
 * underline comes from `.nav-link[aria-current]`.
 */
export function NavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <ul className="flex items-center">
      {ITEMS.map(({ href, key }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="nav-link px-2 hover:bg-well sm:px-3"
          >
            {t(key)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
