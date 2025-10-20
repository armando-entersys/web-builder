# 🚀 Guía de Despliegue con Docker

Esta guía explica cómo desplegar Web Builder usando Docker y Docker Compose.

## 📋 Requisitos

- Docker 20.10 o superior
- Docker Compose 2.0 o superior
- Git

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd web-builder
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@postgres:5432/webbuilder?schema=public"

# AI APIs
OPENAI_API_KEY="tu-api-key-de-openai"
ANTHROPIC_API_KEY="tu-api-key-de-anthropic"
GOOGLE_AI_API_KEY="tu-api-key-de-google"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="production"
```

**IMPORTANTE**: Reemplaza las API keys con tus propias keys:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google AI: https://aistudio.google.com/app/apikey

## 🐳 Despliegue con Docker Compose

### Opción 1: Despliegue Rápido (Recomendado)

Ejecuta todo con un solo comando:

```bash
docker-compose up -d --build
```

Este comando:
1. Construye la imagen de Docker para la aplicación
2. Inicia PostgreSQL en segundo plano
3. Espera a que PostgreSQL esté listo
4. Inicia la aplicación Next.js

### Opción 2: Paso a Paso

Si prefieres tener más control:

```bash
# 1. Construir la imagen
docker-compose build

# 2. Iniciar los servicios
docker-compose up -d

# 3. Ver los logs
docker-compose logs -f
```

## 📊 Verificar el Despliegue

### Ver el estado de los contenedores:

```bash
docker-compose ps
```

Deberías ver algo como:

```
NAME                IMAGE               STATUS              PORTS
webbuilder-app      web-builder-web     Up 30 seconds       0.0.0.0:3000->3000/tcp
webbuilder-db       postgres:16-alpine  Up 1 minute         0.0.0.0:5432->5432/tcp
```

### Acceder a la aplicación:

Abre tu navegador en: **http://localhost:3000/dashboard/sitemap**

### Ver los logs:

```bash
# Todos los servicios
docker-compose logs -f

# Solo la aplicación
docker-compose logs -f web

# Solo la base de datos
docker-compose logs -f postgres
```

## 🗄️ Inicializar la Base de Datos

Si es la primera vez que despliegas, necesitas ejecutar las migraciones de Prisma:

```bash
# Ejecutar dentro del contenedor
docker-compose exec web npx prisma migrate deploy

# O generar el cliente de Prisma
docker-compose exec web npx prisma generate
```

## 🔄 Actualizar el Código

Cuando hagas cambios en el código:

```bash
# 1. Detener los contenedores
docker-compose down

# 2. Reconstruir la imagen
docker-compose build

# 3. Iniciar de nuevo
docker-compose up -d
```

## 🛑 Detener los Servicios

```bash
# Detener pero mantener los datos
docker-compose stop

# Detener y eliminar contenedores (mantiene volúmenes)
docker-compose down

# Detener y eliminar TODO (incluye base de datos)
docker-compose down -v
```

## 📦 Volúmenes

Docker Compose crea volúmenes para persistir datos:

- `postgres_data`: Datos de PostgreSQL
- `node_modules`: Dependencias de Node.js

### Ver volúmenes:

```bash
docker volume ls | grep webbuilder
```

### Hacer backup de la base de datos:

```bash
docker-compose exec postgres pg_dump -U postgres webbuilder > backup.sql
```

### Restaurar backup:

```bash
docker-compose exec -T postgres psql -U postgres webbuilder < backup.sql
```

## 🌐 Despliegue en Servidor Remoto

### 1. En tu máquina local (Windows):

```bash
# Verificar que Git está configurado
git remote -v

# Si no hay remote, agregar uno (GitHub, GitLab, Bitbucket, etc.)
git remote add origin https://github.com/tu-usuario/web-builder.git

# Subir el código
git push -u origin master
```

### 2. En el servidor (Linux):

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/web-builder.git
cd web-builder

# Crear archivo .env con tus API keys
nano .env

# Desplegar
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

### 3. Configurar Firewall (si es necesario):

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp

# CentOS/RHEL
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### 4. Configurar Nginx como Reverse Proxy (Opcional):

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Troubleshooting

### Error: "port 3000 is already in use"

```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambia 3000 por otro puerto
```

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar el servicio
docker-compose restart postgres
```

### Error: "API key not found"

Verifica que el archivo `.env` existe y tiene las API keys correctas:

```bash
cat .env
```

### Limpiar todo y empezar de nuevo:

```bash
# Detener todo
docker-compose down -v

# Eliminar imágenes
docker rmi web-builder-web

# Limpiar cache de Docker
docker system prune -a

# Volver a construir
docker-compose up -d --build
```

## 📈 Monitoreo

### Ver uso de recursos:

```bash
docker stats
```

### Inspeccionar un contenedor:

```bash
docker inspect webbuilder-app
```

### Acceder a un contenedor:

```bash
# Aplicación
docker-compose exec web sh

# Base de datos
docker-compose exec postgres psql -U postgres webbuilder
```

## 🚀 Optimizaciones para Producción

1. **Configurar HTTPS**: Usa Let's Encrypt con Certbot
2. **CDN**: Configura CloudFlare o similar
3. **Backup automático**: Configura cron jobs para backups diarios
4. **Monitoreo**: Usa Prometheus + Grafana o similar
5. **Logs**: Configura rotación de logs con Docker logging drivers

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica variables de entorno
3. Asegúrate de tener las últimas versiones de Docker y Docker Compose
4. Consulta la documentación de Next.js 15

---

Última actualización: 2025-10-19
