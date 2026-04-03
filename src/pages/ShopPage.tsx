import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ShoppingBag, Bell } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { ShopNav } from '../components/shop/ShopNav';
import { categories } from '../data/products';
import Footer from '../components/Footer';
import type { Product } from '../types/shop';
import { usePageMeta } from '../components/hooks/usePageMeta';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SHOP_LIVE = true;

export default function ShopPage() {
  usePageMeta(
    'Shop — Grimm United',
    'Shop anime-inspired streetwear from Grimm United. Premium print-on-demand T-shirts and hoodies. Free shipping across India.'
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDone, setNotifyDone] = useState(false);

  useEffect(() => {
    if (!SHOP_LIVE) return;
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(data => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allProducts.filter(p => p.is_active);
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.includes(search.toLowerCase()))
    );
    list = list.filter(p => p.price <= maxPrice);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allProducts, search, category, sort, maxPrice]);

  if (!SHOP_LIVE) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
        <ShopNav />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 p-5 bg-[#FF4B8C]/10 rounded-full">
            <ShoppingBag className="w-12 h-12 text-[#FF4B8C]" />
          </div>
          <h1 className="text-4xl font-bold dark:text-white mb-3 font-noto">Shop Coming Soon</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
            We're putting the finishing touches on something great. Drop your email and we'll let you know the moment we go live.
          </p>
          {notifyDone ? (
            <p className="text-green-500 font-medium text-sm">You're on the list. We'll reach out soon.</p>
          ) : (
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!notifyEmail.trim()) return;
                try {
                  await fetch(`${API}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Shop Notify', email: notifyEmail, message: 'Notify me when shop launches.' }),
                  });
                } catch { /* silent */ }
                setNotifyDone(true);
              }}
              className="flex gap-2 w-full max-w-sm"
            >
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={e => setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white text-sm focus:ring-2 focus:ring-[#FF4B8C] outline-none"
              />
              <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-[#FF4B8C] text-white text-sm font-semibold rounded-xl hover:bg-[#FF4B8C]/90 transition-colors">
                <Bell className="w-4 h-4" /> Notify Me
              </button>
            </form>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white font-noto">Shop</h1>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} products</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white text-sm focus:ring-2 focus:ring-[#FF4B8C] outline-none"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white text-sm focus:ring-2 focus:ring-[#FF4B8C] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button onClick={() => setFiltersOpen(v => !v)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white text-sm md:hidden">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {(category !== 'All' || search || maxPrice < 5000) && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-gray-400 self-center">Active filters:</span>
            {category !== 'All' && (
              <button onClick={() => setCategory('All')} className="flex items-center gap-1 px-3 py-1 bg-[#FF4B8C]/10 text-[#FF4B8C] text-xs rounded-full font-medium hover:bg-[#FF4B8C]/20 transition-colors">
                {category} <X className="w-3 h-3" />
              </button>
            )}
            {search && (
              <button onClick={() => setSearch('')} className="flex items-center gap-1 px-3 py-1 bg-[#FF4B8C]/10 text-[#FF4B8C] text-xs rounded-full font-medium hover:bg-[#FF4B8C]/20 transition-colors">
                "{search}" <X className="w-3 h-3" />
              </button>
            )}
            {maxPrice < 5000 && (
              <button onClick={() => setMaxPrice(5000)} className="flex items-center gap-1 px-3 py-1 bg-[#FF4B8C]/10 text-[#FF4B8C] text-xs rounded-full font-medium hover:bg-[#FF4B8C]/20 transition-colors">
                Max ₹{maxPrice.toLocaleString('en-IN')} <X className="w-3 h-3" />
              </button>
            )}
            <button onClick={() => { setSearch(''); setCategory('All'); setMaxPrice(5000); }} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          <aside className={`w-56 shrink-0 space-y-6 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-sm dark:text-white mb-3">Category</h3>
              <div className="space-y-1">
                {categories.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${category === c ? 'bg-[#FF4B8C]/10 text-[#FF4B8C] font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-sm dark:text-white mb-3">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</h3>
              <input type="range" min={299} max={5000} step={100} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-[#FF4B8C]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹299</span><span>₹5,000</span></div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search className="w-12 h-12 mb-3" />
                <p className="font-medium">No products found</p>
                <button onClick={() => { setSearch(''); setCategory('All'); setMaxPrice(5000); }} className="mt-3 text-[#FF4B8C] text-sm">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
