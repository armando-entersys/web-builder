'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    Panel,
    NodeTypes
} from 'reactflow'
import 'reactflow/dist/style.css'

import { useSitemapStore } from '../store/useSitemapStore'
import PageNode from './PageNode'
import { Plus, Undo, Redo, Save, Trash2 } from 'lucide-react'

const nodeTypes: NodeTypes = {
    pageNode: PageNode
}

export default function SitemapCanvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        selectNode,
        undo,
        redo,
        canUndo,
        canRedo,
        saveToServer,
        clearSitemap
    } = useSitemapStore()

    // Add new node in center of viewport
    const handleAddNode = useCallback(() => {
        // Calculate center position (simplified)
        const position = {
            x: 250 + Math.random() * 100,
            y: 150 + Math.random() * 100
        }
        addNode('pageNode', position)
    }, [addNode])

    // Node click handler
    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        selectNode(node.id)
    }, [selectNode])

    // Pane click handler (deselect)
    const onPaneClick = useCallback(() => {
        selectNode(null)
    }, [selectNode])

    const handleSave = useCallback(async () => {
        await saveToServer()
        // TODO: Show success toast
    }, [saveToServer])

    const handleClear = useCallback(() => {
        if (confirm('Are you sure you want to clear the entire sitemap?')) {
            clearSitemap()
        }
    }, [clearSitemap])

    return (
        <div className="w-full h-full relative bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                className="bg-gray-50"
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#9333ea', strokeWidth: 2 }
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    color="#e5e7eb"
                />

                <Controls
                    className="!bg-white !border-2 !border-gray-200 !shadow-lg"
                    showInteractive={false}
                />

                <MiniMap
                    className="!bg-white !border-2 !border-gray-200 !shadow-lg"
                    nodeColor={(node) => {
                        if (node.data.isPublished) return '#9333ea'
                        return '#9ca3af'
                    }}
                    maskColor="rgba(0, 0, 0, 0.05)"
                />

                {/* Top Toolbar */}
                <Panel position="top-left" className="flex gap-2">
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-1 flex gap-1">
                        {/* Add Node Button */}
                        <button
                            onClick={handleAddNode}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                            title="Add Page"
                        >
                            <Plus className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                        </button>

                        {/* Divider */}
                        <div className="w-px bg-gray-200 mx-1" />

                        {/* Undo */}
                        <button
                            onClick={undo}
                            disabled={!canUndo()}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                        </button>

                        {/* Redo */}
                        <button
                            onClick={redo}
                            disabled={!canRedo()}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                        </button>

                        {/* Divider */}
                        <div className="w-px bg-gray-200 mx-1" />

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                            title="Save"
                        >
                            <Save className="w-5 h-5 text-gray-700 group-hover:text-purple-600" />
                        </button>

                        {/* Clear */}
                        <button
                            onClick={handleClear}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Clear All"
                        >
                            <Trash2 className="w-5 h-5 text-gray-700 group-hover:text-red-600" />
                        </button>
                    </div>
                </Panel>

                {/* Stats Panel */}
                <Panel position="top-right" className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4">
                    <div className="flex gap-6 text-sm">
                        <div>
                            <div className="text-gray-500 text-xs">Pages</div>
                            <div className="text-xl font-bold text-gray-900">{nodes.length}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Published</div>
                            <div className="text-xl font-bold text-green-600">
                                {nodes.filter(n => n.data.isPublished).length}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs">Draft</div>
                            <div className="text-xl font-bold text-gray-600">
                                {nodes.filter(n => !n.data.isPublished).length}
                            </div>
                        </div>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    )
}
