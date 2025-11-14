import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET - Obtener un proyecto específico
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Obtener proyecto con información del usuario
    const projectQuery = `
      SELECT
        p.*,
        u.id as "user_id",
        u.name as "user_name",
        u.email as "user_email"
      FROM projects p
      LEFT JOIN users u ON p."userId" = u.id
      WHERE p.id = $1
    `

    const projectResult = await query<any>(projectQuery, [id])

    if (projectResult.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const projectData = projectResult[0]

    // Verificar permisos: admin puede ver todo, usuario solo sus proyectos
    if (session.user.role !== "ADMIN" && projectData.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Obtener páginas del proyecto
    const pagesQuery = `
      SELECT id, title, slug, "projectId", "order"
      FROM pages
      WHERE "projectId" = $1
      ORDER BY "order" ASC
    `
    const pagesResult = await query<any>(pagesQuery, [id])

    // Formatear respuesta
    const project = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      industry: projectData.industry,
      status: projectData.status,
      sitemap: projectData.sitemap,
      styleGuide: projectData.styleGuide,
      settings: projectData.settings,
      createdAt: projectData.createdAt,
      updatedAt: projectData.updatedAt,
      publishedAt: projectData.publishedAt,
      userId: projectData.userId,
      user: {
        id: projectData.user_id,
        name: projectData.user_name,
        email: projectData.user_email,
      },
      pages: pagesResult.map((page: any) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        order: page.order,
      })),
    }

    return NextResponse.json(project)
  } catch (error) {
    logError(error as Error, { endpoint: '/api/projects/[id]', method: 'GET', action: 'fetch_project' })
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar proyecto
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verificar que el proyecto existe
    const projectCheck = await query<any>(
      'SELECT id, "userId" FROM projects WHERE id = $1',
      [id]
    )

    if (projectCheck.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projectCheck[0]

    // Verificar permisos
    if (session.user.role !== "ADMIN" && project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, industry, status, sitemap, styleGuide, settings } = body

    // Construir query dinámicamente
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }
    if (industry !== undefined) {
      updates.push(`industry = $${paramIndex++}`)
      values.push(industry)
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (sitemap !== undefined) {
      updates.push(`sitemap = $${paramIndex++}`)
      values.push(JSON.stringify(sitemap))
    }
    if (styleGuide !== undefined) {
      updates.push(`"styleGuide" = $${paramIndex++}`)
      values.push(JSON.stringify(styleGuide))
    }
    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex++}`)
      values.push(JSON.stringify(settings))
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Siempre actualizar updatedAt
    updates.push(`"updatedAt" = NOW()`)
    values.push(id) // Último parámetro para WHERE

    const updateQuery = `
      UPDATE projects
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await query<any>(updateQuery, values)

    // Obtener información del usuario
    const userResult = await query<any>(
      'SELECT id, name, email FROM users WHERE id = $1',
      [result[0].userId]
    )

    const updatedProject = {
      ...result[0],
      user: userResult[0],
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    logError(error as Error, { endpoint: '/api/projects/[id]', method: 'PATCH', action: 'update_project' })
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar proyecto
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verificar que el proyecto existe
    const projectCheck = await query<any>(
      'SELECT id, "userId" FROM projects WHERE id = $1',
      [id]
    )

    if (projectCheck.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projectCheck[0]

    // Verificar permisos
    if (session.user.role !== "ADMIN" && project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Eliminar primero las páginas asociadas manualmente
    await query(
      'DELETE FROM pages WHERE "projectId" = $1',
      [id]
    )

    // Luego eliminar el proyecto
    await query(
      'DELETE FROM projects WHERE id = $1',
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/projects/[id]', method: 'DELETE', action: 'delete_project' })
    return NextResponse.json(
      { error: "Failed to delete project", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
