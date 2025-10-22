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
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env and add your API keys and database URL

# 3. Start PostgreSQL (choose one):
# Option A: With Docker
docker run --name webbuilder-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=webbuilder \
  -p 5432:5432 -d postgres:14

# Option B: Use your local PostgreSQL installation
# Make sure it's running on localhost:5432

# 4. Setup database and seed data
pnpm db:push
pnpm db:seed

# Or use the convenience scripts:
# Windows: seed.bat
# Linux/macOS: ./seed.sh

# 5. Run development server
pnpm dev
# App will be available at http://localhost:3007
```

### 🌱 Test Credentials (after seeding)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@webbuilder.com | admin123 | All projects |
| User | user1@example.com | user123 | Own projects only |
| User | user2@example.com | user123 | Own projects only |
| Editor | editor@webbuilder.com | editor123 | Own projects only |

See [README_SEED.md](README_SEED.md) for more details about seed data.

## 🐳 Docker Deployment

### Quick Docker Deploy

```bash
# 1. Configure environment
cp .env.docker .env
# Edit .env with your API keys

# 2. Deploy
./deploy.sh  # Linux/macOS
deploy.bat   # Windows

# Or manually:
docker-compose up -d --build
```

### Access Application

- **App**: http://localhost:3000
- **Database**: localhost:5432

See [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md) for complete Docker deployment guide.

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
