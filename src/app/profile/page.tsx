/**
 * app/profile/page.tsx
 * Server Component shell — auth guard handled client-side in ProfilePage.
 */

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfilePage from "@/components/auth/profile/ProfilePage";
import "./profile.css";
import "./profile-views.css";

export const metadata: Metadata = {
  title: "Profil Saya | Novure",
  description: "Kelola akun dan lihat riwayat pesanan Novure Anda.",
};

import { Suspense } from "react";

export default function ProfileRoute() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfilePage />
      </Suspense>
      <Footer />
    </>
  );
}
