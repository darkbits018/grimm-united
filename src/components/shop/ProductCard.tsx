import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Product } from '../../types/shop';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { PriceDisplay } from './PriceDisplay';

// Qikink color_id → hex approximation
const COLOR_HEX: Record<string, string> = {
  '2': '#1a1a1a',   // Black
  '3': '#1a2a4a',   // Navy Blue
  '9': '#2a4aaa',   // Royal Blue
  '25': '#6b1a1a',  // Maroon
  '26': '#4a1a6b',  // Purple
  '1': '#ffffff',   // White
  '4': '#c0392b',   // Red
  '5': '#27ae60',   // Green
  '6': '#e67e22',   // Orange
  '7': '#f1c40f',   // Yellow
  '8': '#95a5a6',   // Grey
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { add } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [activeVariant, setActiveVariant] = useState(product.variants?.[0] ?? null);
  const defaultSize = product.sizes[0];
  const displayImage = activeVariant?.image || product.images[0];

  return (
    <div className="group bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
      <Link to={`/shop/${activeVariant?.id ?? product.id}`} className="block relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs">No image</div>
        )}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="absolute top-3 left-3 bg-[#FF4B8C] text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
        <button
          onClick={e => { e.preventDefault(); toggle(product); }}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-[#2C2C2C] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
        >
          <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-[#FF4B8C] text-[#FF4B8C]' : 'text-gray-400'}`} />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/shop/${activeVariant?.id ?? product.id}`}>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-semibold text-[#2C2C2C] dark:text-white text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>
        </Link>

        {/* Color swatches */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {product.variants.map(v => (
              <button
                key={v.id}
                onClick={() => setActiveVariant(v)}
                title={v.color_name}
                aria-label={`Select color: ${v.color_name}`}
                style={{ backgroundColor: COLOR_HEX[v.qikink_color_id] ?? '#888' }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  activeVariant?.id === v.id
                    ? 'border-[#FF4B8C] scale-125 shadow-md'
                    : 'border-white dark:border-gray-700 hover:scale-110'
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <PriceDisplay price={product.price} compareAt={product.compare_at_price} />
          <button
            onClick={() => add({ ...product, id: activeVariant?.id ?? product.id }, defaultSize)}
            className="p-2 bg-[#FF4B8C] text-white rounded-xl hover:bg-[#FF4B8C]/90 transition-colors"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
