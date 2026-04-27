"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import "./style.css";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/products/${productId}/reviews`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
          setSummary(data.summary);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className="reviews-loading">Memuat ulasan...</div>;
  }

  if (summary.total === 0) {
    return (
      <div className="reviews-empty">
        <MessageSquare size={24} color="#ccc" style={{ margin: "0 auto 0.5rem" }} />
        <p>Belum ada ulasan untuk produk ini.</p>
      </div>
    );
  }

  return (
    <div className="product-reviews-section">
      <div className="reviews-header">
        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#111" }}>Ulasan Pembeli</h4>
        <div className="reviews-summary-badge">
          <Star size={14} fill="#111" color="#111" />
          <span>{summary.average.toFixed(1)} / 5.0</span>
          <span style={{ color: "#888", fontWeight: 400 }}>({summary.total} ulasan)</span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-user-info">
              <div className="review-avatar">
                {review.user.image ? (
                  <img src={review.user.image} alt={review.user.name || "User"} />
                ) : (
                  <span>{(review.user.name || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="review-user-name">{review.user.name || "Pengguna Anonim"}</div>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </div>
              </div>
              <div className="review-stars-small">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < review.rating ? "#f59e0b" : "#e5e7eb"}
                    color={i < review.rating ? "#f59e0b" : "#e5e7eb"}
                  />
                ))}
              </div>
            </div>
            {review.comment && <p className="review-comment-text">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
