const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');
const lines = code.split('\n');
const studioLines = lines.filter(l => l.includes('/worker/studio'));
console.log(studioLines);
