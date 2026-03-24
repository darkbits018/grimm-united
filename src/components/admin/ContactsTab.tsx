import { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, X, MessageSquare } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN = 'grimm_admin_secret';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/contacts`, {
        headers: { 'x-admin-token': TOKEN },
      });
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Contact Messages</h2>
          <p className="text-sm text-gray-400">{contacts.length} message{contacts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={fetchContacts} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Sender</th>
                  <th className="px-5 py-4">Message Preview</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {contacts.map(c => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium dark:text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                      <p className="line-clamp-1">{c.message}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-gray-400 text-sm">No messages yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-bold text-lg dark:text-white">{selected.name}</h3>
                <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 text-[#FF4B8C]" />
                <a href={`mailto:${selected.email}`} className="hover:text-[#FF4B8C] transition-colors">{selected.email}</a>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF4B8C] mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800">
              <a
                href={`mailto:${selected.email}?subject=Re: Your message to Grimm United`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF4B8C] text-white text-sm font-semibold hover:bg-[#FF4B8C]/90 transition-colors"
              >
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
