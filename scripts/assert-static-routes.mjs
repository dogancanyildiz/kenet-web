#!/usr/bin/env node
// Reads .next/prerender-manifest.json after `npm run build` and fails when a
// page that must be static was not prerendered in every locale, or when an
// /api route leaked into the static set. A page that forgets
// setRequestLocale silently drops out of the prerender; this is the gate
// that notices.
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const manifestUrl = new URL(
  "../.next/prerender-manifest.json",
  import.meta.url
);
const routingUrl = new URL("../src/i18n/routing.ts", import.meta.url);

/** Routed locales, read out of src/i18n/routing.ts so there is one source. */
export async function readLocales() {
  const source = await readFile(routingUrl, "utf8");
  const block = source.match(/locales:\s*\[([^\]]*)\]/)?.[1];
  const locales = [
    ...(block ?? "").matchAll(/["']([a-z]{2}(?:-[A-Za-z0-9]+)?)["']/g),
  ]
    .map((match) => match[1])
    .filter((locale) => locale !== undefined);
  if (locales.length === 0) {
    throw new Error("no locales found in src/i18n/routing.ts");
  }
  return locales;
}

/**
 * INTERNAL route paths that must be prerendered in every locale ("" is the
 * locale root). next-intl rewrites /gizlilik onto /tr/privacy, so the
 * manifest is keyed in English.
 */
export const LOCALE_PAGES = ["", "/privacy", "/support"];

/** Root level metadata routes, outside the [lang] segment. */
export const ROOT_ROUTES = [
  "/robots.txt",
  "/sitemap.xml",
  "/icon.svg",
  "/icon.png",
  "/apple-icon.png",
];

export function requiredRoutes(locales) {
  return [
    ...locales.flatMap((locale) =>
      LOCALE_PAGES.map((page) => `/${locale}${page}`)
    ),
    ...ROOT_ROUTES,
  ];
}

async function main() {
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  } catch {
    console.error(
      "prerender-manifest.json not found. Run `npm run build` first."
    );
    process.exit(1);
  }

  const locales = await readLocales();
  const routes = Object.keys(manifest.routes ?? {});
  const required = requiredRoutes(locales);
  const missing = required.filter((route) => !routes.includes(route));
  const apiRoutes = routes.filter((route) => route.startsWith("/api"));

  const problems = [];
  if (missing.length > 0) {
    problems.push(`not prerendered: ${missing.join(", ")}`);
  }
  if (apiRoutes.length > 0) {
    problems.push(`api routes must stay dynamic: ${apiRoutes.join(", ")}`);
  }

  if (problems.length > 0) {
    console.error("Static route check failed:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log(
    `Static route check passed: ${required.length} routes prerendered.`
  );
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  await main();
}
