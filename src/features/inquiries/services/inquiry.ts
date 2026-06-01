import { prisma } from "@/lib/db";
import { TokenPayload } from "@/lib/auth";

/**
 * Service containing the business and database logic for B2B Inquiries.
 * Decouples app/api/inquiries routes from database logic.
 */

export async function getInquiries(session: TokenPayload) {
  // Administrators and vendors fetch all inquiries
  if (session.role === "admin" || session.role === "vendor") {
    return prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // Customers (role === "user") can only fetch their own inquiries matching their email address
  return prisma.inquiry.findMany({
    where: { email: session.email },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInquiry(body: any) {
  const { name, email, phone, companyName, country, items, message } = body;

  if (!name || !email || !phone || !message) {
    throw new Error("Name, email, phone, and message are required fields");
  }

  // Real-time Validation-on-Action: Validate that every item in the inquiry is active and in-stock
  if (items && Array.isArray(items)) {
    for (const item of items) {
      if (item && item.id) {
        const prod = await prisma.product.findUnique({ where: { id: parseInt(item.id) } });
        if (!prod || prod.active === false) {
          throw new Error(`Product "${item.name || 'Selected item'}" is currently unavailable.`);
        }
        if (prod.stock <= 0) {
          throw new Error(`Product "${prod.name}" is currently out of stock.`);
        }
      }
    }
  }

  const newInquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone,
      companyName: companyName || null,
      country: country || null,
      items: items ? JSON.parse(JSON.stringify(items)) : [],
      message,
    },
  });

  return newInquiry;
}

export async function confirmInquiryItemSale(inquiryId: number, productId: number, status?: string, deliveryDate?: string) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
  });

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  let itemsList = [];
  try {
    itemsList = typeof inquiry.items === "string" ? JSON.parse(inquiry.items) : (inquiry.items as any[]) || [];
  } catch (e) {
    itemsList = (inquiry.items as any[]) || [];
  }

  let itemFound = false;

  const updatedItems = itemsList.map((item: any) => {
    if (item.id === productId) {
      itemFound = true;
      if (status) {
        item.status = status;
        if (status === "DELIVERED") {
          item.sold = true;
        }
      }
      if (deliveryDate !== undefined) {
        item.deliveryDate = deliveryDate;
      }
    }
    return item;
  });

  if (!itemFound) {
    throw new Error("Product not found in this inquiry");
  }

  // Update inquiry items
  const updatedInquiry = await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      items: JSON.parse(JSON.stringify(updatedItems)),
    },
  });

  return updatedInquiry;
}
