// Notification Service Skeleton
// Future-proof structure for Email/SMS webhooks

import { getOrderConfirmationEmail, getOrderDispatchedEmail, getOrderDeliveredEmail } from "./email-templates";

const sendEmail = async (to: string, subject: string, html: string) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Email Stub] To: ${to} | Subject: ${subject}`);
    return;
  }
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "StopShop <orders@stopshop.in>",
        to,
        subject,
        html
      })
    });
    if (!res.ok) console.error("Failed to send email:", await res.text());
  } catch (err) {
    console.error("Email error:", err);
  }
};

export const NotificationService = {
  async sendOrderConfirmation(orderId: string, email: string, phone: string, amountPaise: number = 0, items: string = "Your items") {
    console.log(`[Notification] Order Confirmation for ${orderId} sent to ${email} / ${phone}`);
    await sendEmail(
      email,
      `Order Confirmed - #${orderId}`,
      getOrderConfirmationEmail(orderId, amountPaise, items)
    );
  },

  async sendPaymentFailed(orderId: string, email: string, phone: string) {
    console.log(`[Notification] Payment Failed for ${orderId} sent to ${email} / ${phone}`);
  },

  async sendOrderDispatched(orderId: string, awbCode: string, courier: string, email: string) {
    console.log(`[Notification] Order ${orderId} Dispatched via ${courier} (AWB: ${awbCode}) sent to ${email}`);
    await sendEmail(
      email,
      `Order Dispatched - #${orderId}`,
      getOrderDispatchedEmail(orderId, awbCode, courier)
    );
  },

  async sendOrderDelivered(orderId: string, email: string, productId: number = 0) {
    console.log(`[Notification] Order ${orderId} Delivered sent to ${email}`);
    await sendEmail(
      email,
      `Order Delivered - #${orderId}`,
      getOrderDeliveredEmail(orderId, productId)
    );
  },

  async sendReturnRequested(orderId: string, email: string) {
    console.log(`[Notification] Return Requested for ${orderId} sent to ${email}`);
  },

  async sendReturnApproved(orderId: string, email: string, pickupDate: string) {
    console.log(`[Notification] Return Approved for ${orderId}. Pickup on ${pickupDate} sent to ${email}`);
  },

  async sendReturnRejected(orderId: string, email: string, reason: string) {
    console.log(`[Notification] Return Rejected for ${orderId}. Reason: ${reason} sent to ${email}`);
  },

  async sendRefundInitiated(orderId: string, amountPaise: number, email: string) {
    console.log(`[Notification] Refund of ₹${amountPaise / 100} initiated for ${orderId} sent to ${email}`);
  },

  async sendVendorPayoutSettled(vendorId: number, amountPaise: number, ref: string) {
    console.log(`[Notification] Vendor ${vendorId} Paid ₹${amountPaise / 100} (Ref: ${ref})`);
  }
};
