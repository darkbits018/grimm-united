import { ShopNav } from '../components/shop/ShopNav';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col">
      <ShopNav />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
