import Link from 'next/link';
import { ProductFull } from '@/lib/types';

interface ProductCardProps {
  product: ProductFull;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const pricingBadge = {
    free: { bg: 'bg-green-100', text: 'text-green-700', label: 'Free' },
    freemium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Freemium' },
    paid: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Paid' },
  };

  const badge = pricingBadge[product.pricingType];

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'ring-2 ring-indigo-600' : ''}`}
    >
{/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 ${badge.bg} ${badge.text} text-xs font-semibold px-2 py-1 rounded-full`}>
          {badge.label}
        </span>
        {product.tagline && (
          <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            {product.tagline.substring(0, 30)}...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">{product.category}</span>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="ml-1 text-sm font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{product.price}</span>
          <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg group-hover:bg-indigo-700 transition-colors">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}