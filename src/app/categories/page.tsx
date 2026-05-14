import { Metadata } from 'next';
import { getAllCategories } from '@/lib/products';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse products by category. Find AI tools, development tools, marketing software, and more.',
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our curated categories to find the perfect tool for your needs. 
            From AI-powered solutions to development tools, we have you covered.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-indigo-600 transition-colors">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center text-indigo-600 font-medium">
                      <span className="text-sm">{category.productCount} products</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-gray-600 mb-6">
            We are constantly adding new products and categories. Subscribe to our newsletter to stay updated.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}