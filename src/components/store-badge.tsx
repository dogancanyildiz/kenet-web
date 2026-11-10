import { site } from "@/lib/site";

/**
 * App Store entry point. Until the listing exists (site.appStoreUrl is null)
 * it renders as an inert, clearly labelled element instead of a dead link.
 */
export function StoreBadge({
  label,
  soonLabel,
}: {
  label: string;
  soonLabel: string;
}) {
  const base =
    "inline-flex min-h-11 items-center gap-2 rounded-control px-5 py-2.5 font-medium";

  if (!site.appStoreUrl) {
    return (
      <span
        aria-disabled="true"
        className={`${base} border border-line bg-well text-text-secondary`}
      >
        {soonLabel}
      </span>
    );
  }

  return (
    <a
      href={site.appStoreUrl}
      rel="noopener noreferrer"
      className={`${base} bg-accent text-on-accent hover:opacity-90`}
    >
      {label}
    </a>
  );
}
