import type { ReactNode } from "react";

type PrivacySectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

/**
 * One section of the policy: a single card with an h2 that names the region.
 * Cards never nest; rows inside a card are separated by a rule.
 */
export function PrivacySection({ id, title, children }: PrivacySectionProps) {
  const headingId = `${id}-title`;
  return (
    <section aria-labelledby={headingId} className="card p-6 sm:p-8">
      <h2 id={headingId} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}
