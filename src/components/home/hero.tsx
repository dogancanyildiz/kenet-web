import { Link } from "@/i18n/navigation";
import { StoreBadge } from "@/components/store-badge";
import { DeviceFrame } from "@/components/home/device-frame";

export type HeroProof = {
  /** Accessible name of the list. */
  label: string;
  /** Short facts, each one checkable in the app or the privacy policy. */
  items: readonly string[];
  /** The last fact, linked to the privacy policy that backs it. */
  privacy: string;
};

type HeroProps = {
  title: string;
  lead: string;
  platformsShort: string;
  storeBadge: string;
  storeBadgeSoon: string;
  phoneAlt: string;
  proof: HeroProof;
};

const proofItem =
  "flex items-center gap-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']";

export function Hero({
  title,
  lead,
  platformsShort,
  storeBadge,
  storeBadgeSoon,
  phoneAlt,
  proof,
}: HeroProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
      <div className="min-w-0">
        <h1 className="max-w-2xl text-[40px] leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl lg:text-[56px]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-7 text-pretty text-text-secondary">
          {lead}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
          <p className="text-[15px] text-text-secondary">{platformsShort}</p>
        </div>
        {/* Instead of ratings: facts a reader can check (research A2). */}
        <ul
          aria-label={proof.label}
          className="mt-6 flex max-w-xl flex-wrap gap-x-5 gap-y-1 text-[14px] leading-6 text-text-secondary"
        >
          {proof.items.map((item) => (
            <li key={item} className={proofItem}>
              {item}
            </li>
          ))}
          <li className={proofItem}>
            <Link href="/privacy" className="prose-link">
              {proof.privacy}
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex justify-center md:justify-end">
        <DeviceFrame
          srcLight="/screens/today-light.webp"
          srcDark="/screens/today-dark.webp"
          alt={phoneAlt}
          preload
          clipMobile
          className="mx-auto w-full max-w-[280px] md:mx-0 md:max-w-[320px] lg:max-w-[340px]"
        />
      </div>
    </div>
  );
}
