'use client';

import { useCompare } from '@/context/CompareContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CompareBar() {
  const { selectedProducts, removeProduct, clearAll } = useCompare();
  const router = useRouter();

  if (selectedProducts.length === 0) {
    return null;
  }

  const handleCompare = () => {
    const slugs = selectedProducts.map(p => p.slug).join(',');
    router.push(`/compare?products=${slugs}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Selected products count and thumbnails */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Compare ({selectedProducts.length}/3)
              </span>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedProducts.map((product) => (
                  <div
                    key={product.slug}
                    className="relative flex-shrink-0 group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeProduct(product.slug)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap">
                      {product.title.length > 12 ? `${product.title.substring(0, 12)}...` : product.title}
                    </span>
                  </div>
                ))}
                
                {/* Add more indicator */}
                {selectedProducts.length < 3 && (
                  <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Clear All
              </button>
              
              <button
                onClick={handleCompare}
                disabled={selectedProducts.length < 2}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedProducts.length >= 2
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Compare Selected
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to prevent content overlap */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}