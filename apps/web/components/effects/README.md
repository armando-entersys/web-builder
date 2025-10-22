# Efectos Visuales - Magic UI & Aceternity UI

Esta carpeta contiene componentes con efectos visuales avanzados inspirados en Magic UI y Aceternity UI.

## 📦 Componentes Disponibles (7 componentes)

### ✨ Text Effects (4 componentes)

Efectos de texto animados para títulos y elementos destacados.

#### 1. AnimatedGradientText
Badge o texto con gradiente animado.

```tsx
import { AnimatedGradientText } from '@/components/effects/text';

<AnimatedGradientText>
  ✨ Introducing Magic UI
</AnimatedGradientText>
```

**Características:**
- Gradiente animado de fondo
- Efecto de hover con shadow
- Backdrop blur automático
- Totalmente personalizable con className

#### 2. TypingAnimation
Efecto de typing/escritura progresiva.

```tsx
import { TypingAnimation } from '@/components/effects/text';

<TypingAnimation
  text="Bienvenido a nuestro sitio"
  duration={200}
  className="text-4xl font-bold"
/>
```

**Props:**
- `text`: string - Texto a animar
- `duration`: number (opcional, default: 200) - Velocidad en ms por carácter
- `className`: string (opcional) - Clases CSS adicionales

#### 3. FlipText
Efecto de flip 3D en cada letra.

```tsx
import { FlipText } from '@/components/effects/text';

<FlipText
  word="INNOVACIÓN"
  duration={0.5}
  delayMultiple={0.08}
  className="text-5xl font-bold"
/>
```

**Props:**
- `word`: string - Palabra a animar
- `duration`: number (opcional, default: 0.5) - Duración del flip en segundos
- `delayMultiple`: number (opcional, default: 0.08) - Delay entre letras
- `className`: string (opcional) - Clases CSS adicionales

#### 4. ShimmerButton
Botón con efecto shimmer/brillo animado.

```tsx
import { ShimmerButton } from '@/components/effects/text';

<ShimmerButton
  shimmerColor="#ffffff"
  shimmerDuration="3s"
  background="rgba(0, 0, 0, 1)"
  onClick={() => console.log('Clicked!')}
>
  Comenzar Ahora
</ShimmerButton>
```

**Props:**
- `shimmerColor`: string (opcional, default: "#ffffff") - Color del shimmer
- `shimmerSize`: string (opcional, default: "0.05em") - Tamaño del efecto
- `shimmerDuration`: string (opcional, default: "3s") - Duración de la animación
- `borderRadius`: string (opcional, default: "100px") - Border radius
- `background`: string (opcional, default: "rgba(0, 0, 0, 1)") - Color de fondo
- Soporta todas las props de HTMLButtonElement

### 🎨 Background Effects (3 componentes)

Efectos de fondo para secciones y contenedores.

#### 1. DotPattern
Patrón de puntos para fondos.

```tsx
import { DotPattern } from '@/components/effects/background';

<div className="relative h-screen">
  <DotPattern
    width={16}
    height={16}
    cx={1}
    cy={1}
    cr={1}
    className="fill-neutral-400/80"
  />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</div>
```

**Props:**
- `width`: number (opcional, default: 16) - Ancho del patrón
- `height`: number (opcional, default: 16) - Alto del patrón
- `x`, `y`: number (opcional) - Offset del patrón
- `cx`, `cy`, `cr`: number (opcional) - Posición y radio del punto
- `className`: string (opcional) - Clases CSS para el patrón

#### 2. GridPattern
Patrón de grid/cuadrícula para fondos.

```tsx
import { GridPattern } from '@/components/effects/background';

<div className="relative h-screen">
  <GridPattern
    width={40}
    height={40}
    strokeDasharray="0"
    className="stroke-gray-300/30"
  />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</div>
```

**Props:**
- `width`: number (opcional, default: 40) - Ancho de cada celda
- `height`: number (opcional, default: 40) - Alto de cada celda
- `x`, `y`: number (opcional) - Offset del grid
- `strokeDasharray`: string (opcional, default: "0") - Estilo de línea
- `className`: string (opcional) - Clases CSS para el stroke

#### 3. Meteors
Efecto de lluvia de meteoritos.

```tsx
import { Meteors } from '@/components/effects/background';

<div className="relative h-screen overflow-hidden bg-slate-900">
  <Meteors number={20} />
  <div className="relative z-10">
    {/* Tu contenido aquí */}
  </div>
</div>
```

