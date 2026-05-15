// JSON-LD Structured Data Helpers for SEO

import { ProductFull } from './types';

// Product Schema
export function generateProductSchema(product: ProductFull): object {
  return {
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
      bestRating: 5,
      worstRating: 1,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Shopmatic',
      },
    },
    url: `https://shopmatic.cc/products/${product.slug}`,
  };
}

// Review Schema
export function generateReviewSchema(product: ProductFull, reviewDate: string = new Date().toISOString()): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${product.title} Review`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: product.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Organization',
      name: 'Shopmatic',
    },
    datePublished: reviewDate,
    reviewBody: product.description,
    itemReviewed: {
      '@type': 'Product',
      name: product.title,
      image: product.image,
    },
  };
}

// FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Organization Schema
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shopmatic',
    url: 'https://shopmatic.cc',
    logo: 'https://shopmatic.cc/logo.svg',
    description: 'Your trusted source for honest product reviews and exclusive deals on AI tools, software, and digital products.',
    sameAs: [
      'https://twitter.com/shopmatic',
      'https://linkedin.com/company/shopmatic',
      'https://youtube.com/@shopmatic',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@shopmatic.cc',
      contactType: 'customer service',
    },
  };
}

// WebSite Schema for search
export function generateWebsiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shopmatic',
    url: 'https://shopmatic.cc',
    description: 'Discover the best tools and deals with honest, in-depth reviews.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://shopmatic.cc/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Article Schema for blog posts
export function generateArticleSchema(title: string, description: string, url: string, imageUrl: string, publishedDate: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    url: url,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Shopmatic',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shopmatic',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shopmatic.cc/logo.svg',
      },
    },
  };
}

// Comparison Article Schema
export function generateItemListSchema(products: ProductFull[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.image,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      },
    })),
  };
}

// Local Business Schema (for location-based info)
export function generateLocalBusinessSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Shopmatic',
    description: 'Online product review and deal aggregation service',
    url: 'https://shopmatic.cc',
    image: 'https://shopmatic.cc/logo.svg',
  };
}

// Export all schemas as a combined function
export function generateAllSchemas(product?: ProductFull): Record<string, object> {
  const schemas: Record<string, object> = {
    organization: generateOrganizationSchema(),
    website: generateWebsiteSchema(),
  };

  if (product) {
    schemas.product = generateProductSchema(product);
    schemas.review = generateReviewSchema(product);
    schemas.faq = generateFAQSchema(product.faqs);
    schemas.breadcrumb = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://shopmatic.cc' },
      { name: 'Products', url: 'https://shopmatic.cc/products' },
      { name: product.category, url: `https://shopmatic.cc/products?category=${product.category.toLowerCase()}` },
      { name: product.title, url: `https://shopmatic.cc/products/${product.slug}` },
    ]);
  }

  return schemas;
}