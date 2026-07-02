export const getOrderConfirmationEmail = (orderNumber: string, amount: number, items: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #f97316; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Hi there,</p>
    <p>Thank you for shopping with <strong>StopShop</strong>. We've received your order and are getting it ready.</p>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0d5c43;">Order #${orderNumber}</h3>
      <p style="margin-bottom: 0;"><strong>Total Amount:</strong> ₹${(amount / 100).toLocaleString()}</p>
    </div>
    <h4>Items Ordered:</h4>
    <p>${items}</p>
    <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
    <p>Best regards,<br>The StopShop Team</p>
  </div>
</div>
`;

export const getOrderDispatchedEmail = (orderNumber: string, awb: string, courier: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #0d5c43; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">Your Order has Shipped!</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Great news! Your order <strong>#${orderNumber}</strong> has been dispatched.</p>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Courier:</strong> ${courier}</p>
      <p style="margin: 5px 0;"><strong>Tracking Number (AWB):</strong> ${awb}</p>
    </div>
    <p>You can track your order directly on our website in the Orders section.</p>
    <p>Best regards,<br>The StopShop Team</p>
  </div>
</div>
`;

export const getOrderDeliveredEmail = (orderNumber: string, productId: number) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background-color: #10b981; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">Your Order is Delivered!</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Your order <strong>#${orderNumber}</strong> has been successfully delivered.</p>
    <p>We hope you love your premium cookware! If you have a moment, we'd love to hear your thoughts.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/product/${productId}#reviews" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Leave a Review</a>
    </div>
    <p>Best regards,<br>The StopShop Team</p>
  </div>
</div>
`;
