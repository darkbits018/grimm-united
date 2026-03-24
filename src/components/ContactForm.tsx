import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else setErrors({ general: 'Something went wrong. Please try again.' });
    } catch {
      setErrors({ general: 'Could not connect to server.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-[#2C2C2C] p-8 rounded-2xl shadow-lg">
          <div className="w-12 h-12 bg-[#FF4B8C] rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-noto text-[#2C2C2C] dark:text-white mb-3">Message Sent!</h3>
          <p className="text-[#2C2C2C]/70 dark:text-white/70">
            Thanks, {form.name}! We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl md:text-4xl font-noto text-[#2C2C2C] dark:text-white mb-2 text-center">
        Get In Touch
      </h2>
      <p className="text-center text-[#2C2C2C]/60 dark:text-white/60 mb-8">
        Have a question or just want to say hi? We'd love to hear from you.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C]/70 dark:text-white/70 mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#2C2C2C] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C] transition-all ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C]/70 dark:text-white/70 mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#2C2C2C] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C] transition-all ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C]/70 dark:text-white/70 mb-1.5">Message</label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#2C2C2C] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#FF4B8C] transition-all resize-none ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
          />
          {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
        </div>

        {errors.general && <p className="text-sm text-red-400 text-center">{errors.general}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#FF4B8C] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#FF4B8C]/90 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          <Send className={`w-4 h-4 ${submitting ? 'animate-pulse' : ''}`} />
        </button>
      </form>
    </div>
  );
}
