'use client'

import { useState, useEffect } from 'react'
import LandingPageBuilder, { Section } from './components/LandingPageBuilder'
import WireframeView from './components/WireframeView'
import StyleGuideView from './components/StyleGuideView'
import DesignView from './components/DesignView'
import { LayoutGrid, Share2, Download, Sparkles, Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type TabType = 'builder' | 'wireframe' | 'styleguide' | 'design'

interface PageNode {
  id: string
  title: string
  slug: string
  description?: string
  children?: PageNode[]
}

interface StyleGuide {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    headingSize: string
    bodySize: string
  }
}

type ComponentType = 'hero' | 'header' | 'features' | 'cta' | 'testimonials' | 'footer' | 'form' | 'gallery' | 'stats' | 'logos' | 'pricing' | 'faq' | 'contact'

interface WireframeComponent {
  id: string
  type: ComponentType
  variant: number
  name: string
  description: string
  content: {
    heading?: string
    subheading?: string
    buttonText?: string
  }
  style: {
    background: 'none' | 'color' | 'image' | 'video'
    backgroundColor?: string
    layout?: string
  }
}

export default function WebBuilder() {
  const [activeTab, setActiveTab] = useState<TabType>('builder')
  const [projectName, setProjectName] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [pages, setPages] = useState<PageNode[]>([])
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null)
  const [nodeCount, setNodeCount] = useState(0)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [wireframeComponents, setWireframeComponents] = useState<WireframeComponent[]>([])

  const handleShare = () => {
    if (navigator.share && projectName) {
      navigator.share({
        title: projectName,
        text: `Check out my project: ${projectName}`,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err))
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleExport = () => {
    if (pages.length === 0) {
      alert('Please generate your pages first!')
      return
    }

    const dataStr = JSON.stringify(pages, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${projectName || 'builder'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'builder', label: 'Builder', shortcut: '⌘1' },
    { id: 'wireframe', label: 'Wireframe', shortcut: '⌘2' },
    { id: 'styleguide', label: 'Style Guide', shortcut: '⌘3' },
    { id: 'design', label: 'Design', shortcut: '⌘4' },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault()
        const tabIndex = parseInt(e.key) - 1
        setActiveTab(tabs[tabIndex].id as TabType)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Modern Header - Vercel/Linear Style */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-6">
          {/* Left Section - Logo & Project Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold leading-none">
                {projectName || 'Untitled Project'}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Web Builder
              </p>
            </div>
          </div>

          {/* Center Section - Navigation Tabs */}
          <nav className="mx-6 flex flex-1 items-center justify-center">
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/50 p-0.5 text-muted-foreground">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.badge && (
                    <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={!projectName}
            >
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={handleExport}
              disabled={pages.length === 0}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'builder' && (
          <LandingPageBuilder
            projectName={projectName}
            setProjectName={setProjectName}
            sections={sections}
            setSections={setSections}
          />
        )}
        {activeTab === 'wireframe' && (
          <WireframeView
            sections={sections}
            wireframeComponents={wireframeComponents}
            setWireframeComponents={setWireframeComponents}
          />
        )}
        {activeTab === 'styleguide' && (
          <StyleGuideView
            styleGuide={styleGuide}
            setStyleGuide={setStyleGuide}
          />
        )}
        {activeTab === 'design' && (
          <DesignView
            sections={sections}
            styleGuide={styleGuide}
            wireframeComponents={wireframeComponents}
          />
        )}
      </main>

      {/* Modern Footer - Vercel/Linear Style */}
      <footer className="border-t bg-background/80 backdrop-blur-xl">
        <div className="container flex h-10 items-center justify-between px-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="font-medium">Saved</span>
            </div>
            <Circle className="h-1 w-1 fill-border" />
            <span>{sections.length} {sections.length === 1 ? 'section' : 'sections'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Updated now</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
