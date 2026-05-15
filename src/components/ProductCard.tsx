import Link from 'next/link';
import { ProductFull } from '@/lib/types';
import EditorPickBadge from './EditorPickBadge';

interface ProductCardProps {
  product: ProductFull;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const pricingBadge = {
    free: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Free' },
    freemium: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Freemium' },
    paid: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Paid' },
  };

  const badge = pricingBadge[product.pricingType];

  // Generate star rating display
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-[#2563eb]/30 flex flex-col h-full ${featured ? 'ring-2 ring-[#2563eb]/20' : ''}`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Pricing Badge */}
        <span className={`absolute top-3 left-3 ${badge.bg} ${badge.text} ${badge.border} border text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>
          {badge.label}
        </span>
        
        {/* Editor's Pick Badge */}
        {product.editorPick && (
          <div className="absolute top-3 right-3">
            <EditorPickBadge variant="compact" />
          </div>
        )}
      </div>

      {/* Content - flex-1 pushes footer to bottom */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
            {product.category}
          </span>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              {hasHalfStar && (
                <svg className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id={`halfStar-${product.slug}`} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#e2e8f0" />
                    </linearGradient>
                  </defs>
                  <path fill={`url(#halfStar-${product.slug})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Product Title - fixed 2 lines */}
        <h3 className="font-bold text-slate-800 mb-2 group-hover:text-[#2563eb] transition-colors duration-200 text-base leading-snug" style={{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.5rem'}}>
          {product.title}
        </h3>
        
        {/* Product Description - fixed 2 lines */}
        <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1" style={{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'2.5rem'}}>
          {product.description}
        </p>

        {/* Price & CTA - always at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Starting from</span>
            <span className="text-base font-bold text-slate-800 whitespace-nowrap">{product.price}</span>
          </div>
          
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2563eb] text-white text-sm font-semibold rounded-xl group-hover:bg-[#1d4ed8] transition-all duration-200 shadow-sm group-hover:shadow-md group-hover:shadow-[#2563eb]/20 whitespace-nowrap">
            Details
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}