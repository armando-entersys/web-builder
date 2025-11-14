# Sistema de Logging con Rotación

Este documento describe el sistema completo de logging implementado en Web Builder, incluyendo logging del servidor, frontend y Docker.

## Características

- ✅ Logging centralizado con Winston
- ✅ Rotación automática diaria de logs
- ✅ Logs del frontend enviados al servidor
- ✅ Rotación de logs de Docker
- ✅ Diferentes niveles de log (error, warn, info, http, debug)
- ✅ Persistencia de logs con volúmenes Docker
- ✅ API para visualización de logs
- ✅ Retención configurable de logs

## Estructura de Logs

### Logs del Servidor

Los logs del servidor se almacenan en `./logs/` con rotación diaria:

- **`error-YYYY-MM-DD.log`**: Solo errores (se mantienen 14 días)
- **`combined-YYYY-MM-DD.log`**: Todos los logs (se mantienen 30 días)
- **`http-YYYY-MM-DD.log`**: Requests HTTP (se mantienen 7 días)

### Configuración de Rotación

```typescript
// lib/logger.ts
const errorFileRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',      // Máximo 20MB por archivo
  maxFiles: '14d',     // Mantener 14 días
})
```

## Uso en el Servidor

### 1. Logging Básico

```typescript
import { log } from '@/lib/logger'

// Diferentes niveles
log.error('Error message', { context: 'details' })
log.warn('Warning message')
log.info('Info message')
log.http('HTTP request')
log.debug('Debug message')
```

### 2. Logging de Requests HTTP

```typescript
import { logRequest } from '@/lib/logger'

logRequest(
  'POST',
  '/api/projects',
  200,
  145, // duration in ms
  'user-id',
  '192.168.1.1'
)
```

### 3. Logging de Errores con Contexto

```typescript
import { logError } from '@/lib/logger'

try {
  // ... código
} catch (error) {
  logError(error as Error, {
    userId: 'user-123',
    action: 'create-project',
  })
}
```

### 4. Middleware de API

```typescript
import { apiLogger } from '@/lib/api-logger-middleware'

export const GET = apiLogger(async (req) => {
  // Tu código aquí
  return NextResponse.json({ data: 'example' })
})
```

## Uso en el Frontend

### 1. Logging Básico

```typescript
import { clientLogger } from '@/lib/client-logger'

// En cualquier componente o función
clientLogger.error('Client error', { detail: 'info' })
clientLogger.warn('Warning')
clientLogger.info('Information')
clientLogger.debug('Debug info') // Solo en development
```

### 2. Logging Automático de Errores

El cliente logger captura automáticamente:

- Errores globales de JavaScript
- Promise rejections no manejados
- Errores de React Error Boundary

### 3. Logging de Acciones de Usuario

```typescript
clientLogger.logUserAction('click-button', {
  buttonId: 'submit-form',
  page: '/dashboard',
})
```

### 4. Logging de API Calls

```typescript
const startTime = Date.now()
try {
  const response = await fetch('/api/data')
  const duration = Date.now() - startTime
  clientLogger.logApiCall('/api/data', 'GET', true, duration)
} catch (error) {
  const duration = Date.now() - startTime
  clientLogger.logApiCall('/api/data', 'GET', false, duration, error.message)
}
```

### 5. Logging de Performance

```typescript
clientLogger.logPerformance('page-load', performance.now(), {
  page: window.location.pathname,
})
```

### 6. Error Boundary

```typescript
import { logErrorBoundary } from '@/lib/client-logger'

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logErrorBoundary(error, errorInfo)
  }
}
```

## Visualización de Logs

### API Endpoints

#### 1. Ver Logs

```bash
GET /api/logs/view?type=combined&date=2025-01-14&lines=100&level=error
```

Parámetros:
- `type`: Tipo de log (combined, error, http) - default: combined
- `date`: Fecha en formato YYYY-MM-DD - default: hoy
- `lines`: Número de líneas a retornar - default: 100
- `level`: Filtrar por nivel (error, warn, info, http, debug) - opcional

Respuesta:
```json
{
  "success": true,
  "logs": [
    {
      "timestamp": "2025-01-14 10:30:45",
      "level": "error",
      "message": "Error message",
      "metadata": {...}
    }
  ],
  "count": 50,
  "file": "combined-2025-01-14.log"
}
```

#### 2. Listar Archivos de Log

```bash
POST /api/logs/view
```

Respuesta:
```json
{
  "success": true,
  "files": [
    {
      "type": "combined",
      "date": "2025-01-14",
      "filename": "combined-2025-01-14.log"
    }
  ]
}
```

## Docker Logging

### Configuración de Rotación

En `docker-compose.prod.yml`:

```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "20m"     # Máximo 20MB por archivo
        max-file: "10"      # Mantener 10 archivos
        labels: "service=web"
        tag: "{{.Name}}/{{.ID}}"

  postgres:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"     # Máximo 10MB por archivo
        max-file: "5"       # Mantener 5 archivos
        labels: "service=postgres"
```

### Ver Logs de Docker

