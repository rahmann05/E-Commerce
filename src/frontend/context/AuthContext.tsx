"use client";

/**
 * components/providers/AuthContext.tsx
 * Global auth context — wraps the whole app.
 * Reads localStorage on mount; no SSR issues.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { SessionUser } from "@/lib/mock-users";
import { getSessionFromCookie, loginUser, logoutUser } from "@/lib/auth";

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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const nextUser = await getSessionFromCookie();
      if (!active) return;
      setUser(nextUser);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

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
    void logoutUser();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<SessionUser>) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
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
