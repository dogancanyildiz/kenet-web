type FaqCardProps = {
  items: { question: string; answer: string }[];
};

/** One card, native details/summary rows: no JavaScript needed. */
export function FaqCard({ items }: FaqCardProps) {
  return (
    <div className="card">
      {items.map((item, i) => (
        <details
          key={item.question}
          className={`px-6 ${i > 0 ? "border-t border-rule" : ""}`}
        >
          <summary className="min-h-11 cursor-pointer py-3 font-medium">
            {item.question}
          </summary>
          <p className="pb-4 leading-7 text-text-secondary">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
