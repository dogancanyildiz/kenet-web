import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  as?: "section" | "header" | "div";
  className?: string;
};

/** One vertical band of the page, centred in the shell. */
export function PageSection({
  children,
  as: Tag = "section",
  className = "",
}: PageSectionProps) {
  return (
    <Tag className={`py-20 sm:py-24 ${className}`.trim()}>
      <div className="page-shell">{children}</div>
    </Tag>
  );
}
