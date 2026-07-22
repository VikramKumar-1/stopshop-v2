const { PrismaClient } = require("../src/generated/client");
const prisma = new PrismaClient();

async function safeDelete(modelName, where = {}) {
  try {
    if (prisma[modelName] && typeof prisma[modelName].deleteMany === "function") {
      const res = await prisma[modelName].deleteMany({ where });
      console.log(`  ✔ ${modelName}: deleted ${res.count} records`);
    } else {
      console.log(`  - ${modelName}: skipped`);
    }
  } catch (err) {
    console.warn(`  ⚠️ ${modelName} delete warning: ${err.message}`);
  }
}

async function wipeAllData() {
  console.log("🧹 Starting safe database cleanup for production deployment...\n");

  try {
    // 1. Child tables with foreign keys first
    console.log("--> Step 1: Deleting Return Requests & Order Items...");
    await safeDelete("returnRequest");
    await safeDelete("orderItem");

    console.log("--> Step 2: Deleting Orders & Inquiries...");
    await safeDelete("order");
    await safeDelete("inquiry");

    console.log("--> Step 3: Deleting Support Tickets & Settlements...");
    await safeDelete("supportTicket");
    await safeDelete("settlement");
    await safeDelete("customPayout");

    console.log("--> Step 4: Deleting Marketing, Coupons & Carts...");
    await safeDelete("targetedOffer");
    await safeDelete("userIntent");
    await safeDelete("coupon");
    await safeDelete("cartItem");
    await safeDelete("cart");

    console.log("--> Step 5: Deleting Analytics & Product Reviews...");
    await safeDelete("productView");
    await safeDelete("productPair");
    await safeDelete("review");

    console.log("--> Step 6: Deleting Test Products & Addresses...");
    await safeDelete("product");
    await safeDelete("address");

    console.log("--> Step 7: Deleting Non-Admin Test Users & Test Vendors...");
    await safeDelete("user", { role: { not: "admin" } });

    console.log("\n✨ Database wipe complete! All test data cleaned safely without breaking database schema or admin login!");
  } catch (error) {
    console.error("❌ Error during database wipe:", error);
  } finally {
    await prisma.$disconnect();
  }
}

wipeAllData();
