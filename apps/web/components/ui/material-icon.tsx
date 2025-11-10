import React from 'react'

export interface MaterialIconProps {
  icon: string
  variant?: 'outlined' | 'rounded' | 'sharp'
  size?: number | string
  fill?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: 20 | 24 | 40 | 48
  className?: string
  style?: React.CSSProperties
}

export function MaterialIcon({
  icon,
  variant = 'rounded',
  size = 24,
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  className = '',
  style = {},
}: MaterialIconProps) {
  const fontFamily = `Material Symbols ${variant.charAt(0).toUpperCase() + variant.slice(1)}`

  const iconStyle: React.CSSProperties = {
    fontFamily,
    fontWeight: weight,
    fontStyle: 'normal',
    fontSize: typeof size === 'number' ? `${size}px` : size,
    display: 'inline-block',
    lineHeight: 1,
    textTransform: 'none',
    letterSpacing: 'normal',
    wordWrap: 'normal',
    whiteSpace: 'nowrap',
    direction: 'ltr',
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    ...style,
  }

  return (
    <span className={`material-icon ${className}`} style={iconStyle} aria-hidden="true">
      {icon}
    </span>
  )
}

export default MaterialIcon
