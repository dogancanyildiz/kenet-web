import { IconChevronDown } from "@/components/ui/icons";

type FaqCardProps = {
  items: { question: string; answer: string }[];
};

/**
 * One card, native details/summary rows: no JavaScript needed. The whole
 * question row is the target (44 px minimum), tinted on hover; the chevron
 * turns when the row is open (`.disclosure` in globals.css). The focus ring
 * sits inside the row so the card edge does not clip it.
 */
export function FaqCard({ items }: FaqCardProps) {
  return (
    <div className="card overflow-hidden">
      {items.map((item, i) => (
        <details
          key={item.question}
          className={`disclosure ${i > 0 ? "border-t border-rule" : ""}`.trim()}
        >
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-6 py-3.5 font-medium hover:bg-well focus-visible:-outline-offset-2">
            <span>{item.question}</span>
            <IconChevronDown className="disclosure-chevron shrink-0 text-text-secondary" />
          </summary>
          <p className="measure px-6 pt-1 pb-5 leading-7 text-text-secondary">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
