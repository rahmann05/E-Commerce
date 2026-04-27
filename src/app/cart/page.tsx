"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./cart.css";


/** Format price without toLocaleString (avoids SSR/client locale mismatch) */
function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getActualPrice(price: any): number {
  const p = Number(price ?? 0);
  return p < 10000 ? p * 1000 : p;
}

import { getImageUrl } from "@/frontend/lib/image-utils";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Filter out invalid items and calculate total
  const validItems = items.filter(item => item && item.product);
  const actualCartTotal = validItems.reduce((total, item) => total + getActualPrice(item.product.price) * item.quantity, 0);

  // Total is now just the subtotal (removing shipping fee as requested)
  const finalTotal = actualCartTotal;

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="cart-container">
        
        {items.length === 0 ? (
          <motion.div 
            className="cart-empty-state-v2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cart-empty-icon-container">
              <div className="cart-empty-icon-bg" />
              <div className="cart-empty-icon-inner">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="cart-empty-title">Tas Belanja Kosong</h2>
            <p className="cart-empty-text">
              Sepertinya Anda belum menambahkan apa pun ke tas belanja Anda. <br />
              Temukan sesuatu yang spesial untuk Anda hari ini.
            </p>
            <Link href="/catalogue" className="cart-empty-cta">
              Mulai Belanja
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="cart-content-grid">
            
            {/* Left: Item List */}
            <div className="cart-items-col">
              <header className="cart-header">
                <h1 className="cart-title">Tas Belanja</h1>
                <span className="cart-subtitle">{items.length} {items.length === 1 ? "BARANG" : "BARANG"}</span>
              </header>

              <AnimatePresence>
                {validItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className="cart-item-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Product Image */}
                    <div className="cart-item-image">
                      <Image 
                        src={getImageUrl(item.product.imageUrl || item.product.image || (item.product.images && item.product.images[0]))} 
                        alt={item.product.name} 
                        fill 
                        style={{ objectFit: "cover" }} 
                      />
                    </div>

                    {/* Details */}
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <div className="cart-item-info-group">
                          <Link href={`/catalogue/${item.productId}`} className="cart-item-name">{item.product.name}</Link>
                          <div className="cart-item-meta">
                            {item.variant.size} · {item.variant.color || "Default"}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="cart-item-footer">
                        {/* Quantity Selector */}
                        <div className="cart-qty-selector">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="cart-item-price">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={getActualPrice(item.product.price) * item.quantity}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              Rp {formatPrice(getActualPrice(item.product.price) * item.quantity)}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right: Summary */}
            <div className="cart-summary-col">
              <div className="cart-summary-box">
                <h2 className="cart-summary-title">Ringkasan Pesanan</h2>
                
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={actualCartTotal}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Rp {formatPrice(actualCartTotal)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="cart-summary-divider" />
                
                <div className="cart-summary-total">
                  <span>Total</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={finalTotal}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                    >
                      Rp {formatPrice(finalTotal)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <button
                  className="cart-checkout-btn"
                  type="button"
                  onClick={() => {
                    if (!user) {
                      router.push("/login?redirect=/cart");
                      return;
                    }
                    router.push("/checkout");
                  }}
                >
                  <span>Lanjutkan ke Pembayaran</span>
                  <ArrowRight size={16} />
                </button>

                {!user && (
                  <p className="cart-login-hint">
                    Anda perlu <Link href="/login?redirect=/cart" className="cart-login-link">Masuk</Link> untuk melakukan checkout.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
      </main>
      <Footer />
    </>
  );
}
