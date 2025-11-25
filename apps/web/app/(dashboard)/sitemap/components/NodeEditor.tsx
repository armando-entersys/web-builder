'use client'

import { useSitemapStore } from '../store/useSitemapStore'
import { X, Save, Trash2, Globe, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NodeEditor() {
    const { nodes, selectedNodeId, updateNode, deleteNode, selectNode } = useSitemapStore()

    const selectedNode = nodes.find(n => n.id === selectedNodeId)

    // Local form state
    const [formData, setFormData] = useState({
        label: '',
        slug: '',
        title: '',
        description: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: false
    })

    // Update form when node changes
    useEffect(() => {
        if (selectedNode) {
            setFormData({
                label: selectedNode.data.label || '',
                slug: selectedNode.data.slug || '',
                title: selectedNode.data.title || '',
                description: selectedNode.data.description || '',
                metaTitle: selectedNode.data.metaTitle || '',
                metaDescription: selectedNode.data.metaDescription || '',
                isPublished: selectedNode.data.isPublished || false
            })
        }
    }, [selectedNode])

    if (!selectedNode) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p className="text-sm font-medium">No page selected</p>
                    <p className="text-xs mt-1">Click on a page node to edit its properties</p>
                </div>
            </div>
        )
    }

    const handleSave = () => {
        updateNode(selectedNodeId!, formData)
        // TODO: Show toast notification
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this page?')) {
            deleteNode(selectedNodeId!)
        }
    }

    const handleClose = () => {
        selectNode(null)
    }

    return (
        <div className="h-full flex flex-col bg-white border-l-2 border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                    <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${formData.isPublished
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }
          `}>
                        {formData.isPublished ? (
                            <Globe className="w-5 h-5 text-white" />
                        ) : (
                            <Lock className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Edit Page</h2>
                        <p className="text-xs text-gray-500">{selectedNode.id}</p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Page Name
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors"
                                placeholder="e.g., Home, About, Contact"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors font-mono text-sm"
                                placeholder="e.g., /about, /contact"
                            />
                            <p className="text-xs text-gray-500 mt-1">The URL path for this page</p>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Page Content</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Page Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors"
                                placeholder="Main heading for the page"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors resize-none"
                                placeholder="Brief description of the page content"
                            />
                        </div>
                    </div>
                </section>

                {/* SEO Metadata */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Metadata</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors"
                                placeholder="SEO title (50-60 characters)"
                                maxLength={60}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.metaTitle.length}/60 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Meta Description
                            </label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-0 outline-none transition-colors resize-none"
                                placeholder="SEO description (150-160 characters)"
                                maxLength={160}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.metaDescription.length}/160 characters
                            </p>
                        </div>
                    </div>
                </section>

                {/* Publishing Status */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Publishing</h3>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <div>
                            <div className="text-sm font-medium text-gray-900">Publish this page</div>
                            <div className="text-xs text-gray-500">Make this page visible in the final site</div>
                        </div>
                    </label>
                </section>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 px-6 py-4 border-t-2 border-gray-200 bg-gray-50">
                <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2.5 border-2 border-red-200 hover:bg-red-50 text-red-600 font-medium rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
