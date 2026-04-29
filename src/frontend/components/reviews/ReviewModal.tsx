"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import "./style.css"; // We will add basic styling later

interface ReviewModalProps {
  productId: string;
  orderId: string;
  productName: string;
  productImage?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ productId, orderId, productName, productImage, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, orderId, rating, comment }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Gagal mengirim ulasan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>Berikan Ulasan</h3>
          <button className="review-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        <div className="review-modal-body">
          <div className="review-product-info">
            {productImage ? (
              <img src={productImage} alt={productName} className="review-product-image" />
            ) : (
              <div className="review-product-placeholder"></div>
            )}
            <div className="review-product-name">{productName}</div>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            <div className="review-rating-container">
              <label>Kualitas Produk</label>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="review-star-btn"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Beri nilai ${star} bintang`}
                  >
                    <Star
                      size={28}
                      fill={(hoverRating || rating) >= star ? "#f59e0b" : "transparent"}
                      color={(hoverRating || rating) >= star ? "#f59e0b" : "#d1d5db"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="review-comment-container">
              <label htmlFor="comment">Komentar (Opsional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagikan pendapat Anda tentang produk ini..."
                rows={4}
                className="review-textarea"
                maxLength={500}
              />
              <div className="review-char-count">{comment.length}/500</div>
            </div>

            {error && <div className="review-error">{error}</div>}

            <div className="review-actions">
              <button type="button" onClick={onClose} className="review-btn-cancel" disabled={loading}>
                Batal
              </button>
              <button type="submit" className="review-btn-submit" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Kirim Ulasan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
