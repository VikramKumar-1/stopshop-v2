const { PrismaClient } = require("../src/generated/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env variables manually to avoid dependency issues
try {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const firstEquals = trimmed.indexOf("=");
        const key = trimmed.slice(0, firstEquals).trim();
        let value = trimmed.slice(firstEquals + 1).trim();
        // Remove surrounding quotes if they exist
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (err) {
  console.warn("Warning: Could not read .env file manually:", err.message);
}

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // SECURITY: Require explicit admin credentials — no hardcoded fallbacks
  if (!email || !password) {
    console.error(
      "\n❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.\n" +
      "   No default credentials are used for security reasons.\n" +
      "   Example:\n" +
      "     ADMIN_EMAIL=\"your-admin@example.com\"\n" +
      "     ADMIN_PASSWORD=\"a-strong-password-here\"\n"
    );
    process.exit(1);
  }

  // SECURITY: Enforce minimum password strength for admin
  if (password.length < 8) {
    console.error(
      "\n❌ Admin password is too short (minimum 8 characters).\n" +
      "   Please set a stronger ADMIN_PASSWORD in your .env file.\n"
    );
    process.exit(1);
  }

  console.log("Setting up Admin account...");

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin" }
  });

  if (existingAdmin) {
    // Update existing admin
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: email,
        password: hashedPassword,
        name: "Admin StopShop"
      }
    });
    console.log(`✅ Admin user (ID: ${existingAdmin.id}) successfully updated!`);
  } else {
    // Create new admin
    const newAdmin = await prisma.user.create({
      data: {
        name: "Admin StopShop",
        email: email,
        password: hashedPassword,
        role: "admin"
      }
    });
    console.log(`✅ Admin user (ID: ${newAdmin.id}) successfully created!`);
  }
}

main()
  .catch((e) => {
    console.error("Error setting up admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
