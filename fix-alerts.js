const fs = require('fs');
const path = 'c:/Users/vikur/Downloads/stopshops/src/features/admin/components/AdminPanel.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add imports
if (!code.includes('CheckCircle2')) {
  code = code.replace(/import { Plus, Trash2, Edit,/g, 'import { Plus, Trash2, Edit, Info, CheckCircle2, XCircle, AlertTriangle,');
}
if (!code.includes('framer-motion')) {
  code = code.replace(/import { jsPDF } from "jspdf";/g, 'import { jsPDF } from "jspdf";\nimport { AnimatePresence, motion } from "framer-motion";');
}

// 2. Add Toast state and logic
const toastLogic = `
  // Premium Toast Notification State
  interface ToastItem {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };
`;

if (!code.includes('interface ToastItem')) {
  code = code.replace(/export const AdminPanel = \(\) => {/, 'export const AdminPanel = () => {' + toastLogic);
}

// 3. Replace all alerts
// Success alerts
code = code.replace(/alert\(`Return request \${action\.toLowerCase\(\)}\`\);/g, 'showToast(`Return request ${action.toLowerCase()}`, "success");');
code = code.replace(/alert\(`Vendor profile \${action === 'APPROVE' \? 'APPROVED' : 'REJECTED'}`\);/g, 'showToast(`Vendor profile ${action === \\'APPROVE\\' ? \\'APPROVED\\' : \\'REJECTED\\'}`, "success");');
code = code.replace(/alert\("Settings saved successfully!"\);/g, 'showToast("Settings saved successfully!", "success");');
code = code.replace(/alert\(`Product \${action}d successfully.`\);/g, 'showToast(`Product ${action}d successfully.`, "success");');
code = code.replace(/alert\("Products successfully assigned to homepage section!"\);/g, 'showToast("Products successfully assigned to homepage section!", "success");');
code = code.replace(/alert\("Homepage configuration saved successfully!"\);/g, 'showToast("Homepage configuration saved successfully!", "success");');

// Error alerts
code = code.replace(/alert\(data\.error \|\| "Failed to update return"\);/g, 'showToast(data.error || "Failed to update return", "error");');
code = code.replace(/alert\("Error updating return"\);/g, 'showToast("Error updating return", "error");');
code = code.replace(/alert\(data\.error \|\| "Failed to review vendor"\);/g, 'showToast(data.error || "Failed to review vendor", "error");');
code = code.replace(/alert\("Error reviewing vendor"\);/g, 'showToast("Error reviewing vendor", "error");');
code = code.replace(/alert\("Failed to save settings"\);/g, 'showToast("Failed to save settings", "error");');
code = code.replace(/alert\("Error saving settings"\);/g, 'showToast("Error saving settings", "error");');
code = code.replace(/alert\(`Failed to \${action} product.`\);/g, 'showToast(`Failed to ${action} product.`, "error");');
code = code.replace(/alert\(`Error trying to \${action} product.`\);/g, 'showToast(`Error trying to ${action} product.`, "error");');

// Return alerts (replace with showToast and return)
code = code.replace(/return alert\(`Cannot assign! You selected \${invalidProducts\.length} product\(s\) that belong to a different category than the target section\. Please only assign products that match the section's category.`\);/g, 'showToast(`Cannot assign! You selected ${invalidProducts.length} product(s) that belong to a different category than the target section. Please only assign products that match the section\\'s category.`, "error"); return;');
code = code.replace(/return alert\(`Cannot add\. The "\${cat\?\.name}" section would exceed the maximum of 15 products \(would have \${newIds\.length}\)\. Please unselect some products.`\);/g, 'showToast(`Cannot add. The "${cat?.name}" section would exceed the maximum of 15 products (would have ${newIds.length}). Please unselect some products.`, "error"); return;');
code = code.replace(/return alert\(`Cannot add\. Maximum 15 products allowed per section.`\);/g, 'showToast(`Cannot add. Maximum 15 products allowed per section.`, "error"); return;');
code = code.replace(/alert\("Maximum 15 products allowed per section."\);/g, 'showToast("Maximum 15 products allowed per section.", "error");');

code = code.replace(/alert\(`Failed to assign products to homepage\.\\nServer says: \${errText}`\);/g, 'showToast(`Failed to assign products to homepage. Server says: ${errText}`, "error");');
code = code.replace(/alert\(`Error assigning to homepage: \${e\.message}`\);/g, 'showToast(`Error assigning to homepage: ${e.message}`, "error");');
code = code.replace(/alert\(`Failed to save homepage settings\.\\nServer says: \${errText}`\);/g, 'showToast(`Failed to save homepage settings. Server says: ${errText}`, "error");');
code = code.replace(/alert\(`Error saving homepage: \${e\.message}`\);/g, 'showToast(`Error saving homepage: ${e.message}`, "error");');

// 4. Add Toast UI block
const toastUI = `
      {/* Premium Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[250] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";
            const isWarning = toast.type === "warning";

            let icon = <Info className="w-5 h-5 text-orange-500" />;
            let borderColor = "border-orange-500/25";
            let bgGlow = "shadow-orange-500/5";
            let accentBar = "bg-orange-500";

            if (isSuccess) {
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
              borderColor = "border-emerald-500/25";
              bgGlow = "shadow-emerald-500/5";
              accentBar = "bg-emerald-500";
            } else if (isError) {
              icon = <XCircle className="w-5 h-5 text-rose-500" />;
              borderColor = "border-rose-500/25";
              bgGlow = "shadow-rose-500/5";
              accentBar = "bg-rose-500";
            } else if (isWarning) {
              icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
              borderColor = "border-amber-500/25";
              bgGlow = "shadow-amber-500/5";
              accentBar = "bg-amber-500";
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={\`pointer-events-auto w-full bg-surface/90 backdrop-blur-md border \${borderColor} rounded-2xl p-4 shadow-2xl \${bgGlow} relative overflow-hidden flex gap-3.5 items-start\`}
              >
                {/* Accent line */}
                <div className={\`absolute left-0 top-0 bottom-0 w-1.5 \${accentBar}\`} />
                
                {/* Icon wrapper */}
                <div className="pt-0.5">
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-heading leading-tight">
                    {isSuccess ? "Success" : isError ? "Error" : isWarning ? "Warning" : "Notification"}
                  </p>
                  <p className="text-[11px] font-medium text-muted leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="p-1 hover:bg-surface-hover rounded-lg transition-colors cursor-pointer text-muted/65 hover:text-heading"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
`;

if (!code.includes('Premium Toast Notification Container')) {
  // Replace the last two closing tags with the UI block
  code = code.replace(/ {4}<\/div>\n {2}\);\n};\n$/, toastUI);
}

fs.writeFileSync(path, code);
console.log("Done updating alerts to toasts");
