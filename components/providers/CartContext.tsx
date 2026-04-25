"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
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
const CART_STORAGE_KEY = "novure_cart_store_v1";

type CartStore = Record<string, CartItem[]>;

function loadCartStore(): CartStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CartStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartStore, setCartStore] = useState<CartStore>(loadCartStore);

  const cartKey = user?.id ?? "guest";

  const items = useMemo(() => cartStore[cartKey] ?? [], [cartStore, cartKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartStore));
  }, [cartStore]);

  const setActiveItems = useCallback(
    (updater: (current: CartItem[]) => CartItem[]) => {
      setCartStore((prev) => {
        const current = prev[cartKey] ?? [];
        return { ...prev, [cartKey]: updater(current) };
      });
    },
    [cartKey]
  );

  const addItem = (item: Omit<CartItem, "id">) => {
    setActiveItems((prev) => {
      const id = `${item.productId}-${item.size}-${item.color}`;
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeItem = (id: string) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setActiveItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setActiveItems(() => []);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
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
