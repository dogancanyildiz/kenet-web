import type { ReactNode } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  IconDocument,
  IconSwap,
  IconTaskCheck,
} from "@/components/home/promise-icons";

type PromiseItem = {
  title: string;
  body: string;
};

type PromisesProps = {
  label: string;
  title: string;
  items: readonly PromiseItem[];
};

const ICONS: readonly ReactNode[] = [
  <IconDocument key="doc" />,
  <IconTaskCheck key="task" />,
  <IconSwap key="swap" />,
];

export function Promises({ label, title, items }: PromisesProps) {
  return (
    <>
      <SectionHeading label={label} title={title} />
      <ul className="card mt-6 divide-y divide-rule">
        {items.map((item, index) => (
          <li
            key={item.title}
            className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 px-6 py-5"
          >
            <span className="flex h-11 w-11 items-center justify-start text-text">
              {ICONS[index]}
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-semibold leading-6 text-balance">
                {item.title}
              </p>
              <p className="mt-1 text-[15px] leading-6 text-text-secondary">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
