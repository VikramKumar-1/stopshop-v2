import { prisma } from "@/lib/db";
import { TokenPayload } from "@/lib/auth";

interface ProductFilters {
  search?: string;
  category?: string;
  material?: string;
  sort?: string;
  featured?: boolean;
  newLaunch?: boolean;
  vendorId?: number;
  includeInactive?: boolean;
  skip?: number;
  take?: number;
}

/**
 * Service containing the business and database logic for Products.
 * Decouples app/api/products routes from DB operations.
 */

export async function getProducts(filters: ProductFilters) {
  const whereClause: any = {};

  if (!filters.includeInactive) {
    whereClause.active = true;
  }

  if (filters.search) {
    whereClause.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.category) {
    whereClause.categoryName = filters.category;
  }

  if (filters.material) {
    whereClause.material = filters.material;
  }

  if (filters.featured) {
    whereClause.featured = true;
  }

  if (filters.newLaunch) {
    whereClause.newLaunch = true;
  }

  if (filters.vendorId) {
    whereClause.vendorId = filters.vendorId;
  }

  let orderBy: any = { createdAt: "desc" };

  if (filters.sort === "price-low-high") {
    orderBy = { price: "asc" };
  } else if (filters.sort === "price-high-low") {
    orderBy = { price: "desc" };
  } else if (filters.sort === "rating") {
    orderBy = { rating: "desc" };
  } else if (filters.sort === "best-sellers") {
    orderBy = { reviews: "desc" };
  }

  return prisma.product.findMany({
    where: whereClause,
    orderBy: orderBy,
    skip: filters.skip,
    take: filters.take,
    include: {
      category: true,
    },
  });
}

export async function createProduct(body: any, session: TokenPayload) {
  if (session.role !== "admin" && session.role !== "vendor") {
    throw new Error("Unauthorized access");
  }

  const {
    name,
    description,
    specs,
    image,
    images,
    price,
    mrp,
    discount,
    categoryName,
    material,
    stock,
    featured,
    newLaunch,
    active,
  } = body;

  if (!name || !description || !price || !categoryName || !material) {
    throw new Error("Missing required fields");
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Invalid price value: Must be a number");
  }

  const parsedMrp = mrp ? (parseFloat(mrp) || parsedPrice) : parsedPrice;
  const parsedDiscount = discount ? (parseFloat(discount) || 0) : 0;
  const parsedStock = stock ? (parseInt(stock) || 0) : 10;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      specs,
      image: image || "/bronze-kadai.png",
      images: images ? JSON.parse(JSON.stringify(images)) : [],
      price: parsedPrice,
      mrp: parsedMrp,
      discount: parsedDiscount,
      categoryName,
      material,
      stock: parsedStock,
      featured: !!featured,
      newLaunch: !!newLaunch,
      active: active !== undefined ? !!active : true,
      vendorId: session.role === "vendor" ? session.userId : (body.vendorId ? parseInt(body.vendorId) : null)
    },
  });
}

export async function deleteProduct(productId: number, session: TokenPayload) {
  if (session.role !== "admin" && session.role !== "vendor") {
    throw new Error("Unauthorized access");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // If vendor, check ownership
  if (session.role === "vendor" && product.vendorId !== session.userId) {
    throw new Error("Unauthorized: You do not own this listing");
  }

  return prisma.product.delete({
    where: { id: productId },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function updateProduct(id: number, body: any, session: TokenPayload) {
  if (session.role !== "admin" && session.role !== "vendor") {
    throw new Error("Unauthorized access");
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error("Product not found");
  }

  if (session.role === "vendor" && product.vendorId !== session.userId) {
    throw new Error("Access Denied: Product ownership mismatch");
  }

  // Convert numbers if present and handle NaN
  if (body.price !== undefined) body.price = parseFloat(body.price) || 0;
  if (body.mrp !== undefined) body.mrp = parseFloat(body.mrp) || 0;
  if (body.discount !== undefined) body.discount = parseFloat(body.discount) || 0;
  if (body.stock !== undefined) body.stock = parseInt(body.stock) || 0;
  if (body.active !== undefined) body.active = !!body.active;

  if (body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  if (body.categoryName) {
    body.category = {
      connect: { slug: body.categoryName }
    };
    delete body.categoryName;
  }

  // Sanitize incoming body
  delete body.id;
  delete body.createdAt;
  delete body.vendorId;

  try {
    return await prisma.product.update({
      where: { id },
      data: body,
    });
  } catch (error: any) {
    console.error("Database update error:", error);
    throw new Error(error.message || "Failed to update product database record");
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getProductsForSitemap() {
  return prisma.product.findMany({
    select: { id: true, createdAt: true },
  });
}

