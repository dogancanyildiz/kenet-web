declare module "../../scripts/assert-static-routes.mjs" {
  export const LOCALE_PAGES: string[];
  export const ROOT_ROUTES: string[];
  export function readLocales(): Promise<string[]>;
  export function requiredRoutes(locales: string[]): string[];
}
