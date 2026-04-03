import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { SizeSelector } from '../components/shop/SizeSelector';
import { QuantityStepper } from '../components/shop/QuantityStepper';
import { PriceDisplay } from '../components/shop/PriceDisplay';
import { SizeGuideModal } from '../components/shop/SizeGuideModal';
import { ProductCard } from '../components/shop/ProductCard';
import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';
import type { Product, ProductVariant } from '../types/shop';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [added, setAdded] = useState(false);
  const [triedAdd, setTriedAdd] = useState(false);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

  // Active images/sizes come from selected color variant if available
  const activeImages = activeVariant?.images ?? product?.images ?? [];
  const activeSizes = activeVariant?.sizes ?? product?.sizes ?? [];
  const activeStock = activeVariant?.stock_per_size ?? product?.stock_per_size ?? {};

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedSize('');
    setImgIndex(0);
    fetch(`${API}/api/products/${id}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => {
        setProduct(data);
        // Set first variant as active if variants exist
        if (data.variants?.length > 0) setActiveVariant(data.variants[0]);
        // fetch related by category
        return fetch(`${API}/api/products?category=${encodeURIComponent(data.category)}`);
      })
      .then(r => r.json())
      .then(data => setRelated((Array.isArray(data) ? data : []).filter((p: Product) => p.id !== id).slice(0, 4)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    setTriedAdd(true);
    if (!selectedSize || !product) return;
    // Add with the active variant's product id so Qikink gets the right color_id
    const cartProduct = activeVariant
      ? { ...product, id: activeVariant.id, images: activeVariant.images, qikink_color_id: activeVariant.qikink_color_id }
      : product;
    add(cartProduct, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const sortedSizes = [...activeSizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

  // Dynamic meta — updates when product loads
  usePageMeta({
    title: product ? `${product.name} — Grimm United` : 'Product — Grimm United',
    description: product
      ? `Buy ${product.name} — anime-inspired streetwear. ${product.category} made-to-order. Free shipping across India. ₹${product.price}.`
      : 'Anime-inspired streetwear from Grimm United.',
    image: product ? (activeVariant?.images[0] ?? product.images[0]) : undefined,
    type: 'product',
    product: product ? {
      name: product.name,
      description: product.description,
      image: activeVariant?.images[0] ?? product.images[0],
      price: product.price,
      brand: 'Grimm United',
      availability: 'InStock',
    } : undefined,
  });

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-xl font-medium">Product not found</p>
        <Link to="/shop" className="mt-4 text-[#FF4B8C]">Back to Shop</Link>
      </div>
    </div>
  );

  const tabContent = {
    description: <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>,
    details: (
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li>• 100% Premium Cotton</li>
        <li>• Pre-shrunk fabric</li>
        <li>• Soft-touch print</li>
        <li>• Machine washable (cold)</li>
        <li>• Made in India</li>
      </ul>
    ),
    shipping: (
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li>• Standard delivery: 5–7 business days</li>
        <li>• Express delivery: 2–3 business days</li>
        <li>• Free shipping on orders above ₹999</li>
        <li>• Easy 7-day returns</li>
      </ul>
    ),
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF4B8C] mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden">
              <img src={activeImages[imgIndex] || activeImages[0]} alt={product.name} className="w-full h-full object-cover" />
              {activeImages.length > 1 && (
                <>
                  <button onClick={() => setImgIndex(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 rounded-full">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setImgIndex(i => Math.min(activeImages.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 rounded-full">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {activeImages.length > 1 && (
              <div className="flex gap-2">
                {activeImages.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${imgIndex === i ? 'border-[#FF4B8C]' : 'border-transparent'}`}>
                    <img src={img} alt={`${product.name} — view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
              <h1 className="text-2xl font-bold dark:text-white leading-tight">{product.name}</h1>
              <div className="mt-3">
                <PriceDisplay price={product.price} compareAt={product.compare_at_price} className="text-xl" />
              </div>
            </div>

            {/* Color picker */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <span className="text-sm font-semibold dark:text-white block mb-3">
                  Color: <span className="font-normal text-gray-500">{activeVariant?.color_name}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => {
                    const hex = ({
                      '2': '#1a1a1a', '3': '#1a2a4a', '9': '#2a4aaa', '25': '#6b1a1a',
                      '26': '#4a1a6b', '1': '#ffffff', '4': '#c0392b', '5': '#27ae60',
                      '6': '#e67e22', '7': '#f1c40f', '8': '#95a5a6',
                    } as Record<string, string>)[v.qikink_color_id] ?? '#888';
                    return (
                      <button
                        key={v.id}
                        onClick={() => { setActiveVariant(v); setImgIndex(0); setSelectedSize(''); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-all ${
                          activeVariant?.id === v.id
                            ? 'border-[#FF4B8C] bg-[#FF4B8C]/10 text-[#FF4B8C]'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#FF4B8C]/50'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: hex }} />
                        {v.color_name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold dark:text-white">Size</span>
                <button onClick={() => setSizeGuide(true)} className="flex items-center gap-1 text-xs text-[#FF4B8C] hover:underline">
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <SizeSelector sizes={sortedSizes} stockPerSize={activeStock} selected={selectedSize} onChange={setSelectedSize} />
              {triedAdd && !selectedSize && <p className="text-xs text-red-400 mt-2">Please select a size</p>}
            </div>

            <div>
              <span className="text-sm font-semibold dark:text-white block mb-3">Quantity</span>
              <QuantityStepper value={qty} onChange={setQty} max={selectedSize ? (product.stock_per_size[selectedSize] ?? 1) : 99} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${added ? 'bg-green-500 text-white' : 'bg-[#FF4B8C] text-white hover:bg-[#FF4B8C]/90'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="w-5 h-5" />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button onClick={() => toggle(product)} className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#FF4B8C] transition-colors">
                <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-[#FF4B8C] text-[#FF4B8C]' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                {(['description', 'details', 'shipping'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-[#FF4B8C] text-[#FF4B8C]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              {tabContent[activeTab]}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold dark:text-white mb-6">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}
      <Footer />
    </div>
  );
}
