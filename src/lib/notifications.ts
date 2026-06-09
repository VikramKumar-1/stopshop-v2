// Notification Service Skeleton
// Future-proof structure for Email/SMS webhooks

export const NotificationService = {
  async sendOrderConfirmation(orderId: string, email: string, phone: string) {
    console.log(`[Notification] Order Confirmation for ${orderId} sent to ${email} / ${phone}`);
    // TODO: Wire up to Resend / SendGrid / Twilio
  },

  async sendPaymentFailed(orderId: string, email: string, phone: string) {
    console.log(`[Notification] Payment Failed for ${orderId} sent to ${email} / ${phone}`);
  },

  async sendOrderDispatched(orderId: string, awbCode: string, courier: string, email: string) {
    console.log(`[Notification] Order ${orderId} Dispatched via ${courier} (AWB: ${awbCode}) sent to ${email}`);
  },

  async sendOrderDelivered(orderId: string, email: string) {
    console.log(`[Notification] Order ${orderId} Delivered sent to ${email}`);
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
