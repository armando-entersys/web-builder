# 🚀 Próximos Pasos - Web Builder

## ✅ Completado

### Estructura Base
- [x] Monorepo configurado (Turborepo + pnpm)
- [x] 10+ componentes copiados de React Bits
- [x] Next.js 15 app inicializada
- [x] Configuración TypeScript
- [x] Estructura de carpetas del proyecto

### Componentes Disponibles
**Backgrounds**: Aurora, Particles, Waves
**Animations**: AnimatedContent, FadeContent, Magnet
**Components**: Stack, BounceCards, Carousel, Dock
**Text**: BlurText, GlitchText

---

## 📋 Pendiente

### 1. Instalación de Dependencias (Siguiente paso inmediato)

```bash
cd /c/web-builder

# Install root dependencies
pnpm install

# Verificar estructura
pnpm list --depth=0
```

### 2. Configuración de Packages Adicionales

#### A. Package API (tRPC)
```bash
cd packages/api
# Crear estructura tRPC
```

**Archivos a crear**:
- `packages/api/package.json`
- `packages/api/src/index.ts`
- `packages/api/src/routers/sitemap.router.ts`
- `packages/api/src/routers/content.router.ts`

#### B. Package DB (Prisma)
```bash
cd packages/db
# Inicializar Prisma
```

**Archivos a crear**:
- `packages/db/package.json`
- `packages/db/prisma/schema.prisma`
- `packages/db/src/client.ts`

**Schema inicial**:
```prisma
model Project {
  id        String   @id @default(cuid())
  name      String
  sitemap   Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### C. Package AI (LLM Orchestration)
```bash
cd packages/ai
```

**Archivos a crear**:
- `packages/ai/package.json`
- `packages/ai/src/orchestrator.ts`
- `packages/ai/src/providers/openai.ts`
- `packages/ai/src/providers/anthropic.ts`
- `packages/ai/src/providers/google.ts`

### 3. Desarrollo del Módulo 1: Sitemap Builder (MVP)

**Componentes a crear**:
```
apps/web/app/(dashboard)/sitemap/
├── page.tsx                    # Página principal
├── components/
│   ├── SitemapCanvas.tsx      # Canvas drag & drop
│   ├── NodeEditor.tsx         # Editor de nodos
│   ├── AIAssistant.tsx        # Chat con IA
│   └── TemplateLibrary.tsx    # Biblioteca de templates
```

**Librerías necesarias**:
- `@xyflow/react` (para el canvas drag & drop)
- `zustand` (para state management)
- `@tanstack/react-query` (para cache)

### 4. Configuración de Variables de Entorno

Crear `.env.local` en `apps/web/`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/webbuilder"

# AI APIs
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Testing Inicial

```bash
# Desde la raíz del proyecto
pnpm dev

# Debería abrir:
# http://localhost:3000 → Homepage con Aurora background
```

---

## 🎯 Roadmap de Desarrollo (Semanas 1-4)

### Semana 1: Setup & Infraestructura ✅
- [x] Monorepo
- [x] Next.js app
- [x] Componentes base
- [ ] Instalación de dependencias
- [ ] Prisma setup
- [ ] Variables de entorno

### Semana 2: Módulo Sitemap Builder (UI)
- [ ] Canvas con react-flow
- [ ] CRUD de nodos
- [ ] Templates básicos (5)
- [ ] Persistencia local (localStorage)

### Semana 3: Integración IA (Fase 1)
- [ ] Setup Vercel AI SDK
- [ ] Integración OpenAI
- [ ] Generación de sitemap con IA
- [ ] Prompts templates

### Semana 4: Refinamiento & Testing
- [ ] Guardar en DB (Prisma)
- [ ] Export a JSON
- [ ] UI/UX improvements
- [ ] Testing básico

---

## 📚 Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Run all apps in dev mode
pnpm dev --filter web       # Run only web app

# Build
pnpm build                  # Build all packages
pnpm build --filter web     # Build only web app

# Linting
pnpm lint                   # Lint all packages
pnpm format                 # Format all files

# Database
cd packages/db
pnpm prisma generate        # Generate Prisma Client
pnpm prisma migrate dev     # Run migrations
pnpm prisma studio          # Open Prisma Studio

# Clean
pnpm clean                  # Remove all node_modules
```

---

## 🔧 Troubleshooting

### Error: Cannot find module '@repo/ui'
```bash
# Asegúrate de instalar dependencias desde la raíz
pnpm install
```

### Error: Tailwind CSS no funciona
```bash
# Verifica que @tailwindcss/vite esté instalado
cd apps/web
pnpm add -D @tailwindcss/vite
```

### Error: React Bits components not found
```bash
# Verifica que los componentes estén exportados en packages/ui/src/index.ts
```

---

## 💡 Tips de Desarrollo

1. **Usa Turbopack**: Está habilitado por defecto (`--turbopack`)
2. **Hot Reload**: Los cambios en packages/ se reflejan automáticamente
3. **Type Safety**: TypeScript está configurado estrictamente
4. **Componentes**: Importa desde `@repo/ui` no desde rutas relativas

---

## 📞 Recursos

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

**Última actualización**: 2025-10-19
**Siguiente tarea**: `pnpm install` en `/c/web-builder`
