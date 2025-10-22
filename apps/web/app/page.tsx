'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

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
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
