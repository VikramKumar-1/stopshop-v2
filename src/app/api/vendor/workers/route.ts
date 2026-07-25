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

    const workers = await prisma.user.findMany({
      where: {
        parentVendorId: user.userId,
        role: "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ success: true, workers });
  } catch (error) {
    console.error("Fetch workers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch workers" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("stopshop_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "vendor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, mobile } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Worker name is required" }, { status: 400 });
    }

    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const email = `worker_${uniqueId}@vendor${user.userId}.stopshop.local`;
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(uniqueId, 10);

    const newWorker = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile: mobile || null,
        role: "user",
        parentVendorId: user.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        createdAt: true
      }
    });

    return NextResponse.json({ success: true, worker: newWorker });
  } catch (error) {
    console.error("Create worker error:", error);
    return NextResponse.json({ success: false, error: "Failed to create worker" }, { status: 500 });
  }
}
