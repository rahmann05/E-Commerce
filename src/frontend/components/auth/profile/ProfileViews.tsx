"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import type {
  ProfileAddress,
  ProfileNotification,
  ProfilePaymentMethod,
  ProfileVoucher,
  WishlistItem,
} from "@/context/ProfileDataContext";

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
  const [, setRegencies] = useState<{id: string, name: string}[]>([]);
  const [, setDistricts] = useState<{id: string, name: string}[]>([]);

  const [selectedProvinceId, ] = useState("");
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
    let active = true;
    if (selectedProvinceId) {
      fetchRegencies(selectedProvinceId).then(data => {
        if (active) {
          setRegencies(data);
          if (changeSourceRef.current !== 'map') {
            setSelectedRegencyId("");
            setFormData(prev => ({ ...prev, city: "", district: "" }));
            setDistricts([]);
          }
        }
      });
    } else {
      setTimeout(() => {
        if (active) {
          setRegencies([]);
          setSelectedRegencyId("");
          setDistricts([]);
        }
      }, 0);
    }
    return () => { active = false; };
  }, [selectedProvinceId]);

  // Fetch Districts when regency changes
  useEffect(() => {
    let active = true;
    if (selectedRegencyId) {
      fetchDistricts(selectedRegencyId).then(data => {
        if (active) {
          setDistricts(data);
          if (changeSourceRef.current !== 'map') {
            setFormData(prev => ({ ...prev, district: "" }));
          }
        }
      });
    } else {
      setTimeout(() => {
        if (active) {
          setDistricts([]);
          setFormData(prev => ({ ...prev, district: "" }));
        }
      }, 0);
    }
    return () => { active = false; };
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

  const handleLocationSelect = async (address: string, lat: number, lng: number, rawAddr: Record<string, unknown>, postalCode: string) => {
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

    const translateMapTerm = (s: string) => {
      if (!s) return "";
      return s
        .replace(/\bSouth\b/g, "Selatan")
        .replace(/\bNorth\b/g, "Utara")
        .replace(/\bWest\b/g, "Barat")
        .replace(/\bEast\b/g, "Timur")
        .replace(/\bCentral\b/g, "Pusat")
        .replace(/\bProvince\b/g, "Provinsi")
        .replace(/\bRegency\b/g, "Kabupaten")
        .replace(/\bSpecial Region of\b/g, "Daerah Istimewa")
        .replace(/\bCapital City District of\b/g, "DKI")
        .trim();
    };

    const prov = translateMapTerm((rawAddr.state as string) || (rawAddr.region as string) || "");
    const city = translateMapTerm((rawAddr.city as string) || (rawAddr.county as string) || (rawAddr.municipality as string) || "");
    const dist = translateMapTerm((rawAddr.suburb as string) || (rawAddr.district as string) || (rawAddr.village as string) || (rawAddr.town as string) || "");

    setFormData(prev => ({ 
      ...prev, 
      province: prov,
      city: city,
      district: dist
    }));
  };

  return (
    <section>
      <div className="pv-section-header">
        <p className="profile-section-title pv-title-inline">Alamat Pengiriman</p>
        <button 
          className="pill-btn pv-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Batal" : "Tambah Alamat Baru"}
        </button>
      </div>

      <div className="pv-content-800">
        {showForm && (
          <div className="pv-form-panel">
            
            <div className="pv-mb-24">
              <LocationMap 
                onLocationSelect={handleLocationSelect} 
                centerLat={formData.latitude} 
                centerLng={formData.longitude} 
              />
            </div>

            <div className="pv-grid-2">
              <div className="auth-input-wrapper">
                <label htmlFor="address-recipient" className="auth-input-label">Nama Penerima</label>
                <input id="address-recipient" className="auth-input" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} placeholder="Contoh: Alex Doe" />
              </div>
              <div className="auth-input-wrapper">
                <label htmlFor="address-phone" className="auth-input-label">Nomor Telepon</label>
                <input id="address-phone" className="auth-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0812xxxx" />
              </div>
            </div>

            <div className="pv-grid-2">
              <div className="auth-input-wrapper">
                <label htmlFor="address-province" className="auth-input-label">Provinsi</label>
                <input 
                  id="address-province"
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
                <label htmlFor="address-city" className="auth-input-label">Kota / Kabupaten</label>
                <input 
                  id="address-city"
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

            <div className="pv-grid-2">
              <div className="auth-input-wrapper">
                <label htmlFor="address-district" className="auth-input-label">Kecamatan</label>
                <input 
                  id="address-district"
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
                <label htmlFor="address-postal" className="auth-input-label">Kode Pos</label>
                <input id="address-postal" className="auth-input" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="40132" />
              </div>
            </div>

            <div className="auth-input-wrapper pv-mb-16">
              <label htmlFor="address-line1" className="auth-input-label">Alamat Lengkap (Nama Jalan, No. Rumah, dll)</label>
              <textarea id="address-line1" className="auth-input" rows={2} value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} placeholder="Jl. Merdeka No. 123" />
            </div>

            <div className="pv-row-actions">
              <button
                type="button"
                className="pill-btn pv-btn-primary pv-flex-1"
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
              className="pv-item-card"
            >
              <div className="pv-item-meta">
                <div className="pv-item-head">
                  <span className="pv-item-name">{item.recipient}</span>
                  <span className="pv-item-dot"></span>
                  <span>{item.phone}</span>
                  {item.isPrimary && <span className="pv-badge-address-primary">UTAMA</span>}
                </div>
                <div>{item.line1}</div>
                <div>{item.district}, {item.city}</div>
                <div>{item.province}, {item.postalCode}</div>
              </div>
              <button
                type="button"
                className="pill-btn pv-btn-xs"
                onClick={() => onRemoveAddress(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
          {addresses.length === 0 && !showForm && (
            <div className="pv-empty-line">Belum ada alamat pengiriman.</div>
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
      <div className="pv-section-header">
        <p className="profile-section-title pv-title-inline">Metode Pembayaran</p>
        <button 
          className="pill-btn pv-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Batal" : "Tambah Rekening"}
        </button>
      </div>

      <div className="pv-content-600">
        {showForm && (
          <div className="pv-form-panel">
            <div className="auth-input-wrapper">
              <label htmlFor="payment-bank" className="auth-input-label">Pilih Bank</label>
              <select id="payment-bank" className="auth-input" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})}>
                <option value="BCA">BCA (Bank Central Asia)</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BNI">BNI (Bank Negara Indonesia)</option>
                <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                <option value="SeaBank">SeaBank</option>
                <option value="DANA">DANA (E-Wallet)</option>
              </select>
            </div>
            
            <div className="auth-input-wrapper">
              <label htmlFor="payment-account" className="auth-input-label">Nomor Rekening / HP</label>
              <input id="payment-account" className="auth-input" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="Masukkan nomor..." />
            </div>

            <div className="auth-input-wrapper">
              <label htmlFor="payment-name" className="auth-input-label">Nama Lengkap Pemilik</label>
              <input id="payment-name" className="auth-input" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} placeholder="Sesuai buku tabungan" />
            </div>

            <button
              type="button"
              className="pill-btn pv-btn-primary pv-btn-block pv-mt-16"
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
              className="pv-item-card pv-item-card-center"
            >
              <div className="pv-payment-meta">
                <div className="pv-payment-head">
                  {method.label} {method.isPrimary && <span className="pv-badge-payment-primary">UTAMA</span>}
                </div>
                <div className="pv-payment-number">{method.accountNumber}</div>
                <div className="pv-payment-owner">an. {method.accountName}</div>
              </div>
              <button
                type="button"
                className="pill-btn pv-btn-xs"
                onClick={() => onRemovePayment(method.id)}
              >
                Hapus
              </button>
            </div>
          ))}
          {paymentMethods.length === 0 && !showForm && (
            <div className="pv-empty-line">Belum ada metode pembayaran.</div>
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
      <form onSubmit={handleSave} className="pv-content-400">
        <div className="auth-input-wrapper">
          <label htmlFor="security-current-password" className="auth-input-label">Password Saat Ini</label>
          <input
            id="security-current-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="auth-input-wrapper">
          <label htmlFor="security-new-password" className="auth-input-label">Password Baru</label>
          <input
            id="security-new-password"
            type="password"
            className="auth-input"
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="auth-input-wrapper">
          <label htmlFor="security-confirm-password" className="auth-input-label">Konfirmasi Password Baru</label>
          <input
            id="security-confirm-password"
            type="password"
            className="auth-input"
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="pill-btn pv-btn-primary pv-mt-16"
        >
          Perbarui Password
        </button>
        {message && (
          <p className="pv-help-text">
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
  onRemove: (productId: string) => void;
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
      <div className="pv-content-640">
        {items.map((item) => (
          <div
            key={item.productId}
            className="pv-line-row"
          >
            <div>
              <div className="pv-line-title">{item.name}</div>
              <div className="pv-line-subtitle">
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
          className="pv-note-line"
        >
          <div className="pv-note-title">{voucher.title}</div>
          <div className="pv-note-subtitle">
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
          className="pv-note-line"
        >
          <div className="pv-note-row">
            <div>
              <div className="pv-note-title">{notification.title}</div>
              <div className="pv-note-subtitle">{notification.message}</div>
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
      <div className="pv-empty-block">
        <p className="pv-empty-message">{message}</p>
      </div>
    </section>
  );
}
