import type { ReactNode } from "react";
import { SectionHeading } from "@/components/layout/section-heading";

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
    <section id={id} aria-labelledby={headingId}>
      <SectionHeading id={headingId} title={title} />
      <div className="card mt-6 p-6 sm:p-8">{children}</div>
    </section>
  );
}
