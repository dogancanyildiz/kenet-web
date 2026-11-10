import Image from "next/image";

type DeviceFrameProps = {
  srcLight: string;
  srcDark: string;
  alt: string;
  priority?: boolean;
  /** Fade the bottom of the phone on narrow viewports (hero). */
  clipMobile?: boolean;
  className?: string;
};

const INTRINSIC_WIDTH = 390;
const INTRINSIC_HEIGHT = 844;

/**
 * iPhone shell around a real app screenshot. Bezel colour is a token so
 * components never carry a hex literal. Width comes from the caller's
 * className (e.g. w-[280px] md:w-[320px]).
 */
export function DeviceFrame({
  srcLight,
  srcDark,
  alt,
  priority = false,
  clipMobile = false,
  className = "",
}: DeviceFrameProps) {
  return (
    <div
      className={`relative ${clipMobile ? "max-md:max-h-[560px] max-md:overflow-hidden max-md:device-mask-mobile" : ""} ${className}`.trim()}
    >
      <div className="relative aspect-[390/844] overflow-hidden rounded-[44px] border-8 border-device-bezel bg-paper shadow-[0_24px_80px_-32px_rgb(0_0_0_/_0.3)] sm:rounded-[54px] dark:shadow-[0_24px_80px_-32px_rgb(0_0_0_/_0.6)]">
        <Image
          src={srcLight}
          alt={alt}
          width={INTRINSIC_WIDTH}
          height={INTRINSIC_HEIGHT}
          priority={priority}
          className="only-light absolute inset-0 h-full w-full object-cover object-top"
        />
        <Image
          src={srcDark}
          alt={alt}
          width={INTRINSIC_WIDTH}
          height={INTRINSIC_HEIGHT}
          priority={priority}
          className="only-dark absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
