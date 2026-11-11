#!/usr/bin/env node
// Converts Kenet app screenshots into the WebP files the site serves.
// Usage:
//   node scripts/optimize-screens.mjs [source root]
// The source root defaults to .local/kaynak-ekranlar (gitignored). It holds
// one folder per capture run; SHOTS below names the run and file for each
// output, so a newer run is picked by editing one path. PNGs are not
// committed.
//
// Phones: the iPhone captures are 1206×2622 (3x of 402×874) and are scaled
// to 780 px wide without cropping. The status bar is a clean 09:41 with a
// full battery, and the floating tab bar is part of how the app looks, so
// both stay; DeviceFrame uses the same 1206:2622 ratio.
//
// Tablet: the iPad captures are stored as 2064×2752 with EXIF orientation 8;
// rotate() applies it, giving the 2752×2064 landscape image. The top strip
// (status bar with the test build's name) and the bottom strip (window
// resize handle in the corner) are cropped, then the result is scaled to
// 1600 px wide.
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const QUALITY = 75;
const PHONE = { width: 1206, height: 2622, outWidth: 780 };
const TABLET = { cropTop: 56, cropBottom: 64, outWidth: 1600 };

const IPHONE = "k5-iphone";
const IPAD = "tur-fark3birlesik-ipad";

/** [source file, output name, kind] */
const SHOTS = [
  [`${IPHONE}/01-bugun.png`, "today-light", "phone"],
  [`${IPHONE}/20-koyu-bugun.png`, "today-dark", "phone"],
  [`${IPHONE}/10-kisi-sayfasi.png`, "person-light", "phone"],
  [`${IPHONE}/20-koyu-kisi-sayfasi.png`, "person-dark", "phone"],
  [`${IPHONE}/09-kisiler-liste.png`, "people-light", "phone"],
  [`${IPHONE}/20-koyu-kisiler.png`, "people-dark", "phone"],
  [`${IPHONE}/06-gorevler-kanban.png`, "kanban-light", "phone"],
  [`${IPHONE}/20-koyu-kanban.png`, "kanban-dark", "phone"],
  [`${IPHONE}/12-hedef-ayrintisi.png`, "goal-light", "phone"],
  [`${IPHONE}/20-koyu-hedef-ayrintisi.png`, "goal-dark", "phone"],
  [`${IPAD}/10-kisi-sayfasi.png`, "ipad-person-light", "tablet"],
  [`${IPAD}/20-koyu-kisi-sayfasi.png`, "ipad-person-dark", "tablet"],
];

const root = resolve(process.argv[2] ?? ".local/kaynak-ekranlar");
const outDir = fileURLToPath(new URL("../public/screens/", import.meta.url));
await mkdir(outDir, { recursive: true });

let total = 0;
for (const [file, name, kind] of SHOTS) {
  const path = join(root, file);
  // rotate() with no angle applies the EXIF orientation.
  const upright = await sharp(path).rotate().toBuffer();
  const { width = 0, height = 0 } = await sharp(upright).metadata();
  const image = sharp(upright);
  if (kind === "phone") {
    if (width !== PHONE.width || height !== PHONE.height) {
      throw new Error(
        `${file}: expected ${PHONE.width}×${PHONE.height}, got ${width}×${height}`
      );
    }
    image.resize({ width: PHONE.outWidth });
  } else {
    if (width <= height) {
      throw new Error(
        `${file}: expected a landscape iPad shot, got ${width}×${height}`
      );
    }
    image
      .extract({
        left: 0,
        top: TABLET.cropTop,
        width,
        height: height - TABLET.cropTop - TABLET.cropBottom,
      })
      .resize({ width: TABLET.outWidth });
  }
  const buffer = await image.webp({ quality: QUALITY, effort: 6 }).toBuffer();
  // Write the encoded bytes as is; re-encoding through sharp would
  // compress twice.
  await writeFile(join(outDir, `${name}.webp`), buffer);
  const meta = await sharp(buffer).metadata();
  total += buffer.length;
  console.log(
    `${name}.webp: ${meta.width}×${meta.height}, ${buffer.length} bytes`
  );
}
console.log(`total: ${total} bytes`);
