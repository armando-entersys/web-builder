'use client'

import { useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

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
  sitemap: PageNode[]
  setSitemap: (sitemap: PageNode[]) => void
}

// Componente de nodo personalizado
function CustomNode({ data }: { data: any }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 min-w-[180px] max-w-[220px]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <span className="text-xs">🏠</span>
          <h3 className="font-semibold text-xs text-gray-900">{data.label}</h3>
        </div>
        <button className="text-gray-400 text-xs">⋯</button>
      </div>
      {data.description && (
        <p className="text-[10px] text-gray-600 leading-tight line-clamp-2">
          {data.description}
        </p>
      )}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export default function SitemapView({ projectName, setProjectName, sitemap, setSitemap }: Props) {
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [aiModel, setAiModel] = useState<'gpt-4o' | 'claude-3-7-sonnet' | 'gemini-2.0-flash'>('gpt-4o')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/sitemap/generate', {
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
        throw new Error(data.details || data.error || 'Error al generar sitemap')
      }

      setSitemap(data.sitemap)
      convertToFlowchart(data.sitemap)
    } catch (error) {
      console.error('Error generating sitemap:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsGenerating(false)
    }
  }

  const convertToFlowchart = (sitemapData: PageNode[]) => {
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
        },
      })

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${currentNodeId}`,
          source: parentId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { stroke: '#cbd5e1', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#cbd5e1',
          },
        })
      }

      if (node.children && node.children.length > 0) {
        const childSpacing = 250
        const totalWidth = (node.children.length - 1) * childSpacing
        const startX = xPos - totalWidth / 2

        node.children.forEach((child, index) => {
          const childX = startX + index * childSpacing
          const childY = yPos + 150
          processNode(child, level + 1, childX, childY, currentNodeId)
        })
      }

      return currentNodeId
    }

    sitemapData.forEach((page, index) => {
      const startX = 400 + index * 300
      const startY = 50
      processNode(page, 0, startX, startY)
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }

  const getModelInfo = (model: string) => {
    const models = {
      'gpt-4o': {
        name: 'GPT-4o',
        color: 'from-green-500 to-emerald-600',
        icon: '🤖',
      },
      'claude-3-7-sonnet': {
        name: 'Claude 3.7',
        color: 'from-purple-500 to-pink-600',
        icon: '🧠',
      },
      'gemini-2.0-flash': {
        name: 'Gemini 2.0',
        color: 'from-blue-500 to-cyan-600',
        icon: '⚡',
      }
    }
    return models[model as keyof typeof models]
  }

  return (
    <div className="h-full flex overflow-hidden">
      <style jsx global>{`
        .react-flow__node-custom {
          background: transparent;
          border: none;
          padding: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Mi Proyecto"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Industria
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Selecciona...</option>
                <option value="saas">SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="agency">Agencia</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                placeholder="Describe tu proyecto..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Modelo IA
              </label>
              <div className="space-y-1.5">
                {(['gpt-4o', 'claude-3-7-sonnet', 'gemini-2.0-flash'] as const).map((model) => {
                  const info = getModelInfo(model)
                  return (
                    <button
                      key={model}
                      onClick={() => setAiModel(model)}
                      className={`w-full p-2 rounded-md border text-left text-[11px] ${
                        aiModel === model
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{info.icon}</span>
                        <div className="flex-1 font-bold text-gray-900">{info.name}</div>
                        {aiModel === model && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]">
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-md text-[10px]">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !projectName || !industry || !description}
              className={`w-full py-2 px-3 rounded-md font-bold text-white text-xs ${
                isGenerating || !projectName || !industry || !description
                  ? 'bg-gray-300'
                  : `bg-gradient-to-r ${getModelInfo(aiModel).color}`
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando...
                </span>
              ) : (
                '✨ Generar Sitemap'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 bg-gray-50 relative">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-white border border-gray-300 text-xs rounded-md shadow-sm hover:bg-gray-50"
        >
          {showSidebar ? '◀' : '▶'} {showSidebar ? 'Ocultar' : 'Mostrar'}
        </button>

        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-20">📋</div>
              <p className="text-gray-400 text-xs">
                Genera tu sitemap con IA
              </p>
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
            <Background color="#e5e7eb" gap={20} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
