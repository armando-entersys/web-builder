import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET - Obtener componente específico por slug
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Query para obtener el componente
    const componentQuery = `
      SELECT *
      FROM components
      WHERE slug = $1 AND "isActive" = true
    `

    const componentResult = await query<any>(componentQuery, [slug])

    if (componentResult.length === 0) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      )
    }

    const component = componentResult[0]

    // Obtener variantes relacionadas (mismo parent o mismo nombre base)
    let variantsQuery = ``
    let variantsParams: any[] = []

    if (component.parentSlug) {
      // Si es una variante, buscar el padre y todas sus variantes
      variantsQuery = `
        SELECT *
        FROM components
        WHERE (slug = $1 OR "parentSlug" = $1) AND "isActive" = true
        ORDER BY "variantId"
      `
      variantsParams = [component.parentSlug]
    } else {
      // Si es el padre, buscar todas sus variantes
      variantsQuery = `
        SELECT *
        FROM components
        WHERE (slug = $1 OR "parentSlug" = $1) AND "isActive" = true
        ORDER BY "variantId"
      `
      variantsParams = [slug]
    }

    const variantsResult = await query<any>(variantsQuery, variantsParams)

    // Incrementar contador de uso
    await query(
      'UPDATE components SET "usageCount" = "usageCount" + 1 WHERE slug = $1',
      [slug]
    )

    return NextResponse.json({
      component,
      variants: variantsResult,
    })
  } catch (error) {
    console.error("Get component by slug error:", error)
    return NextResponse.json(
      { error: "Failed to fetch component" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar contador de uso o favoritos (sin autenticación para analytics)
export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await req.json()
    const { action } = body

    if (action === "increment_usage") {
      await query(
        'UPDATE components SET "usageCount" = "usageCount" + 1 WHERE slug = $1',
        [slug]
      )

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Update component error:", error)
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    )
  }
}
