// Resize oversized product-bag webps to a display-appropriate size.
// The bag images render in ~220-230px boxes; 700px covers up to ~3x DPI while
// rendering crisper than a 3000px source (extreme downscaling softens in some
// browsers) and loading far faster. Originals are backed up to images/_src/.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES = path.join(__dirname, '..', 'images');
const BACKUP = path.join(IMAGES, '_src');
const MAX = 700;
const QUALITY = 82;

// Only the product-bag shots referenced by produse.html / app.js.
const FILES = [
  'fish-starter-first-feeding-inicio-plus.webp',
  'FISH - Starter - High Performance - INICIO 1.webp',
  'fish-grower-high-performance-efico-alpha.webp',
  'fish-grower-high-performance-efico.webp',
  'fish-grower-top-performance-efico-enviro.webp',
  'fish-grower-top-performance-efico-sigma.webp',
  'fish-grower-finisher-efico-sigma.webp',
  'HATCHERY-Hatchery-Broodstock-EFICO-Genio 1.webp',
  'salmon-grower-sustainability-blue-impact.webp',
];

(async () => {
  fs.mkdirSync(BACKUP, { recursive: true });
  for (const name of FILES) {
    const src = path.join(IMAGES, name);
    if (!fs.existsSync(src)) { console.log('skip (missing):', name); continue; }
    const backup = path.join(BACKUP, name);
    if (!fs.existsSync(backup)) fs.copyFileSync(src, backup); // preserve full-res once
    const buf = await sharp(backup)
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    fs.writeFileSync(src, buf);
    const before = fs.statSync(backup).size, after = buf.length;
    const meta = await sharp(buf).metadata();
    console.log(`${name}  ${meta.width}x${meta.height}  ${(before/1024|0)}KB -> ${(after/1024|0)}KB`);
  }
})();
