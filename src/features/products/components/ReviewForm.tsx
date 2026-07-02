"use client";
import React, { useState } from "react";
import { Star, Upload, X, Loader2, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
  productId: number;
  orderId?: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, orderId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setIsUploading(true);
    setError("");
    
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
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
          title,
          comment,
          images
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      if (onReviewSubmitted) {
        setTimeout(onReviewSubmitted, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <h3 className="text-lg font-bold text-heading">Review Submitted!</h3>
        <p className="text-sm text-muted">Thank you for sharing your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h3 className="text-lg font-bold text-heading">Write a Review</h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-muted hover:text-heading">
            <X size={20} />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-medium">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-heading uppercase tracking-wider">Overall Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={32}
                className={`transition-colors ${(hoverRating || rating) >= star ? "fill-orange-500 text-orange-500" : "text-muted"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-heading uppercase tracking-wider">Review Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Sum up your experience in one line"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-heading uppercase tracking-wider">Review (Optional)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="What did you like or dislike? How did you use this product?"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none text-sm min-h-[120px] resize-y"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-heading uppercase tracking-wider flex justify-between">
            <span>Add Photos</span>
            <span className="text-muted lowercase normal-case font-medium">{images.length}/5</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Review" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-orange-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-surface hover:bg-orange-500/5 text-muted hover:text-orange-500">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                <span className="text-[10px] font-medium">{isUploading ? "..." : "Upload"}</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-border text-heading font-bold text-xs uppercase hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isUploading || rating === 0}
          className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
