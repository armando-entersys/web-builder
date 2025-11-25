import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    Node,
    Edge,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection
} from 'reactflow'

// Types
export type PageNodeData = {
    label: string
    slug: string
    title?: string
    description?: string
    metaTitle?: string
    metaDescription?: string
    isPublished: boolean
}

export type SitemapNode = Node<PageNodeData>

export type SitemapTemplate = {
    id: string
    name: string
    description: string
    category: 'saas' | 'ecommerce' | 'blog' | 'portfolio' | 'agency'
    nodes: SitemapNode[]
    edges: Edge[]
    preview?: string
}

type HistoryState = {
    nodes: SitemapNode[]
    edges: Edge[]
}

interface SitemapState {
    // Core state
    nodes: SitemapNode[]
    edges: Edge[]
    selectedNodeId: string | null

    // History for undo/redo
    history: HistoryState[]
    historyIndex: number

    // Templates
    templates: SitemapTemplate[]

    // Project metadata
    projectId: string | null
    projectName: string

    // Actions
    setNodes: (nodes: SitemapNode[]) => void
    setEdges: (edges: Edge[]) => void
    onNodesChange: (changes: NodeChange[]) => void
    onEdgesChange: (changes: EdgeChange[]) => void
    onConnect: (connection: Connection) => void

    addNode: (type: string, position: { x: number; y: number }) => void
    updateNode: (nodeId: string, data: Partial<PageNodeData>) => void
    deleteNode: (nodeId: string) => void

    selectNode: (nodeId: string | null) => void

    // Template actions
    applyTemplate: (template: SitemapTemplate) => void
    saveAsTemplate: (name: string, description: string, category: SitemapTemplate['category']) => void

    // History actions
    undo: () => void
    redo: () => void
    canUndo: () => boolean
    canRedo: () => boolean

    // Project actions
    setProjectId: (id: string) => void
    setProjectName: (name: string) => void
    clearSitemap: () => void

    // Persistence
    loadFromServer: (projectId: string) => Promise<void>
    saveToServer: () => Promise<void>
}

// Helper function to add to history
const addToHistory = (
    state: SitemapState,
    newNodes: SitemapNode[],
    newEdges: Edge[]
): Partial<SitemapState> => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push({ nodes: newNodes, edges: newEdges })

    // Limit history to 50 states
    if (newHistory.length > 50) {
        newHistory.shift()
    }

    return {
        history: newHistory,
        historyIndex: newHistory.length - 1
    }
}

