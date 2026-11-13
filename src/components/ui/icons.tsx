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

/** Theme button glyph while the light theme is on screen. */
export function IconMoon({ className = "" }: IconProps) {
  return (
    <svg {...common} width="20" height="20" className={className}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

/** Theme button glyph while the dark theme is on screen. */
export function IconSun({ className = "" }: IconProps) {
  return (
    <svg {...common} width="20" height="20" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
