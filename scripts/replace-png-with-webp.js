const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'features', 'home');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const updated = content
        .replace(/\/bronze-kadai\.png/g, '/bronze-kadai.webp')
        .replace(/\/bronze-hero\.png/g, '/bronze-hero.webp')
        .replace(/\/bronze-lota\.png/g, '/bronze-lota.webp')
        .replace(/\/collection-tableware\.png/g, '/collection-tableware.webp')
        .replace(/\/collection-pooja\.png/g, '/collection-pooja.webp');
      
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated PNG -> WebP in ${entry.name}`);
      }
    }
  }
}

replaceInDir(targetDir);
console.log('All homepage components updated to WebP!');
