import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex } from "./contrast";

/**
 * Reads the Şafak tokens out of src/app/globals.css and checks the contrast
 * floors the design language sets (kenet/docs/design.md, "Kontrast"): text
 * roles 4.5:1 and the control line 3:1, measured against the page, the card
 * and the well, in light and dark and in both Increase Contrast variants.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

type Block = Record<string, string>;

function tokensIn(blockSource: string): Block {
  const tokens: Block = {};
  for (const match of blockSource.matchAll(
    /--([a-z-]+):\s*(#[0-9a-f]{6});/gi
  )) {
    tokens[match[1]!] = match[2]!;
  }
  return tokens;
}

/**
 * Body of the first `selector {` rule after `after` (a media query), or
 * from the top of the file when `after` is null.
 */
function ruleBody(after: string | null, selector: string): string {
  const start = after ? css.indexOf(after) : 0;
  if (start < 0) throw new Error(`media query not found: ${after}`);
  const ruleStart = css.indexOf(`${selector} {`, start);
  if (ruleStart < 0) throw new Error(`rule not found: ${selector}`);
  const bodyStart = css.indexOf("{", ruleStart) + 1;
  let depth = 1;
  let index = bodyStart;
  while (depth > 0 && index < css.length) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    index += 1;
  }
  return css.slice(bodyStart, index - 1);
}

function block(after: string | null, selector = ":root"): Block {
  return tokensIn(ruleBody(after, selector));
}

const SYSTEM_DARK = ':root:not([data-theme="light"])';
const PINNED_DARK = ':root[data-theme="dark"]';
const DARK_QUERY = "@media (prefers-color-scheme: dark) {";
const KA_QUERY = "@media (prefers-contrast: more) {";
const KA_DARK_QUERY =
  "@media (prefers-contrast: more) and (prefers-color-scheme: dark) {";

const light = block(null);
const dark = { ...light, ...block(DARK_QUERY, SYSTEM_DARK) };
const lightKa = { ...light, ...block(KA_QUERY) };
// Light KA (:root) still applies in dark for any token the dark blocks do
// not set, so it sits under them here as it does in the cascade.
const darkKa = {
  ...light,
  ...lightKa,
  ...dark,
  ...block(KA_DARK_QUERY, SYSTEM_DARK),
};

const variants = { light, dark, lightKa, darkKa };
const surfaces = ["paper", "surface", "well"] as const;
const textRoles = [
  "text",
  "text-secondary",
  "text-tertiary",
  "accent",
  "warning",
  "danger",
  "person",
  "place",
] as const;

function ratio(tokens: Block, fg: string, bg: string): number {
  const f = tokens[fg];
  const b = tokens[bg];
  if (!f || !b) throw new Error(`missing token ${fg} or ${bg}`);
  return contrastRatio(parseHex(f), parseHex(b));
}

describe("Şafak colour tokens", () => {
  it("defines every surface and foreground role in every variant", () => {
    for (const tokens of Object.values(variants)) {
      for (const name of [...surfaces, ...textRoles, "control", "on-accent"]) {
        expect(tokens[name], name).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it.each(Object.entries(variants))(
    "%s: text roles reach 4.5:1 on the page, the card and the well",
    (_name, tokens) => {
      for (const role of textRoles) {
        for (const surface of surfaces) {
          expect(
            ratio(tokens, role, surface),
            `${role} on ${surface}`
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  );

  it.each(Object.entries(variants))(
    "%s: the control line reaches 3:1 and onAccent reads on the accent fill",
    (_name, tokens) => {
      for (const surface of surfaces) {
        expect(ratio(tokens, "control", surface)).toBeGreaterThanOrEqual(3);
      }
      expect(ratio(tokens, "on-accent", "accent")).toBeGreaterThanOrEqual(4.5);
    }
  );

  it("pins the same dark values the system query uses", () => {
    const normalise = (body: string) => body.replace(/\s+/g, " ").trim();
    // Pinned dark sits at the top level, the KA copy inside the KA query.
    expect(normalise(ruleBody(null, PINNED_DARK))).toBe(
      normalise(ruleBody(DARK_QUERY, SYSTEM_DARK))
    );
    // The KA copy for the pinned theme is the first one after the KA dark
    // query.
    expect(normalise(ruleBody(KA_DARK_QUERY, PINNED_DARK))).toBe(
      normalise(ruleBody(KA_DARK_QUERY, SYSTEM_DARK))
    );
  });

  it("mirrors the page background in the layout's theme-color", () => {
    const layout = readFileSync(
      join(process.cwd(), "src/app/[lang]/layout.tsx"),
      "utf8"
    );
    expect(layout).toContain(`color: "${light.paper}"`);
    expect(layout).toContain(`color: "${dark.paper}"`);
  });
});
