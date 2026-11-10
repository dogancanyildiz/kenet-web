import { StoreBadge } from "@/components/store-badge";

type ClosingProps = {
  title: string;
  body: string;
  storeBadge: string;
  storeBadgeSoon: string;
};

export function Closing({
  title,
  body,
  storeBadge,
  storeBadgeSoon,
}: ClosingProps) {
  return (
    <>
      <h2 className="text-sm font-medium text-balance text-text-secondary">
        {title}
      </h2>
      <div className="card mt-3 p-6 sm:p-8">
        <p className="max-w-2xl text-lg leading-8">{body}</p>
        <div className="mt-8">
          <StoreBadge label={storeBadge} soonLabel={storeBadgeSoon} />
        </div>
      </div>
    </>
  );
}
