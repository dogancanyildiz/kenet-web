type PageHeaderProps = {
  title: string;
  lead?: string;
  eyebrow?: string;
};

/** Title block of a secondary page: eyebrow, h1 and a one paragraph lead. */
export function PageHeader({ title, lead, eyebrow }: PageHeaderProps) {
  return (
    <header className="pt-12 sm:pt-16">
      <div className="page-shell">
        {eyebrow ? (
          <p className="text-sm font-medium text-text-secondary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  );
}
