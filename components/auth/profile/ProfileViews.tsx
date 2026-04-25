"use client";

import { useState, type FormEvent } from "react";
import type {
  ProfileAddress,
  ProfileNotification,
  ProfilePaymentMethod,
  ProfileVoucher,
  WishlistItem,
} from "@/components/providers/ProfileDataContext";

export function ProfileAddressView({
  addresses,
  onSaveAddress,
  onRemoveAddress,
}: {
  addresses: ProfileAddress[];
  onSaveAddress: (payload: {
    label: string;
    recipient: string;
    phone: string;
    line1: string;
  }) => void;
  onRemoveAddress: (id: string) => void;
}) {
  const [address, setAddress] = useState("");

  return (
    <section>
      <p className="profile-section-title">Alamat Pengiriman</p>
      <div style={{ maxWidth: "600px" }}>
        {addresses.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "1rem 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: "#111" }}>
                {item.label} {item.isPrimary ? "(Utama)" : ""}
              </div>
              <div>{item.recipient}</div>
              <div>{item.line1}</div>
              <div>{item.phone}</div>
            </div>
            <button
              type="button"
              className="pill-btn"
              style={{ height: "fit-content", fontSize: "0.72rem" }}
              onClick={() => onRemoveAddress(item.id)}
            >
              Hapus
            </button>
          </div>
        ))}

        <div className="auth-input-wrapper" style={{ marginTop: "1.2rem" }}>
          <label className="auth-input-label">Tambah Alamat Baru</label>
          <textarea
            className="auth-input"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat lengkap..."
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
          <button
            type="button"
            className="pill-btn"
            style={{ background: "#111", color: "#fff", border: "none" }}
            onClick={() => {
              const line1 = address.trim();
              if (!line1) return;
              onSaveAddress({
                label: "Alamat Baru",
                recipient: "Penerima",
                phone: "-",
                line1,
              });
              setAddress("");
            }}
          >
            Simpan Alamat
          </button>
        </div>
      </div>
    </section>
  );
}

export function ProfilePaymentView({
  paymentMethods,
  onSavePayment,
  onRemovePayment,
}: {
  paymentMethods: ProfilePaymentMethod[];
  onSavePayment: (paymentPreference: string) => void;
  onRemovePayment: (id: string) => void;
}) {
  const [payment, setPayment] = useState("BCA Virtual Account");

  return (
    <section>
      <p className="profile-section-title">Metode Pembayaran</p>
      <div style={{ maxWidth: "600px" }}>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            style={{
              padding: "0.9rem 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#444" }}>
              <div style={{ fontWeight: 700, color: "#111" }}>
                {method.label} {method.isPrimary ? "(Utama)" : ""}
              </div>
              <div style={{ fontSize: "0.78rem" }}>{method.details}</div>
            </div>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: "0.72rem" }}
              onClick={() => onRemovePayment(method.id)}
            >
              Hapus
            </button>
          </div>
        ))}

        <div style={{ padding: "1.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          <div className="auth-input-wrapper">
            <label className="auth-input-label">Metode Utama</label>
            <select
              className="auth-input"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="BCA Virtual Account">BCA Virtual Account</option>
              <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
              <option value="BRI Virtual Account">BRI Virtual Account</option>
              <option value="Credit Card">Credit Card</option>
              <option value="COD">COD</option>
            </select>
          </div>

          <button
            type="button"
            className="pill-btn"
            style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none" }}
            onClick={() => onSavePayment(payment)}
          >
            Tambah Metode Pembayaran
          </button>
        </div>
      </div>
    </section>
  );
}

export function ProfileSecurityView({
  onSavePassword,
}: {
  onSavePassword: (payload: { currentPassword: string; newPassword: string }) => boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    const success = onSavePassword({ currentPassword, newPassword });
    setMessage(
      success
        ? "Password berhasil diperbarui (simulasi frontend)."
        : "Password saat ini tidak valid."
    );
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <section>
      <p className="profile-section-title">Ubah Password</p>
      <form onSubmit={handleSave} style={{ maxWidth: "400px" }}>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Password Saat Ini</label>
          <input
            type="password"
            className="auth-input"
            placeholder="••••••••"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Password Baru</label>
          <input
            type="password"
            className="auth-input"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Konfirmasi Password Baru</label>
          <input
            type="password"
            className="auth-input"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="pill-btn"
          style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none" }}
        >
          Perbarui Password
        </button>
        {message && (
          <p style={{ marginTop: "0.8rem", fontSize: "0.8rem", color: "#666" }}>
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export function ProfileWishlistView({
  items,
  onRemove,
}: {
  items: WishlistItem[];
  onRemove: (productId: number) => void;
}) {
  if (items.length === 0) {
    return (
      <ProfileEmptyView
        title="Daftar Keinginan"
        message="Belum ada produk di wishlist Anda."
      />
    );
  }

  return (
    <section>
      <p className="profile-section-title">Daftar Keinginan</p>
      <div style={{ maxWidth: "640px" }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: "0.78rem", color: "#777" }}>
                {item.category} · Rp{item.price}
              </div>
            </div>
            <button type="button" className="pill-btn" onClick={() => onRemove(item.productId)}>
              Hapus
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProfileVoucherView({ vouchers }: { vouchers: ProfileVoucher[] }) {
  if (vouchers.length === 0) {
    return (
      <ProfileEmptyView
        title="Voucher Saya"
        message="Tidak ada voucher yang tersedia saat ini."
      />
    );
  }
  return (
    <section>
      <p className="profile-section-title">Voucher Saya</p>
      {vouchers.map((voucher) => (
        <div
          key={voucher.id}
          style={{ maxWidth: "620px", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "1rem 0" }}
        >
          <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{voucher.title}</div>
          <div style={{ fontSize: "0.78rem", color: "#666" }}>
            {voucher.code} · Berlaku sampai {voucher.expiresAt}
          </div>
        </div>
      ))}
    </section>
  );
}

export function ProfileNotificationView({
  notifications,
  onMarkRead,
}: {
  notifications: ProfileNotification[];
  onMarkRead: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <ProfileEmptyView
        title="Notifikasi"
        message="Tidak ada notifikasi baru."
      />
    );
  }
  return (
    <section>
      <p className="profile-section-title">Notifikasi</p>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{ maxWidth: "620px", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "1rem 0" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{notification.title}</div>
              <div style={{ fontSize: "0.78rem", color: "#666" }}>{notification.message}</div>
            </div>
            {!notification.isRead && (
              <button type="button" className="pill-btn" onClick={() => onMarkRead(notification.id)}>
                Tandai Dibaca
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export function ProfileEmptyView({ title, message }: { title: string; message: string }) {
  return (
    <section>
      <p className="profile-section-title">{title}</p>
      <div 
        style={{ 
          padding: "4rem 2rem", 
          textAlign: "center", 
          background: "transparent", 
          borderBottom: "1px solid rgba(0,0,0,0.1)"
        }}
      >
        <p style={{ fontSize: "0.95rem", color: "#888", fontWeight: 500 }}>{message}</p>
      </div>
    </section>
  );
}
