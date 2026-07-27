// Real-time Global Forex Exchange Rates Service (190+ Countries)
let ratesCache: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes cache for ultra-fast 0ms response

export async function getLiveRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (ratesCache && now - lastFetchTime < CACHE_DURATION_MS) {
    return ratesCache;
  }

  // Primary API: Open Exchange Rates
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 900 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        ratesCache = data.rates;
        lastFetchTime = now;
        return data.rates;
      }
    }
  } catch (err) {
    console.warn("Primary forex API failed, trying secondary fallback API...");
  }

  // Secondary API Fallback: ExchangeRate-API
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR", {
      next: { revalidate: 900 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        ratesCache = data.rates;
        lastFetchTime = now;
        return data.rates;
      }
    }
  } catch (err) {
    console.error("All forex rate APIs failed. Using fallback rates.", err);
  }

  // If cache exists (even expired), return it
  if (ratesCache) return ratesCache;

  // Real-world dynamic fallback rates
  return {
    USD: 1 / 96.0,
    EUR: 1 / 104.0,
    GBP: 1 / 120.0,
    AED: 1 / 26.1,
    CAD: 1 / 70.2,
    AUD: 1 / 62.4,
    SAR: 1 / 25.6,
    SGD: 1 / 71.3,
    JPY: 0.62,
    INR: 1.0
  };
}

/**
 * Returns how many INR equals 1 unit of foreign currency
 * E.g., for USD, returns ~96.0 (INR per 1 USD)
 */
export async function getInrPerForeignUnit(currencyCode: string): Promise<number> {
  const cleanCode = (currencyCode || "USD").trim().toUpperCase();
  if (cleanCode === "INR") return 1.0;

  const rates = await getLiveRates();
  const rateRelativeToInr = rates[cleanCode]; // e.g. 0.010416 for USD

  if (rateRelativeToInr && rateRelativeToInr > 0) {
    return 1 / rateRelativeToInr; // Convert 0.010416 -> 96.00 INR per USD
  }

  return 96.0; // Fallback
}
