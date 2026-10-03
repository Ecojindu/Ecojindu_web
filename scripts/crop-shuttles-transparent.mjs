import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public/images/our-services-shuttles.png");
const output = path.join(root, "public/images/our-services-shuttles-cropped.png");

/** Target panel green #009E61 */
const KEY = { r: 0, g: 158, b: 97 };

function colorDistance(r, g, b) {
  return Math.sqrt(
    (r - KEY.r) ** 2 + (g - KEY.g) ** 2 + (b - KEY.b) ** 2
  );
}

function isGreenScreen(r, g, b, a) {
  if (a < 10) return true;
  const dist = colorDistance(r, g, b);
  // Solid background and green-tinted shadows
  if (dist < 55) return true;
  // Green-dominant pixels (background bleed)
  if (g > r + 25 && g > b + 15 && g > 80 && dist < 90) return true;
  return false;
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const a = out[i + 3];
  const dist = colorDistance(r, g, b);

  if (isGreenScreen(r, g, b, a)) {
    out[i + 3] = 0;
  } else if (dist < 75) {
    // Soft edge on shadow fringe
    const t = (dist - 55) / 20;
    out[i + 3] = Math.round(Math.min(a, 255 * Math.max(0, Math.min(1, t))));
  }
}

await sharp(out, { raw: { width, height, channels } })
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9 })
  .toFile(output);

const meta = await sharp(output).metadata();
console.log("Wrote", output, meta.width, "x", meta.height);
