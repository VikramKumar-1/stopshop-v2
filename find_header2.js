const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');
const lines = code.split('\n');
const matchIdx = lines.findIndex(l => l.includes('vendorStatus === \'APPROVED\''));
console.log('Match index:', matchIdx);
if (matchIdx !== -1) {
  console.log(lines.slice(matchIdx - 10, matchIdx + 10).join('\n'));
}
