import Image from "next/image";
import type { ReactNode } from "react";

type WindowFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
};

/**
 * Mac window chrome around a screenshot: thin line border, elevated title
 * bar with three empty traffic-light dots in the control colour.
 */
export function WindowFrame({
  src,
  alt,
  width,
  height,
  caption,
}: WindowFrameProps) {
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-[14px] border border-line">
        <div className="flex h-7 items-center gap-1.5 bg-elevated px-3">
          <span className="size-2.5 rounded-full border border-control" />
          <span className="size-2.5 rounded-full border border-control" />
          <span className="size-2.5 rounded-full border border-control" />
        </div>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[13px] leading-5 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
