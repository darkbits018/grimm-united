import { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import { About } from './components/About';
import InterestForm from './components/InterestForm';
import { CookieConsent } from './components/CookieConsent';
import { ThemeProvider } from './contexts/ThemeContext';
import Footer from './components/Footer';
import { ScrollNav } from './components/Navigation/ScrollNav';
import { DesignsShowcase } from './components/DesignsShowcase/DesignsShowcase';
import AdminDashboard from './components/AdminDashboard';
import ContactPage from './pages/ContactPage';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';

import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage';
import FAQPage from './pages/FAQPage';

export default function App() {
  const interestFormRef = useRef(null);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={
                <div className="home-scroll min-h-screen bg-white dark:bg-[#1a1a1a] transition-colors duration-200">
                  <ScrollNav />
                  <section id="hero" className="min-h-screen">
                    <Hero interestFormRef={interestFormRef} />
                  </section>
                  <section id="about" className="min-h-screen">
                    <About />
                  </section>
                  <section id="designs" className="min-h-screen">
                    <DesignsShowcase />
                  </section>
                  <section id="interest" className="min-h-screen">
                    <InterestForm />
                  </section>
                  <CookieConsent />
                  <section id="footer">
                    <Footer />
                  </section>
                </div>
              } />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/orders/:id" element={<OrderTrackingPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
