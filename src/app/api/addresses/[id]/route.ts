import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// Whitelist of fields that can be updated via PATCH
const ALLOWED_FIELDS = new Set([
  "label", "name", "phone", "address", "city", "state", "pincode", "country", "isDefault"
]);

// Max lengths for string fields
const MAX_LENGTHS: Record<string, number> = {
  label: 50,
  name: 100,
  phone: 15,
  address: 500,
  city: 100,
  state: 100,
  pincode: 10,
  country: 100,
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const addressId = parseInt(params.id);
    if (isNaN(addressId)) {
      return NextResponse.json({ success: false, error: "Invalid address ID" }, { status: 400 });
    }

    const body = await req.json();

    // Filter body to only allowed fields (prevent field injection)
    const sanitizedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.has(key)) continue;

      if (key === "isDefault") {
        sanitizedData[key] = Boolean(value);
      } else if (typeof value === "string") {
        const maxLen = MAX_LENGTHS[key] || 200;
        sanitizedData[key] = value.trim().slice(0, maxLen);
      }
    }

    if (Object.keys(sanitizedData).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields to update" }, { status: 400 });
    }

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== user.userId) {
       return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
       if (sanitizedData.isDefault) {
          await tx.address.updateMany({
             where: { userId: user.userId },
             data: { isDefault: false }
          });
       }

       return await tx.address.update({
          where: { id: addressId },
          data: sanitizedData
       });
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const addressId = parseInt(params.id);

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== user.userId) {
       return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: addressId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
