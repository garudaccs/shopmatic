import { Product, ProductFull, Category } from './types';
import allProductsData from '@/data/all_products.json';
import researchData from '@/data/products_research.json';

// Type for the raw products data
type RawProducts = Record<string, {
  alias: string;
  short_url: string;
  affiliate_url: string;
  title: string;
  channel_item_id: number;
}>;

// Type for research data items
type ResearchItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: {
    free: boolean;
    starting_price: string;
    plans: { name: string; price: string }[];
  };
  rating: number;
  category: string;
  seo_keywords: string[];
  affiliate_url: string;
};

// Convert raw products to proper format
const allProducts = allProductsData as RawProducts;
const researchItems = researchData as ResearchItem[];

// Create a lookup map for research data
const researchMap = new Map<string, ResearchItem>();
researchItems.forEach(item => {
  researchMap.set(item.slug, item);
});

// Category mapping
const categoryMap: Record<string, string> = {
  'AI Tools': 'AI Tools',
  'Developer Tools': 'Development',
  'Marketing': 'Marketing',
  'Productivity': 'Productivity',
  'Design': 'Design',
  'Education': 'Education',
  'Hosting': 'Cloud & Hosting',
  'Video': 'Video',
  'Cloud Services': 'Cloud & Hosting',
  'General': 'AI Tools',
};

// Default descriptions for products without research data
const defaultDescriptions: Record<string, string> = {
  'MFXfy': 'AI-powered messaging platform for customer engagement and team collaboration.',
  'contabo': 'Reliable cloud hosting provider offering VPS, dedicated servers, and web hosting solutions.',
  'ninjachat': 'AI chatbot builder for creating custom chatbots without coding knowledge.',
  'wisprflow': 'AI-powered typing assistant that helps you write faster by learning your writing style.',
  'grammarly': 'AI-powered writing assistant for clear communication across all platforms.',
  'ilh': 'Online learning platform for building skills and achieving your goals.',
  'wealthy': 'Personal finance platform for wealth building and investment tracking.',
  'amazon': 'Global e-commerce platform with millions of products and fast shipping.',
  'perplexity': 'AI-powered search engine that provides direct answers with cited sources.',
  'gamma': 'AI-powered presentation tool for creating stunning presentations and documents.',
  'appsumo': 'Software deals marketplace offering exclusive lifetime deals for entrepreneurs.',
  'namecheap': 'Domain registrar and web hosting with competitive pricing.',
  'impact': 'Partner marketing platform for managing influencer and affiliate programs.',
  'blinkist': 'Book summary service that condenses non-fiction books into 15-minute reads.',
  'envato-placeit': 'Online mockup generator for showcasing designs in real-world contexts.',
  'getresponse': 'Email marketing platform with automation and CRM features.',
  'filmora': 'Easy-to-use video editing software with AI-powered features.',
  'brevo': 'All-in-one marketing platform for email, SMS, chat, and CRM.',
  'seowriting': 'AI-powered SEO writing tool for creating optimized content.',
  'envato': 'Digital marketplace for templates, plugins, graphics, and more.',
  'insecureweb': 'Dark web monitoring service that alerts you if your data is compromised.',
  'uptimerobot': 'Free website monitoring service that checks your site every 30 seconds.',
  'piktochart': 'Infographic and visual design tool for creating stunning graphics.',
  'wispr': 'AI-powered voice typing tool for hands-free writing.',
  'windsurf': 'AI-powered code editor with intelligent coding assistant.',
  'bolt': 'AI-powered web development platform for building apps in the browser.',
  'replit': 'Online IDE with AI-powered development capabilities.',
  'lovable': 'AI-powered app builder for creating production-ready web applications.',
  'teamgpt': 'AI workspace for teams to collaborate and automate workflows.',
  'netdata': 'Real-time monitoring and troubleshooting platform for infrastructure.',
  'make': 'Automation platform that connects apps and automates workflows without code.',
  'railway': 'Modern cloud platform for building, deploying, and monitoring applications.',
  'campfire': 'Community platform for learning and discussing business strategies.',
  'elevenlabs': 'AI voice generation platform for creating realistic synthetic voices.',
  'warp': 'AI-powered terminal that makes command line interfaces more productive.',
  'clawcloud': 'Cloud hosting provider with competitive pricing and global reach.',
  'mindvalley': 'Personal development platform with expert-led courses and quests.',
  'loom': 'Video messaging platform for async communication and collaboration.',
  'kling': 'AI video generation platform for creating stunning visuals from text.',
  'publit': 'Media asset management platform for organizing and distributing content.',
  'offers': 'Deal aggregation platform for finding the best software discounts.',
  'racknerd': 'Affordable VPS and dedicated server hosting provider.',
  'getzai': 'AI-powered coding assistant with advanced code generation capabilities.',
  'supercut': 'AI-powered video editing tool that creates highlight reels automatically.',
  'camo': 'Software for streaming video content with professional quality.',
  'skool': 'Community platform for creators and educators to build engaged communities.',
  'qoder': 'AI-powered coding assistant that helps developers write better code.',
  'synthetic': 'AI platform for creating and managing synthetic media content.',
  'lennys': 'Newsletter platform connecting readers with curated content.',
  'minimax': 'AI platform offering advanced language models and video generation tools.',
};

