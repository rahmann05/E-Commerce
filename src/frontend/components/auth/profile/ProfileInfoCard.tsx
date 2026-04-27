"use client";

/**
 * components/auth/profile/ProfileInfoCard.tsx
 * Grid of user info rows with editorial section label /02.
 */

import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileInfoCard() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const fullName = user.name || "";
  const [formData, setFormData] = useState({
    firstName: fullName.split(" ")[0] || "",
    lastName: fullName.split(" ").slice(1).join(" ") || "",
    phone: user.phone || "",
  });

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateUser({ name: newFullName || user.name, phone: formData.phone });
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

        <button 
          type="submit"
          className="pill-btn profile-submit-btn"
        >
          Simpan Perubahan
        </button>
      </form>
    </section>
  );
}
