const fs = require('fs');

// 1. Update /api/orders/route.ts
let ordersCode = fs.readFileSync('src/app/api/orders/route.ts', 'utf8');
ordersCode = ordersCode.replace(
  '} else if (user.role === "vendor" && asVendor && parseInt(asVendor) === user.userId) {',
  '} else if ((user.role === "vendor" || user.parentVendorId) && asVendor && parseInt(asVendor) === (user.role === "vendor" ? user.userId : user.parentVendorId)) {\n       const effVendorId = user.role === "vendor" ? user.userId : user.parentVendorId;'
);
ordersCode = ordersCode.replace(
  'some: { vendorId: user.userId }',
  'some: { vendorId: effVendorId }'
);
fs.writeFileSync('src/app/api/orders/route.ts', ordersCode);

// 2. Update /api/vendor/returns/route.ts
let returnsCode = fs.readFileSync('src/app/api/vendor/returns/route.ts', 'utf8');
returnsCode = returnsCode.replace(
  'if (!user || user.role !== "vendor") {',
  'if (!user || (user.role !== "vendor" && !user.parentVendorId)) {'
);
returnsCode = returnsCode.replace(
  /vendorId: user\.userId/g,
  'vendorId: user.role === "vendor" ? user.userId : user.parentVendorId'
);
fs.writeFileSync('src/app/api/vendor/returns/route.ts', returnsCode);

// 3. Update /api/vendor/dispatch/route.ts
let dispatchCode = fs.readFileSync('src/app/api/vendor/dispatch/route.ts', 'utf8');
dispatchCode = dispatchCode.replace(
  'if (!user || user.role !== "vendor") {',
  'if (!user || (user.role !== "vendor" && !user.parentVendorId)) {'
);
dispatchCode = dispatchCode.replace(
  /vendorId: user\.userId/g,
  'vendorId: user.role === "vendor" ? user.userId : user.parentVendorId'
);
// Also it checks item.vendorId === user.userId
dispatchCode = dispatchCode.replace(
  /item\.vendorId !== user\.userId/g,
  'item.vendorId !== (user.role === "vendor" ? user.userId : user.parentVendorId)'
);
fs.writeFileSync('src/app/api/vendor/dispatch/route.ts', dispatchCode);

// 4. Update /api/returns/[id]/route.ts
let returnIdCode = fs.readFileSync('src/app/api/returns/[id]/route.ts', 'utf8');
returnIdCode = returnIdCode.replace(
  /if \(\!user \|\| user\.role \!\=\= \"vendor\"\) \{/g,
  'if (!user || (user.role !== "vendor" && !user.parentVendorId)) {'
);
returnIdCode = returnIdCode.replace(
  /orderItem\.vendorId \!\=\= user\.userId/g,
  'orderItem.vendorId !== (user.role === "vendor" ? user.userId : user.parentVendorId)'
);
fs.writeFileSync('src/app/api/returns/[id]/route.ts', returnIdCode);

console.log('Successfully updated API permissions for workers');
