import { getImageProps } from "next/image";
import { preload as preloadResource } from "react-dom";

type Device = "phone" | "tablet";

type DeviceFrameProps = {
  srcLight: string;
  srcDark: string;
  alt: string;
  /** iPhone (portrait) or iPad (landscape). */
  device?: Device;
  /**
   * Hero only: preload the theme's image with a media query each, so one
   * download per visitor, and mark it high priority. Everything else lazy.
   */
  preload?: boolean;
  /** Fade and clip the bottom of the phone on narrow viewports (hero). */
  clipMobile?: boolean;
  className?: string;
};

/**
 * Intrinsic sizes in CSS px; keep in step with scripts/optimize-screens.mjs.
 * Phone: full 1320×2868 capture at 780 px wide, uncropped (status bar and
 * tab bar stay). Tablet: landscape iPad capture with the status bar and the
 * resize-handle strip cropped, 1600×1130.
 */
const SIZES: Record<
  Device,
  {
    width: number;
    height: number;
    aspect: string;
    shell: string;
    screen: string;
    sizes: string;
  }
> = {
  phone: {
    width: 390,
    height: 847,
    aspect: "aspect-[1320/2868]",
    shell: "rounded-[44px] p-2 sm:rounded-[54px]",
    screen: "rounded-[36px] sm:rounded-[46px]",
    sizes: "(max-width: 1023px) 260px, 340px",
  },
  tablet: {
    width: 800,
    height: 565,
    aspect: "aspect-[800/565]",
    shell: "rounded-[20px] p-1.5 sm:rounded-[32px] sm:p-3",
    screen: "rounded-[14px] sm:rounded-[20px]",
    sizes: "(max-width: 1023px) 100vw, 1024px",
  },
};

/**
 * Device shell around a real app screenshot. Bezel and shadow come from
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
  device = "phone",
  preload = false,
  clipMobile = false,
  className = "",
}: DeviceFrameProps) {
  const size = SIZES[device];
  const common = {
    alt,
    width: size.width,
    height: size.height,
    sizes: size.sizes,
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
      data-device={device}
      className={`relative ${
        clipMobile
          ? "max-md:max-h-[340px] max-md:overflow-hidden max-md:device-mask-mobile"
          : ""
      } ${className}`.trim()}
    >
      <div className={`bg-device-bezel shadow-(--device-shadow) ${size.shell}`}>
        <div
          className={`${size.aspect} overflow-hidden bg-paper ${size.screen}`}
        >
          <picture>
            {/* The theme boot script may re-point media before hydration. */}
            <source
              suppressHydrationWarning
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
