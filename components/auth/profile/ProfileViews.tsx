"use client";

import type { SessionUser } from "@/lib/mock-users";
import { motion } from "framer-motion";

export function ProfileAddressView({ user }: { user: SessionUser }) {
  return (
    <section>
      <p className="profile-section-title">Alamat Pengiriman</p>
      <div style={{ maxWidth: "600px" }}>
        <div style={{ 
          padding: "1.5rem", 
          borderBottom: "1px solid rgba(0,0,0,0.1)", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>Rumah (Utama)</div>
            <div style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.5 }}>
              {user.name}<br/>
              {user.address || "Belum diatur"}<br/>
              {user.phone}
            </div>
          </div>
          <button style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}>Ubah</button>
        </div>
        
        <button className="pill-btn" style={{ borderColor: "rgba(0,0,0,0.1)", color: "#111", fontSize: "0.8rem", fontWeight: 600, marginTop: "2rem" }}>
          + Tambah Alamat Baru
        </button>
      </div>
    </section>
  );
}

export function ProfilePaymentView({ user }: { user: SessionUser }) {
  return (
    <section>
      <p className="profile-section-title">Metode Pembayaran</p>
      <div style={{ maxWidth: "600px" }}>
        <div style={{ 
          padding: "1.5rem", 
          borderBottom: "1px solid rgba(0,0,0,0.1)", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "24px", background: "#f0f0f0", borderRadius: "4px" }}></div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{user.paymentPreference || "Virtual Account"}</div>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>Utama</div>
            </div>
          </div>
          <button style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}>Hapus</button>
        </div>

        <button className="pill-btn" style={{ borderColor: "rgba(0,0,0,0.1)", color: "#111", fontSize: "0.8rem", fontWeight: 600, marginTop: "2rem" }}>
          + Tambah Metode Pembayaran
        </button>
      </div>
    </section>
  );
}

export function ProfileSecurityView() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password berhasil diubah! (Demo)");
  };

  return (
    <section>
      <p className="profile-section-title">Ubah Password</p>
      <form onSubmit={handleSave} style={{ maxWidth: "400px" }}>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Password Saat Ini</label>
          <input type="password" className="auth-input" placeholder="••••••••" required />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Password Baru</label>
          <input type="password" className="auth-input" required />
        </div>
        <div className="auth-input-wrapper">
          <label className="auth-input-label">Konfirmasi Password Baru</label>
          <input type="password" className="auth-input" required />
        </div>
        <button 
          type="submit"
          className="pill-btn"
          style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none" }}
        >
          Perbarui Password
        </button>
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
