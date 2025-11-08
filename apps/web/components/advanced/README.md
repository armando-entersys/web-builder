# Componentes Avanzados - Origin UI & Untitled UI

Esta carpeta contiene componentes avanzados inspirados en Origin UI y Untitled UI, enfocados en formularios, feedback y layout.

## 📦 Componentes Disponibles (8 componentes)

### 📝 Forms (3 componentes)

Componentes avanzados de formularios con excelente UX.

#### 1. InputOTP
Input para códigos OTP/2FA con soporte para paste.

```tsx
import { InputOTP } from '@/components/advanced/forms';

<InputOTP
  length={6}
  value={otp}
  onChange={(value) => setOtp(value)}
  onComplete={(value) => verifyOTP(value)}
/>
```

**Props:**
- `length`: number (opcional, default: 6) - Cantidad de dígitos
- `value`: string (opcional) - Valor controlado
- `onChange`: (value: string) => void - Callback al cambiar
- `onComplete`: (value: string) => void - Callback al completar
- `disabled`: boolean (opcional) - Deshabilitar input
- `className`: string (opcional) - Clases adicionales

**Características:**
- Auto-focus al siguiente input
- Soporte para paste de 6 dígitos
- Solo acepta números
- Backspace inteligente
- Estados focus/disabled

#### 2. SearchInput
Input de búsqueda con debounce automático.

```tsx
import { SearchInput } from '@/components/advanced/forms';

<SearchInput
  placeholder="Buscar productos..."
  onSearch={(query) => handleSearch(query)}
  debounceMs={300}
  showClear={true}
/>
```

**Props:**
- `placeholder`: string (opcional) - Placeholder del input
- `value`: string (opcional) - Valor controlado
- `onChange`: (value: string) => void - Callback inmediato
- `onSearch`: (value: string) => void - Callback con debounce
- `debounceMs`: number (opcional, default: 300) - Delay del debounce
- `showClear`: boolean (opcional, default: true) - Mostrar botón clear
- `className`: string (opcional) - Clases adicionales

**Características:**
- Debounce automático
- Icono de búsqueda
- Botón para limpiar
- Optimizado para performance

#### 3. FileUpload
Componente de carga de archivos con drag & drop.

```tsx
import { FileUpload } from '@/components/advanced/forms';

<FileUpload
  accept="image/*"
  maxSize={10 * 1024 * 1024} // 10MB
  multiple={true}
  onUpload={(files) => handleUpload(files)}
/>
```

**Props:**
- `accept`: string (opcional, default: "*") - Tipos de archivo aceptados
- `maxSize`: number (opcional, default: 10MB) - Tamaño máximo en bytes
- `multiple`: boolean (opcional, default: false) - Múltiples archivos
- `onUpload`: (files: File[]) => void - Callback con archivos
- `disabled`: boolean (opcional) - Deshabilitar upload
- `className`: string (opcional) - Clases adicionales

**Características:**
- Drag & drop
- Click to browse
- Validación de tamaño
- Preview de archivos
- Remover archivos individuales
- Estados visuales (dragging, error)

---

### 💬 Feedback (3 componentes)

Componentes para comunicar estados y acciones al usuario.

#### 1. Toast
Notificaciones toast con auto-dismiss.

```tsx
import { Toast } from '@/components/advanced/feedback';

<Toast
  message="Archivo guardado exitosamente"
  type="success"
  duration={5000}
  onClose={() => setShowToast(false)}
/>
```

**Props:**
- `message`: string - Mensaje a mostrar
- `type`: "success" | "error" | "warning" | "info" (opcional, default: "info")
- `duration`: number (opcional, default: 5000) - Duración en ms (0 = sin auto-close)
- `onClose`: () => void - Callback al cerrar
- `className`: string (opcional) - Clases adicionales

**Características:**
- 4 tipos con íconos
- Auto-dismiss configurable
- Animación de entrada
- Botón de cierre manual
- Dark mode support

