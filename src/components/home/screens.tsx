import { SectionHeading } from "@/components/layout/section-heading";
import { DeviceFrame } from "@/components/home/device-frame";
import { WindowFrame } from "@/components/home/window-frame";

type ScreenItem = {
  srcLight: string;
  srcDark: string;
  alt: string;
  caption: string;
};

type ScreensProps = {
  label: string;
  title: string;
  phones: readonly [ScreenItem, ScreenItem, ScreenItem];
  macAlt: string;
  macCaption: string;
};

export function Screens({
  label,
  title,
  phones,
  macAlt,
  macCaption,
}: ScreensProps) {
  return (
    <>
      <SectionHeading label={label} title={title} />
      <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
        {phones.map((phone) => (
          <figure
            key={phone.caption}
            className="w-[260px] shrink-0 snap-center sm:w-auto"
          >
            <DeviceFrame
              srcLight={phone.srcLight}
              srcDark={phone.srcDark}
              alt={phone.alt}
              className="mx-auto w-[240px] sm:w-[260px] lg:w-[280px]"
            />
            <figcaption className="mt-3 text-center text-[13px] text-text-secondary">
              {phone.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10">
        <WindowFrame
          src="/screens/mac-kanban-light.webp"
          alt={macAlt}
          width={1600}
          height={1047}
          caption={macCaption}
        />
      </div>
    </>
  );
}
