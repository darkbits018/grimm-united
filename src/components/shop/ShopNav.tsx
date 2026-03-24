import { useState } from 'react';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ThemeToggle } from '../ThemeToggle';
import { CartDrawer } from './CartDrawer';

export function ShopNav() {
  const { count } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-[#FF4B8C] font-noto">Grimm United</Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-300 hover:text-[#FF4B8C]'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 transition-all" />
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Heart className="w-5 h-5 dark:text-gray-300" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4B8C] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishlistItems.length}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <ShoppingBag className="w-5 h-5 dark:text-gray-300" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4B8C] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{count}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5 dark:text-gray-300" /> : <Menu className="w-5 h-5 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
