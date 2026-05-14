import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles on product reviews, buying guides, and industry insights.',
};

const blogPosts = [
  {
    id: '1',
    title: 'The Best AI Tools for Small Businesses in 2026',
    excerpt: 'Discover the top AI-powered tools that can help streamline your operations and boost productivity without breaking the bank.',
    author: 'Shopmatic Team',
    date: 'May 12, 2026',
    category: 'AI Tools',
    readTime: '8 min read',
    slug: 'best-ai-tools-small-businesses',
    image: 'https://picsum.photos/seed/blog-ai/800/400',
  },
  {
    id: '2',
    title: 'How to Choose the Right Web Hosting Provider',
    excerpt: 'A comprehensive guide to selecting the perfect web hosting for your needs, from shared hosting to dedicated servers.',
    author: 'Shopmatic Team',
    date: 'May 10, 2026',
    category: 'Hosting',
    readTime: '12 min read',
    slug: 'choose-web-hosting-provider',
    image: 'https://picsum.photos/seed/blog-hosting/800/400',
  },
  {
    id: '3',
    title: 'Top 10 Video Editing Software Compared',
    excerpt: 'An in-depth comparison of the best video editing tools, from beginner-friendly options to professional-grade software.',
    author: 'Shopmatic Team',
    date: 'May 8, 2026',
    category: 'Video',
    readTime: '15 min read',
    slug: 'top-video-editing-software',
    image: 'https://picsum.photos/seed/blog-video/800/400',
  },
  {
    id: '4',
    title: 'Maximizing Your Affiliate Marketing Strategy',
    excerpt: 'Learn how to make the most of affiliate programs and turn product reviews into consistent revenue.',
    author: 'Shopmatic Team',
    date: 'May 5, 2026',
    category: 'Marketing',
    readTime: '10 min read',
    slug: 'affiliate-marketing-strategy',
    image: 'https://picsum.photos/seed/blog-affiliate/800/400',
  },
  {
    id: '5',
    title: 'Free vs Paid Tools: When to Upgrade',
    excerpt: 'We break down when it makes sense to upgrade from free tiers to paid plans for your business tools.',
    author: 'Shopmatic Team',
    date: 'May 3, 2026',
    category: 'Guides',
    readTime: '7 min read',
    slug: 'free-vs-paid-tools',
    image: 'https://picsum.photos/seed/blog-free/800/400',
  },
  {
    id: '6',
    title: 'The Ultimate Guide to Productivity Tools',
    excerpt: 'A comprehensive overview of the best tools to help you stay organized, manage tasks, and boost efficiency.',
    author: 'Shopmatic Team',
    date: 'April 28, 2026',
    category: 'Productivity',
    readTime: '14 min read',
    slug: 'productivity-tools-guide',
    image: 'https://picsum.photos/seed/blog-prod/800/400',
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600 max-w-2xl">
            Expert insights, buying guides, and the latest news on products and tools. 
            Stay informed with our comprehensive articles.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-gray-100">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-semibold">
                        {featuredPost.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.date}</p>
                    </div>
                  </div>
                  <span className="text-indigo-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-indigo-600 font-medium">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-indigo-100 mb-6">
            Get the latest articles and exclusive deals delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}