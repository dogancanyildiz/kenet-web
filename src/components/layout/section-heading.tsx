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
      {label ? (
        <p className="text-[13px] font-medium text-text-secondary">{label}</p>
      ) : null}
      <h2
        id={id}
        className={`text-[28px] font-semibold tracking-tight text-balance sm:text-3xl ${
          label ? "mt-2" : ""
        }`.trim()}
      >
        {title}
      </h2>
    </>
  );
}
