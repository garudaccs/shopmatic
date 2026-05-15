import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
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
    return { title: 'Product Not Found' };
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
  return products.map((product) => ({ slug: product.slug }));
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
    free: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Free' },
    freemium: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Freemium' },
    paid: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Paid' },
  };

  const badge = pricingBadge[product.pricingType];

  // Try to load markdown content
  let markdownContent = '';
  const markdownPath = path.join(process.cwd(), 'content', 'products', `${slug}.md`);
  
  try {
    if (fs.existsSync(markdownPath)) {
      let raw = fs.readFileSync(markdownPath, 'utf-8');
      markdownContent = raw.replace(/^---[\s\S]*?---\n*/, '').trim();
    }
  } catch (e) {
    // Markdown file not found
  }

  const hasMarkdownContent = markdownContent.length > 0;

  // Split markdown into sections by ## headers for interspersed layout
  const sections = hasMarkdownContent ? markdownContent.split(/(?=^## )/m).filter(Boolean) : [];

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: product.category },
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
            <li><Link href="/" className="text-gray-500 hover:text-orange-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-gray-500 hover:text-orange-600">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/categories/${product.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`} className="text-gray-500 hover:text-orange-600">
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.title}</li>
          </ol>
        </div>
      </nav>

      {/* Product Hero */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <span className={`absolute top-4 left-4 ${badge.bg} ${badge.text} text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm`}>
                {badge.label}
              </span>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-3">
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{product.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>
              {product.tagline && (
                <p className="text-lg text-orange-600 font-medium mb-5">{product.tagline}</p>
              )}
              
              {/* Rating */}
              <div className="flex items-center mb-5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-base font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-500 text-sm">({product.reviewCount} reviews)</span>
              </div>

              <p className="text-base text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Pricing */}
              {product.pricingPlans && product.pricingPlans.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing Plans</h3>
                  <div className="space-y-2">
                    {product.pricingPlans.map((plan, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="font-medium text-gray-700">{plan.name}</span>
                        <span className="text-orange-600 font-semibold">{plan.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <a
                  href={product.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 px-8 py-3.5 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 flex-1"
                >
                  {product.pricingType === 'free' ? 'Try Free Now' : 'Get Best Deal'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href={product.short_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600 px-6 py-3.5 flex-1"
                >
                  Visit Official Site
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-5 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Affiliate
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Commission-Free Pricing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Content with interspersed images and CTAs */}
      <section className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {hasMarkdownContent ? (
            <div className="space-y-0">
              {/* Intro section (first section before any ## header) */}
              {sections.map((section, index) => {
                const sectionHtml = markdownToHtml(section);
                const isEven = index % 2 === 0;
                const showImage = index > 0 && index < sections.length - 1 && index % 3 === 1;
                const showMidCta = index > 0 && index % 4 === 2 && index < sections.length - 1;

                return (
                  <div key={index}>
                    {/* Content block with optional side image */}
                    {showImage ? (
                      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center">
                        <div className={`flex-1 ${!isEven ? 'order-2' : ''}`}>
                          <div
                            className="product-review-content prose prose-lg max-w-none prose-headings:scroll-mt-20"
                            dangerouslySetInnerHTML={{ __html: sectionHtml }}
                          />
                        </div>
                        <div className={`w-full md:w-2/5 ${!isEven ? 'order-1' : ''}`}>
                          <div className="rounded-xl overflow-hidden shadow-md bg-gray-50">
                            <img
                              src={product.image}
                              alt={`${product.title} - ${product.title} feature`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="product-review-content prose prose-lg max-w-none prose-headings:scroll-mt-20 mb-10"
                        dangerouslySetInnerHTML={{ __html: sectionHtml }}
                      />
                    )}

                    {/* Mid-content CTA */}
                    {showMidCta && (
                      <div className="my-10 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-800 font-semibold text-lg">Ready to try {product.title}?</p>
                          <p className="text-gray-500 text-sm">Get the best deal through our verified affiliate link.</p>
                        </div>
                        <a
                          href={product.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center font-semibold rounded-xl bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          {product.pricingType === 'free' ? 'Try Free Now' : 'Get Best Deal'}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {/* Features Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                  <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017" />
                    </svg>
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {product.pros.map((pro, index) => (
                      <li key={index} className="flex items-start text-emerald-900 text-sm">
                        <span className="mr-2 text-emerald-600">+</span>{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {product.cons.map((con, index) => (
                      <li key={index} className="flex items-start text-red-900 text-sm">
                        <span className="mr-2 text-red-600">-</span>{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <FAQAccordion items={product.faqs} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Get {product.title}?</h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto text-base">
            {product.pricingType === 'free'
              ? `Start using ${product.title} for free today.`
              : `Get the best deal on ${product.title} through our verified link.`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-white text-orange-600 hover:bg-orange-50 px-8 py-3.5 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {product.pricingType === 'free' ? 'Try Free Now' : 'Get Best Deal'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href={product.short_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center font-semibold rounded-xl bg-transparent text-white border-2 border-white/60 hover:border-white px-6 py-3.5 transition-all"
            >
              Visit Official Site
            </a>
          </div>
          <p className="mt-4 text-orange-200 text-xs">Verified affiliate link. No extra cost to you.</p>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
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
