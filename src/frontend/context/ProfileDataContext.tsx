"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import type { CartItem } from "@/context/CartContext";

export type ProfileOrderStatus = "awaiting_payment" | "processing" | "shipped" | "delivered" | "cancelled";

export interface ProfileAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary: boolean;
}

export interface ProfilePaymentMethod {
  id: string;
  label: string;
  details: string;
  accountNumber?: string;
  accountName?: string;
  isPrimary: boolean;
}

export interface ProfileOrderItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface ProfileOrder {
  id: string;
  createdAt: string;
  status: ProfileOrderStatus;
  total: number;
  shipping: number;
  items: ProfileOrderItem[];
  address?: ProfileAddress;
}

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface ProfileVoucher {
  id: string;
  code: string;
  title: string;
  expiresAt: string;
}

export interface ProfileNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface UserProfileData {
  phone: string;
  addresses: ProfileAddress[];
  paymentMethods: ProfilePaymentMethod[];
  orders: ProfileOrder[];
  wishlist: WishlistItem[];
  vouchers: ProfileVoucher[];
  notifications: ProfileNotification[];
}

interface ProfileDataContextValue {
  phone: string;
  addresses: ProfileAddress[];
  paymentMethods: ProfilePaymentMethod[];
  orders: ProfileOrder[];
  wishlist: WishlistItem[];
  vouchers: ProfileVoucher[];
  notifications: ProfileNotification[];
  saveProfileInfo: (payload: { name: string; phone: string }) => void;
  addAddress: (payload: Omit<ProfileAddress, "id" | "isPrimary">) => Promise<{ success: boolean; address?: ProfileAddress; message?: string }>;
  updateAddress: (id: string, payload: Partial<Omit<ProfileAddress, "id">>) => Promise<{ success: boolean; message?: string }>;
  removeAddress: (id: string) => Promise<{ success: boolean; message?: string }>;
  addPaymentMethod: (payload: { label: string; accountNumber: string; accountName: string }) => Promise<{ success: boolean; message?: string }>;
  removePaymentMethod: (id: string) => Promise<{ success: boolean; message?: string }>;
  placeOrderFromCart: (payload: {
    items: CartItem[];
    shipping: number;
    total: number;
  }) => ProfileOrder | null;
  toggleWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  markNotificationRead: (id: string) => void;
  submitCheckout: (payload: {
    items: CartItem[];
    shipping: number;
    total: number;
    addressId: string;
    paymentMethodId: string;
    courier: string;
    notes?: string;
    promoCode?: string;
  }) => Promise<{ success: boolean; orderId?: string; message?: string }>;
  refreshAccountData: () => Promise<void>;
  updatePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => { success: boolean; message: string };
}

const ProfileDataContext = createContext<ProfileDataContextValue | null>(null);

const EMPTY_DATA: UserProfileData = {
  phone: "",
  addresses: [],
  paymentMethods: [],
  orders: [],
  wishlist: [],
  vouchers: [],
  notifications: [],
};

