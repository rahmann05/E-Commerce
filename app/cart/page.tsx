"use client";

import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


/** Format price without toLocaleString (avoids SSR/client locale mismatch) */
function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getActualPrice(price: number): number {
  return price < 10000 ? price * 1000 : price;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();
  const { user } = useAuth();

  const actualCartTotal = items.reduce((total, item) => total + getActualPrice(item.price) * item.quantity, 0);

  // Shipping flat fee
  const shippingFee = items.length > 0 ? 50000 : 0;
  const finalTotal = actualCartTotal + shippingFee;

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="cart-container">
        
        {/* Header */}
        <header className="cart-header">
          <h1 className="cart-title">Tas Belanja</h1>
          <div className="cart-subtitle">
            {items.length > 0 ? `${items.length} Barang` : "Kosong"}
          </div>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <p>Tas belanja Anda masih kosong.</p>
            <Link href="/catalogue" className="pill-btn" style={{ background: "#111", color: "#fff", display: "inline-block", marginTop: "2rem" }}>
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="cart-content-grid">
            
            {/* Left: Item List */}
            <div className="cart-items-col">
              <AnimatePresence>
                {items.map((item, index) => (
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
                      <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} />
                    </div>

                    {/* Details */}
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <Link href={`/catalogue/${item.productId}`} className="cart-item-name">{item.name}</Link>
                        <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="cart-item-meta">
                        Size: {item.size} · Color: <span style={{ display: "inline-block", width: 10, height: 10, background: item.color, borderRadius: "50%", marginLeft: 4, border: "1px solid rgba(0,0,0,0.1)" }}></span>
                      </div>

                      <div className="cart-item-footer">
                        {/* Quantity Selector */}
                        <div className="cart-qty-selector">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="cart-item-price">
                          Rp{formatPrice(getActualPrice(item.price) * item.quantity)}
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
                  <span>Rp{formatPrice(actualCartTotal)}</span>
                </div>
                
                <div className="cart-summary-row">
                  <span>Pengiriman</span>
                  <span>Rp{formatPrice(shippingFee)}</span>
                </div>

                <div className="cart-summary-divider" />
                
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>Rp{formatPrice(finalTotal)}</span>
                </div>

                <button className="cart-checkout-btn">
                  <span>Lanjutkan ke Pembayaran</span>
                  <ArrowRight size={16} />
                </button>

                {!user && (
                  <p style={{ fontSize: "0.75rem", color: "#888", textAlign: "center", marginTop: "1rem" }}>
                    Anda perlu <Link href="/login?redirect=/cart" style={{ textDecoration: "underline", color: "#111" }}>Masuk</Link> untuk melakukan checkout.
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
