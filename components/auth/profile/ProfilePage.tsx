"use client";

/**
 * components/auth/profile/ProfilePage.tsx
 * Full profile page — dashboard sidebar layout.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useProfileData } from "@/components/providers/ProfileDataContext";
import ProfileHero from "./ProfileHero";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileOrderHistory from "./ProfileOrderHistory";
import ProfileLogoutButton from "./ProfileLogoutButton";
import { 
  ProfileAddressView, 
  ProfileWishlistView,
  ProfilePaymentView, 
  ProfileVoucherView,
  ProfileNotificationView,
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
  const { user, isLoading, updateUser } = useAuth();
  const {
    addresses,
    paymentMethods,
    orders,
    wishlist,
    vouchers,
    notifications,
    addAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
    removeWishlistItem,
    markNotificationRead,
    updatePassword,
  } = useProfileData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() => toTab(searchParams.get("tab")));

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

  const handleSaveProfile = (payload: { name: string; phone: string }) => {
    updateUser({ name: payload.name, phone: payload.phone });
  };

  const handleSaveAddress = (payload: {
    label: string;
    recipient: string;
    phone: string;
    line1: string;
  }) => {
    addAddress(payload);
    updateUser({ address: payload.line1 });
  };

  const handleSavePayment = (paymentPreference: string) => {
    addPaymentMethod({
      label: paymentPreference,
      details: "Metode pembayaran utama",
    });
    updateUser({ paymentPreference });
  };

  const handleSavePassword = (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const result = updatePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.newPassword,
    });
    return result.success;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <ProfileInfoCard user={user} onSave={handleSaveProfile} />;
      case "orders": return <ProfileOrderHistory orders={orders} />;
      case "address":
        return (
          <ProfileAddressView
            addresses={addresses}
            onSaveAddress={handleSaveAddress}
            onRemoveAddress={removeAddress}
          />
        );
      case "payment":
        return (
          <ProfilePaymentView
            paymentMethods={paymentMethods}
            onSavePayment={handleSavePayment}
            onRemovePayment={removePaymentMethod}
          />
        );
      case "security": return <ProfileSecurityView onSavePassword={handleSavePassword} />;
      case "wishlist":
        return (
          <ProfileWishlistView
            items={wishlist}
            onRemove={removeWishlistItem}
          />
        );
      case "reviews": return <ProfileEmptyView title="Ulasan Saya" message="Anda belum memberikan ulasan produk." />;
      case "vouchers": return <ProfileVoucherView vouchers={vouchers} />;
      case "notifications":
        return (
          <ProfileNotificationView
            notifications={notifications}
            onMarkRead={markNotificationRead}
          />
        );
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
