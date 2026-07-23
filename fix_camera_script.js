const fs = require('fs');
const path = 'src/app/vendor/camera/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Update activeMode
code = code.replace(
  'const [activeMode, setActiveMode] = useState<"add-product" | "dispatch" | "return-qc">("add-product");',
  'const [activeMode, setActiveMode] = useState<"dispatch" | "return-qc">("dispatch");'
);

// 2. Remove Add Product States and add searchOrderId
code = code.replace(
  /\/\/ ==================== MODE 1: ADD PRODUCT FORM STATES ====================\s+const \[prodName[\s\S]+?\/\/ ==================== MODE 2: DISPATCH PACKING STATES ====================/,
  '// ==================== MODE 2: DISPATCH PACKING STATES ====================\n  const [searchOrderId, setSearchOrderId] = useState("");'
);

// 3. Remove Add Product Handlers
code = code.replace(
  /\/\/ 📸 Handlers: Add Product Camera Uploads[\s\S]+?\/\/ 📦 Handlers: Dispatch Packing Camera Photos/,
  '// 📦 Handlers: Dispatch Packing Camera Photos'
);

// 4. Remove Add Product JSX
code = code.replace(
  /\{\/\* MODE 1: ADD PRODUCT VIA CAMERA \*\/\}[\s\S]+?\{\/\* MODE 2: DISPATCH PACKING CAMERA \*\/\}/,
  '{/* MODE 2: DISPATCH PACKING CAMERA */}'
);

// 5. Add search bar to Dispatch mode
code = code.replace(
  /\{\/\* Order Selector List \*\/\}\s+<div className="space-y-2">\s+\{orders\.length === 0 \?/,
  `{/* Order Selector List */}
              <div className="space-y-2">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Scan or Enter Order ID..."
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                {orders.filter(o => !searchOrderId || o.id.toString() === searchOrderId).length === 0 ?`
);

code = code.replace(
  /orders\.map\(ord => \(/,
  'orders.filter(o => !searchOrderId || o.id.toString() === searchOrderId).map(ord => ('
);

fs.writeFileSync(path, code);
console.log('Fixed page.tsx');
