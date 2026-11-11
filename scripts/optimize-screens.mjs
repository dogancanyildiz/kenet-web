#!/usr/bin/env node
// Converts app screenshots (the Kenet repo's snapshot PNGs) into the WebP
// files the site serves. Usage:
//   node scripts/optimize-screens.mjs <kenet>/Tests/JournalTests/Snapshots/__Snapshots__
//
// Phone shots are 780×1688 (2x of a 390×844 iPhone). The snapshots have no
// tab bar, so the Today screen ends in ~240 px of empty background under
// the composer, and a full-height list ends in a half-visible row. Every
// phone shot is therefore cropped to the same PHONE_HEIGHT, chosen so the
// cut falls between rows on Tasks (row separator) and between cards on
// Kanban, and Today keeps a home-indicator-sized margin under the composer.
// All phones share one aspect ratio (390:774) for DeviceFrame. Change the
// height here and in device-frame.tsx together.
//
// The Mac shot is scaled to 1600 px wide. PNGs are not committed.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PHONE_WIDTH = 780;
const PHONE_HEIGHT = 1548;
const MAC_WIDTH = 1600;

const SHOTS = [
  ["TodayScreenSnapshotTests/today.todayLight.png", "today-light", "phone"],
  ["TodayScreenSnapshotTests/today.todayDark.png", "today-dark", "phone"],
  ["TasksSnapshotTests/tasksScreen.tasksLight.png", "tasks-light", "phone"],
  ["TasksSnapshotTests/tasksScreen.tasksDark.png", "tasks-dark", "phone"],
  ["TasksSnapshotTests/tasksScreen.kanbanLight.png", "kanban-light", "phone"],
  ["TasksSnapshotTests/tasksScreen.kanbanDark.png", "kanban-dark", "phone"],
  ["TasksSnapshotTests/tasksMac.kanbanMacLight.png", "mac-kanban-light", "mac"],
];

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/optimize-screens.mjs <__Snapshots__ dir>");
  process.exit(1);
}
const outDir = fileURLToPath(new URL("../public/screens/", import.meta.url));
await mkdir(outDir, { recursive: true });

let total = 0;
for (const [file, name, kind] of SHOTS) {
  const image = sharp(join(source, file));
  const { width, height } = await image.metadata();
  if (kind === "phone") {
    if (width !== PHONE_WIDTH || (height ?? 0) < PHONE_HEIGHT) {
      throw new Error(
        `${file}: expected ${PHONE_WIDTH} px wide and at least ${PHONE_HEIGHT} px tall, got ${width}×${height}`
      );
    }
    image.extract({
      left: 0,
      top: 0,
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
    });
  } else {
    image.resize({ width: MAC_WIDTH, withoutEnlargement: true });
  }
  const buffer = await image.webp({ quality: 80 }).toBuffer();
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
