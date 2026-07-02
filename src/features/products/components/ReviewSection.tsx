"use client";
import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, Loader2 } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  images: string[] | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string };
}

interface ReviewSectionProps {
  productId: number;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    average: 5.0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const fetchReviews = async (pageNum = 1) => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&page=${pageNum}&limit=10`);
      const data = await res.json();
      
      if (data.success) {
        if (pageNum === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setStats({
          average: data.totalCount > 0 ? (data.averageRating || 0) : 0,
          total: data.totalCount,
          distribution: data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
        setHasMore(pageNum * 10 < data.totalCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetch("/api/auth/me").then(res => res.json()).then(data => {
      setIsAuth(data.authenticated);
    }).catch(() => {});
  }, [productId]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return "1 month ago";
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
  };

  const getFirstName = (fullName: string) => fullName.split(" ")[0] || "User";

  return (
    <div className="mt-12 bg-surface-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm" id="reviews">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Stats Column */}
        <div className="md:w-1/3 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-heading self-start md:self-center w-full text-left md:text-center">Customer Reviews</h2>
          
          <div className="flex items-center gap-4">
            <span className="text-5xl font-extrabold text-heading">{stats.total > 0 ? stats.average.toFixed(1) : "0"}</span>
            <div className="flex flex-col">
              <div className="flex text-orange-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill={stats.total > 0 && star <= Math.round(stats.average) ? "currentColor" : "none"} className={stats.total === 0 ? "text-muted stroke-muted" : ""} />
                ))}
              </div>
              <span className="text-sm text-muted font-medium mt-1">Based on {stats.total} reviews</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isAuth) {
                window.location.href = `/profile?redirect=/product/${productId}#reviews`;
                return;
              }
              setShowForm(true);
            }}
            className="w-full py-3 bg-heading text-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Distribution Column */}
        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 space-y-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = stats.distribution[star] || 0;
            const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-3 text-sm font-medium">
                <span className="w-4 text-muted">{star}</span>
                <Star size={14} className="text-muted fill-muted" />
                <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4">
          <ReviewForm 
            productId={productId} 
            onCancel={() => setShowForm(false)} 
            onReviewSubmitted={() => {
              setShowForm(false);
              fetchReviews(1);
            }} 
          />
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 bg-surface rounded-2xl border border-border border-dashed">
            <p className="text-muted font-medium">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-heading">{getFirstName(review.user.name)}</span>
                    {review.isVerified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{timeAgo(review.createdAt)}</span>
                </div>
                
                <div className="flex text-orange-500 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>

                {review.title && <h4 className="font-bold text-heading mb-1">{review.title}</h4>}
                <p className="text-sm text-body leading-relaxed whitespace-pre-wrap">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                    {review.images.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0 cursor-pointer hover:opacity-90">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Review" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="pt-4 text-center">
            <button 
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchReviews(nextPage);
              }}
              className="px-6 py-2 border border-border rounded-xl text-xs font-bold text-heading uppercase tracking-wider hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
