'use client'

import { useState } from 'react'
import SitemapCanvas from './components/SitemapCanvas'
import NodeEditor from './components/NodeEditor'
import TemplateLibrary from './components/TemplateLibrary'
import { Layout, Sparkles } from 'lucide-react'

export default function SitemapPage() {
    const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false)

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Sitemap Builder</h1>
                            <p className="text-sm text-gray-500">Visual sitemap creation tool</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsTemplateLibraryOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 font-medium rounded-lg transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            Templates
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Canvas Section */}
                <div className="flex-1 relative">
                    <SitemapCanvas />
                </div>

                {/* Editor Sidebar */}
                <div className="w-96 flex-shrink-0">
                    <NodeEditor />
                </div>
            </div>

            {/* Template Library Modal */}
            <TemplateLibrary
                isOpen={isTemplateLibraryOpen}
                onClose={() => setIsTemplateLibraryOpen(false)}
            />
        </div>
    )
}
