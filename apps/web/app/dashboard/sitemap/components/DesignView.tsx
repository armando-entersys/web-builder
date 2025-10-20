'use client'

import { useState } from 'react'

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

interface Props {
  sitemap: PageNode[]
  styleGuide: StyleGuide | null
}

export default function DesignView({ sitemap, styleGuide }: Props) {
  const [selectedPage, setSelectedPage] = useState<PageNode | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Función para aplanar el sitemap
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

  const handleGenerateDesign = async () => {
    if (!selectedPage) return
    setIsGenerating(true)
    // TODO: Implementar generación de diseño final con IA
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
        return '100%'
    }
  }

  if (sitemap.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">✨</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay sitemap generado
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Primero genera un sitemap en la primera sección
          </p>
        </div>
      </div>
    )
  }

  if (!styleGuide) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🎨</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay guía de estilo generada
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Genera una guía de estilo en la sección Style Guide
          </p>
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
                  ? 'bg-purple-50 border border-purple-200'
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
                Selecciona una página para ver su diseño
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Toolbar superior */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    {selectedPage.title}
                  </h2>
                  <p className="text-[10px] text-gray-500">{selectedPage.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Selector de viewport */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1.5 text-xs rounded transition-colors ${
                      viewMode === 'mobile'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📱 Mobile
                  </button>
                  <button
                    onClick={() => setViewMode('tablet')}
                    className={`px-3 py-1.5 text-xs rounded transition-colors ${
                      viewMode === 'tablet'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    💻 Tablet
                  </button>
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1.5 text-xs rounded transition-colors ${
                      viewMode === 'desktop'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                </div>

                <button
                  onClick={handleGenerateDesign}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold rounded-md hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generando...
                    </span>
                  ) : (
                    '✨ Generar Diseño con IA'
                  )}
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              <div
                className="mx-auto bg-white shadow-lg transition-all duration-300"
                style={{ width: getViewportWidth(), minHeight: '100%' }}
              >
                {/* Design Preview - Simulación de página diseñada */}
                <div>
                  {/* Navbar */}
                  <div
                    className="px-8 py-4 border-b flex items-center justify-between"
                    style={{
                      backgroundColor: styleGuide.colors.background,
                      borderColor: `${styleGuide.colors.text}20`,
                    }}
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        color: styleGuide.colors.primary,
                        fontFamily: styleGuide.typography.headingFont,
                      }}
                    >
                      Logo
                    </div>
                    <div className="flex gap-6">
                      {['Inicio', 'Servicios', 'Contacto'].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="text-sm font-medium"
                          style={{
                            color: styleGuide.colors.text,
                            fontFamily: styleGuide.typography.bodyFont,
                          }}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div
                    className="px-8 py-20 text-center"
                    style={{ backgroundColor: `${styleGuide.colors.primary}10` }}
                  >
                    <h1
                      className="text-5xl font-bold mb-6"
                      style={{
                        color: styleGuide.colors.text,
                        fontFamily: styleGuide.typography.headingFont,
                      }}
                    >
                      {selectedPage.title}
                    </h1>
                    {selectedPage.description && (
                      <p
                        className="text-xl mb-8 max-w-2xl mx-auto"
                        style={{
                          color: `${styleGuide.colors.text}cc`,
                          fontFamily: styleGuide.typography.bodyFont,
                        }}
                      >
                        {selectedPage.description}
                      </p>
                    )}
                    <div className="flex gap-4 justify-center">
                      <button
                        className="px-8 py-3 rounded-lg font-semibold text-white"
                        style={{ backgroundColor: styleGuide.colors.primary }}
                      >
                        Comenzar
                      </button>
                      <button
                        className="px-8 py-3 rounded-lg font-semibold border-2"
                        style={{
                          borderColor: styleGuide.colors.primary,
                          color: styleGuide.colors.primary,
                        }}
                      >
                        Más Info
                      </button>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="px-8 py-16">
                    <h2
                      className="text-3xl font-bold text-center mb-12"
                      style={{
                        color: styleGuide.colors.text,
                        fontFamily: styleGuide.typography.headingFont,
                      }}
                    >
                      Características Principales
                    </h2>
                    <div className="grid grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-6 rounded-lg border"
                          style={{ borderColor: `${styleGuide.colors.text}20` }}
                        >
                          <div
                            className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${styleGuide.colors.secondary}20` }}
                          >
                            ✨
                          </div>
                          <h3
                            className="text-lg font-bold mb-2"
                            style={{
                              color: styleGuide.colors.text,
                              fontFamily: styleGuide.typography.headingFont,
                            }}
                          >
                            Característica {i}
                          </h3>
                          <p
                            className="text-sm"
                            style={{
                              color: `${styleGuide.colors.text}cc`,
                              fontFamily: styleGuide.typography.bodyFont,
                            }}
                          >
                            Descripción de la característica que hace que tu producto sea único.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div
                    className="px-8 py-16 text-center"
                    style={{ backgroundColor: styleGuide.colors.primary }}
                  >
                    <h2
                      className="text-3xl font-bold mb-4 text-white"
                      style={{ fontFamily: styleGuide.typography.headingFont }}
                    >
                      ¿Listo para comenzar?
                    </h2>
                    <p
                      className="text-lg mb-8 text-white opacity-90"
                      style={{ fontFamily: styleGuide.typography.bodyFont }}
                    >
                      Únete a miles de usuarios satisfechos
                    </p>
                    <button
                      className="px-8 py-3 rounded-lg font-semibold"
                      style={{
                        backgroundColor: styleGuide.colors.background,
                        color: styleGuide.colors.primary,
                      }}
                    >
                      Comenzar Ahora
                    </button>
                  </div>

                  {/* Footer */}
                  <div
                    className="px-8 py-8 border-t"
                    style={{
                      backgroundColor: `${styleGuide.colors.text}05`,
                      borderColor: `${styleGuide.colors.text}10`,
                    }}
                  >
                    <div className="grid grid-cols-4 gap-8 mb-8">
                      {['Producto', 'Empresa', 'Recursos', 'Legal'].map((section) => (
                        <div key={section}>
                          <h4
                            className="font-bold mb-3 text-sm"
                            style={{
                              color: styleGuide.colors.text,
                              fontFamily: styleGuide.typography.headingFont,
                            }}
                          >
                            {section}
                          </h4>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <a
                                key={i}
                                href="#"
                                className="block text-xs"
                                style={{
                                  color: `${styleGuide.colors.text}99`,
                                  fontFamily: styleGuide.typography.bodyFont,
                                }}
                              >
                                Enlace {i}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="text-center text-xs pt-6 border-t"
                      style={{
                        color: `${styleGuide.colors.text}66`,
                        borderColor: `${styleGuide.colors.text}10`,
                      }}
                    >
                      © 2025 Tu Empresa. Todos los derechos reservados.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
