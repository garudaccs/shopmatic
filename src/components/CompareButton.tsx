'use client';

import { useCompare } from '@/context/CompareContext';
import { ProductFull } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface CompareButtonProps {
  product: ProductFull;
  variant?: 'card' | 'inline' | 'icon';
}

export default function CompareButton({ product, variant = 'card' }: CompareButtonProps) {
  const { addProduct, removeProduct, isSelected } = useCompare();
  const router = useRouter();
  const selected = isSelected(product.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selected) {
      removeProduct(product.slug);
    } else {
      addProduct(product);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-lg transition-all duration-200 ${
          selected 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-indigo-100 hover:text-indigo-600'
        }`}
        title={selected ? 'Remove from comparison' : 'Add to comparison'}
      >
        <svg className="w-5 h-5" fill={selected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          selected 
            ? 'bg-indigo-600 text-white' 
            : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600'
        }`}
      >
        <svg className="w-4 h-4" fill={selected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {selected ? 'Remove' : 'Compare'}
      </button>
    );
  }

  // Default card variant
  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        selected 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400'
      }`}
    >
      <svg className="w-4 h-4" fill={selected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      {selected ? 'Added to Compare' : 'Add to Compare'}
    </button>
  );
}