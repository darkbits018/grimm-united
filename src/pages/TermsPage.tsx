import { ShopNav } from '../components/shop/ShopNav';
import Footer from '../components/Footer';
import { usePageMeta } from '../components/hooks/usePageMeta';

export default function TermsPage() {
  usePageMeta(
    'Terms & Conditions — Grimm United',
    'Read the terms and conditions governing your use of the Grimm United website and purchases.'
  );
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
            <ShopNav />
            <div className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Terms & Conditions</h1>
                        <p className="text-sm text-gray-400">Last updated: April 2026</p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Welcome to Grimm United. By using this website, you agree to the following terms. Please read them carefully before making a purchase.
                    </p>

                    <Section title="General">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>You must be at least 18 years old or use the site under parental supervision</li>
                            <li>All content — designs, logos, branding — belongs to Grimm United</li>
                            <li>Unauthorized reproduction or use of our content is prohibited</li>
                        </ul>
                    </Section>

                    <Section title="Products">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>All products are made-to-order (print-on-demand)</li>
                            <li>Slight variations in color or print may occur due to the nature of the printing process</li>
                            <li>Product images are for representation purposes only</li>
                        </ul>
                    </Section>

                    <Section title="Pricing">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes</li>
                            <li>We reserve the right to change prices at any time without prior notice</li>
                            <li>Discounts and coupon codes cannot be combined unless stated otherwise</li>
                        </ul>
                    </Section>

                    <Section title="Orders">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Once placed, orders cannot be modified or cancelled</li>
                            <li>We may refuse or cancel orders in case of suspicious activity, pricing errors, or stock issues</li>
                            <li>You will receive an email confirmation after a successful order</li>
                        </ul>
                    </Section>

                    <Section title="Payments">
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Payments are processed securely via Razorpay</li>
                            <li>We do not store your card or payment details on our servers</li>
                            <li>In case of a failed payment where money was deducted, it will be auto-reversed within 5–7 business days</li>
                        </ul>
                    </Section>

                    <Section title="Liability">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">We are not liable for:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            <li>Delays caused by courier services or unforeseen circumstances</li>
                            <li>Minor variations in product appearance due to print-on-demand processes</li>
                            <li>Loss or damage caused by incorrect shipping details provided by the customer</li>
                        </ul>
                    </Section>

                    <Section title="Governing Law">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.
                        </p>
                    </Section>

                    <Section title="Contact">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            For any queries regarding these terms, reach us at:{' '}
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
