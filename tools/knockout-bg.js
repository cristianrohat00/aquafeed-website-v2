// Make the white background of an opaque bag shot transparent so it matches the
// other (already transparent) bags over the box's light-grey gradient.
// Strategy: flood-fill from the border across near-white pixels and set them
// transparent. Interior whites (the bag label) survive because they're walled
// off from the border by the bag's printed/coloured edges.
const sharp = require('sharp');
const path = require('path');

const IMAGES = path.join(__dirname, '..', 'images');
const SRC = path.join(IMAGES, '_src');

// min-channel >= T  => treated as "background white" (also catches light shadow)
const T = parseInt(process.env.T || '232', 10);
const WORK = 1400;            // flood-fill resolution
const OUT = parseInt(process.env.OUT || '700', 10);
const PREVIEW = process.env.PREVIEW === '1';

async function knockout(name) {
  const { data, info } = await sharp(path.join(SRC, name))
    .resize({ width: WORK, height: WORK, fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info; // ch === 4
  const isBg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (isBg[p]) return;
    const o = p * ch;
    const mn = Math.min(data[o], data[o + 1], data[o + 2]);
    if (mn < T) return;        // not white enough -> a wall (bag edge)
    isBg[p] = 1; stack.push(p);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop(), x = p % w, y = (p - x) / w;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  for (let p = 0; p < w * h; p++) if (isBg[p]) data[p * ch + 3] = 0;

  let img = sharp(data, { raw: { width: w, height: h, channels: ch } })
    .resize({ width: OUT, height: OUT, fit: 'inside' }); // downscale anti-aliases the alpha edge

  if (PREVIEW) {
    return img.flatten({ background: '#e2ecf5' }).png()
      .toFile(path.join(__dirname, 'preview-' + name.replace(/\.webp$/, '') + '.png'))
      .then(() => console.log('preview written for', name, '(T=' + T + ')'));
  }
  const buf = await img.webp({ quality: 82 }).toBuffer();
  require('fs').writeFileSync(path.join(IMAGES, name), buf);
  console.log(name, '-> transparent', OUT + 'px', (buf.length / 1024 | 0) + 'KB', '(T=' + T + ')');
}

(async () => {
  const files = [
    'FISH - Starter - High Performance - INICIO 1.webp',
    'HATCHERY-Hatchery-Broodstock-EFICO-Genio 1.webp',
  ];
  for (const f of files) await knockout(f);
})();
