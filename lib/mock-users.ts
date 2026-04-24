/**
 * lib/mock-users.ts
 * Mock user data — no DB required.
 * Swap loginUser() with a real DB query when ready.
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentPreference?: string;
  /** plaintext for demo only — hash in production */
  password: string;
  role: "user" | "admin";
  joinedAt: string; // ISO date string
}

/** The stored session shape (no password) */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentPreference?: string;
  role: "user" | "admin";
  joinedAt: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr_1",
    name: "Alex Rivera",
    email: "demo@novure.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan 12190",
    paymentPreference: "BCA Virtual Account",
    password: "novure123",
    role: "user",
    joinedAt: "2025-01-15",
  },
  {
    id: "usr_2",
    name: "Admin Novure",
    email: "admin@novure.com",
    password: "admin123",
    role: "admin",
    joinedAt: "2024-08-01",
  },
];

/**
 * Verify credentials against the mock list.
 * Returns the session user (no password) or null.
 */
export function verifyCredentials(
  email: string,
  password: string
): SessionUser | null {
  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );
  if (!found) return null;
  const { password: _pw, ...session } = found;
  return session;
}
