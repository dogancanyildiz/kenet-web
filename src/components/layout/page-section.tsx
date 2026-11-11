import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  as?: "section" | "header" | "div";
  className?: string;
  id?: string;
};

/**
 * One vertical band of the page, centred in the shell. The rhythm grows with
 * the viewport (48, 64, 80 px each side) so a phone does not scroll through
 * 160 px of empty paper between two sections.
 */
export function PageSection({
  children,
  as: Tag = "section",
  className = "",
  id,
}: PageSectionProps) {
  return (
    <Tag id={id} className={`py-12 sm:py-16 lg:py-20 ${className}`.trim()}>
      <div className="page-shell">{children}</div>
    </Tag>
  );
}
