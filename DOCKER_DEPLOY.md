# 🐳 Docker Deployment Guide

Guía completa para desplegar Web Builder usando Docker y Docker Compose.

## 📋 Prerequisites

- Docker 24+ instalado
- Docker Compose 2+ instalado
- Git (para clonar el repositorio)

## 🚀 Quick Start

### 1. Clonar el Repositorio

```bash
git clone https://github.com/armando-entersys/web-builder.git
cd web-builder
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.docker .env

# Editar con tus valores
nano .env  # o usa tu editor favorito
```

**Variables requeridas en `.env`:**

```env
# AI API Keys (requeridas)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# NextAuth Secret (generar con: openssl rand -base64 32)
AUTH_SECRET=tu-secret-aqui

# NextAuth URL (cambiar para producción)
NEXTAUTH_URL=http://localhost:3000

# Opcional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database seeding (true para poblar con datos de prueba)
SEED_DB=true
```

### 3. Generar AUTH_SECRET

```bash
openssl rand -base64 32
```

Copia el resultado y pégalo en tu archivo `.env` como `AUTH_SECRET`.

### 4. Iniciar los Servicios

```bash
# Build y start en modo detached
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver logs solo de la app
docker-compose logs -f web

# Ver logs solo de la base de datos
docker-compose logs -f postgres
```

### 5. Acceder a la Aplicación

Una vez que los contenedores estén corriendo:

- **Aplicación**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## 🔑 Credenciales de Prueba

Si configuraste `SEED_DB=true`, tendrás estos usuarios pre-cargados:

| Rol | Email | Password | Acceso |
|-----|-------|----------|--------|
| Admin | admin@webbuilder.com | admin123 | Todos los proyectos |
| User | user1@example.com | user123 | Solo sus proyectos |
| User | user2@example.com | user123 | Solo sus proyectos |
| Editor | editor@webbuilder.com | editor123 | Solo sus proyectos |

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

### Base de Datos

```bash
# Ejecutar comando en el contenedor de PostgreSQL
docker-compose exec postgres psql -U postgres -d webbuilder

# Backup de la base de datos
docker-compose exec postgres pg_dump -U postgres webbuilder > backup.sql

# Restaurar base de datos
docker-compose exec -T postgres psql -U postgres webbuilder < backup.sql

# Re-seed la base de datos (desde el contenedor de la app)
docker-compose exec web sh -c "cd /app/packages/db && pnpm db:seed"
```

### Mantenimiento de la App

```bash
# Rebuild sin cache
docker-compose build --no-cache

# Ver logs de errores
docker-compose logs --tail=100 web

# Acceder al shell del contenedor
docker-compose exec web sh

# Ver uso de recursos
docker stats
```

## 📦 Arquitectura de Contenedores

```
┌─────────────────────────────────────────┐
│          webbuilder-app                 │
│    (Next.js 15 + React 19)              │
│    Port: 3000                           │
└──────────────┬──────────────────────────┘
               │
               │ DATABASE_URL
               │
┌──────────────▼──────────────────────────┐
│          webbuilder-db                  │
│    (PostgreSQL 16)                      │
│    Port: 5432                           │
│    Volume: postgres_data                │
└─────────────────────────────────────────┘
```

## 🔧 Configuración Avanzada

### Cambiar Puertos

Edita `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "8080:3000"  # Cambiar 8080 por el puerto que quieras

  postgres:
    ports:
      - "5433:5432"  # Cambiar 5433 por el puerto que quieras
```

### Usar Base de Datos Externa

Si ya tienes PostgreSQL corriendo:

1. Comenta el servicio `postgres` en `docker-compose.yml`
2. Actualiza `DATABASE_URL` en `.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

3. Elimina la dependencia en el servicio web:

```yaml
services:
  web:
    # depends_on:  # Comentar esta sección
    #   postgres:
    #     condition: service_healthy
```

### Production Build Optimizations

Para producción, considera:

1. **Usar secrets de Docker** en lugar de variables de entorno:

```yaml
services:
  web:
    secrets:
      - db_password
      - auth_secret
    environment:
      DATABASE_URL: postgresql://postgres:run/secrets/db_password@postgres:5432/webbuilder
```

2. **Configurar recursos límite**:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

3. **Configurar health checks**:

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 🌐 Deploy en Servidor Remoto

### Deploy con SSH

```bash
# En tu servidor
git clone https://github.com/armando-entersys/web-builder.git
cd web-builder

# Configurar .env
cp .env.docker .env
nano .env

# Iniciar
docker-compose up -d --build
```

### Deploy con Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml webbuilder

# Ver servicios
docker service ls

# Ver logs
docker service logs -f webbuilder_web
```

### Deploy con Kubernetes

Ver `k8s/` directory para manifiestos de Kubernetes (próximamente).

## 🔐 Seguridad en Producción

1. **Cambiar credenciales por defecto**:
   - Cambiar password de PostgreSQL en `docker-compose.yml`
   - Generar nuevo `AUTH_SECRET`
   - No usar `SEED_DB=true` en producción

2. **Usar HTTPS**:
   - Configurar reverse proxy (Nginx/Traefik)
   - Obtener certificado SSL (Let's Encrypt)
   - Actualizar `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL`

3. **Configurar firewall**:
   - Cerrar puerto 5432 (PostgreSQL) al público
   - Solo exponer puerto 80/443 (HTTP/HTTPS)

4. **Backups automáticos**:

```bash
# Crear cron job para backup diario
0 2 * * * cd /path/to/web-builder && docker-compose exec -T postgres pg_dump -U postgres webbuilder > /backups/webbuilder-$(date +\%Y\%m\%d).sql
```

## 📊 Monitoring

### Ver uso de recursos

```bash
docker stats webbuilder-app webbuilder-db
```

### Logs de producción

```bash
# Ver últimas 100 líneas
docker-compose logs --tail=100

# Seguir logs en vivo
docker-compose logs -f

# Filtrar por servicio
docker-compose logs -f web
```

## 🐛 Troubleshooting

### La app no inicia

```bash
# Ver logs completos
docker-compose logs web

# Verificar variables de entorno
docker-compose exec web env | grep DATABASE_URL

# Verificar conectividad a la BD
docker-compose exec web sh -c "apk add postgresql-client && psql \$DATABASE_URL -c 'SELECT 1'"
```

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar solo PostgreSQL
docker-compose restart postgres
```

### Rebuild completo

```bash
# Detener todo
docker-compose down

# Limpiar imágenes viejas
docker system prune -a

# Rebuild desde cero
docker-compose up -d --build --force-recreate
```

### Reset completo (CUIDADO: Borra todo)

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose rm -f

# Rebuild y start
docker-compose up -d --build
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Guide](https://hub.docker.com/_/postgres)

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica variables de entorno en `.env`
3. Asegúrate de que los puertos 3000 y 5432 estén disponibles
4. Abre un issue en GitHub: https://github.com/armando-entersys/web-builder/issues
