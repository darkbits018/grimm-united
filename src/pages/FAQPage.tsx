import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

const FAQS = [
  {
    q: 'When will my order ship?',
    a: 'Orders are processed and shipped within 5–7 business days. You will receive tracking details via email once dispatched.',
  },
  {
    q: 'Can I return my order?',
    a: 'We only accept returns if the product is damaged or incorrect. No returns for size preference or change of mind.',
  },
  {
    q: 'Do you offer exchanges?',
    a: 'Exchanges are only available for defective or wrong items. Raise a request within 3 days of delivery with photos.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'No, we currently accept prepaid orders only via Razorpay (UPI, cards, net banking).',
  },
  {
    q: 'How do I track my order?',
    a: 'Tracking details will be shared via email once your order ships. You can also track at grimmunited.com/orders using your order ID.',
  },
  {
    q: 'Are the products ready-made?',
    a: 'No, all products are made-to-order (print-on-demand). Each item is printed specifically for you after you place an order.',
  },
  {
    q: 'My payment failed but money was deducted. What do I do?',
    a: 'This is usually a temporary bank hold that auto-reverses within 5–7 business days. If it doesn\'t, email us at holygrimmmedia@gmail.com with your transaction ID.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders cannot be cancelled once placed as production begins immediately. Please review your order carefully before payment.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Not currently. We ship within India only.',
  },
];

export default function FAQPage() {
  usePageMeta(
    'FAQ — Grimm United',
    'Answers to common questions about shipping, returns, payments, and order tracking at Grimm United.'
  );
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
      <ShopNav />
      <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Everything you need to know about ordering from Grimm United.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-sm dark:text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Still have questions?</p>
          <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C] font-semibold text-sm hover:underline">
            holygrimmmedia@gmail.com
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
