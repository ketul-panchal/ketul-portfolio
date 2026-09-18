/**
 * Converts the full-resolution project screenshots kept in assets-src/project
 * into responsive, web-sized WebP files under public/assets/project.
 *
 * The originals are multi-megabyte PNG exports — decoding those mid-scroll is
 * what made the Projects stack stutter and tear, so they live OUTSIDE public/
 * and never ship. Drop a new screenshot into assets-src/project, run this, then
 * point projectsData.js at the generated base name.
 *
 *   npm run optimize:images
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = 'assets-src/project';
const OUT_DIR = 'public/assets/project';

// One file per breakpoint so the browser downloads what it actually paints.
const WIDTHS = [720, 1200];
const QUALITY = 80;

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

await mkdir(OUT_DIR, { recursive: true });

const sources = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

let before = 0;
let after = 0;

for (const file of sources) {
  const srcPath = path.join(SRC_DIR, file);
  const base = path.parse(file).name;
  const meta = await sharp(srcPath).metadata();
  before += (await stat(srcPath)).size;

  for (const width of WIDTHS) {
    const outPath = path.join(OUT_DIR, `${base}-${width}.webp`);
    await sharp(srcPath)
      // Never upscale — a 851px source stays 851px.
      .resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath);
    after += (await stat(outPath)).size;
  }

  console.log(`${base}: ${meta.width}x${meta.height} -> ${WIDTHS.join('w, ')}w webp`);
}

console.log(`\nSources ${mb(before)} MB -> generated ${mb(after)} MB across ${WIDTHS.length} widths.`);
