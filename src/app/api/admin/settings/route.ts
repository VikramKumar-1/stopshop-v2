import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    let settings = await prisma.adminSettings.findFirst();
    
    if (!settings) {
       // Seed default if missing
       settings = await prisma.adminSettings.create({
          data: {
             defaultCommissionRate: 10,
             commissionGstRate: 18,
             commissionSacCode: "996111",
             shippingFreeAbove: 99900,
             shippingChargePaise: 4900,
             codShippingChargePaise: 4900,
             internationalShippingPaise: 49900,
             codEnabled: true,
             codMaxAmountPaise: 1000000,
             codSurchargePaise: 0,
             returnWindowDays: 7,
             returnEnabled: true,
             vendorReturnSlaHours: 24,
             shiprocketAutoAssign: true,
             shiprocketCourierPriority: "cheapest"
          }
       });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    
    // Whitelist editable fields
    const updates: any = {};
    const allowedFields = [
       "defaultCommissionRate", "taxRate", "shippingFreeAbove", "shippingChargePaise", 
       "codShippingChargePaise", "internationalShippingPaise", "codEnabled", 
       "codMaxAmountPaise", "codSurchargePaise", "returnWindowDays", 
       "returnEnabled", "vendorReturnSlaHours", "shiprocketPickupLocation", "shiprocketAutoAssign", 
       "shiprocketCourierPriority", "payoutSchedule", "payoutCustomDays",
        "companyName", "companyAddress", "companyGstin", "companyPan",
        "companyCity", "companyState", "companyCountry", "companyPincode",
        "commissionGstRate", "commissionSacCode", "invoiceTemplate"
    ];

    for (const field of allowedFields) {
       if (body[field] !== undefined) {
          updates[field] = body[field];
       }
    }

    const settings = await prisma.adminSettings.findFirst();
    if (!settings) throw new Error("Settings not initialized");

    const updated = await prisma.adminSettings.update({
       where: { id: settings.id },
       data: updates
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
