/**
 * lib/auth.ts
 * Client-side session utilities backed by localStorage.
 * All functions are browser-only — never call on the server.
 */

import type { SessionUser } from "@/lib/mock-users";
import { verifyCredentials } from "@/lib/mock-users";

const SESSION_KEY = "novure_session";

/** Persist a user session into localStorage */
export function setSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Read the current session; returns null if not logged in */
export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Remove the current session */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Merge partial user fields into current session */
export function patchSession(
  patch: Partial<SessionUser>
): SessionUser | null {
  const current = getSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  setSession(next);
  return next;
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
    setSession(data.user);
    return { user: data.user };
  } catch {
    const user = verifyCredentials(email, password);
    if (!user) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
    setSession(user);
    return { user };
  }
}
