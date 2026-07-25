const fs = require('fs');
let code = fs.readFileSync('src/app/worker/studio/page.tsx', 'utf8');

code = code.replace(
  /router\.push\(`\/login\?redirect=\${encodeURIComponent\(window\.location\.pathname\)}`\);/g,
  'router.push(`/worker/login?redirect=${encodeURIComponent(window.location.pathname)}`);'
);

code = code.replace(
  /router\.push\("\/login"\);/g,
  'router.push("/worker/login");'
);

fs.writeFileSync('src/app/worker/studio/page.tsx', code);
