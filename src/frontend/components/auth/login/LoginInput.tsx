"use client";

/**
 * components/auth/login/LoginInput.tsx
 * Borderless underline input — light editorial.
 */

import { motion } from "framer-motion";
import type { InputHTMLAttributes } from "react";

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  delay?: number;
}

export default function LoginInput({ label, delay = 0, ...props }: LoginInputProps) {
  return (
    <motion.div
      className="auth-input-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <label className="auth-input-label">{label}</label>
      <input className="auth-input" {...props} />
    </motion.div>
  );
}
