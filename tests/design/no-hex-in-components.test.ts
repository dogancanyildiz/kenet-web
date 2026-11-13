import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Design rule 1 (docs/design.md): colour comes from the tokens in
 * globals.css, never from a literal in a component. Tailwind arbitrary values
 * (`text-[#000]`) and inline hex / rgb / hsl / oklch all count.
 */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

const HEX = /#[0-9a-f]{3,8}\b/i;
// No word boundary: Tailwind arbitrary values put an underscore before the
// function (`shadow-[0_24px_rgb(0_0_0)]`), and `_` is a word character.
const RAW_COLOR = /(?<![a-z-])(?:rgba?|hsla?|oklch)\s*\(/i;

describe("raw colour pattern", () => {
  it("matches every form a component could smuggle a colour in", () => {
    for (const sample of [
      "shadow-[0_24px_80px_-32px_rgb(0_0_0_/_0.3)]",
      "bg-[rgb(0,0,0)]",
      'style={{ color: "rgba(0,0,0,.5)" }}',
      "text-[hsl(0_0%_0%)]",
      "fill-[oklch(0.5_0.1_300)]",
    ]) {
      expect(RAW_COLOR.test(sample), sample).toBe(true);
    }
    expect(RAW_COLOR.test("shadow-(--device-shadow)")).toBe(false);
  });
});

describe("component sources", () => {
  it("carry no hex colour literal", () => {
    const root = join(process.cwd(), "src");
    const offenders = sourceFiles(root).filter((file) => {
      // The layout restates the page background for theme-color on purpose
      // and tests/design/tokens.test.ts keeps it in sync with the stylesheet.
      if (file === join(root, "app", "[lang]", "layout.tsx")) return false;
      return HEX.test(readFileSync(file, "utf8"));
    });
    expect(offenders).toEqual([]);
  });

  it("carry no raw rgb/hsl/oklch colour literals", () => {
    const root = join(process.cwd(), "src");
    const offenders = sourceFiles(root).filter((file) => {
      if (file === join(root, "app", "globals.css")) return false;
      // Only .ts/.tsx; globals.css is not in this list.
      return RAW_COLOR.test(readFileSync(file, "utf8"));
    });
    expect(offenders).toEqual([]);
  });
});
