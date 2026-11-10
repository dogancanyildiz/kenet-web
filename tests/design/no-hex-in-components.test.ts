import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Design rule 1 (docs/design.md): colour comes from the tokens in
 * globals.css, never from a literal in a component. Tailwind arbitrary values
 * (`text-[#000]`) and inline hex both count.
 */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry) ? [full] : [];
  });
}

const HEX = /#[0-9a-f]{3,8}\b/i;

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
});
