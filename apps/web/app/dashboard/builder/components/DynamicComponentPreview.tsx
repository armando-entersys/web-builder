'use client'

import React, { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, AlertCircle } from 'lucide-react'

interface PreviewProps {
  componentPath: string
  name: string
  icon?: string
  description?: string
  fallbackType?: string
}

// Map of component paths to dynamic imports
// This is needed because Next.js dynamic imports require static paths
const componentMap: Record<string, React.ComponentType<any>> = {}

// Cache for loaded components
const loadedComponents: Record<string, React.ComponentType<any> | null> = {}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-muted/30">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-xs">Loading preview...</span>
      </div>
    </div>
  )
}

function ErrorFallback({ name, icon, description }: { name: string; icon?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-gradient-to-br from-muted/50 to-muted/30 p-4">
      <div className="text-4xl mb-3">{icon || '📦'}</div>
      <div className="text-sm font-medium text-center mb-1">{name}</div>
      {description && (
        <div className="text-xs text-muted-foreground text-center line-clamp-2 max-w-[90%]">
          {description}
        </div>
      )}
    </div>
  )
}

// Component registry - maps paths to actual components
// We'll dynamically build this based on what's available
const getComponentFromPath = (path: string): React.ComponentType<any> | null => {
  // Remove .tsx extension and normalize path
  const normalizedPath = path.replace(/\.tsx?$/, '').replace(/^components\//, '')

  // Check cache first
  if (loadedComponents[normalizedPath] !== undefined) {
    return loadedComponents[normalizedPath]
  }

  // For now, return null - components need to be pre-registered
  // In a full implementation, you would use a build-time generated map
  return null
}

export function DynamicComponentPreview({
  componentPath,
  name,
  icon,
  description,
  fallbackType
}: PreviewProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true)
        setError(false)

        // Try to get component from registry
        const comp = getComponentFromPath(componentPath)

        if (comp) {
          setComponent(() => comp)
        } else {
          // Component not in registry, show fallback
          setError(true)
        }
      } catch (e) {
        console.error('Error loading component:', e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [componentPath])

  if (loading) {
    return <LoadingFallback />
  }

  if (error || !Component) {
    return <ErrorFallback name={name} icon={icon} description={description} />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="relative w-full h-full overflow-hidden">
        <div className="transform scale-[0.5] origin-top-left w-[200%]">
          <Component />
        </div>
      </div>
    </Suspense>
  )
}

// Enhanced preview card component with better UI
export function ComponentPreviewCard({
  name,
  displayName,
  icon,
  description,
  componentPath,
  isSelected,
  isPremium,
  isNew,
  tags,
  onClick
}: {
  name: string
  displayName: string
  icon: string
  description: string
  componentPath: string
  isSelected: boolean
  isPremium?: boolean
  isNew?: boolean
  tags?: string[]
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg overflow-hidden ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Header with name and badges */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{name}</div>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {isNew && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">
                NEW
              </span>
            )}
            {isPremium && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                PRO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className="relative bg-gradient-to-br from-background to-muted/20" style={{ height: '180px' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-5xl mb-3 opacity-80">{icon}</div>
          <div className="text-xs text-muted-foreground text-center line-clamp-3 max-w-[95%]">
            {description}
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="px-3 py-2 border-t bg-muted/20">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 text-[10px] bg-muted rounded text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
