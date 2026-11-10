import { SectionHeading } from "@/components/layout/section-heading";

type MechanismProps = {
  label: string;
  title: string;
  wroteLabel: string;
  sawLabel: string;
  fileLabel: string;
  modeEvent: string;
  modeTask: string;
  time: string;
  rawLine: string;
  sawPrefix: string;
  person: string;
  sawBetween: string;
  place: string;
  placeSuffix: string;
  sawRest: string;
  fileLine: string;
  fileNote: string;
  quickEntrySr: string;
  fileCodeLabel: string;
};

export function Mechanism({
  label,
  title,
  wroteLabel,
  sawLabel,
  fileLabel,
  modeEvent,
  modeTask,
  time,
  rawLine,
  sawPrefix,
  person,
  sawBetween,
  place,
  placeSuffix,
  sawRest,
  fileLine,
  fileNote,
  quickEntrySr,
  fileCodeLabel,
}: MechanismProps) {
  return (
    <>
      <SectionHeading label={label} title={title} />
      <div className="card mt-6 divide-y divide-rule">
        <div className="grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
          <p className="text-[13px] leading-5 text-text-tertiary sm:pt-1">
            {wroteLabel}
          </p>
          <div className="min-w-0 overflow-hidden rounded-control bg-well px-4 py-3 sm:rounded-full">
            <span className="sr-only">{quickEntrySr}</span>
            <p className="overflow-hidden text-[15px] leading-6 text-ellipsis whitespace-nowrap">
              <span aria-hidden="true" className="relative text-text">
                {modeEvent}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent" />
              </span>{" "}
              <span aria-hidden="true" className="text-text-secondary">
                {modeTask}
              </span>{" "}
              <span className="tabular-nums text-text-secondary">{time}</span>{" "}
              <span className="text-text">{rawLine}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
          <p className="text-[13px] leading-5 text-text-tertiary sm:pt-1">
            {sawLabel}
          </p>
          <p className="text-[17px] leading-7">
            <span className="tabular-nums text-text-secondary">{time}</span>
            {sawPrefix}
            <span className="link-person">{person}</span>
            {sawBetween}
            <span className="link-place">{place}</span>
            {placeSuffix}
            {sawRest}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
          <p className="text-[13px] leading-5 text-text-tertiary sm:pt-1">
            {fileLabel}
          </p>
          <div className="min-w-0">
            <pre
              tabIndex={0}
              aria-label={fileCodeLabel}
              className="overflow-x-auto rounded-control bg-well px-3 py-2 font-[family-name:var(--font-mono-stack)] text-[13px] leading-5 text-text"
            >
              <code>{fileLine}</code>
            </pre>
            <p className="mt-3 text-[15px] leading-6 text-text-secondary">
              {fileNote}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
