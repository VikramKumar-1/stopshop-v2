import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin", "vendor"]);
    if (admin instanceof NextResponse) return admin;

    const returnId = parseInt(params.id);
    const body = await req.json();
    const { action, qcImages, qcNotes, rejectionReason } = body;

    const returnReq = await prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: { order: true }
    });

    if (!returnReq) {
      return NextResponse.json({ success: false, error: "Return request not found" }, { status: 404 });
    }

    // 1. Admin Approves Return -> Triggers Shiprocket Reverse Pickup
    if (action === "APPROVE") {
       if (returnReq.status !== "PENDING") {
         return NextResponse.json({ success: false, error: "Can only approve PENDING returns" }, { status: 400 });
       }
       
       const updated = await prisma.$transaction(async (tx) => {
         const req = await tx.returnRequest.update({
           where: { id: returnId },
           data: { status: "APPROVED" }
         });

         await tx.order.update({
           where: { id: returnReq.orderId },
           data: { status: "RETURN_APPROVED" }
         });
         
         return req;
       });

       // Trigger Reverse Pickup asynchronously
       fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/shiprocket/return-pickup`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ orderId: returnReq.orderId, returnRequestId: returnId })
       }).catch(e => console.error("Auto reverse-pickup trigger failed", e));

       return NextResponse.json({ success: true, data: updated });
    }

    // 2. Admin/Vendor Uploads QC after receiving
    if (action === "QC_UPLOAD") {
       if (!qcImages || qcImages.length === 0) {
          return NextResponse.json({ success: false, error: "QC images required" }, { status: 400 });
       }
       
       const updated = await prisma.returnRequest.update({
         where: { id: returnId },
         data: {
           status: "RECEIVED_AT_WAREHOUSE",
           qcImages,
           qcNotes
         }
       });

       await prisma.order.update({
         where: { id: returnReq.orderId },
         data: { status: "RETURN_RECEIVED" }
       });

       return NextResponse.json({ success: true, data: updated });
    }

    // 3. Admin/Vendor Final Decision: PASS QC -> Refund User
    if (action === "QC_PASS") {

       const updated = await prisma.$transaction(async (tx) => {
         const req = await tx.returnRequest.update({
           where: { id: returnId },
           data: { status: "REFUND_INITIATED" }
         });

         await tx.order.update({
           where: { id: returnReq.orderId },
           data: { status: "RETURNED" } // Terminal state
         });

         // Restore Stock
         const returnItems = returnReq.returnItems as any[];
         for (const item of returnItems) {
            await tx.product.update({
               where: { id: item.productId },
               data: { stock: { increment: item.quantity } }
            });
         }

         // Cancel Settlement
         await tx.settlement.updateMany({
           where: { orderId: returnReq.orderId },
           data: { status: "CANCELLED" }
         });

         return req;
       });

       return NextResponse.json({ success: true, data: updated });
    }

    // 4. Admin Final Decision: FAIL QC -> Pay Vendor, Deny User
    if (action === "QC_FAIL") {
       if (admin.role !== "admin") return NextResponse.json({ success: false, error: "Only admin can fail QC" }, { status: 403 });

       const updated = await prisma.$transaction(async (tx) => {
         const req = await tx.returnRequest.update({
           where: { id: returnId },
           data: { status: "QC_FAILED", rejectionReason }
         });

         await tx.order.update({
           where: { id: returnReq.orderId },
           data: { status: "RETURN_REJECTED" } // Terminal state
         });

         // Release Settlement to Vendor
         await tx.settlement.updateMany({
           where: { orderId: returnReq.orderId, status: "DISPUTED" },
           data: { status: "ELIGIBLE" }
         });

         return req;
       });

       return NextResponse.json({ success: true, data: updated });
    }

    // 5. Initial Rejection (Pre-Pickup)
    if (action === "REJECT") {
       if (returnReq.status !== "PENDING") {
         return NextResponse.json({ success: false, error: "Can only reject PENDING returns" }, { status: 400 });
       }
       
       const updated = await prisma.$transaction(async (tx) => {
         const req = await tx.returnRequest.update({
           where: { id: returnId },
           data: { status: "REJECTED", rejectionReason }
         });

         await tx.order.update({
           where: { id: returnReq.orderId },
           data: { status: "RETURN_REJECTED" }
         });

         // Release Settlement to Vendor
         await tx.settlement.updateMany({
           where: { orderId: returnReq.orderId, status: "DISPUTED" },
           data: { status: "ELIGIBLE" }
         });
         
         return req;
       });

       return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Return action error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
