import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Tag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ShopNav } from '../components/shop/ShopNav';
import { PriceDisplay } from '../components/shop/PriceDisplay';
import type { ShippingAddress } from '../types/shop';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SHIPPING_THRESHOLD = 0; // free shipping always
const SHIPPING_COST = 0;

const emptyAddress: ShippingAddress = {
  name: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
};

declare global {
  interface Window { Razorpay: any; }
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [coupon, setCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discount + shipping;

  const set = (field: keyof ShippingAddress, val: string) =>
    setAddress(p => ({ ...p, [field]: val }));

  const applyCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const res = await fetch(`${API}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      if (!res.ok) {
        const err = await res.json();
        setCouponError(err.detail || 'Invalid coupon code');
      } else {
        const data = await res.json();
        setDiscount(data.discount_amount);
        setCoupon(couponInput);
      }
    } catch {
      setCouponError('Could not validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const validate = () => {
    const e: Partial<ShippingAddress> = {};
    if (!address.name) e.name = 'Required';
    if (!address.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) e.email = 'Valid email required';
    if (!address.phone || !/^\d{10}$/.test(address.phone)) e.phone = '10-digit phone required';
    if (!address.line1) e.line1 = 'Required';
    if (!address.city) e.city = 'Required';
    if (!address.state) e.state = 'Required';
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) e.pincode = '6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      // 1. Create order on backend
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product.id,
            product_name: i.product.name,
            size: i.size,
            quantity: i.quantity,
            unit_price: i.product.price,
            image: i.product.images[0] || null,
          })),
          shipping_address: address,
          subtotal,
          discount,
          shipping,
          total,
          coupon_code: coupon || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create order');
      const orderData = await res.json();

      // 2. If Razorpay is configured, open payment modal
      if (orderData.razorpay_order_id && orderData.key_id) {
        await loadRazorpayScript();
        await openRazorpay(orderData);
      } else {
        // No payment gateway configured — treat as COD / test mode
        clear();
        navigate(`/order-success?orderId=${orderData.order_id}&email=${address.email}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });

  const openRazorpay = (orderData: any) =>
    new Promise<void>((resolve, reject) => {
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Grimm United',
        description: 'Anime Streetwear',
        order_id: orderData.razorpay_order_id,
        prefill: { name: address.name, email: address.email, contact: address.phone },
        theme: { color: '#FF4B8C' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API}/api/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderData.order_id,
              }),
            });
            if (!verifyRes.ok) throw new Error('Payment verification failed');
            clear();
            navigate(`/order-success?orderId=${orderData.order_id}&email=${address.email}`);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        modal: { ondismiss: () => { setPlacing(false); resolve(); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    });

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-xl font-medium">Your cart is empty</p>
        <Link to="/shop" className="mt-4 text-[#FF4B8C]">Go to Shop</Link>
      </div>
    </div>
  );

  const Field = ({ label, field, type = 'text', placeholder = '' }: {
    label: string; field: keyof ShippingAddress; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        value={address[field] as string}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#2C2C2C] dark:text-white outline-none focus:ring-2 focus:ring-[#FF4B8C] transition-all ${errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
      />
      {errors[field] && <p className="text-xs text-red-400 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212]">
      <ShopNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF4B8C] mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold dark:text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" field="name" />
                <Field label="Email" field="email" type="email" />
                <Field label="Phone" field="phone" type="tel" placeholder="10-digit number" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold dark:text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Field label="Address Line 1" field="line1" /></div>
                <div className="sm:col-span-2"><Field label="Address Line 2 (optional)" field="line2" /></div>
                <Field label="City" field="city" />
                <Field label="State" field="state" />
                <Field label="Pincode" field="pincode" placeholder="6-digit pincode" />
                <Field label="Country" field="country" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold dark:text-white mb-1">Payment</h2>
              <p className="text-sm text-gray-400">Secure payment via Razorpay — UPI, cards, net banking & more.</p>
              <div className="mt-4 flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-6 h-6" />
                <span className="text-sm text-gray-600 dark:text-gray-300">You'll be redirected to Razorpay to complete payment</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-bold dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="relative">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Size: {item.size}</p>
                    </div>
                    <PriceDisplay price={item.product.price * item.quantity} className="text-sm shrink-0" />
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-2 rounded-xl text-sm">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {coupon} applied</span>
                    <button onClick={() => { setCoupon(''); setDiscount(0); setCouponInput(''); }}><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C]"
                    />
                    <button onClick={applyCoupon} disabled={couponLoading} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex justify-between dark:text-gray-300"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between font-bold text-base dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
                  <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-[#FF4B8C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF4B8C]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
