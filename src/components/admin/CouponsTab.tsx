import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw, X, Wand2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN = 'grimm_admin_secret';
const HEADERS = { 'Content-Type': 'application/json', 'x-admin-token': TOKEN };

interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  is_active: boolean;
}

const emptyForm = { code: '', discount_percent: 10, max_uses: '', expires_at: '', is_active: true };

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/coupons`, { headers: HEADERS });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch { setCoupons([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, code: randomCode() });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discount_percent: c.discount_percent,
      max_uses: c.max_uses != null ? String(c.max_uses) : '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
      is_active: c.is_active,
    });
    setError('');
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.code.trim() || !form.discount_percent) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_percent: Number(form.discount_percent),
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
        is_active: form.is_active,
      };
      const url = editing ? `${API}/api/admin/coupons/${editing.id}` : `${API}/api/admin/coupons`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: HEADERS, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to save');
      }
      await fetchCoupons();
      setModalOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save coupon');
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`${API}/api/admin/coupons/${id}`, { method: 'DELETE', headers: HEADERS });
    setCoupons(cs => cs.filter(c => c.id !== id));
  };

  const toggleActive = async (c: Coupon) => {
    const payload = { code: c.code, discount_percent: c.discount_percent, max_uses: c.max_uses, expires_at: c.expires_at, is_active: !c.is_active };
    await fetch(`${API}/api/admin/coupons/${c.id}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify(payload) });
    await fetchCoupons();
  };

  const isExpired = (c: Coupon) => c.expires_at ? new Date(c.expires_at) < new Date() : false;
  const isExhausted = (c: Coupon) => c.max_uses != null && c.uses >= c.max_uses;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Coupons</h2>
          <p className="text-sm text-gray-400">{coupons.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCoupons} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#FF4B8C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#FF4B8C]/90 transition-colors">
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Discount</th>
                  <th className="px-5 py-4">Uses</th>
                  <th className="px-5 py-4">Expires</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {coupons.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-[#FF4B8C] tracking-widest text-sm">{c.code}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold dark:text-gray-200">{c.discount_percent}% off</td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {c.uses}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                      {isExhausted(c) && <span className="ml-2 text-xs text-orange-400">exhausted</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {c.expires_at ? (
                        <span className={isExpired(c) ? 'text-red-400' : ''}>
                          {new Date(c.expires_at).toLocaleDateString()}
                          {isExpired(c) && ' (expired)'}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(c)} className="flex items-center gap-1 text-xs font-medium">
                        {c.is_active && !isExpired(c) && !isExhausted(c)
                          ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-500">Active</span></>
                          : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => remove(c.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No coupons yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg dark:text-white">{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Code</label>
                <div className="flex gap-2">
                  <input
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="input flex-1 font-mono tracking-widest uppercase"
                    placeholder="e.g. GRIMM20"
                  />
                  <button type="button" onClick={() => setForm(f => ({ ...f, code: randomCode() }))}
                    className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Generate random code">
                    <Wand2 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Discount %</label>
                <input type="number" min={1} max={100} value={form.discount_percent}
                  onChange={e => setForm(f => ({ ...f, discount_percent: Number(e.target.value) }))}
                  className="input" placeholder="e.g. 20" />
              </div>
              <div>
                <label className="label">Max Uses <span className="text-gray-400 font-normal">(leave blank for unlimited)</span></label>
                <input type="number" min={1} value={form.max_uses}
                  onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                  className="input" placeholder="Unlimited" />
              </div>
              <div>
                <label className="label">Expires On <span className="text-gray-400 font-normal">(leave blank for no expiry)</span></label>
                <input type="date" value={form.expires_at}
                  onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                  className="input" />
              </div>
              <div className="flex items-center gap-3">
                <label className="label mb-0">Active</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className="flex items-center gap-1 text-sm">
                  {form.is_active
                    ? <><ToggleRight className="w-6 h-6 text-green-500" /><span className="text-green-500">Active</span></>
                    : <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                </button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#FF4B8C] text-white text-sm font-semibold hover:bg-[#FF4B8C]/90 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
