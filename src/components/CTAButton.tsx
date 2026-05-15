'use client';

import { trackAffiliateClick } from '@/lib/analytics';

interface CTAButtonProps {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'large' | 'best-deal';
  className?: string;
  productSlug?: string;
}

export default function CTAButton({ text, url, variant = 'primary', className = '', productSlug }: CTAButtonProps) {
  const handleClick = () => {
    if (productSlug) {
      trackAffiliateClick(productSlug, url);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer';
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 shadow-sm hover:shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600 px-6 py-3 hover:-translate-y-0.5',
    large: 'bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1',
    'best-deal': 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 px-8 py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
      <svg 
        className="w-5 h-5 ml-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}
