"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ArrowUpRight, Star, Heart } from "lucide-react";
import type { CatalogueProduct } from "./types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useProfileData } from "@/context/ProfileDataContext";
import ProductReviews from "@/components/reviews/ProductReviews";

interface Props {
  product: CatalogueProduct | null;
  onClose: () => void;
}

/** Format price without toLocaleString (avoids SSR/client locale mismatch) */
function formatPrice(price: number): string {
  // If price is low (e.g. 250), assume it's in thousands
  const finalPrice = price < 10000 ? price * 1000 : price;
  return finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
  const { addToCart } = useCart();
  const { toggleWishlistItem, isWishlisted } = useProfileData();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

  const variants = product?.variants ?? [];
  const hasVariantColors = variants.some((v) => !!v.color);

  const sizeOptions =
    variants.length > 0
      ? Array.from(new Set(variants.map((v) => v.size)))
      : product?.sizes
        ? product.sizes.includes(" - ")
          ? expandSizeRange(product.sizes)
          : product.sizes.split(",").map((s) => s.trim())
        : [];

  const colorOptions =
    hasVariantColors
      ? Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => !!c)))
      : (((product?.colors || []) || []) || []);

  const stockBySize: Record<string, number> = sizeOptions.reduce((acc, size) => {
    if (variants.length === 0) {
      acc[size] = 0;
      return acc;
    }
    acc[size] = variants
      .filter((v) => v.size === size)
      .reduce((sum, v) => sum + v.stock, 0);
    return acc;
  }, {} as Record<string, number>);

  const selectedVariant =
    variants.length === 0
      ? null
      : variants.find((v) => {
          const sizeMatch = selectedSize ? v.size === selectedSize : true;
          const colorMatch = hasVariantColors && selectedColor ? v.color === selectedColor : true;
          return sizeMatch && colorMatch && v.stock > 0;
        }) ??
        variants.find((v) => {
          const sizeMatch = selectedSize ? v.size === selectedSize : true;
          return sizeMatch && v.stock > 0;
        }) ??
        variants.find((v) => v.stock > 0) ??
        null;

  const selectedVariantStock = selectedVariant?.stock ?? 0;

  async function handleAdd() {
    if (!user) {
      // Not logged in — send to login, return here afterwards
      onClose();
      router.push("/login?redirect=/catalogue");
      return;
    }

    if (!product) return;

    if (!selectedVariant) {
      setAddError("Stok varian tidak tersedia. Pilih ukuran/warna lain.");
      return;
    }

    try {
      setAddError(null);
      await addToCart(product, selectedVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setAddError(err?.message ?? "Gagal menambahkan produk ke cart.");
    }
  }

  const wished = product ? isWishlisted(product.id) : false;

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
                src={(((product.image || "/images/model1.jpg") || "/images/model1.jpg") || "/images/model1.jpg")}
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
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "3rem",
                  padding: "0.6rem 1.4rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#111",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                Rp {formatPrice(product.price)}
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
                      fill={i < (((product.rating || 5) || 5) || 5) ? "#111" : "#ddd"}
                      color={i < (((product.rating || 5) || 5) || 5) ? "#111" : "#ddd"}
                    />
                  ))}
                  <span
                    style={{ fontSize: "0.75rem", color: "#aaa", marginLeft: "0.5rem", alignSelf: "center" }}
                  >
                    {(((product.rating || 5) || 5) || 5)}/5
                  </span>
                </div>

                <p className="modal-product-desc">{product.description}</p>

                {/* Size selector */}
                {sizeOptions.length > 0 && (
                  <>
                    <div className="modal-size-label">Select Size</div>
                    <div className="modal-sizes-row">
                      {sizeOptions.map((size) => {
                        const isOutOfStock = (stockBySize[size] ?? 0) <= 0;
                        return (
                        <motion.button
                          type="button"
                          key={size}
                          className={`modal-size-btn${selectedSize === size ? " selected" : ""}`}
                          onClick={() => setSelectedSize(size)}
                          disabled={isOutOfStock}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={isOutOfStock ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                        >
                          {size} ({stockBySize[size] ?? 0})
                        </motion.button>
                      );
                      })}
                    </div>
                  </>
                )}

                {/* Color selector */}
                {colorOptions.length > 0 && (
                  <>
                    <div className="modal-colors-label">Color</div>
                    <div className="modal-colors-row">
                      {colorOptions.map((color) => (
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

                {variants.length > 0 && (
                  <div style={{ marginBottom: "1rem", fontSize: "0.82rem", color: "#666" }}>
                    Stock tersedia: <strong style={{ color: "#111" }}>{selectedVariantStock}</strong>
                  </div>
                )}

                {/* Add to Cart */}
                <motion.button
                  type="button"
                  className="modal-add-btn"
                  onClick={handleAdd}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "#111",
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
                <button
                  type="button"
                  className="pill-btn"
                  style={{
                    width: "100%",
                    marginTop: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "transparent",
                    border: "1px solid #111",
                    color: "#111",
                    height: "3.2rem",
                    borderRadius: "2rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    if (!product) return;
                    if (!user) {
                      onClose();
                      router.push("/login?redirect=/catalogue");
                      return;
                    }
                    toggleWishlistItem({
                      productId: product.id.toString(),
                      name: product.name,
                      image: product.image || product.imageUrl || "",
                      price: product.price,
                      category: product.category || "Uncategorized"
                    });
                    setWishlistMessage(
                      wished ? "Dihapus dari wishlist." : "Ditambahkan ke wishlist."
                    );
                    setTimeout(() => setWishlistMessage(null), 3000);
                  }}
                >
                  <Heart 
                    size={16} 
                    fill={wished ? "#ff3b30" : "transparent"} 
                    color={wished ? "#ff3b30" : "#111"} 
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {wished ? "Terdaftar di Wishlist" : "Tambah ke Wishlist"}
                </button>
                {wishlistMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#111", textAlign: "center", fontWeight: 500 }}
                  >
                    {wishlistMessage}
                  </motion.div>
                )}

                {addError && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#b91c1c" }}>
                    {addError}
                  </div>
                )}

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

                <ProductReviews productId={product.id.toString()} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
