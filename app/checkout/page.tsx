"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { useProfileData } from "@/components/providers/ProfileDataContext";
import "./style.css";

function formatPrice(price: number): string {
  return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function getActualPrice(price: number): number {
  return price < 10000 ? price * 1000 : price;
}

const COURIERS = [
  { id: "jne-regular", label: "JNE Regular (2-4 hari)", fee: 50000 },
  { id: "sicepat-best", label: "SiCepat BEST (1-2 hari)", fee: 75000 },
  { id: "same-day", label: "Instant Same Day", fee: 120000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const {
    addresses,
    paymentMethods,
    submitCheckout,
    refreshAccountData,
  } = useProfileData();

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id ?? "");
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]?.id ?? "");
  const [selectedCourier, setSelectedCourier] = useState(COURIERS[0].id);
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + getActualPrice(item.price) * item.quantity, 0),
    [items]
  );
  const shippingFee = COURIERS.find((item) => item.id === selectedCourier)?.fee ?? 50000;
  const discount = promoCode.trim().toUpperCase() === "WELCOME10" ? Math.floor(subtotal * 0.1) : 0;
  const total = Math.max(subtotal + shippingFee - discount, 0);

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="checkout-empty">
            <h1>Anda harus login untuk checkout</h1>
            <Link href="/login?redirect=/checkout" className="pill-btn">Masuk</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="checkout-empty">
            <h1>Tas belanja kosong</h1>
            <Link href="/catalogue" className="pill-btn">Belanja Sekarang</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <section className="checkout-wrap">
          <div className="checkout-main">
            <header className="checkout-header">
              <p className="checkout-label">Checkout</p>
              <h1>Pembayaran & Pengiriman</h1>
            </header>

            <section className="checkout-card">
              <h2>Alamat Pengiriman</h2>
              {addresses.length === 0 ? (
                <p className="checkout-hint">
                  Tambahkan alamat dulu di <Link href="/profile?tab=address">halaman profil</Link>.
                </p>
              ) : (
                <div className="checkout-options">
                  {addresses.map((address) => (
                    <label key={address.id} className="checkout-option">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                      />
                      <div>
                        <strong>{address.label}</strong>
                        <p>{address.recipient} · {address.phone}</p>
                        <p>{address.line1}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section className="checkout-card">
              <h2>Metode Pembayaran</h2>
              {paymentMethods.length === 0 ? (
                <p className="checkout-hint">
                  Tambahkan metode pembayaran di <Link href="/profile?tab=payment">profil</Link>.
                </p>
              ) : (
                <div className="checkout-options">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="checkout-option">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                      <div>
                        <strong>{method.label}</strong>
                        <p>{method.details}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section className="checkout-card">
              <h2>Pengiriman</h2>
              <div className="checkout-options">
                {COURIERS.map((courier) => (
                  <label key={courier.id} className="checkout-option">
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourier === courier.id}
                      onChange={() => setSelectedCourier(courier.id)}
                    />
                    <div>
                      <strong>{courier.label}</strong>
                      <p>{formatPrice(courier.fee)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="checkout-card">
              <h2>Catatan Pesanan & Promo</h2>
              <textarea
                className="checkout-textarea"
                placeholder="Catatan untuk penjual (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <input
                className="checkout-input"
                placeholder="Kode promo (contoh: WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>Ringkasan Pembayaran</h2>
            <div className="checkout-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="checkout-row"><span>Pengiriman</span><span>{formatPrice(shippingFee)}</span></div>
            <div className="checkout-row"><span>Diskon</span><span>-{formatPrice(discount)}</span></div>
            <div className="checkout-total"><span>Total</span><span>{formatPrice(total)}</span></div>
            {error && <p className="checkout-error">{error}</p>}
            <button
              type="button"
              className="checkout-submit"
              disabled={loading}
              onClick={async () => {
                setError(null);
                if (!selectedAddress || !selectedPayment) {
                  setError("Alamat dan metode pembayaran wajib dipilih.");
                  return;
                }
                setLoading(true);
                const result = await submitCheckout({
                  items,
                  shipping: shippingFee,
                  total,
                  addressId: selectedAddress,
                  paymentMethodId: selectedPayment,
                  courier: COURIERS.find((item) => item.id === selectedCourier)?.label ?? "JNE Regular",
                  notes,
                  promoCode: promoCode.trim() || undefined,
                });
                setLoading(false);
                if (!result.success) {
                  setError(result.message ?? "Checkout gagal.");
                  return;
                }
                clearCart();
                await refreshAccountData();
                router.push("/profile?tab=orders");
              }}
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

