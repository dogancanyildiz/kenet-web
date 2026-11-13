/**
 * Small inline glyphs for links and disclosures. Same drawing rules as the
 * promise marks: 1.5 stroke, round caps, currentColor, hidden from
 * assistive technology (the link text already says where it goes).
 */
type IconProps = { className?: string };

const common = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Marks a link that leaves kenet.app. */
export function IconArrowUpRight({ className = "" }: IconProps) {
  return (
    <svg {...common} width="16" height="16" className={className}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

/** Disclosure state; rotated by `.disclosure[open]` in globals.css. */
export function IconChevronDown({ className = "" }: IconProps) {
  return (
    <svg {...common} width="18" height="18" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
