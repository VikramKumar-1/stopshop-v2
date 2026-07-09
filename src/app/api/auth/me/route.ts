import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getProfile } from "@/features/auth/services/auth";

// GET current logged-in user profile
export async function GET(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        location: true,
        artisanId: true,
        gstin: true,
        aadhaar: true,
        pan: true,
        aadhaarUrl: true,
        panUrl: true,
        docUrl: true,
        vendorStatus: true,
        allowedCategories: true,
        rejectionReason: true,
      },
    });

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

// POST to logout (clear token cookie)
export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  // SECURITY: Clear the cookie with matching attributes to ensure it's fully removed
  response.cookies.set({
    name: "stopshop_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });
  return response;
}

// PATCH to update logged-in user profile (e.g., Workshop Name & Documents)
export async function PATCH(req: NextRequest) {
  try {
    const session = getAuthUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, mobile, location, artisanId, gstin, aadhaar, pan, aadhaarUrl, panUrl, docUrl } = body;

    const { prisma } = await import("@/lib/db");
    
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true, vendorStatus: true }
    });

    const statusesThatTriggerReview = ["PENDING", "INCOMPLETE", "REJECTED"];
    let newVendorStatus = undefined;
    if (currentUser?.role === "vendor" && statusesThatTriggerReview.includes(currentUser.vendorStatus ?? "")) {
      newVendorStatus = "IN_REVIEW";
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name !== undefined ? String(name).trim() : undefined,
        mobile: mobile !== undefined ? String(mobile).trim() : undefined,
        location: location !== undefined ? String(location).trim() : undefined,
        artisanId: artisanId !== undefined ? String(artisanId).trim() : undefined,
        gstin: gstin !== undefined ? String(gstin).trim() : undefined,
        aadhaar: aadhaar !== undefined ? String(aadhaar).trim() : undefined,
        pan: pan !== undefined ? String(pan).trim() : undefined,
        aadhaarUrl: aadhaarUrl !== undefined ? aadhaarUrl : undefined,
        panUrl: panUrl !== undefined ? panUrl : undefined,
        docUrl: docUrl !== undefined ? docUrl : undefined,
        ...(newVendorStatus ? { vendorStatus: newVendorStatus } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mobile: true,
        location: true,
        artisanId: true,
        gstin: true,
        aadhaar: true,
        pan: true,
        aadhaarUrl: true,
        panUrl: true,
        docUrl: true,
        vendorStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
