const fs = require('fs');
let code = fs.readFileSync('src/app/worker/studio/page.tsx', 'utf8');

// 1. Fix Auth Check
code = code.replace(
  'if (res.ok && data.authenticated && (data.user?.role === "vendor" || data.user?.role === "admin")) {',
  'if (res.ok && data.authenticated && (data.user?.role === "vendor" || data.user?.role === "admin" || (data.user?.role === "user" && data.user?.parentVendorId))) {'
);

// 2. Add handleLogout
if (!code.includes('const handleLogout')) {
  code = code.replace(
    'const handleSubmitQcReport = async (action: "QC_PASS" | "QC_UPLOAD") => {',
    `const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch(e) {
      router.push('/login');
    }
  };

  const handleSubmitQcReport = async (action: "QC_PASS" | "QC_UPLOAD") => {`
  );
}

// 3. Add WorkerHeader UI
const headerUI = `
      {/* Custom Worker Header */}
      <div className="bg-white border-b border-border px-4 py-3 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-black tracking-tight text-heading leading-tight text-lg">StopShop</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest leading-none">Studio</p>
          </div>
        </div>
        
        {vendor && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-heading">{vendor.name}</p>
              <p className="text-xs text-muted">{vendor.role === 'user' ? 'Packing Worker' : 'Vendor Admin'}</p>
            </div>
            
            <div className="relative group">
              <button className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-orange-200 cursor-pointer">
                {vendor.name.charAt(0).toUpperCase()}
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2 border-b border-gray-100 mb-2 sm:hidden">
                  <p className="text-sm font-bold text-heading">{vendor.name}</p>
                  <p className="text-xs text-muted">{vendor.role === 'user' ? 'Packing Worker' : 'Vendor Admin'}</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-2">
                  <X size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
`;

if (code.includes('toast.message}</p>\n        </div>\n      )}')) {
  code = code.replace('toast.message}</p>\n        </div>\n      )}', 'toast.message}</p>\n        </div>\n      )}\n' + headerUI);
}

fs.writeFileSync('src/app/worker/studio/page.tsx', code);
console.log('Successfully updated worker studio page');
