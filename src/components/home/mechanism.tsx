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
}: MechanismProps) {
  return (
    <>
      <SectionHeading label={label} title={title} />
      <div className="card mt-6 divide-y divide-rule">
        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 px-6 py-5">
          <p className="pt-1 text-[13px] leading-5 text-text-tertiary">
            {wroteLabel}
          </p>
          <div className="min-w-0 rounded-full bg-well px-4 py-3">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px] leading-6">
              <span className="relative text-text">
                {modeEvent}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent"
                />
              </span>
              <span className="text-text-secondary">{modeTask}</span>
              <span className="tabular-nums text-text-secondary">{time}</span>
              <span className="text-text">{rawLine}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 px-6 py-5">
          <p className="pt-1 text-[13px] leading-5 text-text-tertiary">
            {sawLabel}
          </p>
          <p className="text-[17px] leading-7">
            <span className="tabular-nums text-text-secondary">{time}</span>
            {sawPrefix ? <span>{sawPrefix}</span> : " "}
            <span className="link-person">{person}</span>
            <span>{sawBetween}</span>
            <span className="link-place">{place}</span>
            <span>{placeSuffix}</span>
            {sawRest ? <span>{sawRest}</span> : null}
          </p>
        </div>

        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 px-6 py-5">
          <p className="pt-1 text-[13px] leading-5 text-text-tertiary">
            {fileLabel}
          </p>
          <div className="min-w-0">
            <pre className="overflow-x-auto rounded-control bg-well px-3 py-2 font-[family-name:var(--font-mono-stack)] text-[13px] leading-5 text-text">
              {fileLine}
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
