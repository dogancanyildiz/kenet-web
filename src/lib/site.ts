/**
 * Fixed facts about the product the site describes. Anything that can change
 * per deploy belongs in env.ts; anything that is prose belongs in messages/.
 */
export const site = {
  /** Public repository of the app itself; issues are the support channel. */
  appRepoUrl: "https://github.com/dogancanyildiz/kenet",
  appIssuesUrl: "https://github.com/dogancanyildiz/kenet/issues",
  /** Owner's site, linked from the footer. */
  ownerUrl: "https://www.dogancanyildiz.com",
  ownerName: "Doğan Can YILDIZ",
  /**
   * App Store listing. null until the app is published: the badge then renders
   * as a disabled "coming soon" element instead of a dead link.
   */
  appStoreUrl: null as string | null,
  /** Year the product and this site first appeared; the footer range starts here. */
  foundingYear: 2026,
} as const;
