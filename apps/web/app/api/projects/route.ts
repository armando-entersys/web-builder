import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { createId } from "@paralleldrive/cuid2"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "REVIEW" | "PUBLISHED" | "ARCHIVED"

interface Project {
  id: string
  name: string
  description: string | null
  industry: string | null
  status: ProjectStatus
  sitemap: any
  styleGuide: any
  settings: any
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  userId: string
  user?: {
    id: string
    name: string | null
    email: string
  }
  pages?: Array<{
    id: string
    title: string
    slug: string
  }>
}

// GET - Listar proyectos del usuario (o todos si es admin)
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Si es admin, obtener todos los proyectos
    // Si es usuario normal, solo sus proyectos
    const whereClause = session.user.role === "ADMIN"
      ? ""
      : "WHERE p.\"userId\" = $1"

    const params = session.user.role === "ADMIN"
      ? []
      : [session.user.id]

    // Query para obtener proyectos con información del usuario
    const projectsQuery = `
      SELECT
        p.*,
        u.id as "user_id",
        u.name as "user_name",
        u.email as "user_email"
      FROM projects p
      LEFT JOIN users u ON p."userId" = u.id
      ${whereClause}
      ORDER BY p."updatedAt" DESC
      LIMIT $${session.user.role === "ADMIN" ? "1" : "2"}
      OFFSET $${session.user.role === "ADMIN" ? "2" : "3"}
    `

    const countQuery = `
      SELECT COUNT(*) as count
      FROM projects p
      ${whereClause}
    `

    const projectsParams = session.user.role === "ADMIN"
      ? [limit, offset]
      : [session.user.id, limit, offset]

    const [projectsResult, countResult] = await Promise.all([
      query<any>(projectsQuery, projectsParams),
      query<{count: string}>(countQuery, params),
    ])

    // Obtener páginas para cada proyecto
    const projectIds = projectsResult.map((p: any) => p.id)
    let pagesResult: any[] = []

    if (projectIds.length > 0) {
      const placeholders = projectIds.map((_, i) => `$${i + 1}`).join(', ')
      const pagesQuery = `
        SELECT id, title, slug, "projectId"
        FROM pages
        WHERE "projectId" IN (${placeholders})
        ORDER BY "order" ASC
      `
      pagesResult = await query<any>(pagesQuery, projectIds)
    }

    // Formatear resultado
    const projects = projectsResult.map((p: any) => {
      const projectPages = pagesResult.filter((page: any) => page.projectId === p.id)

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        industry: p.industry,
        status: p.status,
        sitemap: p.sitemap,
        styleGuide: p.styleGuide,
        settings: p.settings,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        publishedAt: p.publishedAt,
        userId: p.userId,
        user: {
          id: p.user_id,
          name: p.user_name,
          email: p.user_email,
        },
        pages: projectPages.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
        })),
      }
    })

    const total = parseInt(countResult[0].count)

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/projects', method: 'GET', action: 'fetch_projects' })
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo proyecto
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, industry } = body

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    const projectId = createId()

    const insertQuery = `
      INSERT INTO projects (id, name, description, industry, "userId", status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `

    const projectResult = await query<Project>(
      insertQuery,
      [projectId, name, description || null, industry || null, session.user.id, "DRAFT"]
    )

    const project = projectResult[0]

    // Obtener información del usuario
    const userResult = await query<any>(
      'SELECT id, name, email FROM users WHERE id = $1',
      [session.user.id]
    )

    const response = {
      ...project,
      user: userResult[0],
      pages: [], // Un nuevo proyecto no tiene páginas aún
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/projects', method: 'POST', action: 'create_project' })
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
