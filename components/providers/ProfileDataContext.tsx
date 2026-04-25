"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/providers/AuthContext";
import type { SessionUser } from "@/lib/mock-users";
import type { CartItem } from "@/components/providers/CartContext";

export type ProfileOrderStatus = "processing" | "shipped" | "delivered";

export interface ProfileAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  isPrimary: boolean;
}

export interface ProfilePaymentMethod {
  id: string;
  label: string;
  details: string;
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
}

interface UserProfileData {
  phone: string;
  addresses: ProfileAddress[];
  paymentMethods: ProfilePaymentMethod[];
  orders: ProfileOrder[];
}

interface ProfileDataContextValue {
  phone: string;
  addresses: ProfileAddress[];
  paymentMethods: ProfilePaymentMethod[];
  orders: ProfileOrder[];
  saveProfileInfo: (payload: { name: string; phone: string }) => void;
  addAddress: (payload: Omit<ProfileAddress, "id" | "isPrimary">) => void;
  updateAddress: (id: string, payload: Partial<Omit<ProfileAddress, "id">>) => void;
  removeAddress: (id: string) => void;
  addPaymentMethod: (payload: Omit<ProfilePaymentMethod, "id" | "isPrimary">) => void;
  removePaymentMethod: (id: string) => void;
  placeOrderFromCart: (payload: {
    items: CartItem[];
    shipping: number;
    total: number;
  }) => ProfileOrder | null;
  updatePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => { success: boolean; message: string };
}

const PROFILE_STORAGE_KEY = "novure_profile_data_v1";

type ProfileStore = Record<string, UserProfileData>;

const ProfileDataContext = createContext<ProfileDataContextValue | null>(null);

function loadStore(): ProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProfileStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function createDefaultAddress(user: SessionUser): ProfileAddress[] {
  if (!user.address) return [];
  return [
    {
      id: `addr-${user.id}-default`,
      label: "Rumah (Utama)",
      recipient: user.name,
      phone: user.phone ?? "",
      line1: user.address,
      isPrimary: true,
    },
  ];
}

function createDefaultPayment(user: SessionUser): ProfilePaymentMethod[] {
  if (!user.paymentPreference) return [];
  return [
    {
      id: `pay-${user.id}-default`,
      label: user.paymentPreference,
      details: "Metode utama",
      isPrimary: true,
    },
  ];
}

function ensurePrimaryAddress(addresses: ProfileAddress[]): ProfileAddress[] {
  if (addresses.length === 0) return addresses;
  if (addresses.some((a) => a.isPrimary)) return addresses;
  return addresses.map((a, idx) => (idx === 0 ? { ...a, isPrimary: true } : a));
}

function ensurePrimaryPayment(
  paymentMethods: ProfilePaymentMethod[]
): ProfilePaymentMethod[] {
  if (paymentMethods.length === 0) return paymentMethods;
  if (paymentMethods.some((m) => m.isPrimary)) return paymentMethods;
  return paymentMethods.map((m, idx) =>
    idx === 0 ? { ...m, isPrimary: true } : m
  );
}

