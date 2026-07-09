import { prisma } from '@/lib/db';

export interface PricingResult {
  subtotalPaise: number;
  shippingPaise: number;
  codChargePaise: number;
  taxPaise: number;
  discountPaise: number;
  couponCode: string | null;
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
  country: string = "IN",
  couponCode?: string,
  isBundle?: boolean,
  userId?: number
): Promise<PricingResult> {
  // Normalize country to handle "India", "INDIA", "in", "IN" as domestic
  const normCountry = (country || "IN").trim().toUpperCase();
  const finalCountry = (normCountry === "IN" || normCountry === "INDIA") ? "IN" : normCountry;

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
    if (finalCountry !== "IN" && product.prices) {
      const pricesConfig = typeof product.prices === 'string' ? JSON.parse(product.prices) : (product.prices as Record<string, any>);
      if (pricesConfig[finalCountry] && pricesConfig[finalCountry].mrp !== undefined) {
         const customMrp = parseFloat(pricesConfig[finalCountry].mrp);
         const customDiscount = parseFloat(pricesConfig[finalCountry].discount) || 0;
         if (!isNaN(customMrp)) {
           // This is the price in the foreign currency (e.g., USD)
           const foreignPrice = customMrp - (customMrp * customDiscount / 100);
           
           // Convert back to INR since the payment gateway processes in INR
           // We use a hardcoded default rate for safety. 
           // In a perfect world, we would fetch live rates or share the database.
           const defaultRates: Record<string, number> = {
             US: 83.5, GB: 105.0, EU: 90.0, AE: 22.7, CA: 61.0, 
             AU: 55.0, SA: 22.2, SG: 61.5, JP: 0.53
           };
           
           // If the country code isn't perfectly matched, fallback to USD (83.5)
           const conversionRate = defaultRates[finalCountry] || 83.5;
           
           unitPrice = foreignPrice * conversionRate;
         }
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
      categoryName: product.categoryName,
      vendorId: product.vendorId,
      bundleDiscountType: product.bundleDiscountType,
      bundleDiscountValue: product.bundleDiscountValue,
      crossSellIds: product.crossSellIds,
    });
  }

  // 3. Calculate Shipping
  let shippingPaise = 0;
  if (finalCountry !== "IN") {
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

  // 5.5 Handle Bundle Discount (Secure Backend Validation)
  let bundleDiscountPaise = 0;
  if (isBundle && processedItems.length > 1) {
    const mainProduct = processedItems[0];
    
    let validComboIds: number[] = [];
    if (Array.isArray(mainProduct.crossSellIds)) {
       validComboIds = mainProduct.crossSellIds.map((id: any) => Number(id));
    } else if (typeof mainProduct.crossSellIds === "string") {
       try { validComboIds = JSON.parse(mainProduct.crossSellIds).map(Number); } catch (e) {}
    }
    
    // Ensure the cart actually contains valid combo items to prevent malicious payload exploitation
    const hasValidComboItem = processedItems.some(item => item.productId !== mainProduct.productId && validComboIds.includes(item.productId));
    
    if (hasValidComboItem) {
      let validComboSubtotalPaise = 0;
      for (const item of processedItems) {
         if (item.productId === mainProduct.productId || validComboIds.includes(item.productId)) {
            validComboSubtotalPaise += item.totalPaise;
         }
      }
      
      if (mainProduct.bundleDiscountType === "PERCENTAGE") {
         bundleDiscountPaise = Math.round(validComboSubtotalPaise * (mainProduct.bundleDiscountValue || 0) / 100);
      } else if (mainProduct.bundleDiscountType === "FLAT") {
         bundleDiscountPaise = (mainProduct.bundleDiscountValue || 0) * mainProduct.quantity * 100;
         if (bundleDiscountPaise > validComboSubtotalPaise) bundleDiscountPaise = validComboSubtotalPaise;
      }
    }
  }

  // 6. Handle Coupon Discount
  let discountPaise = bundleDiscountPaise;
  let appliedCouponCode: string | null = null;
  
  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    
    if (coupon && coupon.isActive) {
      const now = new Date();
      if (coupon.startsAt <= now && (!coupon.expiresAt || coupon.expiresAt > now)) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          
          let canUse = true;
          if (userId) {
            if (coupon.isFirstOrderOnly) {
              const totalSuccessfulOrders = await prisma.order.count({
                where: {
                  userId,
                  status: { notIn: ["PENDING", "CANCELLED", "FAILED"] }
                }
              });
              if (totalSuccessfulOrders > 0) {
                canUse = false;
              }
            }

            if (canUse && coupon.maxUsesPerUser) {
              const userUses = await prisma.order.count({
                where: {
                  userId,
                  couponCode: coupon.code,
                  status: { notIn: ["PENDING", "CANCELLED", "FAILED"] }
                }
              });
              if (userUses >= coupon.maxUsesPerUser) {
                canUse = false;
              }
            }
          }

          if (canUse) {
            // Determine eligible subtotal based on vendorId, applicableCategories, and applicableMaterials
          let eligibleItems = processedItems;
          if (coupon.vendorId) {
            eligibleItems = eligibleItems.filter(item => item.vendorId === coupon.vendorId);
          }
          if (coupon.applicableCategories) {
            const allowedCats = coupon.applicableCategories.split(',').map((c: string) => c.trim().toLowerCase()).filter(Boolean);
            if (allowedCats.length > 0) {
              eligibleItems = eligibleItems.filter(item => item.categoryName && allowedCats.includes(item.categoryName.toLowerCase()));
            }
          }
          if (coupon.applicableMaterials) {
            const allowedMats = coupon.applicableMaterials.split(',').map((m: string) => m.trim().toLowerCase()).filter(Boolean);
            if (allowedMats.length > 0) {
              eligibleItems = eligibleItems.filter(item => item.productMaterial && allowedMats.includes(item.productMaterial.toLowerCase()));
            }
          }
          const eligibleSubtotalPaise = eligibleItems.reduce((sum, item) => sum + item.totalPaise, 0);

          if (eligibleSubtotalPaise > 0 && eligibleSubtotalPaise >= coupon.minOrderPaise) {
            if (coupon.discountType === "PERCENTAGE") {
              let cDiscount = Math.round(eligibleSubtotalPaise * (coupon.discountValue / 100));
              if (coupon.maxDiscountPaise && cDiscount > coupon.maxDiscountPaise) {
                cDiscount = coupon.maxDiscountPaise;
              }
              discountPaise += cDiscount;
            } else if (coupon.discountType === "FLAT") {
              discountPaise += coupon.discountValue * 100;
            }
            if (discountPaise > subtotalPaise) discountPaise = subtotalPaise;
            appliedCouponCode = code;
          }
          }
        }
      }
    }
  }

  // 7. Total
  const totalPaise = subtotalPaise + shippingPaise + codChargePaise + taxPaise - discountPaise;

  return {
    subtotalPaise,
    shippingPaise,
    codChargePaise,
    taxPaise,
    discountPaise,
    couponCode: appliedCouponCode,
    totalPaise,
    items: processedItems
  };
}
