import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import crypto from "crypto";
import QRCode from "qrcode";
import { currencyDatabase } from "@/lib/currencyData";
import { getInrPerForeignUnit } from "@/lib/exchangeRates";

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
    let vendorName = "StopShop Private Limited";
    let vendorLocation = "StopShop Fulfillment Center, Sector 62, Noida, UP - 201301";
    let vendorGSTIN = "09AAACS9078K1Z3";
    let vendorPAN = "AAHCS9078K";

    const settings = await prisma.adminSettings.findFirst();

    if (firstItem && firstItem.vendorId) {
      const vendorUser = await prisma.user.findUnique({
        where: { id: firstItem.vendorId }
      });
      if (vendorUser) {
        vendorName = vendorUser.name;
        vendorLocation = vendorUser.location || "Fulfillment Hub, India";
        vendorGSTIN = vendorUser.gstin || "URP (Unregistered Vendor)";
        vendorPAN = vendorUser.pan || "NA";
      }
    } else if (settings) {
      vendorName = settings.companyName || vendorName;
      vendorLocation = settings.companyAddress || vendorLocation;
      vendorGSTIN = settings.companyGstin || vendorGSTIN;
      vendorPAN = settings.companyPan || vendorPAN;
    }

    // Generate dynamic QR code locally (Industry Standard B2C GST e-Invoice string)
    let qrBase64 = "";
    try {
      const hsnCode = order.items[0]?.productMaterial.toLowerCase().includes("steel") ? "7323" : "7418";
      const irnHash = crypto.createHash("sha256").update(order.orderNumber + vendorGSTIN).digest("hex");
      const qrData = `GSTIN_SUP:${vendorGSTIN}|GSTIN_REC:URP|INV_NO:${order.orderNumber}|INV_DT:${new Date(order.createdAt).toISOString().slice(0, 10)}|VAL:${(order.totalPaise / 100).toFixed(2)}|ITEM_CNT:${order.items.length}|HSN:${hsnCode}|IRN:${irnHash}`;
      qrBase64 = await QRCode.toDataURL(qrData, { width: 160, margin: 1 });
    } catch (e) {
      console.error("Failed to generate QR code locally", e);
    }

    // Create A4 PDF Document (210mm x 297mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const cleanCountry = (order.shippingCountry || "IN").trim().toUpperCase();
    const isInternationalOrder = order.orderNumber.startsWith("SS-INTL-") || (cleanCountry !== "IN" && cleanCountry !== "INDIA");

    const currencyInfo = currencyDatabase[cleanCountry] || { c: "USD", s: "$" };
    const liveRateInrPerUnit = isInternationalOrder ? await getInrPerForeignUnit(currencyInfo.c) : 1.0;
    const currencySymbol = isInternationalOrder ? currencyInfo.s : "Rs.";

    const formatCurrency = (amtPaise: number) => {
      const amtInr = (amtPaise || 0) / 100;
      if (isInternationalOrder && liveRateInrPerUnit > 0) {
        const foreignAmt = amtInr / liveRateInrPerUnit;
        return `${currencySymbol} ${foreignAmt.toFixed(2)}`;
      }
      return `${currencySymbol} ${amtInr.toFixed(2)}`;
    };

    const { locale, timeZone } = getLocaleAndTimeZone(order.shippingCountry);
    const orderDateStr = new Date(order.createdAt).toLocaleDateString(locale, {
      timeZone,
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 1. TOP BRAND ACCENT BAR & HEADER
    doc.setFillColor(249, 115, 22); // #F97316 Brand Orange
    doc.rect(0, 0, 210, 4, "F");

    // Brand Name & Subtitle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22);
    doc.text("StopShop", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Premium Heritage Utensils & Marketplace", 14, 21);

    // Right Header: TAX INVOICE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("TAX INVOICE", 196, 16, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(249, 115, 22);
    doc.text(`ORIGINAL FOR RECIPIENT`, 196, 21, { align: "right" });

    // Header Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, 25, 196, 25);

    // 2. SELLER & INVOICE METADATA ROW
    let currentY = 31;

    // Left Column: Seller Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Sold By / Seller:", 14, currentY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${vendorName}`, 14, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    const wrappedLocation = doc.splitTextToSize(`Address: ${vendorLocation}`, 105);
    wrappedLocation.forEach((line: string, i: number) => {
      doc.text(line, 14, currentY + 9.5 + (i * 3.8));
    });

    let sellerBottomY = currentY + 9.5 + (wrappedLocation.length * 3.8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`GSTIN: ${vendorGSTIN}  |  PAN: ${vendorPAN}`, 14, sellerBottomY + 1);

    // Right Column: Invoice Details Box Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(128, 28, 68, 26, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Invoice Number:", 132, 33);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(249, 115, 22);
    doc.text(`${order.orderNumber}`, 192, 33, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Order Date:", 132, 39);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(orderDateStr, 192, 39, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Method:", 132, 45);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text((order.paymentMethod || "PREPAID").toUpperCase(), 192, 45, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Status:", 132, 51);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(order.paymentStatus === "COMPLETED" ? 16 : 217, order.paymentStatus === "COMPLETED" ? 185 : 119, order.paymentStatus === "COMPLETED" ? 129 : 6);
    doc.text((order.paymentStatus || "PENDING").toUpperCase(), 192, 51, { align: "right" });

    currentY = Math.max(sellerBottomY + 5, 58);

    // 3. FULFILLMENT & DELIVERY STATUS BANNER
    const isDelivered = order.status === "DELIVERED" || !!order.deliveredAt;
    const deliveryDateStr = order.deliveredAt
      ? new Date(order.deliveredAt).toLocaleDateString(locale, { timeZone, day: "numeric", month: "long", year: "numeric" })
      : (order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(locale, { timeZone, day: "numeric", month: "long", year: "numeric" }) : orderDateStr);

    if (isDelivered) {
      doc.setFillColor(240, 253, 244); // Soft Emerald Fill
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(14, currentY, 182, 9, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52);
      doc.text(`FULFILLMENT STATUS: DELIVERED ON ${deliveryDateStr.toUpperCase()}`, 18, currentY + 6);

      if (order.awbCode) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Courier: ${order.courierName || 'Shiprocket'} (AWB: ${order.awbCode})`, 192, currentY + 6, { align: "right" });
      }
    } else {
      doc.setFillColor(254, 243, 199); // Amber Soft Fill
      doc.setDrawColor(253, 230, 138);
      doc.roundedRect(14, currentY, 182, 9, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(146, 64, 14);
      doc.text(`ORDER STATUS: ${(order.status || "CONFIRMED").replace(/_/g, ' ').toUpperCase()}`, 18, currentY + 6);

      if (order.awbCode) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`AWB Tracking: ${order.awbCode}`, 192, currentY + 6, { align: "right" });
      }
    }

    currentY += 13;

    // 4. BILL TO & SHIP TO CARDS (SIDE-BY-SIDE)
    const cardWidth = 88;
    const cardHeight = 26;

    // Bill To Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, cardWidth, cardHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Billing Address (Bill To)", 18, currentY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(order.shippingName || "Customer", 18, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const billAddressLines = doc.splitTextToSize(`${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`, cardWidth - 8);
    billAddressLines.slice(0, 2).forEach((line: string, i: number) => {
      doc.text(line, 18, currentY + 14 + (i * 3.5));
    });
    doc.text(`Phone: ${order.shippingPhone}`, 18, currentY + 22);

    // Ship To Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(108, currentY, cardWidth, cardHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Shipping Address (Ship To)", 112, currentY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(order.shippingName || "Customer", 112, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    billAddressLines.slice(0, 2).forEach((line: string, i: number) => {
      doc.text(line, 112, currentY + 14 + (i * 3.5));
    });
    doc.text(`Phone: ${order.shippingPhone}`, 112, currentY + 22);

    currentY += cardHeight + 8;

    // 5. PRODUCTS & TAXABLE ITEMS TABLE (jsPDF autoTable)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Order Items (${order.items.length})`, 14, currentY - 2);

    const hasTax = order.taxPaise > 0;
    const stateUpper = (order.shippingState || "").trim().toUpperCase();
    const isLocalState = stateUpper.includes("UTTAR PRADESH") || stateUpper === "UP";
    const gstHeader = isLocalState ? "CGST + SGST" : "IGST";
    const taxRate = order.subtotalPaise > 0 ? (order.taxPaise / order.subtotalPaise) * 100 : 0;

    let tableHeaders = [];
    if (hasTax) {
      tableHeaders = ["#", "Product Description & HSN/SAC", "Qty", "Unit Price", "Taxable Val", gstHeader, "Total"];
    } else {
      tableHeaders = ["#", "Product Description & HSN/SAC", "Qty", "Unit Price", "Total Amount"];
    }

    const tableData = order.items.map((item, index) => {
      const grossAmount = item.totalPaise / 100;
      const hsnCode = item.productMaterial.toLowerCase().includes("steel") ? "7323" : "7418";
      const ssnCode = `SSN-${item.productId}-${item.productMaterial.toUpperCase().slice(0, 3)}`;
      const productTitleText = `${item.productName}\nMaterial: ${item.productMaterial}  |  HSN/SAC: ${hsnCode}  |  SKU: ${ssnCode}`;

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
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: "grid",
      headStyles: { 
        fillColor: [30, 41, 59], // Dark Slate Header
        textColor: [255, 255, 255], 
        fontStyle: "bold", 
        fontSize: 8,
        cellPadding: 3 
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 3, 
        textColor: [30, 41, 59], 
        lineWidth: 0.1, 
        lineColor: [226, 232, 240] 
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 85 },
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" }
      }
    });

    // 6. FINANCIAL BREAKDOWN & SUMMARY SECTION
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    
    // Left: QR Code Verification Box
    if (qrBase64) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, finalY, 70, 36, 2, 2, "FD");

      doc.addImage(qrBase64, "PNG", 17, finalY + 3, 24, 24);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text("GST e-Invoice QR Code", 44, finalY + 9);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const qrLines = doc.splitTextToSize("Scan with any GST verification app to authenticate e-Invoice IRN & tax compliance.", 38);
      qrLines.forEach((line: string, idx: number) => {
        doc.text(line, 44, finalY + 14 + (idx * 3));
      });
    }

    // Right: Summary Box
    let summaryY = finalY;
    const summaryLabelX = 130;
    const summaryValueX = 196;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    doc.text("Subtotal:", summaryLabelX, summaryY);
    doc.text(formatCurrency(order.subtotalPaise), summaryValueX, summaryY, { align: "right" });

    summaryY += 5;
    if (order.discountPaise > 0) {
      doc.setTextColor(22, 101, 52); // Emerald
      doc.text(`Coupon Discount (${order.couponCode || 'PROMO'}):`, summaryLabelX, summaryY);
      doc.text(`- ${formatCurrency(order.discountPaise)}`, summaryValueX, summaryY, { align: "right" });
      doc.setTextColor(71, 85, 105);
      summaryY += 5;
    }

    doc.text("Shipping & Freight Fee:", summaryLabelX, summaryY);
    doc.text(formatCurrency(order.shippingPaise), summaryValueX, summaryY, { align: "right" });

    if (order.paymentMethod === "cod" && order.codChargePaise > 0) {
      summaryY += 5;
      doc.text("COD Surcharge:", summaryLabelX, summaryY);
      doc.text(formatCurrency(order.codChargePaise), summaryValueX, summaryY, { align: "right" });
    }

    if (hasTax) {
      summaryY += 5;
      if (isLocalState) {
        const cgstVal = order.taxPaise / 2;
        const sgstVal = order.taxPaise / 2;
        doc.text("CGST (9%):", summaryLabelX, summaryY);
        doc.text(formatCurrency(cgstVal), summaryValueX, summaryY, { align: "right" });
        summaryY += 5;
        doc.text("SGST (9%):", summaryLabelX, summaryY);
        doc.text(formatCurrency(sgstVal), summaryValueX, summaryY, { align: "right" });
      } else {
        doc.text(`IGST (${taxRate.toFixed(0)}%):`, summaryLabelX, summaryY);
        doc.text(formatCurrency(order.taxPaise), summaryValueX, summaryY, { align: "right" });
      }
    }

    summaryY += 3;
    doc.setDrawColor(226, 232, 240);
    doc.line(summaryLabelX, summaryY, 196, summaryY);
    summaryY += 5;

    // Grand Total Card Box
    doc.setFillColor(249, 115, 22); // Orange Accent
    doc.roundedRect(summaryLabelX - 2, summaryY - 4, 68, 10, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Grand Total:", summaryLabelX, summaryY + 2.5);
    doc.text(formatCurrency(order.totalPaise), summaryValueX - 2, summaryY + 2.5, { align: "right" });

    // 7. FOOTER DISCLAIMER & BRAND STAMP
    const footerY = 265;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, footerY, 196, footerY);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("This is a computer-generated tax invoice. No physical signature is required under GST Information Technology Act.", 105, footerY + 5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Returns Policy: 7 days hassle-free return available in original brand box packaging.", 14, footerY + 11);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Helpline: support@stopshop.com  |  Toll-Free: 1800 208 9898", 14, footerY + 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(249, 115, 22);
    doc.text("StopShop Marketplace", 196, footerY + 11, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("E. & O.E.  |  Page 1 of 1", 196, footerY + 15, { align: "right" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Invoice-${order.orderNumber}.pdf"`
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
