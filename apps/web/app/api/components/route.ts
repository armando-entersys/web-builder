import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type ComponentCategory = "ANIMATIONS" | "UI" | "SCRAM" | "ADVANCED" | "EFFECTS" | "BUILDER" | "PROVIDERS"

interface Component {
  id: string
  name: string
  displayName: string
  slug: string
  category: ComponentCategory
  subcategory: string | null
  type: string
  description: string
  icon: string
  tags: string[]
  componentPath: string
  thumbnail: string | null
  demoUrl: string | null
  variantId: number
  variantName: string | null
  parentSlug: string | null
  isActive: boolean
  isPremium: boolean
  isNew: boolean
  props: any
  styleConfig: any
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

// GET - Listar componentes con filtros opcionales
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    // Filtros
    const category = searchParams.get("category") // ANIMATIONS, UI, SCRAM, etc.
    const subcategory = searchParams.get("subcategory") // interactive, text, backgrounds, etc.
    const type = searchParams.get("type") // hero, features, cta, etc.
    const search = searchParams.get("search") // búsqueda por nombre o tags
    const isPremium = searchParams.get("isPremium") // true/false
    const isActive = searchParams.get("isActive") // true/false (default: true)

    // Paginación
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Construir WHERE clause dinámicamente
    const whereConditions: string[] = []
    const params: any[] = []
    let paramIndex = 1

    // Por defecto solo componentes activos
    if (isActive !== "false") {
      whereConditions.push(`"isActive" = $${paramIndex}`)
      params.push(true)
      paramIndex++
    }

    if (category) {
      whereConditions.push(`category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (subcategory) {
      whereConditions.push(`subcategory = $${paramIndex}`)
      params.push(subcategory)
      paramIndex++
    }

    if (type) {
      whereConditions.push(`type = $${paramIndex}`)
      params.push(type)
      paramIndex++
    }

    if (isPremium !== null) {
      whereConditions.push(`"isPremium" = $${paramIndex}`)
      params.push(isPremium === "true")
      paramIndex++
    }

    // Búsqueda por nombre, displayName o tags
    if (search) {
      whereConditions.push(`(
        name ILIKE $${paramIndex} OR
        "displayName" ILIKE $${paramIndex} OR
        description ILIKE $${paramIndex} OR
        $${paramIndex + 1} = ANY(tags)
      )`)
      params.push(`%${search}%`, search)
      paramIndex += 2
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(" AND ")}`
      : ""

    // Query para obtener componentes
    const componentsQuery = `
      SELECT *
      FROM components
      ${whereClause}
      ORDER BY category, subcategory, "variantId", name
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `

    const countQuery = `
      SELECT COUNT(*) as count
      FROM components
      ${whereClause}
    `

    const [componentsResult, countResult] = await Promise.all([
      query<Component>(componentsQuery, [...params, limit, offset]),
      query<{count: string}>(countQuery, params),
    ])

    const total = parseInt(countResult[0].count)

    return NextResponse.json({
      components: componentsResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        category,
        subcategory,
        type,
        search,
        isPremium,
        isActive: isActive !== "false",
      }
    })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/components', method: 'GET', action: 'fetch_components' })
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    )
  }
}

// GET endpoint adicional para obtener categorías únicas
export async function OPTIONS(req: Request) {
  try {
    // Obtener todas las categorías y subcategorías únicas
    const categoriesQuery = `
      SELECT DISTINCT category, subcategory, type
      FROM components
      WHERE "isActive" = true
      ORDER BY category, subcategory, type
    `

    const categoriesResult = await query<{
      category: ComponentCategory
      subcategory: string | null
      type: string
    }>(categoriesQuery, [])

    // Agrupar por categoría
    const grouped = categoriesResult.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          subcategories: new Set<string>(),
          types: new Set<string>(),
        }
      }
      if (item.subcategory) {
        acc[item.category].subcategories.add(item.subcategory)
      }
      acc[item.category].types.add(item.type)
      return acc
    }, {})

    // Convertir Sets a arrays
    const categories = Object.entries(grouped).map(([category, data]: [string, any]) => ({
      category,
      subcategories: Array.from(data.subcategories),
      types: Array.from(data.types),
    }))

    // Obtener conteo por categoría
    const countsQuery = `
      SELECT category, COUNT(*) as count
      FROM components
      WHERE "isActive" = true
      GROUP BY category
      ORDER BY category
    `

    const countsResult = await query<{
      category: ComponentCategory
      count: string
    }>(countsQuery, [])

    return NextResponse.json({
      categories,
      counts: countsResult.map(c => ({
        category: c.category,
        count: parseInt(c.count),
      })),
    })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/components', method: 'OPTIONS', action: 'fetch_categories' })
    return NextResponse.json(
      { error: "Failed to fetch component categories" },
      { status: 500 }
    )
  }
}