export function ProfileDataProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState<UserProfileData>(EMPTY_DATA);

  const refreshAccountData = useCallback(async () => {
    if (!user) {
      setData(EMPTY_DATA);
      return;
    }
    const res = await fetch("/api/account");
    if (!res.ok) return;
    const payload = (await res.json()) as { data: UserProfileData };
    if (payload.data) {
      setData(payload.data);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshAccountData();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshAccountData]);

  const callMutation = useCallback(
    async (action: string, body: Record<string, unknown>) => {
      if (!user) return null;
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      if (!res.ok) return null;
      const payload = (await res.json()) as { data: UserProfileData };
      setData(payload.data);
      return payload.data;
    },
    [user]
  );

  const saveProfileInfo = useCallback(
    ({ name, phone }: { name: string; phone: string }) => {
      if (!user) return;
      updateUser({ name, phone });
      void callMutation("saveProfileInfo", { name, phone });
    },
    [user, updateUser, callMutation]
  );

  const addAddress = useCallback(
    async (payload: Omit<ProfileAddress, "id" | "isPrimary">) => {
      updateUser({ address: payload.line1 });
      const newData = await callMutation("addAddress", payload);
      if (newData && newData.addresses.length > 0) {
        // Return the newly created address (last one since it's added)
        return { success: true, address: newData.addresses[newData.addresses.length - 1] };
      }
      return { success: false, message: "Gagal menyimpan alamat." };
    },
    [updateUser, callMutation]
  );

  const updateAddress = useCallback(
    async (id: string, payload: Partial<Omit<ProfileAddress, "id">>) => {
      const res = await callMutation("updateAddress", { id, payload });
      return { success: !!res };
    },
    [callMutation]
  );

  const removeAddress = useCallback(
    async (id: string) => {
      const res = await callMutation("removeAddress", { id });
      return { success: !!res };
    },
    [callMutation]
  );

  const addPaymentMethod = useCallback(
    async (payload: { label: string; accountNumber: string; accountName: string }) => {
      updateUser({ paymentPreference: payload.label });
      const res = await callMutation("addPaymentMethod", payload);
      return { success: !!res };
    },
    [updateUser, callMutation]
  );

  const removePaymentMethod = useCallback(
    async (id: string) => {
      const res = await callMutation("removePaymentMethod", { id });
      return { success: !!res };
    },
    [callMutation]
  );

  const placeOrderFromCart = useCallback(
    ({ items, shipping, total }: { items: CartItem[]; shipping: number; total: number }) => {
      if (!user || items.length === 0) return null;
      const address = data.addresses[0];
      const paymentMethod = data.paymentMethods[0];
      if (!address || !paymentMethod) return null;
      void callMutation("createOrder", {
        items,
        shipping,
        total,
        addressId: address.id,
        paymentMethodId: paymentMethod.id,
        courier: "JNE Regular",
      });
      return {
        id: `NVR-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "processing" as const,
        total,
        shipping,
        items: [],
      };
    },
    [user, data.addresses, data.paymentMethods, callMutation]
  );

  const toggleWishlistItem = useCallback(
    (item: WishlistItem) => {
      void callMutation("toggleWishlistItem", { item });
    },
    [callMutation]
  );

  const removeWishlistItem = useCallback(
    (productId: string) => {
      void callMutation("removeWishlistItem", { productId });
    },
    [callMutation]
  );

  const isWishlisted = useCallback(
    (productId: string) => data.wishlist.some((item) => item.productId === productId),
    [data.wishlist]
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      void callMutation("markNotificationRead", { id });
    },
    [callMutation]
  );

  const submitCheckout = useCallback(
    async (payload: {
      items: CartItem[];
      shipping: number;
      total: number;
      addressId: string;
      paymentMethodId: string;
      courier: string;
      notes?: string;
      promoCode?: string;
    }) => {
      if (!user) return { success: false, message: "User belum login." };
      const next = await callMutation("createOrder", payload);
      if (!next) return { success: false, message: "Gagal membuat pesanan." };
      return { success: true, orderId: next.orders[0]?.id };
    },
    [user, callMutation]
  );

  const updatePassword = useCallback(
    ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: "Semua field password wajib diisi." };
      }
      if (newPassword.length < 8) {
        return { success: false, message: "Password baru minimal 8 karakter." };
      }
      if (newPassword !== confirmPassword) {
        return { success: false, message: "Konfirmasi password tidak cocok." };
      }
      return { success: true, message: "Password berhasil diperbarui." };
    },
    []
  );

  const value = useMemo<ProfileDataContextValue>(
    () => ({
      phone: data.phone,
      addresses: data.addresses,
      paymentMethods: data.paymentMethods,
      orders: data.orders,
      wishlist: data.wishlist,
      vouchers: data.vouchers,
      notifications: data.notifications,
      saveProfileInfo,
      addAddress,
      updateAddress,
      removeAddress,
      addPaymentMethod,
      removePaymentMethod,
      placeOrderFromCart,
      toggleWishlistItem,
      removeWishlistItem,
      isWishlisted,
      markNotificationRead,
      submitCheckout,
      refreshAccountData,
      updatePassword,
    }),
    [
      data,
      saveProfileInfo,
      addAddress,
      updateAddress,
      removeAddress,
      addPaymentMethod,
      removePaymentMethod,
      placeOrderFromCart,
      toggleWishlistItem,
      removeWishlistItem,
      isWishlisted,
      markNotificationRead,
      submitCheckout,
      refreshAccountData,
      updatePassword,
    ]
  );

  return <ProfileDataContext.Provider value={value}>{children}</ProfileDataContext.Provider>;
}

export function useProfileData(): ProfileDataContextValue {
  const ctx = useContext(ProfileDataContext);
  if (!ctx) {
    throw new Error("useProfileData must be used within a <ProfileDataProvider>");
  }
  return ctx;
}

