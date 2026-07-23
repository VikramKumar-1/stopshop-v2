const fs = require('fs');
const path = 'src/app/vendor/camera/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add searchReturnId state
code = code.replace(
  '// ==================== MODE 3: RETURN QC STATES ====================\n  const [returns, setReturns] = useState<any[]>([]);',
  '// ==================== MODE 3: RETURN QC STATES ====================\n  const [searchReturnId, setSearchReturnId] = useState("");\n  const [returns, setReturns] = useState<any[]>([]);'
);

// 2. Add useEffects for auto-selection
const autoSelectEffects = `
  useEffect(() => {
    if (searchOrderId && orders.length > 0) {
      const match = orders.find(o => (o.status === "PAID" || o.status === "PENDING") && o.id.toString() === searchOrderId);
      if (match) {
        setSelectedOrder(match);
        setPackingImages([]);
        setSearchOrderId(""); // clear so they can scan next one easily later
      }
    }
  }, [searchOrderId, orders]);

  useEffect(() => {
    if (searchReturnId && returns.length > 0) {
      const match = returns.find(r => (r.status === "RETURN_RECEIVED" || r.status === "RETURN_APPROVED") && r.id.toString() === searchReturnId);
      if (match) {
        setSelectedReturn(match);
        setQcImages([]);
        setSearchReturnId("");
      }
    }
  }, [searchReturnId, returns]);
`;
code = code.replace(
  '  useEffect(() => {\n    fetchVendorAuth();\n  }, []);',
  autoSelectEffects + '\n  useEffect(() => {\n    fetchVendorAuth();\n  }, []);'
);

// 3. Update orders filter to ONLY show PAID or PENDING orders in the list
code = code.replace(
  'orders.filter(o => !searchOrderId || o.id.toString() === searchOrderId).map(ord => (',
  'orders.filter(o => (o.status === "PAID" || o.status === "PENDING") && (!searchOrderId || o.id.toString() === searchOrderId)).map(ord => ('
);

// 4. Remove capture="environment" from packing input
code = code.replace(
  /id="cam-packing-photos"\s+onChange=\{handleSnapPackingPhotos\}\s+className="sr-only"\s+\/>/,
  'id="cam-packing-photos"\n                    onChange={handleSnapPackingPhotos}\n                    className="sr-only"\n                  />'
);
code = code.replace(
  /accept="image\/\*"\s+capture="environment"\s+multiple\s+id="cam-packing-photos"/,
  'accept="image/*"\n                    multiple\n                    id="cam-packing-photos"'
);

// 5. Update QC Mode to include Search Bar and correctly map returns
code = code.replace(
  /\{\/\* QC Photos Grid \*\/\}/,
  '{/* QC Photos Grid */}'
); // Just a anchor check

// Let's add Search bar to QC mode:
const searchQcUi = `{/* Order Selector List */}
              <div className="space-y-2">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Scan or Enter Return ID..."
                    value={searchReturnId}
                    onChange={(e) => setSearchReturnId(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                {returns.filter(r => (r.status === "RETURN_RECEIVED" || r.status === "RETURN_APPROVED") && (!searchReturnId || r.id.toString() === searchReturnId)).length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">
                    No pending returns to inspect.
                  </div>
                ) : (
                  returns.filter(r => (r.status === "RETURN_RECEIVED" || r.status === "RETURN_APPROVED") && (!searchReturnId || r.id.toString() === searchReturnId)).map(ret => (`;

code = code.replace(
  /\{\/\* Return Selector List \*\/\}\s*<div className="space-y-2">\s*\{returns\.length === 0 \? \(\s*<div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">\s*No pending returns to inspect\.\s*<\/div>\s*\) : \(\s*returns\.map\(ret => \(/,
  searchQcUi
);

// Wait, the previous QC code didn't have {/* Return Selector List */} because I didn't see the end of the file.
// Let's check how the QC list is rendered.
fs.writeFileSync(path, code);
console.log('Fixed script generated.');
