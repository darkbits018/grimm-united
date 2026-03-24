import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { PriceDisplay } from './PriceDisplay';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, remove, updateQty, subtotal, count } = useCart();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1E1E1E] z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF4B8C]" /> Cart ({count})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
            <ShoppingBag className="w-12 h-12" />
            <p>Your cart is empty</p>
            <button onClick={onClose} className="text-[#FF4B8C] text-sm font-medium">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm dark:text-white line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={qty => updateQty(item.product.id, item.size, qty)}
                        max={item.product.stock_per_size[item.size] ?? 99}
                      />
                      <button onClick={() => remove(item.product.id, item.size)} className="text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <PriceDisplay price={item.product.price * item.quantity} className="text-sm shrink-0" />
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-[#FF4B8C] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#FF4B8C]/90 transition-colors"
              >
                Checkout
              </Link>
              <button onClick={onClose} className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
