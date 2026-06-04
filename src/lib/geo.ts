import { NextRequest } from "next/server";

/**
 * Utility to extract user country code from request headers.
 * Supports Cloudflare (cf-ipcountry) and Vercel (x-vercel-ip-country).
 * Defaults to "IN" (India) if no headers are found (e.g. on localhost).
 */
export function getDetectedCountry(req: NextRequest | Request): string {
  const headers = req.headers;
  
  // 1. Try Cloudflare (standard for custom server VPS / Hostinger behind Cloudflare)
  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry) {
    return cfCountry.toUpperCase();
  }

  // 2. Try Vercel (default hosting environment)
  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return vercelCountry.toUpperCase();
  }

  // 3. Fallback to India for localhost/local development
  return "IN";
}
