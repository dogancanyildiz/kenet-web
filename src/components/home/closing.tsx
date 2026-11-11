import { StoreBadge } from "@/components/store-badge";

type ClosingProps = {
  line: string;
  note: string;
  storeBadge: string;
  storeBadgeSoon: string;
};

/**
 * Closing band: no card, a rule above, statement and note on the left, the
 * store entry on the right from sm up. On a phone everything stacks.
 */
export function Closing({
  line,
  note,
  storeBadge,
  storeBadgeSoon,
}: ClosingProps) {
  return (
    <div className="flex flex-col gap-6 border-t border-rule pt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
      <div className="min-w-0">
        <p className="text-[32px] leading-[1.15] font-semibold tracking-tight text-balance">
          {line}
        </p>
        <p className="mt-3 text-[15px] leading-6 text-text-secondary">{note}</p>
      </div>
      <div className="shrink-0">
        <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
      </div>
    </div>
  );
}
