"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  return (
    <main className="login-page">
      <Link href="/" className="login-back-link">
        ← Home
      </Link>

      <RegisterForm />

      <div className="login-footer">
        <span className="login-footer-label">/02 — Register</span>
        <span className="login-footer-brand">Novure ®</span>
      </div>
    </main>
  );
}
