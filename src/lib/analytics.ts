// Analytics utility functions for Phase 8 data collection & user behavior tracking

export function trackProductView(productId: number | string, productName?: string) {
  if (typeof window === "undefined") return;
  try {
    // Dispatch custom event for frontend listeners or future tracking pixels
    window.dispatchEvent(
      new CustomEvent("stopshop:analytics:product_view", {
        detail: { productId, productName, timestamp: new Date().toISOString() },
      })
    );
  } catch (error) {
    console.warn("Analytics error:", error);
  }
}

export function trackAddToCart(productId: number | string, quantity: number = 1, price?: number) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("stopshop:analytics:add_to_cart", {
        detail: { productId, quantity, price, timestamp: new Date().toISOString() },
      })
    );
  } catch (error) {
    console.warn("Analytics error:", error);
  }
}

export function trackSearch(query: string, resultsCount?: number) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("stopshop:analytics:search", {
        detail: { query, resultsCount, timestamp: new Date().toISOString() },
      })
    );
  } catch (error) {
    console.warn("Analytics error:", error);
  }
}
