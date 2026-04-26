import React from 'react';
import { useCart } from '@/context/CartContext';

export function withCart<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithCartComponent(props: Omit<P, 'cart'>) {
    const cart = useCart();
    return <WrappedComponent {...(props as P)} cart={cart} />;
  };
}
