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
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-sm font-medium text-text-secondary">
        {title}
      </h2>
      <div className="card mt-3 p-6 sm:p-8">{children}</div>
    </section>
  );
}
