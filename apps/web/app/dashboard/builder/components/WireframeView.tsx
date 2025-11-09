'use client'

import { useState, useEffect } from 'react'
import { ComponentMockup } from './WireframeMockups'
import { Section } from './LandingPageBuilder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Replace,
  Sparkles,
  Plus,
  X,
  Layers,
  Loader2
} from 'lucide-react'

type ComponentType = 'hero' | 'header' | 'features' | 'cta' | 'testimonials' | 'footer' | 'form' | 'gallery' | 'stats' | 'logos' | 'pricing' | 'faq' | 'contact' | 'background'

interface DBComponent {
  id: string
  name: string
  displayName: string
  slug: string
  category: string
  subcategory: string | null
  type: string
  description: string
  icon: string
  tags: string[]
  componentPath: string
  thumbnail: string | null
  variantId: number
  variantName: string | null
  parentSlug: string | null
  isActive: boolean
  isPremium: boolean
  isNew: boolean
}

interface WireframeComponent {
  id: string
  type: ComponentType
  variant: number
  name: string
  description: string
  dbComponentId?: string // Link to database component
  componentPath?: string // Path to actual component for dynamic loading
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

interface Props {
  sections: Section[]
  wireframeComponents: WireframeComponent[]
  setWireframeComponents: (components: WireframeComponent[]) => void
}

export type { WireframeComponent, ComponentType }

// Tipo para la biblioteca de componentes cargada desde la BD
type ComponentLibrary = Record<ComponentType, {
  name: string
  icon: string
  variants: { id: number; name: string; description: string; dbComponentId?: string; componentPath?: string }[]
}>

export default function WireframeView({ sections, wireframeComponents, setWireframeComponents }: Props) {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [showReplacementModal, setShowReplacementModal] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [componentLibrary, setComponentLibrary] = useState<ComponentLibrary | null>(null)
  const [isLoadingComponents, setIsLoadingComponents] = useState(true)

  const selectedComponent = wireframeComponents.find(c => c.id === selectedComponentId)

  // Cargar componentes desde la base de datos
  useEffect(() => {
    async function loadComponents() {
      try {
        setIsLoadingComponents(true)
        const response = await fetch('/api/components?limit=200')
        const data = await response.json()

        if (data.components) {
          // Convertir la lista de componentes de BD a formato COMPONENT_LIBRARY
          const library: Partial<ComponentLibrary> = {}

          data.components.forEach((comp: DBComponent) => {
            const type = comp.type as ComponentType

            if (!library[type]) {
              library[type] = {
                name: comp.displayName || comp.name,
                icon: comp.icon,
                variants: []
              }
            }

            library[type]!.variants.push({
              id: comp.variantId,
              name: comp.displayName,
              description: comp.description,
              dbComponentId: comp.id,
              componentPath: comp.componentPath
            })
          })

          // Ordenar variantes por variantId
          Object.values(library).forEach(cat => {
            cat!.variants.sort((a, b) => a.id - b.id)
          })

          setComponentLibrary(library as ComponentLibrary)
        }
      } catch (error) {
        console.error('Error loading components:', error)
        // Fallback a una versión básica en caso de error
        setComponentLibrary({} as ComponentLibrary)
      } finally {
        setIsLoadingComponents(false)
      }
    }

    loadComponents()
  }, [])

  // Convert sections to wireframe components
  const generateWireframeFromSections = () => {
    if (!componentLibrary) return

    setIsGenerating(true)
    setTimeout(() => {
      const newWireframeComponents: WireframeComponent[] = sections.map((section, index) => {
        const type = section.type as ComponentType
        const library = componentLibrary[type]

        return {
          id: `component-${Date.now()}-${index}`,
          type,
          variant: 1,
          name: library?.variants[0]?.name || section.title,
          description: library?.variants[0]?.description || section.description,
          dbComponentId: library?.variants[0]?.dbComponentId,
          componentPath: library?.variants[0]?.componentPath,
          content: {
            heading: section.title,
            subheading: section.description,
            buttonText: 'Get Started',
          },
          style: {
            background: 'none',
            layout: 'default'
          }
        }
      })
      setWireframeComponents(newWireframeComponents)
      setIsGenerating(false)
    }, 1000)
  }

  // Agregar componente
  const addComponent = (type: ComponentType, index: number) => {
    if (!componentLibrary) return
    const library = componentLibrary[type]
    if (!library) return

    const newComponent: WireframeComponent = {
      id: `component-${Date.now()}`,
      type,
      variant: 1,
      name: library.variants[0]?.name || 'Component',
      description: library.variants[0]?.description || 'Description',
      dbComponentId: library.variants[0]?.dbComponentId,
      componentPath: library.variants[0]?.componentPath,
      content: {
        heading: 'Your heading here',
        subheading: 'Your subheading here',
        buttonText: 'Get Started',
      },
      style: {
        background: 'none',
        layout: 'default'
      }
    }

    const newComponents = [...wireframeComponents]
    newComponents.splice(index, 0, newComponent)
    setWireframeComponents(newComponents)
    setSelectedComponentId(newComponent.id)
    setShowAddMenu(null)
  }

  // Reemplazar variante de componente
  const replaceComponentVariant = (variantId: number) => {
    if (!selectedComponent || !componentLibrary) return

    const library = componentLibrary[selectedComponent.type]
    if (!library) return

    const variant = library.variants.find(v => v.id === variantId)
    if (!variant) return

    setWireframeComponents(wireframeComponents.map(c =>
      c.id === selectedComponentId
        ? {
            ...c,
            variant: variantId,
            name: variant.name,
            description: variant.description,
            dbComponentId: variant.dbComponentId,
            componentPath: variant.componentPath
          }
        : c
    ))
    setShowReplacementModal(false)
  }

  // Actualizar componente
  const updateComponent = (id: string, updates: Partial<WireframeComponent>) => {
    setWireframeComponents(wireframeComponents.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  // Eliminar componente
  const deleteComponent = (id: string) => {
    setWireframeComponents(wireframeComponents.filter(c => c.id !== id))
    if (selectedComponentId === id) {
      setSelectedComponentId(null)
    }
  }

  // Mover componente
  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = wireframeComponents.findIndex(c => c.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === wireframeComponents.length - 1) return

    const newComponents = [...wireframeComponents]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newComponents[index], newComponents[targetIndex]] = [newComponents[targetIndex], newComponents[index]]
    setWireframeComponents(newComponents)
  }

  // Loading state while components load from database
  if (isLoadingComponents) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Loading Components...</h3>
            <p className="text-sm text-muted-foreground">
              Fetching 160 components from database
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-auto border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
              <Layers className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Sections Yet</h3>
            <p className="text-sm text-muted-foreground">
              Create sections in the Builder tab first to generate wireframes
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Sidebar - Properties Panel */}
      <div className="w-80 bg-card border-r overflow-y-auto flex-shrink-0">
        <div className="p-6 border-b sticky top-0 bg-card z-10">
          <h3 className="text-sm font-semibold mb-1">Properties</h3>
          <p className="text-xs text-muted-foreground">
            {selectedComponent ? `Editing ${selectedComponent.type}` : 'Select a component to edit'}
          </p>
        </div>

