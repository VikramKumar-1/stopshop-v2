import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: "desc" } // Default first
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { label, name, phone, address, city, state, pincode, country, isDefault } = body;

    if (!name || !phone || !address || !city || !state || !pincode) {
       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newAddress = await prisma.$transaction(async (tx) => {
       if (isDefault) {
          await tx.address.updateMany({
             where: { userId: user.userId },
             data: { isDefault: false }
          });
       }

       return await tx.address.create({
          data: {
             userId: user.userId,
             label: label || "Home",
             name, phone, address, city, state, pincode,
             country: country || "IN",
             isDefault: isDefault || false
          }
       });
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
