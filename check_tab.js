const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');
console.log('Has WorkersTab import:', code.includes('import WorkersTab'));
console.log('Has workers tab button:', code.includes('Team & Workers'));
console.log('Has workers tab render:', code.includes('<WorkersTab />'));
