"use client";

/**
 * components/auth/login/LoginDemoHint.tsx
 * Demo credentials hint — very muted on light bg.
 */

import { motion } from "framer-motion";

export default function LoginDemoHint() {
  return (
    <motion.p
      className="login-demo-hint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      Demo: <span>demo@novure.com</span> / <span>novure123</span>
    </motion.p>
  );
}
