# Web Builder - Guía de Despliegue a Producción

## Información del Servidor

| Campo | Valor |
|-------|-------|
| **Servidor** | `prod-server` |
| **IP** | `34.59.193.54` |
| **Zona GCP** | `us-central1-c` |
| **Proyecto GCP** | `mi-infraestructura-web` |
| **Dominio** | `https://web-builder.scram2k.com` |
| **Ruta en servidor** | `/srv/servicios/web-builder` |

## Prerequisitos

1. **Google Cloud SDK** instalado y configurado
2. Acceso SSH al servidor via `gcloud compute ssh`
3. Permisos de escritura en el repositorio GitHub

## Proceso de Despliegue

### Paso 1: Hacer Push de Cambios Locales

```bash
# Desde la carpeta del proyecto local
cd C:\web-builder

# Verificar estado de git
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "descripción del cambio"

# Push al repositorio
git push origin master
```

### Paso 2: Actualizar Código en el Servidor

```bash
# Conectar al servidor y hacer pull
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && git pull origin master"
```

### Paso 3: Construir Imagen Docker

```bash
# Construir imagen (puede tomar 3-5 minutos)
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose build --no-cache"
```

### Paso 4: Iniciar Contenedores

```bash
# Iniciar servicios
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose up -d"

# Verificar estado
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose ps"
```

### Paso 5: Inicializar Base de Datos (Solo primera vez)

Si es un despliegue nuevo o la base de datos está vacía:

```bash
# Verificar si hay tablas
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose exec -T postgres psql -U postgres -d webbuilder -c '\\dt'"

# Si no hay tablas, ejecutar el script de inicialización
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose exec -T postgres psql -U postgres -d webbuilder -f /dev/stdin < packages/db/prisma/init.sql"
```

O alternativamente, usar Prisma localmente con la URL de producción para crear las tablas.

### Paso 6: Verificar Despliegue

```bash
# Verificar que la aplicación responde
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://web-builder.scram2k.com

# Ver logs
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose logs --tail=50"
```

## Comandos de Despliegue Completo (Una Línea)

```bash
# Despliegue completo desde local
git push origin master && gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && git pull origin master && docker compose build --no-cache && docker compose up -d && docker compose ps"
```

## Comandos Útiles

### Ver Logs en Tiempo Real
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose logs -f"
```

### Reiniciar Servicios
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose restart"
```

### Detener Servicios
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose down"
```

### Ver Estado de Contenedores
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="docker ps | grep web-builder"
```

### Ejecutar Migraciones de Base de Datos
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose exec web npx prisma migrate deploy"
```

### Acceder al Contenedor
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="cd /srv/servicios/web-builder && docker compose exec web sh"
```

## Solución de Problemas

### Error: Permission Denied en Git
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="sudo chown -R \$USER:\$USER /srv/servicios/web-builder"
```

### Error: Safe Directory
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="git config --global --add safe.directory /srv/servicios/web-builder"
```

### Limpiar Imágenes Docker Antiguas
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="docker system prune -af"
```

### Ver Uso de Disco
```bash
gcloud compute ssh prod-server --zone=us-central1-c --command="df -h /"
```

## Estructura del Proyecto en Producción

```
/srv/servicios/web-builder/
├── .env                    # Variables de entorno (configurar manualmente)
├── docker-compose.yml      # Configuración Docker
├── Dockerfile              # Imagen de la aplicación
├── apps/web/               # Aplicación Next.js
├── packages/
│   ├── ai/                 # Paquete de IA
│   ├── db/                 # Prisma ORM
│   └── ui/                 # Componentes UI
└── ...
```

## Variables de Entorno Requeridas (.env)

```env
# Base de datos
DATABASE_URL=postgresql://postgres:password@postgres:5432/webbuilder
POSTGRES_PASSWORD=tu_password_seguro

# Auth
AUTH_SECRET=tu_secret_seguro
NEXTAUTH_URL=https://web-builder.scram2k.com
AUTH_TRUST_HOST=true

# API Keys (opcionales para funciones de IA)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# Producción
NODE_ENV=production
PORT=3000
```

## Notas Importantes

1. **Siempre hacer pull antes de build** - El servidor tiene su propia copia del código
2. **El build puede tardar 3-5 minutos** - Es normal, Next.js compila todo el proyecto
3. **Los volúmenes de Docker persisten** - Los datos de PostgreSQL no se pierden al reconstruir
4. **Traefik maneja SSL** - Los certificados se renuevan automáticamente con Let's Encrypt
5. **La red es `traefik-public`** - Se conecta al reverse proxy existente en el servidor

---

*Última actualización: 2026-01-30*
*Generado durante despliegue con Claude Code*
