'use client';

import { useState, useEffect } from 'react';

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
}

interface ReviewData {
  slug: string;
  frontmatter: Record<string, string | string[] | number>;
  content: string;
  raw: string;
}

type Tab = 'products' | 'reviews' | 'deploy';

const ADMIN_PASS = 'shopmatic2026';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    loadData();
  }, [authed]);

  async function loadData() {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        fetch('/data/admin-products.json'),
        fetch('/data/admin-reviews.json'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData);
      }
    } catch {
      setStatus('Loaded with cached data');
    } finally {
      setLoading(false);
    }
  }

  function simpleMarkdownToHtml(md: string): string {
    let html = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>');
    return `<p>${html}</p>`.replace(/<p><\/p>/g, '');
  }

  function handleLogin() {
    if (passInput === ADMIN_PASS) {
      setAuthed(true);
    } else {
      setStatus('Wrong password');
    }
  }

  function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`Downloaded ${filename}`);
  }

  function handleProductChange(field: string, value: string | number | string[]) {
    if (selectedProduct < 0) return;
    const updated = [...products];
    (updated[selectedProduct] as any)[field] = value;
    setProducts(updated);
  }

  function saveProductsJson() {
    downloadFile('admin-products.json', JSON.stringify(products, null, 2));
  }

  function saveReviewMd() {
    if (selectedReview < 0) return;
    downloadFile(`${reviews[selectedReview].slug}.md`, editContent);
  }

  // ---- Login Screen ----
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">Shopmatic Admin</h1>
          <p className="text-gray-500 text-sm text-center mb-6">Enter password to continue</p>
          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Login
          </button>
          {status && <p className="text-red-500 text-sm text-center mt-3">{status}</p>}
        </div>
      </div>
    );
  }

  // ---- Main Admin ----
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-gray-900">Shopmatic Admin</span>
            </div>
            <button onClick={() => setAuthed(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {(['products', 'reviews', 'deploy'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {status && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm flex justify-between items-center">
            <span>{status}</span>
            <button onClick={() => setStatus('')} className="text-emerald-500 hover:text-emerald-700">x</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading data...</div>
        ) : (
          <>
            {/* ---- Products Tab ---- */}
            {tab === 'products' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="font-semibold text-gray-900 text-sm">Products ({products.length})</h2>
                      <button onClick={saveProductsJson} className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">
                        Download JSON
                      </button>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      {products.map((p, i) => (
                        <button
                          key={p.slug}
                          onClick={() => setSelectedProduct(i)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedProduct === i ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''
                          }`}
                        >
                          <div className="font-medium text-gray-900 text-sm">{p.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              p.pricingType === 'free' ? 'bg-emerald-100 text-emerald-700' :
                              p.pricingType === 'freemium' ? 'bg-sky-100 text-sky-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{p.pricingType}</span>
                            <span>{p.category}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Editor */}
                <div className="lg:col-span-2">
                  {selectedProduct >= 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">Edit: {products[selectedProduct].title}</h2>
                        <span className="text-xs text-gray-400">{products[selectedProduct].slug}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                          <input type="text" value={products[selectedProduct].title}
                            onChange={(e) => handleProductChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                          <input type="text" value={products[selectedProduct].category}
                            onChange={(e) => handleProductChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Pricing Type</label>
                          <select value={products[selectedProduct].pricingType}
                            onChange={(e) => handleProductChange('pricingType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                            <option value="free">Free</option>
                            <option value="freemium">Freemium</option>
                            <option value="paid">Paid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Price Display</label>
                          <input type="text" value={products[selectedProduct].price}
                            onChange={(e) => handleProductChange('price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
                          <input type="number" step="0.1" min="0" max="5" value={products[selectedProduct].rating}
                            onChange={(e) => handleProductChange('rating', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                          <input type="text" value={products[selectedProduct].image}
                            onChange={(e) => handleProductChange('image', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <textarea value={products[selectedProduct].description}
                          onChange={(e) => handleProductChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Affiliate URL</label>
                          <input type="text" value={products[selectedProduct].affiliateUrl}
                            onChange={(e) => handleProductChange('affiliateUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Short URL</label>
                          <input type="text" value={products[selectedProduct].shortUrl}
                            onChange={(e) => handleProductChange('shortUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Features (one per line)</label>
                        <textarea value={products[selectedProduct].features.join('\n')}
                          onChange={(e) => handleProductChange('features', e.target.value.split('\n'))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Pros (one per line)</label>
                          <textarea value={products[selectedProduct].pros.join('\n')}
                            onChange={(e) => handleProductChange('pros', e.target.value.split('\n'))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Cons (one per line)</label>
                          <textarea value={products[selectedProduct].cons.join('\n')}
                            onChange={(e) => handleProductChange('cons', e.target.value.split('\n'))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                      Select a product to edit
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---- Reviews Tab ---- */}
            {tab === 'reviews' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Review List */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-900 text-sm">Reviews ({reviews.length})</h2>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      {reviews.map((r, i) => (
                        <button
                          key={r.slug}
                          onClick={() => {
                            setSelectedReview(i);
                            setEditContent(r.raw);
                            setPreviewHtml(simpleMarkdownToHtml(r.content));
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedReview === i ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''
                          }`}
                        >
                          <div className="font-medium text-gray-900 text-sm">{r.slug}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.content.length} chars</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Editor */}
                <div className="lg:col-span-2">
                  {selectedReview >= 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900 text-sm">{reviews[selectedReview].slug}.md</h2>
                        <div className="flex gap-2">
                          <button onClick={() => setPreviewHtml(simpleMarkdownToHtml(editContent.replace(/^---[\s\S]*?---\n*/, '')))}
                            className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300">
                            Preview
                          </button>
                          <button onClick={saveReviewMd}
                            className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">
                            Download MD
                          </button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                        <div className="p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-2">Markdown Editor</label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={25}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono leading-relaxed"
                          />
                        </div>
                        <div className="p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-2">Preview</label>
                          <div
                            className="prose prose-sm max-w-none bg-white rounded-lg border border-gray-200 p-4 min-h-[400px] overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                      Select a review to edit
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---- Deploy Tab ---- */}
            {tab === 'deploy' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Deploy to Production</h2>
                    <p className="text-sm text-gray-500">
                      Since Shopmatic is a static site, deployments are done from the server. Here's the workflow:
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm">Step 1: Download edited files</h3>
                    <p className="text-xs text-gray-500">Use the Products or Reviews tab to download updated JSON/MD files.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm">Step 2: Update source files</h3>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-3 text-xs font-mono space-y-1">
                      <div># Copy downloaded files to project</div>
                      <div>cp admin-products.json src/data/</div>
                      <div>cp *.md content/products/</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm">Step 3: Build and deploy</h3>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-3 text-xs font-mono space-y-1">
                      <div>cd ~/Projects/shopmatic</div>
                      <div>npm run build</div>
                      <div>npx wrangler pages deploy out --project-name=shopmatic</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 text-sm mb-1">Current Version</h3>
                    <p className="text-sm text-orange-700">v1.6.0 — 50 products, 50 reviews, verified pricing</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 text-sm mb-1">Auto-deploy (future)</h3>
                    <p className="text-xs text-blue-700">
                      To enable auto-deploy from this admin panel, add a GitHub token and Cloudflare API key. 
                      The admin can then commit to GitHub and trigger Cloudflare Pages rebuild directly.
                    </p>
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
