import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";

// This cron job should be called daily at 00:00 (Midnight) by a scheduling service (like Vercel Cron or AWS EventBridge)
export async function GET(req: NextRequest) {
  try {
    // 1. Fetch current global admin settings for payout schedule
    let settings = await prisma.adminSettings.findFirst();
    if (!settings) {
       console.log("No admin settings found. Skipping automated payouts.");
       return NextResponse.json({ success: true, message: "No settings found" });
    }

    const schedule = settings.payoutSchedule || "MANUAL";

    // 2. Determine if today is the correct day to run based on the schedule
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    const dateOfMonth = today.getDate();

    let shouldRun = false;

    switch (schedule) {
       case "MANUAL":
          shouldRun = false;
          break;
       case "DAILY":
          shouldRun = true;
          break;
       case "WEEKLY_WED":
          shouldRun = (dayOfWeek === 3); // Wednesday
          break;
       case "WEEKLY_THU":
          shouldRun = (dayOfWeek === 4); // Thursday
          break;
       case "BIWEEKLY":
          // Run on the 1st and 15th of the month
          shouldRun = (dateOfMonth === 1 || dateOfMonth === 15);
          break;
       case "MONTHLY":
          // Run on the 1st of the month
          shouldRun = (dateOfMonth === 1);
          break;
       case "CUSTOM_DAYS":
          if (!settings.lastPayoutRun) {
             shouldRun = true; // Never run before, so run today
          } else {
             const customDays = settings.payoutCustomDays || 10;
             const daysSinceLastRun = Math.floor((today.getTime() - settings.lastPayoutRun.getTime()) / (1000 * 60 * 60 * 24));
             shouldRun = (daysSinceLastRun >= customDays);
          }
          break;
       default:
          shouldRun = false;
    }

    if (!shouldRun) {
       console.log(`Cron triggered, but schedule is ${schedule}. Skipping payouts for today.`);
       return NextResponse.json({ 
          success: true, 
          message: `Schedule is ${schedule}. No payouts processed today.`,
          executed: false
       });
    }

    console.log(`Schedule is ${schedule}. Proceeding with Automated Payouts!`);

    // Initialize Razorpay client if keys are available
    let razorpay: Razorpay | null = null;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
       razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
       });
    }

    // Update lastPayoutRun in AdminSettings immediately
    await prisma.adminSettings.update({
       where: { id: settings.id },
       data: { lastPayoutRun: new Date() }
    });

    // 3. Find all ELIGIBLE settlements
    const eligibleSettlements = await prisma.settlement.findMany({
       where: { status: "ELIGIBLE" },
       include: {
          vendor: true,
          order: true
       }
    });

    if (eligibleSettlements.length === 0) {
       return NextResponse.json({ success: true, message: "No eligible settlements to process.", executed: true });
    }

    // 4. Process Payouts
    let processedCount = 0;
    let failedIds = [];

    for (const settlement of eligibleSettlements) {
       if (!settlement.vendor.razorpayAccountId) {
          failedIds.push(settlement.id);
          continue;
       }

       if (settlement.vendor.payoutsPaused) {
          failedIds.push(settlement.id);
          continue;
       }

       try {
          let transferId = "AUTO_TRANSFER_SIMULATED_" + Date.now();

          if (razorpay) {
             // Trigger Razorpay Route Transfer API
             const transferPayload = {
                account: settlement.vendor.razorpayAccountId,
                amount: settlement.vendorPayoutPaise, // Amount to vendor (paise)
                currency: "INR",
                notes: {
                   orderId: settlement.orderId,
                   settlementId: String(settlement.id),
                   trigger: "automated_cron"
                }
             };
             const transferResponse = await razorpay.transfers.create(transferPayload);
             transferId = transferResponse.id;
          }

          // Update Settlement Status to SETTLED
          await prisma.settlement.update({
             where: { id: settlement.id },
             data: {
                status: "SETTLED",
                settledAt: new Date(),
                vendorPaymentRef: transferId,
                vendorPaymentMode: "bank_transfer",
                notes: razorpay ? "Automated payout processed via Razorpay Route" : "Simulated automated payout"
             }
          });
          processedCount++;
       } catch (e) {
          failedIds.push(settlement.id);
       }
    }

    return NextResponse.json({ 
       success: true, 
       executed: true,
       processed: processedCount, 
       failed: failedIds.length,
       message: `Successfully processed ${processedCount} payouts on ${schedule} schedule.`
    });

  } catch (error: any) {
    console.error("Cron payout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