```bash
# Ver logs del contenedor web
docker compose -f docker-compose.prod.yml logs -f web

# Ver logs del contenedor postgres
docker compose -f docker-compose.prod.yml logs -f postgres

# Ver últimas 100 líneas
docker compose -f docker-compose.prod.yml logs --tail=100 web

# Ver logs desde una fecha específica
docker compose -f docker-compose.prod.yml logs --since="2025-01-14T10:00:00" web
```

## Niveles de Log

| Nivel | Descripción | Uso Recomendado |
|-------|-------------|-----------------|
| **error** | Errores que requieren atención inmediata | Excepciones, fallos críticos |
| **warn** | Advertencias que pueden indicar problemas | Deprecations, límites alcanzados |
| **info** | Información general del sistema | Inicio de servicios, acciones importantes |
| **http** | Logs de requests HTTP | Todas las peticiones HTTP |
| **debug** | Información detallada para debugging | Solo en desarrollo |

## Configuración de Entorno

### Variables de Entorno

```bash
# Nivel de log (error, warn, info, http, debug)
LOG_LEVEL=info

# En desarrollo, se logea también a consola
NODE_ENV=development
```

## Mejores Prácticas

### 1. Usar el Nivel Apropiado

```typescript
// ❌ Incorrecto
log.error('User clicked button') // Demasiado severo

// ✅ Correcto
log.info('User clicked button') // Nivel apropiado
```

### 2. Incluir Contexto

```typescript
// ❌ Incorrecto
log.error('Failed')

// ✅ Correcto
log.error('Failed to create project', {
  userId: 'user-123',
  projectName: 'My Project',
  error: error.message,
})
```

### 3. No Loggear Información Sensible

```typescript
// ❌ Incorrecto
log.info('User login', { password: 'secret123' })

// ✅ Correcto
log.info('User login', { userId: 'user-123', method: 'credentials' })
```

### 4. Usar el Cliente Logger en el Frontend

```typescript
// ❌ Incorrecto
console.error('API failed') // Solo en consola del navegador

// ✅ Correcto
clientLogger.error('API failed', { endpoint: '/api/data' }) // Enviado al servidor
```

## Monitoreo y Alertas

### Ver Logs en Tiempo Real

```bash
# En desarrollo
tail -f logs/combined-$(date +%Y-%m-%d).log

# En producción (dentro del servidor)
docker compose -f docker-compose.prod.yml logs -f web
```

### Buscar Errores

```bash
# Buscar errores en logs de hoy
grep "\"level\":\"error\"" logs/combined-$(date +%Y-%m-%d).log

# Contar errores
grep -c "\"level\":\"error\"" logs/combined-$(date +%Y-%m-%d).log
```

### Scripts de Análisis

```bash
# Crear script para analizar errores del día
cat > analyze-logs.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y-%m-%d)
echo "Errores en $DATE:"
grep "\"level\":\"error\"" logs/combined-$DATE.log | wc -l

echo "\nTop 5 errores:"
grep "\"level\":\"error\"" logs/combined-$DATE.log | \
  jq -r '.message' | sort | uniq -c | sort -rn | head -5
EOF

chmod +x analyze-logs.sh
```

## Limpieza de Logs

Los logs se limpian automáticamente según la configuración de retención:

- Logs de error: 14 días
- Logs combinados: 30 días
- Logs HTTP: 7 días
- Logs de Docker: 10 archivos (aprox. 200MB)

### Limpieza Manual

```bash
# Eliminar logs más antiguos de 30 días
find logs/ -name "*.log" -mtime +30 -delete

# Eliminar logs de Docker
docker system prune -a --volumes
```

## Troubleshooting

### Los logs no se están creando

1. Verificar permisos de la carpeta `logs/`:
```bash
mkdir -p logs
chmod 755 logs
```

2. Verificar que el logger esté inicializado:
```typescript
import logger from '@/lib/logger'
logger.info('Test log')
```

### Los logs del frontend no llegan al servidor

1. Verificar que el endpoint `/api/logs/client` esté funcionando
2. Revisar la consola del navegador para errores de red
3. Verificar que `clientLogger` esté importado correctamente

### Logs de Docker no rotan

1. Verificar la configuración en `docker-compose.prod.yml`
2. Reiniciar los contenedores:
```bash
docker compose -f docker-compose.prod.yml restart
```

## Seguridad

⚠️ **IMPORTANTE**: El endpoint `/api/logs/view` permite ver logs del sistema. En producción, debes:

1. Agregar autenticación al endpoint
2. Limitar el acceso solo a administradores
3. Considerar usar un sistema de logging externo (ELK, Datadog, etc.)

Ejemplo de protección:

```typescript
// app/api/logs/view/route.ts
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ... rest of code
}
```

## Integración con Servicios Externos

Para enviar logs a servicios externos (Datadog, Sentry, CloudWatch, etc.):

```typescript
// lib/logger.ts
import winston from 'winston'

// Agregar transport personalizado
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Http({
    host: 'logs.example.com',
    port: 443,
    path: '/logs',
    ssl: true,
  }))
}
```

## Resumen

Este sistema de logging proporciona:

- 📝 Logging completo del servidor y frontend
- 🔄 Rotación automática de logs
- 💾 Persistencia con volúmenes Docker
- 🔍 API para visualización
- ⚙️ Configuración flexible
- 🚀 Listo para producción
