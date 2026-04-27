import type { Metadata } from "next";
import RegisterPage from "../../frontend/components/auth/register/RegisterPage";
import "../login/auth.css";

export const metadata: Metadata = {
  title: "Daftar | Novure",
  description: "Buat akun Novure baru untuk mulai berbelanja.",
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
