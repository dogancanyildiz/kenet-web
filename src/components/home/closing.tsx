import { StoreBadge } from "@/components/store-badge";

type ClosingProps = {
  line: string;
  note: string;
  storeBadge: string;
  storeBadgeSoon: string;
};

export function Closing({
  line,
  note,
  storeBadge,
  storeBadgeSoon,
}: ClosingProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
        <p className="text-[32px] font-semibold tracking-tight text-balance">
          {line}
        </p>
        <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
      </div>
      <p className="mt-4 text-[15px] text-text-secondary">{note}</p>
    </div>
  );
}
