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
    primary: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-6 py-3 shadow-sm hover:shadow-md hover:shadow-[#2563eb]/20 hover:-translate-y-0.5',
    secondary: 'bg-white text-[#2563eb] border-2 border-[#2563eb] hover:bg-blue-50 px-6 py-3 hover:-translate-y-0.5',
    large: 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-10 py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-[#2563eb]/20 hover:-translate-y-1',
    'best-deal': 'bg-gradient-to-r from-[#059669] to-[#10b981] text-white hover:from-[#047857] hover:to-[#059669] px-8 py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 animate-pulse-subtle',
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
        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}