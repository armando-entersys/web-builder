# Componentes de Secciones Web

Esta carpeta contiene componentes de secciones completas para construir páginas web, organizados según las categorías de Scram.io.

## Categorías Disponibles

Basado en el archivo `categories.txt` de Scram, el proyecto soporta las siguientes categorías:

### Secciones Principales
- **about** - Secciones About/Acerca de
- **announcement-banner** - Banners de anuncios
- **benefits** - Secciones de beneficios
- **blog-list** - Listas de artículos de blog
- **blog-post** - Encabezados y cuerpo de posts de blog
- **contact** - Secciones de contacto
- **cta** - Call-to-Action sections
- **events** - Listas y detalles de eventos
- **faq** - Secciones de preguntas frecuentes
- **feature** - Características/features
- **footer** - Pies de página
- **gallery** - Galerías de imágenes
- **header** - Encabezados de páginas
- **hero** - Hero headers/secciones principales
- **how-it-works** - Secciones explicativas de procesos
- **job-listings** - Listados de empleo/carreras
- **logo-list** - Listas de logos de clientes/partners
- **navbar** - Barras de navegación
- **portfolio** - Secciones de portfolio/proyectos
- **pricing** - Tablas de precios
- **product** - Encabezados y listas de productos
- **team** - Secciones de equipo
- **testimonial** - Testimonios de clientes

## Fuentes de Componentes

### 1. Scram.io (Secciones Completas)
**URL**: https://www.scram.io/react/components
- **Licencia**: Paga (ya adquirida)
- **Cantidad**: 1,400+ componentes de secciones completas
- **Uso**: Copy/paste desde el sitio web
- **Organización**: Copiar en la carpeta correspondiente según categoría

#### Cómo agregar componentes de Scram:
1. **Acceso**: Ve a https://www.scram.io/react/components (requiere login con licencia paga)
2. **Explorar**: Navega por las categorías en el menú lateral:
   - Hero
   - Header
   - Feature
   - CTA
   - Testimonial
   - Team
   - Pricing
   - FAQ
   - Contact
   - Footer
   - Y más...
3. **Seleccionar**: Haz clic en el componente que desees
4. **Copiar código**: Usa el botón "Copy code" para copiar el componente React
5. **Crear archivo**: Crea un archivo en la carpeta correspondiente:
   ```
   components/scram/hero/Hero1.tsx
   components/scram/feature/Feature44.tsx
   components/scram/cta/CTA8.tsx
   ```
6. **Pegar y ajustar**:
   - Pega el código copiado
   - Verifica que las importaciones usen `@relume_io/relume-ui`
   - Ajusta PropTypes si es necesario

**Ejemplo de componente Hero1:**
```tsx
import { Button } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: React.ButtonHTMLAttributes<HTMLButtonElement>[];
  image: ImageProps;
};

export const Hero1 = (props: Props) => {
  const { heading, description, buttons, image } = props;
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              {heading}
            </h1>
            <p className="md:text-md">{description}</p>
            <div className="mt-6 flex gap-x-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <img
              src={image.src}
              className="w-full object-cover"
              alt={image.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
```

### 2. React Bits (Componentes Animados) ✅ INTEGRADO
**URL**: https://reactbits.dev
- **Estado**: ✅ 115 componentes ya integrados en `components/animations/`
- **Licencia**: Open Source (Gratis)
- **Ubicación**: `components/animations/`
- **Categorías Integradas**:
  - `transitions/` - 25 componentes (FadeContent, Magnet, StarBorder, etc.)
  - `text/` - 24 componentes (TextType, GradientText, GlitchText, etc.)
  - `backgrounds/` - 30 componentes (Aurora, Beams, Galaxy, etc.)
  - `interactive/` - 36 componentes (Carousel, Dock, SpotlightCard, etc.)

#### Uso de React Bits:
Los componentes ya están disponibles para usar:
```typescript
import { FadeContent, Magnet } from '@/components/animations/transitions'
import { TextType, GradientText } from '@/components/animations/text'
import { Aurora, Beams } from '@/components/animations/backgrounds'
import { Carousel, Dock } from '@/components/animations/interactive'
```

Ver documentación completa en `components/animations/README.md`

## Estructura de Archivos

Cada categoría debe tener:

```
category-name/
├── index.ts           # Exporta todos los componentes de la categoría
├── Component1.tsx     # Variante 1
├── Component2.tsx     # Variante 2
└── Component3.tsx     # Variante 3
```

### Ejemplo de index.ts:
```typescript
export { Hero1 } from './Hero1';
export { Hero2 } from './Hero2';
export { Hero3 } from './Hero3';
```

## Uso en el Proyecto

### En WireframeView
Los componentes se mapean por variante:

```tsx
import { Hero1, Hero2, Hero3 } from '@/components/scram/hero';

const HeroVariants = {
  1: Hero1,
  2: Hero2,
  3: Hero3,
};

const HeroComponent = HeroVariants[variant];
return <HeroComponent {...props} />;
```

### En DesignView
Los componentes se renderizan con design tokens aplicados automáticamente.

## Prioridades de Implementación

### Fase 1: Componentes Esenciales de Scram (Copiar desde scram.io)
- [ ] 5 Navbars
- [ ] 10 Heroes
- [ ] 5 Headers
- [ ] 10 Features
- [ ] 5 CTAs
- [ ] 5 Testimonials
- [ ] 3 Footers
- [ ] 3 Pricing
- [ ] 3 FAQs
- [ ] 3 Contact

### Fase 2: Componentes Secundarios de Scram
- [ ] 3 About
- [ ] 2 Announcement Banners
- [ ] 3 Benefits
- [ ] 5 Blog Lists
- [ ] 3 Blog Post Headers
- [ ] 3 Galleries
- [ ] 3 Team
- [ ] 3 Logo Lists

### Fase 3: Componentes Especializados de Scram
- [ ] 2 How It Works
- [ ] 2 Events
- [ ] 2 Job Listings
- [ ] 3 Portfolio
- [ ] 2 Product Headers
- [ ] 2 Product Lists

### Fase 4: Animaciones de React Bits (Para mejorar componentes existentes)
- [ ] 5 Text Animations (para títulos)
- [ ] 5 Entrance Animations (para secciones)
- [ ] 3 Background Effects
- [ ] 5 Interactive Components (botones, cards, etc.)

## Convenciones de Nombres

- **Archivos**: PascalCase con número de variante: `Hero1.tsx`, `CTA3.tsx`
- **Componentes**: Mismo nombre que el archivo
- **Props**: Usar interfaces TypeScript tipadas

## Dependencias Instaladas

- `@relume_io/relume-ui@^1.3.1` - Componentes UI base de Scram
- `tailwindcss@^3.4.17` - Para estilos
- `lucide-react@^0.546.0` - Iconos

## Notas Importantes

1. **No commitear sin revisar**: Siempre revisar el código copiado antes de commit
2. **Ajustar imports**: Cambiar imports de componentes a `@relume_io/relume-ui`
3. **Mantener tipado**: Todos los componentes deben estar correctamente tipados
4. **Documentar variantes**: Agregar comentarios indicando de dónde viene cada componente

## Recursos

- **Scram React Components**: https://www.scram.io/react/components (requiere login con licencia paga)
- **Scram Docs**: https://react-docs.scram.io/
- **React Bits**: https://reactbits.dev (open source)
- **React Bits GitHub**: https://github.com/DavidHDev/react-bits
