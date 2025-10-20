'use client'

import { useState } from 'react'
import SitemapView from './components/SitemapView'
import WireframeView from './components/WireframeView'
import StyleGuideView from './components/StyleGuideView'
import DesignView from './components/DesignView'

type TabType = 'sitemap' | 'wireframe' | 'styleguide' | 'design'

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

export default function WebBuilder() {
  const [activeTab, setActiveTab] = useState<TabType>('sitemap')
  const [projectName, setProjectName] = useState('')
  const [sitemap, setSitemap] = useState<PageNode[]>([])
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null)

  const tabs = [
    { id: 'sitemap', label: 'Sitemap', icon: '🗺️' },
    { id: 'wireframe', label: 'Wireframe', icon: '📐' },
    { id: 'styleguide', label: 'Style Guide', icon: '🎨' },
    { id: 'design', label: 'Design', icon: '✨', badge: 'Beta' },
  ]

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header con Tabs */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo y Nombre del Proyecto */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🌐</div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">
                  {projectName || 'Nuevo Proyecto'}
                </h1>
                <p className="text-[10px] text-gray-500">Web Builder con IA</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              💬 Comentarios
            </button>
            <button className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              🔗 Compartir
            </button>
            <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
              📤 Exportar
            </button>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="px-6 flex gap-1 border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold rounded">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sitemap' && (
          <SitemapView
            projectName={projectName}
            setProjectName={setProjectName}
            sitemap={sitemap}
            setSitemap={setSitemap}
          />
        )}
        {activeTab === 'wireframe' && (
          <WireframeView sitemap={sitemap} />
        )}
        {activeTab === 'styleguide' && (
          <StyleGuideView
            styleGuide={styleGuide}
            setStyleGuide={setStyleGuide}
          />
        )}
        {activeTab === 'design' && (
          <DesignView sitemap={sitemap} styleGuide={styleGuide} />
        )}
      </div>

      {/* Footer con controles */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <button className="hover:text-gray-900">📱 Responsive</button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <button className="hover:text-gray-900">🔍 Zoom 100%</button>
        </div>
      </div>
    </div>
  )
}
