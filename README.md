# 🚀 Web Builder - AI-Powered Web Page Creator

Plataforma AI-first para creación de páginas web optimizadas para buscadores conversacionales.

## 📁 Estructura del Proyecto

```
web-builder/
├── apps/
│   └── web/                    # Next.js 15 App
├── packages/
│   ├── ui/                     # Component Library (React Bits)
│   ├── api/                    # tRPC API
│   ├── db/                     # Prisma + PostgreSQL
│   ├── ai/                     # AI Orchestration
│   └── design-tokens/          # Design System Tokens
└── tooling/                    # Shared configs
```

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS 4.0
- **Backend**: tRPC v11 + Prisma 6 + PostgreSQL 16
- **IA**: Vercel AI SDK + GPT-4o + Claude 3.7 + Gemini 2.0
- **Monorepo**: Turborepo + pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+

### Installation

```bash
# Install dependencies
pnpm install

# Setup database
cd packages/db
pnpm db:push

# Run development server
pnpm dev
```

## 📚 Documentation

Ver [ARCHITECTURE_PLAN_2025.md](../Reactbits/ARCHITECTURE_PLAN_2025.md) para arquitectura completa.

## 🏗️ Estado del Proyecto

### Fase 1: Fundamentos (En Progreso)
- [x] Estructura de monorepo
- [x] Componentes base de React Bits
- [ ] Next.js 15 App
- [ ] tRPC Setup
- [ ] Prisma Setup
- [ ] AI Integration

## 📄 License

MIT
