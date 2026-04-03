import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Package, Truck, Home, ShoppingBag, MapPin, User, Search } from 'lucide-react';
import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STATUSES = [
  { key: 'pending',   label: 'Order Placed',        icon: ShoppingBag, desc: 'Your order has been received' },
  { key: 'paid',      label: 'Payment Confirmed',    icon: CheckCircle, desc: 'Payment successfully processed' },
  { key: 'shipped',   label: 'Shipped',              icon: Truck,       desc: 'Your order is on its way' },
  { key: 'delivered', label: 'Delivered',            icon: Home,        desc: 'Order delivered successfully' },
];

interface OrderItem { product_name: string; size: string; quantity: number; unit_price: number; image?: string; }
interface OrderData {
  id: string; status: string; customer_name: string; customer_email: string;
  shipping_address: { line1: string; line2?: string; city: string; state: string; pincode: string; country: string; };
  items: OrderItem[]; subtotal: number; discount: number; shipping: number; total: number;
  created_at: string;
}

export default function OrderTrackingPage() {
  usePageMeta('Track Your Order — Grimm United', 'Track your Grimm United order status in real time. Enter your order ID to get live updates.');
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const fetchOrder = useCallback((orderId: string) => {
    setLoading(true);
    setError('');
    fetch(`${API}/api/orders/${orderId}`)
      .then(r => { if (!r.ok) throw new Error('Order not found'); return r.json(); })
      .then(data => {
        // Verify email matches if provided
        if (searchEmail && data.customer_email.toLowerCase() !== searchEmail.toLowerCase()) {
          throw new Error('Order not found');
        }
        setOrder(data);
      })
      .catch(e => { setError(e.message); setOrder(null); })
      .finally(() => setLoading(false));
  }, [searchEmail]);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/orders/${searchId.trim().toUpperCase()}`);
  };

  const currentIndex = order ? STATUSES.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
      <ShopNav />
      <div className="max-w-2xl mx-auto px-4 py-12 w-full flex-1">

        {/* Search form — shown when no order loaded yet */}
        {!order && (
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-[#FF4B8C]" />
              <h1 className="text-xl font-bold dark:text-white">Track Your Order</h1>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Order ID</label>
                <input
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  placeholder="e.g. GU-1234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder="Email used at checkout"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C]"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF4B8C] text-white rounded-xl font-semibold hover:bg-[#FF4B8C]/90 transition-colors disabled:opacity-60">
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
        )}

        {loading && !order && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {order && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-6 h-6 text-[#FF4B8C]" />
                <div>
                  <h1 className="text-xl font-bold dark:text-white">Track Order</h1>
                  <p className="text-sm text-gray-400 font-mono">{order.id}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {STATUSES.map((step, i) => {
                  const done = i <= currentIndex;
                  const active = i === currentIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-[#FF4B8C] border-[#FF4B8C]' : 'bg-white dark:bg-[#2C2C2C] border-gray-200 dark:border-gray-700'}`}>
                          {done ? <Icon className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-gray-300" />}
                        </div>
                        {i < STATUSES.length - 1 && (
                          <div className={`w-0.5 h-12 ${i < currentIndex ? 'bg-[#FF4B8C]' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </div>
                      <div className="pb-8 pt-1.5">
                        <p className={`font-semibold text-sm ${done ? 'dark:text-white' : 'text-gray-400'} ${active ? 'text-[#FF4B8C]' : ''}`}>{step.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-1">
                <Package className="w-3 h-3" /> Items
              </p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.product_name} className="w-12 h-12 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Size: {item.size} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#FF4B8C]">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-₹{order.discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
                <div className="flex justify-between font-bold dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2 mt-1"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <User className="w-4 h-4 text-[#FF4B8C] mt-0.5" />
                <p className="text-sm font-semibold dark:text-white">{order.customer_name}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF4B8C] mt-0.5 shrink-0" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C]">holygrimmmedia@gmail.com</a>
              </p>
              <button onClick={() => { setOrder(null); setError(''); setSearchId(''); }} className="text-xs text-gray-400 hover:text-[#FF4B8C] transition-colors">
                Track another order
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
