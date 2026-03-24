import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';
import { ShopNav } from '../components/shop/ShopNav';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || 'GU-XXXXXX';
  const email = params.get('email') || 'your email';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-10 border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold dark:text-white mb-2">Order Placed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Order ID: <span className="font-mono font-semibold text-[#FF4B8C]">{orderId}</span></p>
          <p className="text-sm text-gray-400 mb-8">A confirmation has been sent to <span className="font-medium">{email}</span></p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm dark:text-gray-300">
              <Package className="w-4 h-4 text-[#FF4B8C] shrink-0" />
              <span>Estimated delivery: <strong>5–7 business days</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm dark:text-gray-300">
              <CheckCircle className="w-4 h-4 text-[#FF4B8C] shrink-0" />
              <span>You'll receive tracking info once shipped</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/orders/${orderId}`} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#FF4B8C] text-[#FF4B8C] font-semibold hover:bg-[#FF4B8C]/5 transition-colors text-sm">
              <Package className="w-4 h-4" /> Track Order
            </Link>
            <Link to="/shop" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF4B8C] text-white font-semibold hover:bg-[#FF4B8C]/90 transition-colors text-sm">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
