import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

// Zod schemas para validación de estructura
const PageNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  children: z.array(z.lazy(() => PageNodeSchema)).optional(),
})

export type PageNode = z.infer<typeof PageNodeSchema>

const SitemapResponseSchema = z.object({
  sitemap: z.array(PageNodeSchema),
})

// Helper para generar IDs únicos
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Prompt del sistema para generar sitemaps
const SYSTEM_PROMPT = `Eres un experto arquitecto de información y SEO especializado en crear estructuras de sitios web optimizadas para buscadores conversacionales de IA como ChatGPT, Perplexity y Claude.

Tu tarea es generar un sitemap completo y bien estructurado basado en la información del proyecto que te proporcionen.

Reglas importantes:
1. Crea una jerarquía lógica de páginas que facilite la navegación y la comprensión del contenido
2. Los slugs deben ser descriptivos, en minúsculas, separados por guiones (kebab-case)
3. Incluye descripciones claras que expliquen el propósito de cada página
4. Optimiza para búsqueda conversacional: piensa en las preguntas que los usuarios harían
5. Para páginas principales, considera agregar sub-páginas relacionadas en la propiedad "children"
6. El slug de la página principal debe ser "/" (raíz)

Responde ÚNICAMENTE con un JSON válido en el siguiente formato:
{
  "sitemap": [
    {
      "id": "abc123",
      "title": "Home",
      "slug": "/",
      "description": "Descripción de la página principal",
      "children": [
        {
          "id": "def456",
          "title": "Subpágina",
          "slug": "/subpagina",
          "description": "Descripción de la subpágina"
        }
      ]
    }
  ]
}

Genera un sitemap completo, profesional y bien pensado.`

interface GenerateSitemapParams {
  projectName: string
  industry: string
  description: string
  model?: 'gpt-4o' | 'claude-3-7-sonnet' | 'gemini-2.0-flash'
}

// Generador con OpenAI GPT-4o
async function generateWithOpenAI(params: GenerateSitemapParams): Promise<PageNode[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const userPrompt = `Genera un sitemap para el siguiente proyecto:

Nombre del proyecto: ${params.projectName}
Industria: ${params.industry}
Descripción: ${params.description}

Responde con un JSON válido que contenga el sitemap completo.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No se recibió respuesta de OpenAI')
  }

  const parsed = JSON.parse(content)
  const validated = SitemapResponseSchema.parse(parsed)

  // Asignar IDs únicos a cada nodo
  const assignIds = (nodes: any[]): PageNode[] => {
    return nodes.map(node => ({
      ...node,
      id: generateId(),
      children: node.children ? assignIds(node.children) : undefined,
    }))
  }

  return assignIds(validated.sitemap)
}

// Generador con Anthropic Claude 3.7 Sonnet
async function generateWithClaude(params: GenerateSitemapParams): Promise<PageNode[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const userPrompt = `Genera un sitemap para el siguiente proyecto:

Nombre del proyecto: ${params.projectName}
Industria: ${params.industry}
Descripción: ${params.description}

Responde con un JSON válido que contenga el sitemap completo.`

  const message = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 4096,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Respuesta inesperada de Claude')
  }

  // Extraer JSON del texto (Claude a veces incluye markdown)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No se encontró JSON en la respuesta de Claude')
  }

  const parsed = JSON.parse(jsonMatch[0])
  const validated = SitemapResponseSchema.parse(parsed)

  // Asignar IDs únicos
  const assignIds = (nodes: any[]): PageNode[] => {
    return nodes.map(node => ({
      ...node,
      id: generateId(),
      children: node.children ? assignIds(node.children) : undefined,
    }))
  }

  return assignIds(validated.sitemap)
}

// Generador con Google Gemini 2.0 Flash
async function generateWithGemini(params: GenerateSitemapParams): Promise<PageNode[]> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  })

  const prompt = `${SYSTEM_PROMPT}

Genera un sitemap para el siguiente proyecto:

Nombre del proyecto: ${params.projectName}
Industria: ${params.industry}
Descripción: ${params.description}

Responde con un JSON válido que contenga el sitemap completo.`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const parsed = JSON.parse(text)
  const validated = SitemapResponseSchema.parse(parsed)

  // Asignar IDs únicos
  const assignIds = (nodes: any[]): PageNode[] => {
    return nodes.map(node => ({
      ...node,
      id: generateId(),
      children: node.children ? assignIds(node.children) : undefined,
    }))
  }

  return assignIds(validated.sitemap)
}

// Función principal que selecciona el modelo a usar
export async function generateSitemapWithAI(
  params: GenerateSitemapParams
): Promise<PageNode[]> {
  const model = params.model || 'gpt-4o'

  try {
    switch (model) {
      case 'gpt-4o':
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY no está configurada')
        }
        return await generateWithOpenAI(params)

      case 'claude-3-7-sonnet':
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error('ANTHROPIC_API_KEY no está configurada')
        }
        return await generateWithClaude(params)

      case 'gemini-2.0-flash':
        if (!process.env.GOOGLE_AI_API_KEY) {
          throw new Error('GOOGLE_AI_API_KEY no está configurada')
        }
        return await generateWithGemini(params)

      default:
        throw new Error(`Modelo no soportado: ${model}`)
    }
  } catch (error) {
    console.error(`Error generando sitemap con ${model}:`, error)
    throw error
  }
}
