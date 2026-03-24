import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/shop';

interface WishlistContextType {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem('gu_wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('gu_wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (product: Product) =>
    setItems(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);

  const isWishlisted = (id: string) => items.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
