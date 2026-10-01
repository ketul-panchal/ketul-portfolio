import manifest from '../data/projectImages.json';

const BASE = import.meta.env.BASE_URL;
const BRAND_RGB = '255, 107, 53';

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`;
};

/**
 * Sources for a project image: the trimmed WebP versions made by
 * scripts/optimize-project-images.mjs, or the original file if it hasn't been processed.
 *
 * `ratio` is width / height and `rgb` is a glow colour (as "r, g, b") picked from the image.
 */
export function getProjectImage(image) {
  const entry = manifest[image];
  if (!entry) return { src: BASE + image, ratio: 16 / 10, rgb: BRAND_RGB };

  const widths = Object.keys(entry.srcSet).map(Number).sort((a, b) => a - b);
  return {
    src: BASE + entry.srcSet[widths[0]],
    srcSet: widths.map((w) => `${BASE}${entry.srcSet[w]} ${w}w`).join(', '),
    width: entry.width,
    height: entry.height,
    ratio: entry.width / entry.height,
    rgb: entry.color ? hexToRgb(entry.color) : BRAND_RGB,
  };
}
