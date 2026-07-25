const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

// Add import
code = code.replace(
  'import { compressImageToWebP } from "@/lib/imageCompressor";',
  'import { compressImageToWebP } from "@/lib/imageCompressor";\nimport WorkersTab from "./tabs/WorkersTab";'
);

// Update type
code = code.replace(
  /useState<"inquiries" \| "history" \| "products" \| "add-product" \| "admin-panel" \| "direct-orders" \| "settlements" \| "returns-pending" \| "returns-action" \| "profile" \| "promotions">/g,
  'useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers">'
);
code = code.replace(
  /const setActiveTab = \(tab: "inquiries" \| "history" \| "products" \| "add-product" \| "admin-panel" \| "direct-orders" \| "settlements" \| "returns-pending" \| "returns-action" \| "profile" \| "promotions"\)/g,
  'const setActiveTab = (tab: "inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers")'
);

// Add Tab Button
const profileTabBtn = `<button
              onClick={() => setActiveTab("profile")}`;
const workersTabBtn = `            <button
              onClick={() => setActiveTab("workers")}
              className={\`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap \${
                activeTab === "workers" ? "text-orange-500" : "text-muted hover:text-heading"
              }\`}
            >
              Team & Workers
              {activeTab === "workers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>\n`;

code = code.replace(profileTabBtn, workersTabBtn + profileTabBtn);

// Add Tab Content
const profileTabContent = `{activeTab === "profile" && (
          <div className="animate-in fade-in duration-300">
            <VendorProfilePage />
          </div>
        )}`;
const workersTabContent = `        {activeTab === "workers" && (
          <div className="animate-in fade-in duration-300">
            <WorkersTab />
          </div>
        )}\n\n        `;

code = code.replace(profileTabContent, workersTabContent + profileTabContent);

// Remove old QR Button
const oldQRBtnRegex = /<button\s+onClick=\{handleOpenMobileQR\}[\s\S]*?<\/button>/;
code = code.replace(oldQRBtnRegex, '');

fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
console.log('Fixed VendorDashboard.tsx successfully.');
