const fs = require('fs');
let code1 = fs.readFileSync('src/app/api/vendor/workers/route.ts', 'utf8');
code1 = code1.replace(/verifyAuth/g, 'verifyToken');
fs.writeFileSync('src/app/api/vendor/workers/route.ts', code1);

let code2 = fs.readFileSync('src/app/api/vendor/workers/search/route.ts', 'utf8');
code2 = code2.replace(/verifyAuth/g, 'verifyToken');
fs.writeFileSync('src/app/api/vendor/workers/search/route.ts', code2);

let code3 = fs.readFileSync('src/app/api/vendor/workers/assign/route.ts', 'utf8');
code3 = code3.replace(/verifyAuth/g, 'verifyToken');
fs.writeFileSync('src/app/api/vendor/workers/assign/route.ts', code3);