// Default features for products without research data
const defaultFeatures: Record<string, string[]> = {
  'MFXfy': ['AI messaging', 'Team collaboration', 'API access', 'Custom workflows'],
  'contabo': ['VPS hosting', 'Dedicated servers', 'SSD storage', '24/7 support', 'Multiple locations'],
  'ninjachat': ['AI chatbot builder', 'No-code interface', 'Multi-platform', 'Analytics', 'Templates'],
  'wisprflow': ['Real-time AI suggestions', 'Learns your style', 'Cross-platform support', 'Privacy-focused'],
  'grammarly': ['Grammar checking', 'Plagiarism detection', 'Tone detection', 'Style suggestions'],
  'ilh': ['Online courses', 'Expert instructors', 'Certificates', 'Community access', 'Mobile learning'],
  'wealthy': ['Investment tracking', 'Budget planning', 'Goal setting', 'Portfolio analysis', 'Financial education'],
  'amazon': ['Product reviews', 'Price comparison', 'Wish lists', 'Prime benefits', 'Global shipping'],
  'perplexity': ['Real-time answers', 'Cited sources', 'Follow-up questions', 'Image understanding', 'Privacy focused'],
  'gamma': ['AI-generated designs', 'One-click formatting', 'Interactive embeds', 'Team collaboration', 'Brand kit'],
  'appsumo': ['Lifetime deals', 'Software discounts', 'Exclusive offers', 'Deal alerts', 'Community access'],
  'namecheap': ['Domain registration', 'Web hosting', 'Email hosting', 'SSL certificates', 'Site builder'],
  'impact': ['Affiliate tracking', 'Influencer management', 'Partnership automation', 'Fraud detection', 'Reporting'],
  'blinkist': ['15-minute summaries', 'Reading lists', 'Offline access', 'Audio versions', 'Bookmarks'],
  'envato-placeit': ['Mockup templates', 'Device mockups', 'App mockups', 'Fashion mockups', 'Easy customization'],
  'getresponse': ['Email campaigns', 'Landing pages', 'Marketing automation', 'Webinars', 'Analytics'],
  'filmora': ['AI-powered editing', 'Effects library', 'Audio editing', 'Color grading', 'Export options'],
  'brevo': ['Email marketing', 'SMS campaigns', 'Live chat', 'Marketing automation', 'CRM integration'],
  'seowriting': ['SEO optimization', 'Content briefs', 'Keyword research', 'Plagiarism checker', 'Readability scoring'],
  'envato': ['Design templates', 'Stock assets', 'Font library', 'Plugin marketplace', 'Author revenue share'],
  'insecureweb': ['Dark web scanning', 'Data breach alerts', 'Identity monitoring', '24/7 surveillance', 'Instant notifications'],
  'uptimerobot': ['99.9% uptime checks', 'Email alerts', 'SMS alerts', 'Status pages', 'Public dashboard'],
  'piktochart': ['Infographic templates', 'Presentation templates', 'Report templates', 'Custom branding', 'Team sharing'],
  'wispr': ['Voice typing', 'Multi-language', 'Privacy focused', 'Smart punctuation', 'Custom commands'],
  'windsurf': ['AI autocomplete', 'Cascade AI agent', 'Natural language code', 'Project-wide context', 'Multi-language'],
  'bolt': ['Browser-based development', 'AI-assisted coding', 'One-click deployment', 'Instant sandbox', 'Terminal access'],
  'replit': ['Browser-based IDE', 'AI Agent', 'One-click deployment', 'Real-time collaboration', '50+ languages'],
  'lovable': ['Natural language building', 'Full-stack generation', 'Real-time preview', 'Git integration', 'One-click deploy'],
  'teamgpt': ['Team workspace', 'AI assistants', 'Workflow automation', 'Document collaboration', 'Integration'],
  'netdata': ['Real-time monitoring', 'Alerting system', 'Auto-scaling', 'Historical data', 'API integration'],
  'make': ['Visual automation builder', '300+ integrations', 'Real-time triggers', 'Data mapping', 'Error handling'],
  'railway': ['One-click deploy', 'Custom domains', 'Database support', 'Analytics dashboard', 'Team collaboration'],
  'campfire': ['Business courses', 'Community discussion', 'Live sessions', 'Networking', 'Resources'],
  'elevenlabs': ['Text-to-speech', 'Voice cloning', 'AI dubbing', 'Voice design', 'Emotional synthesis', 'API access'],
  'warp': ['AI-powered terminal', 'Smart completions', 'Block history', 'Themes', 'Cross-platform'],
  'clawcloud': ['Cloud compute', 'Storage solutions', 'CDN included', 'Global network', 'Scalable pricing'],
  'mindvalley': ['Expert-led quests', 'Daily 20-minute lessons', 'Mobile app', 'Certificate', 'Community access'],
  'loom': ['Screen recording', 'Video hosting', 'GIF export', 'Comments on video', 'Team workspaces'],
  'kling': ['Text-to-video', 'Image animation', 'Video editing', 'Style transfer', 'High resolution', 'Lip sync'],
  'publit': ['Asset library', 'Digital rights management', 'Distribution channels', 'Analytics', 'Watermarking'],
  'offers': ['Deal aggregation', 'Price tracking', 'Category filters', 'Favorite lists', 'Deal alerts'],
  'racknerd': ['Budget VPS', 'Multiple locations', 'Custom configs', 'DDoS protection', '24/7 support'],
  'getzai': ['Code generation', 'Documentation', 'Debugging help', 'Code review', 'Multi-language support'],
  'supercut': ['Auto highlights', 'Multiple formats', 'Social media optimization', 'Brand templates', 'Batch processing'],
  'camo': ['High quality streaming', 'Multi-camera', 'Scene transitions', 'Overlays', 'RTMP support'],
  'skool': ['Community building', 'Course hosting', 'Member management', 'Discussion forums', 'Gamification'],
  'qoder': ['Code generation', 'Debug assistance', 'Documentation help', 'Code review', 'Multi-language support'],
  'synthetic': ['Media generation', 'Content moderation', 'Style customization', 'API access', 'Batch processing'],
  'lennys': ['Newsletter hosting', 'Subscriber management', 'Analytics', 'Custom branding', 'Paywall options'],
  'minimax': ['Text-to-video', 'Image-to-video', 'Multiple styles', 'High resolution', 'API access', 'Fast processing'],
};

