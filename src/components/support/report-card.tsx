import { bulletListClass } from "@/components/ui/bullet-list";

type ReportCardProps = {
  intro: string;
  items: string[];
  privacy: string;
};

/** Single card listing what a useful bug report contains. */
export function ReportCard({ intro, items, privacy }: ReportCardProps) {
  return (
    <div className="card p-6">
      <p className="leading-7 text-text-secondary">{intro}</p>
      <ul className={`${bulletListClass} mt-3 space-y-1`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 border-t border-rule pt-4 leading-7 text-text-secondary">
        {privacy}
      </p>
    </div>
  );
}
