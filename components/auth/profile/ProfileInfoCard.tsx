"use client";

/**
 * components/auth/profile/ProfileInfoCard.tsx
 * Grid of user info rows with editorial section label /02.
 */

import { useState } from "react";
import type { SessionUser } from "@/lib/mock-users";
import { motion } from "framer-motion";
import { useProfileData } from "@/components/providers/ProfileDataContext";

interface ProfileInfoCardProps {
  user: SessionUser;
}

export default function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const { saveProfileInfo, phone } = useProfileData();
  const [formData, setFormData] = useState({
    firstName: user.name.split(" ")[0] || "",
    lastName: user.name.split(" ")[1] || "",
    phone: phone || user.phone || "",
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (!fullName) {
      setStatus("Nama tidak boleh kosong.");
      return;
    }

    saveProfileInfo({
      name: fullName,
      phone: formData.phone,
    });
    setStatus("Profil berhasil diperbarui.");
  };

  return (
    <section>
      <p className="profile-section-title">Informasi Pribadi</p>
      <form onSubmit={handleSave} style={{ maxWidth: "500px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <motion.div className="auth-input-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="auth-input-label">Nama Depan</label>
            <input 
              type="text" 
              className="auth-input" 
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </motion.div>
          <motion.div className="auth-input-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="auth-input-label">Nama Belakang</label>
            <input 
              type="text" 
              className="auth-input" 
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </motion.div>
        </div>

        <motion.div className="auth-input-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="auth-input-label">Email</label>
          <input 
            type="email" 
            className="auth-input" 
            value={user.email}
            disabled
            style={{ color: "rgba(0,0,0,0.5)" }}
          />
        </motion.div>

        <motion.div className="auth-input-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className="auth-input-label">No. Telepon</label>
          <input 
            type="tel" 
            className="auth-input" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+62"
          />
        </motion.div>

        <motion.button 
          type="submit"
          className="pill-btn"
          style={{ marginTop: "1rem", background: "#111", color: "#fff", border: "none" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          Simpan Perubahan
        </motion.button>

        {status && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#666" }}>
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