        {selectedComponent ? (
          <div className="p-6 space-y-6">
            {/* Component Info */}
            <div className="space-y-2">
              <Label>Component</Label>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <span className="text-lg">{componentLibrary?.[selectedComponent.type]?.icon || '📦'}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{selectedComponent.name}</div>
                    <div className="text-xs text-muted-foreground">Variant {selectedComponent.variant}</div>
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={() => setShowReplacementModal(true)}
                variant="secondary"
                className="w-full"
              >
                <Replace className="mr-2 h-4 w-4" />
                Replace Component
              </Button>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                type="text"
                value={selectedComponent.content.heading || ''}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  content: { ...selectedComponent.content, heading: e.target.value }
                })}
                placeholder="Enter heading"
              />
            </div>

            {/* Subheading */}
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <Textarea
                id="subheading"
                value={selectedComponent.content.subheading || ''}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  content: { ...selectedComponent.content, subheading: e.target.value }
                })}
                placeholder="Enter subheading"
              />
            </div>

            {/* Button Text */}
            {['hero', 'cta'].includes(selectedComponent.type) && (
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  type="text"
                  value={selectedComponent.content.buttonText || ''}
                  onChange={(e) => updateComponent(selectedComponent.id, {
                    content: { ...selectedComponent.content, buttonText: e.target.value }
                  })}
                  placeholder="Enter button text"
                />
              </div>
            )}

            {/* Delete Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={() => deleteComponent(selectedComponent.id)}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Component
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Click on a component in the canvas to edit its properties
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="sticky top-0 z-10 bg-card border-b p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-semibold">Landing Page Wireframe</h2>
              <p className="text-xs text-muted-foreground">
                {sections.length} section{sections.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <Button
              onClick={generateWireframeFromSections}
              disabled={isGenerating || wireframeComponents.length > 0}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Wireframe
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-8">
          <div className="space-y-1">
            {/* Add Section Button (Top) */}
            <div className="relative mb-4">
              <Button
                onClick={() => setShowAddMenu(showAddMenu === -1 ? null : -1)}
                variant="outline"
                className="w-full border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>

              {showAddMenu === -1 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-20">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-auto">
                      {Object.entries(componentLibrary || {}).map(([type, data]) => (
                        <Button
                          key={type}
                          onClick={() => addComponent(type as ComponentType, 0)}
                          variant="ghost"
                          className="h-auto p-3 justify-start"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-lg">{data.icon}</span>
                            <div className="text-left flex-1">
                              <div className="font-medium text-xs">{data.name}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {data.variants.length} variants
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {wireframeComponents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-24 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-muted mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Click "Generate Wireframe" to create wireframes from your sections, or add sections manually
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {wireframeComponents.map((component, index) => (
                  <div key={component.id}>
                    <div className="mb-1">
                      <Card
                        onClick={() => setSelectedComponentId(component.id)}
                        className={`cursor-pointer transition-all ${
                          selectedComponentId === component.id
                            ? 'border-primary ring-4 ring-primary/10'
                            : 'hover:border-primary/50'
                        }`}
                        style={component.style.background === 'color' && component.style.backgroundColor
                          ? { backgroundColor: component.style.backgroundColor }
                          : {}
                        }
                      >
                        <CardContent className="relative p-8">
                          {/* Toolbar */}
                          {selectedComponentId === component.id && (
                            <div className="absolute top-2 right-2 flex gap-1 bg-background border rounded-lg shadow-lg p-1 z-10">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowReplacementModal(true)
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Replace className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveComponent(component.id, 'up')
                                }}
                                disabled={index === 0}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveComponent(component.id, 'down')
                                }}
                                disabled={index === wireframeComponents.length - 1}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteComponent(component.id)
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {/* Component Label */}
                          <div className="absolute top-2 left-2 px-3 py-1 rounded-md bg-background/90 backdrop-blur text-xs font-medium border shadow-sm">
                            {componentLibrary?.[component.type]?.icon || '📦'} {component.name}
                          </div>

                          {/* Mockup */}
                          <div className="mt-8">
                            <ComponentMockup component={component} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Add Section Button (Between components) */}
                    <div className="relative my-1">
                      <Button
                        onClick={() => setShowAddMenu(showAddMenu === index ? null : index)}
                        variant="ghost"
                        className="w-full border-2 border-dashed border-transparent hover:border-border opacity-0 hover:opacity-100"
                        size="sm"
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Section
                      </Button>

                      {showAddMenu === index && (
                        <Card className="absolute top-full left-0 right-0 mt-2 z-20">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-auto">
                              {Object.entries(componentLibrary || {}).map(([type, data]) => (
                                <Button
                                  key={type}
                                  onClick={() => addComponent(type as ComponentType, index + 1)}
                                  variant="ghost"
                                  className="h-auto p-3 justify-start"
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <span className="text-lg">{data.icon}</span>
                                    <div className="text-left flex-1">
                                      <div className="font-medium text-xs">{data.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {data.variants.length} variants
                                      </div>
                                    </div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Replacement Modal */}
      {showReplacementModal && selectedComponent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReplacementModal(false)}
        >
          <Card
            className="w-full max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Replace {componentLibrary?.[selectedComponent.type]?.name || 'Component'}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a variant to replace the current component
                  </p>
                </div>
                <Button
                  onClick={() => setShowReplacementModal(false)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-auto flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {componentLibrary?.[selectedComponent.type]?.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    onClick={() => replaceComponentVariant(variant.id)}
                    variant={selectedComponent.variant === variant.id ? "default" : "outline"}
                    className="h-auto p-4 flex-col items-start text-left"
                  >
                    <div className="aspect-video bg-muted rounded-lg mb-3 w-full flex items-center justify-center">
                      <span className="text-4xl">{componentLibrary?.[selectedComponent.type]?.icon || '📦'}</span>
                    </div>
                    <div className="font-medium text-sm mb-1">{variant.name}</div>
                    <div className="text-xs text-muted-foreground">{variant.description}</div>
                  </Button>
                )) || <p className="text-sm text-muted-foreground">No variants available</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
