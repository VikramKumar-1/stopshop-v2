const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/tabs/WorkersTab.tsx', 'utf8');
console.log('Includes handleSearch function:', code.includes('const handleSearch = async'));
console.log('Includes handleCreateWorker function:', code.includes('const handleCreateWorker = async'));
console.log('Includes searchEmail state:', code.includes('searchEmail'));
console.log('Includes newWorkerName state:', code.includes('newWorkerName'));
