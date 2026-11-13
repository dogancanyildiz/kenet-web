import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  lead?: string;
  eyebrow?: string;
  /** One quiet line under the lead, e.g. the policy's last-updated date. */
  meta?: ReactNode;
};

/** Title block of a secondary page: optional eyebrow, h1, lead and meta. */
export function PageHeader({ title, lead, eyebrow, meta }: PageHeaderProps) {
  return (
    <header className="pt-12 sm:pt-16 lg:pt-20">
      <div className="page-shell">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1
          className={`text-[40px] leading-[1.1] font-semibold tracking-tight sm:text-5xl ${
            eyebrow ? "mt-2" : ""
          }`.trim()}
        >
          {title}
        </h1>
        {lead ? (
          <p className="measure mt-4 text-[18px] leading-7 text-text-secondary">
            {lead}
          </p>
        ) : null}
        {meta ? (
          <p className="mt-4 text-sm text-text-tertiary">{meta}</p>
        ) : null}
      </div>
    </header>
  );
}
