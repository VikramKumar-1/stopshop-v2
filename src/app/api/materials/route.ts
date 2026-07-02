import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const defaultMaterials = ["Bronze", "Copper", "Brass", "Steel", "Ceramic", "Glass"];
    
    const dbMaterials = await prisma.product.findMany({
      where: { material: { not: "" } },
      select: { material: true },
      distinct: ["material"]
    });

    const fetchedMaterials = dbMaterials.map(m => m.material).filter(Boolean);
    const combinedMaterials = Array.from(new Set([...defaultMaterials, ...fetchedMaterials])).sort();

    return NextResponse.json({ success: true, materials: combinedMaterials });
  } catch (error: any) {
    return NextResponse.json({ success: true, materials: ["Bronze", "Copper", "Brass", "Steel", "Ceramic", "Glass"] });
  }
}
