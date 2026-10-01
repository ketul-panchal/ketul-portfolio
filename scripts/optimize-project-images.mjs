/**
 * Builds light-weight versions of the project images for the Featured Work showcase:
 * transparent padding trimmed off, resized to 800px and 1600px wide WebP files in
 * public/assets/project/optimized/, plus src/data/projectImages.json with each
 * image's size, srcset entries and a glow colour picked from the image.
 *
 *   npm i -D sharp                                (once)
 *   node scripts/optimize-project-images.mjs     (after adding or changing a project image)
 *
 * Projects that have no entry in the JSON still work; the showcase falls back to the
 * original image.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projects } from '../src/data/projectsData.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = 'assets/project/optimized';
const WIDTHS = [800, 1600];

const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

// Average colour of the most common vivid hue in the image (null for greyscale images)
async function vividColor(sharp, file) {
  const { data } = await sharp(file).resize(96).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buckets = Array.from({ length: 12 }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));
  let pixels = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    pixels++;
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if (s < 0.45 || l < 0.25 || l > 0.7) continue;
    const bucket = buckets[Math.floor(h / 30) % 12];
    bucket.weight += s;
    bucket.r += data[i] * s;
    bucket.g += data[i + 1] * s;
    bucket.b += data[i + 2] * s;
  }
  const best = buckets.reduce((a, b) => (b.weight > a.weight ? b : a));
  if (!pixels || best.weight / pixels < 0.006) return null;
  return toHex(best.r / best.weight, best.g / best.weight, best.b / best.weight);
}

export async function optimizeProjectImages(sharp) {
  await mkdir(path.join(ROOT, 'public', OUT_DIR), { recursive: true });
  const manifest = {};

  for (const { image } of projects) {
    if (!image || manifest[image]) continue;
    const source = path.join(ROOT, 'public', image);
    const trimmed = await sharp(source).trim({ threshold: 10 }).png().toBuffer({ resolveWithObject: true });
    const { width, height } = trimmed.info;
    const name = path.basename(image, path.extname(image));

    const srcSet = {};
    for (const w of WIDTHS.filter((w) => w < width).concat(width < WIDTHS.at(-1) ? [width] : [])) {
      const file = `${OUT_DIR}/${name}-${w}.webp`;
      await sharp(trimmed.data).resize({ width: w }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(path.join(ROOT, 'public', file));
      srcSet[w] = file;
    }

    manifest[image] = { width, height, srcSet, color: await vividColor(sharp, trimmed.data) };
    console.log(`${image} → ${Object.keys(srcSet).join('w, ')}w (${width}x${height}) ${manifest[image].color ?? ''}`);
  }

  await writeFile(path.join(ROOT, 'src/data/projectImages.json'), JSON.stringify(manifest, null, 2) + '\n');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sharp = await import('sharp').then((m) => m.default).catch(() => {
    console.error('This script needs sharp. Install it with: npm i -D sharp');
    process.exit(1);
  });
  await optimizeProjectImages(sharp);
}
