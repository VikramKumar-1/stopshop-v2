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

// Mathematical function to calculate character differences (typos) between two words
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

export async function getProducts(filters: ProductFilters) {
  const whereClause: any = {};

  if (!filters.includeInactive) {
    whereClause.active = true;
  }

  let hasSearch = false;
  let searchTokens: string[] = [];
  
  // Smart Search Dictionary for Typo Tolerance & Synonyms (Indian Kitchenware Focus)
  const smartSynonyms: Record<string, string[]> = {
    // Typos & Variations
    "cooper": ["copper"],
    "coppier": ["copper"],
    "coper": ["copper"],
    "bras": ["brass"],
    "braas": ["brass"],
    "steeel": ["steel"],
    "stel": ["steel"],
    "kadi": ["kadai"],
    "kadhai": ["kadai"],
    "puja": ["pooja"],
    "pOOja": ["pooja"],
    
    // Contextual Synonyms (English <-> Hindi/Desi terms)
    "bottle": ["flask"],
    "flask": ["bottle"],
    "glass": ["tumbler"],
    "tumbler": ["glass"],
    "bowl": ["katori"],
    "katori": ["bowl"],
    "plate": ["thali"],
    "thali": ["plate"],
    "spoon": ["chamach"],
    "jug": ["pitcher"],
    "pitcher": ["jug"],
    "pot": ["handi"],
    "handi": ["pot"],
    "box": ["dabba"],
    "dabba": ["box"],
    "tiffin": ["lunchbox"],
    "lunchbox": ["tiffin"],
    "masala": ["spice"],
    "spice": ["masala"],
    "ghee": ["oil"],
    "oil": ["ghee"],
    "lota": ["kalash"],
    "kalash": ["lota"],
    "diya": ["lamp"],
    "lamp": ["diya"],
    "pan": ["tawa"],
    "tawa": ["pan"],
  };

  if (filters.search) {
    const cleanSearch = filters.search.trim().toLowerCase();
    const rawTokens = cleanSearch.split(/\s+/).filter(Boolean);
    
    // Expand tokens with smart synonyms
    const expandedTokens = new Set<string>();
    for (const t of rawTokens) {
      expandedTokens.add(t);
      if (smartSynonyms[t]) {
        smartSynonyms[t].forEach(syn => expandedTokens.add(syn));
      }
    }
    
    searchTokens = Array.from(expandedTokens);

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
    orderBy = [
      { reviews: "desc" },
      { rating: "desc" },
      { id: "asc" }
    ];
  }

  // 1. Initial Fast Query (Uses Database Indexes & Smart Dictionary)
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
    // 2. Hybrid Fuzzy Fallback: If DB query fails to find enough products, it's a severe typo.
    // In the future, you can replace this block with an AI Vector Search (Pinecone/OpenAI).
    if (products.length < 3) {
      const allActiveLightweight = await prisma.product.findMany({
        where: { active: true },
        select: { id: true, name: true, categoryName: true, material: true },
      });

      const fuzzyMatchedIds = new Set<number>();
      
      for (const prod of allActiveLightweight) {
        const prodTokens = [
          ...(prod.name?.toLowerCase().split(/\s+/) || []),
          prod.categoryName?.toLowerCase(),
          prod.material?.toLowerCase()
        ].filter(Boolean) as string[];

        let isMatch = false;
        // Check if any search token is very close to any product token
        for (const sToken of searchTokens) {
          if (sToken.length < 4) continue; // Skip very short words for fuzzy matching
          for (const pToken of prodTokens) {
            // If the word length difference is large, skip
            if (Math.abs(sToken.length - pToken.length) > 2) continue;
            
            const distance = levenshtein(sToken, pToken);
            // Allow 1 typo for 4-5 letter words, 2 typos for 6+ letter words
            const maxTypos = sToken.length > 5 ? 2 : 1;
            
            if (distance <= maxTypos) {
              isMatch = true;
              break;
            }
          }
          if (isMatch) break;
        }

        if (isMatch) {
          fuzzyMatchedIds.add(prod.id);
        }
      }

      if (fuzzyMatchedIds.size > 0) {
        // Fetch full data for the fuzzy matched IDs
        const existingIds = new Set(products.map(p => p.id));
        const newIdsToFetch = Array.from(fuzzyMatchedIds).filter(id => !existingIds.has(id));
        
        if (newIdsToFetch.length > 0) {
          const fuzzyProducts = await prisma.product.findMany({
            where: { id: { in: newIdsToFetch } },
            include: {
              category: true,
              vendor: {
                select: { id: true, name: true, location: true, allowedCategories: true, createdAt: true },
              },
            },
          });
          products = [...products, ...fuzzyProducts];
        }
      }
    }

    // 3. Sort in memory (Relevance Ranking)
    if (filters.sort === "price-low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-high-low") {
      products.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sort === "best-sellers") {
      products.sort((a, b) => {
        if ((b.reviews || 0) !== (a.reviews || 0)) return (b.reviews || 0) - (a.reviews || 0);
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        return a.id - b.id;
      });
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

    // 4. Apply pagination in memory after sorting
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
      vendorId: session.role === "vendor" ? session.userId : (body.vendorId ? parseInt(body.vendorId) : null),
      crossSellIds: body.crossSellIds ? body.crossSellIds : [],
      bundleDiscountType: body.bundleDiscountType || "NONE",
      bundleDiscountValue: body.bundleDiscountValue !== undefined ? parseFloat(body.bundleDiscountValue) || null : null,
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
    "featured", "newLaunch", "active", "crossSellIds", 
    "bundleDiscountType", "bundleDiscountValue"
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === "bundleDiscountValue" && body[field] !== null) {
        updateData[field] = parseFloat(body[field]) || null;
      } else {
        updateData[field] = body[field];
      }
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

