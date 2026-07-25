const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

const oldButton = `              <button
                onClick={handleOpenMobileQR}
                className="px-3 py-2.5 bg-surface border border-border hover:border-orange-500 text-heading font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scan QR to open on mobile"
              >
                <span>📱 Scan QR</span>
              </button>`;

const newButton = `              <button
                onClick={handleOpenMobileQR}
                className="px-3 py-2.5 bg-surface border border-border hover:border-orange-500 text-heading font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scan QR to open on mobile"
              >
                <span>📱 Mobile QR</span>
              </button>
              <button
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

code = code.replace(oldButton, newButton);

// Also need to update the `/vendor/camera` route to `/worker/studio` here
code = code.replace(
  'onClick={() => router.push("/vendor/camera")}',
  'onClick={() => router.push("/worker/studio")}'
);

// Add workerQrUrl state if not exists
if (!code.includes('workerQrUrl')) {
  code = code.replace(
    'const [authorized, setAuthorized] = useState<boolean | null>(null);',
    'const [authorized, setAuthorized] = useState<boolean | null>(null);\n  const [workerQrUrl, setWorkerQrUrl] = useState<string | null>(null);'
  );

  const modalJSX = `
      <AnimatePresence>
        {workerQrUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setWorkerQrUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setWorkerQrUrl(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Camera size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Worker Packing Studio</h3>
              <p className="text-sm text-gray-500 mb-6">Have your workers scan this QR code to login and pack orders for your store.</p>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-center mb-6">
                <img src={workerQrUrl} alt="Worker QR Code" className="w-48 h-48 rounded-xl shadow-sm" />
              </div>

              <div className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded-lg">
                Code: VEND-{vendor?.id}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  `;
  
  // Inject the modal before deleteProductModal
  code = code.replace(
    '{deleteProductModal && (',
    modalJSX + '\n      {deleteProductModal && ('
  );
}

fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
console.log('Successfully injected QR code logic!');
