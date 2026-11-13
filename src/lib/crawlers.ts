/**
 * Crawlers that put pages into search and answer results. Blocking one hides
 * the site from that engine's answers, so they stay open whatever is decided
 * about training.
 */
export const SEARCH_AGENTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-SearchBot",
] as const;

/**
 * Tokens that only govern model training (Google-Extended is a control token,
 * not a crawler; it has no effect on Google Search). Open for now: the owner's
 * decision is pending in docs/decisions.md. Closing them is one change in src/app/robots.ts,
 * `allow` to `disallow: "/"`, and does not touch search visibility.
 */
export const TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
] as const;
