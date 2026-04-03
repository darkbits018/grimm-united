import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

export default function CancellationPolicyPage() {
  usePageMeta(
    'Cancellation Policy — Grimm United',
    'All Grimm United orders are made-to-order and cannot be cancelled once placed. Read our full cancellation policy.'
  );
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
            <ShopNav />
            <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Cancellation Policy</h1>
                        <p className="text-sm text-gray-400">Last updated: April 2026</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        At Grimm United, all products are made-to-order. Production begins immediately after an order is placed, which means we are unable to accommodate cancellations.
                    </p>

                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                        <li>Orders cannot be cancelled once placed</li>
                        <li>No modifications to size, color, or address are possible after order confirmation</li>
                        <li>Please double-check your order details before completing payment</li>
                    </ul>

                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        If you believe there is an error with your order, contact us immediately at{' '}
                        <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C] hover:underline">
                            holygrimmmedia@gmail.com
                        </a>{' '}
                        and we will do our best to help before production begins.
                    </p>

                </div>
            </div>
            <Footer />
        </div>
    );
}
