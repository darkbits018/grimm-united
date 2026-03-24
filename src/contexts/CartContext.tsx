import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types/shop';

interface CartContextType {
  items: CartItem[];
  add: (product: Product, size: string, qty?: number) => void;
  remove: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('gu_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('gu_cart', JSON.stringify(items));
  }, [items]);

  const add = (product: Product, size: string, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, size, quantity: qty }];
    });
  };

  const remove = (productId: string, size: string) =>
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));

  const updateQty = (productId: string, size: string, qty: number) => {
    if (qty < 1) return remove(productId, size);
    setItems(prev => prev.map(i => i.product.id === productId && i.size === size ? { ...i, quantity: qty } : i));
  };

  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
