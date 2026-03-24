import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/shop/ProductCard';
import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold dark:text-white mb-2">Wishlist</h1>
        <p className="text-gray-500 text-sm mb-8">{items.length} item{items.length !== 1 ? 's' : ''}</p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Heart className="w-12 h-12 mb-3" />
            <p className="font-medium">Your wishlist is empty</p>
            <Link to="/shop" className="mt-4 text-[#FF4B8C] text-sm font-medium">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
