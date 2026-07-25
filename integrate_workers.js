const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

// 1. Add WorkersTab import
if (!code.includes('import WorkersTab from "./tabs/WorkersTab";')) {
  code = code.replace(
    'import { compressImageToWebP } from "@/lib/imageCompressor";',
    'import { compressImageToWebP } from "@/lib/imageCompressor";\nimport WorkersTab from "./tabs/WorkersTab";'
  );
}

// 2. Add "workers" to activeTab type
code = code.replace(
  /useState<"inquiries" \| "history" \| "products" \| "add-product" \| "admin-panel" \| "direct-orders" \| "settlements" \| "returns-pending" \| "returns-action" \| "profile" \| "promotions">/,
  'useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers">'
);
code = code.replace(
  /const setActiveTab = \(tab: "inquiries" \| "history" \| "products" \| "add-product" \| "admin-panel" \| "direct-orders" \| "settlements" \| "returns-pending" \| "returns-action" \| "profile" \| "promotions"\)/,
  'const setActiveTab = (tab: "inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers")'
);

// 3. Add Workers tab button before Profile tab
const profileTabBtn = `<button
              onClick={() => setActiveTab("profile")}
              className={\`pb-2 text-sm font-bold transition-all relative cursor-pointer \${
                activeTab === "profile" ? "text-orange-500" : "text-muted hover:text-heading"
              }\`}
            >
              My Profile
              {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>`;

const workersTabBtn = `<button
              onClick={() => setActiveTab("workers")}
              className={\`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap \${
                activeTab === "workers" ? "text-orange-500" : "text-muted hover:text-heading"
              }\`}
            >
              Team & Workers
              {activeTab === "workers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>`;

if (code.includes('onClick={() => setActiveTab("profile")}')) {
  code = code.replace(profileTabBtn, workersTabBtn + '\n            ' + profileTabBtn);
}

// 4. Add WorkersTab content rendering before VendorProfilePage
const profileTabContent = `{activeTab === "profile" && (
          <div className="animate-in fade-in duration-300">
            <VendorProfilePage />
          </div>
        )}`;

const workersTabContent = `{activeTab === "workers" && (
          <div className="animate-in fade-in duration-300">
            <WorkersTab />
          </div>
        )}`;

if (code.includes('<VendorProfilePage />')) {
  code = code.replace(profileTabContent, workersTabContent + '\n\n        ' + profileTabContent);
}

fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
console.log('WorkersTab successfully integrated');
