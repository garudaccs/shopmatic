import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Shopmatic - our mission, team, and commitment to honest product reviews.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Shopmatic</h1>
            <p className="text-xl text-orange-100 leading-relaxed">
              We help people make smarter purchasing decisions through honest, 
              research-backed, and detailed product reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">50</div>
              <div className="text-sm text-gray-500 mt-1">Products Reviewed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">8</div>
              <div className="text-sm text-gray-500 mt-1">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">50</div>
              <div className="text-sm text-gray-500 mt-1">Detailed Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">v1.6</div>
              <div className="text-sm text-gray-500 mt-1">Current Version</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                In a world filled with sponsored reviews and biased recommendations, we believe 
                consumers deserve better. Shopmatic was founded on the principle of transparency 
                and honesty.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Every product on Shopmatic is thoroughly researched. We verify pricing directly 
                from official sources, test features where possible, and write reviews that help 
                you decide — not just sell you something.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We cover AI tools, developer platforms, marketing software, productivity apps, 
                hosting services, and more. If it helps you work smarter, we review it.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Shopmatic</h3>
                <p className="text-gray-600 text-sm">Honest reviews. Verified pricing. No fluff.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-lg font-bold text-gray-900">Verified</div>
                  <div className="text-xs text-gray-500">Pricing checked against official sources</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-lg font-bold text-gray-900">Updated</div>
                  <div className="text-xs text-gray-500">Reviews refreshed regularly</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-lg font-bold text-gray-900">Detailed</div>
                  <div className="text-xs text-gray-500">1500+ word in-depth analysis</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-lg font-bold text-gray-900">Honest</div>
                  <div className="text-xs text-gray-500">Pros and cons clearly listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Cover</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From AI-powered tools to cloud infrastructure, we review the products that matter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'AI Tools', desc: 'ChatGPT alternatives, AI video generators, voice cloning, and more', count: 12 },
              { name: 'Developer Tools', desc: 'Code editors, IDEs, hosting platforms, and dev infrastructure', count: 10 },
              { name: 'Marketing', desc: 'Email marketing, automation, SEO, and social media tools', count: 8 },
              { name: 'Productivity', desc: 'Video messaging, presentations, writing assistants, and note-taking', count: 8 },
              { name: 'Design', desc: 'Infographic makers, mockup generators, and creative tools', count: 4 },
              { name: 'Hosting & Infra', desc: 'VPS hosting, cloud platforms, and monitoring services', count: 5 },
              { name: 'Education', desc: 'Online learning platforms, book summaries, and courses', count: 3 },
              { name: 'Security', desc: 'Dark web monitoring, uptime tracking, and web security', count: 3 },
            ].map((cat, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{cat.desc}</p>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{cat.count} products</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Transparency', desc: 'We clearly disclose affiliate relationships. Our reviews are independent — no vendor pays for a positive rating.' },
              { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Accuracy', desc: 'We verify pricing, features, and availability directly from official sources. No outdated or guessed information.' },
              { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Community', desc: 'We listen to our readers and continuously improve based on feedback. Your success is our success.' },
            ].map((val, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={val.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Review */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Review Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our review process is thorough, consistent, and fair.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Research', desc: 'We verify pricing, features, and plans directly from official product websites.' },
              { step: 2, title: 'Evaluate', desc: 'We assess the product against its claims, competitors, and real-world use cases.' },
              { step: 3, title: 'Compare', desc: 'We benchmark against similar tools to give you context for your decision.' },
              { step: 4, title: 'Publish', desc: 'We publish honest reviews with pros, cons, pricing, FAQs, and clear verdicts.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-orange-600">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Find Your Next Tool?</h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">
            Browse our collection of research-backed product reviews.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-lg"
          >
            Browse Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
