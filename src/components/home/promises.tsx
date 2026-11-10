type PromiseItem = {
  title: string;
  body: string;
};

type PromisesProps = {
  title: string;
  items: readonly PromiseItem[];
};

export function Promises({ title, items }: PromisesProps) {
  return (
    <>
      <h2 className="text-sm font-medium text-balance text-text-secondary">
        {title}
      </h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="card p-6">
            <h3 className="text-lg font-semibold text-balance">{item.title}</h3>
            <p className="mt-2 leading-7 text-text-secondary">{item.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