#### 2. ProgressBar
Barra de progreso con variantes y labels.

```tsx
import { ProgressBar } from '@/components/advanced/feedback';

<ProgressBar
  value={75}
  max={100}
  showLabel={true}
  size="md"
  variant="success"
/>
```

**Props:**
- `value`: number - Valor actual
- `max`: number (opcional, default: 100) - Valor máximo
- `showLabel`: boolean (opcional, default: false) - Mostrar porcentaje
- `size`: "sm" | "md" | "lg" (opcional, default: "md") - Tamaño
- `variant`: "default" | "success" | "warning" | "error" (opcional, default: "default")
- `className`: string (opcional) - Clases adicionales

**Características:**
- Animación suave
- 4 variantes de color
- 3 tamaños
- Label opcional con porcentaje
- Responsive

#### 3. Skeleton
Componentes skeleton para estados de carga.

```tsx
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/advanced/feedback';

// Básico
<Skeleton className="h-4 w-full" />

// Preconfigurados
<SkeletonCard />
<SkeletonText lines={3} />
<SkeletonAvatar />
```

**Props (Skeleton):**
- `variant`: "text" | "circular" | "rectangular" (opcional, default: "rectangular")
- `animation`: "pulse" | "wave" | "none" (opcional, default: "pulse")
- `className`: string (opcional) - Clases adicionales

**Componentes preconfigurados:**
- `SkeletonCard` - Card completo con título y texto
- `SkeletonText` - Múltiples líneas de texto
- `SkeletonAvatar` - Avatar circular

**Características:**
- 2 tipos de animación
- 3 variantes
- Componentes preconfigurados
- Customizable

---

### 📐 Layout (2 componentes)

Componentes para estructurar layouts.

#### 1. EmptyState
Estado vacío con ilustración y CTA.

```tsx
import { EmptyState } from '@/components/advanced/layout';

<EmptyState
  icon={
    <svg className="h-24 w-24">...</svg>
  }
  title="No hay resultados"
  description="Intenta ajustar tus filtros o búsqueda"
  action={{
    label: "Limpiar filtros",
    onClick: () => clearFilters()
  }}
/>
```

**Props:**
- `icon`: ReactNode (opcional) - Ícono o ilustración
- `title`: string - Título principal
- `description`: string (opcional) - Descripción
- `action`: object (opcional) - Botón de acción
  - `label`: string - Texto del botón
  - `onClick`: () => void - Callback
- `className`: string (opcional) - Clases adicionales

**Usos:**
- Lista vacía
- Sin resultados de búsqueda
- Página no encontrada
- Error state

#### 2. Container
Contenedor responsive con tamaños predefinidos.

```tsx
import { Container } from '@/components/advanced/layout';

<Container size="lg">
  <h1>Mi Contenido</h1>
</Container>
```

**Props:**
- `children`: ReactNode - Contenido
- `size`: "sm" | "md" | "lg" | "xl" | "full" (opcional, default: "lg")
  - sm: max-w-3xl
  - md: max-w-5xl
  - lg: max-w-7xl
  - xl: max-w-[1400px]
  - full: max-w-full
- `className`: string (opcional) - Clases adicionales

**Características:**
- Centrado automático
- Padding responsive
- 5 tamaños predefinidos

---

## 🚀 Uso

### Importación Individual
```tsx
import { InputOTP } from '@/components/advanced/forms/InputOTP';
import { Toast } from '@/components/advanced/feedback/Toast';
import { Container } from '@/components/advanced/layout/Container';
```

### Importación por Categoría
```tsx
import { InputOTP, SearchInput, FileUpload } from '@/components/advanced/forms';
import { Toast, ProgressBar, Skeleton } from '@/components/advanced/feedback';
import { EmptyState, Container } from '@/components/advanced/layout';
```

### Importación Global
```tsx
import { InputOTP, Toast, EmptyState } from '@/components/advanced';
```

---

