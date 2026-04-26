"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../components/catalogue/types";

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  productVariantId: string;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let mounted = true;
    const initCart = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/cart");
        if (res.ok && mounted) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    initCart();
    return () => { mounted = false; };
  }, []);

  const addToCart = async (product: Product, variantId: string, quantity = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, variantId, quantity }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");
      
      setItems(data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");
      
      setItems(data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update quantity");
      
      setItems(data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearError = () => setError(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
        isLoading,
        error,
        clearError
      }}
    >
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
