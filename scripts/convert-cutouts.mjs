// Converts transparent PNG cut-outs in originals/cutouts/ into optimised,
// alpha-preserving WebP in assets/cutouts/ (no cropping — keeps the shape).
//   node scripts/convert-cutouts.mjs   (or: npm run cutouts)

import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const SRC = "originals/cutouts";
const OUT = "assets/cutouts";
const SIZE = 600;        // plenty for ~175px display at 3x

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => /\.(png|webp|tiff?)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.log("No cut-outs in originals/cutouts/ — drop transparent PNGs there first.");
  process.exit(0);
}

let total = 0;
for (const file of files) {
  const { name } = parse(file);
  const slug = name
    .toLowerCase()
    .replace(/-?\d+x\d+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const outPath = join(OUT, `${slug}.webp`);

  const info = await sharp(join(SRC, file))
    .resize(SIZE, SIZE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })          // sharp preserves the alpha channel
    .toFile(outPath);

  total += info.size;
  console.log(`  ✓ ${file}  ->  ${slug}.webp  (${(info.size / 1024).toFixed(0)} KB)`);
}

console.log(`\nDone — ${files.length} cut-out(s), ${(total / 1024).toFixed(0)} KB in ${OUT}/`);
