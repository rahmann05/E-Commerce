"use client";

/**
 * components/auth/login/LoginPage.tsx
 * Full-screen login — light editorial.
 * Giant dark typography, centered form, footer anchors.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import Link from "next/link";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  redirectTo: string;
}

export default function LoginPage({ redirectTo }: LoginPageProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return (
    <main className="login-page">
      {/* Top-left back link */}
      <Link href="/" className="login-back-link">
        ← Novure
      </Link>

      {/* Centered form */}
      <LoginForm redirectTo={redirectTo} />

      {/* Bottom anchors — editorial section label + brand */}
      <div className="login-footer">
        <span className="login-footer-label">/01 — Login</span>
        <span className="login-footer-brand">Novure ®</span>
      </div>
    </main>
  );
}
