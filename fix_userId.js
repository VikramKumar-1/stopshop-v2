const fs = require('fs');
const files = [
  'src/app/api/vendor/workers/route.ts',
  'src/app/api/vendor/workers/search/route.ts',
  'src/app/api/vendor/workers/assign/route.ts',
  'src/app/api/vendor/workers/magic-link/route.ts'
];
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/user\.id/g, 'user.userId');
  fs.writeFileSync(f, code);
});
