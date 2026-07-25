const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

// Find the start of the button containing Worker Login QR
const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('Worker Login QR'));

if (startIdx !== -1) {
  // Trace back to the opening <button
  let buttonStart = startIdx;
  while (buttonStart >= 0 && !lines[buttonStart].includes('<button')) {
    buttonStart--;
  }
  
  // Trace forward to the closing </button>
  let buttonEnd = startIdx;
  while (buttonEnd < lines.length && !lines[buttonEnd].includes('</button>')) {
    buttonEnd++;
  }
  
  if (buttonStart !== -1 && buttonEnd !== -1) {
    lines.splice(buttonStart, buttonEnd - buttonStart + 1);
    fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', lines.join('\n'));
    console.log('Successfully removed QR button');
  } else {
    console.log('Found string but failed to find button tags');
  }
} else {
  console.log('Could not find Worker Login QR string');
}
