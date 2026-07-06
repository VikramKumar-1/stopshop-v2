import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET cart for the logged in user
export async function GET(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Map to CartItem format
    const formattedItems = cart.items.map(item => ({
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      mrp: item.product.mrp,
      prices: item.product.prices,
      image: item.product.image,
      specs: item.product.specs || "",
      material: item.product.material || "Bronze",
      categoryName: item.product.categoryName || "kitchen-utility",
      quantity: item.quantity,
      stock: item.product.stock,
      vendorId: item.product.vendorId,
      crossSellIds: item.product.crossSellIds,
      bundleDiscountType: item.product.bundleDiscountType,
      bundleDiscountValue: item.product.bundleDiscountValue,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST to add item or sync cart
export async function POST(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, item, items } = body;

    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.userId }
      });
    }

    if (action === "SYNC") {
      // items is an array of CartItems from localStorage
      if (Array.isArray(items) && items.length > 0) {
        for (const localItem of items) {
          const existingItem = await prisma.cartItem.findUnique({
            where: {
              cartId_productId: {
                cartId: cart.id,
                productId: localItem.id
              }
            }
          });

          if (existingItem) {
             // Keep the larger quantity or add them? We'll use the larger one to avoid duplicates exploding.
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: Math.max(existingItem.quantity, localItem.quantity) }
            });
          } else {
            await prisma.cartItem.create({
              data: {
                cartId: cart.id,
                productId: localItem.id,
                quantity: localItem.quantity
              }
            });
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    if (action === "ADD") {
      if (!item || !item.id) {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.id
          }
        }
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + (item.quantity || 1) }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.id,
            quantity: item.quantity || 1
          }
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

// PUT to update quantity
export async function PUT(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId }
    });

    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      },
      data: { quantity }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Cart Error:", error);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }
}

// DELETE to remove item or clear cart
export async function DELETE(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId }
    });

    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    if (productId) {
      // Remove specific item
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: parseInt(productId)
          }
        }
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Cart Error:", error);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
