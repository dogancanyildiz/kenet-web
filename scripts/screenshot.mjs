#!/usr/bin/env node
// Visual check without a browser extension: drives the locally installed
// Google Chrome headless over the DevTools protocol (no npm dependency) and
// writes one PNG per viewport, colour scheme and accessibility variant.
//
//   node scripts/screenshot.mjs <url> <out-dir> [full]
//
// Produces <out-dir>/<width>-<scheme>[-ka|-rt].png for 375, 768 and 1280 px in
// light and dark, plus 375/1280 with Increase Contrast (prefers-contrast:
// more) and Reduce Transparency. "full" captures the whole page height
// instead of the first 900 px. The script also reports page scrollWidth per
// shot, so horizontal overflow shows up as a number, not a guess.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, outDir, mode] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("usage: node scripts/screenshot.mjs <url> <out-dir> [full]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const CHROME =
  process.env.CHROME_BIN ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9222 + Math.floor(Math.random() * 500);
const profile = join(tmpdir(), `kenet-app-shot-${process.pid}`);
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--no-first-run",
    "--hide-scrollbars",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i += 1) {
  try {
    const targets = await (
      await fetch(`http://127.0.0.1:${port}/json/list`)
    ).json();
    wsUrl = targets.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {
    /* chrome not up yet */
  }
  if (!wsUrl) await sleep(200);
}
if (!wsUrl) {
  chrome.kill();
  throw new Error("Chrome did not expose a page target");
}

const ws = new WebSocket(wsUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const next = ++id;
    pending.set(next, resolve);
    ws.send(JSON.stringify({ id: next, method, params }));
  });

const jobs = [];
for (const width of [375, 640, 768, 1280]) {
  for (const scheme of ["light", "dark"]) {
    jobs.push({ width, scheme, extra: [], suffix: "" });
  }
}
for (const width of [375, 1280]) {
  jobs.push({
    width,
    scheme: "dark",
    extra: [{ name: "prefers-contrast", value: "more" }],
    suffix: "-ka",
  });
  jobs.push({
    width,
    scheme: "dark",
    extra: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    suffix: "-rt",
  });
}

for (const job of jobs) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: job.width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: job.width < 700,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: job.scheme },
      ...job.extra,
    ],
  });
  await send("Page.navigate", { url });
  await sleep(1200);
  // Walk the page once so lazy images start loading, then return to the top.
  await send("Runtime.evaluate", {
    expression:
      "(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); })()",
    awaitPromise: true,
  });
  await sleep(600);
  // Layout metrics rather than scrollHeight: with device emulation the
  // documentElement can report the viewport height instead of the page.
  const metrics = (await send("Page.getLayoutMetrics")).result;
  const scrollWidth = Math.ceil(metrics.cssContentSize.width);
  const scrollHeight = Math.ceil(metrics.cssContentSize.height);
  const params = { format: "png" };
  if (mode === "full") {
    params.captureBeyondViewport = true;
    params.clip = {
      x: 0,
      y: 0,
      width: job.width,
      height: scrollHeight,
      scale: 1,
    };
  }
  const shot = await send("Page.captureScreenshot", params);
  const file = join(outDir, `${job.width}-${job.scheme}${job.suffix}.png`);
  writeFileSync(file, Buffer.from(shot.result.data, "base64"));
  const overflow = scrollWidth > job.width ? `  OVERFLOW ${scrollWidth}px` : "";
  console.log(`${file}  height ${scrollHeight}${overflow}`);
}

ws.close();
chrome.kill();
