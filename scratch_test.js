const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fetching all products...");
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    console.log("Total products in DB:", products.length);
    products.forEach(p => {
      console.log(`- ID: ${p.id} | Name: ${p.name} | Category: ${p.categoryName} | Active: ${p.active} | Featured: ${p.featured} | NewLaunch: ${p.newLaunch} | VendorId: ${p.vendorId}`);
    });
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
