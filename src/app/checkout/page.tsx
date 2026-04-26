"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useProfileData } from "@/context/ProfileDataContext";
import "./style.css";

interface CourierOption {
  id: string;
  label: string;
  fee: number;
}

function normalizePrice(price: number): number {
  if (!Number.isFinite(price)) return 0;
  return price < 10000 ? price * 1000 : price;
}

function formatPrice(price: number): string {
  return `Rp${Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function mapPaymentMethodToMidtransKey(label: string): string {
  const text = label.toLowerCase();
  if (text.includes("bni")) return "bni_va";
  if (text.includes("bri")) return "bri_va";
  if (text.includes("qris")) return "qris";
  if (text.includes("gopay")) return "gopay";
  return "bca_va";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const {
    addresses,
    paymentMethods,
    submitCheckout,
  } = useProfileData();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [router, user]);

  const effectiveAddressId = useMemo(() => {
    if (selectedAddressId) return selectedAddressId;
    const primary = addresses.find((a) => a.isPrimary) || addresses[0];
    return primary?.id || "";
  }, [addresses, selectedAddressId]);

  const effectivePaymentId = useMemo(() => {
    if (selectedPaymentId) return selectedPaymentId;
    const primary = paymentMethods.find((m) => m.isPrimary) || paymentMethods[0];
    return primary?.id || "";
  }, [paymentMethods, selectedPaymentId]);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === effectiveAddressId),
    [addresses, effectiveAddressId]
  );

  useEffect(() => {
    let active = true;
    const loadShippingOptions = async () => {
      if (!selectedAddress) {
        setCouriers([]);
        setSelectedCourierId("");
        return;
      }

      if (typeof selectedAddress.latitude !== "number" || typeof selectedAddress.longitude !== "number") {
        const defaults: CourierOption[] = [
          { id: "jne-reg", label: "JNE Reguler (2-4 hari)", fee: 15000 },
          { id: "sicepat-best", label: "SiCepat BEST (1-2 hari)", fee: 18000 },
        ];
        if (active) {
          setCouriers(defaults);
          setSelectedCourierId(defaults[0].id);
        }
        return;
      }

      try {
        const res = await fetch("/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: selectedAddress.latitude,
            lng: selectedAddress.longitude,
            city: selectedAddress.city,
          }),
        });

        const payload = await res.json();
        if (!res.ok || !payload?.success || !Array.isArray(payload.couriers)) {
          throw new Error(payload?.error || "Gagal mengambil ongkos kirim");
        }

        if (!active) return;
        setCouriers(payload.couriers as CourierOption[]);
        setSelectedCourierId((prev) => {
          if (prev && payload.couriers.some((c: CourierOption) => c.id === prev)) {
            return prev;
          }
          return payload.couriers[0]?.id || "";
        });
      } catch {
        if (!active) return;
        const fallback: CourierOption[] = [{ id: "jne-reg", label: "JNE Reguler (2-4 hari)", fee: 15000 }];
        setCouriers(fallback);
        setSelectedCourierId(fallback[0].id);
      }
    };

    void loadShippingOptions();
    return () => {
      active = false;
    };
  }, [selectedAddress]);

  const selectedCourier = useMemo(
    () => couriers.find((c) => c.id === selectedCourierId) || null,
    [couriers, selectedCourierId]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + normalizePrice(item.product.price) * item.quantity, 0),
    [items]
  );

  const shipping = selectedCourier?.fee || 0;
  const total = subtotal + shipping;

  const handleSubmit = async () => {
    setError(null);

    if (items.length === 0) {
      setError("Keranjang kosong. Tambahkan produk terlebih dahulu.");
      return;
    }
    if (!selectedAddressId) {
      setError("Pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!selectedPaymentId) {
      setError("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    if (!selectedCourier) {
      setError("Pilih kurir pengiriman terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitCheckout({
        items,
        shipping,
        total,
        addressId: effectiveAddressId,
        paymentMethodId: effectivePaymentId,
        courier: selectedCourier.label,
        notes: notes.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
      });

      if (!result.success || !result.orderId) {
        setError(result.message || "Checkout gagal diproses.");
        return;
      }

      const paymentMethod = paymentMethods.find((pm) => pm.id === effectivePaymentId);
      const methodKey = mapPaymentMethodToMidtransKey(paymentMethod?.label || "");
      router.push(`/checkout/payment/${result.orderId}?method=${methodKey}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <div className="checkout-wrap">
          <section className="checkout-main">
            <header className="checkout-header">
              <p className="checkout-label">Checkout</p>
              <h1>Konfirmasi Pesanan</h1>
            </header>

            <article className="checkout-card address-card">
              <div className="checkout-card-header">
                <MapPin size={18} />
                <h2>Alamat Pengiriman</h2>
              </div>

              {addresses.length === 0 ? (
                <div className="checkout-address-content">
                  <div className="checkout-address-text">Belum ada alamat. Tambahkan alamat di halaman profil.</div>
                  <Link className="checkout-change-btn" href="/profile?tab=address">
                    Tambah Alamat
                  </Link>
                </div>
              ) : (
                <div className="checkout-address-list">
                  {addresses.map((address) => (
                    <label key={address.id} className="checkout-option">
                      <input
                        type="radio"
                        name="address"
                        checked={effectiveAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div>
                        <strong>
                          {address.label} - {address.recipient}
                          {address.isPrimary ? <span className="checkout-address-badge">Primary</span> : null}
                        </strong>
                        <p>
                          {address.line1}, {address.district}, {address.city}, {address.province}, {address.postalCode}
                        </p>
                        <p>{address.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </article>

            <article className="checkout-card">
              <div className="checkout-card-header">
                <Truck size={18} />
                <h2>Kurir Pengiriman</h2>
              </div>

              <div className="checkout-options">
                {couriers.map((courier) => (
                  <label key={courier.id} className="checkout-option">
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourierId === courier.id}
                      onChange={() => setSelectedCourierId(courier.id)}
                    />
                    <div>
                      <strong>{courier.label}</strong>
                      <p>{formatPrice(courier.fee)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </article>

            <article className="checkout-card">
              <div className="checkout-card-header">
                <CreditCard size={18} />
                <h2>Metode Pembayaran</h2>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="checkout-address-content">
                  <div className="checkout-address-text">Belum ada metode pembayaran. Tambahkan di halaman profil.</div>
                  <Link className="checkout-change-btn" href="/profile?tab=payment">
                    Tambah Metode
                  </Link>
                </div>
              ) : (
                <div className="checkout-options">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="checkout-option">
                      <input
                        type="radio"
                        name="payment"
                        checked={effectivePaymentId === method.id}
                        onChange={() => setSelectedPaymentId(method.id)}
                      />
                      <div>
                        <strong>{method.label}</strong>
                        <p>{method.details || method.accountNumber || "Pembayaran"}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </article>

            <article className="checkout-card checkout-products">
              <div className="checkout-product-header">
                <span>Produk</span>
                <span className="checkout-col-center">Qty</span>
                <span className="checkout-col-center">Harga</span>
                <span className="checkout-col-right">Subtotal</span>
              </div>

              {items.length === 0 ? (
                <p className="checkout-address-text">Keranjang kosong.</p>
              ) : (
                items.map((item) => {
                  const unit = normalizePrice(item.product.price);
                  return (
                    <div key={item.id} className="checkout-product-row">
                      <div className="checkout-product-info">
                        <Image
                          src={item.product.imageUrl || "/images/about/about-hero.jpg"}
                          alt={item.product.name}
                          width={60}
                          height={75}
                          className="checkout-product-img"
                        />
                        <div className="checkout-product-meta">
                          <p>{item.product.name}</p>
                          <p className="variant">
                            {item.variant.size} · {item.variant.color || "Default"}
                          </p>
                        </div>
                      </div>
                      <div className="checkout-col-center">{item.quantity}</div>
                      <div className="checkout-col-center">{formatPrice(unit)}</div>
                      <div className="checkout-col-right">{formatPrice(unit * item.quantity)}</div>
                    </div>
                  );
                })
              )}
            </article>

            <article className="checkout-card">
              <div className="checkout-input-group">
                <label htmlFor="promoCode">Kode Promo</label>
                <input
                  id="promoCode"
                  className="checkout-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Masukkan kode voucher (opsional)"
                />
              </div>

              <div className="checkout-input-group checkout-input-group-spaced">
                <label htmlFor="notes">Catatan Pesanan</label>
                <textarea
                  id="notes"
                  className="checkout-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"
                />
              </div>
            </article>
          </section>

          <aside className="checkout-summary">
            <h2>Ringkasan</h2>
            <div className="checkout-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-row">
              <span>Pengiriman</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {error ? (
              <p className="checkout-error-text">{error}</p>
            ) : null}

            <button
              className="checkout-submit"
              type="button"
              onClick={handleSubmit}
              disabled={
                cartLoading ||
                isSubmitting ||
                items.length === 0 ||
                !effectiveAddressId ||
                !effectivePaymentId ||
                !selectedCourier
              }
            >
              {isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </button>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
