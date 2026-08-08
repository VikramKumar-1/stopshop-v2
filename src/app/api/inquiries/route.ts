import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getInquiries, createInquiry, confirmInquiryItemSale } from "@/features/inquiries/services/inquiry";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

// Rate limit: 5 inquiries per hour per IP
const inquiryLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

// POST to submit inquiry
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rl = inquiryLimiter.check(ip);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many inquiries. Please try again later." }, { status: 429 });
    }

    const body = await req.json();

    // Call service layer for validation and DB creation
    const newInquiry = await createInquiry(body);

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully!",
      inquiry: newInquiry,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
  }
}

// GET list of inquiries
export async function GET(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Call service layer for authorization checks and DB fetching
    const inquiries = await getInquiries(session);

    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch inquiries" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

// PATCH to confirm sale / update stage status
export async function PATCH(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session || (session.role !== "admin" && session.role !== "vendor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { inquiryId, productId, status, deliveryDate } = await req.json();

    if (!inquiryId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await confirmInquiryItemSale(inquiryId, productId, status, deliveryDate);

    return NextResponse.json({
      success: true,
      message: "Order tracking status updated successfully!",
      inquiry: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update tracking status" }, { status: 500 });
  }
}
