import React from 'react'

/**
 * Wireframe Mockups - Structure ONLY (No Colors, No Styles)
 * Colors and styles will be applied in the Design tab using Design Tokens
 * Following Scram.io pattern: Wireframe → Style Guide (Tokens) → Design (Wireframe + Tokens)
 */

interface WireframeComponent {
  id: string
  type: string
  variant: number
  content: {
    heading?: string
    subheading?: string
    buttonText?: string
  }
  style: {
    background: string
    backgroundColor?: string
  }
}

interface MockupProps {
  component: WireframeComponent
}

// Wireframe Box - base component for all wireframe elements
const Box = ({ className = '', children, label }: { className?: string; children?: React.ReactNode; label?: string }) => (
  <div className={`border-2 border-dashed border-gray-300 bg-gray-50/50 flex items-center justify-center text-gray-400 text-xs ${className}`}>
    {label && <span>{label}</span>}
    {children}
  </div>
)

const Text = ({ size = 'base', children }: { size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'; children?: React.ReactNode }) => {
  const sizeClasses = {
    xs: 'h-2 w-16',
    sm: 'h-3 w-20',
    base: 'h-3 w-32',
    lg: 'h-4 w-40',
    xl: 'h-5 w-48',
    '2xl': 'h-6 w-56',
    '3xl': 'h-8 w-64',
  }
  return <div className={`${sizeClasses[size]} bg-gray-200 rounded`}></div>
}

const Button = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`h-10 px-6 border-2 border-gray-400 rounded flex items-center justify-center text-xs text-gray-500 font-medium ${className}`}>
    [Button]
  </div>
)

export function ComponentMockup({ component }: MockupProps) {
  const { type, variant, content, style } = component

  switch (type) {
    case 'header':
      return <HeaderMockup variant={variant} content={content} />
    case 'hero':
      return <HeroMockup variant={variant} content={content} style={style} />
    case 'features':
      return <FeaturesMockup variant={variant} content={content} />
    case 'testimonials':
      return <TestimonialsMockup variant={variant} content={content} />
    case 'cta':
      return <CTAMockup variant={variant} content={content} style={style} />
    case 'form':
      return <FormMockup variant={variant} content={content} />
    case 'gallery':
      return <GalleryMockup variant={variant} />
    case 'stats':
      return <StatsMockup variant={variant} content={content} />
    case 'logos':
      return <LogosMockup variant={variant} content={content} />
    case 'footer':
      return <FooterMockup variant={variant} />
    default:
      return <DefaultMockup type={type} variant={variant} />
  }
}

// Header Mockups
function HeaderMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="flex items-center justify-between py-4 px-6">
        <Box className="h-10 w-32" label="[Logo]" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} className="h-8 w-16" label="Link" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="flex items-center justify-between py-4 px-6">
        <Box className="h-10 w-32" label="[Logo]" />
        <div className="flex gap-4 items-center">
          {[1, 2, 3].map((i) => (
            <Box key={i} className="h-8 w-16" label="Link" />
          ))}
          <Button />
        </div>
      </div>
    )
  }

  if (variant === 3) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <Box className="h-12 w-40" label="[Logo]" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} className="h-8 w-16" label="Link" />
          ))}
        </div>
      </div>
    )
  }

  return <HeaderMockup variant={1} content={content} />
}

// Hero Mockups
function HeroMockup({ variant, content, style }: { variant: number; content: any; style: any }) {
  if (variant === 1) {
    return (
      <div className="text-center py-20 px-8">
        <div className="max-w-4xl mx-auto space-y-6">
            <Text size="3xl" > </Text>
          <div className="flex justify-center">  <Text size="lg" > </Text></div>
          <div className="flex justify-center">  <Text size="lg" > </Text></div>
          <div className="flex gap-4 justify-center mt-8">
            <Button />
            <Button />
          </div>
          {style.background === 'image' && (
            <Box className="mt-12 h-96 w-full" label="[Hero Image]" />
          )}
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="grid grid-cols-2 gap-12 items-center py-16 px-8">
        <div className="space-y-6">
            <Text size="3xl" > </Text>
            <Text size="lg" > </Text>
            <Text size="base" > </Text>
          <div className="flex gap-4 mt-8">
            <Button />
            <Button />
          </div>
        </div>
        <Box className="h-96 w-full" label="[Product Image]" />
      </div>
    )
  }

  if (variant === 3) {
    return (
      <Box className="relative py-32 px-8 h-[500px] w-full" label="">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
            <Text size="3xl" > </Text>
            <Text size="xl" > </Text>
          <div className="mt-4">
            <Button />
          </div>
          <div className="absolute top-4 right-4 text-gray-400 text-xs">[Background Image/Video]</div>
        </div>
      </Box>
    )
  }

  return <HeroMockup variant={1} content={content} style={style} />
}

