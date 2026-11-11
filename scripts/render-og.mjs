#!/usr/bin/env node
// Renders the Open Graph card (public/og/kenet-2026-11.png, 1200×630) from committed
// inputs only: the app icon (src/app/icon.svg) and three real screens
// (public/screens/today-light, person-light, ipad-person-light). Run after
// any of them changes; the PNG is committed so the build needs no rasterizer.
//
//   npm run og
//
// The card carries no text. sharp rasterizes SVG <text> through librsvg and
// whatever fonts the machine has, so a text card would differ between
// machines; the site ships no font file (Şafak rule 8). The title, the
// description and the alt text travel next to the image in the page metadata,
// in the page's own language (messages/<locale>/seo.json).
//
// One card serves both locales: the screens are the Turkish UI tour, so an
// "English" card would be the same pixels. When English captures exist, add an
// entry to CARDS and point OG_IMAGES in src/lib/seo.ts at it.
//
// Colours are the light Şafak tokens from src/app/globals.css (--paper,
// --glow-a, --glow-b at 16 %, --device-bezel). Real screens only, no tilt or
// filter (docs/design.md rule 5a).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repo = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

/** Light Şafak tokens, read from globals.css so a palette change follows. */
async function readTokens() {
  const css = await readFile(repo("src/app/globals.css"), "utf8");
  // Only the first (light) :root block: a token missing there must fail
  // instead of silently picking up the dark value further down.
  const start = css.indexOf(":root {");
  const root = css.slice(start, css.indexOf("\n}", start));
  const token = (name) => {
    const match = root.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    if (!match) throw new Error(`token --${name} not found in globals.css`);
    return match[1];
  };
  return {
    paper: token("paper"),
    glowA: token("glow-a"),
    glowB: token("glow-b"),
    bezel: token("device-bezel"),
  };
}

const CARDS = [{ file: "kenet-2026-11.png" }];

function background({ paper, glowA, glowB }) {
  // Same shape as --glow: an ellipse from the top left, plum then amber,
  // both at 16 % on the light paper.
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="144" cy="0" r="900" gradientTransform="translate(144 0) scale(1 0.667) translate(-144 0)">
      <stop offset="0" stop-color="${glowA}" stop-opacity="0.16"/>
      <stop offset="0.38" stop-color="${glowB}" stop-opacity="0.16"/>
      <stop offset="0.7" stop-color="${glowB}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${paper}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
</svg>`);
}

/** Soft single shadow under a device, like --device-shadow. */
function shadow(width, height, radius) {
  const pad = 60;
  return {
    pad,
    svg: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width + pad * 2}" height="${height + pad * 2}">
  <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>
  <rect x="${pad}" y="${pad + 24}" width="${width}" height="${height - 24}" rx="${radius}" fill="#000" fill-opacity="0.22" filter="url(#s)"/>
</svg>`),
  };
}

function roundedMask(width, height, radius) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" fill="#fff"/></svg>`
  );
}

/** A screen inside a black bezel; returns a PNG buffer and its size. */
async function device(screenPath, { width, bezel, radius, bezelColor }) {
  const screenWidth = width - bezel * 2;
  const resized = await sharp(screenPath)
    .resize({ width: screenWidth })
    .png()
    .toBuffer();
  const { height: screenHeight = 0 } = await sharp(resized).metadata();
  const innerRadius = Math.max(radius - bezel, 0);
  const screen = await sharp(resized)
    .composite([
      {
        input: roundedMask(screenWidth, screenHeight, innerRadius),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
  const height = screenHeight + bezel * 2;
  const frame = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" fill="${bezelColor}"/></svg>`
  );
  const png = await sharp(frame)
    .composite([{ input: screen, left: bezel, top: bezel }])
    .png()
    .toBuffer();
  return { png, width, height, radius };
}

/** Places a device with its shadow; parts outside the canvas are cropped. */
async function place(item, left, top) {
  const { pad, svg } = shadow(item.width, item.height, item.radius);
  const layers = [
    {
      input: await sharp(svg).png().toBuffer(),
      left: left - pad,
      top: top - pad,
    },
    { input: item.png, left, top },
  ];
  return Promise.all(layers.map((layer) => clip(layer)));
}

/** sharp rejects overlays that leave the canvas; crop them to it first. */
async function clip({ input, left, top }) {
  const { width = 0, height = 0 } = await sharp(input).metadata();
  const x0 = Math.max(left, 0);
  const y0 = Math.max(top, 0);
  const x1 = Math.min(left + width, WIDTH);
  const y1 = Math.min(top + height, HEIGHT);
  const cropped = await sharp(input)
    .extract({
      left: x0 - left,
      top: y0 - top,
      width: x1 - x0,
      height: y1 - y0,
    })
    .toBuffer();
  return { input: cropped, left: x0, top: y0 };
}

const tokens = await readTokens();
const outDir = repo("public/og/");
await mkdir(outDir, { recursive: true });

for (const card of CARDS) {
  const icon = await sharp(repo("src/app/icon.svg"), { density: 288 })
    .resize(112, 112)
    .composite([{ input: roundedMask(112, 112, 25), blend: "dest-in" }])
    .png()
    .toBuffer();

  const tablet = await device(repo("public/screens/ipad-person-light.webp"), {
    width: 700,
    bezel: 12,
    radius: 28,
    bezelColor: tokens.bezel,
  });
  const today = await device(repo("public/screens/today-light.webp"), {
    width: 236,
    bezel: 8,
    radius: 40,
    bezelColor: tokens.bezel,
  });
  const person = await device(repo("public/screens/person-light.webp"), {
    width: 256,
    bezel: 8,
    radius: 42,
    bezelColor: tokens.bezel,
  });

  const layers = [
    ...(await place(tablet, 452, 70)),
    ...(await place(today, 72, 214)),
    ...(await place(person, 300, 150)),
    { input: icon, left: 72, top: 64 },
  ];

  const png = await sharp(background(tokens))
    .composite(layers)
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  await writeFile(`${outDir}${card.file}`, png);
  const meta = await sharp(png).metadata();
  console.log(
    `og/${card.file}: ${meta.width}×${meta.height}, ${png.length} bytes`
  );
}
