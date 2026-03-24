import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111] text-gray-400 py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div>
                    <h1 className="font-bold text-xl text-white font-noto mb-2">Grimm United</h1>
                    <p className="text-sm text-gray-500 leading-relaxed">Holy Roots, Grimm Heart, Fearless Soul</p>
                    <div className="flex gap-3 mt-4">
                        <a href="https://instagram.com/GrimmUnited" target="_blank" rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-[#FF4B8C] text-white transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="https://twitter.com/GrimmUnited" target="_blank" rel="noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-[#FF4B8C] text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Shop</h2>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/shop" className="hover:text-[#FF4B8C] transition-colors">All Products</Link></li>
                        <li><Link to="/shop" className="hover:text-[#FF4B8C] transition-colors">T-Shirts</Link></li>
                        <li><Link to="/shop" className="hover:text-[#FF4B8C] transition-colors">Hoodies</Link></li>
                        <li><Link to="/wishlist" className="hover:text-[#FF4B8C] transition-colors">Wishlist</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Company</h2>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-[#FF4B8C] transition-colors">About Us</Link></li>
                        <li><Link to="/" className="hover:text-[#FF4B8C] transition-colors">Designs</Link></li>
                        <li><Link to="/" className="hover:text-[#FF4B8C] transition-colors">Show Interest</Link></li>
                        <li><Link to="/contact" className="hover:text-[#FF4B8C] transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Support</h2>
                    <ul className="space-y-2 text-sm">
                        <li><span className="text-gray-500">Free shipping above ₹999</span></li>
                        <li><span className="text-gray-500">7-day easy returns</span></li>
                        <li><span className="text-gray-500">5–7 day delivery</span></li>
                        <li>
                            <a href="mailto:holygrimmmedia@gmail.com" className="hover:text-[#FF4B8C] transition-colors">
                                holygrimmmedia@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Grimm United. All Rights Reserved. 🌸</p>
                <p className="text-xs text-gray-600">Anime streetwear, made with love in India.</p>
            </div>
        </footer>
    );
};

export default Footer;
