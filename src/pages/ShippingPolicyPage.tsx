import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

export default function ShippingPolicyPage() {
  usePageMeta(
    'Shipping Policy — Grimm United',
    'Free shipping across India. Orders dispatched within 5–7 business days. Track your order anytime.'
  );
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
            <ShopNav />
            <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Shipping Policy</h1>
                        <p className="text-sm text-gray-400">Last updated: April 2026</p>
                    </div>

                    <Section title="Shipping Coverage">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>We currently ship only within India</li>
                            <li>International shipping is not available at this time</li>
                        </ul>
                    </Section>

                    <Section title="Delivery Time">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Orders are processed and shipped within <span className="font-semibold text-white">5–7 business days</span></li>
                            <li>Delivery timelines may vary based on your location</li>
                            <li>Remote areas may take additional 2–3 days</li>
                        </ul>
                    </Section>

                    <Section title="Shipping Charges">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Free shipping across India on all orders</li>
                        </ul>
                    </Section>

                    <Section title="Tracking">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Tracking details will be shared via email once your order is shipped</li>
                            <li>You can also track your order at{' '}
                                <a href="/orders" className="text-[#FF4B8C] hover:underline">grimmunited.com/orders</a>
                            </li>
                            <li>Shipping is handled via Qikink's courier partners (Bluedart, Delhivery, etc.)</li>
                        </ul>
                    </Section>

                    <Section title="Delays">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Delays may occur due to high demand, logistics issues, or unforeseen circumstances</li>
                            <li>We are not responsible for delays caused by courier partners</li>
                            <li>In case of significant delays, please contact us at{' '}
                                <a href="mailto:holygrimmmedia@gmail.com" className="text-[#FF4B8C] hover:underline">holygrimmmedia@gmail.com</a>
                            </li>
                        </ul>
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
