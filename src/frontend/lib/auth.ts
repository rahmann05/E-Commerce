/**
 * lib/auth.ts
 * Client-side session utilities backed by secure server cookie.
 */

import type { SessionUser } from "@/lib/mock-users";

/** Resolve current user from session cookie */
export async function getSessionFromCookie(): Promise<SessionUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { user?: SessionUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Clear server-side session cookie */
export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    keepalive: true,
  });
}

/** Attempt to log in; returns session user or error string */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: SessionUser } | { error: string }> {
  // Small artificial delay to feel realistic
  await new Promise((r) => setTimeout(r, 600));
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { error: data.error ?? "Gagal login." };
    }
    const data = (await res.json()) as { user: SessionUser };
    return { user: data.user };
  } catch {
    return { error: "Terjadi gangguan jaringan saat login." };
  }
}
