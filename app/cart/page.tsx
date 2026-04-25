"use client";

import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { useProfileData } from "@/components/providers/ProfileDataContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrderFromCart } = useProfileData();
  const router = useRouter();

  const actualCartTotal = items.reduce((total, item) => total + getActualPrice(item.price) * item.quantity, 0);

  // Shipping flat fee
  const shippingFee = items.length > 0 ? 50000 : 0;
  const finalTotal = actualCartTotal + shippingFee;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    const order = placeOrderFromCart({
      items,
      shipping: shippingFee,
      total: finalTotal,
    });

    if (!order) return;
    clearCart();
    router.push("/profile?tab=orders");
  };

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
            <Link href="/catalogue" className="pill-btn cart-empty-link">
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
                        <Link href="/catalogue" className="cart-item-name">{item.name}</Link>
                        <button
                          type="button"
                          className="cart-item-remove"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Hapus ${item.name} dari tas belanja`}
                          title="Hapus item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="cart-item-meta">
                        Size: {item.size} · Color:
                        <svg className="cart-color-dot" viewBox="0 0 10 10" aria-hidden="true">
                          <circle cx="5" cy="5" r="4.5" fill={item.color} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                        </svg>
                      </div>

                      <div className="cart-item-footer">
                        {/* Quantity Selector */}
                        <div className="cart-qty-selector">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Kurangi jumlah ${item.name}`}
                            title="Kurangi jumlah"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Tambah jumlah ${item.name}`}
                            title="Tambah jumlah"
                          >
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

                <button type="button" className="cart-checkout-btn" onClick={handleCheckout}>
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
