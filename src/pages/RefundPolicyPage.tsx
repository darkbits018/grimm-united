import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

export default function RefundPolicyPage() {
  usePageMeta(
    'Refund & Return Policy — Grimm United',
    'Grimm United\'s refund and return policy for print-on-demand anime streetwear. Damaged or wrong items replaced within 3 days.'
  );
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
            <ShopNav />
            <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Refund & Return Policy</h1>
                        <p className="text-sm text-gray-400">Last updated: April 2026</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        At Grimm United, all products are made-to-order. Because each item is printed specifically for you, we have a limited return window. Please read this policy carefully before placing an order.
                    </p>

                    <Section title="Returns & Exchanges">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">We only accept returns in the following cases:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Wrong product delivered</li>
                            <li>Damaged or defective product received</li>
                        </ul>
                    </Section>

                    <Section title="Return Window">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>You must raise a return request within <span className="font-semibold text-white">3 days of delivery</span></li>
                            <li>Provide clear images of the issue along with your order ID</li>
                            <li>Email your request to{' '}
                                <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C] hover:underline">holygrimmmedia@gmail.com</a>
                            </li>
                        </ul>
                    </Section>

                    <Section title="Refund Process">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Once your return is approved, a refund will be processed to your original payment method</li>
                            <li>Refunds typically take <span className="font-semibold text-white">5–7 business days</span> to reflect</li>
                            <li>You will receive an email confirmation once the refund is initiated</li>
                        </ul>
                    </Section>

                    <Section title="Important Notes">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>No returns for size issues or change of mind</li>
                            <li>No exchanges unless the product is defective or incorrect</li>
                            <li>Items must be unused and in original condition to be eligible</li>
                            <li>Slight color variations due to screen differences or print process are not considered defects</li>
                        </ul>
                    </Section>

                    <Section title="Contact">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            To raise a return or refund request:{' '}
                            <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C] hover:underline">
                                holygrimmmedia@gmail.com
                            </a>
                        </p>
                    </Section>

                </div>
            </div>
            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
            <div>{children}</div>
        </div>
    );
}