## 📝 Ejemplos Completos

### Formulario de Verificación OTP
```tsx
import { InputOTP } from '@/components/advanced/forms';
import { Toast } from '@/components/advanced/feedback';
import { useState } from 'react';

export function VerificationForm() {
  const [otp, setOtp] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleComplete = async (value: string) => {
    try {
      await verifyOTP(value);
      setShowToast(true);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <h2>Ingresa tu código</h2>
      <InputOTP
        length={6}
        value={otp}
        onChange={setOtp}
        onComplete={handleComplete}
      />
      {showToast && (
        <Toast
          message="Código verificado exitosamente"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
```

### Búsqueda con Resultados
```tsx
import { SearchInput } from '@/components/advanced/forms';
import { SkeletonCard } from '@/components/advanced/feedback';
import { EmptyState } from '@/components/advanced/layout';
import { useState } from 'react';

export function ProductSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const data = await searchProducts(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div>
      <SearchInput
        placeholder="Buscar productos..."
        onSearch={handleSearch}
        debounceMs={500}
      />

      {loading && (
        <div className="mt-4 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && results.length === 0 && (
        <EmptyState
          title="No se encontraron productos"
          description="Intenta con otros términos de búsqueda"
          action={{
            label: "Ver todos",
            onClick: () => handleSearch('')
          }}
        />
      )}

      {!loading && results.length > 0 && (
        <div className="mt-4 grid gap-4">
          {results.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Upload de Archivos con Progreso
```tsx
import { FileUpload } from '@/components/advanced/forms';
import { ProgressBar, Toast } from '@/components/advanced/feedback';
import { useState } from 'react';

export function DocumentUploader() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], (p) => {
        const totalProgress = ((i + p) / files.length) * 100;
        setProgress(totalProgress);
      });
    }

    setUploading(false);
    setShowSuccess(true);
  };

  return (
    <div>
      <FileUpload
        accept=".pdf,.doc,.docx"
        maxSize={20 * 1024 * 1024}
        multiple={true}
        onUpload={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="mt-4">
          <ProgressBar
            value={progress}
            showLabel={true}
            variant="default"
          />
        </div>
      )}

      {showSuccess && (
        <Toast
          message="Archivos cargados exitosamente"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
```

---

## 🎨 Integración con Otros Componentes

### Con Scram
```tsx
import { Header1 } from '@/components/scram/header';
import { Container, EmptyState } from '@/components/advanced/layout';

<Header1 {...props} />
<Container size="lg">
  <EmptyState {...emptyProps} />
</Container>
```

### Con React Bits
```tsx
import { FadeContent } from '@/components/animations/transitions';
import { Toast } from '@/components/advanced/feedback';

<FadeContent>
  <Toast message="Animación completada" type="success" />
</FadeContent>
```

### Con Efectos Visuales
```tsx
import { DotPattern } from '@/components/effects/background';
import { Container } from '@/components/advanced/layout';
import { SearchInput } from '@/components/advanced/forms';

<div className="relative">
  <DotPattern />
  <Container className="relative z-10">
    <SearchInput {...searchProps} />
  </Container>
</div>
```

---

## ⚙️ Mejores Prácticas

1. **Forms**: Siempre valida en cliente y servidor
2. **Toast**: Usa duración apropiada según importancia
3. **Skeleton**: Coincide tamaños con contenido real
4. **EmptyState**: Ofrece acción clara al usuario
5. **Container**: Usa tamaños consistentes en toda la app

---

## 🔧 Personalización

Todos los componentes aceptan `className` y usan `cn()` para merge:

```tsx
<InputOTP className="gap-4" />
<Toast className="shadow-2xl" />
<Container className="py-12" />
```

---

## 📚 Recursos

- **Origin UI**: https://coss.com/origin
- **Untitled UI**: https://www.untitledui.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## ✅ Compatibilidad

- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS v3
- ✅ Dark mode
- ✅ Responsive
- ✅ Accesible
