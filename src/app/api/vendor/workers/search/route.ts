// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("stopshop_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "vendor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("email"); // Keep email for backward compat

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
    }

    const workers = await prisma.user.findMany({
      where: { 
        OR: [
          { email: { contains: query } },
          { name: { contains: query } }
        ],
        role: "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        parentVendorId: true
      },
      take: 5 // limit to 5 results to avoid massive responses
    });

    if (!workers || workers.length === 0) {
      return NextResponse.json({ success: false, error: "No users found" }, { status: 404 });
    }

    // Since the frontend previously expected a single object "worker", but now we can return multiple:
    // If it's an exact match by email, we can still return it as 'worker' for backward compatibility,
    // but the best way is to update WorkersTab to expect 'workers' list. For now we will return the array as 'workers'
    // and the FIRST match as 'worker' so the frontend doesn't break until we update it.
    return NextResponse.json({ success: true, worker: workers[0], results: workers });
  } catch (error) {
    console.error("Search worker error:", error);
    return NextResponse.json({ success: false, error: "Failed to search worker" }, { status: 500 });
  }
}
