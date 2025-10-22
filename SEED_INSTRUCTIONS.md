# 🌱 Instrucciones para Seed de Base de Datos

## Datos Semilla Creados

Se ha creado un script completo de seed en `packages/db/prisma/seed.ts` que incluye:

### 👥 Usuarios (4 usuarios con diferentes roles)

1. **Admin User**
   - Email: `admin@webbuilder.com`
   - Password: `admin123`
   - Role: ADMIN
   - Puede ver y editar todos los proyectos

2. **John Doe (User 1)**
   - Email: `user1@example.com`
   - Password: `user123`
   - Role: USER
   - Solo ve sus propios proyectos

3. **Jane Smith (User 2)**
   - Email: `user2@example.com`
   - Password: `user123`
   - Role: USER
   - Solo ve sus propios proyectos

4. **Editor User**
   - Email: `editor@webbuilder.com`
   - Password: `editor123`
   - Role: EDITOR
   - Puede editar proyectos compartidos

### 📁 Proyectos (7 proyectos en total)

**Admin (2 proyectos):**
- Corporate Website - Website corporativo moderno con optimización AI
- E-commerce Platform - Tienda online completa

**User 1 - John Doe (2 proyectos):**
- Personal Portfolio - Showcase de trabajo y habilidades
- Blog Platform - Blog de tecnología con recomendaciones AI

**User 2 - Jane Smith (1 proyecto):**
- Restaurant Website - Website para restaurante local

**Editor (1 proyecto):**
- Marketing Landing Pages - Colección de landing pages de alta conversión

### 📄 Páginas (6 páginas con contenido de ejemplo)

Cada proyecto tiene páginas con secciones estructuradas en JSON que incluyen:
- Heroes
- Features
- Text sections
- Grids
- Lists

## 🚀 Cómo Ejecutar el Seed

### Prerequisitos

1. **Iniciar PostgreSQL**

   Asegúrate de que PostgreSQL esté corriendo en `localhost:5432`

   **Windows:**
   ```bash
   # Si tienes PostgreSQL como servicio
   net start postgresql-x64-14

   # O inicia desde pgAdmin
   ```

   **macOS:**
   ```bash
   brew services start postgresql@14
   ```

   **Linux:**
   ```bash
   sudo systemctl start postgresql
   ```

   **Docker:**
   ```bash
   docker run --name webbuilder-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=webbuilder -p 5432:5432 -d postgres:14
   ```

### Pasos para ejecutar el seed

1. **Crear las tablas en la base de datos:**
   ```bash
   cd packages/db
   DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:push
   ```

2. **Ejecutar el script de seed:**
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:seed
   ```

   O desde la raíz del proyecto:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm --filter @repo/db db:seed
   ```

### Verificar que funcionó

Verás un output como este:

```
🌱 Starting database seed...
🗑️  Cleaning existing data...
👥 Creating users...
✅ Admin created: admin@webbuilder.com
✅ User 1 created: user1@example.com
✅ User 2 created: user2@example.com
✅ Editor created: editor@webbuilder.com
📁 Creating projects...
✅ Admin project 1 created: Corporate Website
✅ Admin project 2 created: E-commerce Platform
✅ User 1 project created: Personal Portfolio
✅ User 1 project 2 created: Blog Platform
✅ User 2 project created: Restaurant Website
✅ Editor project created: Marketing Landing Pages
📄 Creating pages...
✅ Page created: Home (Corporate Website)
✅ Page created: About Us (Corporate Website)
✅ Page created: Products (E-commerce Platform)
✅ Page created: Home (Personal Portfolio)
✅ Page created: Projects (Personal Portfolio)
✅ Page created: Menu (Restaurant Website)

📊 Seed Summary:
   Users: 4
   Projects: 7
   Pages: 6

🎉 Database seeded successfully!

📝 Test Credentials:
   Admin:  admin@webbuilder.com / admin123
   User 1: user1@example.com / user123
   User 2: user2@example.com / user123
   Editor: editor@webbuilder.com / editor123
```

## 🧪 Probar el Sistema

1. **Iniciar la aplicación:**
   ```bash
   cd apps/web
   pnpm dev
   ```

2. **Probar Login:**
   - Ve a http://localhost:3007/auth/login
   - Inicia sesión con cualquiera de las credenciales arriba

3. **Verificar Control de Acceso:**

   **Como Usuario Regular (user1@example.com):**
   - Deberías ver solo 2 proyectos (Personal Portfolio y Blog Platform)
   - NO puedes ver proyectos de otros usuarios

   **Como Admin (admin@webbuilder.com):**
   - Deberías ver TODOS los 7 proyectos
   - Puedes editar cualquier proyecto

4. **Probar Creación de Proyecto:**
   - Crea un nuevo proyecto
   - Verifica que se guarde en la base de datos
   - Cierra sesión e inicia con otro usuario
   - Verifica que NO veas el proyecto del otro usuario

## 🔧 Troubleshooting

### Error: Can't reach database server

**Problema:** PostgreSQL no está corriendo

**Solución:**
```bash
# Verificar si PostgreSQL está corriendo
# Windows
tasklist | findstr postgres

# macOS/Linux
ps aux | grep postgres

# Docker
docker ps | grep postgres
```

### Error: database "webbuilder" does not exist

**Solución:**
```bash
# Conectarse a PostgreSQL y crear la base de datos
psql -U postgres
CREATE DATABASE webbuilder;
\q

# O con Docker
docker exec -it webbuilder-postgres psql -U postgres -c "CREATE DATABASE webbuilder;"
```

### Resetear la base de datos

Si necesitas empezar de nuevo:

```bash
cd packages/db

# Opción 1: Resetear y re-ejecutar seed
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:push --force-reset
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:seed

# Opción 2: Solo re-ejecutar seed (limpia automáticamente)
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public" pnpm db:seed
```

## 📝 Notas

- El script de seed **limpia automáticamente** todos los datos existentes antes de insertar los nuevos
- Todas las contraseñas están hasheadas con bcrypt (12 rounds)
- Los timestamps de creación varían para simular proyectos creados en diferentes fechas
- El contenido de las páginas está en formato JSON estructurado
- Los IDs se generan automáticamente usando CUID

## 🎯 Próximos Pasos

Después de ejecutar el seed exitosamente:

1. ✅ Probar el login con diferentes usuarios
2. ✅ Verificar el control de acceso por roles
3. ✅ Crear nuevos proyectos y páginas
4. ✅ Probar la edición de componentes en el builder
5. ✅ Implementar la funcionalidad de guardado desde el builder a la BD
6. ⏳ Crear el panel de administración
7. ⏳ Implementar exportación a React
