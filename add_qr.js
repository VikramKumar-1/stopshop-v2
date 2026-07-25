const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

const oldHeader = `              {vendor?.vendorStatus === 'APPROVED' && (
                <div className="bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-lg flex items-center gap-2" title="Give this code to your workers so they can access the Camera Studio">
                  <span className="text-[9px] uppercase font-bold text-orange-600">Worker Code:</span>
                  <span className="font-mono text-[11px] font-black text-orange-500">VEND-{vendor?.id}</span>
                </div>
              )}`;

const newHeader = `              {vendor?.vendorStatus === 'APPROVED' && (
                <button 
                  onClick={() => {
                    const url = \`\${window.location.origin}/worker/login?invite=VEND-\${vendor.id}\`;
                    QRCode.toDataURL(url, { width: 300, margin: 2 }).then(setWorkerQrUrl);
                  }}
                  className="bg-orange-500/10 hover:bg-orange-500/20 transition-colors border border-orange-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Generate QR Code for Workers"
                >
                  <Camera size={14} className="text-orange-600" />
                  <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wide">Worker QR Code</span>
                </button>
              )}`;

if (code.includes('title="Give this code to your workers so they can access the Camera Studio"')) {
  code = code.replace(oldHeader, newHeader);
  
  // Add workerQrUrl state
  code = code.replace(
    'const [authorized, setAuthorized] = useState<boolean | null>(null);',
    'const [authorized, setAuthorized] = useState<boolean | null>(null);\n  const [workerQrUrl, setWorkerQrUrl] = useState<string | null>(null);'
  );

  // Add the modal JSX at the very end before the last </main> or </div>
  const modalJSX = `
      {/* Worker QR Code Modal */}
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

  // Insert before the last `</div>` or `</main>` or just before return statement closes?
  // I will inject it right before `</AnimatePresence>` of the main return, wait, let's inject it after `<AnimatePresence>` of some other modal.
  // Actually, let's inject it right before `export const VendorDashboard` ends, wait, it has to be inside return!
  code = code.replace(
    '{deleteProductModal && (',
    modalJSX + '\n      {deleteProductModal && ('
  );

  fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
  console.log('Successfully injected QR code logic!');
} else {
  console.log('Failed to find old header');
}
