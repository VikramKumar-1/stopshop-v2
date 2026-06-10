import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import crypto from "crypto";

function getLocaleAndTimeZone(countryCode: string) {
  const cleanCode = (countryCode || "IN").trim().toUpperCase();
  switch (cleanCode) {
    case "IN":
    case "INDIA":
      return { locale: "en-IN", timeZone: "Asia/Kolkata" };
    case "US":
    case "USA":
    case "UNITED STATES":
      return { locale: "en-US", timeZone: "America/New_York" };
    case "GB":
    case "UK":
    case "UNITED KINGDOM":
      return { locale: "en-GB", timeZone: "Europe/London" };
    case "AE":
    case "UAE":
    case "UNITED ARAB EMIRATES":
      return { locale: "en-AE", timeZone: "Asia/Dubai" };
    case "CA":
    case "CANADA":
      return { locale: "en-CA", timeZone: "America/Toronto" };
    case "AU":
    case "AUSTRALIA":
      return { locale: "en-AU", timeZone: "Australia/Sydney" };
    case "SG":
    case "SINGAPORE":
      return { locale: "en-SG", timeZone: "Asia/Singapore" };
    default:
      return { locale: "en-US", timeZone: "UTC" };
  }
}

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

    // Find the vendor of the first item
    const firstItem = order.items[0];
    let vendorName = "StopShops Private Limited";
    let vendorLocation = "StopShops Fulfillment Center, Sector 62, Noida, UP - 201301";
    let vendorGSTIN = "09AAACS9078K1Z3";
    let vendorPAN = "AAHCS9078K";

    if (firstItem && firstItem.vendorId) {
      const vendorUser = await prisma.user.findUnique({
        where: { id: firstItem.vendorId }
      });
      if (vendorUser) {
        vendorName = vendorUser.name;
        vendorLocation = vendorUser.location || "Not Provided";
        vendorGSTIN = vendorUser.gstin || "Not Provided";
        vendorPAN = vendorUser.pan || "Not Provided";
      }
    } else {
      // Fallback: Fetch default marketplace billing details from AdminSettings
      const settings = await prisma.adminSettings.findFirst();
      if (settings) {
        vendorName = settings.companyName;
        vendorLocation = settings.companyAddress;
        vendorGSTIN = settings.companyGstin;
        vendorPAN = settings.companyPan;
      }
    }

    // Fetch dynamic QR code representing verification details (Industry Standard B2C GST e-Invoice string)
    let qrBase64 = "";
    try {
      const hsnCode = order.items[0]?.productMaterial.toLowerCase().includes("steel") ? "7323" : "7418";
      const irnHash = crypto.createHash("sha256").update(order.orderNumber + vendorGSTIN).digest("hex");
      
      const qrData = `GSTIN_SUP:${vendorGSTIN}|GSTIN_REC:URP|INV_NO:${order.orderNumber}|INV_DT:${new Date(order.createdAt).toISOString().slice(0, 10)}|VAL:${(order.totalPaise / 100).toFixed(2)}|ITEM_CNT:${order.items.length}|HSN:${hsnCode}|IRN:${irnHash}`;
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
      const qrRes = await fetch(qrUrl);
      if (qrRes.ok) {
        const qrBuffer = await qrRes.arrayBuffer();
        qrBase64 = `data:image/png;base64,${Buffer.from(qrBuffer).toString("base64")}`;
      }
    } catch (e) {
      console.error("Failed to generate QR code", e);
    }

    // Generate PDF using jsPDF (A4 size: 210mm x 297mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Dynamic Currency Formatting Helper
    const currencySymbol = order.currency === "USD" ? "$" : "Rs.";
    const formatCurrency = (amtPaise: number) => {
      const amt = amtPaise / 100;
      return `${currencySymbol} ${amt.toFixed(2)}`;
    };

    // 1. Platform Brand Header (Top Row)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(249, 115, 22); // Brand Orange
    doc.text("StopShops", 14, 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Premium Heritage Copper & Brass Utensils", 14, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("TAX INVOICE", 196, 15, { align: "right" });

    // 2. Sold By & Invoice Box Row
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("Sold By:", 14, 28);
    doc.setFont("helvetica", "normal");
    doc.text(`${vendorName} (on StopShops Marketplace)`, 29, 28);

    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    // Wrap ship-from address to prevent overlap with the right invoice number box
    const wrappedLocation = doc.splitTextToSize(`Ship-from Address: ${vendorLocation}`, 110);
    doc.text(wrappedLocation, 14, 32);
    
    const gstinY = 32 + (wrappedLocation.length * 4);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`GSTIN - ${vendorGSTIN}`, 14, gstinY);

    // Invoice Box on the Right
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(245, 245, 245);
    doc.rect(130, 24, 66, 13, "F");
    doc.rect(130, 24, 66, 13, "S");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Invoice Number", 134, 29);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`# ${order.orderNumber}`, 134, 34);

    // Divider Line
    const dividerY = Math.max(gstinY + 4, 42);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(14, dividerY, 196, dividerY);

    const { locale, timeZone } = getLocaleAndTimeZone(order.shippingCountry);
    const formattedDate = new Date(order.createdAt).toLocaleDateString(locale, {
      timeZone: timeZone,
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 3. Metadata Grid: Order details, Bill to, Ship to
    const gridY = dividerY + 6;
    // Column 1: Order details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Order ID:", 14, gridY);
    doc.setFont("helvetica", "normal");
    doc.text(order.orderNumber, 32, gridY);

    doc.setFont("helvetica", "bold");
    doc.text("Order Date:", 14, gridY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(formattedDate, 34, gridY + 5);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", 14, gridY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(formattedDate, 36, gridY + 10);

    doc.setFont("helvetica", "bold");
    doc.text("PAN:", 14, gridY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(vendorPAN, 24, gridY + 15);

    // Column 2: Bill To
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 80, gridY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let currentY = gridY + 4;
    doc.text(order.shippingName, 80, currentY);
    
    // Wrap address text nicely
    const addressLines = doc.splitTextToSize(order.shippingAddress, 50);
    addressLines.forEach((line: string) => {
      currentY += 4;
      doc.text(line, 80, currentY);
    });
    currentY += 4;
    doc.text(`${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`, 80, currentY);
    currentY += 4;
    doc.text(`Phone: ${order.shippingPhone}`, 80, currentY);

    // Column 3: Ship To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Ship To", 140, gridY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let shipY = gridY + 4;
    doc.text(order.shippingName, 140, shipY);
    
    addressLines.forEach((line: string) => {
      shipY += 4;
      doc.text(line, 140, shipY);
    });
    shipY += 4;
    doc.text(`${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`, 140, shipY);
    shipY += 4;
    doc.text(`Phone: ${order.shippingPhone}`, 140, shipY);

    // Dynamic vertical position for Table
    const tableStartY = Math.max(currentY, shipY, gridY + 15) + 8;

    // Total Items Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Total Items: ${order.items.length}`, 14, tableStartY - 3);

    // 4. Products Table
    const hasTax = order.taxPaise > 0;
    const stateUpper = (order.shippingState || "").trim().toUpperCase();
    const isLocalState = stateUpper.includes("UTTAR PRADESH") || stateUpper === "UP";
    const gstHeader = isLocalState ? "CGST + SGST" : "IGST";
    const taxRate = order.subtotalPaise > 0 ? (order.taxPaise / order.subtotalPaise) * 100 : 0;
    
    let tableHeaders = [];
    if (hasTax) {
      tableHeaders = ["S.No", "Product Title", "Qty", "Unit Price", "Gross Amt", "Taxable Val", gstHeader, "Total"];
    } else {
      tableHeaders = ["S.No", "Product Title", "Qty", "Unit Price", "Total"];
    }

    const tableData = order.items.map((item, index) => {
      const grossAmount = item.totalPaise / 100;
      const hsnCode = item.productMaterial.toLowerCase().includes("steel") ? "7323" : "7418";
      const ssnCode = `SSN-${item.productId}-${item.productMaterial.toUpperCase().slice(0, 3)}`;
      const productTitleText = `${item.productName}\nMaterial: ${item.productMaterial}\nSSN: ${ssnCode}\nHSN/SAC: ${hsnCode}`;

      if (hasTax) {
        const taxableValue = grossAmount / (1 + (taxRate / 100));
        const gstAmount = grossAmount - taxableValue;
        const gstText = isLocalState 
          ? `${formatCurrency((gstAmount / 2) * 100)} (CGST)\n+ ${formatCurrency((gstAmount / 2) * 100)} (SGST)`
          : `${formatCurrency(gstAmount * 100)} (${taxRate.toFixed(0)}%)`;

        return [
          index + 1,
          productTitleText,
          item.quantity,
          formatCurrency(item.unitPaise),
          formatCurrency(item.totalPaise),
          formatCurrency(taxableValue * 100),
          gstText,
          formatCurrency(item.totalPaise)
        ];
      } else {
        return [
          index + 1,
          productTitleText,
          item.quantity,
          formatCurrency(item.unitPaise),
          formatCurrency(item.totalPaise)
        ];
      }
    });

    autoTable(doc, {
      startY: tableStartY,
      head: [tableHeaders],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", lineWidth: 0.1 },
      styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0] },
      columnStyles: {
        1: { cellWidth: 80 }, // wider title column when simplified
      }
    });

    // Summary Section
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    
    // Render QR Code if fetched successfully (on the left side)
    if (qrBase64) {
      doc.addImage(qrBase64, "PNG", 14, finalY, 26, 26);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text("Scan to verify GST e-Invoice", 14, finalY + 30);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    doc.text("Subtotal:", 135, finalY);
    doc.text(formatCurrency(order.subtotalPaise), 196, finalY, { align: "right" });

    doc.text("Shipping:", 135, finalY + 5);
    doc.text(formatCurrency(order.shippingPaise), 196, finalY + 5, { align: "right" });

    let runningY = finalY + 10;
    if (order.paymentMethod === "cod") {
      doc.text("COD Charge:", 135, runningY);
      doc.text(formatCurrency(order.codChargePaise), 196, runningY, { align: "right" });
      runningY += 5;
    }

    if (hasTax) {
      if (isLocalState) {
        const cgstVal = order.taxPaise / 2;
        const sgstVal = order.taxPaise / 2;
        
        doc.text("CGST (9%):", 135, runningY);
        doc.text(formatCurrency(cgstVal), 196, runningY, { align: "right" });
        runningY += 5;

        doc.text("SGST (9%):", 135, runningY);
        doc.text(formatCurrency(sgstVal), 196, runningY, { align: "right" });
        runningY += 5;
      } else {
        doc.text(`IGST (${taxRate.toFixed(0)}%):`, 135, runningY);
        doc.text(formatCurrency(order.taxPaise), 196, runningY, { align: "right" });
        runningY += 5;
      }
    }
    runningY += 2;

    // Grand Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Grand Total:", 135, runningY);
    doc.text(formatCurrency(order.totalPaise), 196, runningY, { align: "right" });

    // Footer divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(14, 250, 196, 250);

    // Computer generated disclaimer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer generated invoice. No signature required.", 105, 254, { align: "center" });

    // Return policy notice
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Returns Policy: You can request returns within 7 days of delivery for original brand box packaging.", 14, 264);
    
    doc.setFont("helvetica", "bold");
    doc.text("Contact Support: support@stopshops.com || Helpline: 1800 208 9898", 14, 268);

    // Flipkart-style Thank You / Brand stamp on right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22); // Orange
    doc.text("StopShops", 196, 264, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for shopping!", 196, 268, { align: "right" });

    // Bottom page count
    doc.setFontSize(7.5);
    doc.text("E. & O.E.", 14, 282);
    doc.text("page 1 of 1", 196, 282, { align: "right" });

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
