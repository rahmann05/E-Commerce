"use client";

/**
 * components/auth/profile/ProfileAvatar.tsx
 * Dark circle avatar — #111 bg, white initials.
 */

import { motion } from "framer-motion";

interface ProfileAvatarProps {
  name: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProfileAvatar({ name }: ProfileAvatarProps) {
  return (
    <motion.div
      className="profile-avatar"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {getInitials(name)}
    </motion.div>
  );
}
