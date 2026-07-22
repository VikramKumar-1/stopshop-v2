import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, description } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    if (!mobile || !mobile.trim()) {
      return NextResponse.json({ success: false, error: "Mobile number is required" }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ success: false, error: "Description/Message is required" }, { status: 400 });
    }

    // Save ticket to Database
    const ticket = await prisma.supportTicket.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        description: description.trim(),
        status: "OPEN"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Help & Support ticket submitted successfully! Our team will contact you shortly.",
      ticket
    });
  } catch (err: any) {
    console.error("Support Ticket Submission Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit support ticket" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      tickets
    });
  } catch (err: any) {
    console.error("Fetch Support Tickets Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Ticket ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const ticket = await prisma.supportTicket.update({
      where: { id: Number(id) },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: "Support ticket updated successfully",
      ticket
    });
  } catch (err: any) {
    console.error("Update Support Ticket Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update support ticket" },
      { status: 500 }
    );
  }
}
