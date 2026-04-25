"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { useProfileData } from "@/components/providers/ProfileDataContext";
import "./style.css";

// Load Map dynamically to prevent SSR errors with Leaflet
const LocationMap = dynamic(() => import("@/components/checkout/LocationMap"), { ssr: false });

function formatPrice(price: number): string {
  return `Rp${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function getActualPrice(price: number): number {
  return price < 10000 ? price * 1000 : price;
}

const COMMON_PAYMENTS = [
  { id: "gopay", label: "GoPay / E-Wallet", midtransId: "gopay" },
  { id: "bca_va", label: "BCA Virtual Account", midtransId: "bca_va" },
  { id: "credit_card", label: "Kartu Kredit", midtransId: "credit_card" },
  { id: "other", label: "Lainnya (Pilih di Midtrans)", midtransId: "" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { addresses, addAddress, submitCheckout, refreshAccountData } = useProfileData();

  // Try to find the default address, otherwise the first one
  const defaultAddressId = useMemo(() => {
    if (addresses.length === 0) return "";
    const primary = addresses.find(a => a.isPrimary);
    return primary ? primary.id : addresses[0].id;
  }, [addresses]);

  const [selectedAddress, setSelectedAddress] = useState(defaultAddressId);
  const [isChangingAddress, setIsChangingAddress] = useState(addresses.length === 0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(addresses.length === 0);
  
  // Default payment based on profile
  const defaultPaymentId = useMemo(() => {
    if (!user || !user.paymentPreference) return "other";
    const pref = user.paymentPreference.toLowerCase();
    if (pref.includes("gopay") || pref.includes("ovo") || pref.includes("wallet")) return "gopay";
    if (pref.includes("bca") || pref.includes("virtual")) return "bca_va";
    if (pref.includes("kredit") || pref.includes("credit")) return "credit_card";
    return "other";
  }, [user]);

  const [selectedPayment, setSelectedPayment] = useState(defaultPaymentId);

  // New Address State
  const [newLabel, setNewLabel] = useState("");
  const [newRecipient, setNewRecipient] = useState(user?.name || "");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newLine1, setNewLine1] = useState("");
  const [newLat, setNewLat] = useState<number | null>(null);
  const [newLng, setNewLng] = useState<number | null>(null);
  const [isTypingAddress, setIsTypingAddress] = useState(false);

  // Dynamic Shipping Data
  const [couriers, setCouriers] = useState<{id:string, label:string, fee:number}[]>([]);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [loadingCouriers, setLoadingCouriers] = useState(false);

  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + getActualPrice(item.price) * item.quantity, 0),
    [items]
  );
  
  const shippingFee = useMemo(() => {
    return couriers.find((item) => item.id === selectedCourier)?.fee ?? 0;
  }, [couriers, selectedCourier]);

  const discount = promoCode.trim().toUpperCase() === "WELCOME10" ? Math.floor(subtotal * 0.1) : 0;
  const total = Math.max(subtotal + shippingFee - discount, 0);

  // Set default address when loaded
  useEffect(() => {
    if (defaultAddressId && !selectedAddress) {
      setSelectedAddress(defaultAddressId);
    }
  }, [defaultAddressId, selectedAddress]);

  // Fetch Couriers whenever an address is selected or completely filled
  const fetchCouriers = useCallback(async (lat: number, lng: number, city: string) => {
    setLoadingCouriers(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, city }),
      });
      const data = await res.json();
      if (data.success && data.couriers && data.couriers.length > 0) {
        setCouriers(data.couriers);
        setSelectedCourier(data.couriers[0].id);
      } else {
        setError(data.error || "Gagal mendapatkan layanan pengiriman");
        setCouriers([]);
        setSelectedCourier("");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke API Pengiriman.");
      setCouriers([]);
      setSelectedCourier("");
    } finally {
      setLoadingCouriers(false);
    }
  }, []);

  useEffect(() => {
    if (!isAddingNewAddress && selectedAddress) {
      const addr = addresses.find(a => a.id === selectedAddress);
      if (addr) {
        // Using real shipping, ideally we geocode the address first if we don't have coords.
        // But for now, since it requires lat/lng, we pass dummy or if you have real city, it depends.
        // Let's pass the real city so RajaOngkir API can use it.
        fetchCouriers(-6.2, 106.8, addr.city || "Jakarta Pusat");
      }
    }
  }, [selectedAddress, isAddingNewAddress, addresses, fetchCouriers]);

  // Debounced Map geocoding when typing address
  useEffect(() => {
    if (!isAddingNewAddress || !newLine1 || !isTypingAddress) return;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newLine1)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setNewLat(parseFloat(data[0].lat));
          setNewLng(parseFloat(data[0].lon));
          if (!newCity && data[0].display_name) {
            // Very naive city extraction from display_name
            const parts = data[0].display_name.split(",");
            if (parts.length > 1) {
               // We just guess the city is one of the parts
            }
          }
        }
      } catch (error) {
        console.error("Geocoding error", error);
      }
      setIsTypingAddress(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [newLine1, isAddingNewAddress, isTypingAddress, newCity]);

  const handleLocationSelect = (address: string, lat: number, lng: number, city: string) => {
    setIsTypingAddress(false);
    setNewLine1(address);
    setNewLat(lat);
    setNewLng(lng);
    setNewCity(city);
    fetchCouriers(lat, lng, city);
  };

  const handleSaveAddress = async () => {
    if (!newLabel || !newRecipient || !newPhone || !newLine1) {
      setError("Mohon lengkapi semua field alamat.");
      return null;
    }
    const result = await addAddress({
      label: newLabel,
      recipient: newRecipient,
      phone: newPhone,
      line1: newLine1,
      city: newCity || "Unknown",
      postalCode: "00000",
      country: "Indonesia",
    });
    if (result.success && result.address) {
      setIsAddingNewAddress(false);
      setIsChangingAddress(false);
      setSelectedAddress(result.address.id);
      return result.address.id;
    } else {
      setError("Gagal menyimpan alamat.");
      return null;
    }
  };

  const processPayment = async (orderId: string, finalAddressId: string) => {
    try {
      const selectedMidtransMethod = COMMON_PAYMENTS.find(p => p.id === selectedPayment)?.midtransId;
      const res = await fetch("/api/checkout/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          gross_amount: total,
          items: items.map((item) => ({
            id: item.id,
            price: getActualPrice(item.price),
            quantity: item.quantity,
            name: item.name,
          })),
          customer_details: {
            first_name: user?.name,
            email: user?.email,
          }
        }),
      });
      const data = await res.json();

      if (data.is_mock) {
        alert("Simulasi Pembayaran Midtrans Berhasil!");
        finishCheckout(orderId, finalAddressId);
      } else if (data.token) {
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("payment success", result);
            finishCheckout(orderId, finalAddressId);
          },
          onPending: function (result: any) {
            console.log("payment pending", result);
            finishCheckout(orderId, finalAddressId);
          },
          onError: function (result: any) {
            console.error("payment error", result);
            setError("Pembayaran gagal. Silakan coba lagi.");
            setLoading(false);
          },
          onClose: function () {
            setLoading(false);
          }
        });
      } else {
        setError(data.error || "Gagal menghubungi gateway pembayaran.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem pembayaran.");
      setLoading(false);
    }
  };

  const finishCheckout = async (orderId: string, addressId: string) => {
    const paymentLabel = COMMON_PAYMENTS.find(p => p.id === selectedPayment)?.label || "Midtrans";
    const result = await submitCheckout({
      items,
      shipping: shippingFee,
      total,
      addressId: addressId,
      paymentMethodId: paymentLabel,
      courier: couriers.find((item) => item.id === selectedCourier)?.label ?? "Pengiriman Standar",
      notes,
      promoCode: promoCode.trim() || undefined,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.message ?? "Checkout gagal tersimpan ke database.");
      return;
    }
    clearCart();
    await refreshAccountData();
    router.push("/profile?tab=orders");
  };

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    let finalAddressId = selectedAddress;

    if (isAddingNewAddress) {
      const newId = await handleSaveAddress();
      if (!newId) {
        setLoading(false);
        return;
      }
      finalAddressId = newId;
    }

    if (!finalAddressId) {
      setError("Pilih atau isi alamat pengiriman.");
      setLoading(false);
      return;
    }

    if (!selectedCourier) {
      setError("Pilih metode pengiriman.");
      setLoading(false);
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    await processPayment(orderId, finalAddressId);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="checkout-empty">
            <h1>Anda harus login untuk checkout</h1>
            <Link href="/login?redirect=/checkout" className="pill-btn" style={{marginTop: "1rem", display: "inline-block"}}>Masuk</Link>
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
            <Link href="/catalogue" className="pill-btn" style={{marginTop: "1rem", display: "inline-block"}}>Belanja Sekarang</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const selectedAddrObj = addresses.find(a => a.id === selectedAddress);

  return (
    <>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-DUMMY"} />
      <Navbar />
      <main className="checkout-page">
        <section className="checkout-wrap">
          <div className="checkout-main">

            {/* Address Section */}
            <section className="checkout-card address-card">
              <div className="checkout-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <h2>Alamat Pengiriman</h2>
              </div>
              
              {!isChangingAddress && selectedAddrObj ? (
                <div className="checkout-address-content">
                  <div className="checkout-address-details">
                    <div className="checkout-address-name">
                      {selectedAddrObj.recipient} <br/>
                      <span style={{fontWeight: 400, color: "#555"}}>{selectedAddrObj.phone}</span>
                    </div>
                    <div className="checkout-address-text">
                      {selectedAddrObj.line1}, {selectedAddrObj.city}, {selectedAddrObj.postalCode}, {selectedAddrObj.country}
                      {selectedAddrObj.isPrimary && <span className="checkout-address-badge">Utama</span>}
                    </div>
                  </div>
                  <button onClick={() => setIsChangingAddress(true)} className="checkout-change-btn">Ubah Alamat</button>
                </div>
              ) : (
                <div className="checkout-address-list">
                  {!isAddingNewAddress && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={() => setIsAddingNewAddress(true)} className="checkout-change-btn">+ Tambah Alamat Baru</button>
                    </div>
                  )}

                  {isAddingNewAddress ? (
                    <div className="checkout-new-address" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <LocationMap onLocationSelect={handleLocationSelect} centerLat={newLat} centerLng={newLng} />
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <input
                          className="checkout-input"
                          placeholder="Label (Rumah, Kantor...)"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                        />
                        <input
                          className="checkout-input"
                          placeholder="Nama Penerima"
                          value={newRecipient}
                          onChange={(e) => setNewRecipient(e.target.value)}
                        />
                        <input
                          className="checkout-input"
                          placeholder="Nomor HP"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                        />
                        <input
                          className="checkout-input"
                          placeholder="Kota"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                        />
                      </div>
                      <textarea
                        className="checkout-textarea"
                        placeholder="Alamat Lengkap (Ketik untuk pindah map)"
                        value={newLine1}
                        onChange={(e) => {
                          setNewLine1(e.target.value);
                          setIsTypingAddress(true);
                        }}
                      />
                      {addresses.length > 0 && (
                        <button type="button" onClick={() => setIsAddingNewAddress(false)} style={{ color: "#555", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start", padding: "0.5rem" }}>
                          Batal, gunakan alamat tersimpan
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="checkout-options">
                      {addresses.map((address) => (
                        <label key={address.id} className="checkout-option">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address.id}
                            onChange={() => {
                              setSelectedAddress(address.id);
                              setIsChangingAddress(false);
                            }}
                          />
                          <div>
                            <strong>{address.recipient} | {address.phone} {address.isPrimary && <span className="checkout-address-badge">Utama</span>}</strong>
                            <p>{address.line1}, {address.city}, {address.country}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Products Section */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <h2>Produk Dipesan</h2>
              </div>
              <div className="checkout-products">
                <div className="checkout-product-header">
                  <div>Produk</div>
                  <div className="checkout-col-center">Harga Satuan</div>
                  <div className="checkout-col-center">Kuantitas</div>
                  <div className="checkout-col-right">Total Harga</div>
                </div>
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="checkout-product-row">
                    <div className="checkout-product-info">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="checkout-product-img" />}
                      <div className="checkout-product-meta">
                        <p>{item.name}</p>
                        <p className="variant">Variasi: {item.size} {item.color ? `- ${item.color}` : ""}</p>
                      </div>
                    </div>
                    <div className="checkout-col-center">{formatPrice(getActualPrice(item.price))}</div>
                    <div className="checkout-col-center">{item.quantity}</div>
                    <div className="checkout-col-right">{formatPrice(getActualPrice(item.price) * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Section */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                <h2>Opsi Pengiriman</h2>
              </div>
              {loadingCouriers ? (
                <p style={{color: "#555", fontSize: "0.9rem"}}>Menghitung ongkos kirim ke tujuan Anda...</p>
              ) : couriers.length === 0 ? (
                <p style={{color: "#111", fontSize: "0.9rem", fontWeight: 500}}>Pastikan alamat Anda dipilih atau valid untuk melihat opsi pengiriman.</p>
              ) : (
                <div className="checkout-options">
                  {couriers.map((courier) => (
                    <label key={courier.id} className="checkout-option">
                      <input
                        type="radio"
                        name="courier"
                        checked={selectedCourier === courier.id}
                        onChange={() => setSelectedCourier(courier.id)}
                      />
                      <div>
                        <strong>{courier.label}</strong>
                        <strong style={{color: "#111"}}>{formatPrice(courier.fee)}</strong>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Info Section */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                <h2>Metode Pembayaran</h2>
              </div>
              <div className="checkout-options" style={{marginTop: "0.5rem"}}>
                {COMMON_PAYMENTS.map((payment) => (
                  <label key={payment.id} className="checkout-option">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === payment.id}
                      onChange={() => setSelectedPayment(payment.id)}
                    />
                    <div>
                      <strong>{payment.label}</strong>
                      {payment.id === defaultPaymentId && <span className="checkout-address-badge" style={{marginLeft: "auto"}}>Pilihan Profil</span>}
                    </div>
                  </label>
                ))}
              </div>
              <p style={{ color: "#777", fontSize: "0.8rem", lineHeight: 1.5, marginTop: "1.2rem" }}>
                Semua transaksi di atas didukung dengan aman melalui gateway Midtrans.
              </p>
            </section>

            {/* Notes & Promo Section */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <h2>Catatan & Voucher</h2>
              </div>
              <textarea
                className="checkout-textarea"
                placeholder="Tinggalkan pesan untuk penjual (opsional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <input
                className="checkout-input"
                placeholder="Kode Voucher Promo (Coba: WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="checkout-row"><span>Total Harga Produk</span><span>{formatPrice(subtotal)}</span></div>
            <div className="checkout-row"><span>Total Ongkos Kirim</span><span>{formatPrice(shippingFee)}</span></div>
            {discount > 0 && (
              <div className="checkout-row" style={{color: "#111", fontWeight: 500}}><span>Diskon</span><span>-{formatPrice(discount)}</span></div>
            )}
            <div className="checkout-total"><span>Total Pembayaran</span><span>{formatPrice(total)}</span></div>
            {error && <p style={{color: "#d00000", marginTop: "1rem", fontSize: "0.85rem"}}>{error}</p>}
            <button
              type="button"
              className="checkout-submit"
              disabled={loading || !selectedCourier || (isAddingNewAddress ? !newLine1 : !selectedAddress)}
              onClick={handleCheckout}
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
