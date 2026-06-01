/**
 * Helper utility to display prices in both local INR (₹) and international USD ($)
 * for B2B export clients.
 */
export function formatPrice(inrAmount: number): string {
  if (typeof inrAmount !== "number" || isNaN(inrAmount)) {
    return "₹0 ($0 USD)";
  }
  
  // Approximate conversion rate: 1 USD = 83.5 INR
  const usdAmount = Math.round(inrAmount / 83.5);
  
  return `₹${inrAmount.toLocaleString()} ($${usdAmount} USD)`;
}
