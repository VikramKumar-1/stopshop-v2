export interface IntentEvent {
  productId: number;
  vendorId: number;
  type: "CART" | "WISHLIST";
}

class IntentQueue {
  private queue: IntentEvent[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 1000; // 1 second for testing (was 10000)
  private readonly MAX_QUEUE_SIZE = 50;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.flush());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'hidden') this.flush();
      });
    }
  }

  public track(event: IntentEvent) {
    this.queue.push(event);

    if (this.queue.length >= this.MAX_QUEUE_SIZE) {
      this.flush();
    } else if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
    }
  }

  public async flush() {
    if (this.queue.length === 0) return;

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    // Capture current queue and clear it immediately so new events aren't blocked
    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      // Use standard fetch
      const res = await fetch("/api/intents/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // User is not logged in, drop the queue silently
          return;
        }
        throw new Error(`Batch API failed with status: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to sync intents, requeuing...", error);
      // Re-queue failed events at the beginning, but prevent infinite fast loops
      this.queue = [...eventsToSend, ...this.queue];
      // Backoff slightly
      if (!this.flushTimeout) {
        this.flushTimeout = setTimeout(() => this.flush(), 5000);
      }
    }
  }
}

// Export a singleton instance
export const intentQueue = new IntentQueue();
