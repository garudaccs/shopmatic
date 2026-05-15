export interface Product {
  alias: string;
  short_url: string;
  affiliate_url: string;
  title: string;
  channel_item_id: number;
}

export interface ProductFull {
  id: string;
  alias: string;
  title: string;
  slug: string;
  short_url: string;
  affiliate_url: string;
  description: string;
  tagline?: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: string;
  pricingType: 'free' | 'freemium' | 'paid';
  features: string[];
  pros: string[];
  cons: string[];
  faqs: { question: string; answer: string }[];
  image: string;
  relatedProducts: string[];
  pricingPlans?: { name: string; price: string }[];
  seoKeywords?: string[];
  editorPick?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}