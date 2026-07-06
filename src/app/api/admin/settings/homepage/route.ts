import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { homepageSections, mobileBanners } = body;

    const updated = await prisma.adminSettings.upsert({
      where: { id: 1 },
      create: {
        defaultCommissionRate: 10,
        shippingFreeAbove: 99900,
        shippingChargePaise: 4900,
        codShippingChargePaise: 4900,
        internationalShippingPaise: 49900,
        codEnabled: true,
        codMaxAmountPaise: 1000000,
        codSurchargePaise: 0,
        returnWindowDays: 7,
        returnEnabled: true,
        shiprocketAutoAssign: true,
        shiprocketCourierPriority: "cheapest",
        homepageSections,
        mobileBanners,
      },
      update: { homepageSections, mobileBanners },
    });

    return NextResponse.json({ success: true, homepageSections: updated.homepageSections, mobileBanners: updated.mobileBanners });
    } catch (error: any) {
      console.error("Admin homepage settings error:", error);
      return NextResponse.json({ error: "Failed to update homepage settings. Error: " + error.message }, { status: 500 });
    }
}
