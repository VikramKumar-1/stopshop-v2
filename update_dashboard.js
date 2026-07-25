const fs = require('fs');
let code = fs.readFileSync('src/features/vendor/components/VendorDashboard.tsx', 'utf8');

// Find a good spot, maybe in the Profile tab or header?
// Let's put it in the Vendor Dashboard header below store name
if (!code.includes('VEND-${vendor?.id}')) {
  const oldHeader = `
          <div>
            <h1 className="text-xl md:text-2xl font-black text-heading tracking-tight font-display">
              {vendor?.storeName || vendor?.name || "Vendor Dashboard"}
            </h1>
            <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
              <span className={\`w-2 h-2 rounded-full \${vendor?.vendorStatus === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}\`} />
              {vendor?.vendorStatus === 'APPROVED' ? 'Active & Verified' : 'Pending Verification'}
            </p>
          </div>
`;
  
  const newHeader = `
          <div>
            <h1 className="text-xl md:text-2xl font-black text-heading tracking-tight font-display flex items-center gap-3">
              {vendor?.storeName || vendor?.name || "Vendor Dashboard"}
              {vendor?.vendorStatus === 'APPROVED' && (
                <div className="bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-lg flex items-center gap-2" title="Give this code to your workers so they can access the Camera Studio">
                  <span className="text-[9px] uppercase font-bold text-orange-600">Worker Code:</span>
                  <span className="font-mono text-[11px] font-black text-orange-500">VEND-{vendor?.id}</span>
                </div>
              )}
            </h1>
            <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
              <span className={\`w-2 h-2 rounded-full \${vendor?.vendorStatus === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}\`} />
              {vendor?.vendorStatus === 'APPROVED' ? 'Active & Verified' : 'Pending Verification'}
            </p>
          </div>
`;
  code = code.replace(oldHeader, newHeader);
  fs.writeFileSync('src/features/vendor/components/VendorDashboard.tsx', code);
  console.log('Updated Vendor Dashboard header');
}
