'use client'

import { useState, useEffect } from 'react'
import { useDesignTokensStore } from '@/lib/stores/design-tokens-store'
import { Monitor, Tablet, Smartphone, Download, Code, X, ChevronLeft, Image as ImageIcon, Type, Palette, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section } from './LandingPageBuilder'
import { WireframeComponent } from './WireframeView'
// import { getComponent } from '@/lib/component-registry' // Disabled temporarily

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
  const [designVersion, setDesignVersion] = useState(0)

  const componentsToRender = wireframeComponents.length > 0 ? wireframeComponents : null

  // Regenerate design when wireframe components change
  useEffect(() => {
    if (wireframeComponents.length > 0) {
      setDesignVersion(prev => prev + 1)
      // Apply styleGuide colors to default schemes if styleGuide exists
      if (styleGuide?.colors) {
        setColorSchemes(prevSchemes => {
          const updatedSchemes = [...prevSchemes]
          updatedSchemes[0] = {
            ...updatedSchemes[0],
            primaryColor: styleGuide.colors.primary || updatedSchemes[0].primaryColor,
            secondaryColor: styleGuide.colors.secondary || updatedSchemes[0].secondaryColor,
            accentColor: styleGuide.colors.accent || updatedSchemes[0].accentColor,
            backgroundColor: styleGuide.colors.background || updatedSchemes[0].backgroundColor,
            textColor: styleGuide.colors.text || updatedSchemes[0].textColor,
          }
          return updatedSchemes
        })
      }
    }
  }, [wireframeComponents, styleGuide])

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

    // Apply typography from Style Guide
    const headingStyles = {
      fontFamily: styleGuide?.typography?.headingFont || 'inherit',
      fontSize: styleGuide?.typography?.headingSize || 'inherit',
    }

    const bodyStyles = {
      fontFamily: styleGuide?.typography?.bodyFont || 'inherit',
      fontSize: styleGuide?.typography?.bodySize || 'inherit',
    }

    // TODO: Dynamic component loading disabled due to build issues with some components
    // Need to fix component imports (glb files, missing images, etc.) before enabling
    // if (component.componentPath) {
    //   const DynamicComponent = getComponent(component.componentPath)
    //   if (DynamicComponent) {
    //     return (
    //       <div
    //         id={`component-${component.id}`}
    //         className="transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
    //         onClick={() => handleComponentClick(component)}
    //       >
    //         <DynamicComponent />
    //       </div>
    //     )
    //   }
    // }

    // Fallback to basic HTML rendering
    // Render based on component type and variant
    const componentKey = `${component.type}-${component.variant}`

    switch (component.type) {
      case 'header':
        // Different header variants
        if (component.variant === 1) {
          return (
            <header
              id={`component-${component.id}`}
              className="px-8 py-4 border-b flex items-center justify-between transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
              style={baseStyles}
              onClick={() => handleComponentClick(component)}
            >
              <div className="text-xl font-bold" style={{ color: scheme.primaryColor, ...headingStyles }}>
                {heading}
              </div>
              <nav className="flex gap-6">
                {['Inicio', 'Servicios', 'Contacto'].map((item) => (
                  <a key={item} href="#" className="font-medium transition-colors hover:opacity-70" style={{ color: scheme.textColor, ...bodyStyles }}>
                    {item}
                  </a>
                ))}
              </nav>
            </header>
          )
        } else if (component.variant === 2) {
          return (
            <header
              id={`component-${component.id}`}
              className="px-8 py-6 flex flex-col items-center gap-4 transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
              style={{...baseStyles, borderBottom: `3px solid ${scheme.primaryColor}`}}
              onClick={() => handleComponentClick(component)}
            >
              <div className="text-2xl font-bold" style={{ color: scheme.primaryColor, ...headingStyles }}>
                {heading}
              </div>
              <nav className="flex gap-8">
                {['Inicio', 'Características', 'Precios', 'Contacto'].map((item) => (
                  <a key={item} href="#" className="font-semibold transition-all hover:scale-105" style={{ color: scheme.textColor, ...bodyStyles }}>
                    {item}
                  </a>
                ))}
              </nav>
            </header>
          )
        } else {
          // Variant 3+ - Sticky header with button
          return (
            <header
              id={`component-${component.id}`}
              className="px-8 py-4 flex items-center justify-between shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
              style={baseStyles}
              onClick={() => handleComponentClick(component)}
            >
              <div className="flex items-center gap-8">
                <div className="text-xl font-bold" style={{ color: scheme.primaryColor, ...headingStyles }}>
                  {heading}
                </div>
                <nav className="flex gap-6">
                  {['Inicio', 'Nosotros', 'Servicios'].map((item) => (
                    <a key={item} href="#" className="font-medium transition-colors hover:opacity-70" style={{ color: scheme.textColor, ...bodyStyles }}>
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              <button
                className="px-6 py-2 font-semibold rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF', ...bodyStyles }}
              >
                Contactar
              </button>
            </header>
          )
        }

      case 'hero':
        // Different hero variants
        if (component.variant === 1) {
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
              <h1 className="font-bold mb-6 text-5xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                {heading}
              </h1>
              {subheading && (
                <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: scheme.textColor, opacity: 0.8, ...bodyStyles }}>
                  {subheading}
                </p>
              )}
              <button
                className="px-8 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF', ...bodyStyles }}
              >
                {buttonText}
              </button>
            </section>
          )
        } else if (component.variant === 2) {
          return (
            <section
              id={`component-${component.id}`}
              className="px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
              style={baseStyles}
              onClick={() => handleComponentClick(component)}
            >
              <div className="text-left">
                <h1 className="font-bold mb-4 md:mb-6 text-3xl md:text-4xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                  {heading}
                </h1>
                {subheading && (
                  <p className="text-base md:text-lg mb-6 md:mb-8" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                    {subheading}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF', ...bodyStyles }}
                  >
                    {buttonText}
                  </button>
                  <button
                    className="px-6 py-3 font-semibold rounded-lg border-2 transition-all hover:scale-105"
                    style={{ borderColor: scheme.primaryColor, color: scheme.primaryColor, ...bodyStyles }}
                  >
                    Ver más
                  </button>
                </div>
              </div>
              <div className="aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-6xl"
                   style={{ backgroundColor: `${scheme.secondaryColor}20` }}>
                {image ? <img src={image} alt="Hero" className="w-full h-full object-cover rounded-2xl" /> : '🚀'}
              </div>
            </section>
          )
        } else {
          // Variant 3+ - Full width with background
          return (
            <section
              id={`component-${component.id}`}
              className="px-8 py-32 text-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500"
              style={{...baseStyles, background: `linear-gradient(135deg, ${scheme.primaryColor}20 0%, ${scheme.secondaryColor}20 100%)`}}
              onClick={() => handleComponentClick(component)}
            >
              <div className="max-w-4xl mx-auto">
                <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${scheme.accentColor}30`, color: scheme.accentColor, ...bodyStyles }}>
                  ✨ Nuevo
                </div>
                <h1 className="font-bold mb-6 text-6xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                  {heading}
                </h1>
                {subheading && (
                  <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: scheme.textColor, opacity: 0.8, ...bodyStyles }}>
                    {subheading}
                  </p>
                )}
                <button
                  className="px-10 py-4 font-bold rounded-full text-lg transition-all hover:scale-105 shadow-lg"
                  style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF', ...bodyStyles }}
                >
                  {buttonText}
                </button>
              </div>
            </section>
          )
        }

      case 'features':
        // Different feature variants
        if (component.variant === 1) {
          return (
            <section
              id={`component-${component.id}`}
              className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-2 hover:ring-blue-500 transition-all"
              style={baseStyles}
              onClick={() => handleComponentClick(component)}
            >
              <h2 className="font-bold text-center mb-8 md:mb-12 text-2xl md:text-3xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                {heading}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 border rounded-lg transition-all hover:scale-105" style={{ borderColor: scheme.accentColor }}>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center text-2xl rounded-lg" style={{ backgroundColor: `${scheme.secondaryColor}20` }}>
                      ✨
                    </div>
                    <h3 className="font-bold mb-2 text-xl" style={{ color: scheme.textColor, ...headingStyles }}>
                      Característica {i}
                    </h3>
                    <p style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                      Descripción de la característica que hace que tu producto sea único.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )
        } else if (component.variant === 2) {
          return (
            <section
              id={`component-${component.id}`}
              className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              style={{...baseStyles, backgroundColor: `${scheme.primaryColor}05`}}
              onClick={() => handleComponentClick(component)}
            >
              <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12 px-4">
                <h2 className="font-bold mb-4 text-2xl md:text-3xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                  {heading}
                </h2>
                {subheading && (
                  <p className="text-base md:text-lg" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                    {subheading}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 md:p-8 rounded-xl flex gap-4 transition-all hover:scale-105" style={{ backgroundColor: scheme.backgroundColor, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl rounded-xl" style={{ backgroundColor: `${scheme.primaryColor}15` }}>
                      🎯
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold mb-2 text-base md:text-lg" style={{ color: scheme.textColor, ...headingStyles }}>
                        Beneficio {i}
                      </h3>
                      <p className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        } else {
          // Variant 3+ - List style
          return (
            <section
              id={`component-${component.id}`}
              className="px-4 md:px-8 py-12 md:py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              style={baseStyles}
              onClick={() => handleComponentClick(component)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div>
                  <h2 className="font-bold mb-4 md:mb-6 text-3xl md:text-4xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
                    {heading}
                  </h2>
                  {subheading && (
                    <p className="text-base md:text-lg mb-6 md:mb-8" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                      {subheading}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: `${scheme.secondaryColor}10` }}>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: scheme.primaryColor }}>
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: scheme.textColor, ...headingStyles }}>
                          Característica Premium {i}
                        </h3>
                        <p className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                          Descripción breve de esta increíble característica.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

      case 'cta':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 text-center cursor-pointer hover:opacity-95 transition-all"
            style={{ backgroundColor: scheme.primaryColor }}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold mb-4 text-3xl" style={{ color: '#FFFFFF', ...headingStyles }}>
              {heading}
            </h2>
            <p className="text-lg mb-8" style={{ color: '#FFFFFF', opacity: 0.9, ...bodyStyles }}>
              {subheading}
            </p>
            <button
              className="px-8 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: '#FFFFFF', color: scheme.primaryColor, ...bodyStyles }}
            >
              {buttonText}
            </button>
          </section>
        )

      case 'testimonials':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-8 md:mb-12 text-2xl md:text-3xl px-4" style={{ color: scheme.primaryColor, ...headingStyles }}>
              {heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 border rounded-lg" style={{ borderColor: scheme.accentColor }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full" style={{ backgroundColor: `${scheme.primaryColor}20` }} />
                    <div className="min-w-0">
                      <div className="font-bold" style={{ color: scheme.textColor, ...bodyStyles }}>Cliente {i}</div>
                      <div className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>CEO, Empresa</div>
                    </div>
                  </div>
                  <p style={{ color: scheme.textColor, opacity: 0.8, ...bodyStyles }}>
                    "Excelente servicio, muy recomendado para cualquier proyecto."
                  </p>
                </div>
              ))}
            </div>
          </section>
        )

      case 'footer':
        return (
          <footer
            id={`component-${component.id}`}
            className="px-4 md:px-8 py-8 md:py-12 border-t cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <h3 className="font-bold mb-3 md:mb-4" style={{ color: scheme.primaryColor, ...headingStyles }}>{heading}</h3>
                <p className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>{subheading}</p>
              </div>
              {['Producto', 'Empresa', 'Legal'].map((col) => (
                <div key={col}>
                  <h4 className="font-semibold mb-3" style={{ color: scheme.textColor, ...headingStyles }}>{col}</h4>
                  <ul className="space-y-2 text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                    <li>Link 1</li>
                    <li>Link 2</li>
                    <li>Link 3</li>
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-6 md:pt-8 border-t text-center text-sm" style={{ color: scheme.textColor, opacity: 0.6, ...bodyStyles }}>
              © 2024 {heading}. Todos los derechos reservados.
            </div>
          </footer>
        )

      case 'gallery':
      case 'logos':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-8 md:mb-12 text-2xl md:text-3xl px-4" style={{ color: scheme.primaryColor, ...headingStyles }}>
              {heading}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-3xl md:text-4xl"
                  style={{ backgroundColor: `${scheme.secondaryColor}20` }}
                >
                  🖼️
                </div>
              ))}
            </div>
          </section>
        )

      case 'stats':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={{...baseStyles, backgroundColor: `${scheme.primaryColor}10`}}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-8 md:mb-12 text-2xl md:text-3xl px-4" style={{ color: scheme.primaryColor, ...headingStyles }}>
              {heading}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">
              {[
                { value: '10K+', label: 'Usuarios' },
                { value: '99%', label: 'Satisfacción' },
                { value: '24/7', label: 'Soporte' },
                { value: '50+', label: 'Países' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: scheme.primaryColor, ...headingStyles }}>
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )

      case 'pricing':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-8 md:mb-12 text-2xl md:text-3xl px-4" style={{ color: scheme.primaryColor, ...headingStyles }}>
              {heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              {['Básico', 'Pro', 'Enterprise'].map((plan, i) => (
                <div key={i} className="p-6 border rounded-lg" style={{ borderColor: scheme.accentColor }}>
                  <h3 className="font-bold mb-2 text-xl" style={{ color: scheme.textColor, ...headingStyles }}>{plan}</h3>
                  <div className="mb-4">
                    <span className="text-3xl md:text-4xl font-bold" style={{ color: scheme.primaryColor, ...headingStyles }}>
                      ${(i + 1) * 29}
                    </span>
                    <span className="text-sm" style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>/mes</span>
                  </div>
                  <button
                    className="w-full px-6 py-2 rounded-lg font-semibold"
                    style={{
                      backgroundColor: i === 1 ? scheme.primaryColor : 'transparent',
                      color: i === 1 ? '#FFFFFF' : scheme.primaryColor,
                      border: `2px solid ${scheme.primaryColor}`,
                      ...bodyStyles
                    }}
                  >
                    Elegir Plan
                  </button>
                </div>
              ))}
            </div>
          </section>
        )

      case 'faq':
      case 'contact':
      case 'form':
        return (
          <section
            id={`component-${component.id}`}
            className="px-8 py-16 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <h2 className="font-bold text-center mb-12 text-3xl" style={{ color: scheme.primaryColor, ...headingStyles }}>
              {heading}
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-center mb-8" style={{ color: scheme.textColor, opacity: 0.8, ...bodyStyles }}>
                {subheading}
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg" style={{ borderColor: scheme.accentColor }}>
                    <div className="font-semibold mb-2" style={{ color: scheme.textColor, ...bodyStyles }}>
                      {component.type === 'faq' ? `Pregunta ${i}` : `Campo ${i}`}
                    </div>
                    <div style={{ color: scheme.textColor, opacity: 0.7, ...bodyStyles }}>
                      {component.type === 'faq' ? 'Respuesta a la pregunta frecuente' : 'Valor del campo'}
                    </div>
                  </div>
                ))}
              </div>
              {component.type !== 'faq' && (
                <div className="text-center mt-8">
                  <button
                    className="px-8 py-3 font-semibold rounded-lg"
                    style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF', ...bodyStyles }}
                  >
                    {buttonText}
                  </button>
                </div>
              )}
            </div>
          </section>
        )

      case 'background':
        return (
          <div
            id={`component-${component.id}`}
            className="relative px-8 py-32 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${scheme.primaryColor}20 0%, ${scheme.secondaryColor}20 100%)`,
            }}
            onClick={() => handleComponentClick(component)}
          >
            <div className="relative z-10 text-center">
              <h2 className="text-5xl font-bold mb-6" style={{ color: scheme.primaryColor, ...headingStyles }}>
                {heading}
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: scheme.textColor, opacity: 0.9, ...bodyStyles }}>
                {subheading}
              </p>
            </div>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              color: scheme.primaryColor
            }} />
          </div>
        )

      default:
        return (
          <div
            id={`component-${component.id}`}
            className="px-8 py-16 border-t cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            style={baseStyles}
            onClick={() => handleComponentClick(component)}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                  backgroundColor: `${scheme.primaryColor}20`,
                  color: scheme.primaryColor
                }}>
                  {(component.type as string).toUpperCase()}
                </div>
                <div className="text-xs" style={{ color: scheme.textColor, opacity: 0.5 }}>
                  Component Preview
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: scheme.primaryColor }}>
                {heading}
              </h2>
              <p className="text-lg mb-8" style={{ color: scheme.textColor, opacity: 0.7 }}>
                {subheading}
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: scheme.primaryColor, color: '#FFFFFF' }}
                >
                  {buttonText}
                </button>
                <button
                  className="px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'transparent',
                    color: scheme.primaryColor,
                    border: `2px solid ${scheme.primaryColor}`
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
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
            {componentsToRender && componentsToRender.length > 0 ? (
              componentsToRender.map((component) => (
                <div key={`${component.id}-${designVersion}-${component.variant}-${JSON.stringify(component.content)}`}>
                  {renderComponent(component)}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px] p-12">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center text-4xl">
                    🎨
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    No hay componentes para diseñar
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Primero debes agregar y configurar componentes en la sección <strong>Wireframe</strong> para poder verlos y editarlos aquí en Design.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                    <span>💡</span>
                    <span>Ve a Wireframe → Agrega componentes → Vuelve aquí</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
