import { site } from "@/lib/site";

/**
 * Build metadata the footer shows. Both values are build time and optional;
 * an empty value simply hides the line. See .env.example.
 */
export function buildInfo(): { sha: string | null; date: string | null } {
  const sha = process.env.NEXT_PUBLIC_BUILD_SHA?.trim() || null;
  const date = process.env.NEXT_PUBLIC_BUILD_DATE?.trim() || null;
  return { sha: sha ? sha.slice(0, 7) : null, date };
}

/**
 * "2026" or "2026–2027": the founding year through the build year. The build
 * date is preferred so a prerendered page does not freeze at render time;
 * without one the clock at build is the next best fact.
 */
export function copyrightRange(now: Date = new Date()): string {
  const { date } = buildInfo();
  const year = (date ? new Date(date) : now).getUTCFullYear();
  return year > site.foundingYear
    ? `${site.foundingYear}–${year}`
    : `${site.foundingYear}`;
}
