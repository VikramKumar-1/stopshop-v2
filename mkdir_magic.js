const fs = require('fs');
fs.mkdirSync('src/app/api/vendor/workers/magic-link', { recursive: true });
fs.mkdirSync('src/app/api/auth/worker-magic', { recursive: true });
console.log('Dirs created');
