import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Builder - AI-Powered Page Creator',
  description: 'Create stunning web pages optimized for AI search engines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
