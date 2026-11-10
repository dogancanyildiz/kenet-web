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
      <ul className="mt-3 list-disc space-y-1 pl-5 leading-7">
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
