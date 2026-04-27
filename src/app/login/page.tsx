/**
 * app/login/page.tsx
 * Server Component — reads `?redirect` param, passes to client shell.
 */

import type { Metadata } from "next";
import LoginPage from "../../frontend/components/auth/login/LoginPage";

export const metadata: Metadata = {
  title: "Masuk | Novure",
  description: "Login ke akun Novure untuk mulai berbelanja.",
};

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginRoute({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/";

  return <LoginPage redirectTo={redirectTo} />;
}
