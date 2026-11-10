#!/usr/bin/env node
// Converts app screenshots (the Kenet repo's snapshot PNGs) into the WebP
// files the site serves. Usage:
//   node scripts/optimize-screens.mjs <source-dir-with-pngs>
// Phone shots (780×1688) stay at full width, which is 2x for the 390 px
// device frame; the Mac shot is capped at 1600 px. Output goes to
// public/screens/<name>.webp and the PNGs are not committed.
import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/optimize-screens.mjs <source-dir>");
  process.exit(1);
}
const outDir = fileURLToPath(new URL("../public/screens/", import.meta.url));

for (const file of await readdir(source)) {
  if (!file.endsWith(".png")) continue;
  const { name } = parse(file);
  const image = sharp(join(source, file));
  const { width } = await image.metadata();
  const out = join(outDir, `${name}.webp`);
  const buffer = await image
    .resize({ width: Math.min(width ?? 1600, 1600), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await sharp(buffer).toFile(out);
  console.log(`${name}.webp: ${buffer.length} bytes`);
}
