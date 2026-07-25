// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("stopshop_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "vendor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { workerId, action } = await request.json();

    if (!workerId || !action) {
      return NextResponse.json({ success: false, error: "Worker ID and action are required" }, { status: 400 });
    }

    if (action === "assign") {
      const worker = await prisma.user.findUnique({ where: { id: workerId } });
      if (!worker) {
        return NextResponse.json({ success: false, error: "Worker not found" }, { status: 404 });
      }
      if (worker.role !== "user") {
        return NextResponse.json({ success: false, error: "Only standard users can be assigned as workers" }, { status: 403 });
      }
      if (worker.parentVendorId && worker.parentVendorId !== user.userId) {
        return NextResponse.json({ success: false, error: "User is already assigned to another vendor" }, { status: 403 });
      }

      const updated = await prisma.user.update({
        where: { id: workerId },
        data: { parentVendorId: user.userId }
      });
      return NextResponse.json({ success: true, worker: updated });
    } else if (action === "remove") {
      // Ensure the worker is actually assigned to this vendor before removing
      const worker = await prisma.user.findUnique({ where: { id: workerId } });
      if (worker?.parentVendorId !== user.userId) {
        return NextResponse.json({ success: false, error: "Worker is not assigned to you" }, { status: 403 });
      }

      const updated = await prisma.user.update({
        where: { id: workerId },
        data: { parentVendorId: null }
      });
      return NextResponse.json({ success: true, worker: updated });
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Worker assignment error:", error);
    return NextResponse.json({ success: false, error: "Failed to perform assignment action" }, { status: 500 });
  }
}
