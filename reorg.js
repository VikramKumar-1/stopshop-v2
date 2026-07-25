const fs = require('fs');
fs.rmSync('src/app/login', { recursive: true, force: true });
fs.mkdirSync('src/app/worker/login', { recursive: true });
console.log('Done');
