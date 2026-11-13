type SectionHeadingProps = {
  title: string;
  label?: string;
  id?: string;
};

/**
 * Section title pattern: optional small label, then the statement as h2.
 * Privacy and support reuse this for the statement style alone.
 */
export function SectionHeading({ title, label, id }: SectionHeadingProps) {
  return (
    <>
      {label ? <p className="eyebrow">{label}</p> : null}
      <h2
        id={id}
        className={`max-w-3xl text-[28px] leading-[1.15] font-semibold tracking-tight sm:text-3xl ${
          label ? "mt-2" : ""
        }`.trim()}
      >
        {title}
      </h2>
    </>
  );
}