// Default pricing for products without research data
const defaultPricing: Record<string, { price: string; type: 'free' | 'freemium' | 'paid' }> = {
  'MFXfy': { price: 'Contact for pricing', type: 'paid' },
  'contabo': { price: '$6.99/month', type: 'paid' },
  'ninjachat': { price: 'Free tier available', type: 'freemium' },
  'wisprflow': { price: 'Free tier available', type: 'freemium' },
  'grammarly': { price: '$12/month', type: 'paid' },
  'ilh': { price: 'Per course pricing', type: 'paid' },
  'wealthy': { price: 'Free tier available', type: 'freemium' },
  'amazon': { price: '$14.99/month (Prime)', type: 'paid' },
  'perplexity': { price: '$20/month (Pro)', type: 'freemium' },
  'gamma': { price: '$9/month', type: 'freemium' },
  'appsumo': { price: 'Free membership', type: 'freemium' },
  'namecheap': { price: '$1.98/month', type: 'paid' },
  'impact': { price: 'Contact for pricing', type: 'paid' },
  'blinkist': { price: '$9.99/month', type: 'paid' },
  'envato-placeit': { price: '$9.99/month', type: 'paid' },
  'getresponse': { price: 'Free up to 250 contacts', type: 'freemium' },
  'filmora': { price: '$49.99/year', type: 'paid' },
  'brevo': { price: 'Free up to 250 contacts', type: 'freemium' },
  'seowriting': { price: '$29/month', type: 'paid' },
  'envato': { price: 'Per item pricing', type: 'paid' },
  'insecureweb': { price: '$9.99/month', type: 'paid' },
  'uptimerobot': { price: 'Free', type: 'free' },
  'piktochart': { price: 'Free tier available', type: 'freemium' },
  'wispr': { price: '$9/month', type: 'paid' },
  'windsurf': { price: 'Free', type: 'free' },
  'bolt': { price: 'Free tier available', type: 'freemium' },
  'replit': { price: 'Free tier available', type: 'freemium' },
  'lovable': { price: 'Free tier available', type: 'freemium' },
  'teamgpt': { price: 'Contact for pricing', type: 'paid' },
  'netdata': { price: 'Free open source', type: 'free' },
  'make': { price: 'Free tier available', type: 'freemium' },
  'railway': { price: '$5/month starting', type: 'freemium' },
  'campfire': { price: '$29/month', type: 'paid' },
  'elevenlabs': { price: '$6/month starting', type: 'freemium' },
  'warp': { price: 'Free tier available', type: 'freemium' },
  'clawcloud': { price: 'Starting $4.99/month', type: 'paid' },
  'mindvalley': { price: '$199/year', type: 'paid' },
  'loom': { price: 'Free tier available', type: 'freemium' },
  'kling': { price: 'Free tier available', type: 'freemium' },
  'publit': { price: 'Contact for pricing', type: 'paid' },
  'offers': { price: 'Free to use', type: 'free' },
  'racknerd': { price: '$14.99/year starting', type: 'paid' },
  'getzai': { price: 'Free tier available', type: 'freemium' },
  'supercut': { price: '$29/month', type: 'paid' },
  'camo': { price: '$39.99 one-time', type: 'paid' },
  'skool': { price: 'Free for community owners', type: 'freemium' },
  'qoder': { price: 'Free tier available', type: 'freemium' },
  'synthetic': { price: 'Contact for pricing', type: 'paid' },
  'lennys': { price: 'Free tier available', type: 'freemium' },
  'minimax': { price: '$9.99/month starting', type: 'freemium' },
};

