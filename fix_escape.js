const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/login/page.tsx', code);
