const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const categoryImages = [
  'cat-brass-cookware.png',
  'cat-copper-products.png',
  'cat-dinner-sets.png',
  'cat-handicrafts.png',
  'cat-home-living.png',
  'cat-kitchen-racks.png',
  'cat-kitchen-utility.png',
  'cat-living-room.png',
  'cat-pooja-collection.png',
  'cat-steel-essentials.png',
];

async function compressImages() {
  for (const filename of categoryImages) {
    const inputPath = path.join(publicDir, filename);
    const outputName = filename.replace('.png', '.webp');
    const outputPath = path.join(publicDir, outputName);

    if (!fs.existsSync(inputPath)) {
      console.log(`Skip (not found): ${filename}`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(500, 400, { fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const origSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
      const newSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
      console.log(`${filename}: ${origSize}KB -> ${outputName}: ${newSize}KB (${Math.round((1 - newSize/origSize) * 100)}% smaller)`);
    } catch (err) {
      console.error(`Error compressing ${filename}:`, err.message);
    }
  }
  console.log('\nDone! All category images compressed.');
}

compressImages();
