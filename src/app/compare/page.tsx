'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/products';
import { ProductFull } from '@/lib/types';
import { useCompare } from '@/context/CompareContext';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedProducts, clearAll } = useCompare();
  const [products, setProducts] = useState<ProductFull[]>([]);

  // Load all products for comparison
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  // Get products from URL params or context
  const compareProducts = useMemo(() => {
    const paramProducts = searchParams.get('products');
    
    if (paramProducts) {
      const slugs = paramProducts.split(',').filter(Boolean);
      return products.filter(p => slugs.includes(p.slug));
    }
    
    return selectedProducts;
  }, [searchParams, selectedProducts, products]);

  // Update URL when comparing from floating bar
  useEffect(() => {
    if (compareProducts.length > 0 && !searchParams.get('products')) {
      const slugs = compareProducts.map(p => p.slug).join(',');
      router.replace(`/compare?products=${slugs}`, { scroll: false });
    }
  }, [compareProducts, searchParams, router]);

  const removeProduct = (slug: string) => {
    const remaining = compareProducts.filter(p => p.slug !== slug);
    if (remaining.length > 0) {
      const slugs = remaining.map(p => p.slug).join(',');
      router.push(`/compare?products=${slugs}`, { scroll: false });
    } else {
      router.push('/compare', { scroll: false });
    }
  };

  if (compareProducts.length < 2) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Product Comparison</h1>
          <p className="text-slate-500 mb-6">
            Select at least 2 products to compare them side by side. You can add products from the product listing pages.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Browse Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Product Comparison</h1>
            <p className="text-slate-500">Compare {compareProducts.length} products side by side</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Add More Products
            </Link>
            <button
              onClick={() => {
                clearAll();
                router.push('/compare', { scroll: false });
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-slate-50 border-b border-slate-200 w-40">
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Product</span>
                </th>
                {compareProducts.map((product) => (
                  <th key={product.slug} className="p-4 bg-white border-b border-slate-200 min-w-[280px]">
                    <div className="relative">
                      {/* Remove button */}
                      <button
                        onClick={() => removeProduct(product.slug)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        title="Remove from comparison"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      {/* Product Image */}
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 mb-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Title */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors mb-2"
                      >
                        {product.title}
                      </Link>
                      
                      {/* Category Badge */}
                      <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        {product.category}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating Row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 border-b border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Rating</span>
                </td>
                {compareProducts.map((product, index) => (
                  <td key={product.slug} className={`p-4 border-b border-slate-100 ${index % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-400">({product.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-600">Price</span>
                </td>
                {compareProducts.map((product, index) => (
                  <td key={product.slug} className={`p-4 border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <div>
                      <span className="text-xl font-bold text-slate-800">{product.price}</span>
                      <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.pricingType === 'free' ? 'bg-emerald-100 text-emerald-700' :
                        product.pricingType === 'freemium' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {product.pricingType.charAt(0).toUpperCase() + product.pricingType.slice(1)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Key Features (Pros) Row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-600">Key Features</span>
                </td>
                {compareProducts.map((product, index) => (
                  <td key={product.slug} className={`p-4 border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <ul className="space-y-2">
                      {product.pros.slice(0, 4).map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-slate-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Cons Row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-600">Limitations</span>
                </td>
                {compareProducts.map((product, index) => (
                  <td key={product.slug} className={`p-4 border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <ul className="space-y-2">
                      {product.cons.slice(0, 3).map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-slate-600">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Visit Site CTA Row */}
              <tr>
                <td className="p-4 bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-600">Visit Site</span>
                </td>
                {compareProducts.map((product, index) => (
                  <td key={product.slug} className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <a
                      href={product.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                      Visit Site
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Stacked View */}
        <div className="md:hidden space-y-8">
          {compareProducts.map((product, productIndex) => (
            <div
              key={product.slug}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Product Header */}
              <div className="relative p-6 border-b border-slate-100">
                <button
                  onClick={() => removeProduct(product.slug)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove from comparison"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Link
                  href={`/products/${product.slug}`}
                  className="block text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors mb-2"
                >
                  {product.title}
                </Link>
                
                <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                  {product.category}
                </span>
              </div>

              {/* Comparison Data */}
              <div className="divide-y divide-slate-100">
                {/* Rating */}
                <div className="p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</span>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Price</span>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-slate-800">{product.price}</span>
                    <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                      product.pricingType === 'free' ? 'bg-emerald-100 text-emerald-700' :
                      product.pricingType === 'freemium' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {product.pricingType.charAt(0).toUpperCase() + product.pricingType.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Key Features</span>
                  <ul className="space-y-2 mt-2">
                    {product.pros.slice(0, 4).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                <div className="p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Limitations</span>
                  <ul className="space-y-2 mt-2">
                    {product.cons.slice(0, 3).map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-600">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visit Site */}
                <div className="p-4">
                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add to comparison prompt */}
        {compareProducts.length < 3 && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-600 mb-4">
              Want to add more products to this comparison?
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse More Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading comparison...</div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}