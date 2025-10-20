'use client'

import { useState } from 'react'

interface StyleGuide {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    headingSize: string
    bodySize: string
  }
}

interface Props {
  styleGuide: StyleGuide | null
  setStyleGuide: (styleGuide: StyleGuide) => void
}

export default function StyleGuideView({ styleGuide, setStyleGuide }: Props) {
  const [industry, setIndustry] = useState('')
  const [style, setStyle] = useState<'modern' | 'classic' | 'minimal' | 'bold'>('modern')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // TODO: Implementar generación con IA
    setTimeout(() => {
      const generatedStyleGuide: StyleGuide = {
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#EC4899',
          background: '#FFFFFF',
          text: '#1F2937',
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          headingSize: '32px',
          bodySize: '16px',
        },
      }
      setStyleGuide(generatedStyleGuide)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-700 mb-3">
              GENERAR GUÍA DE ESTILO
            </h3>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Industria
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Selecciona...</option>
              <option value="tech">Tecnología</option>
              <option value="finance">Finanzas</option>
              <option value="health">Salud</option>
              <option value="education">Educación</option>
              <option value="ecommerce">E-commerce</option>
              <option value="agency">Agencia</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Estilo Visual
            </label>
            <div className="space-y-2">
              {[
                { value: 'modern', label: 'Moderno', desc: 'Limpio y actual' },
                { value: 'classic', label: 'Clásico', desc: 'Elegante y atemporal' },
                { value: 'minimal', label: 'Minimalista', desc: 'Simple y esencial' },
                { value: 'bold', label: 'Audaz', desc: 'Vibrante y llamativo' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStyle(option.value as any)}
                  className={`w-full p-3 rounded-md border text-left transition-colors ${
                    style === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !industry}
            className={`w-full py-2.5 px-4 rounded-md font-bold text-white text-xs ${
              isGenerating || !industry
                ? 'bg-gray-300'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg'
            } transition-shadow`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando...
              </span>
            ) : (
              '✨ Generar Guía de Estilo'
            )}
          </button>
        </div>
      </div>

      {/* Canvas Principal */}
      <div className="flex-1 overflow-auto p-8">
        {!styleGuide ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">🎨</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay guía de estilo generada
              </h3>
              <p className="text-sm text-gray-500">
                Genera una guía de estilo con IA usando el panel lateral
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Colors Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🎨</span> Colores
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(styleGuide.colors).map(([name, color]) => (
                  <div key={name}>
                    <div
                      className="w-full h-24 rounded-lg border border-gray-200 shadow-sm mb-2"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="text-xs font-semibold text-gray-700 capitalize mb-1">
                      {name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>✍️</span> Tipografía
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-3">
                    Fuente de Encabezados
                  </div>
                  <div
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: styleGuide.typography.headingFont }}
                  >
                    {styleGuide.typography.headingFont}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tamaño: {styleGuide.typography.headingSize}
                  </div>
                  <div
                    className="mt-4 text-2xl font-bold text-gray-900"
                    style={{ fontFamily: styleGuide.typography.headingFont }}
                  >
                    The quick brown fox
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-3">
                    Fuente de Cuerpo
                  </div>
                  <div
                    className="text-3xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: styleGuide.typography.bodyFont }}
                  >
                    {styleGuide.typography.bodyFont}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tamaño: {styleGuide.typography.bodySize}
                  </div>
                  <div
                    className="mt-4 text-base text-gray-700"
                    style={{ fontFamily: styleGuide.typography.bodyFont }}
                  >
                    The quick brown fox jumps over the lazy dog. This is a sample paragraph to showcase the body font.
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔘</span> Botones
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    className="px-6 py-3 rounded-md font-semibold text-white text-sm"
                    style={{ backgroundColor: styleGuide.colors.primary }}
                  >
                    Botón Primario
                  </button>
                  <button
                    className="px-6 py-3 rounded-md font-semibold text-white text-sm"
                    style={{ backgroundColor: styleGuide.colors.secondary }}
                  >
                    Botón Secundario
                  </button>
                  <button
                    className="px-6 py-3 rounded-md font-semibold border-2 text-sm"
                    style={{
                      borderColor: styleGuide.colors.primary,
                      color: styleGuide.colors.primary,
                    }}
                  >
                    Botón Outline
                  </button>
                </div>
              </div>
            </div>

            {/* Spacing Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📏</span> Espaciado
              </h2>
              <div className="space-y-2">
                {[
                  { name: 'XS', size: '4px' },
                  { name: 'SM', size: '8px' },
                  { name: 'MD', size: '16px' },
                  { name: 'LG', size: '24px' },
                  { name: 'XL', size: '32px' },
                  { name: '2XL', size: '48px' },
                ].map((spacing) => (
                  <div key={spacing.name} className="flex items-center gap-4">
                    <div className="w-16 text-xs font-semibold text-gray-700">
                      {spacing.name}
                    </div>
                    <div
                      className="bg-blue-500 rounded"
                      style={{ width: spacing.size, height: '16px' }}
                    ></div>
                    <div className="text-xs text-gray-500">{spacing.size}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Radius Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⬜</span> Border Radius
              </h2>
              <div className="flex gap-4">
                {[
                  { name: 'None', radius: '0px' },
                  { name: 'SM', radius: '4px' },
                  { name: 'MD', radius: '8px' },
                  { name: 'LG', radius: '16px' },
                  { name: 'Full', radius: '9999px' },
                ].map((radius) => (
                  <div key={radius.name} className="text-center">
                    <div
                      className="w-16 h-16 mb-2 border-2"
                      style={{
                        borderRadius: radius.radius,
                        borderColor: styleGuide.colors.primary,
                        backgroundColor: `${styleGuide.colors.primary}20`,
                      }}
                    ></div>
                    <div className="text-xs font-semibold text-gray-700">
                      {radius.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {radius.radius}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
