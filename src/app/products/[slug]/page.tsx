import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import CTAButton from '@/components/CTAButton';
import FAQAccordion from '@/components/FAQAccordion';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Helper to convert markdown to basic HTML
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul tags
  const listSections = html.split('\n').reduce((acc, line) => {
    if (line.startsWith('<li>')) {
      acc.push(line);
    } else {
      if (acc.length > 0) {
        html = html.replace(acc.join(''), '<ul>' + acc.join('') + '</ul>');
        acc = [];
      }
    }
    return acc;
  }, [] as string[]);
  
  // Wrap remaining list items
  if (listSections.length > 0) {
    html = html.replace(listSections.join(''), '<ul>' + listSections.join('') + '</ul>');
  }
  
  // Tables (simple conversion)
  const tableRegex = /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match: string, header: string, rows: string) => {
    const headers = header.split('|').filter((h: string) => h.trim());
    const headerHtml = headers.map((h: string) => `<th>${h.trim()}</th>`).join('');
    const rowLines = rows.trim().split('\n');
    const bodyHtml = rowLines.map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td>${c.trim()}</td>`).join('')}</tr>`;
    }).join('');
    return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
  });
  
  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  
  return html;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.description,
    keywords: product.seoKeywords || [],
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.relatedProducts
    .map((relatedSlug) => getProductBySlug(relatedSlug))
    .filter(Boolean)
    .slice(0, 4);

  const pricingBadge = {
    free: { bg: 'bg-green-100', text: 'text-green-700', label: 'Free' },
    freemium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Freemium' },
    paid: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Paid' },
  };

  const badge = pricingBadge[product.pricingType];

  // Try to load markdown content
  let markdownContent = '';
  const markdownPath = path.join(process.cwd(), 'content', 'products', `${slug}.md`);
  
  try {
    if (fs.existsSync(markdownPath)) {
      markdownContent = fs.readFileSync(markdownPath, 'utf-8');
    }
  } catch (e) {
    // Markdown file not found, will generate content
  }

  const hasMarkdownContent = markdownContent.length > 0;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.category,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-indigo-600">Products</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/categories/${product.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`} className="text-gray-500 hover:text-indigo-600">
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.title}</li>
          </ol>
        </div>
      </nav>

      {/* Product Hero */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`absolute top-4 left-4 ${badge.bg} ${badge.text} text-sm font-semibold px-3 py-1.5 rounded-full`}>
                {badge.label}
              </span>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-500 font-medium">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {product.title}
              </h1>
              {product.tagline && (
                <p className="text-xl md:text-2xl text-indigo-600 font-medium mb-6 leading-relaxed">{product.tagline}</p>
              )}
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      } fill-current`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-500">({product.reviewCount} reviews)</span>
              </div>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Pricing Table - Show if available */}
              {product.pricingPlans && product.pricingPlans.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Plans</h3>
                  <div className="space-y-3">
                    {product.pricingPlans.map((plan, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="font-medium text-gray-700">{plan.name}</span>
                        <span className="text-indigo-600 font-semibold">{plan.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <CTAButton
                  text={product.pricingType === 'free' ? 'Try Free Now' : 'Get Best Deal'}
                  url={product.affiliate_url}
                  variant="large"
                  className="flex-1"
                />
                <CTAButton
                  text="Visit Official Site"
                  url={product.short_url}
                  variant="secondary"
                  className="flex-1"
                />
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Affiliate
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Commission-Free Pricing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Review Content (from markdown or generated) */}
      <section className="py-16 lg:py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasMarkdownContent ? (
            <div className="prose prose-lg max-w-none">
              <div 
                className="product-review-content prose-headings:scroll-mt-20 prose-ul:my-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) }}
              />
            </div>
          ) : (
            <>
              {/* Features Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Pricing</h2>
                <div className="bg-indigo-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Starting from</span>
                      <p className="text-3xl font-bold text-indigo-600">{product.price}</p>
                    </div>
                    <span className={`${badge.bg} ${badge.text} text-sm font-semibold px-4 py-2 rounded-full`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {product.pros.map((pro, index) => (
                      <li key={index} className="flex items-start text-green-900">
                        <span className="mr-2">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {product.cons.map((con, index) => (
                      <li key={index} className="flex items-start text-red-900">
                        <span className="mr-2">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <FAQAccordion items={product.faqs} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 lg:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Don&apos;t miss out on this opportunity. Check out {product.title} today and experience the difference.
          </p>
          <CTAButton
            text={product.pricingType === 'free' ? 'Try Free Now' : 'Get Best Deal'}
            url={product.affiliate_url}
            variant="large"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          />
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                relatedProduct && (
                  <ProductCard key={relatedProduct.slug} product={relatedProduct} />
                )
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}