// Features Mockups
function FeaturesMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="py-16 px-8">
        <div className="text-center mb-12 space-y-4">
            <Text size="2xl" > </Text>
          <div className="flex justify-center">  <Text size="base" > </Text></div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Box className="h-16 w-16 mx-auto" label="Icon" />
              <div className="flex justify-center">  <Text size="lg" > </Text></div>
              <div className="flex justify-center">  <Text size="sm" > </Text></div>
              <div className="flex justify-center">  <Text size="sm" > </Text></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="py-16 px-8">
        <div className="text-center mb-12">
            <Text size="2xl" > </Text>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Box className="h-12 w-12 mx-auto" label="Icon" />
              <div className="flex justify-center">  <Text size="base" > </Text></div>
              <div className="flex justify-center">  <Text size="xs" > </Text></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 3) {
    return (
      <div className="py-16 px-8">
        <div className="text-center mb-12">
            <Text size="2xl" > </Text>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div className="border-2 border-gray-300 rounded-xl p-6 space-y-4">
              <Box className="h-14 w-14" label="Icon" />
                <Text size="lg" > </Text>
                <Text size="sm" > </Text>
                <Text size="xs" > </Text>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <FeaturesMockup variant={1} content={content} />
}

// Testimonials Mockups
function TestimonialsMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="py-16 px-8">
        <div className="text-center mb-12">
            <Text size="2xl" > </Text>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="border-2 border-gray-300 rounded-xl p-8 space-y-4">
              <div className="flex items-center gap-4">
                <Box className="h-14 w-14 rounded-full" label="" />
                <div className="space-y-2">
                    <Text size="base" > </Text>
                    <Text size="xs" > </Text>
                </div>
              </div>
              <div className="space-y-2">
                  <Text size="base" > </Text>
                  <Text size="sm" > </Text>
                  <Text size="sm" > </Text>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Box key={star} className="h-5 w-5" label="" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <TestimonialsMockup variant={1} content={content} />
}

// CTA Mockups
function CTAMockup({ variant, content, style }: { variant: number; content: any; style: any }) {
  if (variant === 1) {
    return (
      <div className="py-20 text-center px-8 space-y-6">
          <Text size="3xl" > </Text>
        <div className="flex justify-center">  <Text size="lg" > </Text></div>
        <div className="flex justify-center mt-8">
          <Button className="h-16 px-10" />
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="grid grid-cols-2 gap-12 items-center py-16 px-8">
        <div className="space-y-6">
            <Text size="2xl" > </Text>
            <Text size="lg" > </Text>
          <div className="mt-6">
            <Button />
          </div>
        </div>
        <Box className="h-64 w-full" label="[CTA Image]" />
      </div>
    )
  }

  return <CTAMockup variant={1} content={content} style={style} />
}

// Form Mockups
function FormMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-8">
        <div className="text-center mb-8">
            <Text size="2xl" > </Text>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2">  <Text size="xs" > </Text></div>
            <Box className="h-12 w-full" label="[Input]" />
          </div>
          <div>
            <div className="mb-2">  <Text size="xs" > </Text></div>
            <Box className="h-12 w-full" label="[Input]" />
          </div>
          <div>
            <div className="mb-2">  <Text size="xs" > </Text></div>
            <Box className="h-32 w-full" label="[Textarea]" />
          </div>
          <Button className="w-full mt-6" />
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="max-w-xl mx-auto py-16 px-8 text-center space-y-6">
          <Text size="xl" > </Text>
          <Text size="sm" > </Text>
        <div className="flex gap-2 mt-6">
          <Box className="flex-1 h-14" label="[Email Input]" />
          <Button />
        </div>
      </div>
    )
  }

  return <FormMockup variant={1} content={content} />
}

// Gallery Mockups
function GalleryMockup({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <div className="py-16 px-8">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Box key={i} className="aspect-square w-full" label={`[Image ${i}]`} />
          ))}
        </div>
      </div>
    )
  }

  return <GalleryMockup variant={1} />
}

// Stats Mockups
function StatsMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="py-16 px-8">
        <div className="grid grid-cols-4 gap-8 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
                <Text size="3xl" > </Text>
                <Text size="base" > </Text>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <StatsMockup variant={1} content={content} />
}

// Logos Mockups
function LogosMockup({ variant, content }: { variant: number; content: any }) {
  if (variant === 1) {
    return (
      <div className="py-16 px-8">
        <div className="text-center mb-12 space-y-3">
            <Text size="xs" > </Text>
            <Text size="xl" > </Text>
        </div>
        <div className="grid grid-cols-5 gap-8 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} className="h-12 w-full" label={`[Logo ${i}]`} />
          ))}
        </div>
      </div>
    )
  }

  return <LogosMockup variant={1} content={content} />
}

// Footer Mockups
function FooterMockup({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <div className="py-12 px-8 border-t-2 border-gray-300">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="space-y-3">
                <Text size="base" > </Text>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                    <Text key={i} size="xs" > </Text>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-300 flex items-center justify-between">
            <Text size="xs" > </Text>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Box key={i} className="h-8 w-8 rounded-full" label="" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="py-8 px-8 border-t-2 border-gray-300">
        <div className="flex items-center justify-between">
            <Text size="xs" > </Text>
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
                <Text key={i} size="xs" > </Text>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <FooterMockup variant={1} />
}

// Default Mockup
function DefaultMockup({ type, variant }: { type: string; variant: number }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-2xl font-medium mb-2">[{type}]</div>
      <div className="text-sm">Variant {variant}</div>
    </div>
  )
}
