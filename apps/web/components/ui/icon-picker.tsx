'use client'

import React, { useState, useMemo } from 'react'
import { MaterialIcon } from './material-icon'
import { Button } from './button'
import { Input } from './input'
import { X, Search } from 'lucide-react'

// Lista de iconos más comunes de Material Design 3
const COMMON_ICONS = [
  'home', 'person', 'settings', 'search', 'favorite', 'star', 'delete', 'edit',
  'check', 'close', 'menu', 'arrow_back', 'arrow_forward', 'expand_more', 'expand_less',
  'add', 'remove', 'shopping_cart', 'email', 'phone', 'location_on', 'calendar_today',
  'notifications', 'account_circle', 'lock', 'visibility', 'visibility_off',
  'upload', 'download', 'share', 'print', 'filter_list', 'sort', 'info',
  'warning', 'error', 'check_circle', 'cancel', 'help', 'bookmark',
  'work', 'schedule', 'dashboard', 'trending_up', 'analytics', 'attach_money',
  'thumb_up', 'thumb_down', 'group', 'chat', 'comment', 'forum',
  'image', 'photo_camera', 'videocam', 'music_note', 'play_arrow', 'pause',
  'stop', 'skip_next', 'skip_previous', 'volume_up', 'volume_off',
  'brightness_high', 'brightness_low', 'wifi', 'bluetooth', 'battery_full',
  'folder', 'description', 'article', 'insert_drive_file', 'cloud_upload', 'cloud_download',
  'save', 'content_copy', 'content_cut', 'content_paste', 'link', 'attachment',
  'flag', 'push_pin', 'label', 'local_offer', 'verified', 'security',
  'language', 'public', 'explore', 'map', 'navigation', 'my_location',
  'restaurant', 'local_cafe', 'local_hotel', 'local_hospital', 'local_pharmacy',
  'school', 'business', 'apartment', 'storefront', 'shopping_bag',
  'flight', 'train', 'directions_car', 'directions_bike', 'directions_walk',
  'build', 'construction', 'palette', 'brush', 'color_lens', 'format_paint',
  'code', 'terminal', 'bug_report', 'sync', 'autorenew', 'cached',
]

export interface IconPickerProps {
  value?: string
  variant?: 'outlined' | 'rounded' | 'sharp'
  onSelect: (icon: string) => void
  onClose?: () => void
}

export function IconPicker({
  value = '',
  variant = 'rounded',
  onSelect,
  onClose,
}: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(value)

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return COMMON_ICONS

    const query = searchQuery.toLowerCase()
    return COMMON_ICONS.filter(icon => icon.includes(query))
  }, [searchQuery])

  const handleSelect = (icon: string) => {
    setSelectedIcon(icon)
    onSelect(icon)
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Select Material Icon</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedIcon && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Selected:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded">
              <MaterialIcon icon={selectedIcon} variant={variant} size={20} />
              <span className="font-mono text-xs">{selectedIcon}</span>
            </div>
          </div>
        )}
      </div>

      {/* Icon Grid */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MaterialIcon icon="search_off" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No icons found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {filteredIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => handleSelect(icon)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-lg border-2
                  hover:bg-blue-50 hover:border-blue-200 transition-all
                  ${selectedIcon === icon ? 'bg-blue-50 border-blue-500' : 'border-transparent'}
                `}
                title={icon}
              >
                <MaterialIcon icon={icon} variant={variant} size={24} />
                <span className="text-[10px] text-gray-600 truncate w-full text-center">
                  {icon.replace(/_/g, ' ')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-500">
          {filteredIcons.length} icons available
        </p>
        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default IconPicker
