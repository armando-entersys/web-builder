'use client'

import { useState } from 'react'

interface PageNode {
  id: string
  title: string
  slug: string
  description?: string
  children?: PageNode[]
}

interface Props {
  sitemap: PageNode[]
}

export default function WireframeView({ sitemap }: Props) {
  const [selectedPage, setSelectedPage] = useState<PageNode | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Función para aplanar el sitemap en una lista de páginas
  const flattenSitemap = (nodes: PageNode[]): PageNode[] => {
    const result: PageNode[] = []
    const flatten = (node: PageNode) => {
      result.push(node)
      if (node.children) {
        node.children.forEach(flatten)
      }
    }
    nodes.forEach(flatten)
    return result
  }

  const allPages = sitemap.length > 0 ? flattenSitemap(sitemap) : []

  const handleGenerateWireframe = async () => {
    if (!selectedPage) return
    setIsGenerating(true)
    // TODO: Implementar generación de wireframe con IA
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  if (sitemap.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">📐</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay sitemap generado
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Primero genera un sitemap en la sección anterior
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            ← Ir a Sitemap
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* Sidebar - Lista de páginas */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-700 mb-1">PÁGINAS</h3>
          <p className="text-[10px] text-gray-500">{allPages.length} páginas</p>
        </div>

        <div className="p-2">
          {allPages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={`w-full text-left p-3 rounded-md mb-1 text-xs transition-colors ${
                selectedPage?.id === page.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="font-semibold text-gray-900">{page.title}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{page.slug}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Principal */}
      <div className="flex-1 overflow-auto">
        {!selectedPage ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-20">👈</div>
              <p className="text-gray-400 text-sm">
                Selecciona una página para crear su wireframe
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedPage.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedPage.slug}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateWireframe}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold rounded-md hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generando...
                      </span>
                    ) : (
                      '✨ Generar Wireframe con IA'
                    )}
                  </button>
                </div>
                {selectedPage.description && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {selectedPage.description}
                  </p>
                )}
              </div>

              {/* Wireframe Placeholder */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12">
                <div className="space-y-8">
                  {/* Header wireframe */}
                  <div className="border border-gray-200 rounded p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-24 bg-gray-300 rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Hero wireframe */}
                  <div className="border border-gray-200 rounded p-8 bg-gray-50">
                    <div className="text-center space-y-4">
                      <div className="h-8 w-3/4 bg-gray-300 rounded mx-auto"></div>
                      <div className="h-4 w-2/3 bg-gray-300 rounded mx-auto"></div>
                      <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
                      <div className="h-10 w-32 bg-blue-300 rounded mx-auto mt-6"></div>
                    </div>
                  </div>

                  {/* Content sections wireframe */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-gray-200 rounded p-4 bg-gray-50">
                        <div className="h-32 bg-gray-300 rounded mb-3"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>

                  {/* Footer wireframe */}
                  <div className="border border-gray-200 rounded p-4 bg-gray-50">
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-2 bg-gray-300 rounded"></div>
                          <div className="h-2 bg-gray-300 rounded"></div>
                          <div className="h-2 bg-gray-300 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-xs text-gray-400">
                    Este es un wireframe de ejemplo. Haz clic en "Generar Wireframe con IA" para crear uno personalizado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel lateral derecho - Componentes */}
      <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-700 mb-1">COMPONENTES</h3>
          <p className="text-[10px] text-gray-500">Arrastra para agregar</p>
        </div>

        <div className="p-3 space-y-2">
          {[
            { name: 'Hero', icon: '🎯' },
            { name: 'Navbar', icon: '📱' },
            { name: 'Feature Grid', icon: '📊' },
            { name: 'Testimonios', icon: '💬' },
            { name: 'CTA', icon: '🎯' },
            { name: 'Footer', icon: '📄' },
            { name: 'Form', icon: '📝' },
            { name: 'Gallery', icon: '🖼️' },
          ].map((component) => (
            <div
              key={component.name}
              className="p-3 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{component.icon}</span>
                <span className="text-xs font-medium text-gray-700">
                  {component.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
