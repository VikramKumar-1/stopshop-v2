const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const filesToCompress = [
  'bronze-hero.png',
  'bronze-kadai.png',
  'bronze-lota.png',
  'collection-tableware.png',
  'collection-pooja.png',
];

async function compressAll() {
  for (const filename of filesToCompress) {
    const inputPath = path.join(publicDir, filename);
    const outputName = filename.replace('.png', '.webp');
    const outputPath = path.join(publicDir, outputName);

    if (!fs.existsSync(inputPath)) {
      console.log(`Skip: ${filename}`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(600, 500, { fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const origSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
      const newSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
      console.log(`${filename}: ${origSize}KB -> ${outputName}: ${newSize}KB (${Math.round((1 - newSize/origSize) * 100)}% smaller)`);
    } catch (err) {
      console.error(`Error compressing ${filename}:`, err.message);
    }
  }
}

compressAll();
