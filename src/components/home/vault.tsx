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
};

type Segment =
  | { kind: "text"; value: string }
  | { kind: "key"; value: string }
  | { kind: "wiki"; name: string };

/** Shortened journal example from kenet/docs/vault-format.md (lines 762–781). */
const FILE_LINES: readonly Segment[][] = [
  [{ kind: "text", value: "---" }],
  [
    { kind: "key", value: "type" },
    { kind: "text", value: ": journal" },
  ],
  [
    { kind: "key", value: "date" },
    { kind: "text", value: ": 2026-10-02" },
  ],
  [
    { kind: "key", value: "goals" },
    { kind: "text", value: ":" },
  ],
  [
    { kind: "text", value: "  " },
    { kind: "key", value: "kitap" },
    { kind: "text", value: ": 25" },
  ],
  [{ kind: "text", value: "---" }],
  [{ kind: "text", value: "" }],
  [{ kind: "text", value: "## Tasks" }],
  [
    { kind: "text", value: "- [ ] " },
    { kind: "wiki", name: "Ahmet Yılmaz" },
    { kind: "text", value: "'a teklifi gönder 📅 2026-10-05" },
  ],
  [
    {
      kind: "text",
      value: "- [x] Market alışverişi ✅ 2026-10-02",
    },
  ],
  [{ kind: "text", value: "" }],
  [{ kind: "text", value: "## Events" }],
  [
    { kind: "text", value: "- 14:30 " },
    { kind: "wiki", name: "Ahmet Yılmaz|Ahmet" },
    { kind: "text", value: " ile " },
    { kind: "wiki", name: "Kadıköy Ofis" },
    { kind: "text", value: "'te teklifi konuştuk" },
  ],
  [
    { kind: "text", value: "- " },
    { kind: "wiki", name: "Elif" },
    { kind: "text", value: " ile yemek" },
  ],
];

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
        <div className="grid gap-6 md:grid-cols-2">
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
          <pre className="overflow-x-auto font-[family-name:var(--font-mono-stack)] text-[13px] leading-6 text-text">
            {FILE_LINES.map((segments, index) => (
              <span key={index} className="block">
                <FileLine segments={segments} />
                {index < FILE_LINES.length - 1 ? "\n" : null}
              </span>
            ))}
          </pre>
        </div>
        <p className="mt-6 text-[15px] leading-6 text-text-secondary">{note}</p>
      </div>
    </>
  );
}
