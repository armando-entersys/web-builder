# 🌱 Datos Semilla (Seed Data)

## Inicio Rápido

### Windows
```bash
seed.bat
```

### Linux/macOS
```bash
./seed.sh
```

O manualmente:
```bash
cd packages/db
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:push
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:seed
```

## 🔑 Credenciales de Prueba

Después de ejecutar el seed, puedes iniciar sesión con estas cuentas:

| Rol | Email | Password | Proyectos |
|-----|-------|----------|-----------|
| **Admin** | admin@webbuilder.com | admin123 | Ve TODOS (7 proyectos) |
| **Usuario** | user1@example.com | user123 | Solo los suyos (2 proyectos) |
| **Usuario** | user2@example.com | user123 | Solo los suyos (1 proyecto) |
| **Editor** | editor@webbuilder.com | editor123 | Solo los suyos (1 proyecto) |

## 📊 Datos Incluidos

### 4 Usuarios
- 1 Admin (ve todos los proyectos)
- 2 Usuarios regulares (ven solo sus proyectos)
- 1 Editor

### 7 Proyectos
- Corporate Website
- E-commerce Platform
- Personal Portfolio
- Blog Platform
- Restaurant Website
- Marketing Landing Pages

### 6 Páginas
Con contenido de ejemplo estructurado en JSON

## ⚠️ Prerequisitos

1. **PostgreSQL debe estar corriendo** en `localhost:5432`

   Con Docker:
   ```bash
   docker run --name webbuilder-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=webbuilder -p 5432:5432 -d postgres:14
   ```

2. **La base de datos debe existir**: `webbuilder`

   Si no existe:
   ```bash
   psql -U postgres -c "CREATE DATABASE webbuilder;"
   ```

## 🎯 Probar el Sistema

1. Ejecuta el seed (usando `seed.bat` o `seed.sh`)

2. Inicia la app:
   ```bash
   cd apps/web
   pnpm dev
   ```

3. Ve a http://localhost:3007

4. Inicia sesión con diferentes usuarios para ver el control de acceso:
   - Como **admin@webbuilder.com**: Verás TODOS los 7 proyectos
   - Como **user1@example.com**: Verás solo 2 proyectos (Personal Portfolio y Blog Platform)
   - Como **user2@example.com**: Verás solo 1 proyecto (Restaurant Website)

## 🔄 Re-ejecutar el Seed

El script **limpia automáticamente** todos los datos antes de insertar los nuevos, así que puedes ejecutarlo múltiples veces sin problemas.

## 📖 Más Información

Ver `SEED_INSTRUCTIONS.md` para instrucciones detalladas y troubleshooting.
