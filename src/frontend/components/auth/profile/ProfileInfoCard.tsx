"use client";

/**
 * components/auth/profile/ProfileInfoCard.tsx
 * Grid of user info rows with editorial section label /02.
 */

import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfileData } from "@/context/ProfileDataContext";

export default function ProfileInfoCard() {
  const { user } = useAuth();
  const { saveProfileInfo } = useProfileData();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!user) return null;

  const fullName = user.name || "";
  const [formData, setFormData] = useState({
    firstName: fullName.split(" ")[0] || "",
    lastName: fullName.split(" ").slice(1).join(" ") || "",
    phone: user.phone || "",
  });

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    const newFullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    const result = await saveProfileInfo({ 
      name: newFullName || user.name, 
      phone: formData.phone 
    });

    setIsSaving(false);
    if (result.success) {
      setMessage({ text: "Profil berhasil diperbarui secara permanen.", type: "success" });
    } else {
      setMessage({ text: result.message || "Gagal menyimpan perubahan.", type: "error" });
    }
  };

  return (
    <section>
      <p className="profile-section-title">Informasi Pribadi</p>
      <form onSubmit={handleSave} className="profile-info-form">
        <div className="profile-info-grid">
          <div className="auth-input-wrapper">
            <label htmlFor="info-first-name" className="auth-input-label">Nama Depan</label>
            <input 
              id="info-first-name"
              type="text" 
              className="auth-input" 
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="auth-input-wrapper">
            <label htmlFor="info-last-name" className="auth-input-label">Nama Belakang</label>
            <input 
              id="info-last-name"
              type="text" 
              className="auth-input" 
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="auth-input-wrapper">
          <label htmlFor="info-email" className="auth-input-label">Email</label>
          <input 
            id="info-email"
            type="email" 
            className="auth-input disabled-input" 
            value={user.email}
            disabled
          />
        </div>

        <div className="auth-input-wrapper">
          <label htmlFor="info-phone" className="auth-input-label">No. Telepon</label>
          <input 
            id="info-phone"
            type="tel" 
            className="auth-input" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+62"
          />
        </div>

        {message && (
          <div className={`pv-form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit"
          className="pill-btn profile-submit-btn"
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </section>
  );
}
