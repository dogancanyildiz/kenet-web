type PageHeaderProps = {
  title: string;
  lead?: string;
  eyebrow?: string;
};

/** Title block of a secondary page: optional eyebrow, h1 and a lead. */
export function PageHeader({ title, lead, eyebrow }: PageHeaderProps) {
  return (
    <header className="pt-12 sm:pt-16">
      <div className="page-shell">
        {eyebrow ? (
          <p className="text-[13px] font-medium text-text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`text-[40px] font-semibold tracking-tight text-balance sm:text-5xl ${
            eyebrow ? "mt-2" : ""
          }`.trim()}
        >
          {title}
        </h1>
        {lead ? (
          <p className="mt-4 max-w-2xl text-[18px] leading-7 text-text-secondary">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  );
}
