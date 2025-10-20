# 🔑 Configuración de API Keys

Este documento te guiará paso a paso para configurar las API keys necesarias para el Web Builder.

## ¿Qué API Keys Necesito?

Necesitas **al menos UNA** de las siguientes API keys para usar el generador de sitemap con IA:

- **OpenAI (GPT-4o)** - Recomendado para mejores resultados
- **Anthropic (Claude 3.7 Sonnet)** - Excelente para razonamiento complejo
- **Google (Gemini 2.0 Flash)** - Opción gratuita con buen rendimiento

## 📋 Paso 1: Obtener las API Keys

### OpenAI API Key (GPT-4o)

1. Visita: https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Haz clic en **"Create new secret key"**
4. Dale un nombre (ej: "Web Builder")
5. Copia la key completa (empieza con `sk-proj-...` o `sk-...`)
6. ⚠️ **IMPORTANTE**: Agrega crédito a tu cuenta en https://platform.openai.com/settings/organization/billing

**Costo aproximado**: ~$0.01 - $0.05 por sitemap generado

---

### Anthropic API Key (Claude 3.7 Sonnet)

1. Visita: https://console.anthropic.com/settings/keys
2. Inicia sesión o crea una cuenta
3. Haz clic en **"Create Key"**
4. Dale un nombre (ej: "Web Builder")
5. Copia la key completa (empieza con `sk-ant-...`)
6. ⚠️ **IMPORTANTE**: Agrega crédito a tu cuenta

**Costo aproximado**: ~$0.01 - $0.05 por sitemap generado

---

### Google AI API Key (Gemini 2.0 Flash)

1. Visita: https://aistudio.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Get API key"** o **"Create API key"**
4. Selecciona o crea un proyecto de Google Cloud
5. Copia la key completa

**Costo**: ✅ **GRATIS** hasta 1500 requests por día (tier gratuito generoso)

---

## 📝 Paso 2: Configurar el Archivo .env

1. Abre el archivo `.env` en la raíz del proyecto: `C:\web-builder\.env`

2. Reemplaza los valores de las API keys que obtuviste:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/webbuilder?schema=public"

# AI APIs - Reemplaza con tus API keys reales
OPENAI_API_KEY="sk-proj-tu-api-key-real-aqui"
ANTHROPIC_API_KEY="sk-ant-tu-api-key-real-aqui"
GOOGLE_AI_API_KEY="tu-api-key-de-google-aqui"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3003"
NODE_ENV="development"
```

3. **Guarda el archivo**

4. **Reinicia el servidor de desarrollo**:
   - Detén el servidor actual (Ctrl+C en la terminal)
   - Ejecuta nuevamente: `pnpm dev`

---

## ✅ Paso 3: Verificar la Configuración

1. Abre tu navegador en: http://localhost:3003/dashboard/sitemap

2. Completa el formulario:
   - **Nombre del Proyecto**: "Mi Primera Prueba"
   - **Industria**: Selecciona "SaaS"
   - **Descripción**: "Una plataforma SaaS para gestionar proyectos de equipos remotos"
   - **Modelo de IA**: Selecciona el modelo para el que configuraste la API key

3. Haz clic en **"Generar Sitemap con IA"**

4. Si todo está configurado correctamente, verás un sitemap generado en unos segundos

---

## 🔧 Solución de Problemas

### Error: "OPENAI_API_KEY no está configurada"
- Verifica que hayas copiado la API key correctamente en el archivo `.env`
- Asegúrate de que no haya espacios extra antes o después de la key
- Reinicia el servidor de desarrollo

### Error: "Insufficient quota" o "You exceeded your current quota"
- Necesitas agregar crédito a tu cuenta de OpenAI/Anthropic
- Cambia temporalmente a Gemini 2.0 Flash (gratuito)

### Error: "Invalid API key"
- Verifica que hayas copiado la key completa
- Asegúrate de que la key sea válida y no haya expirado
- Genera una nueva key si es necesario

### El sitemap no se genera
- Abre la consola del navegador (F12) y revisa los errores
- Verifica que el servidor esté corriendo en http://localhost:3003
- Revisa los logs del servidor en la terminal

---

## 💡 Recomendaciones

1. **Para empezar**: Usa **Gemini 2.0 Flash** (gratis y rápido)
2. **Para producción**: Usa **GPT-4o** o **Claude 3.7 Sonnet** (mejores resultados)
3. **Seguridad**:
   - Nunca compartas tus API keys
   - No subas el archivo `.env` a repositorios públicos
   - El archivo `.gitignore` ya está configurado para ignorar `.env`

---

## 🎯 Próximos Pasos

Una vez que hayas configurado al menos una API key y generado tu primer sitemap:

1. Prueba diferentes descripciones de proyectos
2. Experimenta con diferentes industrias
3. Compara resultados entre modelos de IA
4. Continúa con el siguiente módulo: **Wireframe Creator**

---

¿Necesitas ayuda? Revisa los logs de la terminal o la consola del navegador para más detalles sobre cualquier error.
