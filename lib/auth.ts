/**
 * lib/auth.ts
 * Client-side session utilities backed by localStorage.
 * All functions are browser-only — never call on the server.
 */

import type { SessionUser } from "@/lib/mock-users";
import { verifyCredentials } from "@/lib/mock-users";

const SESSION_KEY = "novure_session";
const SESSION_EVENT = "novure:session-changed";

function notifySessionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Persist a user session into localStorage */
export function setSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  notifySessionChange();
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
  notifySessionChange();
}

/** Subscribe to auth session updates in the current tab and cross-tab. */
export function subscribeSession(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(SESSION_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SESSION_EVENT, handler);
  };
}

/** Attempt to log in; returns session user or error string */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: SessionUser } | { error: string }> {
  // Small artificial delay to feel realistic
  await new Promise((r) => setTimeout(r, 600));

  const user = verifyCredentials(email, password);
  if (!user) {
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  setSession(user);
  return { user };
}
