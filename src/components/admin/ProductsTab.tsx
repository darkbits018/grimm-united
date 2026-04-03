import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ImagePlus, RefreshCw, FileJson, ChevronDown, ChevronRight } from 'lucide-react';
import { categories } from '../../data/products';
import type { Product } from '../../types/shop';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN = 'grimm_admin_secret';
const HEADERS = { 'Content-Type': 'application/json', 'x-admin-token': TOKEN };
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const emptyForm: Omit<Product, 'id'> = {
  name: '', description: '', price: 0, compare_at_price: undefined,
  images: [], sizes: [], stock_per_size: {}, category: 'T-shirts', tags: [], is_active: true,
  qikink_client_product_id: '', qikink_color_id: '', qikink_print_type_id: undefined,
  qikink_sku: '', qikink_design_code: '',
};

type CV = { colorId: string; colorName: string; imageUrl: string; sizes: string[]; printTypeId: number; title: string; clientProductId: string; price: number; };

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonPanelOpen, setJsonPanelOpen] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState('');
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkComparePrice, setBulkComparePrice] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/products`, { headers: HEADERS });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const importAllVariants = async () => {
    setJsonError(''); setJsonSuccess('');
    try {
      const parsed = JSON.parse(jsonInput);
      const items: unknown[] = parsed.items || parsed.data || [];
      if (!items.length) throw new Error('No items found in JSON');
      const sizeOrder = ['XS','S','M','L','XL','XXL','2XL','3XL'];
      const variantMap = new Map<string, CV>();
      items.forEach((item) => {
        const it = item as Record<string, unknown>;
        const d = (it.product_detail as Record<string, unknown>) || {};
        const colorId = String(d.color_id ?? it.color_id ?? '');
        const colorName: string = String(d.color || it.color || colorId);
        const size: string = String(d.size || it.size || '');
        const imageUrl: string = String(it.imageUrl || it.client_mockup_image || '');
        const title: string = String(it.product_title || it.client_product_title || '');
        const clientProductId = String(it.client_product_id ?? '');
        const printTypeId = Number(d.print_type_id ?? it.print_type_id ?? 1);
        const price = Number(it.price ?? 0);
        if (!variantMap.has(colorId)) variantMap.set(colorId, { colorId, colorName, imageUrl, sizes: [], printTypeId, title, clientProductId, price });
        const v = variantMap.get(colorId)!;
        if (size && !v.sizes.includes(size)) v.sizes.push(size);
        if (imageUrl && !v.imageUrl) v.imageUrl = imageUrl;
      });
      variantMap.forEach(v => v.sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)));
      const variants = Array.from(variantMap.values());
      setImporting(true);
      let created = 0;
      for (const v of variants) {
        const stock: Record<string, number> = {};
        v.sizes.forEach(s => { stock[s] = 0; });
        const payload = {
          name: `${v.title} — ${v.colorName}`, description: '', price: v.price,
          images: v.imageUrl ? [v.imageUrl] : [], sizes: v.sizes, stock_per_size: stock,
          category: v.title.toLowerCase().includes('hoodie') ? 'Hoodies' : 'T-shirts',
          tags: [], is_active: true, qikink_client_product_id: v.clientProductId,
          qikink_color_id: v.colorId, qikink_print_type_id: v.printTypeId,
          qikink_sku: '', qikink_design_code: '',
        };
        const res = await fetch(`${API}/api/admin/products`, { method: 'POST', headers: HEADERS, body: JSON.stringify(payload) });
        if (res.ok) created++;
      }
      setJsonSuccess(`Created ${created} of ${variants.length} variants.`);
      setJsonInput('');
      await fetchProducts();
    } catch (e: unknown) { setJsonError(e instanceof Error ? e.message : 'Invalid JSON.'); }
    finally { setImporting(false); }
  };

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} products permanently?`)) return;
    setBulkWorking(true);
    await Promise.all([...selected].map(id => fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE', headers: HEADERS })));
    setProducts(ps => ps.filter(p => !selected.has(p.id)));
    setSelected(new Set()); setBulkWorking(false);
  };

  const bulkSetActive = async (active: boolean) => {
    setBulkWorking(true);
    await Promise.all(products.filter(p => selected.has(p.id)).map(p =>
      fetch(`${API}/api/admin/products/${p.id}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify({ ...p, is_active: active }) })
    ));
    await fetchProducts(); setSelected(new Set()); setBulkWorking(false);
  };

  const bulkUpdatePrice = async () => {
    const price = bulkPrice ? Number(bulkPrice) : null;
    const compareAt = bulkComparePrice ? Number(bulkComparePrice) : undefined;
    if (!price && compareAt === undefined) return;
    setBulkWorking(true);
    const toUpdate = products.filter(p => selected.has(p.id));
    await Promise.all(toUpdate.map(p => {
      const updated = { ...p };
      if (price && price > 0) updated.price = price;
      if (compareAt !== undefined) updated.compare_at_price = compareAt || undefined;
      return fetch(`${API}/api/admin/products/${p.id}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify(updated) });
    }));
    await fetchProducts(); setSelected(new Set()); setBulkPriceOpen(false); setBulkPrice(''); setBulkComparePrice(''); setBulkWorking(false);
  };

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpand = (key: string) => setExpanded(s => { const n = new Set(s); if (n.has(key)) { n.delete(key); } else { n.add(key); } return n; });

  const COLOR_HEX: Record<string, string> = {
    '2': '#1a1a1a', '3': '#1a2a4a', '9': '#2a4aaa', '25': '#6b1a1a',
    '26': '#4a1a6b', '1': '#ffffff', '4': '#c0392b', '5': '#27ae60',
    '6': '#e67e22', '7': '#f1c40f', '8': '#95a5a6',
  };

  // Group products by qikink_client_product_id; ungrouped shown as-is
  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    const ungrouped: Product[] = [];
    for (const p of products) {
      const key = p.qikink_client_product_id;
      if (key) {
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(p);
      } else {
        ungrouped.push(p);
      }
    }
    const rows: Array<{ key: string; primary: Product; variants: Product[] }> = [];
    map.forEach((variants, key) => rows.push({ key, primary: variants[0], variants }));
    ungrouped.forEach(p => rows.push({ key: p.id, primary: p, variants: [p] }));
    return rows;
  }, [products]);

  const allGroupIds = useMemo(() => grouped.flatMap(g => g.variants.map(v => v.id)), [grouped]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageInput(''); setTagInput(''); setModalOpen(true); };  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setImageInput(''); setTagInput(''); setModalOpen(true); };

  const save = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const url = editing ? `${API}/api/admin/products/${editing.id}` : `${API}/api/admin/products`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: HEADERS, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchProducts(); setModalOpen(false);
    } catch { alert('Failed to save product'); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    const res = await fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE', headers: HEADERS });
    if (res.ok) setProducts(ps => ps.filter(p => p.id !== id));
    else alert('Failed to delete product');
  };

  const toggleActive = async (p: Product) => {
    await fetch(`${API}/api/admin/products/${p.id}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify({ ...p, is_active: !p.is_active }) });
    await fetchProducts();
  };

  const addImage = () => { if (imageInput.trim()) { setForm(f => ({ ...f, images: [...f.images, imageInput.trim()] })); setImageInput(''); } };
  const addTag = () => { if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } };
  const toggleSize = (size: string) => {
    setForm(f => {
      const has = f.sizes.includes(size);
      const sizes = has ? f.sizes.filter(s => s !== size) : [...f.sizes, size];
      const stock = { ...f.stock_per_size };
      if (has) delete stock[size]; else stock[size] = 0;
      return { ...f, sizes, stock_per_size: stock };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Products</h2>
          <p className="text-sm text-gray-400">{grouped.length} product{grouped.length !== 1 ? 's' : ''} ({products.length} variants)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProducts} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => { setJsonPanelOpen(v => !v); setJsonError(''); setJsonSuccess(''); }}
            className="flex items-center gap-2 border border-[#FF4B8C] text-[#FF4B8C] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#FF4B8C]/5 transition-colors">
            <FileJson className="w-4 h-4" /> Import JSON
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#FF4B8C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#FF4B8C]/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {jsonPanelOpen && (
        <div className="mb-6 border border-dashed border-[#FF4B8C]/40 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-[#FF4B8C]">Import all variants from Qikink JSON</p>
          <p className="text-xs text-gray-400">Paste the Qikink JSON — all color variants will be created as separate products.</p>
          <textarea value={jsonInput} onChange={e => { setJsonInput(e.target.value); setJsonError(''); setJsonSuccess(''); }}
            rows={5} className="input resize-none font-mono text-xs w-full" placeholder='{"status": true, "items": [...]}' />
          {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
          {jsonSuccess && <p className="text-xs text-green-400">{jsonSuccess}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={importAllVariants} disabled={importing || !jsonInput.trim()}
              className="px-4 py-2 bg-[#FF4B8C] text-white text-xs font-semibold rounded-xl hover:bg-[#FF4B8C]/90 disabled:opacity-50 transition-colors">
              {importing ? 'Importing...' : 'Import All Variants'}
            </button>
            <button type="button" onClick={() => { setJsonPanelOpen(false); setJsonInput(''); setJsonError(''); setJsonSuccess(''); }}
              className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-[#FF4B8C]/10 border border-[#FF4B8C]/30 rounded-xl">
          <span className="text-sm font-medium text-[#FF4B8C]">{selected.size} variant{selected.size !== 1 ? 's' : ''} selected</span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <button onClick={() => bulkSetActive(true)} disabled={bulkWorking} className="px-3 py-1.5 text-xs font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors">Activate</button>
            <button onClick={() => bulkSetActive(false)} disabled={bulkWorking} className="px-3 py-1.5 text-xs font-semibold bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors">Deactivate</button>
            <button onClick={() => { setBulkPriceOpen(true); setBulkPrice(''); setBulkComparePrice(''); }} disabled={bulkWorking} className="px-3 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">Set Price</button>
            <button onClick={bulkDelete} disabled={bulkWorking} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors">
              {bulkWorking ? 'Working...' : 'Delete'}
            </button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Clear</button>
          </div>
        </div>
      )}

      {bulkPriceOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setBulkPriceOpen(false)}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg dark:text-white">Set Price for {selected.size} variant{selected.size !== 1 ? 's' : ''}</h3>
            <p className="text-xs text-gray-400">Leave a field blank to keep existing value.</p>
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" min={1} autoFocus value={bulkPrice}
                onChange={e => setBulkPrice(e.target.value)}
                className="input" placeholder="e.g. 499" />
            </div>
            <div>
              <label className="label">Compare At Price (₹) <span className="text-gray-400 font-normal">— shows as strikethrough</span></label>
              <input type="number" min={1} value={bulkComparePrice}
                onChange={e => setBulkComparePrice(e.target.value)}
                className="input" placeholder="e.g. 699 (optional)" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setBulkPriceOpen(false); setBulkPrice(''); setBulkComparePrice(''); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={bulkUpdatePrice} disabled={bulkWorking || (!bulkPrice && !bulkComparePrice)} className="flex-1 py-2.5 rounded-xl bg-[#FF4B8C] text-white text-sm font-semibold hover:bg-[#FF4B8C]/90 disabled:opacity-50 transition-colors">
                {bulkWorking ? 'Updating...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[#FF4B8C] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-4">
                    <input type="checkbox" checked={selected.size === allGroupIds.length && allGroupIds.length > 0} onChange={() => setSelected(s => s.size === allGroupIds.length ? new Set() : new Set(allGroupIds))} className="w-4 h-4 rounded accent-[#FF4B8C] cursor-pointer" />
                  </th>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Sizes</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {grouped.map(({ key, primary, variants }) => {
                  const isGroup = variants.length > 1;
                  const isOpen = expanded.has(key);
                  const allSelected = variants.every(v => selected.has(v.id));
                  const someSelected = variants.some(v => selected.has(v.id));
                  const toggleGroup = () => setSelected(s => {
                    const n = new Set(s);
                    if (allSelected) { variants.forEach(v => n.delete(v.id)); }
                    else { variants.forEach(v => n.add(v.id)); }
                    return n;
                  });                  // strip color suffix for group name
                  const baseName = primary.name.includes(' — ') ? primary.name.split(' — ').slice(0, -1).join(' — ') : primary.name;

                  return [
                    // Group / single row
                    <tr key={key} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${someSelected ? 'bg-[#FF4B8C]/5' : ''}`}>
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={allSelected} onChange={toggleGroup} className="w-4 h-4 rounded accent-[#FF4B8C] cursor-pointer" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {isGroup && (
                            <button onClick={() => toggleExpand(key)} className="text-gray-400 hover:text-[#FF4B8C] transition-colors">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                          {primary.images[0] && <img src={primary.images[0]} alt={baseName} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                          <div className="min-w-0">
                            <span className="text-sm font-medium dark:text-gray-200 line-clamp-1 max-w-[160px] block">{baseName}</span>
                            {isGroup && (
                              <div className="flex gap-1 mt-1">
                                {variants.map(v => (
                                  <span key={v.id} title={v.name.split(' — ').pop()} className="w-3 h-3 rounded-full border border-black/20 inline-block shrink-0"
                                    style={{ backgroundColor: COLOR_HEX[v.qikink_color_id ?? ''] ?? '#888' }} />
                                ))}
                                <span className="text-[10px] text-gray-400 ml-1">{variants.length} colors</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{primary.category}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#FF4B8C]">₹{primary.price}</span>
                        {primary.compare_at_price && <span className="text-xs text-gray-400 line-through ml-1">₹{primary.compare_at_price}</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {primary.sizes.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">{s}</span>)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleActive(primary)} className="flex items-center gap-1 text-xs font-medium">
                          {primary.is_active ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-500">Active</span></> : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(primary)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-500" /></button>
                          <button onClick={() => remove(primary.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      </td>
                    </tr>,
                    // Expanded variant rows
                    ...(isGroup && isOpen ? variants.map(v => (
                      <tr key={`${key}-${v.id}`} className={`bg-gray-50/50 dark:bg-gray-800/20 border-l-2 border-[#FF4B8C]/30 ${selected.has(v.id) ? 'bg-[#FF4B8C]/5' : ''}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.has(v.id)} onChange={() => toggleSelect(v.id)} className="w-4 h-4 rounded accent-[#FF4B8C] cursor-pointer" />
                        </td>
                        <td className="px-5 py-3 pl-14">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: COLOR_HEX[v.qikink_color_id ?? ''] ?? '#888' }} />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{v.name.split(' — ').pop()}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">{v.category}</td>
                        <td className="px-5 py-3"><span className="text-xs font-semibold text-[#FF4B8C]">₹{v.price}</span></td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {v.sizes.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">{s}</span>)}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => toggleActive(v)} className="flex items-center gap-1 text-xs">
                            {v.is_active ? <><ToggleRight className="w-4 h-4 text-green-500" /><span className="text-green-500">Active</span></> : <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(v)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button>
                            <button onClick={() => remove(v.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : []),
                  ];
                })}
                {grouped.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No products yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#1E1E1E] z-10">
              <h3 className="font-bold text-lg dark:text-white">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="Product name" />
                </div>
                <div>
                  <label className="label">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="input" />
                </div>
                <div>
                  <label className="label">Compare At Price (₹)</label>
                  <input type="number" value={form.compare_at_price || ''} onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value ? Number(e.target.value) : undefined }))} className="input" placeholder="Optional" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input resize-none" />
              </div>
              <div>
                <label className="label">Images</label>
                <div className="flex gap-2 mb-2">
                  <input value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} className="input flex-1" placeholder="Image URL" />
                  <button type="button" onClick={addImage} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ImagePlus className="w-4 h-4 dark:text-gray-300" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-16 h-16 object-cover rounded-xl" />
                      <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Sizes & Stock</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SIZES.map(size => (
                    <div key={size} className="space-y-1">
                      <button type="button" onClick={() => toggleSize(size)}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${form.sizes.includes(size) ? 'border-[#FF4B8C] bg-[#FF4B8C]/10 text-[#FF4B8C]' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                        {size}
                      </button>
                      {form.sizes.includes(size) && (
                        <input type="number" min={0} value={form.stock_per_size[size] ?? 0}
                          onChange={e => setForm(f => ({ ...f, stock_per_size: { ...f.stock_per_size, [size]: Number(e.target.value) } }))}
                          className="w-full text-center text-xs px-1 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white outline-none focus:ring-1 focus:ring-[#FF4B8C]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="input flex-1" placeholder="Add tag and press Enter" />
                  <button type="button" onClick={addTag} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      {tag}<button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))} className="text-gray-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qikink Fulfillment</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Client Product ID</label>
                    <input value={form.qikink_client_product_id || ''} onChange={e => setForm(f => ({ ...f, qikink_client_product_id: e.target.value }))} className="input" placeholder="e.g. 31964577" />
                  </div>
                  <div>
                    <label className="label">Color ID</label>
                    <input value={form.qikink_color_id || ''} onChange={e => setForm(f => ({ ...f, qikink_color_id: e.target.value }))} className="input" placeholder="2=Black, 3=Navy Blue" />
                  </div>
                  <div>
                    <label className="label">Print Type ID</label>
                    <select value={form.qikink_print_type_id || ''} onChange={e => setForm(f => ({ ...f, qikink_print_type_id: e.target.value ? Number(e.target.value) : undefined }))} className="input">
                      <option value="">— Select —</option>
                      <option value="1">1 — DTG (Cotton)</option>
                      <option value="17">17 — DTF</option>
                      <option value="2">2 — All Over Print</option>
                      <option value="3">3 — Embroidery</option>
                      <option value="5">5 — Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Design Code</label>
                    <input value={form.qikink_design_code || ''} onChange={e => setForm(f => ({ ...f, qikink_design_code: e.target.value }))} className="input" placeholder="e.g. A44" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="label mb-0">Active</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className="flex items-center gap-1 text-sm">
                  {form.is_active ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                  <span className={form.is_active ? 'text-green-500' : 'text-gray-400'}>{form.is_active ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#FF4B8C] text-white text-sm font-semibold hover:bg-[#FF4B8C]/90 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
