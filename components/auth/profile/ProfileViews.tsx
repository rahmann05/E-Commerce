"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import type {
  ProfileAddress,
  ProfileNotification,
  ProfilePaymentMethod,
  ProfileVoucher,
  WishlistItem,
} from "@/components/providers/ProfileDataContext";

import { fetchProvinces, fetchRegencies, fetchDistricts } from "@/lib/api/geography";

import dynamic from "next/dynamic";
const LocationMap = dynamic(() => import("@/components/checkout/LocationMap"), { ssr: false });

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
    district: string;
    city: string;
    province: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  onRemoveAddress: (id: string) => void;
}) {
  const [formData, setFormData] = useState({
    label: "Rumah",
    recipient: "",
    phone: "",
    line1: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const [showForm, setShowForm] = useState(false);

  // Geo Data State
  const [provinces, setProvinces] = useState<{id: string, name: string}[]>([]);
  const [regencies, setRegencies] = useState<{id: string, name: string}[]>([]);
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const changeSourceRef = useRef<'map' | 'dropdown' | null>(null);

  // Load Provinces
  useEffect(() => {
    if (showForm) {
      fetchProvinces().then(setProvinces);
    }
  }, [showForm]);

  // Fetch Regencies when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      fetchRegencies(selectedProvinceId).then(setRegencies);
      if (changeSourceRef.current !== 'map') {
        setSelectedRegencyId("");
        setFormData(prev => ({ ...prev, city: "", district: "" }));
        setDistricts([]);
      }
    } else {
      setRegencies([]);
      setSelectedRegencyId("");
      setDistricts([]);
    }
  }, [selectedProvinceId]);

  // Fetch Districts when regency changes
  useEffect(() => {
    if (selectedRegencyId) {
      fetchDistricts(selectedRegencyId).then(setDistricts);
      if (changeSourceRef.current !== 'map') {
        setFormData(prev => ({ ...prev, district: "" }));
      }
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [selectedRegencyId]);


  // Auto-search coordinates ONLY when changed via DROPDOWN
  useEffect(() => {
    if (changeSourceRef.current !== 'dropdown' || !showForm) return;
    const query = [formData.district, formData.city, formData.province].filter(Boolean).join(", ");
    if (!query) return;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=id`);
        const data = await response.json();
        if (data && data.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            latitude: parseFloat(data[0].lat), 
            longitude: parseFloat(data[0].lon) 
          }));
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.district, formData.city, formData.province, showForm]);

  const handleLocationSelect = async (address: string, lat: number, lng: number, rawAddr: any, postalCode: string) => {
    changeSourceRef.current = 'map';
    
    // 1. Update basic fields
    setFormData(prev => ({ 
      ...prev, 
      latitude: lat, 
      longitude: lng,
      line1: address,
      postalCode: postalCode || prev.postalCode
    }));

    // Sync Dropdowns using our Field-Agnostic engine
    let currentProvinces = provinces;
    if (currentProvinces.length === 0) {
      currentProvinces = await fetchProvinces();
      setProvinces(currentProvinces);
    }

    // Direct population from map data (Simple and stable!)
    const prov = rawAddr.state || rawAddr.region || "";
    const city = rawAddr.city || rawAddr.county || rawAddr.municipality || "";
    const dist = rawAddr.suburb || rawAddr.district || rawAddr.village || rawAddr.town || "";

    setFormData(prev => ({ 
      ...prev, 
      province: prov,
      city: city,
      district: dist
    }));
  };

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p className="profile-section-title" style={{ margin: 0 }}>Alamat Pengiriman</p>
        <button 
          className="pill-btn" 
          style={{ background: "#111", color: "#fff", border: "none" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Batal" : "Tambah Alamat Baru"}
        </button>
      </div>

      <div style={{ maxWidth: "800px" }}>
        {showForm && (
          <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", border: "1px solid #eee" }}>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <LocationMap 
                onLocationSelect={handleLocationSelect} 
                centerLat={formData.latitude} 
                centerLng={formData.longitude} 
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Nama Penerima</label>
                <input className="auth-input" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} placeholder="Contoh: Alex Doe" />
              </div>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Nomor Telepon</label>
                <input className="auth-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0812xxxx" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Provinsi</label>
                <input 
                  className="auth-input" 
                  value={formData.province} 
                  onChange={e => {
                    changeSourceRef.current = 'dropdown';
                    setFormData(prev => ({ ...prev, province: e.target.value }));
                  }}
                  placeholder="Provinsi"
                />
              </div>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Kota / Kabupaten</label>
                <input 
                  className="auth-input" 
                  value={formData.city} 
                  onChange={e => {
                    changeSourceRef.current = 'dropdown';
                    setFormData(prev => ({ ...prev, city: e.target.value }));
                  }}
                  placeholder="Kota / Kabupaten"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Kecamatan</label>
                <input 
                  className="auth-input" 
                  value={formData.district} 
                  onChange={e => {
                    changeSourceRef.current = 'dropdown';
                    setFormData(prev => ({ ...prev, district: e.target.value }));
                  }}
                  placeholder="Kecamatan"
                />
              </div>
              <div className="auth-input-wrapper">
                <label className="auth-input-label">Kode Pos</label>
                <input className="auth-input" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="40132" />
              </div>
            </div>

            <div className="auth-input-wrapper" style={{ marginBottom: "1rem" }}>
              <label className="auth-input-label">Alamat Lengkap (Nama Jalan, No. Rumah, dll)</label>
              <textarea className="auth-input" rows={2} value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} placeholder="Jl. Merdeka No. 123" />
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                type="button"
                className="pill-btn"
                style={{ background: "#111", color: "#fff", border: "none", flex: 1 }}
                onClick={async () => {
                  if (!formData.recipient || !formData.line1) return;
                  await onSaveAddress(formData);
                  setShowForm(false);
                  setFormData({ label: "Rumah", recipient: "", phone: "", line1: "", district: "", city: "", province: "", postalCode: "", latitude: undefined, longitude: undefined });
                }}
              >
                Simpan Alamat
              </button>
            </div>
          </div>
        )}

        <div className="address-list">
          {addresses.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "1.2rem",
                borderRadius: "12px",
                border: "1px solid #eee",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                position: "relative"
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 700, color: "#111", fontSize: "0.95rem" }}>{item.recipient}</span>
                  <span style={{ height: "4px", width: "4px", borderRadius: "50%", background: "#ccc" }}></span>
                  <span>{item.phone}</span>
                  {item.isPrimary && <span style={{ fontSize: "0.65rem", background: "#fef3c7", color: "#92400e", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>UTAMA</span>}
                </div>
                <div>{item.line1}</div>
                <div>{item.district}, {item.city}</div>
                <div>{item.province}, {item.postalCode}</div>
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
          {addresses.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>Belum ada alamat pengiriman.</div>
          )}
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
  onSavePayment: (payload: { label: string; accountNumber: string; accountName: string }) => void;
  onRemovePayment: (id: string) => void;
}) {
  const [formData, setFormData] = useState({
    label: "BCA",
    accountNumber: "",
    accountName: "",
  });
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p className="profile-section-title" style={{ margin: 0 }}>Metode Pembayaran</p>
        <button 
          className="pill-btn" 
          style={{ background: "#111", color: "#fff", border: "none" }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Batal" : "Tambah Rekening"}
        </button>
      </div>

      <div style={{ maxWidth: "600px" }}>
        {showForm && (
          <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", border: "1px solid #eee" }}>
            <div className="auth-input-wrapper">
              <label className="auth-input-label">Pilih Bank</label>
              <select className="auth-input" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})}>
                <option value="BCA">BCA (Bank Central Asia)</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BNI">BNI (Bank Negara Indonesia)</option>
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="SeaBank">SeaBank</option>
                <option value="DANA">DANA (E-Wallet)</option>
              </select>
            </div>
            
            <div className="auth-input-wrapper">
              <label className="auth-input-label">Nomor Rekening / HP</label>
              <input className="auth-input" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="Masukkan nomor..." />
            </div>

            <div className="auth-input-wrapper">
              <label className="auth-input-label">Nama Lengkap Pemilik</label>
              <input className="auth-input" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} placeholder="Sesuai buku tabungan" />
            </div>

            <button
              type="button"
              className="pill-btn"
              style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none", width: "100%" }}
              onClick={async () => {
                if (!formData.accountNumber || !formData.accountName) return;
                await onSavePayment(formData);
                setShowForm(false);
                setFormData({ label: "BCA", accountNumber: "", accountName: "" });
              }}
            >
              Simpan Rekening
            </button>
          </div>
        )}

        <div className="payment-list">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                padding: "1.2rem",
                borderRadius: "12px",
                border: "1px solid #eee",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#444" }}>
                <div style={{ fontWeight: 700, color: "#111", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {method.label} {method.isPrimary && <span style={{ fontSize: "0.6rem", background: "#d1fae5", color: "#065f46", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>UTAMA</span>}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#111", marginTop: "0.2rem" }}>{method.accountNumber}</div>
                <div style={{ fontSize: "0.78rem", color: "#777" }}>an. {method.accountName}</div>
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
          {paymentMethods.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>Belum ada metode pembayaran.</div>
          )}
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
