'use client'

import { useState } from 'react'
import { useDesignTokensStore } from '@/lib/stores/design-tokens-store'
import { Monitor, Tablet, Smartphone, Download, Code, X, ChevronLeft, Image as ImageIcon, Type, Palette, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section } from './LandingPageBuilder'
import { WireframeComponent } from './WireframeView'
import { getComponent } from '@/lib/component-registry'

interface Props {
  sections: Section[]
  styleGuide: any
  wireframeComponents: WireframeComponent[]
}

interface ColorScheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
}

const DEFAULT_SCHEMES: ColorScheme[] = [
  {
    id: '1',
    name: 'Scheme 1',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937'
  },
  {
    id: '2',
    name: 'Scheme 2',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    accentColor: '#F97316',
    backgroundColor: '#F9FAFB',
    textColor: '#111827'
  },
  {
    id: '3',
    name: 'Scheme 3',
    primaryColor: '#06B6D4',
    secondaryColor: '#14B8A6',
    accentColor: '#EAB308',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A'
  },
  {
    id: '4',
    name: 'Scheme 4',
    primaryColor: '#0F766E',
    secondaryColor: '#059669',
    accentColor: '#65A30D',
    backgroundColor: '#F0FDF4',
    textColor: '#14532D'
  },
]

export default function DesignView({ sections, styleGuide, wireframeComponents }: Props) {
  const { tokens } = useDesignTokensStore()
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [selectedComponent, setSelectedComponent] = useState<WireframeComponent | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSchemeSelector, setShowSchemeSelector] = useState(false)
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>(DEFAULT_SCHEMES)
  const [componentSchemes, setComponentSchemes] = useState<Record<string, string>>({})
  const [editedComponents, setEditedComponents] = useState<Record<string, any>>({})

  const componentsToRender = wireframeComponents.length > 0 ? wireframeComponents : null

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
    }
  }

  const getComponentScheme = (componentId: string): ColorScheme => {
    const schemeId = componentSchemes[componentId]
    return colorSchemes.find(s => s.id === schemeId) || colorSchemes[0]
  }

  const handleComponentClick = (component: WireframeComponent) => {
    setSelectedComponent(component)
    setShowSidebar(true)
    setShowSchemeSelector(false)
  }

  const handleUpdateContent = (field: string, value: any) => {
    if (!selectedComponent) return

    setEditedComponents({
      ...editedComponents,
      [selectedComponent.id]: {
        ...editedComponents[selectedComponent.id],
        [field]: value
      }
    })
  }

  const getEditedValue = (componentId: string, field: string, defaultValue: any) => {
    return editedComponents[componentId]?.[field] ?? defaultValue
  }

  const handleAssignScheme = (componentId: string, schemeId: string) => {
    setComponentSchemes({
      ...componentSchemes,
      [componentId]: schemeId
    })
  }

  const handleAddScheme = () => {
    const newScheme: ColorScheme = {
      id: Date.now().toString(),
      name: `Scheme ${colorSchemes.length + 1}`,
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    }
    setColorSchemes([...colorSchemes, newScheme])
  }

  const handleDownloadComponent = async (component: WireframeComponent) => {
    const componentHTML = document.getElementById(`component-${component.id}`)?.outerHTML || ''
    const blob = new Blob([componentHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${component.name.replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPage = async () => {
    const page = document.getElementById('design-canvas')
    if (!page) return

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${Array.from(page.querySelectorAll('[style]')).map(el => {
      const id = el.id || `el-${Math.random().toString(36).substr(2, 9)}`
      if (!el.id) el.id = id
      return `#${id} { ${(el as HTMLElement).style.cssText} }`
    }).join('\n    ')}
  </style>
</head>
<body>
${page.innerHTML}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'landing-page.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderComponent = (component: WireframeComponent) => {
    const scheme = getComponentScheme(component.id)
    const heading = getEditedValue(component.id, 'heading', component.content.heading || component.name)
    const subheading = getEditedValue(component.id, 'subheading', component.content.subheading || component.description)
    const buttonText = getEditedValue(component.id, 'buttonText', component.content.buttonText || 'Button')
    const image = getEditedValue(component.id, 'image', null)

    const baseStyles = {
      backgroundColor: scheme.backgroundColor,
      color: scheme.textColor,
    }

    // Try to load actual component from registry if componentPath exists
    if (component.componentPath) {
      const DynamicComponent = getComponent(component.componentPath)

      if (DynamicComponent) {
        return (
          <div
            id={`component-${component.id}`}
            className="transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
            onClick={() => handleComponentClick(component)}
          >
            <DynamicComponent />
          </div>
        )
      }
    }

    // Fallback to basic HTML rendering if no componentPath or component not found
    switch (component.type) {
      case 'header':
        return (
          <header
            id={`component-${component.id}`}
            className="px-8 py-4 border-b flex items-center justify-between transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <div className="text-xl font-bold" style={{ color: scheme.primaryColor }}>
              {heading}
            </div>
            <nav className="flex gap-6">
              {['Inicio', 'Servicios', 'Contacto'].map((item) => (
                <a key={item} href="#" className="font-medium transition-colors hover:opacity-70" style={{ color: scheme.textColor }}>
                  {item}
                </a>
              ))}
            </nav>
          </header>
        )

      case 'hero':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-20 text-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
            style={{...baseStyles, backgroundColor: `${scheme.primaryColor}10`}}
            onClick={() => handleComponentClick(component)}
          >
            {image && (
              <img src={image} alt="Hero" className="mx-auto mb-6 max-w-md rounded-lg shadow-lg" />
            )}
            <h1 className="font-bold mb-6 text-5xl" style={{ color: scheme.primaryColor }}>
              {heading}
            </h1>
            {subheading && (
              <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: scheme.textColor, opacity: 0.8 }}>
                {subheading}
              </p>
            )}
            <button
              className="px-8 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF' }}
            >
              {buttonText}
            </button>
          </section>
        )

      case 'features':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-12 text-3xl" style={{ color: scheme.primaryColor }}>
              {heading}
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 border rounded-lg transition-all hover:scale-105" style={{ borderColor: scheme.accentColor }}>
                  <div className="w-12 h-12 mb-4 flex items-center justify-center text-2xl rounded-lg" style={{ backgroundColor: `${scheme.secondaryColor}20` }}>
                    ✨
                  </div>
                  <h3 className="font-bold mb-2 text-xl" style={{ color: scheme.textColor }}>
                    Característica {i}
                  </h3>
                  <p style={{ color: scheme.textColor, opacity: 0.7 }}>
                    Descripción de la característica que hace que tu producto sea único.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )

      case 'cta':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 text-center cursor-pointer hover:opacity-95 transition-all"
            style={{ backgroundColor: scheme.primaryColor }}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold mb-4 text-3xl" style={{ color: '#FFFFFF' }}>
              {heading}
            </h2>
            <p className="text-lg mb-8" style={{ color: '#FFFFFF', opacity: 0.9 }}>
              {subheading}
            </p>
            <button
              className="px-8 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: '#FFFFFF', color: scheme.primaryColor }}
            >
              {buttonText}
            </button>
          </section>
        )

      default:
        return (
          <div
            id={`component-${component.id}`}
            className="px-8 py-16 border-t cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: scheme.primaryColor }}>
              {heading}
            </h2>
            <p style={{ color: scheme.textColor, opacity: 0.7 }}>
              {subheading}
            </p>
          </div>
        )
    }
  }

  if (sections.length === 0 && wireframeComponents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center animate-fadeIn">
          <div className="text-6xl mb-4 opacity-20">✨</div>
          <h3 className="text-lg font-semibold mb-2">No hay contenido para diseñar</h3>
          <p className="text-sm text-muted-foreground">
            Primero crea secciones en la pestaña Builder o wireframes en la pestaña Wireframe
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Sidebar de Edición */}
      {showSidebar && selectedComponent && (
        <div className="w-80 border-r bg-background flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            {showSchemeSelector ? (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowSchemeSelector(false)} className="hover:bg-muted rounded p-1">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-sm font-semibold">Schemes</h2>
                </div>
                <button onClick={() => setShowSidebar(false)} className="hover:bg-muted rounded p-1">
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-sm font-semibold">Section</h2>
                <button onClick={() => setShowSidebar(false)} className="hover:bg-muted rounded p-1">
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {showSchemeSelector ? (
              <div className="space-y-3">
                {colorSchemes.map((scheme) => {
                  const isSelected = componentSchemes[selectedComponent.id] === scheme.id
                  return (
                    <button
                      key={scheme.id}
                      onClick={() => {
                        handleAssignScheme(selectedComponent.id, scheme.id)
                        setShowSchemeSelector(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg text-left transition-all hover:bg-accent ${
                        isSelected ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: scheme.primaryColor }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{scheme.name}</p>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
                <button
                  onClick={handleAddScheme}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Scheme
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Make Global Section */}
                <button className="w-full flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <div className="text-green-600">✨</div>
                  <span className="text-sm font-medium">Make a global section</span>
                </button>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={getEditedValue(selectedComponent.id, 'heading', selectedComponent.content.heading || selectedComponent.name)}
                    onChange={(e) => handleUpdateContent('heading', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-muted text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={getEditedValue(selectedComponent.id, 'subheading', selectedComponent.content.subheading || selectedComponent.description)}
                    onChange={(e) => handleUpdateContent('subheading', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border bg-muted text-sm resize-none"
                  />
                  <button className="text-xs text-primary hover:underline">Prompt ✨</button>
                </div>

                {/* Component Type */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        📄
                      </div>
                      <span className="text-sm font-medium">{selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)}</span>
                    </div>
                    <span className="text-muted-foreground">›</span>
                  </button>
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <div className="inline-flex rounded-lg bg-muted p-1">
                    <button className="px-3 py-1.5 text-xs font-medium rounded bg-background shadow-sm">Normal</button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded">Card</button>
                  </div>
                </div>

                {/* Background */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background</label>
                  <div className="flex gap-2">
                    <button className="flex-1 p-3 rounded-lg border hover:bg-accent">
                      <ImageIcon className="h-5 w-5 mx-auto text-muted-foreground" />
                    </button>
                    <button className="flex-1 p-3 rounded-lg border hover:bg-accent">
                      <div className="h-5 w-5 mx-auto text-muted-foreground">▶</div>
                    </button>
                  </div>
                </div>

                {/* Element */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Element</label>
                  <div className="inline-flex rounded-lg bg-muted p-1">
                    <button className="px-3 py-1.5 text-xs font-medium rounded">Form</button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded bg-background shadow-sm">Button</button>
                  </div>
                </div>

                {/* Scheme */}
                <button
                  onClick={() => setShowSchemeSelector(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded flex-shrink-0"
                      style={{ backgroundColor: getComponentScheme(selectedComponent.id).primaryColor }}
                    />
                    <span className="text-sm font-medium">{getComponentScheme(selectedComponent.id).name}</span>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </button>

                {/* Image Upload */}
                {(selectedComponent.type === 'hero' || selectedComponent.type === 'features') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image</label>
                    <button
                      onClick={() => {
                        const url = prompt('Enter image URL:')
                        if (url) handleUpdateContent('image', url)
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">{getEditedValue(selectedComponent.id, 'image', null) ? 'Change Image' : 'Add Image'}</span>
                      </div>
                      <span className="text-muted-foreground">›</span>
                    </button>
                  </div>
                )}

                {/* Download Component */}
                <button
                  onClick={() => handleDownloadComponent(selectedComponent)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Download Component</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-semibold">Vista de Diseño</h2>
              <p className="text-[10px] text-muted-foreground">
                {wireframeComponents.length} componentes con esquemas de color
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport Selector */}
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/50 p-0.5">
              <button
                onClick={() => setViewMode('mobile')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === 'mobile' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                <Smartphone className="h-3 w-3" />
                Mobile
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === 'tablet' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                <Tablet className="h-3 w-3" />
                Tablet
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === 'desktop' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                <Monitor className="h-3 w-3" />
                Desktop
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={handleDownloadPage}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download Page
            </Button>

            <Button variant="outline" size="sm" onClick={() => alert('Exportar código próximamente...')}>
              <Code className="mr-1.5 h-3.5 w-3.5" />
              Export Code
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted/30 p-8">
          <div
            id="design-canvas"
            className="mx-auto bg-white shadow-2xl transition-all duration-300 overflow-hidden"
            style={{
              width: getViewportWidth(),
              minHeight: '100%',
            }}
          >
            {componentsToRender?.map((component) => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
