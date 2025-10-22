'use client'

import React, { useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'

interface PageNode {
  id: string
  title: string
  slug: string
  description?: string
  children?: PageNode[]
}

interface Props {
  projectName: string
  setProjectName: (name: string) => void
  pages: PageNode[]
  setPages: (pages: PageNode[]) => void
  onNodeCountChange?: (count: number) => void
}

// Premium Custom Node Component
function CustomNode({ data }: { data: any }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex min-w-[200px] max-w-[240px] flex-col gap-2.5 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-sm leading-none text-foreground">
              {data.label}
            </h3>
            {data.description && (
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export default function BuilderView({ projectName, setProjectName, pages, setPages, onNodeCountChange }: Props) {
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [aiModel, setAiModel] = useState<'gpt-4o' | 'claude-3-7-sonnet' | 'gemini-2.0-flash'>('gpt-4o')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  React.useEffect(() => {
    if (onNodeCountChange) {
      onNodeCountChange(nodes.length)
    }
  }, [nodes.length, onNodeCountChange])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/landing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          industry,
          description,
          model: aiModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error generating pages')
      }

      setPages(data.pages || data.sitemap)
      convertToFlowchart(data.pages || data.sitemap)
    } catch (error) {
      console.error('Error generating pages:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  const convertToFlowchart = (pagesData: PageNode[]) => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []
    let nodeId = 0

    const processNode = (
      node: PageNode,
      level: number,
      xPos: number,
      yPos: number,
      parentId?: string
    ): number => {
      const currentNodeId = `node-${nodeId++}`

      newNodes.push({
        id: currentNodeId,
        type: 'custom',
        position: { x: xPos, y: yPos },
        data: {
          label: node.title,
          description: node.description,
          slug: node.slug,
        },
      })

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${currentNodeId}`,
          source: parentId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        })
      }

      if (node.children && node.children.length > 0) {
        const childSpacing = 350 // Aumentado de 280 a 350
        const totalWidth = (node.children.length - 1) * childSpacing
        const startX = xPos - totalWidth / 2

        node.children.forEach((child, index) => {
          const childX = startX + index * childSpacing
          const childY = yPos + 220 // Aumentado de 180 a 220 para más espacio vertical
          processNode(child, level + 1, childX, childY, currentNodeId)
        })
      }

      return currentNodeId
    }

    pagesData.forEach((page, index) => {
      const startX = 500 + index * 400 // Aumentado el spacing inicial
      const startY = 80 // Más padding desde arriba
      processNode(page, 0, startX, startY)
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }

  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Most capable model' },
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7', provider: 'Anthropic', description: 'Balanced performance' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0', provider: 'Google', description: 'Fastest generation' },
  ]

  return (
    <div className="flex h-full bg-muted/30">
      {/* Premium Sidebar */}
      {showSidebar && (
        <aside className="w-96 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="border-b px-6 py-4">
              <h2 className="text-base font-semibold tracking-tight">Project Configuration</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate your pages with AI
              </p>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Project Name Field */}
                <div className="space-y-2 animate-slideIn">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Project Name
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      projectName ? 'border-input' : 'border-muted'
                    }`}
                    placeholder="e.g., My Awesome Website"
                  />
                  {projectName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 animate-fadeIn">
                      <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Looks good!</span>
                    </p>
                  )}
                </div>

                {/* Industry Field */}
                <div className="space-y-2 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Industry
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      industry ? 'border-input' : 'border-muted'
                    }`}
                  >
                    <option value="">Select an industry</option>
                    <option value="saas">SaaS & Software</option>
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="agency">Agency & Services</option>
                    <option value="portfolio">Portfolio & Personal</option>
                    <option value="blog">Blog & Content</option>
                  </select>
                </div>

                {/* Description Field */}
                <div className="space-y-2 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Description
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {description.length}/500
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      description ? 'border-input' : 'border-muted'
                    }`}
                    placeholder="e.g., A modern SaaS platform for project management with real-time collaboration features..."
                  />
                  {description && description.length < 20 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1.5 animate-fadeIn">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Add more details for better results
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">AI Model</span>
                  </div>
                </div>

                {/* AI Model Selection */}
                <div className="space-y-3">
                  {(models as any).map((model: any) => (
                    <button
                      key={model.id}
                      onClick={() => setAiModel(model.id)}
                      className={`relative flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all hover:bg-accent/50 ${
                        aiModel === model.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-input'
                      }`}
                    >
                      <div className="flex h-5 items-center">
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          aiModel === model.id
                            ? 'border-primary bg-primary'
                            : 'border-input'
                        }`}>
                          {aiModel === model.id && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{model.name}</p>
                          <span className="text-xs text-muted-foreground">{model.provider}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Footer - Generate Button */}
            <div className="border-t p-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !projectName || !industry || !description}
                className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shadow"
              >
                {isGenerating ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Pages
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Premium Canvas */}
      <div className="relative flex-1">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-4 top-4 z-10 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Empty State, Loading State or ReactFlow */}
        {isGenerating ? (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-md animate-fadeIn">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
                <svg className="h-10 w-10 text-primary animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Generating Your Pages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI is analyzing your project and creating an optimized structure...
                </p>
              </div>
              {/* Loading skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-3 w-3/4 mx-auto rounded-full animate-shimmer" />
                <div className="h-3 w-full mx-auto rounded-full animate-shimmer" style={{ animationDelay: '0.2s' }} />
                <div className="h-3 w-5/6 mx-auto rounded-full animate-shimmer" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center space-y-3 max-w-md animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold">No pages yet</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Configure your project details and generate AI-powered pages to get started.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.3}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background className="bg-muted/30" gap={16} size={1} />
            <Controls className="rounded-lg border bg-background shadow-sm" showInteractive={false} />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
