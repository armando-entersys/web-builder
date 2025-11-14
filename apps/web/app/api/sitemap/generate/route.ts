import { NextRequest, NextResponse } from 'next/server'
import { generateSitemapWithAI } from '@/lib/ai/sitemap-generator'
import { logError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, industry, description, model } = body

    if (!projectName || !industry || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (projectName, industry, description)' },
        { status: 400 }
      )
    }

    // Generar sitemap usando IA
    const sitemap = await generateSitemapWithAI({
      projectName,
      industry,
      description,
      model: model || 'gpt-4o', // Default a GPT-4o
    })

    return NextResponse.json({
      sitemap,
      model: model || 'gpt-4o',
    })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/sitemap/generate', action: 'generate_sitemap' })

    // Mensaje de error más detallado
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    return NextResponse.json(
      {
        error: 'Error al generar el sitemap',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
