'use client'

import { useState } from 'react'
import { MaterialIcon } from '@/components/ui/material-icon'
import { IconPicker } from '@/components/ui/icon-picker'
import { Button } from '@/components/ui/button'

export default function TestIconsPage() {
  const [selectedIcon, setSelectedIcon] = useState('home')
  const [showPicker, setShowPicker] = useState(false)
  const [iconVariant, setIconVariant] = useState<'outlined' | 'rounded' | 'sharp'>('rounded')
  const [iconSize, setIconSize] = useState(48)
  const [iconFill, setIconFill] = useState(false)
  const [iconWeight, setIconWeight] = useState<100 | 200 | 300 | 400 | 500 | 600 | 700>(400)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Material Icons Test Page</h1>

        {/* Icon Display */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Icon</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg">
              <MaterialIcon
                icon={selectedIcon}
                variant={iconVariant}
                size={iconSize}
                fill={iconFill}
                weight={iconWeight}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Icon name:</p>
              <code className="text-lg font-mono bg-gray-100 px-3 py-1.5 rounded">
                {selectedIcon}
              </code>
            </div>
          </div>

          <Button onClick={() => setShowPicker(!showPicker)}>
            {showPicker ? 'Close' : 'Choose'} Icon
          </Button>
        </div>

        {/* Icon Picker */}
        {showPicker && (
          <div className="mb-8">
            <IconPicker
              value={selectedIcon}
              variant={iconVariant}
              onSelect={(icon) => {
                setSelectedIcon(icon)
              }}
              onClose={() => setShowPicker(false)}
            />
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Icon Customization</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <div className="flex gap-2">
                {(['outlined', 'rounded', 'sharp'] as const).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setIconVariant(variant)}
                    className={`px-4 py-2 rounded border-2 transition-colors ${
                      iconVariant === variant
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {iconSize}px
              </label>
              <input
                type="range"
                min="16"
                max="128"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight: {iconWeight}
              </label>
              <input
                type="range"
                min="100"
                max="700"
                step="100"
                value={iconWeight}
                onChange={(e) => setIconWeight(Number(e.target.value) as any)}
                className="w-full"
              />
            </div>

            {/* Fill */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={iconFill}
                  onChange={(e) => setIconFill(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Fill</span>
              </label>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Example Icons</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {[
              'home', 'star', 'favorite', 'shopping_cart', 'search', 'settings',
              'person', 'notifications', 'mail', 'phone', 'cloud', 'download',
              'upload', 'delete', 'edit', 'check', 'close', 'menu',
              'arrow_back', 'arrow_forward', 'info', 'warning', 'error', 'help',
              'calendar_today', 'schedule', 'work', 'dashboard', 'analytics', 'trending_up',
            ].map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  selectedIcon === icon
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:bg-gray-100'
                }`}
                title={icon}
              >
                <MaterialIcon icon={icon} variant={iconVariant} size={32} />
                <span className="text-xs text-gray-600 text-center">
                  {icon.replace(/_/g, ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">Code Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`import { MaterialIcon } from '@/components/ui/material-icon'

<MaterialIcon
  icon="${selectedIcon}"
  variant="${iconVariant}"
  size={${iconSize}}
  fill={${iconFill}}
  weight={${iconWeight}}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
