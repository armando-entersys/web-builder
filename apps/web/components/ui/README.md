# Componentes UI - shadcn/ui + Personalizados

Esta carpeta contiene los componentes UI base del proyecto, combinando componentes de shadcn/ui con componentes personalizados.

## ✅ Componentes Instalados

### De shadcn/ui (Nuevos - Instalados en Fase 1)
- **Dialog** - Modales y diálogos
- **Dropdown Menu** - Menús desplegables
- **Tooltip** - Tooltips informativos
- **Tabs** - Pestañas de navegación
- **Accordion** - Acordeones expandibles
- **Separator** - Líneas separadoras

### Componentes Personalizados (Retrocompatibles)
- **Button** ✅ - Actualizado para ser compatible con shadcn (usa cn() y Slot)
- **Card** - Tarjetas de contenido
- **Badge** - Etiquetas y badges
- **Input** - Campos de entrada
- **Label** - Etiquetas de formulario
- **Textarea** - Áreas de texto

## 🔧 Configuración

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 📦 Dependencias Instaladas

- `@radix-ui/react-slot` - Para soporte de `asChild`
- `@radix-ui/react-dialog` - Para Dialog
- `@radix-ui/react-dropdown-menu` - Para Dropdown Menu
- `@radix-ui/react-tooltip` - Para Tooltip
- `@radix-ui/react-tabs` - Para Tabs
- `@radix-ui/react-accordion` - Para Accordion
- `@radix-ui/react-separator` - Para Separator
- `class-variance-authority` - Para variantes de componentes
- `clsx` - Para manejo de clases condicionales
- `tailwind-merge` - Para fusión de clases Tailwind

## 🎨 Uso de Componentes

### Button (Actualizado - Retrocompatible)
```tsx
import { Button } from "@/components/ui/button"

// Uso básico
<Button>Click me</Button>

// Con variantes
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>

// Como enlace (usando asChild)
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```

### Dialog (shadcn/ui)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Dropdown Menu (shadcn/ui)
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs (shadcn/ui)
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

### Accordion (shadcn/ui)
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## 🔄 Retrocompatibilidad

Todos los componentes personalizados existentes han sido actualizados para ser totalmente compatibles con shadcn/ui:

1. **Button** - Ahora usa `cn()` y soporta `asChild` con Slot
2. **Todos los componentes** - Utilizan las mismas variables CSS que shadcn
3. **Estilos** - Compatible con el theme de shadcn (darkMode, colores, etc.)

## 📋 Próximos Componentes a Agregar

```bash
# Navegación
pnpm dlx shadcn@latest add breadcrumb navigation-menu

# Formularios
pnpm dlx shadcn@latest add select checkbox radio-group switch form

# Feedback
pnpm dlx shadcn@latest add alert toast progress skeleton

# Layout
pnpm dlx shadcn@latest add sheet sidebar resizable scroll-area

# Data Display
pnpm dlx shadcn@latest add table avatar badge calendar
```

## 🌐 Recursos

- **shadcn/ui Docs**: https://ui.shadcn.com/docs
- **Radix UI Primitives**: https://www.radix-ui.com/primitives
- **Tailwind CSS**: https://tailwindcss.com/docs

## ⚠️ Notas Importantes

1. **Siempre usar cn()**: Para combinar clases de Tailwind correctamente
2. **asChild prop**: Permite renderizar componentes como otros elementos
3. **Variables CSS**: Todos los colores usan `hsl(var(--color-*))` para theming
4. **Dark Mode**: Todos los componentes soportan dark mode automáticamente
5. **Accesibilidad**: Los componentes de Radix UI incluyen ARIA attributes

## 🎯 Convenciones

- Usar `cn()` en lugar de concatenación de strings para clases
- Exportar variantes con `cva` de class-variance-authority
- Mantener tipado estricto con TypeScript
- Usar `React.forwardRef` para componentes que necesitan refs
- Exportar tanto el componente como sus variantes
