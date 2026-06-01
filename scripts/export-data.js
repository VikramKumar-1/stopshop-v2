const { PrismaClient } = require("../src/generated/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Reading data from local database...");
  
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const inquiries = await prisma.inquiry.findMany();

  const data = {
    users,
    categories,
    products,
    inquiries
  };

  const backupPath = path.join(__dirname, "../backup-data.json");
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  console.log(`Successfully backed up local data to: ${backupPath}`);
  console.log(`- ${users.length} Users`);
  console.log(`- ${categories.length} Categories`);
  console.log(`- ${products.length} Products`);
  console.log(`- ${inquiries.length} Inquiries`);
}

main()
  .catch((e) => {
    console.error("Error exporting data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
