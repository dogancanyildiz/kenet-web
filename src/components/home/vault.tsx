import { SectionHeading } from "@/components/layout/section-heading";

type VaultProps = {
  label: string;
  title: string;
  note: string;
  treeSelected: string;
  treePeople: string;
  treePlaces: string;
  treeTemplates: string;
  treeApp: string;
  fileLabel: string;
  lines: readonly string[];
};

type Segment =
  | { kind: "text"; value: string }
  | { kind: "key"; value: string }
  | { kind: "wiki"; name: string };

const WIKI = /\[\[([^\]]+)\]\]/g;
/** Leading indent plus a list or task marker ("- ", "- [ ] "). */
const HANG = /^(\s*)(?:[-*] (?:\[.\] )?)?/;

/**
 * Width in ch that a wrapped line hangs from, so continuation lines start
 * under the text after the marker and the file keeps its Markdown shape.
 */
function hangWidth(line: string): number {
  return HANG.exec(line)?.[0].length ?? 0;
}
const FRONTMATTER_KEY = /^(\s*)([A-Za-z][\w-]*)(:.*)$/;

/** Split a vault line into wiki links and (for frontmatter) key spans. */
function parseLine(line: string): Segment[] {
  const keyMatch = FRONTMATTER_KEY.exec(line);
  if (keyMatch && !line.includes("[[")) {
    const [, indent, key, rest] = keyMatch;
    return [
      { kind: "text", value: indent ?? "" },
      { kind: "key", value: key ?? "" },
      { kind: "text", value: rest ?? "" },
    ];
  }

  const segments: Segment[] = [];
  let last = 0;
  for (const match of line.matchAll(WIKI)) {
    const start = match.index ?? 0;
    if (start > last) {
      segments.push({ kind: "text", value: line.slice(last, start) });
    }
    segments.push({ kind: "wiki", name: match[1] ?? "" });
    last = start + match[0].length;
  }
  if (last < line.length) {
    segments.push({ kind: "text", value: line.slice(last) });
  }
  return segments.length > 0 ? segments : [{ kind: "text", value: line }];
}

function WikiLink({ name }: { name: string }) {
  return (
    <span>
      <span className="text-text-tertiary">[[</span>
      <span className="text-text">{name}</span>
      <span className="text-text-tertiary">]]</span>
    </span>
  );
}

function FileLine({ segments }: { segments: readonly Segment[] }) {
  return (
    <span>
      {segments.map((segment, index) => {
        if (segment.kind === "key") {
          return (
            <span key={index} className="text-text-secondary">
              {segment.value}
            </span>
          );
        }
        if (segment.kind === "wiki") {
          return <WikiLink key={index} name={segment.name} />;
        }
        return <span key={index}>{segment.value}</span>;
      })}
    </span>
  );
}

export function Vault({
  label,
  title,
  note,
  treeSelected,
  treePeople,
  treePlaces,
  treeTemplates,
  treeApp,
  fileLabel,
  lines,
}: VaultProps) {
  const tree = [
    { path: treeSelected, selected: true },
    { path: treePeople, selected: false },
    { path: treePlaces, selected: false },
    { path: treeTemplates, selected: false },
    { path: treeApp, selected: false },
  ];

  return (
    <>
      <SectionHeading label={label} title={title} />
      <div className="card mt-6 p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <ul className="font-[family-name:var(--font-mono-stack)] text-[13px] leading-6">
            {tree.map((entry) => (
              <li key={entry.path}>
                <span
                  className={
                    entry.selected
                      ? "inline-block rounded-control bg-well px-2 py-0.5 text-text"
                      : "text-text-secondary"
                  }
                >
                  {entry.path}
                </span>
              </li>
            ))}
          </ul>
          {/* Lines wrap instead of scrolling (pre-wrap keeps the indent),
              so the block needs no tab stop; the figure names it. */}
          <figure className="min-w-0">
            <figcaption className="sr-only">{fileLabel}</figcaption>
            <pre className="font-[family-name:var(--font-mono-stack)] text-[13px] leading-6 break-words whitespace-pre-wrap text-text">
              <code>
                {lines.map((line, index) => {
                  const hang = hangWidth(line);
                  return (
                    <span
                      key={index}
                      className="block"
                      style={
                        hang > 0
                          ? {
                              paddingInlineStart: `${hang}ch`,
                              textIndent: `-${hang}ch`,
                            }
                          : undefined
                      }
                    >
                      <FileLine segments={parseLine(line)} />
                      {index < lines.length - 1 ? "\n" : null}
                    </span>
                  );
                })}
              </code>
            </pre>
          </figure>
        </div>
        <p className="mt-6 text-[15px] leading-6 text-text-secondary">{note}</p>
      </div>
    </>
  );
}
