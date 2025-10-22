'use client'

import { useState } from 'react'
import { useDesignTokensStore } from '@/lib/stores/design-tokens-store'
import { ColorToken, TypographyToken } from '@/lib/design-tokens'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Palette, Type, Ruler, Download, RotateCcw, Square } from 'lucide-react'

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
  const { tokens, updateTokens, resetTokens } = useDesignTokensStore()
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'spacing' | 'radii'>('colors')

  const handleColorChange = (category: keyof typeof tokens.colors, index: number, newValue: string) => {
    const updatedColors = { ...tokens.colors }
    updatedColors[category][index].value = newValue
    updateTokens({ colors: updatedColors })
  }

  const handleTypographyChange = (variant: keyof typeof tokens.typography, field: keyof TypographyToken, value: string) => {
    const updatedTypography = { ...tokens.typography }
    updatedTypography[variant] = { ...updatedTypography[variant], [field]: value }
    updateTokens({ typography: updatedTypography })
  }

  const handleExportTokens = () => {
    const dataStr = JSON.stringify(tokens, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'design-tokens.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background/80 backdrop-blur-xl p-4 overflow-y-auto flex-shrink-0">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-4">
            Design Tokens
          </h3>

          <button
            onClick={() => setActiveSection('colors')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === 'colors'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Palette className="h-4 w-4" />
            Colors
          </button>

          <button
            onClick={() => setActiveSection('typography')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === 'typography'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Type className="h-4 w-4" />
            Typography
          </button>

          <button
            onClick={() => setActiveSection('spacing')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === 'spacing'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Ruler className="h-4 w-4" />
            Spacing
          </button>

          <button
            onClick={() => setActiveSection('radii')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === 'radii'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Square className="h-4 w-4" />
            Border Radius
          </button>

          <div className="pt-4 border-t mt-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTokens}
              className="w-full justify-start"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Export Tokens
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetTokens}
              className="w-full justify-start"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Colors Section */}
          {activeSection === 'colors' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Color Palette</h2>
                <p className="text-sm text-muted-foreground">
                  Define your brand colors and color scales. These tokens will be applied to all components.
                </p>
              </div>

              {Object.entries(tokens.colors).map(([category, colorArray]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                      {colorArray.map((color: ColorToken, index: number) => (
                        <div key={color.name} className="space-y-2">
                          <div
                            className="w-full h-20 rounded-lg border border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color.value }}
                            onClick={() => {
                              const input = document.getElementById(`color-${category}-${index}`) as HTMLInputElement
                              input?.click()
                            }}
                          />
                          <div>
                            <div className="text-xs font-medium text-foreground mb-1">
                              {color.name}
                            </div>
                            <Input
                              id={`color-${category}-${index}`}
                              type="color"
                              value={color.value}
                              onChange={(e) => handleColorChange(category as keyof typeof tokens.colors, index, e.target.value)}
                              className="h-8 w-full cursor-pointer"
                            />
                            <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                              {color.value}
                            </div>
                            {color.description && (
                              <div className="text-[10px] text-muted-foreground italic mt-0.5">
                                {color.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Typography</h2>
                <p className="text-sm text-muted-foreground">
                  Configure font families, sizes, weights, and line heights for different text variants.
                </p>
              </div>

              {Object.entries(tokens.typography).map(([variant, styles]) => (
                <Card key={variant}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{variant}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">
                          Font Family
                        </label>
                        <Input
                          value={styles.fontFamily}
                          onChange={(e) => handleTypographyChange(variant as keyof typeof tokens.typography, 'fontFamily', e.target.value)}
                          placeholder="Inter, sans-serif"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">
                          Font Size
                        </label>
                        <Input
                          value={styles.fontSize}
                          onChange={(e) => handleTypographyChange(variant as keyof typeof tokens.typography, 'fontSize', e.target.value)}
                          placeholder="1rem"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">
                          Font Weight
                        </label>
                        <Input
                          value={styles.fontWeight}
                          onChange={(e) => handleTypographyChange(variant as keyof typeof tokens.typography, 'fontWeight', e.target.value)}
                          placeholder="400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">
                          Line Height
                        </label>
                        <Input
                          value={styles.lineHeight}
                          onChange={(e) => handleTypographyChange(variant as keyof typeof tokens.typography, 'lineHeight', e.target.value)}
                          placeholder="1.5"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-6 bg-accent/50 rounded-lg border border-border">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Preview</div>
                      <div
                        style={{
                          fontFamily: styles.fontFamily,
                          fontSize: styles.fontSize,
                          fontWeight: styles.fontWeight,
                          lineHeight: styles.lineHeight,
                          letterSpacing: styles.letterSpacing,
                        }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Spacing Section */}
          {activeSection === 'spacing' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Spacing Scale</h2>
                <p className="text-sm text-muted-foreground">
                  Define consistent spacing values for margins, padding, and gaps.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {tokens.spacing.scale.map((spacing, index) => (
                      <div key={spacing.name} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-medium text-foreground">
                          {spacing.name}
                        </div>
                        <div
                          className="bg-primary rounded transition-all"
                          style={{ width: spacing.value, height: '24px' }}
                        />
                        <Input
                          value={spacing.value}
                          onChange={(e) => {
                            const updatedSpacing = { ...tokens.spacing }
                            updatedSpacing.scale[index].value = e.target.value
                            updateTokens({ spacing: updatedSpacing })
                          }}
                          className="w-32"
                          placeholder="1rem"
                        />
                        <div className="text-sm text-muted-foreground">{spacing.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Border Radius Section */}
          {activeSection === 'radii' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Border Radius</h2>
                <p className="text-sm text-muted-foreground">
                  Configure border radius values for different component sizes.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(tokens.radii).map(([name, value]) => (
                      <div key={name} className="space-y-3">
                        <div
                          className="w-24 h-24 mx-auto border-2 border-primary bg-primary/10 transition-all"
                          style={{ borderRadius: value }}
                        />
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground capitalize mb-2">
                            {name}
                          </div>
                          <Input
                            value={value}
                            onChange={(e) => {
                              const updatedRadii = { ...tokens.radii }
                              updatedRadii[name as keyof typeof tokens.radii] = e.target.value
                              updateTokens({ radii: updatedRadii })
                            }}
                            className="text-center"
                            placeholder="0.5rem"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
