'use client'

import { useState } from 'react'
import { useSitemapStore, SitemapTemplate } from '../store/useSitemapStore'
import { X, Sparkles, ShoppingBag, BookOpen, Briefcase, User } from 'lucide-react'

const templateIcons = {
    saas: Sparkles,
    ecommerce: ShoppingBag,
    blog: BookOpen,
    portfolio: User,
    agency: Briefcase
}

interface TemplateLibraryProps {
    isOpen: boolean
    onClose: () => void
}

export default function TemplateLibrary({ isOpen, onClose }: TemplateLibraryProps) {
    const { templates, applyTemplate } = useSitemapStore()
    const [selectedTemplate, setSelectedTemplate] = useState<SitemapTemplate | null>(null)

    if (!isOpen) return null

    const handleApply = () => {
        if (selectedTemplate) {
            applyTemplate(selectedTemplate)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col m-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Template Library</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose a pre-built sitemap to get started</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Template Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((template) => {
                            const Icon = templateIcons[template.category]
                            const isSelected = selectedTemplate?.id === template.id

                            return (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`
                    text-left p-5 rounded-xl border-2 transition-all duration-200
                    ${isSelected
                                            ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200'
                                            : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                                        }
                  `}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isSelected
                                                ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                                                : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                            }
                    `}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {template.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {template.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                    {template.nodes.length} pages
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    {template.edges.length} connections
                                                </span>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="flex-shrink-0">
                                                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Preview (simplified) */}
                                    {isSelected && (
                                        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                                            <div className="text-xs font-medium text-gray-700 mb-2">Pages:</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {template.nodes.map((node) => (
                                                    <span
                                                        key={node.id}
                                                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                                                    >
                                                        {node.data.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Empty State */}
                    {templates.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No templates available</p>
                            <p className="text-sm text-gray-400 mt-1">Create your first template from the canvas</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        {selectedTemplate
                            ? `Selected: ${selectedTemplate.name}`
                            : 'Select a template to continue'
                        }
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!selectedTemplate}
                            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
