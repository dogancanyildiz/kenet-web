import { getImageProps } from "next/image";

type DeviceFrameProps = {
  srcLight: string;
  srcDark: string;
  alt: string;
  /** Preload the light fallback (hero LCP only). */
  preload?: boolean;
  /** Fade and clip the bottom of the phone on narrow viewports (hero). */
  clipMobile?: boolean;
  className?: string;
};

const INTRINSIC_WIDTH = 390;
const INTRINSIC_HEIGHT = 844;

/**
 * iPhone shell around a real app screenshot. Bezel and shadow come from
 * tokens. One <picture> so only the matching theme image downloads.
 * Width comes from the caller's className (e.g. w-full max-w-[260px]).
 *
 * Site images are unoptimized (next.config); getImageProps then omits
 * srcSet and only returns src. A single-URL srcSet still switches themes.
 */
export function DeviceFrame({
  srcLight,
  srcDark,
  alt,
  preload = false,
  clipMobile = false,
  className = "",
}: DeviceFrameProps) {
  const common = {
    alt,
    width: INTRINSIC_WIDTH,
    height: INTRINSIC_HEIGHT,
    sizes: "(max-width: 1023px) 260px, 360px",
    // Every screenshot is the content of this page and about 45 KB; eager
    // loading means the strip is never a row of empty frames.
    loading: "eager" as const,
  };

  const {
    props: { srcSet: darkSrcSet, src: darkSrc },
  } = getImageProps({ ...common, src: srcDark });

  const {
    props: { srcSet: lightSrcSet, ...img },
  } = getImageProps({ ...common, src: srcLight, preload });

  return (
    <div
      className={`relative ${
        clipMobile
          ? "max-md:max-h-[340px] max-md:overflow-hidden max-md:device-mask-mobile"
          : ""
      } ${className}`.trim()}
    >
      <div className="rounded-[44px] bg-device-bezel p-2 shadow-(--device-shadow) sm:rounded-[54px]">
        <div className="aspect-[390/844] overflow-hidden rounded-[36px] bg-paper sm:rounded-[46px]">
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet={darkSrcSet ?? darkSrc}
            />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
            <img
              {...img}
              srcSet={lightSrcSet ?? img.src}
              className="h-auto w-full"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
