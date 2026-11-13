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

  run("keeps Reduce Transparency above the dark theme selectors", () => {
    // A bare :root (0,1,0) would lose to the (0,2,0) dark blocks and bring
    // the glow back in dark.
    expect(css).toMatch(
      /prefers-reduced-transparency:reduce\)\{:root,:root:not\(\[data-theme=light\]\),:root\[data-theme\]\{--glow:none/
    );
  });

  run("scopes the pinned dark KA palette to Increase Contrast", () => {
    const kaPaper = /:root\[data-theme=dark\]\{--paper:#08090a/g;
    const all = [...css!.matchAll(kaPaper)];
    expect(all.length).toBe(1);
    expect(css).toMatch(
      /@media \(prefers-contrast:more\)\{:root\[data-theme=dark\]\{--paper:#08090a/
    );
  });

  run("pins color-scheme with the theme", () => {
    expect(css).toMatch(/:root\[data-theme=dark\]\{[^}]*color-scheme:dark\}/);
    expect(css).toMatch(/:root\[data-theme=light\]\{[^}]*color-scheme:light\}/);
  });

  run(
    "shows the theme glyph for the theme on screen, hidden without JS",
    () => {
      expect(css).toMatch(
        /:root:not\(\[data-js\]\) \.theme-toggle[,{][^}]*display:none/
      );
      expect(css).toMatch(
        /@media \(prefers-color-scheme:dark\)\{:root:not\(\[data-theme=light\]\) \.theme-toggle \.theme-icon-moon\{display:none/
      );
      expect(css).toMatch(
        /:root:not\(\[data-theme=light\]\) \.theme-toggle \.theme-icon-sun\{display:block/
      );
      expect(css).toMatch(
        /:root\[data-theme=dark\] \.theme-toggle \.theme-icon-moon\{display:none/
      );
      expect(css).toMatch(
        /:root\[data-theme=dark\] \.theme-toggle \.theme-icon-sun\{display:block/
      );
    }
  );

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
