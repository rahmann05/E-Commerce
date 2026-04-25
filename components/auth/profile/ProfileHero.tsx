"use client";

/**
 * components/auth/profile/ProfileHero.tsx
 * Light editorial hero — giant dark name, editorial section label.
 * No MultiColorWave, no dark bg, no gradients.
 */

import { motion } from "framer-motion";
import type { SessionUser } from "@/lib/mock-users";
import ProfileAvatar from "./ProfileAvatar";

interface ProfileHeroProps {
  user: SessionUser;
}

export default function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <div className="profile-hero">
      {/* Section label */}
      <motion.span
        className="profile-section-label"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        /01 — Profil Saya
      </motion.span>

      {/* Avatar */}
      <ProfileAvatar name={user.name} />

      {/* Name — giant editorial */}
      <motion.h1
        className="profile-name"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {user.name}
      </motion.h1>

      {/* Email */}
      <motion.p
        className="profile-email"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {user.email}
      </motion.p>

      {/* Role badge — clean outline pill */}
      <motion.span
        className="profile-role-badge"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {user.role === "admin" ? "Administrator" : "Member"}
      </motion.span>
    </div>
  );
}
