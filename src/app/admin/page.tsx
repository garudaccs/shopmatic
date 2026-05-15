'use client';

import { useState, useEffect, useCallback } from 'react';

// ---- Types ----
interface ProductData {
  slug: string;
  title: string;
  description: string;
  category: string;
  pricingType: 'free' | 'freemium' | 'paid';
  price: string;
  rating: number;
  image: string;
  affiliateUrl: string;
  shortUrl: string;
  features: string[];
  pros: string[];
  cons: string[];
  archived?: boolean;
}

interface ReviewData {
  slug: string;
  frontmatter: Record<string, string | string[] | number>;
  content: string;
  raw: string;
}

type Tab = 'products' | 'reviews' | 'deploy';
type ConfirmAction = { type: string; message: string; onConfirm: () => void } | null;

const ADMIN_PASS = 'shopmatic2026';
const LS_KEY_PRODUCTS = 'shopmatic_admin_products';
const LS_KEY_REVIEWS = 'shopmatic_admin_reviews';

function emptyProduct(): ProductData {
  return {
    slug: '', title: '', description: '', category: 'AI Tools',
    pricingType: 'freemium', price: '', rating: 4.0,
    image: '', affiliateUrl: '', shortUrl: '',
    features: [], pros: [], cons: [], archived: false,
  };
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<ProductData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number>(-1);
  const [selectedReview, setSelectedReview] = useState<number>(-1);
  const [editContent, setEditContent] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('success');
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const flash = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatus(msg);
    setStatusType(type);
    setTimeout(() => setStatus(''), 4000);
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function loadData() {
    try {
      setLoading(true);
      // Check localStorage first
      const cached = localStorage.getItem(LS_KEY_PRODUCTS);
      if (cached) {
        setProducts(JSON.parse(cached));
      } else {
        const res = await fetch('/data/admin-products.json');
        if (res.ok) setProducts(await res.json());
      }
      const cachedRev = localStorage.getItem(LS_KEY_REVIEWS);
      if (cachedRev) {
        setReviews(JSON.parse(cachedRev));
      } else {
        const res = await fetch('/data/admin-reviews.json');
        if (res.ok) setReviews(await res.json());
      }
    } catch { flash('Failed to load data', 'error'); }
    finally { setLoading(false); }
  }

  function persist(products: ProductData[]) {
    localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(products));
  }

  function persistReviews(reviews: ReviewData[]) {
    localStorage.setItem(LS_KEY_REVIEWS, JSON.stringify(reviews));
  }

  function mdToHtml(md: string): string {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^---[\s\S]*?---\n*/m, '');
  }

  function handleLogin() {
    if (passInput === ADMIN_PASS) setAuthed(true);
    else flash('Wrong password', 'error');
  }

  function download(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    flash(`Downloaded ${filename}`);
  }

  // ---- Product Actions ----
  function updateProduct(field: string, value: string | number | string[] | boolean) {
    if (selectedProduct < 0) return;
    const updated = [...products];
    (updated[selectedProduct] as any)[field] = value;
    setProducts(updated);
    setDirty(prev => new Set(prev).add(`product-${selectedProduct}`));
  }

  function saveProduct() {
    if (selectedProduct < 0) return;
    const p = products[selectedProduct];
    if (!p.slug || !p.title) { flash('Slug and Title are required', 'error'); return; }
    persist(products);
    setDirty(prev => { const n = new Set(prev); n.delete(`product-${selectedProduct}`); return n; });
    flash(`Saved "${p.title}" to browser storage`);
    download(`${p.slug}-product.json`, JSON.stringify(p, null, 2));
  }

  function saveAllProducts() {
    persist(products);
    setDirty(new Set());
    flash(`Saved all ${products.length} products`);
    download('admin-products.json', JSON.stringify(products, null, 2));
  }

  function deleteProduct() {
    if (selectedProduct < 0) return;
    const p = products[selectedProduct];
    setConfirm({
      type: 'delete',
      message: `Permanently delete "${p.title}"? This cannot be undone.`,
      onConfirm: () => {
        const updated = products.filter((_, i) => i !== selectedProduct);
        setProducts(updated);
        persist(updated);
        setSelectedProduct(-1);
        setIsNewProduct(false);
        flash(`Deleted "${p.title}"`);
      }
    });
  }

  function archiveProduct() {
    if (selectedProduct < 0) return;
    const p = products[selectedProduct];
    const updated = [...products];
    updated[selectedProduct] = { ...updated[selectedProduct], archived: !updated[selectedProduct].archived };
    setProducts(updated);
    persist(updated);
    flash(updated[selectedProduct].archived ? `Archived "${p.title}"` : `Restored "${p.title}"`);
  }

  function addProduct() {
    const np = emptyProduct();
    const updated = [...products, np];
    setProducts(updated);
    setSelectedProduct(updated.length - 1);
    setIsNewProduct(true);
    flash('New product created — fill in details and save', 'info');
  }

  function duplicateProduct() {
    if (selectedProduct < 0) return;
    const src = products[selectedProduct];
    const dup = { ...src, slug: src.slug + '-copy', title: src.title + ' (Copy)', features: [...src.features], pros: [...src.pros], cons: [...src.cons] };
    const updated = [...products, dup];
    setProducts(updated);
    setSelectedProduct(updated.length - 1);
    setIsNewProduct(true);
    flash(`Duplicated "${src.title}"`);
  }

  // ---- Review Actions ----
  function selectReview(i: number) {
    setSelectedReview(i);
    setEditContent(reviews[i].raw);
    setPreviewHtml(mdToHtml(reviews[i].content));
  }

  function saveReview() {
    if (selectedReview < 0) return;
    const updated = [...reviews];
    updated[selectedReview] = { ...updated[selectedReview], raw: editContent, content: editContent.replace(/^---[\s\S]*?---\n*/, '') };
    setReviews(updated);
    persistReviews(updated);
    flash(`Saved review for "${updated[selectedReview].slug}"`);
    download(`${updated[selectedReview].slug}.md`, editContent);
  }

  function deleteReview() {
    if (selectedReview < 0) return;
    const slug = reviews[selectedReview].slug;
    setConfirm({
      type: 'delete',
      message: `Delete review for "${slug}"?`,
      onConfirm: () => {
        const updated = reviews.filter((_, i) => i !== selectedReview);
        setReviews(updated);
        persistReviews(updated);
        setSelectedReview(-1);
        flash(`Deleted review "${slug}"`);
      }
    });
  }

  function saveAllReviews() {
    persistReviews(reviews);
    flash(`Saved all ${reviews.length} reviews`);
  }

  // ---- Filtered lists ----
  const filteredProducts = products
    .map((p, i) => ({ ...p, _index: i }))
    .filter(p => showArchived || !p.archived)
    .filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

  // ---- Login Screen ----
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">Shopmatic Admin</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Enter password to continue</p>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm mb-4" />
          <button onClick={handleLogin} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors">Login</button>
        </div>
      </div>
    );
  }

  const selectedP = selectedProduct >= 0 ? products[selectedProduct] : null;
  const hasUnsaved = dirty.size > 0;

  // ---- Main Admin ----
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">Shopmatic Admin</span>
            {hasUnsaved && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{dirty.size} unsaved</span>}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => { localStorage.clear(); flash('Cache cleared', 'info'); }} className="text-xs text-gray-400 hover:text-gray-600">Clear Cache</button>
            <button onClick={() => setAuthed(false)} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {(['products', 'reviews', 'deploy'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'products' && ` (${products.filter(p => !p.archived).length})`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Status Toast */}
      {status && (
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3`}>
          <div className={`px-4 py-2 rounded-lg text-sm flex justify-between items-center ${
            statusType === 'error' ? 'bg-red-50 text-red-700' :
            statusType === 'info' ? 'bg-blue-50 text-blue-700' :
            'bg-emerald-50 text-emerald-700'
          }`}>
            <span>{status}</span>
            <button onClick={() => setStatus('')} className="opacity-50 hover:opacity-100">x</button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">Confirm Delete</h3>
            <p className="text-gray-600 text-sm text-center mb-6">{confirm.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { confirm.onConfirm(); setConfirm(null); }} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            {/* ---- Products Tab ---- */}
            {tab === 'products' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900 text-sm">Products ({products.filter(p => !p.archived).length})</h2>
                        <button onClick={addProduct} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 font-medium">+ Add New</button>
                      </div>
                      <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="rounded" />
                        Show archived ({products.filter(p => p.archived).length})
                      </label>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredProducts.map((p) => (
                        <button key={p._index} onClick={() => { setSelectedProduct(p._index); setIsNewProduct(false); }}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${
                            selectedProduct === p._index ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''
                          }`}>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm ${p.archived ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{p.title || '(untitled)'}</span>
                            {dirty.has(`product-${p._index}`) && <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" title="Unsaved" />}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              p.pricingType === 'free' ? 'bg-emerald-100 text-emerald-700' :
                              p.pricingType === 'freemium' ? 'bg-sky-100 text-sky-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{p.pricingType}</span>
                            <span>{p.category}</span>
                            {p.archived && <span className="text-gray-400">(archived)</span>}
                          </div>
                        </button>
                      ))}
                      {filteredProducts.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">No products found</div>}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button onClick={saveAllProducts} className="w-full text-xs bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 font-medium">Save & Download All Products</button>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="lg:col-span-2">
                  {selectedP ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {/* Editor Header */}
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div>
                          <h2 className="font-bold text-gray-900">{isNewProduct ? 'New Product' : `Edit: ${selectedP.title}`}</h2>
                          <span className="text-xs text-gray-400">{selectedP.slug}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={duplicateProduct} className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 font-medium" title="Duplicate">Duplicate</button>
                          <button onClick={archiveProduct} className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 font-medium">
                            {selectedP.archived ? 'Restore' : 'Archive'}
                          </button>
                          <button onClick={deleteProduct} className="text-xs bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 font-medium">Delete</button>
                          <button onClick={saveProduct} className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium">
                            Save & Download
                          </button>
                        </div>
                      </div>

                      {/* Editor Body */}
                      <div className="p-6 space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL key)</label>
                            <input type="text" value={selectedP.slug} onChange={(e) => updateProduct('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="e.g. loom" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                            <input type="text" value={selectedP.title} onChange={(e) => updateProduct('title', e.target.value)} placeholder="Product Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                            <input type="text" value={selectedP.category} onChange={(e) => updateProduct('category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                          <textarea value={selectedP.description} onChange={(e) => updateProduct('description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>

                        <div className="grid sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Pricing Type</label>
                            <select value={selectedP.pricingType} onChange={(e) => updateProduct('pricingType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                              <option value="free">Free</option>
                              <option value="freemium">Freemium</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price Display</label>
                            <input type="text" value={selectedP.price} onChange={(e) => updateProduct('price', e.target.value)} placeholder="e.g. Free tier available" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
                            <input type="number" step="0.1" min="0" max="5" value={selectedP.rating} onChange={(e) => updateProduct('rating', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                            <input type="text" value={selectedP.image} onChange={(e) => updateProduct('image', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Affiliate URL</label>
                            <input type="text" value={selectedP.affiliateUrl} onChange={(e) => updateProduct('affiliateUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Short URL</label>
                            <input type="text" value={selectedP.shortUrl} onChange={(e) => updateProduct('shortUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Features (one per line)</label>
                          <textarea value={selectedP.features.join('\n')} onChange={(e) => updateProduct('features', e.target.value.split('\n'))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Pros (one per line)</label>
                            <textarea value={selectedP.pros.join('\n')} onChange={(e) => updateProduct('pros', e.target.value.split('\n'))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-emerald-700" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Cons (one per line)</label>
                            <textarea value={selectedP.cons.join('\n')} onChange={(e) => updateProduct('cons', e.target.value.split('\n'))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-red-700" />
                          </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-400">
                            {dirty.has(`product-${selectedProduct}`) ? 'Unsaved changes' : 'All changes saved'}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={archiveProduct} className="text-xs border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
                              {selectedP.archived ? 'Restore from Archive' : 'Move to Archive'}
                            </button>
                            <button onClick={saveProduct} className="text-xs bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium">
                              Save & Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                      <div className="text-gray-300 mb-3">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      </div>
                      <p className="text-gray-400 text-sm">Select a product to edit, or add a new one</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---- Reviews Tab ---- */}
            {tab === 'reviews' && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="font-semibold text-gray-900 text-sm">Reviews ({reviews.length})</h2>
                      <button onClick={saveAllReviews} className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 font-medium">Save All</button>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      {reviews.map((r, i) => (
                        <button key={r.slug} onClick={() => selectReview(i)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedReview === i ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''
                          }`}>
                          <div className="font-medium text-gray-900 text-sm">{r.slug}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.content.length.toLocaleString()} chars</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {selectedReview >= 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900 text-sm">{reviews[selectedReview].slug}.md</h2>
                        <div className="flex gap-2">
                          <button onClick={deleteReview} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Delete</button>
                          <button onClick={() => setPreviewHtml(mdToHtml(editContent))} className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 font-medium">Preview</button>
                          <button onClick={saveReview} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 font-medium">Save & Download</button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                        <div className="p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-2">Markdown Editor</label>
                          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={28} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono leading-relaxed" />
                        </div>
                        <div className="p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-2">Preview</label>
                          <div className="prose prose-sm max-w-none bg-white rounded-lg border border-gray-200 p-4 min-h-[500px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400 text-sm">Select a review to edit</div>
                  )}
                </div>
              </div>
            )}

            {/* ---- Deploy Tab ---- */}
            {tab === 'deploy' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900">Deploy to Production</h2>
                  <p className="text-sm text-gray-500">Changes are saved to browser storage and downloaded as files. To deploy:</p>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Step 1: Save & Download</h3>
                    <p className="text-xs text-gray-500">Click "Save & Download" on each product/review. Files download to your computer.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Step 2: Send to Monica</h3>
                    <p className="text-xs text-gray-500">Share the downloaded files. Monica applies them to the source, builds, and deploys.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">Step 3: Verify</h3>
                    <p className="text-xs text-gray-500">Check the live site after deployment. Changes go live in under 60 seconds.</p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 text-sm mb-1">Current Version</h3>
                    <p className="text-sm text-orange-700">v1.7.0 — 50 products, 50 reviews, CMS admin, verified pricing</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 text-sm mb-1">Storage</h3>
                    <p className="text-xs text-blue-700">All edits are auto-saved to browser localStorage. Click "Clear Cache" in the header to reset.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
