// ENV driven payment configuration

export const RAZORPAY_CONFIG = {
  keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
};

export const PAYU_CONFIG = {
  merchantKey: process.env.PAYU_MERCHANT_KEY || "gtKFFx", // Universal test key
  merchantSalt: process.env.PAYU_MERCHANT_SALT || "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW", // Universal test salt
  baseUrl: process.env.PAYU_BASE_URL || "https://test.payu.in",
};

export const COD_CONFIG = {
  enabled: true,
  maxAmountPaise: 1000000, // ₹10,000 limit
};

export function isRazorpayConfigured() {
  return RAZORPAY_CONFIG.keyId !== "" && RAZORPAY_CONFIG.keySecret !== "";
}

export function isPayUConfigured() {
  return PAYU_CONFIG.merchantKey !== "" && PAYU_CONFIG.merchantSalt !== "";
}
