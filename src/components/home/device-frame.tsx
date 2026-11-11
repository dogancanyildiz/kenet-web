import { getImageProps } from "next/image";
import { preload as preloadResource } from "react-dom";

type DeviceFrameProps = {
  srcLight: string;
  srcDark: string;
  alt: string;
  /**
   * Hero only: preload the theme's image with a media query each, so one
   * download per visitor, and mark it high priority. Everything else lazy.
   */
  preload?: boolean;
  /** Fade and clip the bottom of the phone on narrow viewports (hero). */
  clipMobile?: boolean;
  className?: string;
};

const INTRINSIC_WIDTH = 390;
const INTRINSIC_HEIGHT = 774;

/**
 * iPhone shell around a real app screenshot. Shots are cropped to 390:774
 * (scripts/optimize-screens.mjs) so no empty background shows under the
 * Today composer; keep INTRINSIC_HEIGHT in step with PHONE_HEIGHT / 2. Bezel and shadow come from
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
    loading: preload ? ("eager" as const) : ("lazy" as const),
  };

  // getImageProps({ preload }) emits no <link>; React's preload with a media
  // query does, and the browser fetches only the one that matches.
  if (preload) {
    preloadResource(srcDark, {
      as: "image",
      media: "(prefers-color-scheme: dark)",
      fetchPriority: "high",
    });
    preloadResource(srcLight, {
      as: "image",
      media: "(prefers-color-scheme: light)",
      fetchPriority: "high",
    });
  }

  const {
    props: { srcSet: darkSrcSet, src: darkSrc },
  } = getImageProps({ ...common, src: srcDark });

  const {
    props: { srcSet: lightSrcSet, ...img },
  } = getImageProps({ ...common, src: srcLight });

  return (
    <div
      className={`relative ${
        clipMobile
          ? "max-md:max-h-[340px] max-md:overflow-hidden max-md:device-mask-mobile"
          : ""
      } ${className}`.trim()}
    >
      <div className="rounded-[44px] bg-device-bezel p-2 shadow-(--device-shadow) sm:rounded-[54px]">
        <div className="aspect-[390/774] overflow-hidden rounded-[36px] bg-paper sm:rounded-[46px]">
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet={darkSrcSet ?? darkSrc}
            />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
            <img
              {...img}
              srcSet={lightSrcSet ?? img.src}
              fetchPriority={preload ? "high" : undefined}
              className="h-auto w-full"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
