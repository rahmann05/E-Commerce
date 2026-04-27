"use client";

/**
 * components/auth/NavbarAuthStatus.tsx
 * Auth-aware section of the navbar:
 *   - Not logged in → "Login" link
 *   - Logged in     → avatar initials + "Profile" + Logout
 */

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { useEffect, useState } from "react";

function getInitials(name: string = ""): string {
  const safeName = name || "U";
  return safeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w ? w[0] : "")
    .join("")
    .toUpperCase();
}

export default function NavbarAuthStatus() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) return null;

  if (!user) {
    return (
      <Link href="/login" className="navbar-auth-link" style={{ color: "inherit" }}>
        Login
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      {/* Profile link with avatar */}
      <Link href="/profile" className="navbar-auth-link" style={{ color: "inherit" }}>
        <span className="navbar-avatar-sm">{getInitials(user.name)}</span>
        {(user.name || user.email.split("@")[0]).split(" ")[0]}
      </Link>

      {/* Logout */}
      <motion.button
        onClick={() => {
          logout();
          router.push("/");
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "0.82rem",
          color: "#999",
          padding: 0,
          transition: "color 0.3s ease",
        }}
        whileHover={{ color: "#111" } as never}
        whileTap={{ scale: 0.95 } as never}
      >
        Keluar
      </motion.button>
    </div>
  );
}
