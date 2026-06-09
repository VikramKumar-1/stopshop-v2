import { prisma } from '@/lib/db';

export interface PricingResult {
  subtotalPaise: number;
  shippingPaise: number;
  codChargePaise: number;
  taxPaise: number;
  totalPaise: number;
  items: {
    productId: number;
    quantity: number;
    unitPaise: number;
    totalPaise: number;
    productName: string;
    productImage: string;
    productMaterial: string;
    vendorId: number | null;
  }[];
}

export async function calculateOrderPricing(
  cartItems: { productId: number; quantity: number }[],
  paymentMethod: "razorpay" | "payu" | "cod",
  country: string = "IN"
): Promise<PricingResult> {
  // 1. Fetch settings
  const settings = await prisma.adminSettings.findFirst() || {
    shippingFreeAbove: 99900,
    shippingChargePaise: 4900,
    codShippingChargePaise: 4900,
    internationalShippingPaise: 49900,
    codSurchargePaise: 0,
    defaultCommissionRate: 10,
    taxRate: 0,
  };

  let subtotalPaise = 0;
  const processedItems = [];

  // 2. Fetch fresh prices for all items directly from DB
  for (const item of cartItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product || !product.active) {
      throw new Error(`Product ID ${item.productId} is unavailable.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
    }

    // Determine price based on country (fallback to default price)
    let unitPrice = product.price; // Default price in INR
    if (country !== "IN" && product.prices) {
      const pricesConfig = product.prices as Record<string, any>;
      if (pricesConfig[country] && pricesConfig[country].price) {
         unitPrice = pricesConfig[country].price;
      }
    }

    // Always convert to paise for integer precision
    const unitPaise = Math.round(unitPrice * 100);
    const itemTotalPaise = unitPaise * item.quantity;
    
    subtotalPaise += itemTotalPaise;

    processedItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPaise,
      totalPaise: itemTotalPaise,
      productName: product.name,
      productImage: product.image,
      productMaterial: product.material,
      vendorId: product.vendorId,
    });
  }

  // 3. Calculate Shipping
  let shippingPaise = 0;
  if (country !== "IN") {
    shippingPaise = settings.internationalShippingPaise;
  } else {
    if (subtotalPaise < settings.shippingFreeAbove) {
      shippingPaise = paymentMethod === "cod" ? settings.codShippingChargePaise : settings.shippingChargePaise;
    }
  }

  // 4. Calculate COD Surcharge
  let codChargePaise = 0;
  if (paymentMethod === "cod") {
    codChargePaise = settings.codSurchargePaise;
  }

  // 5. Calculate Tax
  const taxRate = settings.taxRate || 0;
  const taxPaise = Math.round(subtotalPaise * (taxRate / 100));

  // 6. Total
  const totalPaise = subtotalPaise + shippingPaise + codChargePaise + taxPaise;

  return {
    subtotalPaise,
    shippingPaise,
    codChargePaise,
    taxPaise,
    totalPaise,
    items: processedItems
  };
}
