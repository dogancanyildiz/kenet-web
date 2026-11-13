import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { StoreBadge } from "@/components/store-badge";

type ClosingProps = {
  line: string;
  note: string;
  /** Rich text: `<link>` wraps the words that open the privacy policy. */
  privacy: (link: (chunks: ReactNode) => ReactNode) => ReactNode;
  platformsLabel: string;
  /** Plain status lines: which platform reaches the store when, and the UI language. */
  platforms: readonly string[];
  storeBadge: string;
  storeBadgeSoon: string;
};

/**
 * Closing band: no card, a rule above, statement, note and privacy line on
 * the left, the store entry on the right from sm up; the platform status sits
 * under both. On a phone everything stacks.
 */
export function Closing({
  line,
  note,
  privacy,
  platformsLabel,
  platforms,
  storeBadge,
  storeBadgeSoon,
}: ClosingProps) {
  return (
    <div className="border-t border-rule pt-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="min-w-0">
          <p className="text-[32px] leading-[1.15] font-semibold tracking-tight text-balance">
            {line}
          </p>
          <p className="mt-3 text-[15px] leading-6 text-text-secondary">
            {note}
          </p>
          <p className="mt-1 text-[15px] leading-6 text-text-secondary">
            {privacy((chunks) => (
              <Link
                href="/privacy"
                className="prose-link inline-flex min-h-11 items-center font-medium"
              >
                {chunks}
              </Link>
            ))}
          </p>
        </div>
        <div className="shrink-0">
          <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
        </div>
      </div>
      <div className="mt-8">
        <p className="eyebrow">{platformsLabel}</p>
        <ul className="mt-2 grid gap-1 text-[15px] leading-6 text-text-secondary sm:grid-cols-3 sm:gap-6">
          {platforms.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
