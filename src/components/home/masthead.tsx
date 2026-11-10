type MastheadProps = {
  items: readonly [string, string, string];
};

/**
 * Künye line (design rule 6): each number-and-word pair is semibold text
 * colour; commas and the trailing period are secondary.
 */
export function Masthead({ items }: MastheadProps) {
  return (
    <p className="text-base leading-7">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? <span className="text-text-secondary">, </span> : null}
          <span className="font-semibold text-text">{item}</span>
        </span>
      ))}
      <span className="text-text-secondary">.</span>
    </p>
  );
}
