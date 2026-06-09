import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!order) {
       return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (user.role === "user" && order.userId !== user.userId) {
       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Generate PDF using jsPDF
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22); // Orange
    doc.text("StopShops", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Premium Heritage Copper & Brass Utensils", 14, 26);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("TAX INVOICE", 150, 20);

    // Order Details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${order.orderNumber}`, 150, 28);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 34);
    if (order.awbCode) {
       doc.text(`AWB: ${order.awbCode}`, 150, 40);
       doc.text(`Courier: ${order.courierName || 'Assigned'}`, 150, 46);
    }

    // Billing / Shipping
    doc.setFontSize(12);
    doc.text("Billed To:", 14, 40);
    doc.setFontSize(10);
    doc.text(order.shippingName, 14, 46);
    doc.text(order.shippingAddress, 14, 52);
    doc.text(`${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`, 14, 58);
    doc.text(`Phone: ${order.shippingPhone}`, 14, 64);
    doc.text(`Email: ${order.shippingEmail}`, 14, 70);

    // Items Table
    const tableData = order.items.map((item, index) => [
      index + 1,
      item.productName,
      item.quantity,
      `Rs. ${(item.unitPaise / 100).toFixed(2)}`,
      `Rs. ${(item.totalPaise / 100).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["S.No", "Item Description", "Qty", "Unit Price", "Total Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 10 }
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.text(`Subtotal:`, 140, finalY);
    doc.text(`Rs. ${(order.subtotalPaise / 100).toFixed(2)}`, 170, finalY);
    
    doc.text(`Shipping:`, 140, finalY + 6);
    doc.text(`Rs. ${(order.shippingPaise / 100).toFixed(2)}`, 170, finalY + 6);

    if (order.paymentMethod === "cod") {
       doc.text(`COD Charge:`, 140, finalY + 12);
       doc.text(`Rs. ${(order.codChargePaise / 100).toFixed(2)}`, 170, finalY + 12);
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const totalY = finalY + (order.paymentMethod === "cod" ? 20 : 14);
    doc.text(`Grand Total:`, 140, totalY);
    doc.text(`Rs. ${(order.totalPaise / 100).toFixed(2)}`, 170, totalY);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for shopping with StopShops!", 14, 280);
    doc.text(`Payment Status: ${order.paymentStatus} (${order.paymentMethod.toUpperCase()})`, 14, 286);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
       headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`
       }
    });

  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
