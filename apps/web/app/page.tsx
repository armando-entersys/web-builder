'use client'

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-white">
          Web Builder
        </h1>
        <h2 className="text-2xl text-gray-100">
          AI-Powered Web Page Creator
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-200">
          Create stunning landing pages optimized for AI search engines like ChatGPT, Perplexity, and Claude.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/dashboard/sitemap"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  )
}
