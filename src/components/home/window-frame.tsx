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
 * bar with three empty traffic-light dots in the control colour. The image
 * sits on an elevated field so a light screenshot does not flash on dark
 * paper.
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
      <div className="overflow-hidden rounded-[14px] border border-line bg-elevated">
        <div className="flex h-7 items-center gap-1.5 border-b border-line bg-elevated px-3">
          <span className="size-2.5 rounded-full border border-control" />
          <span className="size-2.5 rounded-full border border-control" />
          <span className="size-2.5 rounded-full border border-control" />
        </div>
        <div className="bg-elevated p-1">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            className="h-auto w-full"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[13px] leading-5 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
