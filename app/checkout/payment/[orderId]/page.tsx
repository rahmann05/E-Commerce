"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, CheckCircle2, Clock, ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProfileData } from "@/components/providers/ProfileDataContext";
import { useAuth } from "@/components/providers/AuthContext";
import "./style.css";

// Payment method mapping
const PAYMENT_METHODS: Record<string, { midtransId: string; bank?: string }> = {
  bca_va: { midtransId: "bank_transfer", bank: "bca" },
  bni_va: { midtransId: "bank_transfer", bank: "bni" },
  bri_va: { midtransId: "bank_transfer", bank: "bri" },
  qris: { midtransId: "qris" },
  gopay: { midtransId: "gopay" },
};

interface MidtransStatus {
  transaction_status: string;
  payment_type: string;
  gross_amount: string;
  order_id: string;
  transaction_time: string;
  expiry_time?: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  actions?: Array<{ name: string; url: string; method: string }>;
  qr_code_url?: string;
}

export default function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { orders } = useProfileData();
  const orderId = params.orderId as string;
  
  // Get method from query params
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const [status, setStatus] = useState<MidtransStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Find the order in local context
  const localOrder = useMemo(() => {
    const found = orders.find(o => String(o.id) === String(orderId));
    console.log("Searching for order:", orderId, "Found:", found ? "Yes" : "No");
    return found;
  }, [orders, orderId]);

  const fetchStatus = async (isRetry = false) => {
    // Only set loading on first attempt
    if (!isRetry) setLoading(true);
    
    try {
      const res = await fetch(`/api/checkout/midtrans/status?orderId=${orderId}`);
      const data = await res.json();
      
      if (data.success) {
        setStatus(data);
        setLoading(false);
      } else if (!isRetry) {
        // If not found in Midtrans, try to initiate the charge
        await initiateCharge();
      } else {
        setError(data.error || "Gagal mengambil data pembayaran.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Status fetch error:", err);
      if (!isRetry) await initiateCharge();
      else {
        setError("Terjadi kesalahan koneksi.");
        setLoading(false);
      }
    }
  };

  const initiateCharge = async () => {
    if (!localOrder) {
      // If we don't have the order yet, it might still be refreshing
      console.log("Local order not found, will retry in 1.5s...");
      setTimeout(() => {
        if (!status && !error) fetchStatus(true);
      }, 1500);
      
      // Also stop loading after a while if still not found
      setTimeout(() => {
        if (loading && !status && !error) {
          setError("Pesanan tidak ditemukan. Mohon cek daftar pesanan Anda.");
          setLoading(false);
        }
      }, 5000);
      return;
    }

    try {
      const methodKey = new URLSearchParams(window.location.search).get("method") || "bca_va";
      const methodObj = PAYMENT_METHODS[methodKey];

      console.log("Initiating charge for order:", orderId, "Method:", methodKey);

      const itemsSum = localOrder.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
      const diff = localOrder.total - (itemsSum + localOrder.shipping);

      const res = await fetch("/api/checkout/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          gross_amount: localOrder.total,
          payment_type: methodObj?.midtransId,
          bank: methodObj?.bank,
          items: [
            ...localOrder.items.map(item => ({
              id: item.productId,
              name: item.name,
              price: item.unitPrice,
              quantity: item.quantity
            })),
            ...(localOrder.shipping > 0 ? [{
              id: "shipping",
              name: "Ongkos Kirim",
              price: localOrder.shipping,
              quantity: 1
            }] : []),
            ...(diff !== 0 ? [{
              id: "adjustment",
              name: diff < 0 ? "Potongan Harga / Voucher" : "Biaya Tambahan",
              price: diff,
              quantity: 1
            }] : [])
          ],
          customer_details: {
            first_name: user?.name,
            email: user?.email,
          }
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(data);
      } else {
        // If Core API failed, it might have returned a Snap token as fallback
        if (data.method === "snap" && data.redirect_url) {
           // If we got a snap fallback, we might need to show it or redirect
           // But user wanted dedicated page, so let's try to show the status if available
           setError("Metode pembayaran ini memerlukan aktivasi tambahan di Midtrans. Mohon pilih metode lain atau hubungi admin.");
        } else {
          setError(data.error || "Gagal memulai pembayaran.");
        }
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
  }, [orderId, orders.length]); // Re-run if orders length changes

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentDetails = useMemo(() => {
    if (!status) return null;

    let methodLabel = (status.payment_type || "Pembayaran").replace(/_/g, " ").toUpperCase();
    let vaNumber = "";

    if (status.va_numbers && status.va_numbers.length > 0) {
      methodLabel = `${status.va_numbers[0].bank.toUpperCase()} VIRTUAL ACCOUNT`;
      vaNumber = status.va_numbers[0].va_number;
    } else if (status.permata_va_number) {
      methodLabel = "PERMATA VIRTUAL ACCOUNT";
      vaNumber = status.permata_va_number;
    } else if (status.payment_type === "qris") {
      methodLabel = "QRIS / E-WALLET";
    } else if (status.payment_type === "echannel") {
      methodLabel = "MANDIRI BILL PAYMENT";
      vaNumber = `${status.biller_code} / ${status.bill_key}`;
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

  if (loading || (!status && !error)) {
    return (
      <div className="payment-status-page">
        <div className="payment-container" style={{ textAlign: "center" }}>
          <RefreshCw className="animate-spin" size={48} style={{ margin: "0 auto 1.5rem", color: "#111", opacity: 0.2 }} />
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Menyiapkan instruksi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="payment-status-page">
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
            ) : (
              <Clock size={64} color="#f59e0b" style={{ margin: "0 auto 1.5rem" }} />
            )}
            <h1>{getStatusLabel()}</h1>
            <p>Order ID: {status.order_id || orderId}</p>
          </div>

          <div className="payment-amount-card">
            <div className="payment-amount-label">Total Pembayaran</div>
            <div className="payment-amount-value">{formatPrice(status.gross_amount)}</div>
          </div>

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

          {/* New Shipping Address Section */}
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
