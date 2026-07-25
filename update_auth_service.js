const fs = require('fs');
let code = fs.readFileSync('src/features/auth/services/auth.ts', 'utf8');

// Update signature
code = code.replace(
  'export async function registerUser(name: string, email: string, password: string, role?: string, rememberMe?: boolean) {',
  'export async function registerUser(name: string, email: string, password: string, role?: string, rememberMe?: boolean, inviteCode?: string) {'
);

// Add invite code processing
const oldUserCreation = `
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: targetRole,
    },
  });
`;

const newUserCreation = `
  const hashedPassword = await bcrypt.hash(password, 10);
  
  let parentVendorId = null;
  if (inviteCode && inviteCode.startsWith("VEND-")) {
    const vid = parseInt(inviteCode.replace("VEND-", ""));
    if (!isNaN(vid)) {
      // Verify vendor exists
      const vendorExists = await prisma.user.findFirst({ where: { id: vid, role: "vendor" } });
      if (!vendorExists) throw new Error("Invalid Vendor Invite Code");
      parentVendorId = vid;
    } else {
      throw new Error("Invalid Vendor Invite Code Format");
    }
  } else if (inviteCode) {
    throw new Error("Invalid Vendor Invite Code");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: targetRole, // "user"
      parentVendorId,
    },
  });
`;
code = code.replace(oldUserCreation, newUserCreation);

fs.writeFileSync('src/features/auth/services/auth.ts', code);
console.log('Updated auth.ts service');
