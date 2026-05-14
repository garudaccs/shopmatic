interface CTAButtonProps {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'large';
  className?: string;
}

export default function CTAButton({ text, url, variant = 'primary', className = '' }: CTAButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3',
    secondary: 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 px-6 py-3',
    large: 'bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-4 text-lg shadow-lg hover:shadow-xl',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}