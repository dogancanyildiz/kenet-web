import { StoreBadge } from "@/components/store-badge";
import { Masthead } from "@/components/home/masthead";

type IntroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  mastheadItems: readonly [string, string, string];
  storeBadge: string;
  storeBadgeSoon: string;
};

export function Intro({
  eyebrow,
  title,
  lead,
  mastheadItems,
  storeBadge,
  storeBadgeSoon,
}: IntroProps) {
  return (
    <div className="card p-6 sm:p-8">
      <p className="text-sm font-medium text-text-secondary">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
        {lead}
      </p>
      <div className="mt-6">
        <Masthead items={mastheadItems} />
      </div>
      <div className="mt-8">
        <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
      </div>
    </div>
  );
}
