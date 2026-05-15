// Google Analytics 4 utilities for Shopmatic
// GA4 Measurement ID - replace with actual ID when available
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Check if GA is available
const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
};

// Track page view
export const trackPageView = (url: string) => {
  if (isGAAvailable()) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, { page_path: url });
  }
};

// Track custom event
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (isGAAvailable()) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track affiliate link click
export const trackAffiliateClick = (productSlug: string, affiliateUrl: string) => {
  trackEvent('affiliate_click', 'engagement', productSlug);
  if (isGAAvailable()) {
    (window as any).gtag('event', 'affiliate_click', {
      product_slug: productSlug,
      affiliate_url: affiliateUrl,
    });
  }
};

// Track product page view
export const trackProductView = (productSlug: string, productName: string) => {
  trackEvent('product_view', 'engagement', productName);
  if (isGAAvailable()) {
    (window as any).gtag('event', 'product_view', {
      product_slug: productSlug,
      product_name: productName,
    });
  }
};

// Track search
export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('search', 'engagement', query, resultCount);
};

// Track category filter
export const trackCategoryFilter = (category: string) => {
  trackEvent('filter_category', 'engagement', category);
};

// Track newsletter signup
export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', 'conversion');
};
