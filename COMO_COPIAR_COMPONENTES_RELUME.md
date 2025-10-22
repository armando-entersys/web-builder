# Cómo Copiar Componentes de Relume.io

Esta guía te muestra paso a paso cómo copiar los 30 componentes gratuitos (y todos los de tu licencia paga) desde Relume.io.

## ✅ Configuración Completada

Ya hemos configurado todo lo necesario:
- ✅ `@relume_io/relume-ui@1.3.1` instalado
- ✅ `@relume_io/relume-tailwind@1.3.0` instalado
- ✅ `tailwind.config.js` configurado con preset de Relume
- ✅ Estructura de carpetas creada (24 categorías)
- ✅ 3 Navbars de ejemplo creados como plantilla

## 📝 Pasos para Copiar Componentes

### 1. Acceder a Relume

1. **Ve a**: https://www.relume.io/react/components
2. **Inicia sesión** con tu cuenta de licencia paga
3. Verás el menú lateral con categorías:
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
   - Blog
   - Gallery
   - Logo
   - Y más...

### 2. Navegar y Seleccionar

1. **Busca por categoría**: Haz clic en una categoría del menú (ej. "Hero")
2. **Ver componentes**: Verás tarjetas con previews de cada componente
3. **Identificar número**: Cada componente tiene un número (ej. "Hero 1", "Feature 44")
4. **Clic en el componente**: Se abrirá la vista detallada

### 3. Copiar el Código

En la vista detallada del componente:

1. **Busca el botón** "Copy code" o "View code"
2. **Selecciona "React"** (no HTML)
3. **Copia el código** completo
4. El código incluirá:
   - Imports necesarios
   - TypeScript interfaces para Props
   - El componente funcional
   - Valores por defecto (opcional)

### 4. Crear el Archivo

1. **Identifica la categoría**: Basado en el tipo de componente
2. **Crea el archivo** en la carpeta correspondiente:

```bash
components/relume/[categoría]/[ComponenteNumero].tsx
```

**Ejemplos:**
```
components/relume/hero/Hero1.tsx
components/relume/hero/Hero26.tsx
components/relume/feature/Layout141.tsx
components/relume/cta/CTA8.tsx
components/relume/navbar/Navbar1.tsx
components/relume/footer/Footer1.tsx
```

### 5. Pegar y Ajustar

1. **Pega el código** copiado en el archivo
2. **Verifica imports**: Deben usar `@relume_io/relume-ui`
3. **Exporta el componente**:

```typescript
// Asegúrate de exportar con export
export const Hero1 = (props: Props) => {
  // ... código del componente
};
```

## 📋 Lista de 30 Componentes Gratuitos

Aquí está la lista de los 30 componentes gratuitos que debes copiar:

### Navbars (3) ✅ Ejemplos creados
- ✅ Navbar 1 (plantilla)
- ✅ Navbar 2 (plantilla)
- ✅ Navbar 3 (plantilla)
- 📝 Reemplazar con código real de Relume.io

### Headers/Hero (4)
- [ ] Header 1 → `components/relume/header/Header1.tsx`
- [ ] Header 26 → `components/relume/header/Header26.tsx`
- [ ] Header 44 → `components/relume/header/Header44.tsx`
- [ ] Header 62 → `components/relume/header/Header62.tsx`

### Features (6)
- [ ] Layout 1 → `components/relume/feature/Layout1.tsx`
- [ ] Layout 141 → `components/relume/feature/Layout141.tsx`
- [ ] Layout 192 → `components/relume/feature/Layout192.tsx`
- [ ] Layout 239 → `components/relume/feature/Layout239.tsx`
- [ ] Layout 242 → `components/relume/feature/Layout242.tsx`
- [ ] Layout 250 → `components/relume/feature/Layout250.tsx`

### CTAs (2)
- [ ] CTA 8 → `components/relume/cta/CTA8.tsx`
- [ ] CTA 25 → `components/relume/cta/CTA25.tsx`

### Testimonials (2)
- [ ] Testimonial 1 → `components/relume/testimonial/Testimonial1.tsx`
- [ ] Testimonial 17 → `components/relume/testimonial/Testimonial17.tsx`

### Team (2)
- [ ] Team 5 → `components/relume/team/Team5.tsx`
- [ ] Team 8 → `components/relume/team/Team8.tsx`

### Blog (2)
- [ ] Blog 33 → `components/relume/blog-list/Blog33.tsx`
- [ ] Blog 44 → `components/relume/blog-list/Blog44.tsx`

### Gallery (2)
- [ ] Gallery 7 → `components/relume/gallery/Gallery7.tsx`
- [ ] Gallery 21 → `components/relume/gallery/Gallery21.tsx`

### FAQs (2)
- [ ] FAQ 1 → `components/relume/faq/FAQ1.tsx`
- [ ] FAQ 6 → `components/relume/faq/FAQ6.tsx`

