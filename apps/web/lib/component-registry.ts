// Registro dinámico de componentes
// Este archivo mapea los componentPath de la base de datos a los imports dinámicos
// GENERADO AUTOMÁTICAMENTE - No editar manualmente

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Tipo para los componentes cargados dinámicamente
export type DynamicComponent = ComponentType<any>

// Mapa de componentes con lazy loading
const componentMap: Record<string, () => Promise<{ default: DynamicComponent }>> = {
  'components/animations/backgrounds/Aurora.tsx': () => import('@/components/animations/backgrounds/Aurora/Aurora'),
  'components/animations/backgrounds/Balatro.tsx': () => import('@/components/animations/backgrounds/Balatro/Balatro'),
  'components/animations/backgrounds/Ballpit.tsx': () => import('@/components/animations/backgrounds/Ballpit/Ballpit'),
  'components/animations/backgrounds/Beams.tsx': () => import('@/components/animations/backgrounds/Beams/Beams'),
  'components/animations/backgrounds/DarkVeil.tsx': () => import('@/components/animations/backgrounds/DarkVeil/DarkVeil'),
  'components/animations/backgrounds/Dither.tsx': () => import('@/components/animations/backgrounds/Dither/Dither'),
  'components/animations/backgrounds/DotGrid.tsx': () => import('@/components/animations/backgrounds/DotGrid/DotGrid'),
  'components/animations/backgrounds/FaultyTerminal.tsx': () => import('@/components/animations/backgrounds/FaultyTerminal/FaultyTerminal'),
  'components/animations/backgrounds/Galaxy.tsx': () => import('@/components/animations/backgrounds/Galaxy/Galaxy'),
  'components/animations/backgrounds/GradientBlinds.tsx': () => import('@/components/animations/backgrounds/GradientBlinds/GradientBlinds'),
  'components/animations/backgrounds/GridDistortion.tsx': () => import('@/components/animations/backgrounds/GridDistortion/GridDistortion'),
  'components/animations/backgrounds/GridMotion.tsx': () => import('@/components/animations/backgrounds/GridMotion/GridMotion'),
  'components/animations/backgrounds/Hyperspeed.tsx': () => import('@/components/animations/backgrounds/Hyperspeed/Hyperspeed'),
  'components/animations/backgrounds/Iridescence.tsx': () => import('@/components/animations/backgrounds/Iridescence/Iridescence'),
  'components/animations/backgrounds/LetterGlitch.tsx': () => import('@/components/animations/backgrounds/LetterGlitch/LetterGlitch'),
  'components/animations/backgrounds/Lightning.tsx': () => import('@/components/animations/backgrounds/Lightning/Lightning'),
  'components/animations/backgrounds/LightRays.tsx': () => import('@/components/animations/backgrounds/LightRays/LightRays'),
  'components/animations/backgrounds/LiquidChrome.tsx': () => import('@/components/animations/backgrounds/LiquidChrome/LiquidChrome'),
  'components/animations/backgrounds/LiquidEther.tsx': () => import('@/components/animations/backgrounds/LiquidEther/LiquidEther'),
  'components/animations/backgrounds/Orb.tsx': () => import('@/components/animations/backgrounds/Orb/Orb'),
  'components/animations/backgrounds/Particles.tsx': () => import('@/components/animations/backgrounds/Particles/Particles'),
  'components/animations/backgrounds/PixelBlast.tsx': () => import('@/components/animations/backgrounds/PixelBlast/PixelBlast'),
  'components/animations/backgrounds/Plasma.tsx': () => import('@/components/animations/backgrounds/Plasma/Plasma'),
  'components/animations/backgrounds/Prism.tsx': () => import('@/components/animations/backgrounds/Prism/Prism'),
  'components/animations/backgrounds/PrismaticBurst.tsx': () => import('@/components/animations/backgrounds/PrismaticBurst/PrismaticBurst'),
  'components/animations/backgrounds/RippleGrid.tsx': () => import('@/components/animations/backgrounds/RippleGrid/RippleGrid'),
  'components/animations/backgrounds/Silk.tsx': () => import('@/components/animations/backgrounds/Silk/Silk'),
  'components/animations/backgrounds/Squares.tsx': () => import('@/components/animations/backgrounds/Squares/Squares'),
  'components/animations/backgrounds/Threads.tsx': () => import('@/components/animations/backgrounds/Threads/Threads'),
  'components/animations/backgrounds/Waves.tsx': () => import('@/components/animations/backgrounds/Waves/Waves'),
  'components/animations/interactive/AnimatedList.tsx': () => import('@/components/animations/interactive/AnimatedList/AnimatedList'),
  'components/animations/interactive/BounceCards.tsx': () => import('@/components/animations/interactive/BounceCards/BounceCards'),
  'components/animations/interactive/BubbleMenu.tsx': () => import('@/components/animations/interactive/BubbleMenu/BubbleMenu'),
  'components/animations/interactive/CardNav.tsx': () => import('@/components/animations/interactive/CardNav/CardNav'),
  'components/animations/interactive/CardSwap.tsx': () => import('@/components/animations/interactive/CardSwap/CardSwap'),
  'components/animations/interactive/Carousel.tsx': () => import('@/components/animations/interactive/Carousel/Carousel'),
  'components/animations/interactive/ChromaGrid.tsx': () => import('@/components/animations/interactive/ChromaGrid/ChromaGrid'),
  'components/animations/interactive/CircularGallery.tsx': () => import('@/components/animations/interactive/CircularGallery/CircularGallery'),
  'components/animations/interactive/Counter.tsx': () => import('@/components/animations/interactive/Counter/Counter'),
  'components/animations/interactive/DecayCard.tsx': () => import('@/components/animations/interactive/DecayCard/DecayCard'),
  'components/animations/interactive/Dock.tsx': () => import('@/components/animations/interactive/Dock/Dock'),
  'components/animations/interactive/DomeGallery.tsx': () => import('@/components/animations/interactive/DomeGallery/DomeGallery'),
  'components/animations/interactive/ElasticSlider.tsx': () => import('@/components/animations/interactive/ElasticSlider/ElasticSlider'),
  'components/animations/interactive/FlowingMenu.tsx': () => import('@/components/animations/interactive/FlowingMenu/FlowingMenu'),
  'components/animations/interactive/FluidGlass.tsx': () => import('@/components/animations/interactive/FluidGlass/FluidGlass'),
  'components/animations/interactive/FlyingPosters.tsx': () => import('@/components/animations/interactive/FlyingPosters/FlyingPosters'),
  'components/animations/interactive/Folder.tsx': () => import('@/components/animations/interactive/Folder/Folder'),
  'components/animations/interactive/GlassIcons.tsx': () => import('@/components/animations/interactive/GlassIcons/GlassIcons'),
  'components/animations/interactive/GlassSurface.tsx': () => import('@/components/animations/interactive/GlassSurface/GlassSurface'),
  'components/animations/interactive/GooeyNav.tsx': () => import('@/components/animations/interactive/GooeyNav/GooeyNav'),
  'components/animations/interactive/InfiniteMenu.tsx': () => import('@/components/animations/interactive/InfiniteMenu/InfiniteMenu'),
  'components/animations/interactive/InfiniteScroll.tsx': () => import('@/components/animations/interactive/InfiniteScroll/InfiniteScroll'),
  'components/animations/interactive/Lanyard.tsx': () => import('@/components/animations/interactive/Lanyard/Lanyard'),
  'components/animations/interactive/MagicBento.tsx': () => import('@/components/animations/interactive/MagicBento/MagicBento'),
  'components/animations/interactive/Masonry.tsx': () => import('@/components/animations/interactive/Masonry/Masonry'),
  'components/animations/interactive/ModelViewer.tsx': () => import('@/components/animations/interactive/ModelViewer/ModelViewer'),
  'components/animations/interactive/PillNav.tsx': () => import('@/components/animations/interactive/PillNav/PillNav'),
  'components/animations/interactive/PixelCard.tsx': () => import('@/components/animations/interactive/PixelCard/PixelCard'),
  'components/animations/interactive/ProfileCard.tsx': () => import('@/components/animations/interactive/ProfileCard/ProfileCard'),
  'components/animations/interactive/RollingGallery.tsx': () => import('@/components/animations/interactive/RollingGallery/RollingGallery'),
  'components/animations/interactive/ScrollStack.tsx': () => import('@/components/animations/interactive/ScrollStack/ScrollStack'),
  'components/animations/interactive/SpotlightCard.tsx': () => import('@/components/animations/interactive/SpotlightCard/SpotlightCard'),
  'components/animations/interactive/Stack.tsx': () => import('@/components/animations/interactive/Stack/Stack'),
  'components/animations/interactive/StaggeredMenu.tsx': () => import('@/components/animations/interactive/StaggeredMenu/StaggeredMenu'),
  'components/animations/interactive/Stepper.tsx': () => import('@/components/animations/interactive/Stepper/Stepper'),
  'components/animations/interactive/TiltedCard.tsx': () => import('@/components/animations/interactive/TiltedCard/TiltedCard'),
  'components/animations/text/ASCIIText.tsx': () => import('@/components/animations/text/ASCIIText/ASCIIText'),
  'components/animations/text/BlurText.tsx': () => import('@/components/animations/text/BlurText/BlurText'),
  'components/animations/text/CircularText.tsx': () => import('@/components/animations/text/CircularText/CircularText'),
  'components/animations/text/CountUp.tsx': () => import('@/components/animations/text/CountUp/CountUp'),
  'components/animations/text/CurvedLoop.tsx': () => import('@/components/animations/text/CurvedLoop/CurvedLoop'),
  'components/animations/text/DecryptedText.tsx': () => import('@/components/animations/text/DecryptedText/DecryptedText'),
  'components/animations/text/FallingText.tsx': () => import('@/components/animations/text/FallingText/FallingText'),
  'components/animations/text/FuzzyText.tsx': () => import('@/components/animations/text/FuzzyText/FuzzyText'),
  'components/animations/text/GlitchText.tsx': () => import('@/components/animations/text/GlitchText/GlitchText'),
  'components/animations/text/GradientText.tsx': () => import('@/components/animations/text/GradientText/GradientText'),
  'components/animations/text/RotatingText.tsx': () => import('@/components/animations/text/RotatingText/RotatingText'),
  'components/animations/text/ScrambledText.tsx': () => import('@/components/animations/text/ScrambledText/ScrambledText'),
  'components/animations/text/ScrollFloat.tsx': () => import('@/components/animations/text/ScrollFloat/ScrollFloat'),
  'components/animations/text/ScrollReveal.tsx': () => import('@/components/animations/text/ScrollReveal/ScrollReveal'),
  'components/animations/text/ScrollVelocity.tsx': () => import('@/components/animations/text/ScrollVelocity/ScrollVelocity'),
  'components/animations/text/ShinyText.tsx': () => import('@/components/animations/text/ShinyText/ShinyText'),
  'components/animations/text/Shuffle.tsx': () => import('@/components/animations/text/Shuffle/Shuffle'),
  'components/animations/text/SplitText.tsx': () => import('@/components/animations/text/SplitText/SplitText'),
  'components/animations/text/TextCursor.tsx': () => import('@/components/animations/text/TextCursor/TextCursor'),
  'components/animations/text/TextPressure.tsx': () => import('@/components/animations/text/TextPressure/TextPressure'),
  'components/animations/text/TextTrail.tsx': () => import('@/components/animations/text/TextTrail/TextTrail'),
  'components/animations/text/TextType.tsx': () => import('@/components/animations/text/TextType/TextType'),
  'components/animations/text/TrueFocus.tsx': () => import('@/components/animations/text/TrueFocus/TrueFocus'),
  'components/animations/text/VariableProximity.tsx': () => import('@/components/animations/text/VariableProximity/VariableProximity'),
  'components/animations/transitions/AnimatedContent.tsx': () => import('@/components/animations/transitions/AnimatedContent/AnimatedContent'),
  'components/animations/transitions/BlobCursor.tsx': () => import('@/components/animations/transitions/BlobCursor/BlobCursor'),
  'components/animations/transitions/ClickSpark.tsx': () => import('@/components/animations/transitions/ClickSpark/ClickSpark'),
  'components/animations/transitions/Crosshair.tsx': () => import('@/components/animations/transitions/Crosshair/Crosshair'),
  'components/animations/transitions/Cubes.tsx': () => import('@/components/animations/transitions/Cubes/Cubes'),
  'components/animations/transitions/ElectricBorder.tsx': () => import('@/components/animations/transitions/ElectricBorder/ElectricBorder'),
  'components/animations/transitions/FadeContent.tsx': () => import('@/components/animations/transitions/FadeContent/FadeContent'),
  'components/animations/transitions/GlareHover.tsx': () => import('@/components/animations/transitions/GlareHover/GlareHover'),
  'components/animations/transitions/GradualBlur.tsx': () => import('@/components/animations/transitions/GradualBlur/GradualBlur'),
  'components/animations/transitions/ImageTrail.tsx': () => import('@/components/animations/transitions/ImageTrail/ImageTrail'),
  'components/animations/transitions/LaserFlow.tsx': () => import('@/components/animations/transitions/LaserFlow/LaserFlow'),
  'components/animations/transitions/LogoLoop.tsx': () => import('@/components/animations/transitions/LogoLoop/LogoLoop'),
  'components/animations/transitions/Magnet.tsx': () => import('@/components/animations/transitions/Magnet/Magnet'),
  'components/animations/transitions/MagnetLines.tsx': () => import('@/components/animations/transitions/MagnetLines/MagnetLines'),
  'components/animations/transitions/MetaBalls.tsx': () => import('@/components/animations/transitions/MetaBalls/MetaBalls'),
  'components/animations/transitions/MetallicPaint.tsx': () => import('@/components/animations/transitions/MetallicPaint/MetallicPaint'),
  'components/animations/transitions/Noise.tsx': () => import('@/components/animations/transitions/Noise/Noise'),
  'components/animations/transitions/PixelTrail.tsx': () => import('@/components/animations/transitions/PixelTrail/PixelTrail'),
  'components/animations/transitions/PixelTransition.tsx': () => import('@/components/animations/transitions/PixelTransition/PixelTransition'),
  'components/animations/transitions/Ribbons.tsx': () => import('@/components/animations/transitions/Ribbons/Ribbons'),
  'components/animations/transitions/ShapeBlur.tsx': () => import('@/components/animations/transitions/ShapeBlur/ShapeBlur'),
  'components/animations/transitions/SplashCursor.tsx': () => import('@/components/animations/transitions/SplashCursor/SplashCursor'),
  'components/animations/transitions/StarBorder.tsx': () => import('@/components/animations/transitions/StarBorder/StarBorder'),
  'components/animations/transitions/StickerPeel.tsx': () => import('@/components/animations/transitions/StickerPeel/StickerPeel'),
  'components/animations/transitions/TargetCursor.tsx': () => import('@/components/animations/transitions/TargetCursor/TargetCursor'),
  'components/ui/accordion.tsx': () => import('@/components/ui/accordion/accordion'),
  'components/ui/badge.tsx': () => import('@/components/ui/badge/badge'),
  'components/ui/button.tsx': () => import('@/components/ui/button/button'),
  'components/ui/card.tsx': () => import('@/components/ui/card/card'),
  'components/ui/dialog.tsx': () => import('@/components/ui/dialog/dialog'),
  'components/ui/dropdown-menu.tsx': () => import('@/components/ui/dropdown-menu/dropdown-menu'),
  'components/ui/input.tsx': () => import('@/components/ui/input/input'),
  'components/ui/label.tsx': () => import('@/components/ui/label/label'),
  'components/ui/separator.tsx': () => import('@/components/ui/separator/separator'),
  'components/ui/tabs.tsx': () => import('@/components/ui/tabs/tabs'),
  'components/ui/textarea.tsx': () => import('@/components/ui/textarea/textarea'),
  'components/ui/tooltip.tsx': () => import('@/components/ui/tooltip/tooltip'),
  'components/scram/header/Header1.tsx': () => import('@/components/scram/header/Header1/Header1'),
  'components/scram/header/Header26.tsx': () => import('@/components/scram/header/Header26/Header26'),
  'components/scram/header/Header44.tsx': () => import('@/components/scram/header/Header44/Header44'),
  'components/scram/header/Header62.tsx': () => import('@/components/scram/header/Header62/Header62'),
  'components/scram/navbar/Navbar1.tsx': () => import('@/components/scram/navbar/Navbar1/Navbar1'),
  'components/scram/navbar/Navbar2.tsx': () => import('@/components/scram/navbar/Navbar2/Navbar2'),
  'components/scram/navbar/Navbar3.tsx': () => import('@/components/scram/navbar/Navbar3/Navbar3'),
  'components/scram/footer/Footer1.tsx': () => import('@/components/scram/footer/Footer1/Footer1'),
  'components/scram/footer/Footer3.tsx': () => import('@/components/scram/footer/Footer3/Footer3'),
  'components/scram/cta/CTA25.tsx': () => import('@/components/scram/cta/CTA25/CTA25'),
  'components/scram/cta/CTA8.tsx': () => import('@/components/scram/cta/CTA8/CTA8'),
  'components/advanced/feedback/ProgressBar.tsx': () => import('@/components/advanced/feedback/ProgressBar/ProgressBar'),
  'components/advanced/feedback/Skeleton.tsx': () => import('@/components/advanced/feedback/Skeleton/Skeleton'),
  'components/advanced/feedback/Toast.tsx': () => import('@/components/advanced/feedback/Toast/Toast'),
  'components/advanced/forms/FileUpload.tsx': () => import('@/components/advanced/forms/FileUpload/FileUpload'),
  'components/advanced/forms/InputOTP.tsx': () => import('@/components/advanced/forms/InputOTP/InputOTP'),
  'components/advanced/forms/SearchInput.tsx': () => import('@/components/advanced/forms/SearchInput/SearchInput'),
  'components/advanced/layout/Container.tsx': () => import('@/components/advanced/layout/Container/Container'),
  'components/advanced/layout/EmptyState.tsx': () => import('@/components/advanced/layout/EmptyState/EmptyState'),
  'components/effects/background/DotPattern.tsx': () => import('@/components/effects/background/DotPattern/DotPattern'),
  'components/effects/background/GridPattern.tsx': () => import('@/components/effects/background/GridPattern/GridPattern'),
  'components/effects/background/Meteors.tsx': () => import('@/components/effects/background/Meteors/Meteors'),
  'components/effects/text/AnimatedGradientText.tsx': () => import('@/components/effects/text/AnimatedGradientText/AnimatedGradientText'),
  'components/effects/text/FlipText.tsx': () => import('@/components/effects/text/FlipText/FlipText'),
  'components/effects/text/ShimmerButton.tsx': () => import('@/components/effects/text/ShimmerButton/ShimmerButton'),
  'components/effects/text/TypingAnimation.tsx': () => import('@/components/effects/text/TypingAnimation/TypingAnimation'),
  'app/dashboard/builder/components/BuilderView.tsx': () => import('app/dashboard/builder/components/BuilderView/BuilderView'),
  'app/dashboard/builder/components/DesignView.tsx': () => import('app/dashboard/builder/components/DesignView/DesignView'),
  'app/dashboard/builder/components/LandingPageBuilder.tsx': () => import('app/dashboard/builder/components/LandingPageBuilder/LandingPageBuilder'),
  'app/dashboard/builder/components/StyleGuideView.tsx': () => import('app/dashboard/builder/components/StyleGuideView/StyleGuideView'),
  'app/dashboard/builder/components/WireframeMockups.tsx': () => import('app/dashboard/builder/components/WireframeMockups/WireframeMockups'),
  'app/dashboard/builder/components/WireframeView.tsx': () => import('app/dashboard/builder/components/WireframeView/WireframeView'),
  'components/providers/session-provider.tsx': () => import('@/components/providers/session-provider/session-provider'),
}

/**
 * Obtiene un componente de forma dinámica basado en su path
 * @param componentPath - El path del componente en la base de datos
 * @returns Un componente de React cargado dinámicamente
 */
export function getComponent(componentPath: string): ReturnType<typeof dynamic> | null {
  const loader = componentMap[componentPath]

  if (!loader) {
    console.warn(`Component not found: ${componentPath}`)
    return null
  }

  return dynamic(loader, {
    loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg" />,
    ssr: false,
  })
}

/**
 * Verifica si un componente existe en el registro
 */
export function hasComponent(componentPath: string): boolean {
  return componentPath in componentMap
}

/**
 * Obtiene todos los paths de componentes registrados
 */
export function getAllComponentPaths(): string[] {
  return Object.keys(componentMap)
}
