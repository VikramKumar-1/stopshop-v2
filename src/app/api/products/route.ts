import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getProducts, createProduct } from "@/features/products/services/product";

export const dynamic = "force-dynamic";

// GET products catalog
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const material = searchParams.get("material") || "";
    const sort = searchParams.get("sort") || "";
    const featured = searchParams.get("featured") === "true";
    const newLaunch = searchParams.get("newLaunch") === "true";
    const vendorIdStr = searchParams.get("vendorId");
    const vendorId = vendorIdStr ? parseInt(vendorIdStr) : undefined;
    const includeInactive = searchParams.get("includeInactive") === "true" || !!vendorId;

    const skipStr = searchParams.get("skip");
    const takeStr = searchParams.get("take");
    const skip = skipStr ? parseInt(skipStr) : undefined;
    const take = takeStr ? parseInt(takeStr) : undefined;

    // Call service layer for catalog query logic
    const products = await getProducts({
      search,
      category,
      material,
      sort,
      featured,
      newLaunch,
      vendorId,
      includeInactive,
      skip,
      take,
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": includeInactive || vendorId ? "no-store" : "public, s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

// POST to create new product listing
export async function POST(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    
    // Call service layer for validation and prisma creation
    const newProduct = await createProduct(body, session);

    // Instant On-Demand Cache Invalidation
    try {
      const { revalidatePath } = require("next/cache");
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/api/homepage");
      revalidatePath("/api/products");
    } catch (e) {}

    return NextResponse.json(newProduct);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: error.message.includes("Unauthorized") ? 403 : 400 }
    );
  }
}
