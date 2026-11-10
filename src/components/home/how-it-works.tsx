type HowItWorksProps = {
  title: string;
  steps: readonly string[];
};

export function HowItWorks({ title, steps }: HowItWorksProps) {
  return (
    <>
      <h2 className="text-sm font-medium text-balance text-text-secondary">
        {title}
      </h2>
      <ol className="card mt-3 divide-y divide-rule">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-4 px-6 py-4">
            <span className="w-6 shrink-0 font-semibold text-accent tabular-nums">
              {index + 1}
            </span>
            <span className="leading-7">{step}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
