"use client";

/**
 * components/auth/profile/ProfileLogoutButton.tsx
 * Logout CTA.
 */

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfileLogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <button
        onClick={handleLogout}
        className="profile-logout-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.7rem 1.6rem",
          borderRadius: "9999px",
          border: "1.5px solid rgba(0,0,0,0.12)",
          background: "transparent",
          color: "#555",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        <LogOut size={14} />
        Keluar
      </button>
    </div>
  );
}
