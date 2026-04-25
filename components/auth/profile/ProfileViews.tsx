"use client";

import type { SessionUser } from "@/lib/mock-users";
import { useState } from "react";
import { useProfileData } from "@/components/providers/ProfileDataContext";

export function ProfileAddressView({ user }: { user: SessionUser }) {
  const { addresses, addAddress, updateAddress, removeAddress } = useProfileData();

  const handleAddAddress = () => {
    const label = window.prompt("Label alamat (contoh: Rumah, Kantor)", "Rumah");
    if (!label) return;

    const line1 = window.prompt("Alamat lengkap", user.address ?? "");
    if (!line1) return;

    const recipient = window.prompt("Nama penerima", user.name) ?? user.name;
    const phone = window.prompt("Nomor telepon", user.phone ?? "") ?? user.phone ?? "";

    addAddress({ label, line1, recipient, phone });
  };

  const handleEditAddress = (id: string, currentLine: string) => {
    const line1 = window.prompt("Perbarui alamat", currentLine);
    if (!line1) return;
    updateAddress(id, { line1 });
  };

  return (
    <section>
      <p className="profile-section-title">Alamat Pengiriman</p>
      <div style={{ maxWidth: "600px" }}>
        {addresses.length === 0 ? (
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.1)", fontSize: "0.88rem", color: "#777" }}>
            Belum ada alamat tersimpan.
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {address.label} {address.isPrimary ? "(Utama)" : ""}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.5 }}>
                  {address.recipient}
                  <br />
                  {address.line1}
                  <br />
                  {address.phone}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                {!address.isPrimary && (
                  <button
                    type="button"
                    onClick={() => updateAddress(address.id, { isPrimary: true })}
                    style={{ background: "none", border: "none", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Jadikan Utama
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleEditAddress(address.id, address.line1)}
                  style={{ background: "none", border: "none", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}
                >
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  style={{ background: "none", border: "none", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", color: "#8a2d2d" }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
        
        <button
          type="button"
          className="pill-btn"
          onClick={handleAddAddress}
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "#111", fontSize: "0.8rem", fontWeight: 600, marginTop: "2rem" }}
        >
          + Tambah Alamat Baru
        </button>
      </div>
    </section>
  );
}

export function ProfilePaymentView({ user }: { user: SessionUser }) {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useProfileData();

  const handleAddMethod = () => {
    const label = window.prompt(
      "Nama metode pembayaran",
      user.paymentPreference ?? "Virtual Account"
    );
    if (!label) return;

    const details = window.prompt(
      "Detail metode (contoh: **** 1234 / BCA VA)",
      "Metode utama"
    );
    if (!details) return;

    addPaymentMethod({ label, details });
  };

  return (
    <section>
      <p className="profile-section-title">Metode Pembayaran</p>
      <div style={{ maxWidth: "600px" }}>
        {paymentMethods.length === 0 ? (
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.1)", fontSize: "0.88rem", color: "#777" }}>
            Belum ada metode pembayaran.
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "24px", background: "#f0f0f0", borderRadius: "4px" }} />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{method.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    {method.isPrimary ? "Utama" : method.details}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePaymentMethod(method.id)}
                style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}
              >
                Hapus
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          className="pill-btn"
          onClick={handleAddMethod}
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "#111", fontSize: "0.8rem", fontWeight: 600, marginTop: "2rem" }}
        >
          + Tambah Metode Pembayaran
        </button>
      </div>
    </section>
  );
}

export function ProfileSecurityView() {
  const { updatePassword } = useProfileData();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const result = updatePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setStatus(result.message);

    if (result.success) {
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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Password Baru</label>
          <input
            type="password"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Konfirmasi Password Baru</label>
          <input
            type="password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit"
          className="pill-btn"
          style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none" }}
        >
          Perbarui Password
        </button>

        {status && (
          <p style={{ marginTop: "0.85rem", fontSize: "0.82rem", color: "#666" }}>
            {status}
          </p>
        )}
      </form>
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
