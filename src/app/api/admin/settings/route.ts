import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const settings = await prisma.adminSettings.upsert({
       where: { id: 1 },
       update: {},
       create: {
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
          shiprocketCourierPriority: "cheapest",
          exportProgramContent: "StopShop Export Program helps international buyers source authentic Indian handicrafts in bulk directly from artisans. We handle QA, customs, and global logistics.",
          footerAboutText: "India's premium marketplace for kitchen, home, and lifestyle products. Trusted by buyers across 20+ countries for quality and authenticity.",
          footerContacts: [
            { id: "1", type: "email", value: "export@stopshop.com", isVisible: true },
            { id: "2", type: "phone", value: "+91 98765 43210", isVisible: true },
            { id: "3", type: "address", value: "India", isVisible: true }
          ],
          footerSocialLinks: [
            { id: "1", name: "Instagram", icon: "📸", url: "#", isVisible: true },
            { id: "2", name: "Facebook", icon: "👤", url: "#", isVisible: true },
            { id: "3", name: "YouTube", icon: "🎥", url: "#", isVisible: true },
            { id: "4", name: "WhatsApp", icon: "💬", url: "#", isVisible: true }
          ]
       }
    });

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
        "commissionGstRate", "commissionSacCode", "invoiceTemplate",
        "shippingPolicy", "refundPolicy", "privacyPolicy", "termsPolicy",
        "exportProgramContent", "footerAboutText", "footerContacts", "footerSocialLinks",
        "seoTitle", "seoDescription", "seoKeywords"
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

    // Invalidate the cache for the layout and all pages so that footer and policy changes reflect immediately
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
