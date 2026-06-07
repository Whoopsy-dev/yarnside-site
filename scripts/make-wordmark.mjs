// Generates an SVG path for the "yarnside" wordmark from the Sacramento font,
// so it can be drawn stroke-by-stroke (pen effect) on the page.
//   node scripts/make-wordmark.mjs

import opentype from "opentype.js";
import { readFileSync } from "node:fs";

const font = opentype.parse(readFileSync("scripts/fonts/Sacramento-Regular.ttf").buffer);
const text = "yarnside";
const fontSize = 200;

const path = font.getPath(text, 0, 0, fontSize);
const d = path.toPathData(2);
const bb = path.getBoundingBox();

const pad = 12;
const x = bb.x1 - pad;
const y = bb.y1 - pad;
const w = bb.x2 - bb.x1 + pad * 2;
const h = bb.y2 - bb.y1 + pad * 2;

console.log("viewBox:", `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
console.log("d:");
console.log(d);
