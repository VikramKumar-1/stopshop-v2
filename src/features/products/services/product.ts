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

function calculateRelevanceScore(product: any, query: string, tokens: string[]): number {
  let score = 0;
  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const cat = (product.categoryName || "").toLowerCase();
  const mat = (product.material || "").toLowerCase();

  // 1. Exact phrase matches (highest reward)
  if (name.includes(query)) score += 100;
  if (desc.includes(query)) score += 20;

  // 2. Token matches
  for (const token of tokens) {
    if (name.includes(token)) {
      // Bonus if it's an exact word match (surrounded by word boundaries or start/end of string)
      const wordRegex = new RegExp(`\\b${token}\\b`, 'i');
      if (wordRegex.test(name)) {
        score += 30;
      } else {
        score += 15;
      }
    }
    if (cat.includes(token)) {
      score += 10;
    }
    if (mat.includes(token)) {
      score += 8;
    }
    if (desc.includes(token)) {
      score += 3;
    }
  }

  // 3. Small boosts for popular/featured/highly-rated products to break ties
  if (product.featured) score += 5;
  if (product.rating) score += product.rating;
  
  return score;
}

export async function getProducts(filters: ProductFilters) {
  const whereClause: any = {};

  if (!filters.includeInactive) {
    whereClause.active = true;
  }

  let hasSearch = false;
  let searchTokens: string[] = [];
  if (filters.search) {
    const cleanSearch = filters.search.trim().toLowerCase();
    searchTokens = cleanSearch.split(/\s+/).filter(Boolean);
    if (searchTokens.length > 0) {
      hasSearch = true;
      whereClause.OR = searchTokens.flatMap(token => [
        { name: { contains: token } },
        { description: { contains: token } },
        { categoryName: { contains: token } },
        { material: { contains: token } },
      ]);
    }
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

  // If we have search, we fetch all matched records (without skip/take) and order them in memory
  // to apply relevance scoring before paginating.
  let products = await prisma.product.findMany({
    where: whereClause,
    orderBy: hasSearch ? undefined : orderBy,
    skip: hasSearch ? undefined : filters.skip,
    take: hasSearch ? undefined : filters.take,
    include: {
      category: true,
      vendor: {
        select: { id: true, name: true, location: true, allowedCategories: true, createdAt: true },
      },
    },
  });

  if (hasSearch) {
    // Sort in memory
    if (filters.sort === "price-low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-high-low") {
      products.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sort === "best-sellers") {
      products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else {
      const queryLower = (filters.search || "").trim().toLowerCase();
      const scores = new Map<number, number>();
      products.forEach(p => {
        scores.set(p.id, calculateRelevanceScore(p, queryLower, searchTokens));
      });
      
      products.sort((a, b) => {
        const scoreA = scores.get(a.id) || 0;
        const scoreB = scores.get(b.id) || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        // Tie-breaker: newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    // Apply pagination in memory after sorting
    if (filters.skip !== undefined || filters.take !== undefined) {
      const start = filters.skip || 0;
      const end = filters.take !== undefined ? start + filters.take : undefined;
      products = products.slice(start, end);
    }
  }

  return products;
}

export async function createProduct(body: any, session: TokenPayload) {
  if (session.role !== "admin" && session.role !== "vendor") {
    throw new Error("Unauthorized access");
  }

  // Vendor verification check
  if (session.role === "vendor") {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.vendorStatus !== "APPROVED") {
      throw new Error("Unauthorized: Your vendor profile must be approved before you can add products.");
    }

    if (user.allowedCategories) {
      const allowed = user.allowedCategories.split(',').map(c => c.trim());
      if (!allowed.includes(body.categoryName)) {
        throw new Error(`Unauthorized: You do not have permission to upload products to the '${body.categoryName}' category.`);
      }
    }
  }

  const {
    name,
    description,
    specs,
    image,
    images,
    prices,
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

  let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
    });
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  let parsedPrices: any = null;
  if (prices) {
    const cleaned: any = {};
    for (const key in prices) {
      const valMrp = prices[key]?.mrp;
      const valDiscount = prices[key]?.discount;
      const entry: any = {};
      
      if (valMrp !== undefined && valMrp !== null && valMrp !== "") {
        const numMrp = parseFloat(valMrp);
        if (!isNaN(numMrp)) {
          entry.mrp = numMrp;
        }
      }
      
      if (valDiscount !== undefined && valDiscount !== null && valDiscount !== "") {
        const numDiscount = parseFloat(valDiscount);
        if (!isNaN(numDiscount)) {
          entry.discount = numDiscount;
        }
      }
      
      if (entry.mrp !== undefined) {
        cleaned[key] = entry;
      }
    }
    if (Object.keys(cleaned).length > 0) {
      parsedPrices = JSON.parse(JSON.stringify(cleaned));
    }
  }

  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      specs,
      image: image || "/bronze-kadai.png",
      images: images ? JSON.parse(JSON.stringify(images)) : [],
      prices: parsedPrices,
      price: parsedPrice,
      mrp: parsedMrp,
      discount: parsedDiscount,
      categoryName,
      material,
      stock: parsedStock,
      featured: !!featured,
      newLaunch: !!newLaunch,
      // Products are active by default. Admin can hide inappropriate products manually.
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
    include: {
      category: true,
      vendor: { select: { id: true, name: true, location: true, allowedCategories: true, createdAt: true } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      vendor: { select: { id: true, name: true, location: true, allowedCategories: true, createdAt: true } },
    },
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
  if (body.active !== undefined) {
    body.active = !!body.active;
  }
  if (body.featured !== undefined) body.featured = !!body.featured;
  if (body.newLaunch !== undefined) body.newLaunch = !!body.newLaunch;

  if (body.prices) {
    const cleaned: any = {};
    for (const key in body.prices) {
      const valMrp = body.prices[key]?.mrp;
      const valDiscount = body.prices[key]?.discount;
      const entry: any = {};
      
      if (valMrp !== undefined && valMrp !== null && valMrp !== "") {
        const numMrp = parseFloat(valMrp);
        if (!isNaN(numMrp)) {
          entry.mrp = numMrp;
        }
      }
      
      if (valDiscount !== undefined && valDiscount !== null && valDiscount !== "") {
        const numDiscount = parseFloat(valDiscount);
        if (!isNaN(numDiscount)) {
          entry.discount = numDiscount;
        }
      }
      
      if (entry.mrp !== undefined) {
        cleaned[key] = entry;
      }
    }
    body.prices = Object.keys(cleaned).length > 0 ? JSON.parse(JSON.stringify(cleaned)) : null;
  }

  if (body.name) {
    let baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id }
        },
      });
      if (!existing) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    body.slug = slug;
  }

  // Create whitelisted data payload for Prisma Update
  const updateData: any = {};
  const allowedFields = [
    "name", "slug", "description", "specs", "image", "images",
    "prices", "price", "mrp", "discount", "material", "stock",
    "featured", "newLaunch", "active"
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (body.categoryName) {
    updateData.category = {
      connect: { slug: body.categoryName }
    };
  }

  try {
    return await prisma.product.update({
      where: { id },
      data: updateData,
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

