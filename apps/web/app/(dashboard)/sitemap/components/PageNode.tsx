import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { FileText, Globe, Lock, Trash2 } from 'lucide-react'
import { PageNodeData } from '../store/useSitemapStore'

function PageNode({ data, selected, id }: NodeProps<PageNodeData>) {
    return (
        <div
            className={`
        relative min-w-[200px] rounded-xl border-2 bg-white shadow-lg 
        transition-all duration-200
        ${selected
                    ? 'border-purple-500 shadow-xl shadow-purple-200 scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                }
      `}
        >
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white"
            />

            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${data.isPublished
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }
        `}>
                    {data.isPublished ? (
                        <Globe className="w-4 h-4 text-white" />
                    ) : (
                        <Lock className="w-4 h-4 text-white" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {data.label}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                        {data.slug}
                    </p>
                </div>
            </div>

            {/* Content */}
            {(data.title || data.description) && (
                <div className="px-4 py-3 space-y-1">
                    {data.title && (
                        <div className="flex items-start gap-2">
                            <FileText className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {data.title}
                            </p>
                        </div>
                    )}
                    {data.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                            {data.description}
                        </p>
                    )}
                </div>
            )}

            {/* Footer - Status Badge */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                    <span className={`
            text-xs px-2 py-1 rounded-full font-medium
            ${data.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }
          `}>
                        {data.isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white"
            />
        </div>
    )
}

export default memo(PageNode)
