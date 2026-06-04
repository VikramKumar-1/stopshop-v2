import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/features/products/services/product";

export const dynamic = "force-dynamic";

// GET single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}

// PUT to update product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: any = null;
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    body = await req.json();

    // Call service layer for ownership check and prisma updates
    const updatedProduct = await updateProduct(id, body, session);

    // Clear caches instantly so changes are live immediately
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${id}`);

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: error.message?.includes("Access Denied") || error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Call service layer for ownership check and prisma delete
    await deleteProduct(id, session);

    // Clear caches instantly so deletion is reflected immediately
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/product/${id}`);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
