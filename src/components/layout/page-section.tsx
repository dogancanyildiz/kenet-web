import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  as?: "section" | "header" | "div";
  className?: string;
  id?: string;
  /**
   * Replaces the default top padding. Two utilities on the same property do
   * not override each other by order in the class list, so a band that needs
   * a different top (the home hero) passes it here instead of in className.
   */
  top?: string;
};

const DEFAULT_TOP = "pt-16 sm:pt-20 lg:pt-24";

/**
 * One vertical band of the page, centred in the shell. Padding is one-sided
 * (top only), so the gap between two bands, and between a PageHeader and the
 * first band, is a single step: 64, 80, 96 px as the viewport grows. The space
 * after the last band comes from `main` in the locale layout.
 */
export function PageSection({
  children,
  as: Tag = "section",
  className = "",
  id,
  top = DEFAULT_TOP,
}: PageSectionProps) {
  return (
    <Tag id={id} className={`${top} ${className}`.trim()}>
      <div className="page-shell">{children}</div>
    </Tag>
  );
}
