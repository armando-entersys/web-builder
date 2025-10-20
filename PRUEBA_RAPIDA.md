# 🚀 Guía de Prueba Rápida - Generador de Sitemap con IA

## ✅ Configuración Completada

Las API keys están configuradas y listas para usar:
- ✅ **OpenAI (GPT-4o)** - Configurado
- ✅ **Anthropic (Claude 3.7 Sonnet)** - Configurado
- ✅ **Google (Gemini 2.0 Flash)** - Configurado

El servidor está corriendo en: **http://localhost:3004**

---

## 🎯 Cómo Probar el Generador de Sitemap

### Paso 1: Abre la Aplicación

1. Abre tu navegador
2. Ve a: **http://localhost:3004/dashboard/sitemap**

### Paso 2: Completa el Formulario

#### Ejemplo 1: Proyecto SaaS
```
Nombre del Proyecto: TaskMaster Pro
Industria: SaaS
Descripción: Una plataforma de gestión de proyectos para equipos remotos con IA integrada. Permite crear tareas, asignarlas, hacer seguimiento del progreso, generar reportes automáticos y colaborar en tiempo real. Dirigido a startups y pequeñas empresas.
Modelo de IA: GPT-4o (OpenAI)
```

#### Ejemplo 2: E-commerce
```
Nombre del Proyecto: EcoShop
Industria: E-commerce
Descripción: Tienda online de productos sustentables y ecológicos. Vendemos ropa orgánica, productos de limpieza eco-friendly, cosmética natural y accesorios reciclados. Enfocado en millennials y Gen Z conscientes del medio ambiente.
Modelo de IA: Claude 3.7 Sonnet (Anthropic)
```

#### Ejemplo 3: Agencia
```
Nombre del Proyecto: Digital Boost Agency
Industria: Agencia
Descripción: Agencia digital especializada en transformación digital para PYMEs. Ofrecemos diseño web, marketing digital, SEO, gestión de redes sociales y desarrollo de aplicaciones móviles. Ayudamos a empresas tradicionales a tener presencia digital.
Modelo de IA: Gemini 2.0 Flash (Google)
```

### Paso 3: Genera el Sitemap

1. Selecciona el **Modelo de IA** que quieres probar
2. Haz clic en **"Generar Sitemap con IA"**
3. Espera 5-10 segundos mientras la IA genera el sitemap
4. Verás el sitemap generado en el panel de la derecha

---

## 🔍 Qué Esperar

### Resultados de GPT-4o
- Estructura muy completa y profesional
- Descripciones detalladas y SEO-optimizadas
- Jerarquía lógica de páginas
- Incluye sub-páginas relevantes

### Resultados de Claude 3.7 Sonnet
- Enfoque más conversacional
- Estructura bien pensada
- Descripciones orientadas a responder preguntas de usuarios
- Excelente para búsqueda conversacional

### Resultados de Gemini 2.0 Flash
- Estructura eficiente y clara
- Descripciones concisas
- Buen balance entre cantidad de páginas
- Rápido (ideal para iteración)

---

## 🧪 Pruebas Sugeridas

### Prueba 1: Compara los 3 Modelos
1. Usa la **misma descripción** con los 3 modelos
2. Compara las estructuras generadas
3. Observa las diferencias en enfoque y organización

### Prueba 2: Diferentes Industrias
1. Prueba con **SaaS, E-commerce, Agencia, Educación, Salud**
2. Observa cómo cada modelo adapta la estructura
3. Identifica patrones específicos por industria

### Prueba 3: Descripciones Variadas
1. Prueba con descripciones **cortas** (1-2 líneas)
2. Prueba con descripciones **detalladas** (párrafo completo)
3. Observa cómo afecta la calidad del sitemap generado

---

## 📊 Estructura del Sitemap Generado

Cada página incluye:
- **Título**: Nombre de la página
- **Slug**: URL de la página (ej: `/pricing`, `/about`)
- **Descripción**: Propósito y contenido de la página
- **Children** (opcional): Sub-páginas anidadas

Ejemplo de estructura jerárquica:
```
Home (/)
├── Features (/features)
├── Pricing (/pricing)
└── Resources (/resources)
    ├── Blog (/resources/blog)
    ├── Docs (/resources/docs)
    └── Case Studies (/resources/case-studies)
```

---

## ⚡ Consejos para Mejores Resultados

1. **Sé específico**: Incluye información sobre audiencia objetivo, características clave y objetivos
2. **Menciona el tipo de negocio**: B2B, B2C, marketplace, plataforma, etc.
3. **Incluye casos de uso**: Describe cómo los usuarios utilizarán el sitio
4. **Define la escala**: Startup, pequeña empresa, enterprise, etc.

---

## 🐛 Solución de Problemas

### El sitemap no se genera
1. Abre la **consola del navegador** (F12 → Console)
2. Busca mensajes de error en rojo
3. Revisa que las API keys estén correctamente configuradas

### Error: "API key not found"
- Verifica el archivo `.env` en: `C:\web-builder\.env`
- Asegúrate de haber reiniciado el servidor después de agregar las keys

### Error: "Insufficient quota"
- Tu cuenta de OpenAI/Anthropic necesita crédito
- Cambia temporalmente a **Gemini 2.0 Flash** (gratuito)

### Sitemap vacío o incompleto
- Agrega más detalles en la **Descripción**
- Prueba con un **modelo diferente**
- Verifica que hayas seleccionado una **Industria**

---

## 📈 Próximos Pasos

Una vez que hayas probado el generador de sitemap:

1. ✅ **Guarda tus sitemaps favoritos** (próximamente: guardar en base de datos)
2. ✅ **Edita y personaliza** (próximamente: editor drag & drop)
3. ✅ **Genera wireframes** (próximo módulo: Wireframe Creator)
4. ✅ **Crea contenido** (próximo módulo: Content Generator)
5. ✅ **Exporta tu sitio** (próximo módulo: Export Engine)

---

## 🎉 ¡Listo para Probar!

Abre **http://localhost:3004/dashboard/sitemap** y comienza a generar tus primeros sitemaps con IA.

¿Necesitas ayuda? Revisa `CONFIGURACION_API_KEYS.md` para más detalles.
