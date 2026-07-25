import crypto from "crypto";
import { PAYU_CONFIG } from "./paymentConfig";

/**
 * Initiates a refund for a PayU transaction.
 * @param mihpayid The PayU Transaction ID (stored in razorpayPaymentId for payu orders)
 * @param amountPaise The amount to refund in paise
 * @returns { success: true, message: string } or throws an Error
 */
export async function processPayURefund(mihpayid: string, amountPaise: number) {
  if (!PAYU_CONFIG.merchantKey || !PAYU_CONFIG.merchantSalt) {
    throw new Error("PayU is not configured properly");
  }

  const refundAmount = (amountPaise / 100).toFixed(2);
  const command = "cancel_refund_transaction";
  
  // Hash format for cancel_refund_transaction: key|command|var1|salt
  const hashString = `${PAYU_CONFIG.merchantKey}|${command}|${mihpayid}|${PAYU_CONFIG.merchantSalt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const refundTokenId = `ref_${Date.now()}`;

  const params = new URLSearchParams();
  params.append("key", PAYU_CONFIG.merchantKey);
  params.append("command", command);
  params.append("hash", hash);
  params.append("var1", mihpayid);
  params.append("var2", refundTokenId); // Merchant's unique refund ID
  params.append("var3", refundAmount);

  // PayU WebService Endpoint
  const isTest = PAYU_CONFIG.baseUrl.includes("test");
  const postUrl = isTest 
    ? "https://test.payu.in/merchant/postservice?form=2" 
    : "https://info.payu.in/merchant/postservice.php?form=2";

  const response = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const text = await response.text();
  let result;
  
  try {
     result = JSON.parse(text);
  } catch(e) {
     throw new Error("PayU returned invalid JSON: " + text);
  }

  // PayU generally returns { status: 1, msg: "Refund Request queued..." } on success
  // and { status: 0, msg: "..." } on failure.
  if (result.status === 1) {
    return { success: true, message: result.msg || "Refund initiated" };
  } else {
    throw new Error(result.msg || "PayU refund failed");
  }
}
