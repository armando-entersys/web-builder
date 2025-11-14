import { NextRequest, NextResponse } from 'next/server'
import { logError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, industry, description } = body

    if (!projectName || !description) {
      return NextResponse.json(
        { error: 'Project name and description are required' },
        { status: 400 }
      )
    }

    // Generate sections based on the project description
    // For now, we'll create a smart default structure based on the industry
    const sections = generateSections(projectName, industry, description)

    return NextResponse.json({ sections })
  } catch (error) {
    logError(error as Error, { endpoint: '/api/landing/generate', action: 'generate_landing' })
    return NextResponse.json(
      { error: 'Failed to generate landing page' },
      { status: 500 }
    )
  }
}

function generateSections(projectName: string, industry: string, description: string) {
  // Base sections that work for most landing pages
  const baseSections = [
    {
      id: '1',
      type: 'hero',
      title: projectName,
      description: description,
    },
    {
      id: '2',
      type: 'features',
      title: 'Características Clave',
      description: 'Las principales ventajas y funcionalidades que ofrecemos',
    },
  ]

  // Industry-specific sections
  const industrySections: Record<string, any[]> = {
    saas: [
      {
        id: '3',
        type: 'pricing',
        title: 'Planes y Precios',
        description: 'Elige el plan perfecto para tu equipo',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Lo que dicen nuestros clientes',
        description: 'Miles de equipos confían en nosotros',
      },
      {
        id: '5',
        type: 'cta',
        title: 'Comienza hoy mismo',
        description: 'Únete a las empresas que ya están transformando su negocio',
      },
    ],
    ecommerce: [
      {
        id: '3',
        type: 'gallery',
        title: 'Productos Destacados',
        description: 'Descubre nuestra selección premium',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Opiniones de Clientes',
        description: 'Lo que dicen quienes ya compraron',
      },
      {
        id: '5',
        type: 'cta',
        title: '¡Compra ahora!',
        description: 'Envío gratis en tu primera compra',
      },
    ],
    agency: [
      {
        id: '3',
        type: 'stats',
        title: 'Resultados que hablan',
        description: 'Números que demuestran nuestra experiencia',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Casos de Éxito',
        description: 'Proyectos que transformaron negocios',
      },
      {
        id: '5',
        type: 'contact',
        title: 'Hablemos de tu proyecto',
        description: 'Agenda una consulta gratuita',
      },
    ],
    fintech: [
      {
        id: '3',
        type: 'stats',
        title: 'Confianza y Seguridad',
        description: 'Cifras que respaldan nuestra plataforma',
      },
      {
        id: '4',
        type: 'features',
        title: 'Seguridad de nivel bancario',
        description: 'Tu dinero protegido con la mejor tecnología',
      },
      {
        id: '5',
        type: 'cta',
        title: 'Abre tu cuenta gratis',
        description: 'Sin comisiones ocultas, 100% transparente',
      },
    ],
    healthcare: [
      {
        id: '3',
        type: 'features',
        title: 'Cuidado Profesional',
        description: 'Servicios médicos de primera calidad',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Pacientes Satisfechos',
        description: 'Historias de salud y bienestar',
      },
      {
        id: '5',
        type: 'contact',
        title: 'Agenda tu cita',
        description: 'Atención personalizada cuando la necesites',
      },
    ],
    education: [
      {
        id: '3',
        type: 'features',
        title: 'Programas de Estudio',
        description: 'Aprende con los mejores profesionales',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Historias de Éxito',
        description: 'Estudiantes que lograron sus objetivos',
      },
      {
        id: '5',
        type: 'cta',
        title: 'Inscríbete ahora',
        description: 'Comienza tu transformación educativa',
      },
    ],
    'real-estate': [
      {
        id: '3',
        type: 'gallery',
        title: 'Propiedades Destacadas',
        description: 'Encuentra tu hogar ideal',
      },
      {
        id: '4',
        type: 'stats',
        title: 'Experiencia que Cuenta',
        description: 'Años de éxito en el mercado inmobiliario',
      },
      {
        id: '5',
        type: 'contact',
        title: 'Agenda una visita',
        description: 'Te ayudamos a encontrar la propiedad perfecta',
      },
    ],
    consulting: [
      {
        id: '3',
        type: 'stats',
        title: 'Resultados Comprobados',
        description: 'Impacto medible en cada proyecto',
      },
      {
        id: '4',
        type: 'testimonials',
        title: 'Clientes que Crecieron',
        description: 'Testimonios de empresas transformadas',
      },
      {
        id: '5',
        type: 'contact',
        title: 'Consulta Gratuita',
        description: 'Hablemos sobre tu desafío empresarial',
      },
    ],
  }

  // Get industry-specific sections or use default
  const additionalSections = industrySections[industry] || [
    {
      id: '3',
      type: 'testimonials',
      title: 'Lo que dicen nuestros clientes',
      description: 'Testimonios y reseñas de clientes satisfechos',
    },
    {
      id: '4',
      type: 'cta',
      title: 'Comienza hoy',
      description: 'Únete a miles de usuarios satisfechos',
    },
  ]

  return [...baseSections, ...additionalSections]
}
