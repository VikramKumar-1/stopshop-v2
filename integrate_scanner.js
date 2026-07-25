const fs = require('fs');
const path = 'src/app/vendor/camera/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add import
if (!code.includes('BarcodeScanner')) {
  code = code.replace(
    'import { ArrowLeft, Camera, CheckCircle2, Loader2, Package, RefreshCcw, Search, Sparkles, X, ImageIcon } from "lucide-react";',
    'import { ArrowLeft, Camera, CheckCircle2, Loader2, Package, RefreshCcw, Search, Sparkles, X, ImageIcon, ScanLine } from "lucide-react";\nimport BarcodeScanner from "@/features/vendor/components/BarcodeScanner";'
  );
}

// Add state
if (!code.includes('showScanner')) {
  code = code.replace(
    'const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);',
    'const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);\n  const [showScanner, setShowScanner] = useState(false);'
  );
}

// Replace Search Input with the one containing a camera button
const oldSearchBar = `
                <div className="mb-4 bg-orange-500/5 p-3 rounded-2xl border border-orange-500/20">
                  <label className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles size={12} /> Scan Barcode to Pack
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tap here & use phone scanner..."
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      className="w-full bg-surface border-2 border-orange-500/30 rounded-xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-orange-500 font-mono shadow-inner"
                    />
                    <Camera size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500" />
                  </div>
                </div>
`;

const newSearchBar = `
                <div className="mb-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 rounded-3xl border border-orange-500/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <label className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ScanLine size={14} className="animate-pulse" /> Find Order to Pack
                  </label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter Order ID..."
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        className="w-full bg-surface border-2 border-orange-500/30 rounded-2xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-orange-500 focus:ring-4 ring-orange-500/10 font-mono shadow-inner transition-all"
                      />
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                    
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                </div>
`;
code = code.replace(oldSearchBar, newSearchBar);

// Render Scanner Component
if (!code.includes('<BarcodeScanner')) {
  code = code.replace(
    '</main>',
    `</main>\n\n      {/* Barcode Scanner Modal */}\n      {showScanner && (\n        <BarcodeScanner\n          onClose={() => setShowScanner(false)}\n          onScan={(text) => {\n            setSearchOrderId(text);\n            setShowScanner(false);\n            setToast({ type: "success", message: \`Scanned: \${text}\` });\n          }}\n        />\n      )}`
  );
}

fs.writeFileSync(path, code);
console.log('Scanner integrated.');
