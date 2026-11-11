import { site } from "@/lib/site";

/**
 * App Store entry point. Until the listing exists (site.appStoreUrl is null)
 * it is a quiet line of secondary text: no frame, no fill, nothing that reads
 * as a control. The words carry the state ("coming soon"), not a disabled
 * look. With a URL it is a real link styled as the accent button.
 */
export function StoreBadge({
  label,
  soonLabel,
}: {
  label: string;
  soonLabel: string;
}) {
  if (!site.appStoreUrl) {
    return (
      <span className="inline-flex min-h-11 items-center font-medium text-text-secondary">
        {soonLabel}
      </span>
    );
  }

  return (
    <a
      href={site.appStoreUrl}
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-5 py-2.5 font-medium text-on-accent hover:opacity-90"
    >
      {label}
    </a>
  );
}
