'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Palette, Zap, Layout, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard/projects')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-secondary to-tertiary">
        <div className="text-white text-lg font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#6750A4] via-[#7C4DFF] to-[#9C27B0]">
      {/* Decorative background elements - Material Design 3 style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full"></div>
      </div>

      {/* Navigation Bar - M3 Style */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">Web Builder</span>
          </div>
          <Link
            href="/auth/login"
            className="px-6 py-2.5 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-xl rounded-full border border-white/30 mb-8">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-medium text-white">AI-Powered Web Creation</span>
          </div>

          {/* Display Text - M3 Typography */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
            Build Beautiful
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Landing Pages
            </span>
          </h1>

          {/* Headline Text - M3 Typography */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Create stunning, AI-optimized websites in minutes. Perfect for ChatGPT, Perplexity, and Claude search results.
          </p>

          {/* CTA Buttons - M3 Filled & Outlined */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/register"
              className="group relative px-8 py-4 bg-white text-[#6750A4] font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>

          {/* Stats - M3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">160+</div>
              <div className="text-white/80 text-sm">Components</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">12</div>
              <div className="text-white/80 text-sm">Component Types</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl font-bold text-white mb-2">AI</div>
              <div className="text-white/80 text-sm">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Powerful features to create, customize, and deploy your landing pages
            </p>
          </div>

          {/* Feature Cards - M3 Elevation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-white/50">
              <div className="w-14 h-14 bg-gradient-to-br from-[#6750A4] to-[#7C4DFF] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Let AI create contextual, professional content for your landing pages automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-white/50">
              <div className="w-14 h-14 bg-gradient-to-br from-[#7C4DFF] to-[#9C27B0] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Layout className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">160+ Components</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from a vast library of beautiful, responsive components with multiple variants.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-white/50">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Design Tokens</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete design system with colors, typography, spacing, and more.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-white/50">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E91E63] to-[#F44336] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Preview</h3>
              <p className="text-gray-600 leading-relaxed">
                See your changes instantly with our powerful design and wireframe views.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          © 2024 Web Builder. AI-Powered Web Page Creator.
        </div>
      </footer>
    </main>
  )
}
