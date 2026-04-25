"use client";

/**
 * components/auth/profile/ProfilePage.tsx
 * Full profile page — dashboard sidebar layout.
 */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import ProfileHero from "./ProfileHero";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileOrderHistory from "./ProfileOrderHistory";
import ProfileLogoutButton from "./ProfileLogoutButton";
import { 
  ProfileAddressView, 
  ProfilePaymentView, 
  ProfileSecurityView, 
  ProfileEmptyView 
} from "./ProfileViews";

type TabId = "overview" | "orders" | "wishlist" | "reviews" | "address" | "payment" | "vouchers" | "security" | "notifications";

function toTab(value: string | null): TabId {
  const allowed: TabId[] = [
    "overview",
    "orders",
    "wishlist",
    "reviews",
    "address",
    "payment",
    "vouchers",
    "security",
    "notifications",
  ];
  return allowed.includes(value as TabId) ? (value as TabId) : "overview";
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    toTab(searchParams.get("tab"))
  );

  // If not loading and no user, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // While checking auth state, don't flash the UI
  if (isLoading || !user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <ProfileInfoCard user={user} />;
      case "orders": return <ProfileOrderHistory />;
      case "address": return <ProfileAddressView user={user} />;
      case "payment": return <ProfilePaymentView user={user} />;
      case "security": return <ProfileSecurityView />;
      case "wishlist": return <ProfileEmptyView title="Daftar Keinginan" message="Belum ada produk di wishlist Anda." />;
      case "reviews": return <ProfileEmptyView title="Ulasan Saya" message="Anda belum memberikan ulasan produk." />;
      case "vouchers": return <ProfileEmptyView title="Voucher Saya" message="Tidak ada voucher yang tersedia saat ini." />;
      case "notifications": return <ProfileEmptyView title="Notifikasi" message="Tidak ada notifikasi baru." />;
      default: return null;
    }
  };

  return (
    <main className="profile-page">
      <ProfileHero user={user} />
      <div className="profile-dashboard">
        
        {/* Sidebar Navigation */}
        <aside className="profile-sidebar">
          
          <div className="profile-section-title" style={{ marginBottom: "0.8rem" }}>Akun</div>
          <nav className="profile-sidebar-nav" style={{ marginBottom: "2rem" }}>
            <button className={`profile-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Profil Saya</button>
            <button className={`profile-tab ${activeTab === "address" ? "active" : ""}`} onClick={() => setActiveTab("address")}>Alamat Pengiriman</button>
            <button className={`profile-tab ${activeTab === "payment" ? "active" : ""}`} onClick={() => setActiveTab("payment")}>Metode Pembayaran</button>
            <button className={`profile-tab ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>Keamanan</button>
          </nav>

          <div className="profile-section-title" style={{ marginBottom: "0.8rem" }}>Aktivitas</div>
          <nav className="profile-sidebar-nav" style={{ marginBottom: "2rem" }}>
            <button className={`profile-tab ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>Pesanan Saya</button>
            <button className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`} onClick={() => setActiveTab("wishlist")}>Daftar Keinginan</button>
            <button className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Ulasan Saya</button>
          </nav>

          <div className="profile-section-title" style={{ marginBottom: "0.8rem" }}>Promo & Info</div>
          <nav className="profile-sidebar-nav">
            <button className={`profile-tab ${activeTab === "vouchers" ? "active" : ""}`} onClick={() => setActiveTab("vouchers")}>Voucher Saya</button>
            <button className={`profile-tab ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>Notifikasi</button>
          </nav>

          <div style={{ marginTop: "3rem" }}>
            <ProfileLogoutButton />
          </div>
        </aside>

        {/* Content Area */}
        <div className="profile-content">
          {renderContent()}
        </div>
        
      </div>
    </main>
  );
}
