import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const user = requireRole(req, ["vendor"]);
    if (user instanceof NextResponse) return user; // auth failed

    const vendorId = user.userId;
    const body = await req.json();
    const { name, email, account_number, ifsc } = body;

    if (!name || !email || !account_number || !ifsc) {
      return NextResponse.json({ success: false, error: "Missing required bank details" }, { status: 400 });
    }

    // Verify vendor exists
    const vendor = await prisma.user.findUnique({ where: { id: vendorId } });
    if (!vendor) return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });

    // Initialize Razorpay SDK using Environment Variables (Future-Proof)
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ success: false, error: "Razorpay credentials not configured in .env" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create a Linked Account for Razorpay Route
    // API ref: https://razorpay.com/docs/api/route/#create-an-account
    const accountPayload = {
      name: name,
      email: email,
      tnc_accepted: true,
      account_details: {
        business_name: name,
        business_type: "individual"
      },
      bank_account: {
        ifsc_code: ifsc,
        beneficiary_name: name,
        account_type: "current", // or savings based on vendor input, assuming current for business
        account_number: account_number
      }
    };

    // Note: The Razorpay Node SDK maps 'razorpay.beta.accounts.create' or direct API fetch depending on version.
    // In newer SDKs: razorpay.accounts.create
    // We wrap in try-catch to catch specific Razorpay API errors
    let linkedAccount: any;
    try {
        // Fallback to fetch if the SDK method isn't strictly typed for Route accounts
        const response = await fetch("https://api.razorpay.com/v2/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}`
            },
            body: JSON.stringify(accountPayload)
        });
        
        linkedAccount = await response.json();
        
        if (!response.ok) {
            throw new Error(linkedAccount.error?.description || "Failed to create Linked Account in Razorpay");
        }
    } catch (err: any) {
        throw new Error(err.message);
    }

    // Save the new razorpayAccountId (e.g., acc_XXXXX) to the vendor's profile
    await prisma.user.update({
      where: { id: vendorId },
      data: { razorpayAccountId: linkedAccount.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Razorpay Linked Account created successfully",
      accountId: linkedAccount.id
    });

  } catch (error: any) {
    console.error("Razorpay Onboard Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
