const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.inquiry.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Admin User
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin StopShop",
      email: "admin@stopshop.com",
      password: hashedAdminPassword,
      role: "admin",
    },
  });
  console.log("Admin seeded (admin@stopshop.com)");

  // Seed Vendor User
  const hashedVendorPassword = await bcrypt.hash("vendor123", 10);
  const vendor = await prisma.user.create({
    data: {
      name: "Moradabad Artisans Hub",
      email: "vendor@stopshop.com",
      password: hashedVendorPassword,
      role: "vendor",
    },
  });
  console.log("Vendor seeded (vendor@stopshop.com)");

  // Seed Categories
  const categories = [
    { name: "Kitchen Utility", slug: "kitchen-utility", image: "/bronze-kadai.png" },
    { name: "Brass Cookware", slug: "brass-cookware", image: "/collection-tableware.png" },
    { name: "Pooja Collection", slug: "pooja-collection", image: "/collection-pooja.png" },
    { name: "Copper Products", slug: "copper-products", image: "/bronze-lota.png" },
    { name: "Steel Essentials", slug: "steel-essentials", image: "/bronze-kadai.png" },
    { name: "Home Living", slug: "home-living", image: "/collection-pooja.png" },
    { name: "Bedroom Essentials", slug: "bedroom-essentials", image: "/collection-tableware.png" },
    { name: "Living Room", slug: "living-room", image: "/collection-pooja.png" },
    { name: "Handicrafts", slug: "handicrafts", image: "/collection-pooja.png" },
    { name: "Kitchen Racks", slug: "kitchen-racks", image: "/bronze-kadai.png" },
    { name: "Dinner Sets", slug: "dinner-sets", image: "/collection-tableware.png" },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log("Categories seeded");

  // Mock Products list to insert
  const products = [
    // Kitchen Utility (Assigned to Vendor)
    {
      name: "Heritage Bronze Kadai",
      slug: "heritage-bronze-kadai",
      description: "Heavy-duty pure bronze cooking kadai, hand-beaten by traditional coppersmiths for uniform heating.",
      specs: "Weight: 2.4 kg | Hand-Hammered",
      image: "/bronze-kadai.png",
      images: JSON.stringify(["/bronze-kadai.png", "/bronze-hero.png"]),
      price: 2499,
      mrp: 3199,
      discount: 22,
      rating: 4.9,
      reviews: 124,
      categoryName: "kitchen-utility",
      material: "Bronze",
      featured: true,
      stock: 5,
      vendorId: vendor.id
    },
    {
      name: "Handcrafted Bronze Handi",
      slug: "handcrafted-bronze-handi",
      description: "Elegant deep-cooking pot with lid, perfect for slow-cooking curries and biryanis.",
      specs: "Capacity: 3 Litres | Heavy Bottom",
      image: "/bronze-hero.png",
      images: JSON.stringify(["/bronze-hero.png"]),
      price: 3299,
      mrp: 4499,
      discount: 27,
      rating: 4.7,
      reviews: 67,
      categoryName: "kitchen-utility",
      material: "Bronze",
      featured: true,
      stock: 3,
      vendorId: vendor.id
    },
    {
      name: "Classic Bronze Patila",
      slug: "classic-bronze-patila",
      description: "Flat-bottomed classic cooking vessel designed for day-to-day culinary needs.",
      specs: "Weight: 1.8 kg | Pure Bronze",
      image: "/bronze-hero.png",
      images: JSON.stringify(["/bronze-hero.png"]),
      price: 1999,
      mrp: 2699,
      discount: 26,
      rating: 4.8,
      reviews: 73,
      categoryName: "kitchen-utility",
      material: "Bronze",
      featured: true,
      stock: 8,
      vendorId: null
    },

    // Brass Cookware
    {
      name: "Royal Bronze Thali Set",
      slug: "royal-bronze-thali-set",
      description: "An exquisite multi-piece dining set fit for royalty, featuring intricate hand-etched rims.",
      specs: "7-Piece Set | Velvet Case Included",
      image: "/collection-tableware.png",
      images: JSON.stringify(["/collection-tableware.png"]),
      price: 5999,
      mrp: 7999,
      discount: 25,
      rating: 5.0,
      reviews: 42,
      categoryName: "brass-cookware",
      material: "Brass",
      featured: true,
      stock: 2,
      vendorId: null
    },

    // Copper Products (Assigned to Vendor)
    {
      name: "Pure Copper Water Bottle",
      slug: "pure-copper-water-bottle",
      description: "Handcrafted pure copper bottle for daily Ayurvedic hydration and natural wellness.",
      specs: "Capacity: 1 Litre | Leak-Proof",
      image: "/bronze-lota.png",
      images: JSON.stringify(["/bronze-lota.png"]),
      price: 899,
      mrp: 1200,
      discount: 25,
      rating: 4.9,
      reviews: 156,
      categoryName: "copper-products",
      material: "Copper",
      featured: true,
      stock: 20,
      vendorId: vendor.id
    },
    {
      name: "Artisanal Bronze Lota",
      slug: "artisanal-bronze-lota",
      description: "Traditional wellness water vessel designed to naturally purify and alkaline drinking water overnight.",
      specs: "Capacity: 1.5 Litres | Pure Kansa",
      image: "/bronze-lota.png",
      images: JSON.stringify(["/bronze-lota.png"]),
      price: 1899,
      mrp: 2499,
      discount: 24,
      rating: 4.8,
      reviews: 89,
      categoryName: "copper-products",
      material: "Bronze",
      featured: true,
      stock: 4,
      vendorId: null
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        specs: prod.specs,
        image: prod.image,
        images: JSON.parse(prod.images),
        price: prod.price,
        mrp: prod.mrp,
        discount: prod.discount,
        rating: prod.rating,
        reviews: prod.reviews,
        categoryName: prod.categoryName,
        material: prod.material,
        featured: prod.featured,
        stock: prod.stock,
        vendorId: prod.vendorId
      }
    });
  }
  console.log("Products seeded");

  // Seed a sample Inquiry for the vendor to see
  const seededProducts = await prisma.product.findMany({
    where: { vendorId: vendor.id }
  });

  await prisma.inquiry.create({
    data: {
      name: "David Miller",
      email: "david@millertraders.com",
      phone: "+1 415 555 2671",
      companyName: "Miller Import Traders",
      country: "United States",
      message: "We need urgent pricing quotes for bulk shipping of copper bottles and bronze Kadais to San Francisco port. Please send certificate of purity.",
      items: JSON.stringify(
        seededProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: 50,
          material: p.material
        }))
      ),
      status: "PENDING"
    }
  });
  console.log("Sample B2B inquiry seeded for vendor");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
