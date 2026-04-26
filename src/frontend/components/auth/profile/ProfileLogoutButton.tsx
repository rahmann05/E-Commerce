"use client";

/**
 * components/auth/profile/ProfileLogoutButton.tsx
 * Logout CTA — clean dark outline pill matching Dribbble button style.
 */

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", justifyContent: "flex-start" }}
    >
      <motion.button
        onClick={handleLogout}
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
        whileHover={{
          background: "#111",
          color: "#fff",
          borderColor: "#111",
        }}
        whileTap={{ scale: 0.97 }}
      >
        <LogOut size={14} />
        Keluar
      </motion.button>
    </motion.div>
  );
}
