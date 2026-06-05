import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/ordersDb";
import { getProductById } from "@/features/products/services/product";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      productId, 
      quantity, 
      totalAmount, 
      paymentId, 
      paymentStatus, 
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      shippingCountry,
      userEmail 
    } = body;

    if (!productId || !quantity || !totalAmount || !shippingName || !shippingAddress) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
    }

    // Retrieve product info to find corresponding vendorId and additional info
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const created = createOrder({
      productId,
      productName: product.name,
      productImage: product.image,
      productMaterial: product.material,
      vendorId: product.vendorId || 0,
      quantity,
      totalAmount,
      paymentId: paymentId || `pay_mock_${Date.now()}`,
      paymentStatus: paymentStatus || "PAID",
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      shippingCountry,
      userEmail: userEmail || "guest@stopshop.com"
    });

    // Deduct stock
    try {
      if (product.stock !== undefined && product.stock !== null && product.stock >= quantity) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: {
              decrement: quantity
            }
          }
        });
      }
    } catch (stockErr) {
      console.error("Failed to deduct stock:", stockErr);
      // We still return success since the order was placed and paid for
    }

    return NextResponse.json({ success: true, order: created });
  } catch (e: any) {
    console.error("Error creating order:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    const userEmail = searchParams.get("email");

    let orders = getOrders();

    if (vendorId) {
      const vId = parseInt(vendorId);
      orders = orders.filter((o) => o.vendorId === vId);
    }

    if (userEmail) {
      orders = orders.filter((o) => o.userEmail.toLowerCase() === userEmail.toLowerCase());
    }

    return NextResponse.json(orders);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
