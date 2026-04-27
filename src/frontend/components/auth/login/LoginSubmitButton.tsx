"use client";

/**
 * components/auth/login/LoginSubmitButton.tsx
 * Dark pill submit button — same as landing page "Buy Now".
 */

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface LoginSubmitButtonProps {
  isLoading: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function LoginSubmitButton({ 
  isLoading, 
  label = "Masuk", 
  loadingLabel = "Memproses..." 
}: LoginSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      className="buy-now-btn"
      style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.97 } : {}}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            {loadingLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!isLoading && (
        <span className="arrow-circle">
          <ArrowUpRight size={14} />
        </span>
      )}
    </motion.button>
  );
}
