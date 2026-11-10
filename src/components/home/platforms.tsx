type PlatformsProps = {
  title: string;
  platforms: readonly string[];
  note: string;
};

export function Platforms({ title, platforms, note }: PlatformsProps) {
  return (
    <>
      <h2 className="text-sm font-medium text-balance text-text-secondary">
        {title}
      </h2>
      <div className="card mt-3 p-6">
        <ul className="grid gap-3 sm:grid-cols-3">
          {platforms.map((name) => (
            <li
              key={name}
              className="text-lg font-semibold text-balance sm:text-center"
            >
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-4 leading-7 text-text-secondary sm:text-center">
          {note}
        </p>
      </div>
    </>
  );
}
