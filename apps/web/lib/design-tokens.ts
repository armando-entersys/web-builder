/**
 * Design Tokens System
 * Inspired by Scram.io and Tailwind CSS 4.0 @theme directive
 */

export interface ColorToken {
  name: string
  value: string
  description?: string
}

export interface TypographyToken {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing?: string
}

export interface SpacingToken {
  name: string
  value: string
}

export interface DesignTokens {
  colors: {
    primary: ColorToken[]
    secondary: ColorToken[]
    accent: ColorToken[]
    neutral: ColorToken[]
    success: ColorToken[]
    warning: ColorToken[]
    error: ColorToken[]
  }
  typography: {
    heading: TypographyToken
    body: TypographyToken
    caption: TypographyToken
  }
  spacing: {
    scale: SpacingToken[]
  }
  radii: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export const defaultTokens: DesignTokens = {
  colors: {
    primary: [
      { name: 'primary-50', value: '#f0f9ff', description: 'Lightest' },
      { name: 'primary-100', value: '#e0f2fe' },
      { name: 'primary-200', value: '#bae6fd' },
      { name: 'primary-300', value: '#7dd3fc' },
      { name: 'primary-400', value: '#38bdf8' },
      { name: 'primary-500', value: '#0ea5e9', description: 'Base' },
      { name: 'primary-600', value: '#0284c7' },
      { name: 'primary-700', value: '#0369a1' },
      { name: 'primary-800', value: '#075985' },
      { name: 'primary-900', value: '#0c4a6e', description: 'Darkest' },
    ],
    secondary: [
      { name: 'secondary-50', value: '#faf5ff' },
      { name: 'secondary-100', value: '#f3e8ff' },
      { name: 'secondary-200', value: '#e9d5ff' },
      { name: 'secondary-300', value: '#d8b4fe' },
      { name: 'secondary-400', value: '#c084fc' },
      { name: 'secondary-500', value: '#a855f7' },
      { name: 'secondary-600', value: '#9333ea' },
      { name: 'secondary-700', value: '#7e22ce' },
      { name: 'secondary-800', value: '#6b21a8' },
      { name: 'secondary-900', value: '#581c87' },
    ],
    accent: [
      { name: 'accent-50', value: '#fef2f2' },
      { name: 'accent-100', value: '#fee2e2' },
      { name: 'accent-200', value: '#fecaca' },
      { name: 'accent-300', value: '#fca5a5' },
      { name: 'accent-400', value: '#f87171' },
      { name: 'accent-500', value: '#ef4444' },
      { name: 'accent-600', value: '#dc2626' },
      { name: 'accent-700', value: '#b91c1c' },
      { name: 'accent-800', value: '#991b1b' },
      { name: 'accent-900', value: '#7f1d1d' },
    ],
    neutral: [
      { name: 'neutral-50', value: '#fafafa' },
      { name: 'neutral-100', value: '#f5f5f5' },
      { name: 'neutral-200', value: '#e5e5e5' },
      { name: 'neutral-300', value: '#d4d4d4' },
      { name: 'neutral-400', value: '#a3a3a3' },
      { name: 'neutral-500', value: '#737373' },
      { name: 'neutral-600', value: '#525252' },
      { name: 'neutral-700', value: '#404040' },
      { name: 'neutral-800', value: '#262626' },
      { name: 'neutral-900', value: '#171717' },
    ],
    success: [
      { name: 'success-50', value: '#f0fdf4' },
      { name: 'success-500', value: '#10b981' },
      { name: 'success-600', value: '#059669' },
    ],
    warning: [
      { name: 'warning-50', value: '#fffbeb' },
      { name: 'warning-500', value: '#f59e0b' },
      { name: 'warning-600', value: '#d97706' },
    ],
    error: [
      { name: 'error-50', value: '#fef2f2' },
      { name: 'error-500', value: '#ef4444' },
      { name: 'error-600', value: '#dc2626' },
    ],
  },
  typography: {
    heading: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '2rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    body: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    caption: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.4',
    },
  },
  spacing: {
    scale: [
      { name: 'xs', value: '0.25rem' },
      { name: 'sm', value: '0.5rem' },
      { name: 'md', value: '1rem' },
      { name: 'lg', value: '1.5rem' },
      { name: 'xl', value: '2rem' },
      { name: '2xl', value: '3rem' },
      { name: '3xl', value: '4rem' },
    ],
  },
  radii: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
}

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(tokens: DesignTokens): string {
  const lines: string[] = [':root {']

  // Colors
  Object.entries(tokens.colors).forEach(([category, colorArray]) => {
    colorArray.forEach((color) => {
      lines.push(`  --${color.name}: ${color.value};`)
    })
  })

  // Typography
  Object.entries(tokens.typography).forEach(([variant, styles]) => {
    lines.push(`  --font-${variant}: ${styles.fontFamily};`)
    lines.push(`  --text-${variant}-size: ${styles.fontSize};`)
    lines.push(`  --text-${variant}-weight: ${styles.fontWeight};`)
    lines.push(`  --text-${variant}-height: ${styles.lineHeight};`)
    if (styles.letterSpacing) {
      lines.push(`  --text-${variant}-spacing: ${styles.letterSpacing};`)
    }
  })

  // Spacing
  tokens.spacing.scale.forEach((spacing) => {
    lines.push(`  --spacing-${spacing.name}: ${spacing.value};`)
  })

  // Radii
  Object.entries(tokens.radii).forEach(([name, value]) => {
    lines.push(`  --radius-${name}: ${value};`)
  })

  // Shadows
  Object.entries(tokens.shadows).forEach(([name, value]) => {
    lines.push(`  --shadow-${name}: ${value};`)
  })

  lines.push('}')
  return lines.join('\n')
}

/**
 * Generate Tailwind CSS @theme directive from design tokens
 */
export function generateTailwindTheme(tokens: DesignTokens): string {
  const lines: string[] = ['@theme {']

  // Colors
  Object.entries(tokens.colors).forEach(([category, colorArray]) => {
    colorArray.forEach((color) => {
      const tailwindName = color.name.replace('-', '.')
      lines.push(`  --color-${tailwindName}: ${color.value};`)
    })
  })

  lines.push('}')
  return lines.join('\n')
}
