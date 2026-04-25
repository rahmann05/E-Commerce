"use client";

/**
 * components/auth/login/LoginErrorMessage.tsx
 * Animated error message banner for the login form.
 */

import { motion, AnimatePresence } from "framer-motion";

interface LoginErrorMessageProps {
  message: string | null;
}

export default function LoginErrorMessage({ message }: LoginErrorMessageProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
