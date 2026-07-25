const fs = require('fs');
const path = require('path');

const srcDir = path.join('src', 'app', 'vendor', 'camera');
const destDir = path.join('src', 'app', 'worker', 'studio');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(path.join(srcDir, 'page.tsx'))) {
  fs.renameSync(path.join(srcDir, 'page.tsx'), path.join(destDir, 'page.tsx'));
}

if (fs.existsSync(srcDir)) {
  fs.rmdirSync(srcDir, { recursive: true });
}
console.log('Moved successfully!');
