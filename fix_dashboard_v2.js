const fs = require('fs');

let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

// 1. Add Import
if (!code.includes('import WorkersTab')) {
    code = code.replace(
        'import { compressImageToWebP } from "@/lib/imageCompressor";',
        'import { compressImageToWebP } from "@/lib/imageCompressor";\nimport WorkersTab from "./tabs/WorkersTab";'
    );
}

// 2. Add Type state
const oldState = `useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions">("inquiries");`;
const newState = `useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers">("inquiries");`;
code = code.replace(oldState, newState);

// 3. Add Type setter
const oldSetter = `const setActiveTab = (tab: "inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions") => {`;
const newSetter = `const setActiveTab = (tab: "inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers") => {`;
code = code.replace(oldSetter, newSetter);

// 4. Inject Button
const profileBtnStart = `            <button
              onClick={() => setActiveTab("profile")}`;

const workersBtnStr = `            <button
              onClick={() => setActiveTab("workers")}
              className={\`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap \${
                activeTab === "workers" ? "text-orange-500" : "text-muted hover:text-heading"
              }\`}
            >
              Team & Workers
              {activeTab === "workers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>\n`;

if (code.includes(profileBtnStart) && !code.includes('onClick={() => setActiveTab("workers")}')) {
    code = code.replace(profileBtnStart, workersBtnStr + profileBtnStart);
}

// 5. Inject Content
const profileContentStr = `        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-300">
            <VendorProfilePage />
          </div>
        )}`;

const workersContentStr = `        {activeTab === "workers" && (
          <div className="animate-in fade-in duration-300">
            <WorkersTab />
          </div>
        )}\n\n`;

if (code.includes(profileContentStr) && !code.includes('<WorkersTab />')) {
    code = code.replace(profileContentStr, workersContentStr + profileContentStr);
}

// 6. Remove old Mobile QR button
// Just replace the exact string from `<button onClick={handleOpenMobileQR}` up to its closing `</button>`
const qrRegex = /<button[\s\S]*?onClick=\{handleOpenMobileQR\}[\s\S]*?<\/button>/;
code = code.replace(qrRegex, '');

fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
console.log('Fixed dashboard with precision.');
