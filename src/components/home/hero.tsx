import { StoreBadge } from "@/components/store-badge";
import { DeviceFrame } from "@/components/home/device-frame";

type HeroProps = {
  title: string;
  lead: string;
  platformsShort: string;
  storeBadge: string;
  storeBadgeSoon: string;
  phoneAlt: string;
};

export function Hero({
  title,
  lead,
  platformsShort,
  storeBadge,
  storeBadgeSoon,
  phoneAlt,
}: HeroProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
      <div className="min-w-0">
        <h1 className="max-w-2xl text-[40px] leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl lg:text-[56px]">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-[18px] leading-7 text-text-secondary">
          {lead}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
          <p className="text-[15px] text-text-secondary">{platformsShort}</p>
        </div>
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