### Footers (2)
- [ ] Footer 1 → `components/relume/footer/Footer1.tsx`
- [ ] Footer 3 → `components/relume/footer/Footer3.tsx`

### Otros (3)
- [ ] Contact 1 → `components/relume/contact/Contact1.tsx`
- [ ] Pricing 18 → `components/relume/pricing/Pricing18.tsx`
- [ ] Logo 1 → `components/relume/logo-list/Logo1.tsx`

## 🔄 Después de Copiar Cada Categoría

Cuando termines de copiar todos los componentes de una categoría, crea/actualiza su `index.ts`:

```typescript
// Ejemplo: components/relume/hero/index.ts
export { Hero1 } from './Hero1';
export { Hero26 } from './Hero26';
export { Hero44 } from './Hero44';
export { Hero62 } from './Hero62';
```

## 🎯 Ejemplo Completo

### Paso a Paso para Copiar "Hero 1"

1. **Ir a**: https://www.relume.io/react/components
2. **Menú lateral** → Click en "Hero"
3. **Buscar** "Hero 1" en la lista
4. **Click** en el componente
5. **Click** en "Copy code" o "View code"
6. **Seleccionar** pestaña "React"
7. **Copiar** todo el código

8. **En tu proyecto**, crear archivo:
   ```
   C:\web-builder\apps\web\components\relume\hero\Hero1.tsx
   ```

9. **Pegar el código** (ejemplo aproximado):

```typescript
import { Button } from "@relume_io/relume-ui";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: Array<{
    title: string;
    variant?: "primary" | "secondary";
  }>;
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
                <Button key={index} variant={button.variant}>
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

// Props por defecto (opcionales)
Hero1.defaultProps = {
  heading: "Medium length hero heading goes here",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  buttons: [
    { title: "Button", variant: "primary" },
    { title: "Button", variant: "secondary" },
  ],
  image: {
    src: "https://via.placeholder.com/800x600",
    alt: "Hero image",
  },
};
```

10. **Actualizar** `components/relume/hero/index.ts`:

```typescript
export { Hero1 } from './Hero1';
// Agregar más exports según copies más componentes
```

## ⚙️ Ajustes Comunes

### Si hay errores de TypeScript

Asegúrate de que los tipos estén bien definidos:

```typescript
type ButtonProps = {
  title: string;
  variant?: "primary" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
};
```

### Si faltan componentes UI

Si ves imports como:
```typescript
import { Button, Input, Badge } from "@relume_io/relume-ui";
```

Todos estos componentes están disponibles en `@relume_io/relume-ui` que ya instalamos.

### Si hay clases de Tailwind personalizadas

El preset `@relume_io/relume-tailwind` que instalamos ya incluye las clases personalizadas de Relume.

## 🔥 Tips

1. **Copia de a varios**: Puedes abrir varios tabs y copiar múltiples componentes
2. **Mantén la estructura**: Usa los nombres exactos (Hero1, Layout141, etc.)
3. **Documenta cambios**: Si modificas algo, agrega un comentario
4. **Props dinámicos**: Los componentes están diseñados para recibir datos desde tu backend/CMS
5. **Reutiliza tipos**: Si varios componentes comparten tipos, créalos en un archivo `types.ts`

## 📚 Recursos

- **Sitio de componentes**: https://www.relume.io/react/components
- **Documentación React**: https://react-docs.relume.io/
- **Figma**: https://www.relume.io/figma (para ver diseños)
- **Componentes instalados**: `components/relume/` (en tu proyecto)

## ✅ Verificación

Después de copiar un componente, verifica:

1. ✅ El archivo tiene extensión `.tsx`
2. ✅ El componente está exportado con `export const`
3. ✅ Los tipos TypeScript están correctos
4. ✅ Las importaciones usan `@relume_io/relume-ui`
5. ✅ El componente está agregado al `index.ts` de su categoría

## 🚀 Uso en el Proyecto

Una vez copiados, puedes usar los componentes:

```typescript
import { Hero1 } from '@/components/relume/hero';
import { Feature141 } from '@/components/relume/feature';
import { CTA8 } from '@/components/relume/cta';

export default function LandingPage() {
  return (
    <>
      <Hero1
        heading="Tu título aquí"
        description="Tu descripción"
        buttons={[
          { title: "Comenzar", variant: "primary" },
        ]}
        image={{ src: "/hero.jpg", alt: "Hero" }}
      />
      <Feature141 {...featureProps} />
      <CTA8 {...ctaProps} />
    </>
  );
}
```

---

**Nota**: Este proceso lo debes hacer manualmente porque los componentes de Relume requieren autenticación y no pueden ser descargados automáticamente. Sin embargo, una vez copiados, tendrás acceso completo al código y podrás modificarlos como quieras.
