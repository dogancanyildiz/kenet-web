#!/usr/bin/env node
// Renders the app icon SVG (copied from kenet/App/Support/AppIcon) into the
// PNG sizes the browsers and Apple devices ask for. Run after the icon
// changes; the PNGs are committed so the build needs no rasterizer.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appDir = fileURLToPath(new URL("../src/app/", import.meta.url));
const source = `${appDir}icon.svg`;

const targets = [
  { file: "icon.png", size: 192 },
  { file: "apple-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  const png = await sharp(source, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(`${appDir}${file}`, png);
  console.log(`${file}: ${size}×${size}, ${png.length} bytes`);
}
