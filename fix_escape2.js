const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', code);
