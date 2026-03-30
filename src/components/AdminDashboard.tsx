import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Download,
    LogOut,
    ShieldCheck,
    ChevronRight,
    Shirt,
    X,
    Instagram,
    Twitter,
    Mail,
    ShoppingBag,
    Package,
    Ticket,
} from 'lucide-react';
import NewsletterEditor from './NewsletterEditor';
import ProductsTab from './admin/ProductsTab';
import OrdersTab from './admin/OrdersTab';
import ContactsTab from './admin/ContactsTab';
import CouponsTab from './admin/CouponsTab';

interface Analytics {
    total_submissions: number;
    style_distribution: Record<string, number>;
    clothing_distribution: Record<string, number>;
    price_distribution: Record<string, number>;
}

interface Submission {
    id: number;
    name: string;
    email: string;
    instagram_handle?: string;
    twitter_handle?: string;
    styles: string;
    clothing_types: string;
    price_range: string;
    design_suggestions: string;
    general_feedback: string;
    cashback_consent: boolean;
    subscribe_updates: boolean;
    created_at?: string;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [loginError, setLoginError] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [activeTab, setActiveTab] = useState<'analytics' | 'newsletter' | 'products' | 'orders' | 'contacts' | 'coupons'>('analytics');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (token) {
            checkAuth(token);
        }
    };

    const checkAuth = async (testToken: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/admin/analytics`, {
                headers: {
                    'x-admin-token': testToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
                setIsAuthenticated(true);
                localStorage.setItem('admin_token', testToken);
                fetchSubmissions(testToken);
            } else {
                setLoginError('Invalid admin token');
            }
        } catch {
            setLoginError('Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (activeToken: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/admin/submissions`, {
                headers: {
                    'x-admin-token': activeToken
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
            checkAuth(savedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setToken('');
        setAnalytics(null);
        setSubmissions([]);
    };

    const downloadCSV = () => {
        if (submissions.length === 0) return;

        const headers = Object.keys(submissions[0]).join(',');
        const rows = submissions.map(s =>
            Object.values(s).map(v =>
                typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
            ).join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `grimm_submissions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#121212] px-4">
                <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-[#FF4B8C]/10 rounded-full">
                            <ShieldCheck className="w-10 h-10 text-[#FF4B8C]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-[#2C2C2C] dark:text-white mb-2">Admin Access</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">Please enter your admin token to continue</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter Admin Token"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-[#FF4B8C] outline-none transition-all"
                                required
                            />
                        </div>
                        {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF4B8C] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-[#FF4B8C]/90 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Login to Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#1E1E1E] border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-[#FF4B8C]">Grimm Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-medium">Analytics</span>
                    </button>
                    <button onClick={() => setActiveTab('newsletter')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'newsletter' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">Newsletter</span>
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Products</span>
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Orders</span>
                    </button>
                    <button onClick={() => setActiveTab('contacts')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">Contacts</span>
                    </button>
                    <button onClick={() => setActiveTab('coupons')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'coupons' ? 'bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <Ticket className="w-5 h-5" />
                        <span className="font-medium">Coupons</span>
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800`}>
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Submissions</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2C2C2C] dark:text-white">
                            {{ analytics: 'Dashboard Overview', newsletter: 'Send Newsletter', products: 'Products', orders: 'Orders', contacts: 'Contact Messages', coupons: 'Coupons' }[activeTab]}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {activeTab === 'newsletter' ? `${submissions.filter(s => s.subscribe_updates).length} subscriber(s)` : activeTab === 'analytics' ? 'Submissions & Interests Analytics' : ''}
                        </p>
                    </div>
                    {activeTab === 'analytics' && (
                        <button
                            onClick={downloadCSV}
                            className="flex items-center space-x-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                    )}
                </header>

                {activeTab === 'newsletter' && <NewsletterEditor submissions={submissions} token={token} apiUrl={apiUrl} />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'contacts' && <ContactsTab />}
                {activeTab === 'coupons' && <CouponsTab />}
                {activeTab === 'analytics' && (
                    <>
                {/* Analytics Grid */}
                <section id="stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Interests"
                        value={analytics?.total_submissions || 0}
                        icon={<Users className="w-6 h-6 text-blue-500" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Avg Styles/User"
                        value={(Object.values(analytics?.style_distribution || {}).reduce((a, b) => a + b, 0) / (analytics?.total_submissions || 1)).toFixed(1)}
                        icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
                        color="bg-purple-500"
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <DistributionCard
                        title="Popular Styles"
                        data={analytics?.style_distribution || {}}
                        icon={<ChevronRight className="w-4 h-4" />}
                    />
                    <DistributionCard
                        title="Clothing Types"
                        data={analytics?.clothing_distribution || {}}
                        icon={<Shirt className="w-4 h-4" />}
                    />
                </div>

                {/* Submissions Table */}
                <section id="submissions" className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-lg dark:text-white">Recent Submissions</h3>
                        <p className="text-xs text-gray-400 mt-1">Click a row to see full response</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Styles</th>
                                    <th className="px-6 py-4">Price Range</th>
                                    <th className="px-6 py-4">Updates</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {submissions.map((s) => (
                                    <tr
                                        key={s.id}
                                        onClick={() => setSelectedSubmission(s)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#2C2C2C] dark:text-gray-200">{s.name}</span>
                                                <span className="text-xs text-gray-400">{s.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {s.styles.split(', ').slice(0, 3).map(style => (
                                                    <span key={style} className="px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-[#FF4B8C] text-[10px] rounded-full font-medium">
                                                        {style}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium dark:text-gray-300">{s.price_range}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block w-2 h-2 rounded-full ${s.subscribe_updates ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                    </>
                )}
            </main>

            {/* Full Response Modal */}
            {selectedSubmission && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div
                        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">{selectedSubmission.name}</h3>
                                <p className="text-xs text-gray-400">{selectedSubmission.email}</p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                                <X className="w-5 h-5 dark:text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Socials */}
                            {(selectedSubmission.instagram_handle || selectedSubmission.twitter_handle) && (
                                <div className="flex gap-4">
                                    {selectedSubmission.instagram_handle && (
                                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Instagram className="w-4 h-4" /> {selectedSubmission.instagram_handle}
                                        </span>
                                    )}
                                    {selectedSubmission.twitter_handle && (
                                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Twitter className="w-4 h-4" /> {selectedSubmission.twitter_handle}
                                        </span>
                                    )}
                                </div>
                            )}

                            <Field label="Style Preferences">
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedSubmission.styles.split(', ').map(s => (
                                        <span key={s} className="px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-[#FF4B8C] text-xs rounded-full">{s}</span>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Clothing Types">
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedSubmission.clothing_types.split(', ').map(c => (
                                        <span key={c} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">{c}</span>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Price Range">
                                <p className="text-sm dark:text-gray-300 mt-1">{selectedSubmission.price_range}</p>
                            </Field>

                            <Field label="Design Suggestions">
                                <p className="text-sm dark:text-gray-300 mt-1 whitespace-pre-wrap">{selectedSubmission.design_suggestions || '—'}</p>
                            </Field>

                            <Field label="General Feedback">
                                <p className="text-sm dark:text-gray-300 mt-1 whitespace-pre-wrap">{selectedSubmission.general_feedback || '—'}</p>
                            </Field>

                            <div className="flex gap-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-xs text-gray-500">Discount consent: <span className={selectedSubmission.cashback_consent ? 'text-green-500' : 'text-red-400'}>{selectedSubmission.cashback_consent ? 'Yes' : 'No'}</span></span>
                                <span className="text-xs text-gray-500">Subscribed: <span className={selectedSubmission.subscribe_updates ? 'text-green-500' : 'text-red-400'}>{selectedSubmission.subscribe_updates ? 'Yes' : 'No'}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-gray-500 text-xs font-medium uppercase">{title}</p>
                    <p className="text-2xl font-bold dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}

function DistributionCard({ title, data, icon }: { title: string, data: Record<string, number>, icon: React.ReactNode }) {
    const max = Math.max(...Object.values(data), 1);
    return (
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold mb-6 flex items-center dark:text-white">
                <span className="p-1.5 bg-[#FF4B8C]/10 text-[#FF4B8C] rounded-lg mr-2">{icon}</span>
                {title}
            </h3>
            <div className="space-y-4">
                {Object.entries(data).sort((a, b) => b[1] - a[1]).map(([key, value]) => (
                    <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{key}</span>
                            <span className="font-bold dark:text-white">{value}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-[#FF4B8C] h-full rounded-full transition-all duration-1000"
                                style={{ width: `${(value / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">{label}</p>
            {children}
        </div>
    );
}
