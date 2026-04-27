import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfilePage from "@/components/auth/profile/ProfilePage";
import "./profile.css";
import "./profile-views.css";

export const metadata: Metadata = {
  title: "Profil Saya | Novure",
  description: "Kelola akun dan lihat riwayat pesanan Novure Anda.",
};

export default function ProfileRoute() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pv-loading-wrap"><div className="animate-spin pv-loading-spinner"></div></div>}>
        <ProfilePage />
      </Suspense>
      <Footer />
    </>
  );
}
