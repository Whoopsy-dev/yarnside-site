// Converts full-res photos in originals/ into web-ready WebP in assets/images/.
// Run with:  npm run images
//
// - Resizes to 1200x1600 (3:4 portrait), centre-cropped to be safe.
// - Outputs WebP at quality 80 (good balance of crisp + light).
// - Filenames are slugified, so "01-Meadow Throw.jpg" -> "01-meadow-throw.webp".

import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const SRC = "originals";
const OUT = "assets/images";
const WIDTH = 1200;
const HEIGHT = 1600;
const QUALITY = 80;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.log("No images found in originals/ — drop your photos in there first.");
  process.exit(0);
}

let total = 0;
for (const file of files) {
  const { name } = parse(file);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const outPath = join(OUT, `${slug}.webp`);

  const info = await sharp(join(SRC, file))
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  total += info.size;
  console.log(`  ✓ ${file}  ->  ${slug}.webp  (${(info.size / 1024).toFixed(0)} KB)`);
}

console.log(`\nDone — ${files.length} image(s), ${(total / 1024 / 1024).toFixed(1)} MB total in ${OUT}/`);
