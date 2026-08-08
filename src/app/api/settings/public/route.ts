import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.adminSettings.findFirst();
    return NextResponse.json({
      success: true,
      settings: {
        shippingFreeAbove: settings?.shippingFreeAbove || 99900,
        shippingChargePaise: settings?.shippingChargePaise || 4900,
        codShippingChargePaise: settings?.codShippingChargePaise || 4900,
        internationalShippingPaise: settings?.internationalShippingPaise || 49900,
        codSurchargePaise: settings?.codSurchargePaise || 0,
        taxRate: settings?.taxRate || 0,
        exportProgramContent: settings?.exportProgramContent || "",
        footerAboutText: settings?.footerAboutText || "",
        footerContacts: settings?.footerContacts || [],
        footerSocialLinks: settings?.footerSocialLinks || []
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
