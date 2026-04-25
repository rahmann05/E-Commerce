"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string; // unique cart item id (productId + size + color)
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartStorageKey(userId: string | undefined): string | null {
  if (!userId) return null;
  return `novure_cart_${userId}`;
}

function readStoredItems(userId: string | undefined): CartItem[] {
  if (typeof window === "undefined") return [];
  const storageKey = getCartStorageKey(userId);
  if (!storageKey) return [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartByUser, setCartByUser] = useState<Record<string, CartItem[]>>({});
  const userId = user?.id;
  const storageKey = useMemo(() => getCartStorageKey(userId), [userId]);
  const items = userId
    ? (cartByUser[userId] ?? readStoredItems(userId))
    : [];

  const setItemsForUser = (nextItems: CartItem[]) => {
    if (!userId) return;
    setCartByUser((prev) => ({ ...prev, [userId]: nextItems }));
    if (typeof window !== "undefined" && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(nextItems));
    }
  };

  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.size}-${item.color}`;
    const existing = items.find((i) => i.id === id);
    const nextItems = existing
      ? items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      : [...items, { ...item, id }];
    setItemsForUser(nextItems);
  };

  const removeItem = (id: string) => {
    setItemsForUser(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItemsForUser(
      items.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    if (!userId) return;
    setItemsForUser([]);
  };

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
