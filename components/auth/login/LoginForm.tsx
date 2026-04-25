"use client";

/**
 * components/auth/login/LoginForm.tsx
 * Giant editorial title + centered form — light theme.
 */

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthContext";
import LoginInput from "./LoginInput";
import LoginErrorMessage from "./LoginErrorMessage";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginDemoHint from "./LoginDemoHint";

interface LoginFormProps {
  redirectTo: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Terjadi kesalahan.");
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div className="login-content">
      {/* Giant editorial title */}
      <motion.h1
        className="login-hero-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Selamat
        <br />
        datang.
      </motion.h1>

      <motion.p
        className="login-hero-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        Masuk ke akun Novure untuk melanjutkan belanja.
      </motion.p>

      {/* Error */}
      <LoginErrorMessage message={error} />

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <LoginInput
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          delay={0.4}
        />
        <LoginInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          delay={0.5}
        />
        <LoginSubmitButton isLoading={isLoading} />
      </form>

      {/* Divider */}
      <motion.div
        className="login-divider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        atau
      </motion.div>

      {/* Demo hint */}
      <LoginDemoHint />
    </div>
  );
}
