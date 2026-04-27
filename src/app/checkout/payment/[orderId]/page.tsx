"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, ArrowLeft, RefreshCw, CreditCard } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProfileData } from "@/context/ProfileDataContext";
import { useAuth } from "@/context/AuthContext";
import "./style.css";

// Payment method mapping
const PAYMENT_METHODS: Record<string, { midtransId: string; bank?: string }> = {
  bca_va: { midtransId: "bank_transfer", bank: "bca" },
  bni_va: { midtransId: "bank_transfer", bank: "bni" },
  bri_va: { midtransId: "bank_transfer", bank: "bri" },
  mandiri_va: { midtransId: "echannel" },
  qris: { midtransId: "qris" },
  gopay: { midtransId: "gopay" },
  alfamart: { midtransId: "cstore" },
};

interface MidtransStatus {
  transaction_status?: string;
  payment_type?: string;
  gross_amount?: string | number;
  order_id: string;
  transaction_time?: string;
  expiry_time?: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  actions?: Array<{ name: string; url: string; method: string }>;
  qr_code_url?: string;
  // Snap specific
  token?: string;
  redirect_url?: string;
  method?: string;
}

export default function PaymentStatusPage() {
  const params = useParams();
  const { user } = useAuth();
  const { orders } = useProfileData();
  const orderId = params.orderId as string;
  
  const [status, setStatus] = useState<MidtransStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Find the order in local context
  const localOrder = useMemo(() => {
    return orders.find(o => String(o.id) === String(orderId));
  }, [orders, orderId]);

  const fetchStatus = async (isRetry = false) => {
    if (!isRetry) setLoading(true);
    
    try {
      const res = await fetch(`/api/checkout/midtrans/status?orderId=${orderId}`);
      const data = await res.json();
      
      if (data.success) {
        setStatus(data);
        setLoading(false);
      } else if (!isRetry) {
        const methodKey = new URLSearchParams(window.location.search).get("method");
        if (methodKey) {
          await initiateCharge(methodKey);
        } else {
          // No method in URL, and no status in Midtrans yet. 
          // Let the user choose a method.
          setLoading(false);
        }
      } else {
        setError(data.error || "Gagal mengambil data pembayaran.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Status fetch error:", err);
      const methodKey = new URLSearchParams(window.location.search).get("method");
      if (!isRetry && methodKey) await initiateCharge(methodKey);
      else {
        setError("Terjadi kesalahan koneksi.");
        setLoading(false);
      }
    }
  };

  const initiateCharge = async (forcedMethod?: string) => {
    setLoading(true); // Ensure loading state when starting charge
    if (!localOrder) {
      setTimeout(() => {
        if (!status && !error) fetchStatus(true);
      }, 1500);
      
      setTimeout(() => {
        if (loading && !status && !error) {
          setError("Pesanan tidak ditemukan. Mohon cek daftar pesanan Anda.");
          setLoading(false);
        }
      }, 5000);
      return;
    }

    try {
      const methodKey = forcedMethod || new URLSearchParams(window.location.search).get("method") || "bca_va";
      const methodObj = PAYMENT_METHODS[methodKey];

      const res = await fetch("/api/checkout/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          payment_type: methodObj?.midtransId,
          bank: methodObj?.bank,
          customer_details: {
            first_name: user?.name,
            email: user?.email,
          }
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(data);
        setError(null);
      } else {
        setError(data.error || "Gagal memulai pembayaran.");
      }
    } catch (err) {
      console.error("Charge initiation error:", err);
      setError("Gagal menghubungi server pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchStatus();
    }
  }, [orderId, orders.length]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentDetails = useMemo(() => {
    if (!status) return null;

    let methodLabel = (status.payment_type || status.method || "Pembayaran").replace(/_/g, " ").toUpperCase();
    let vaNumber = "";

    if (status.va_numbers && status.va_numbers.length > 0) {
      methodLabel = `${status.va_numbers[0].bank.toUpperCase()} VIRTUAL ACCOUNT`;
      vaNumber = status.va_numbers[0].va_number;
    } else if (status.permata_va_number) {
      methodLabel = "PERMATA VIRTUAL ACCOUNT";
      vaNumber = status.permata_va_number;
    } else if (status.payment_type === "qris") {
      methodLabel = "QRIS / E-WALLET";
    } else if (status.payment_type === "gopay") {
      methodLabel = "GOPAY";
    } else if (status.payment_type === "cstore") {
      methodLabel = "ALFAMART / INDOMARET";
    } else if (status.payment_type === "echannel") {
      methodLabel = "MANDIRI BILL PAYMENT";
      vaNumber = `${status.biller_code} / ${status.bill_key}`;
    } else if (status.method === "snap") {
      methodLabel = "SNAP GATEWAY";
    }

    return { methodLabel, vaNumber };
  }, [status]);

  const qrAction = useMemo(() => {
    if (!status || !status.actions) return null;
    return status.actions.find(a => a.name === "generate-qr-code");
  }, [status]);

  const formatPrice = (price: string | number | undefined) => {
    if (price === undefined || price === null) return "Rp0";
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return "Rp0";
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  if (loading) {
    return (
      <div className="payment-status-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <RefreshCw className="animate-spin" size={48} color="#111" style={{ margin: "0 auto 1.5rem", opacity: 0.2 }} />
          <p>Memuat status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="payment-status-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="payment-container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ef4444", fontSize: "1.5rem", marginBottom: "1rem" }}>Oops!</h1>
          <p style={{ color: "#666", marginBottom: "2rem" }}>{error}</p>
          <div className="payment-actions">
            <Link href="/profile?tab=orders" className="btn-primary">Kembali ke Pesanan</Link>
          </div>
        </div>
      </div>
    );
  }

  const isSettled = status?.transaction_status === "settlement" || status?.transaction_status === "capture";
  const isPending = status?.transaction_status === "pending";
  const isFailed = ["deny", "cancel", "expire"].includes(status?.transaction_status || "");

  const getStatusLabel = () => {
    if (isSettled) return "Pembayaran Berhasil";
    if (isPending) return "Selesaikan Pembayaran";
    if (isFailed) return "Pembayaran Gagal";
    return "Status Pembayaran";
  };

  return (
    <>
      <Navbar />
      <main className="payment-status-page">
        <div className="payment-container">
          <div className="payment-header">
            {isSettled ? (
              <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 1.5rem" }} />
            ) : isFailed ? (
              <ArrowLeft size={64} color="#ef4444" style={{ margin: "0 auto 1.5rem" }} />
            ) : isPending ? (
              <Clock size={64} color="#f59e0b" style={{ margin: "0 auto 1.5rem" }} />
            ) : (
              <CreditCard size={64} color="#111" style={{ margin: "0 auto 1.5rem", opacity: 0.1 }} />
            )}
            <h1>{getStatusLabel()}</h1>
            <p>Order ID: {status?.order_id || orderId}</p>
          </div>

          <div className="payment-amount-card">
            <div className="payment-amount-label">Total Pembayaran</div>
            <div className="payment-amount-value">
              {formatPrice(status?.gross_amount || localOrder?.total)}
            </div>
          </div>

          {status && (
            <div className="payment-details">
              <div className="detail-row">
                <span className="detail-label">Metode Pembayaran</span>
                <span className="detail-value">{paymentDetails?.methodLabel}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge status-${status.transaction_status}`}>
                  {isPending ? "MENUNGGU" : status.transaction_status?.toUpperCase() || "MEMPROSES"}
                </span>
              </div>
              {status.expiry_time && isPending && (
                <div className="detail-row">
                  <span className="detail-label">Batas Waktu</span>
                  <span className="detail-value" style={{ color: "#ef4444", fontWeight: "600" }}>{status.expiry_time}</span>
                </div>
              )}
            </div>
          )}

          {localOrder && (
            <div className="payment-address-section">
              <h3>Alamat Pengiriman</h3>
              <div className="payment-address-card">
                <div style={{ fontWeight: "700", marginBottom: "0.4rem" }}>
                  {localOrder.address?.recipient || user?.name} | {localOrder.address?.phone || "-"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.5 }}>
                  {localOrder.address?.line1} <br/>
                  {localOrder.address?.district}, {localOrder.address?.city} <br/>
                  {localOrder.address?.province}, {localOrder.address?.postalCode}
                </div>
              </div>
            </div>
          )}

          {isPending && (
            <div style={{ marginTop: "1rem" }}>
              {status.method === "snap" && status.redirect_url && (
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.85rem", marginBottom: "1rem", color: "#666" }}>
                    Pembayaran diproses melalui Snap. Klik tombol di bawah jika jendela tidak terbuka.
                  </p>
                  <a href={status.redirect_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block' }}>
                    Bayar Sekarang (Snap)
                  </a>
                </div>
              )}

              {paymentDetails?.vaNumber && (
                <div className="va-container">
                  <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Nomor Virtual Account</span>
                  <span className="va-number">{paymentDetails.vaNumber}</span>
                  <button className="copy-btn" onClick={() => handleCopy(paymentDetails.vaNumber)}>
                    {copied ? "Berhasil Disalin" : "Salin Nomor"}
                  </button>
                </div>
              )}

              {qrAction && (
                <div className="qris-container">
                   <div style={{ textAlign: "center" }}>
                     <p style={{ fontSize: "0.85rem", marginBottom: "1rem", color: "#666" }}>Scan kode QR di bawah ini</p>
                     <img src={qrAction.url} alt="QRIS Code" className="qris-img" />
                   </div>
                </div>
              )}

              <div className="instructions-card">
                <h3>Cara Pembayaran</h3>
                <ul className="instructions-list">
                  <li>1. Buka aplikasi Mobile Banking atau ATM anda.</li>
                  <li>2. Pilih menu <span>Transfer / Pembayaran</span>.</li>
                  <li>3. Masukkan nomor Virtual Account / Scan QRIS di atas.</li>
                  <li>4. Pastikan jumlah nominal sudah sesuai.</li>
                  <li>5. Simpan bukti transaksi anda.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="payment-actions">
            {isPending ? (
              <>
                <button onClick={() => fetchStatus(true)} className="btn-primary" disabled={loading}>
                   {loading ? "Mengecek..." : "Saya Sudah Bayar"}
                </button>
                <Link href="/profile?tab=orders" className="btn-secondary">
                  Lihat Daftar Pesanan
                </Link>
              </>
            ) : (!status || (!status.transaction_status && status.method !== "snap")) ? (
              <div style={{ width: "100%", marginTop: "1rem" }}>
                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>
                  Pilih metode pembayaran untuk melanjutkan
                </p>
                <div className="payment-options-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <button onClick={() => initiateCharge("qris")} className="btn-method">QRIS / E-Wallet</button>
                  <button onClick={() => initiateCharge("gopay")} className="btn-method">GoPay</button>
                  <button onClick={() => initiateCharge("bca_va")} className="btn-method">BCA Virtual Account</button>
                  <button onClick={() => initiateCharge("mandiri_va")} className="btn-method">Mandiri Bill</button>
                  <button onClick={() => initiateCharge("bni_va")} className="btn-method">BNI Virtual Account</button>
                  <button onClick={() => initiateCharge("alfamart")} className="btn-method">Alfamart</button>
                </div>
              </div>
            ) : (
              <Link href="/profile?tab=orders" className="btn-primary">
                Kembali ke Profil
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