// Initial templates
const initialTemplates: SitemapTemplate[] = [
    {
        id: 'saas-basic',
        name: 'SaaS Basic',
        description: 'Standard SaaS website structure',
        category: 'saas',
        nodes: [
            { id: '1', type: 'pageNode', position: { x: 250, y: 0 }, data: { label: 'Home', slug: '/', isPublished: true } },
            { id: '2', type: 'pageNode', position: { x: 100, y: 150 }, data: { label: 'Features', slug: '/features', isPublished: true } },
            { id: '3', type: 'pageNode', position: { x: 250, y: 150 }, data: { label: 'Pricing', slug: '/pricing', isPublished: true } },
            { id: '4', type: 'pageNode', position: { x: 400, y: 150 }, data: { label: 'About', slug: '/about', isPublished: true } },
            { id: '5', type: 'pageNode', position: { x: 250, y: 300 }, data: { label: 'Contact', slug: '/contact', isPublished: true } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e1-4', source: '1', target: '4' },
            { id: 'e1-5', source: '1', target: '5' },
        ]
    },
    {
        id: 'ecommerce-basic',
        name: 'E-Commerce Basic',
        description: 'Basic e-commerce store structure',
        category: 'ecommerce',
        nodes: [
            { id: '1', type: 'pageNode', position: { x: 250, y: 0 }, data: { label: 'Home', slug: '/', isPublished: true } },
            { id: '2', type: 'pageNode', position: { x: 100, y: 150 }, data: { label: 'Shop', slug: '/shop', isPublished: true } },
            { id: '3', type: 'pageNode', position: { x: 250, y: 150 }, data: { label: 'About', slug: '/about', isPublished: true } },
            { id: '4', type: 'pageNode', position: { x: 400, y: 150 }, data: { label: 'Contact', slug: '/contact', isPublished: true } },
            { id: '5', type: 'pageNode', position: { x: 100, y: 300 }, data: { label: 'Product Page', slug: '/product/:id', isPublished: false } },
            { id: '6', type: 'pageNode', position: { x: 250, y: 300 }, data: { label: 'Cart', slug: '/cart', isPublished: true } },
            { id: '7', type: 'pageNode', position: { x: 400, y: 300 }, data: { label: 'Checkout', slug: '/checkout', isPublished: true } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e1-4', source: '1', target: '4' },
            { id: 'e2-5', source: '2', target: '5' },
            { id: 'e2-6', source: '2', target: '6' },
            { id: 'e6-7', source: '6', target: '7' },
        ]
    }
]

export const useSitemapStore = create<SitemapState>()(
    persist(
        (set, get) => ({
            // Initial state
            nodes: [],
            edges: [],
            selectedNodeId: null,
            history: [{ nodes: [], edges: [] }],
            historyIndex: 0,
            templates: initialTemplates,
            projectId: null,
            projectName: 'Untitled Project',

            // Basic setters
            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),

            // React Flow handlers
            onNodesChange: (changes) => {
                const state = get()
                const newNodes = applyNodeChanges(changes, state.nodes) as SitemapNode[]
                set({
                    nodes: newNodes,
                    ...addToHistory(state, newNodes, state.edges)
                })
            },

            onEdgesChange: (changes) => {
                const state = get()
                const newEdges = applyEdgeChanges(changes, state.edges)
                set({
                    edges: newEdges,
                    ...addToHistory(state, state.nodes, newEdges)
                })
            },

            onConnect: (connection) => {
                const state = get()
                const newEdges = addEdge(connection, state.edges)
                set({
                    edges: newEdges,
                    ...addToHistory(state, state.nodes, newEdges)
                })
            },

            // Node operations
            addNode: (type, position) => {
                const state = get()
                const id = `node_${Date.now()}`
                const newNode: SitemapNode = {
                    id,
                    type: 'pageNode',
                    position,
                    data: {
                        label: 'New Page',
                        slug: '/new-page',
                        isPublished: false
                    }
                }

                const newNodes = [...state.nodes, newNode]
                set({
                    nodes: newNodes,
                    selectedNodeId: id,
                    ...addToHistory(state, newNodes, state.edges)
                })
            },

            updateNode: (nodeId, data) => {
                const state = get()
                const newNodes = state.nodes.map(node =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, ...data } }
                        : node
                )
                set({
                    nodes: newNodes,
                    ...addToHistory(state, newNodes, state.edges)
                })
            },

            deleteNode: (nodeId) => {
                const state = get()
                const newNodes = state.nodes.filter(node => node.id !== nodeId)
                const newEdges = state.edges.filter(
                    edge => edge.source !== nodeId && edge.target !== nodeId
                )
                set({
                    nodes: newNodes,
                    edges: newEdges,
                    selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
                    ...addToHistory(state, newNodes, newEdges)
                })
            },

            selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

            // Template operations
            applyTemplate: (template) => {
                const state = get()
                set({
                    nodes: template.nodes,
                    edges: template.edges,
                    selectedNodeId: null,
                    ...addToHistory(state, template.nodes, template.edges)
                })
            },

            saveAsTemplate: (name, description, category) => {
                const state = get()
                const newTemplate: SitemapTemplate = {
                    id: `template_${Date.now()}`,
                    name,
                    description,
                    category,
                    nodes: state.nodes,
                    edges: state.edges
                }
                set({ templates: [...state.templates, newTemplate] })
            },

            // History operations
            undo: () => {
                const state = get()
                if (state.historyIndex > 0) {
                    const newIndex = state.historyIndex - 1
                    const { nodes, edges } = state.history[newIndex]
                    set({
                        nodes,
                        edges,
                        historyIndex: newIndex,
                        selectedNodeId: null
                    })
                }
            },

            redo: () => {
                const state = get()
                if (state.historyIndex < state.history.length - 1) {
                    const newIndex = state.historyIndex + 1
                    const { nodes, edges } = state.history[newIndex]
                    set({
                        nodes,
                        edges,
                        historyIndex: newIndex,
                        selectedNodeId: null
                    })
                }
            },

            canUndo: () => get().historyIndex > 0,
            canRedo: () => get().historyIndex < get().history.length - 1,

            // Project operations
            setProjectId: (id) => set({ projectId: id }),
            setProjectName: (name) => set({ projectName: name }),

            clearSitemap: () => {
                const state = get()
                set({
                    nodes: [],
                    edges: [],
                    selectedNodeId: null,
                    ...addToHistory(state, [], [])
                })
            },

            // Server sync (placeholder - will implement with tRPC)
            loadFromServer: async (projectId) => {
                // TODO: Implement with tRPC
                console.log('Loading project:', projectId)
            },

            saveToServer: async () => {
                // TODO: Implement with tRPC
                const state = get()
                console.log('Saving project:', state.projectId, state.nodes, state.edges)
            }
        }),
        {
            name: 'sitemap-storage',
            partialize: (state) => ({
                nodes: state.nodes,
                edges: state.edges,
                projectId: state.projectId,
                projectName: state.projectName,
                templates: state.templates
            })
        }
    )
)
