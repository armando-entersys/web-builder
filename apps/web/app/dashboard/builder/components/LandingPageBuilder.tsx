'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, Copy, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

// Tipos de secciones disponibles
export interface Section {
  id: string
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'pricing' | 'faq' | 'contact' | 'gallery' | 'stats' | 'logos'
  title: string
  description: string
  content?: any
}

const SECTION_TEMPLATES: Record<Section['type'], { icon: string; name: string; description: string }> = {
  hero: { icon: '🎯', name: 'Hero', description: 'Sección principal con título y CTA' },
  features: { icon: '⭐', name: 'Características', description: 'Muestra las funcionalidades principales' },
  testimonials: { icon: '💬', name: 'Testimonios', description: 'Opiniones de clientes' },
  cta: { icon: '📢', name: 'Call to Action', description: 'Llamado a la acción' },
  pricing: { icon: '💰', name: 'Precios', description: 'Planes y precios' },
  faq: { icon: '❓', name: 'Preguntas', description: 'Preguntas frecuentes' },
  contact: { icon: '📧', name: 'Contacto', description: 'Formulario de contacto' },
  gallery: { icon: '🖼️', name: 'Galería', description: 'Galería de imágenes' },
  stats: { icon: '📊', name: 'Estadísticas', description: 'Números y métricas' },
  logos: { icon: '🏢', name: 'Logos', description: 'Logos de clientes/partners' },
}

interface Props {
  projectName: string
  setProjectName: (name: string) => void
  sections: Section[]
  setSections: (sections: Section[]) => void
}

export default function LandingPageBuilder({ projectName, setProjectName, sections, setSections }: Props) {
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Generar landing page con IA
  const handleGenerateWithAI = async () => {
    if (!projectName || !description) {
      alert('Por favor completa el nombre del proyecto y la descripción')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/landing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          industry,
          description,
        }),
      })

      const data = await response.json()
      if (data.sections) {
        setSections(data.sections)
      }
    } catch (error) {
      console.error('Error generating landing page:', error)
      // Generar estructura por defecto si falla la IA
      const defaultSections: Section[] = [
        {
          id: '1',
          type: 'hero',
          title: 'Hero Principal',
          description: 'Sección de bienvenida con título impactante y CTA',
        },
        {
          id: '2',
          type: 'features',
          title: 'Características Clave',
          description: 'Las principales ventajas y funcionalidades',
        },
        {
          id: '3',
          type: 'testimonials',
          title: 'Lo que dicen nuestros clientes',
          description: 'Testimonios y reseñas de clientes satisfechos',
        },
        {
          id: '4',
          type: 'cta',
          title: 'Comienza hoy',
          description: 'Llamado a la acción final',
        },
      ]
      setSections(defaultSections)
    } finally {
      setIsGenerating(false)
    }
  }

  // Agregar sección manualmente
  const addSection = (type: Section['type']) => {
    const template = SECTION_TEMPLATES[type]
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: template.name,
      description: template.description,
    }
    setSections([...sections, newSection])
    setShowAddMenu(false)
  }

  // Eliminar sección
  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  // Duplicar sección
  const duplicateSection = (section: Section) => {
    const newSection = {
      ...section,
      id: Date.now().toString(),
      title: `${section.title} (copia)`,
    }
    const index = sections.findIndex(s => s.id === section.id)
    const newSections = [...sections]
    newSections.splice(index + 1, 0, newSection)
    setSections(newSections)
  }

  // Drag and drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    newSections.splice(draggedIndex, 1)
    newSections.splice(index, 0, draggedSection)

    setSections(newSections)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="h-full flex overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <div className="w-96 border-r bg-background/80 backdrop-blur-xl p-6 overflow-y-auto flex-shrink-0 shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Landing Page Builder
            </h2>
            <p className="text-sm text-muted-foreground">
              Crea tu landing page perfecta con IA
            </p>
          </div>

          {/* Formulario */}
          <Card className="p-4 border-2 bg-card/50 backdrop-blur">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Nombre del Proyecto *
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="ej. Mi Producto SaaS"
                  className="border-2 focus:border-primary transition-colors"
                />
                {projectName && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>¡Perfecto!</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Industria (opcional)
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary outline-none"
                >
                  <option value="">Selecciona una industria...</option>
                  <option value="saas">SaaS / Software</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="agency">Agencia / Servicios</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthcare">Salud / Bienestar</option>
                  <option value="education">Educación</option>
                  <option value="real-estate">Bienes Raíces</option>
                  <option value="consulting">Consultoría</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Descripción del Proyecto *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tu producto o servicio... La IA usará esto para generar las secciones perfectas"
                  className="flex min-h-[100px] w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary outline-none resize-none"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !projectName || !description}
                className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generar con IA
                  </span>
                )}
              </Button>
            </div>
          </Card>

          {/* Contador de secciones */}
          {sections.length > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border">
              <span className="font-semibold text-foreground">{sections.length}</span> {sections.length === 1 ? 'sección' : 'secciones'} en tu landing page
            </div>
          )}
        </div>
      </div>

      {/* Canvas Principal */}
      <div className="flex-1 overflow-auto p-8">
        {sections.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md animate-fadeIn">
              <div className="mb-6 relative">
                <div className="absolute inset-0 -z-10 opacity-20 blur-3xl bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                <div className="text-7xl">🚀</div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Comienza tu Landing Page
              </h3>
              <p className="text-muted-foreground mb-6">
                Completa el formulario y genera tu landing page con IA, o agrega secciones manualmente
              </p>
              <Button
                onClick={() => setShowAddMenu(!showAddMenu)}
                variant="outline"
                className="relative"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Sección Manual
              </Button>

              {showAddMenu && (
                <div className="mt-4 p-4 bg-card border rounded-lg shadow-xl max-w-sm mx-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(SECTION_TEMPLATES).map(([type, template]) => (
                      <button
                        key={type}
                        onClick={() => addSection(type as Section['type'])}
                        className="p-3 border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-all text-left group"
                      >
                        <div className="text-2xl mb-1">{template.icon}</div>
                        <div className="font-medium text-xs text-foreground group-hover:text-primary">
                          {template.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Estructura de tu Landing Page</h3>
                <p className="text-sm text-muted-foreground">Arrastra para reordenar las secciones</p>
              </div>
              <Button
                onClick={() => setShowAddMenu(!showAddMenu)}
                size="sm"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Sección
              </Button>
            </div>

            {showAddMenu && (
              <Card className="p-4 mb-4 bg-muted/50">
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(SECTION_TEMPLATES).map(([type, template]) => (
                    <button
                      key={type}
                      onClick={() => addSection(type as Section['type'])}
                      className="p-3 border-2 border-border rounded-lg hover:border-primary hover:bg-background transition-all text-center group"
                    >
                      <div className="text-2xl mb-1">{template.icon}</div>
                      <div className="font-medium text-xs text-foreground group-hover:text-primary">
                        {template.name}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative transition-all ${
                  draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'
                }`}
              >
                <Card className="p-4 hover:shadow-lg transition-all border-2 hover:border-primary/50 bg-card/50 backdrop-blur">
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center text-2xl border-2 border-primary/20">
                      {SECTION_TEMPLATES[section.type].icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground mb-1">{section.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateSection(section)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSection(section.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {SECTION_TEMPLATES[section.type].name}
                        </span>
                        <span>•</span>
                        <span>Sección {index + 1} de {sections.length}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
