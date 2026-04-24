"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ArrowUpRight, Star } from "lucide-react";
import type { CatalogueProduct } from "./types";
import { useAuth } from "@/components/providers/AuthContext";
import { useCart } from "@/components/providers/CartContext";

interface Props {
  product: CatalogueProduct | null;
  onClose: () => void;
}

/** Format price without toLocaleString (avoids SSR/client locale mismatch) */
function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function expandSizeRange(range: string): string[] {
  const parts = range.split(" - ").map((s) => s.trim());
  if (parts.length < 2) return [range];
  const [start, end] = parts;

  // Waist sizes: W28 - W36
  if (start.startsWith("W") && end.startsWith("W")) {
    const s = parseInt(start.slice(1), 10);
    const e = parseInt(end.slice(1), 10);
    const result: string[] = [];
    for (let i = s; i <= e; i += 2) result.push(`W${i}`);
    return result;
  }

  // Letter sizes: S - XXL
  const si = LETTER_SIZES.indexOf(start);
  const ei = LETTER_SIZES.indexOf(end);
  if (si !== -1 && ei !== -1) return LETTER_SIZES.slice(si, ei + 1);

  return [start, end];
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!user) {
      // Not logged in — send to login, return here afterwards
      onClose();
      router.push("/login?redirect=/catalogue");
      return;
    }
    
    if (!product) return;
    
    // Default to first size/color if none selected for demo purposes
    const size = selectedSize || (product.sizes ? expandSizeRange(product.sizes)[0] : "OS");
    const color = selectedColor || (product.colors.length > 0 ? product.colors[0] : "Default");

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image,
      size,
      color,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Compute sizes from product — safe because product is checked in JSX before use
  const sizes = product?.sizes
    ? product.sizes.includes(" - ")
      ? expandSizeRange(product.sizes)
      : product.sizes.split(",").map((s) => s.trim())
    : [];

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal-backdrop"
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal-sheet"
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* ── Left: product image ── */}
            <div className="modal-image-col">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Bottom gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(180deg, transparent, rgba(10,10,10,0.5))",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />

              {/* Price badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  zIndex: 5,
                  background: "rgba(245,245,243,0.92)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "3rem",
                  padding: "0.5rem 1.2rem",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#111",
                  boxShadow: "6px 6px 14px rgba(0,0,0,0.12), -4px -4px 10px rgba(255,255,255,0.8)",
                }}
              >
                Rp{formatPrice(product.price)}
              </motion.div>

              {/* Close button */}
              <motion.button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* ── Right: product details ── */}
            <div className="modal-detail-col">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <div className="modal-product-category">{product.category}</div>
                <h2 className="modal-product-name">{product.name}</h2>

                {/* Star rating */}
                <div style={{ display: "flex", gap: "3px", marginBottom: "1.2rem" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < product.rating ? "#111" : "#ddd"}
                      color={i < product.rating ? "#111" : "#ddd"}
                    />
                  ))}
                  <span
                    style={{ fontSize: "0.75rem", color: "#aaa", marginLeft: "0.5rem", alignSelf: "center" }}
                  >
                    {product.rating}/5
                  </span>
                </div>

                <p className="modal-product-desc">{product.description}</p>

                {/* Size selector */}
                {sizes.length > 0 && (
                  <>
                    <div className="modal-size-label">Select Size</div>
                    <div className="modal-sizes-row">
                      {sizes.map((size) => (
                        <motion.button
                          type="button"
                          key={size}
                          className={`modal-size-btn${selectedSize === size ? " selected" : ""}`}
                          onClick={() => setSelectedSize(size)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                {/* Color selector */}
                {product.colors.length > 0 && (
                  <>
                    <div className="modal-colors-label">Color</div>
                    <div className="modal-colors-row">
                      {product.colors.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className={`modal-color-btn${selectedColor === color ? " selected" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Add to Cart */}
                <motion.button
                  type="button"
                  className="modal-add-btn"
                  onClick={handleAdd}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: user ? "#111" : "rgba(155,81,224,0.9)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={added ? "added" : "add"}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {added
                        ? "Added to Cart ✓"
                        : user
                        ? "Add to Cart"
                        : "Login untuk Membeli"}
                    </motion.span>
                  </AnimatePresence>
                  {!added && (
                    <span className="btn-arrow">
                      <ArrowUpRight size={14} />
                    </span>
                  )}
                </motion.button>

                <div
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.75rem",
                    color: "#bbb",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Free shipping on orders above Rp500k · Easy 30-day returns
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
