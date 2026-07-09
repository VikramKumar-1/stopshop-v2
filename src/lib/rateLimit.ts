/**
 * In-memory sliding-window rate limiter.
 *
 * Each limiter instance tracks request timestamps per key (typically client IP).
 * Expired entries are automatically cleaned up to prevent memory leaks.
 *
 * Usage:
 *   const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });
 *   const result = loginLimiter.check(clientIp);
 *   if (!result.allowed) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
 */

interface RateLimiterOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed within the window */
  max: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

interface RateLimiter {
  check: (key: string) => RateLimitResult;
  reset: (key: string) => void;
}

const store = new Map<string, Map<string, number[]>>();
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupScheduled() {
  if (cleanupTimer) return;
  // Run cleanup every 5 minutes to evict stale entries
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    Array.from(store.entries()).forEach(([limiterKey, entries]) => {
      Array.from(entries.entries()).forEach(([key, timestamps]) => {
        // Find the oldest window any limiter might care about (15 min max)
        const cutoff = now - 15 * 60 * 1000;
        const filtered = timestamps.filter((t: number) => t > cutoff);
        if (filtered.length === 0) {
          entries.delete(key);
        } else {
          entries.set(key, filtered);
        }
      });
      if (entries.size === 0) {
        store.delete(limiterKey);
      }
    });
  }, 5 * 60 * 1000);

  // Don't prevent process from exiting
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

let limiterCounter = 0;

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { windowMs, max } = options;
  const limiterKey = `limiter_${++limiterCounter}`;

  ensureCleanupScheduled();

  function getEntries(): Map<string, number[]> {
    let entries = store.get(limiterKey);
    if (!entries) {
      entries = new Map();
      store.set(limiterKey, entries);
    }
    return entries;
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entries = getEntries();
      const timestamps = entries.get(key) || [];

      // Filter to only timestamps within the current window
      const windowStart = now - windowMs;
      const recent = timestamps.filter((t) => t > windowStart);

      if (recent.length >= max) {
        // Rate limited — calculate when the oldest request in window expires
        const oldestInWindow = recent[0];
        const retryAfterMs = oldestInWindow + windowMs - now;
        entries.set(key, recent);
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(retryAfterMs, 1000),
        };
      }

      // Allow the request
      recent.push(now);
      entries.set(key, recent);
      return {
        allowed: true,
        remaining: max - recent.length,
        retryAfterMs: 0,
      };
    },

    reset(key: string) {
      const entries = getEntries();
      entries.delete(key);
    },
  };
}

/**
 * Extract client IP from a NextRequest.
 * Checks common proxy headers first, falls back to "unknown".
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  // Vercel / Cloudflare / common reverse proxy headers
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// ─── Pre-configured limiters ─────────────────────────────────────────────────

/** Login: 5 attempts per 15 minutes per IP */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

/** Registration: 3 attempts per 15 minutes per IP */
export const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
});

/** General API: 100 requests per minute per IP */
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
});
