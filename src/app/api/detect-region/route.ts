import { NextRequest, NextResponse } from "next/server";
import { getDetectedCountry } from "@/lib/geo";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const country = getDetectedCountry(req);
    return NextResponse.json({ country });
  } catch (error: any) {
    return NextResponse.json({ country: "IN", error: error.message }, { status: 500 });
  }
}
