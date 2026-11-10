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
const run = css ? it : it.skip;

describe("compiled CSS after build", () => {
  run("ships device-mask-mobile under a max-width media query", () => {
    expect(css).toBeTruthy();
    // Either the @utility name survived, or an arbitrary mask-image rule
    // was emitted inside a max-width block.
    const hasNamed =
      /@media\s*\([^)]*max-width[^)]*\)\s*\{[^}]*device-mask-mobile/.test(
        css!
      ) || /device-mask-mobile[^{]*\{[^}]*mask-image/.test(css!);
    const hasMaskInMaxWidth =
      /@media\s*\([^)]*max-width[^)]*\)[\s\S]{0,800}?mask-image\s*:\s*linear-gradient/.test(
        css!
      );
    expect(hasNamed || hasMaskInMaxWidth).toBe(true);
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
});
