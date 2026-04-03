import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

export default function PrivacyPolicyPage() {
  usePageMeta(
    'Privacy Policy — Grimm United',
    'Learn how Grimm United collects, uses, and protects your personal data when you shop with us.'
  );
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
            <ShopNav />
            <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Privacy Policy</h1>
                        <p className="text-sm text-gray-400">Last updated: April 2026</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Grimm United ("we", "our", "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
                    </p>

                    <Section title="Information We Collect">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">We may collect:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Name, email address, phone number</li>
                            <li>Shipping and billing address</li>
                            <li>Payment details (processed securely via Razorpay — we do not store card details)</li>
                            <li>Order details and preferences</li>
                        </ul>
                    </Section>

                    <Section title="How We Use Your Information">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">We use your data to:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Process and deliver your orders</li>
                            <li>Communicate order updates</li>
                            <li>Improve our website and services</li>
                            <li>Send updates or offers (only if you opt-in)</li>
                        </ul>
                    </Section>

                    <Section title="Data Sharing">
                        <p className="text-gray-600 dark:text-gray-400 mb-3">We may share your data with:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Payment gateways (Razorpay)</li>
                            <li>Shipping partners via Qikink (Delhivery, Bluedart, etc.)</li>
                            <li>Service providers required to fulfill your order</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                            We do not sell your personal data to third parties.
                        </p>
                    </Section>

                    <Section title="Data Security">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            We take reasonable measures to protect your data. However, no method of transmission over the internet is 100% secure. We use HTTPS encryption and do not store sensitive payment information on our servers.
                        </p>
                    </Section>

                    <Section title="Cookies">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            We may use cookies to improve your browsing experience, remember your preferences, and keep your cart intact. You can disable cookies in your browser settings, though some features may not work correctly.
                        </p>
                    </Section>

                    <Section title="Your Rights">
                        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">You can contact us to:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Access or update your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </Section>

                    <Section title="Contact">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            For any privacy-related queries, reach us at:{' '}
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
