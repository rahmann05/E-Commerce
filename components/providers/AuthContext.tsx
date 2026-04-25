"use client";

/**
 * components/providers/AuthContext.tsx
 * Global auth context — wraps the whole app.
 * Reads localStorage on mount; no SSR issues.
 */

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";
import type { SessionUser } from "@/lib/mock-users";
import { getSession, clearSession, loginUser, setSession, subscribeSession } from "@/lib/auth";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (
    fields: Partial<Pick<SessionUser, "name" | "phone" | "address" | "paymentPreference">>
  ) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeSession, getSession, () => null);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if ("error" in result) {
        return { success: false, error: result.error };
      }
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const updateProfile = useCallback(
    (
      fields: Partial<Pick<SessionUser, "name" | "phone" | "address" | "paymentPreference">>
    ) => {
      const current = getSession();
      if (!current) return;
      setSession({ ...current, ...fields });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading: false, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
