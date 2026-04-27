"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import LoginInput from "../login/LoginInput";
import LoginErrorMessage from "../login/LoginErrorMessage";
import LoginSubmitButton from "../login/LoginSubmitButton";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.error ?? "Gagal membuat akun.");
        return;
      }

      // Success! Redirect to login or auto-login
      router.push("/login?registered=true");
    } catch (err: any) {
      setIsLoading(false);
      setError("Terjadi kesalahan jaringan.");
    }
  }

  return (
    <div className="login-content">
      <motion.h1
        className="login-hero-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Buat
        <br />
        akun.
      </motion.h1>

      <motion.p
        className="login-hero-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        Bergabung dengan Novure untuk pengalaman belanja premium.
      </motion.p>

      <LoginErrorMessage message={error} />

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <LoginInput
          label="Nama Lengkap"
          type="text"
          placeholder="Nama kamu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          delay={0.4}
        />
        <LoginInput
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          delay={0.5}
        />
        <LoginInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          delay={0.6}
        />
        <LoginInput
          label="Konfirmasi Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          delay={0.7}
        />
        <LoginSubmitButton
          isLoading={isLoading}
          label="Daftar Sekarang"
          loadingLabel="Mendaftar..."
        />
      </form>

      <motion.div
        className="login-divider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        Sudah punya akun? <Link href="/login" style={{ textDecoration: "underline", color: "#111" }}>Masuk di sini</Link>
      </motion.div>
    </div>
  );
}
