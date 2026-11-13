import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Next 15 wrote CSS under static/css; Next 16/Turbopack uses static/chunks. */
const CSS_ROOTS = [
  join(process.cwd(), ".next", "static", "css"),
  join(process.cwd(), ".next", "static", "chunks"),
];

function cssFiles(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((entry) => {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) return cssFiles(full);
      return entry.endsWith(".css") ? [full] : [];
    });
  } catch {
    return [];
  }
}

function readCompiledCss(): string | null {
  const files = CSS_ROOTS.flatMap(cssFiles);
  if (files.length === 0) return null;
  return files.map((file) => readFileSync(file, "utf8")).join("\n");
}

const css = readCompiledCss();
/**
 * `npm run test:css` sets REQUIRE_BUILD=1 and runs after `next build` in CI,
 * so a missing or moved CSS output fails there instead of skipping green.
 * The plain `npm run test` runs before the build and skips these.
 */
const buildRequired = process.env.REQUIRE_BUILD === "1";
const run = css || buildRequired ? it : it.skip;

describe("compiled CSS after build", () => {
  run("finds the compiled stylesheet", () => {
    expect(css, "no CSS under .next/static; run next build first").toBeTruthy();
  });

  run("applies the hero mask only below the md breakpoint", () => {
    // Tailwind 4 compiles max-md: to `@media not all and (min-width:48rem)`.
    expect(css).toMatch(
      /@media not all and \(min-width:48rem\)\{[^@]*?\.max-md\\:device-mask-mobile\{[^}]*mask-image:linear-gradient/
    );
    // No unconditional rule: the mask must never reach the desktop hero.
    expect(css).not.toMatch(/(?:^|[}\s])\.device-mask-mobile\{/);
  });

  run("paints the glow with a fixed background-size height", () => {
    expect(css).toMatch(/background-size\s*:\s*100%\s+900px/);
  });

  run("clears --glow under Increase Contrast and Reduce Transparency", () => {
    expect(css).toMatch(
      /prefers-contrast:\s*more[\s\S]{0,400}?--glow\s*:\s*(none|transparent)/
    );
    expect(css).toMatch(
      /prefers-reduced-transparency:\s*reduce[\s\S]{0,400}?--glow\s*:\s*(none|transparent)/
    );
  });

  run(
    "draws .link-place with a dotted and .link-person with a solid underline",
    () => {
      expect(css).toMatch(
        /\.link-place\{[^}]*text-decoration:underline dotted/
      );
      expect(css).toMatch(/\.link-person\{[^}]*text-decoration:underline;/);
    }
  );
});