**Props:**
- `number`: number (opcional, default: 20) - Cantidad de meteoritos
- `className`: string (opcional) - Clases CSS adicionales

## 🚀 Uso

### Importación Individual
```tsx
import { AnimatedGradientText } from '@/components/effects/text/AnimatedGradientText';
import { DotPattern } from '@/components/effects/background/DotPattern';
```

### Importación desde Categoría
```tsx
import { AnimatedGradientText, TypingAnimation, FlipText } from '@/components/effects/text';
import { DotPattern, GridPattern, Meteors } from '@/components/effects/background';
```

### Importación Global
```tsx
import { AnimatedGradientText, DotPattern, Meteors } from '@/components/effects';
```

## 📝 Ejemplos Completos

### Hero con Background Pattern
```tsx
import { Header1 } from '@/components/relume/header';
import { GridPattern } from '@/components/effects/background';

export function HeroSection() {
  return (
    <div className="relative min-h-screen">
      <GridPattern className="stroke-gray-300/30" />
      <div className="relative z-10">
        <Header1
          heading="Transforma tu negocio"
          description="Soluciones innovadoras para empresas modernas"
          buttons={[
            { title: "Comenzar", variant: "primary" },
          ]}
          image={{ src: "/hero.jpg", alt: "Hero" }}
        />
      </div>
    </div>
  );
}
```

### CTA con Efectos de Texto
```tsx
import { CTA8 } from '@/components/relume/cta';
import { FlipText, ShimmerButton } from '@/components/effects/text';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container">
        <FlipText
          word="INNOVACIÓN"
          className="mb-6 text-6xl font-bold text-center"
        />
        <p className="text-center text-xl mb-8">
          Únete a miles de empresas que confían en nosotros
        </p>
        <div className="flex justify-center">
          <ShimmerButton
            shimmerColor="#ffffff"
            background="rgba(0, 0, 0, 1)"
          >
            Comenzar Gratis
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
```

### Sección con Meteoros
```tsx
import { Meteors } from '@/components/effects/background';

export function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      <Meteors number={30} />
      <div className="relative z-10 container">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Lo que dicen nuestros clientes
        </h2>
        {/* Testimonials aquí */}
      </div>
    </section>
  );
}
```

## 🎨 Integración con Relume

Estos efectos funcionan perfectamente con componentes de Relume:

```tsx
import { Navbar1 } from '@/components/relume/navbar';
import { Header26 } from '@/components/relume/header';
import { Footer1 } from '@/components/relume/footer';
import { AnimatedGradientText, DotPattern } from '@/components/effects';

export default function HomePage() {
  return (
    <>
      <Navbar1 {...navbarProps} />

      <div className="relative">
        <DotPattern />
        <div className="relative z-10">
          <Header26
            tagline={
              <AnimatedGradientText>
                ✨ Nuevo Producto
              </AnimatedGradientText>
            }
            heading="Tu título aquí"
            description="Tu descripción"
            buttons={[{ title: "Comenzar", variant: "primary" }]}
            image={{ src: "/hero.jpg", alt: "Hero" }}
          />
        </div>
      </div>

      <Footer1 {...footerProps} />
    </>
  );
}
```

## ⚙️ Configuración

Las animaciones ya están configuradas en `tailwind.config.js`:

```javascript
animation: {
  gradient: 'gradient 8s linear infinite',
  flip: 'flip 0.5s ease-in-out',
  'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
  'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
  meteor: 'meteor 5s linear infinite',
}
```

## 🎯 Mejores Prácticas

1. **Performance**: Usa efectos con moderación en mobile
2. **Accesibilidad**: Respeta `prefers-reduced-motion`
3. **Z-index**: Usa `relative` y `z-10` para contenido sobre backgrounds
4. **Overflow**: Añade `overflow-hidden` en contenedores con Meteors
5. **Contraste**: Asegura buen contraste de texto sobre patterns

## 📚 Recursos

- **Magic UI**: https://magicui.design/
- **Aceternity UI**: https://ui.aceternity.com/
- **React Bits**: https://reactbits.dev/ (ya integrado en `components/animations/`)

## 🔄 Actualización

Para agregar más componentes de Magic UI o Aceternity UI:

1. Visita sus sitios web
2. Copia el componente que necesites
3. Adáptalo para usar `@/lib/utils` (cn function)
4. Agrégalo a la carpeta correspondiente (text/background/interactive)
5. Exporta desde el index.ts
6. Documenta su uso aquí

## ✅ Compatibilidad

- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v3
- ✅ Compatible con todos los componentes de Relume y shadcn/ui