// Get related products for a slug
function getRelatedProducts(slug: string): string[] {
  const product = Object.values(allProducts).find(p => p.alias === slug);
  if (!product) return [];
  
  // Find products in same category or random selection
  const currentResearch = researchMap.get(slug);
  const currentCategory = currentResearch?.category || 'AI Tools';
  
  const related: string[] = [];
  
  // First, get products from same category
  for (const [key, research] of researchMap.entries()) {
    if (research.category === currentCategory && key !== slug) {
      related.push(key);
    }
  }
  
  // If not enough, add products from all products
  for (const [key, prod] of Object.entries(allProducts)) {
    if (key !== slug && !related.includes(key)) {
      related.push(key);
    }
  }
  
  return related.slice(0, 4);
}

// Get all products as array
export function getAllProducts(): ProductFull[] {
  return Object.values(allProducts).map((product) => {
    const slug = product.alias;
    const research = researchMap.get(slug);
    
    // Use research data if available
    if (research) {
      return {
        id: product.channel_item_id.toString(),
        alias: product.alias,
        title: research.name,
        slug: slug,
        short_url: product.short_url,
        affiliate_url: research.affiliate_url || product.affiliate_url,
        description: research.description || defaultDescriptions[slug] || `${research.name} - A comprehensive tool for modern workflows.`,
        tagline: research.tagline || '',
        category: categoryMap[research.category] || research.category || 'AI Tools',
        rating: research.rating || 4.0,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        price: research.pricing.starting_price || 'Varies',
        pricingType: research.pricing.free ? 'free' : (research.pricing.starting_price.includes('Free') ? 'freemium' : 'paid') as 'free' | 'freemium' | 'paid',
        features: research.features || defaultFeatures[slug] || ['Standard features'],
        pros: research.features?.slice(0, 4).map(f => `Excellent ${f.toLowerCase()}`) || ['Feature-rich', 'Easy to use', 'Good value'],
        cons: ['Some limitations', 'Learning curve', 'Premium features require subscription'],
        faqs: [
          { question: 'Is this tool worth it?', answer: 'This depends on your specific needs. We recommend trying the free tier first.' },
          { question: 'Does it have a free version?', answer: 'Most tools offer free tiers or trials. Check the specific product page for current pricing.' },
        ],
        image: `/images/products/${slug}-card.svg`,
        relatedProducts: getRelatedProducts(slug),
        pricingPlans: research.pricing.plans || [],
        seoKeywords: research.seo_keywords || [],
      };
    }
    
    // Fallback for products without research data
    const pricing = defaultPricing[slug] || { price: 'Varies', type: 'freemium' as const };
    return {
      id: product.channel_item_id.toString(),
      alias: product.alias,
      title: product.title.replace(/^https?:\/\/[^\\/]*\/?/gi, '').replace(/^Join\s+/i, '').replace(/\s*[:\-]\s*.*$/i, '').replace(/\.{3,}/g, '').trim() || slug,
      slug: slug,
      short_url: product.short_url,
      affiliate_url: product.affiliate_url,
      description: defaultDescriptions[slug] || `${slug} - A comprehensive tool for modern workflows.`,
      tagline: '',
      category: 'AI Tools',
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      price: pricing.price,
      pricingType: pricing.type,
      features: defaultFeatures[slug] || ['Standard features', 'Easy to use', 'Reliable performance'],
      pros: ['Feature-rich', 'Easy to use', 'Good value'],
      cons: ['Some limitations', 'Learning curve'],
      faqs: [
        { question: 'Is this tool worth it?', answer: 'This depends on your specific needs. We recommend trying the free tier first.' },
        { question: 'Does it have a free version?', answer: 'Most tools offer free tiers or trials. Check the specific product page for current pricing.' },
      ],
      image: `/images/products/${slug}-card.svg`,
      relatedProducts: getRelatedProducts(slug),
      pricingPlans: [],
      seoKeywords: [],
    };
  });
}

