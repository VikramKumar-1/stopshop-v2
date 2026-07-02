"use client";
import React, { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

interface InlineReviewStarsProps {
  productId: number;
  orderId: string;
}

export default function InlineReviewStars({ productId, orderId }: InlineReviewStarsProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating first");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          comment
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit rating");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-1 mt-4 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-2 rounded-lg w-fit border border-emerald-500/20">
        <CheckCircle2 size={16} />
        Thank you! Your review has been submitted.
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 bg-surface border border-border rounded-xl p-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-heading uppercase tracking-wider">Rate this product:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting}
              className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => {
                setRating(star);
                if (error) setError("");
              }}
            >
              <Star
                size={28}
                className={`transition-colors ${(hoverRating || rating) >= star ? "fill-orange-500 text-orange-500" : "text-muted"}`}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Show review box if they have selected at least 1 star or if we just want it always visible */}
      {rating > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a review (Optional)"
            disabled={isSubmitting}
            className="w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none min-h-[60px] resize-y"
          />
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-red-500 font-medium">{error}</span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all flex items-center gap-1"
            >
              {isSubmitting && <Loader2 size={12} className="animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
      
      {rating === 0 && error && <p className="text-[9px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
