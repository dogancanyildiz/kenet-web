export type DataAccessRow = {
  data: string;
  purpose: string;
  where: string;
  control: string;
};

type DataAccessListProps = {
  rows: readonly DataAccessRow[];
  labels: { purpose: string; where: string; control: string };
  labelledBy: string;
};

/**
 * The "data the app accesses" table as a list of rows. Every row names the
 * data in an h3 and answers the same three questions in a description list,
 * so it reads the same on a phone (stacked) and on a wide screen (two
 * columns) without a second copy of the content.
 */
export function DataAccessList({
  rows,
  labels,
  labelledBy,
}: DataAccessListProps) {
  return (
    <ul
      role="list"
      aria-labelledby={labelledBy}
      className="mt-6 divide-y divide-rule"
    >
      {rows.map((row) => (
        <li
          key={row.data}
          className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-6"
        >
          <h3 className="font-semibold">{row.data}</h3>
          <dl className="grid gap-3">
            <div>
              <dt className="text-sm font-medium text-text-secondary">
                {labels.purpose}
              </dt>
              <dd className="mt-1 leading-7">{row.purpose}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-secondary">
                {labels.where}
              </dt>
              <dd className="mt-1 leading-7">{row.where}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-secondary">
                {labels.control}
              </dt>
              <dd className="mt-1 leading-7">{row.control}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
