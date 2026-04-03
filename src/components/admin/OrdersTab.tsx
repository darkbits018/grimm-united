import { useState, useEffect, useCallback } from 'react';
import { X, Package, MapPin, User, ChevronDown, RefreshCw, Download } from 'lucide-react';
import { OrderStatusBadge } from '../shop/OrderStatusBadge';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN = 'grimm_admin_secret';
const HEADERS = { 'Content-Type': 'application/json', 'x-admin-token': TOKEN };

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem { product_name: string; size: string; quantity: number; unit_price: number; image?: string; }
interface Order {
  id: string; customer_name: string; customer_email: string; phone?: string;
  shipping_address: { line1: string; line2?: string; city: string; state: string; pincode: string; country: string; };
  items: OrderItem[]; subtotal: number; discount: number; shipping: number; total: number;
  status: OrderStatus; created_at: string; coupon_code?: string;
}

const ALL_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all'
        ? `${API}/api/admin/orders`
        : `${API}/api/admin/orders?status=${filterStatus}`;
      const res = await fetch(url, { headers: HEADERS });
      const data = await res.json();
      setOrders(data);
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders, filterStatus]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await fetch(`${API}/api/admin/orders/${id}/status`, {
        method: 'PUT', headers: HEADERS,
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Orders</h2>
          <p className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C]"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <a
            href={`${API}/api/admin/orders/qikink-failed-csv`}
            download="qikink_bulk_upload.csv"
            onClick={e => { const url = new URL(`${API}/api/admin/orders/qikink-failed-csv`); url.searchParams.set('x_admin_token', TOKEN); (e.currentTarget as HTMLAnchorElement).href = url.toString(); }}
            className="flex items-center gap-2 border border-orange-400 text-orange-400 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-orange-400/5 transition-colors"
            title="Download CSV for failed Qikink pushes"
          >
            <Download className="w-4 h-4" /> Failed Orders CSV
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map(order => (
                  <tr key={order.id} onClick={() => setSelected(order)} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <td className="px-5 py-4 font-mono text-sm font-semibold text-[#FF4B8C]">{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium dark:text-gray-200">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-4 text-sm font-semibold dark:text-gray-200">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#1E1E1E] z-10">
              <div>
                <h3 className="font-bold text-lg dark:text-white font-mono">{selected.id}</h3>
                <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#FF4B8C] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold dark:text-white">{selected.customer_name}</p>
                  <p className="text-xs text-gray-400">{selected.customer_email}</p>
                  {selected.phone && <p className="text-xs text-gray-400">{selected.phone}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF4B8C] mt-0.5 shrink-0" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{selected.shipping_address.line1}</p>
                  {selected.shipping_address.line2 && <p>{selected.shipping_address.line2}</p>}
                  <p>{selected.shipping_address.city}, {selected.shipping_address.state} {selected.shipping_address.pincode}</p>
                  <p>{selected.shipping_address.country}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1"><Package className="w-3 h-3" /> Items</p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-gray-200">{item.product_name}</p>
                        <p className="text-xs text-gray-400">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#FF4B8C] text-sm">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span>₹{selected.subtotal.toLocaleString('en-IN')}</span></div>
                {selected.discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-₹{selected.discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Shipping</span><span>{selected.shipping === 0 ? 'Free' : `₹${selected.shipping}`}</span></div>
                <div className="flex justify-between font-bold dark:text-white text-base border-t border-gray-100 dark:border-gray-800 pt-2 mt-1"><span>Total</span><span>₹{selected.total.toLocaleString('en-IN')}</span></div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">Update Status</p>
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value as OrderStatus)}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2C2C2C] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C] appearance-none disabled:opacity-60"
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {selected.status === 'shipped' && <p className="text-xs text-gray-400 mt-1">Shipping confirmation email will be sent to customer.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
