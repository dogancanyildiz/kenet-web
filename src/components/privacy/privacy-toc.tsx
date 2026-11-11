type PrivacyTocProps = {
  label: string;
  items: readonly { id: string; title: string }[];
};

/**
 * "On this page": plain in-page anchors, no scroll spy and no script. Above
 * the policy on a phone, a sticky column beside it from lg up. The anchors
 * land under the sticky header through scroll-padding-top on html.
 */
export function PrivacyToc({ label, items }: PrivacyTocProps) {
  return (
    <nav
      aria-labelledby="privacy-toc"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <p id="privacy-toc" className="eyebrow">
        {label}
      </p>
      <ol className="mt-2 border-l border-rule">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-px flex min-h-11 items-center border-l border-transparent py-1.5 pl-4 text-sm leading-5 text-text-secondary hover:border-control hover:text-text"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
