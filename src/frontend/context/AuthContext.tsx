"use client";

/**
 * components/providers/AuthContext.tsx
 * Global auth context — wraps the whole app.
 * Reads localStorage on mount; no SSR issues.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { SessionUser } from "@/lib/mock-users";
import { getSession, clearSession, loginUser, patchSession } from "@/lib/auth";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (patch: Partial<SessionUser>) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getSession());
  const [isLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if ("error" in result) {
        return { success: false, error: result.error };
      }
      setUser(result.user);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<SessionUser>) => {
    const next = patchSession(patch);
    if (next) {
      setUser(next);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