function ensureUserData(
  user: SessionUser | null,
  data: UserProfileData | undefined
): UserProfileData {
  if (!user) {
    return {
      phone: "",
      addresses: [],
      paymentMethods: [],
      orders: [],
    };
  }

  const addresses = ensurePrimaryAddress(
    data?.addresses?.length ? data.addresses : createDefaultAddress(user)
  );
  const paymentMethods = ensurePrimaryPayment(
    data?.paymentMethods?.length
      ? data.paymentMethods
      : createDefaultPayment(user)
  );

  return {
    phone: data?.phone ?? user.phone ?? "",
    addresses,
    paymentMethods,
    orders: data?.orders ?? [],
  };
}

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ProfileDataProvider({ children }: { children: ReactNode }) {
  const { user, updateProfile } = useAuth();
  const [store, setStore] = useState<ProfileStore>(loadStore);

  const userKey = user?.id ?? "guest";

  const userData = useMemo(
    () => ensureUserData(user, store[userKey]),
    [store, user, userKey]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const mutateUserData = useCallback(
    (mutator: (current: UserProfileData) => UserProfileData) => {
      if (!user) return;
      setStore((prev) => {
        const current = ensureUserData(user, prev[userKey]);
        return { ...prev, [userKey]: mutator(current) };
      });
    },
    [user, userKey]
  );

  const saveProfileInfo = useCallback(
    ({ name, phone }: { name: string; phone: string }) => {
      if (!user) return;
      updateProfile({ name, phone });
      mutateUserData((current) => ({ ...current, phone }));
    },
    [user, updateProfile, mutateUserData]
  );

  const addAddress = useCallback(
    (payload: Omit<ProfileAddress, "id" | "isPrimary">) => {
      mutateUserData((current) => {
        const nextAddresses = [
          ...current.addresses.map((a) => ({ ...a, isPrimary: false })),
          { ...payload, id: randomId("addr"), isPrimary: true },
        ];
        return { ...current, addresses: nextAddresses };
      });
    },
    [mutateUserData]
  );

  const updateAddress = useCallback(
    (id: string, payload: Partial<Omit<ProfileAddress, "id">>) => {
      mutateUserData((current) => {
        let next = current.addresses.map((a) =>
          a.id === id ? { ...a, ...payload } : a
        );

        if (payload.isPrimary) {
          next = next.map((a) => ({ ...a, isPrimary: a.id === id }));
        }

        return { ...current, addresses: ensurePrimaryAddress(next) };
      });
    },
    [mutateUserData]
  );

  const removeAddress = useCallback(
    (id: string) => {
      mutateUserData((current) => {
        const remaining = current.addresses.filter((a) => a.id !== id);
        return { ...current, addresses: ensurePrimaryAddress(remaining) };
      });
    },
    [mutateUserData]
  );

  const addPaymentMethod = useCallback(
    (payload: Omit<ProfilePaymentMethod, "id" | "isPrimary">) => {
      mutateUserData((current) => {
        const nextMethods = [
          ...current.paymentMethods.map((m) => ({ ...m, isPrimary: false })),
          { ...payload, id: randomId("pay"), isPrimary: true },
        ];

        updateProfile({ paymentPreference: payload.label });
        return { ...current, paymentMethods: nextMethods };
      });
    },
    [mutateUserData, updateProfile]
  );

  const removePaymentMethod = useCallback(
    (id: string) => {
      mutateUserData((current) => {
        const remaining = ensurePrimaryPayment(
          current.paymentMethods.filter((m) => m.id !== id)
        );
        updateProfile({ paymentPreference: remaining[0]?.label });
        return { ...current, paymentMethods: remaining };
      });
    },
    [mutateUserData, updateProfile]
  );

  const placeOrderFromCart = useCallback(
    ({
      items,
      shipping,
      total,
    }: {
      items: CartItem[];
      shipping: number;
      total: number;
    }): ProfileOrder | null => {
      if (!user || items.length === 0) return null;

      const order: ProfileOrder = {
        id: `NVR-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: "processing",
        shipping,
        total,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.price,
          imageUrl: item.imageUrl,
        })),
      };

      mutateUserData((current) => ({
        ...current,
        orders: [order, ...current.orders],
      }));

      return order;
    },
    [user, mutateUserData]
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
        return {
          success: false,
          message: "Password baru minimal 8 karakter.",
        };
      }

      if (newPassword !== confirmPassword) {
        return {
          success: false,
          message: "Konfirmasi password tidak cocok.",
        };
      }

      return {
        success: true,
        message: "Password berhasil diperbarui.",
      };
    },
    []
  );

  const value: ProfileDataContextValue = {
    phone: userData.phone,
    addresses: userData.addresses,
    paymentMethods: userData.paymentMethods,
    orders: userData.orders,
    saveProfileInfo,
    addAddress,
    updateAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
    placeOrderFromCart,
    updatePassword,
  };

  return (
    <ProfileDataContext.Provider value={value}>
      {children}
    </ProfileDataContext.Provider>
  );
}

export function useProfileData(): ProfileDataContextValue {
  const ctx = useContext(ProfileDataContext);
  if (!ctx) {
    throw new Error("useProfileData must be used within a <ProfileDataProvider>");
  }
  return ctx;
}
