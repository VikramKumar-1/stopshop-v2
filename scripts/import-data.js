const { PrismaClient } = require("../src/generated/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const backupPath = path.join(__dirname, "../backup-data.json");
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file backup-data.json not found! Please run export-data.js first.");
    process.exit(1);
  }

  console.log("Reading backup-data.json...");
  const data = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

  console.log("Clearing existing data in Aiven database...");
  // Clear tables in reverse dependency order
  await prisma.inquiry.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Importing users...");
  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: new Date(user.createdAt),
        mobile: user.mobile,
        location: user.location,
        artisanId: user.artisanId,
        gstin: user.gstin,
        aadhaar: user.aadhaar,
        pan: user.pan,
        aadhaarUrl: user.aadhaarUrl,
        panUrl: user.panUrl,
        docUrl: user.docUrl,
      }
    });
  }

  console.log("Importing categories...");
  for (const cat of data.categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      }
    });
  }

  console.log("Importing products...");
  for (const prod of data.products) {
    await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        specs: prod.specs,
        image: prod.image,
        images: prod.images,
        price: prod.price,
        mrp: prod.mrp,
        discount: prod.discount,
        rating: prod.rating,
        reviews: prod.reviews,
        categoryName: prod.categoryName,
        material: prod.material,
        stock: prod.stock,
        featured: prod.featured,
        newLaunch: prod.newLaunch,
        active: prod.active,
        createdAt: new Date(prod.createdAt),
        vendorId: prod.vendorId,
      }
    });
  }

  console.log("Importing inquiries...");
  for (const inq of data.inquiries) {
    await prisma.inquiry.create({
      data: {
        id: inq.id,
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        companyName: inq.companyName,
        country: inq.country,
        items: inq.items,
        message: inq.message,
        status: inq.status,
        createdAt: new Date(inq.createdAt),
      }
    });
  }

  console.log("Migration complete! All data imported successfully to Aiven database.");
}

main()
  .catch((e) => {
    console.error("Error importing data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