// Get product by slug
export function getProductBySlug(slug: string): ProductFull | undefined {
  const products = getAllProducts();
  return products.find(p => p.slug === slug);
}

// Get products by category
export function getProductsByCategory(category: string): ProductFull[] {
  const products = getAllProducts();
  const categorySlugMap: Record<string, string[]> = {
    'ai-tools': ['AI Tools'],
    'development': ['Development', 'Developer Tools'],
    'marketing': ['Marketing'],
    'design': ['Design'],
    'video': ['Video'],
    'cloud-hosting': ['Cloud & Hosting', 'Cloud Services', 'Hosting'],
    'productivity': ['Productivity'],
    'education': ['Education'],
    'deals': ['Deals'],
  };
  
  const targetCategories = categorySlugMap[category] || [category];
  return products.filter(p => targetCategories.includes(p.category));
}

// Search products
export function searchProducts(query: string): ProductFull[] {
  const products = getAllProducts();
  const searchLower = query.toLowerCase();
  
  return products.filter(p => 
    p.title.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower) ||
    p.category.toLowerCase().includes(searchLower) ||
    p.features.some(f => f.toLowerCase().includes(searchLower)) ||
    (p.tagline && p.tagline.toLowerCase().includes(searchLower))
  );
}

// Get featured products (top rated)
export function getFeaturedProducts(limit: number = 8): ProductFull[] {
  const products = getAllProducts();
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Categories
export const categories: Category[] = [
  { id: 'ai-tools', name: 'AI Tools', slug: 'ai-tools', description: 'Artificial intelligence and machine learning tools for productivity and automation', icon: '🤖', productCount: 15 },
  { id: 'development', name: 'Development', slug: 'development', description: 'Developer tools, IDEs, and coding assistants', icon: '💻', productCount: 8 },
  { id: 'marketing', name: 'Marketing', slug: 'marketing', description: 'Email marketing, automation, and affiliate tools', icon: '📢', productCount: 3 },
  { id: 'design', name: 'Design', slug: 'design', description: 'Design tools, templates, and creative assets', icon: '🎨', productCount: 4 },
  { id: 'video', name: 'Video', slug: 'video', description: 'Video editing, recording, and streaming tools', icon: '🎬', productCount: 4 },
  { id: 'cloud-hosting', name: 'Cloud & Hosting', slug: 'cloud-hosting', description: 'Web hosting, VPS, and cloud infrastructure', icon: '☁️', productCount: 4 },
  { id: 'productivity', name: 'Productivity', slug: 'productivity', description: 'Tools for improving workflow and efficiency', icon: '⚡', productCount: 3 },
  { id: 'education', name: 'Education', slug: 'education', description: 'Online courses, learning platforms, and educational resources', icon: '📚', productCount: 5 },
  { id: 'deals', name: 'Deals', slug: 'deals', description: 'Exclusive deals, discounts, and offers on software', icon: '🏷️', productCount: 2 },
];

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

// Get all categories
export function getAllCategories(): Category[] {
  return categories;
}

// Get product count for each category
export function getCategoryProductCounts(): Record<string, number> {
  const products = getAllProducts();
  const counts: Record<string, number> = {};
  
  for (const product of products) {
    const catSlug = product.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
    counts[catSlug] = (counts[catSlug] || 0) + 1;
  }
  
  return counts;
}

// Export for checking total products
export const totalProducts = Object.keys(allProducts).length;