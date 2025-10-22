# Animaciones - React Bits

Esta carpeta contiene 115+ componentes de animación de alta calidad copiados de [React Bits](https://reactbits.dev/).

## 📦 Categorías (115 componentes)

### 🎬 Transitions (25 componentes)
Animaciones de transición, cursores y efectos interactivos.

**Componentes destacados:**
- `FadeContent` - Fade in con threshold
- `Magnet` - Efecto magnético en hover
- `StarBorder` - Borde animado con estrellas
- `StickerPeel` - Efecto de sticker despegándose
- `GlareHover` - Efecto de brillo en hover
- `ElectricBorder` - Borde eléctrico animado
- `PixelTransition` - Transición con efecto pixel
- `GradualBlur` - Blur gradual
- `BlobCursor` - Cursor blob animado
- `ClickSpark` - Chispas al hacer click

**Todos los componentes:**
AnimatedContent, BlobCursor, ClickSpark, Crosshair, Cubes, ElectricBorder, FadeContent, GlareHover, GradualBlur, ImageTrail, LaserFlow, LogoLoop, Magnet, MagnetLines, MetaBalls, MetallicPaint, Noise, PixelTrail, PixelTransition, Ribbons, ShapeBlur, SplashCursor, StarBorder, StickerPeel, TargetCursor

### ✍️ Text (24 componentes)
Animaciones de texto sofisticadas.

**Componentes destacados:**
- `TextReveal` - Reveal animado de texto
- `TextType` - Efecto de typing
- `GradientText` - Texto con gradiente animado
- `GlitchText` - Efecto glitch
- `DecryptedText` - Texto descifrado
- `ScrambledText` - Texto scrambled
- `ShinyText` - Texto brillante
- `BlurText` - Texto con blur animado
- `CountUp` - Contador animado
- `ScrollReveal` - Reveal en scroll

**Todos los componentes:**
ASCIIText, BlurText, CircularText, CountUp, CurvedLoop, DecryptedText, FallingText, FuzzyText, GlitchText, GradientText, RotatingText, ScrambledText, ScrollFloat, ScrollReveal, ScrollVelocity, ShinyText, Shuffle, SplitText, TextCursor, TextPressure, TextTrail, TextType, TrueFocus, VariableProximity

### 🎨 Backgrounds (30 componentes)
Fondos animados y efectos visuales.

**Componentes destacados:**
- `Aurora` - Efecto aurora boreal
- `Beams` - Rayos de luz animados
- `Galaxy` - Fondo de galaxia
- `Particles` - Sistema de partículas
- `Lightning` - Rayos eléctricos
- `Waves` - Ondas animadas
- `Plasma` - Efecto plasma
- `GridMotion` - Grid en movimiento
- `DotGrid` - Grid de puntos
- `Hyperspeed` - Efecto hyperspeed

**Todos los componentes:**
Aurora, Balatro, Ballpit, Beams, DarkVeil, Dither, DotGrid, FaultyTerminal, Galaxy, GradientBlinds, GridDistortion, GridMotion, Hyperspeed, Iridescence, LetterGlitch, Lightning, LightRays, LiquidChrome, LiquidEther, Orb, Particles, PixelBlast, Plasma, Prism, PrismaticBurst, RippleGrid, Silk, Squares, Threads, Waves

### 🎯 Interactive (36 componentes)
Componentes interactivos complejos.

**Componentes destacados:**
- `Carousel` - Carousel animado
- `Dock` - Dock estilo macOS
- `SpotlightCard` - Card con spotlight
- `TiltedCard` - Card con efecto 3D
- `AnimatedList` - Lista animada
- `InfiniteScroll` - Scroll infinito
- `MagicBento` - Grid bento animado
- `ElasticSlider` - Slider elástico
- `CircularGallery` - Galería circular
- `ScrollStack` - Stack con scroll

**Todos los componentes:**
AnimatedList, BounceCards, BubbleMenu, CardNav, CardSwap, Carousel, ChromaGrid, CircularGallery, Counter, DecayCard, Dock, DomeGallery, ElasticSlider, FlowingMenu, FluidGlass, FlyingPosters, Folder, GlassIcons, GlassSurface, GooeyNav, InfiniteMenu, InfiniteScroll, Lanyard, MagicBento, Masonry, ModelViewer, PillNav, PixelCard, ProfileCard, RollingGallery, ScrollStack, SpotlightCard, Stack, StaggeredMenu, Stepper, TiltedCard

## 🚀 Uso

### Importación Individual
```tsx
import FadeContent from '@/components/animations/transitions/FadeContent/FadeContent'
import TextType from '@/components/animations/text/TextType/TextType'
import Aurora from '@/components/animations/backgrounds/Aurora/Aurora'
import Carousel from '@/components/animations/interactive/Carousel/Carousel'
```

### Importación desde Categoría
```tsx
import { FadeContent, Magnet, StarBorder } from '@/components/animations/transitions'
import { TextType, GradientText, GlitchText } from '@/components/animations/text'
import { Aurora, Beams, Galaxy } from '@/components/animations/backgrounds'
import { Carousel, Dock, SpotlightCard } from '@/components/animations/interactive'
```

### Importación Global
```tsx
import { FadeContent, TextType, Aurora, Carousel } from '@/components/animations'
```

## 📝 Ejemplos

### FadeContent
```tsx
<FadeContent
  blur={true}
  duration={1000}
  threshold={0.1}
  className="my-content"
>
  <h1>Este contenido aparecerá con fade</h1>
</FadeContent>
```

### TextType
```tsx
<TextType
  text="Hola mundo"
  speed={50}
  className="text-4xl"
/>
```

### Aurora Background
```tsx
<div className="relative h-screen">
  <Aurora />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</div>
```

### Carousel
```tsx
<Carousel
  items={[
    <img src="/img1.jpg" />,
    <img src="/img2.jpg" />,
    <img src="/img3.jpg" />
  ]}
  autoplay={true}
/>
```

## 🎨 Integración con el Proyecto

Estos componentes están listos para usar con:
- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v3
- ✅ shadcn/ui

## 📚 Recursos

- **React Bits Website**: https://reactbits.dev/
- **React Bits GitHub**: https://github.com/DavidHDev/react-bits
- **Documentación Original**: Cada componente tiene ejemplos en el sitio oficial

## ⚠️ Notas

1. **Dependencias**: Algunos componentes pueden requerir dependencias adicionales (framer-motion, three.js, etc.)
2. **Performance**: Los componentes de backgrounds son GPU-intensivos, usar con moderación
3. **Accesibilidad**: Revisar animaciones para usuarios con preferencias de movimiento reducido
4. **Browser Support**: La mayoría requiere navegadores modernos con soporte para CSS moderno

## 🔄 Próximos Pasos

- [ ] Instalar dependencias faltantes (framer-motion, three.js, etc.)
- [ ] Crear ejemplos de uso para cada categoría
- [ ] Optimizar componentes para producción
- [ ] Agregar tests
- [ ] Crear storybook para visualizar componentes
