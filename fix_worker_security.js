const fs = require('fs');

function fixDispatch() {
    let code = fs.readFileSync('src/app/api/vendor/dispatch/route.ts', 'utf8');
    code = code.replace(/import \{ requireRole \} from "@\/lib\/auth";/, 'import { requireAuth } from "@/lib/auth";');
    
    const oldAuth = `    const user = requireRole(req, ["vendor"]);
    if (user instanceof NextResponse) return user;`;
    const newAuth = `    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;
    if (user.role !== "vendor" && !user.parentVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const effVendorId = user.role === "vendor" ? user.userId : user.parentVendorId;`;
    code = code.replace(oldAuth, newAuth);
    
    code = code.replace(/if \(orderItem\.vendorId !== user\.userId\) \{/g, 'if (orderItem.vendorId !== effVendorId) {');
    
    fs.writeFileSync('src/app/api/vendor/dispatch/route.ts', code);
}

function fixReturns() {
    let code = fs.readFileSync('src/app/api/vendor/returns/route.ts', 'utf8');
    code = code.replace(/import \{ requireRole \} from "@\/lib\/auth";/, 'import { requireAuth } from "@/lib/auth";');
    
    const oldAuth = `    const user = requireRole(req, ["vendor"]);
    if (user instanceof NextResponse) return user;

    const vendorId = user.userId;`;
    const newAuth = `    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;
    if (user.role !== "vendor" && !user.parentVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const vendorId = user.role === "vendor" ? user.userId : user.parentVendorId;`;
    code = code.replace(oldAuth, newAuth);
    
    fs.writeFileSync('src/app/api/vendor/returns/route.ts', code);
}

function fixReturnsId() {
    let code = fs.readFileSync('src/app/api/returns/[id]/route.ts', 'utf8');
    code = code.replace(/import \{ requireRole \} from "@\/lib\/auth";/, 'import { requireAuth } from "@/lib/auth";');
    
    const oldAuth = `    const admin = requireRole(req, ["admin", "vendor"]);
    if (admin instanceof NextResponse) return admin;`;
    const newAuth = `    const admin = requireAuth(req);
    if (admin instanceof NextResponse) return admin;
    if (admin.role !== "admin" && admin.role !== "vendor" && !admin.parentVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const effVendorId = admin.role === "admin" ? null : (admin.role === "vendor" ? admin.userId : admin.parentVendorId);`;
    code = code.replace(oldAuth, newAuth);
    
    code = code.replace(/if \(admin\.role === "vendor"\) \{/g, 'if (admin.role === "vendor" || admin.parentVendorId) {');
    code = code.replace(/if \(\!orderItem \|\| orderItem\.vendorId !== admin\.userId\) \{/g, 'if (!orderItem || orderItem.vendorId !== effVendorId) {');
    
    fs.writeFileSync('src/app/api/returns/[id]/route.ts', code);
}

fixDispatch();
fixReturns();
fixReturnsId();
console.log('Fixed API security for workers!');
