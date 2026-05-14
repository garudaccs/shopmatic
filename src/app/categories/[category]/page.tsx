import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: categoryData.name,
    description: categoryData.description,
    openGraph: {
      title: `${categoryData.name} - Shopmatic`,
      description: categoryData.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const products = getProductsByCategory(category);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/categories" className="text-gray-500 hover:text-indigo-600">Categories</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{categoryData.name}</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mr-6">
              <span className="text-4xl">{categoryData.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryData.name}</h1>
              <p className="text-indigo-100 max-w-2xl">{categoryData.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{products.length}</span> products in {categoryData.name}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products in this category yet</h3>
              <p className="text-gray-600 mb-4">Check back soon for new additions.</p>
              <Link
                href="/categories"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Browse other categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { slug: 'ai-tools', name: 'AI Tools', icon: '🤖' },
              { slug: 'development', name: 'Development', icon: '💻' },
              { slug: 'marketing', name: 'Marketing', icon: '📢' },
              { slug: 'design', name: 'Design', icon: '🎨' },
              { slug: 'video', name: 'Video', icon: '🎬' },
              { slug: 'cloud-hosting', name: 'Cloud & Hosting', icon: '☁️' },
              { slug: 'productivity', name: 'Productivity', icon: '⚡' },
              { slug: 'education', name: 'Education', icon: '📚' },
            ]
              .filter((c) => c.slug !== category)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <span className="text-2xl mr-3">{cat.icon}</span>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}