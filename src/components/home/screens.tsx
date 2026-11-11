import { SectionHeading } from "@/components/layout/section-heading";
import { DeviceFrame } from "@/components/home/device-frame";

export type ScreenItem = {
  srcLight: string;
  srcDark: string;
  alt: string;
  /** Short store-style headline above the phone. */
  title: string;
  /** One line under the headline. */
  caption: string;
};

type ScreensProps = {
  label: string;
  title: string;
  phones: readonly ScreenItem[];
  tablet: Omit<ScreenItem, "title">;
};

/**
 * Store-style tiles: headline and one line on a surface tile, the phone
 * below it running off the tile's bottom edge (the tab bar is cut, the
 * screen's content is not). Below the strip, the iPad in landscape.
 */
export function Screens({ label, title, phones, tablet }: ScreensProps) {
  return (
    <>
      <SectionHeading label={label} title={title} />
      <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
        {phones.map((phone) => (
          <figure
            key={phone.srcLight}
            className="flex aspect-[5/7] w-[min(280px,78vw)] shrink-0 snap-center flex-col overflow-hidden rounded-card border border-rule bg-surface lg:w-auto"
          >
            <figcaption className="px-5 pt-5">
              <p className="text-[17px] leading-6 font-semibold tracking-tight text-balance">
                {phone.title}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-pretty text-text-secondary">
                {phone.caption}
              </p>
            </figcaption>
            <div className="mt-5 min-h-0 flex-1 px-6">
              <DeviceFrame
                srcLight={phone.srcLight}
                srcDark={phone.srcDark}
                alt={phone.alt}
                className="mx-auto w-full max-w-[220px]"
              />
            </div>
          </figure>
        ))}
      </div>
      <figure className="mt-10">
        <DeviceFrame
          srcLight={tablet.srcLight}
          srcDark={tablet.srcDark}
          alt={tablet.alt}
          device="tablet"
          className="w-full"
        />
        <figcaption className="mt-4 text-[13px] leading-5 text-text-secondary">
          {tablet.caption}
        </figcaption>
      </figure>
    </>
  );
}
