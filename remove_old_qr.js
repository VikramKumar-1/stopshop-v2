const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

const qrButton = `              <button
                onClick={() => {
                  const url = \`\${window.location.origin}/worker/login?invite=VEND-\${vendor.id}\`;
                  QRCode.toDataURL(url, { width: 300, margin: 2 }).then(setWorkerQrUrl);
                }}
                className="px-3 py-2.5 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-400 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Generate QR Code for Workers"
              >
                <Camera size={14} className="text-orange-500" />
                <span>Worker Login QR</span>
              </button>`;

if (code.includes(qrButton)) {
  code = code.replace(qrButton, '');
  fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
  console.log('Successfully removed old QR button from header');
} else {
  console.log('Could not find old QR button in header');
}
