import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { componentsData } from './components-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar datos existentes
  console.log('🗑️  Cleaning existing data...')
  await prisma.component.deleteMany()
  await prisma.page.deleteMany()
  await prisma.project.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Crear usuarios
  console.log('👥 Creating users...')

  const adminPassword = await hash('admin123', 12)
  const userPassword = await hash('user123', 12)
  const editorPassword = await hash('editor123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@webbuilder.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin created:', admin.email)

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })
  console.log('✅ User 1 created:', user1.email)

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Jane Smith',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })
  console.log('✅ User 2 created:', user2.email)

  const editor = await prisma.user.create({
    data: {
      email: 'editor@webbuilder.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Editor created:', editor.email)

  // Crear proyectos para el admin
  console.log('📁 Creating projects...')

  const adminProject1 = await prisma.project.create({
    data: {
      name: 'Corporate Website',
      description: 'Modern corporate website with AI optimization',
      userId: admin.id,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
  })
  console.log('✅ Admin project 1 created:', adminProject1.name)

  const adminProject2 = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Full-featured online store',
      userId: admin.id,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    },
  })
  console.log('✅ Admin project 2 created:', adminProject2.name)

  // Crear proyectos para user1
  const user1Project1 = await prisma.project.create({
    data: {
      name: 'Personal Portfolio',
      description: 'Showcase of my work and skills',
      userId: user1.id,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-10'),
    },
  })
  console.log('✅ User 1 project created:', user1Project1.name)

  const user1Project2 = await prisma.project.create({
    data: {
      name: 'Blog Platform',
      description: 'Tech blog with AI-powered content recommendations',
      userId: user1.id,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-20'),
    },
  })
  console.log('✅ User 1 project 2 created:', user1Project2.name)

  // Crear proyectos para user2
  const user2Project = await prisma.project.create({
    data: {
      name: 'Restaurant Website',
      description: 'Beautiful website for local restaurant',
      userId: user2.id,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-05'),
    },
  })
  console.log('✅ User 2 project created:', user2Project.name)

  // Crear proyectos para editor
  const editorProject = await prisma.project.create({
    data: {
      name: 'Marketing Landing Pages',
      description: 'Collection of high-converting landing pages',
      userId: editor.id,
      createdAt: new Date('2024-04-10'),
      updatedAt: new Date('2024-04-15'),
    },
  })
  console.log('✅ Editor project created:', editorProject.name)

  // Crear páginas para algunos proyectos
  console.log('📄 Creating pages...')

  await prisma.page.create({
    data: {
      title: 'Home',
      slug: 'home',
      projectId: adminProject1.id,
      order: 0,
      content: {
        sections: [
          {
            id: 'hero-1',
            type: 'hero',
            title: 'Welcome to Our Company',
            description: 'We build amazing products',
          },
          {
            id: 'features-1',
            type: 'features',
            title: 'Our Features',
            items: ['Fast', 'Reliable', 'Scalable'],
          },
        ],
      },
    },
  })
  console.log('✅ Page created: Home (Corporate Website)')

  await prisma.page.create({
    data: {
      title: 'About Us',
      slug: 'about',
      projectId: adminProject1.id,
      order: 1,
      content: {
        sections: [
          {
            id: 'about-1',
            type: 'text',
            title: 'Our Story',
            description: 'Founded in 2020, we have been revolutionizing the web industry',
          },
        ],
      },
    },
  })
  console.log('✅ Page created: About Us (Corporate Website)')

  await prisma.page.create({
    data: {
      title: 'Products',
      slug: 'products',
      projectId: adminProject2.id,
      order: 0,
      content: {
        sections: [
          {
            id: 'products-1',
            type: 'grid',
            title: 'Our Products',
            items: [],
          },
        ],
      },
    },
  })
  console.log('✅ Page created: Products (E-commerce Platform)')

  await prisma.page.create({
    data: {
      title: 'Home',
      slug: 'home',
      projectId: user1Project1.id,
      order: 0,
      content: {
        sections: [
          {
            id: 'intro-1',
            type: 'hero',
            title: 'Hi, I\'m John Doe',
            description: 'Full-Stack Developer & Designer',
          },
        ],
      },
    },
  })
  console.log('✅ Page created: Home (Personal Portfolio)')

  await prisma.page.create({
    data: {
      title: 'Projects',
      slug: 'projects',
      projectId: user1Project1.id,
      order: 1,
      content: {
        sections: [
          {
            id: 'projects-1',
            type: 'grid',
            title: 'My Projects',
            items: [],
          },
        ],
      },
    },
  })
  console.log('✅ Page created: Projects (Personal Portfolio)')

  await prisma.page.create({
    data: {
      title: 'Menu',
      slug: 'menu',
      projectId: user2Project.id,
      order: 0,
      content: {
        sections: [
          {
            id: 'menu-1',
            type: 'list',
            title: 'Our Menu',
            items: ['Appetizers', 'Main Courses', 'Desserts'],
          },
        ],
      },
    },
  })
  console.log('✅ Page created: Menu (Restaurant Website)')

  // Crear componentes
  console.log('\n🎨 Creating components library...')

  let componentsCreated = 0
  const batchSize = 50 // Crear en lotes para mejor performance

  for (let i = 0; i < componentsData.length; i += batchSize) {
    const batch = componentsData.slice(i, i + batchSize)
    await prisma.component.createMany({
      data: batch,
      skipDuplicates: true,
    })
    componentsCreated += batch.length
    console.log(`   ✅ Created ${componentsCreated}/${componentsData.length} components`)
  }

  console.log(`✅ ${componentsCreated} components created successfully`)

  // Estadísticas finales
  console.log('\n📊 Seed Summary:')
  const userCount = await prisma.user.count()
  const projectCount = await prisma.project.count()
  const pageCount = await prisma.page.count()
  const componentCount = await prisma.component.count()

  console.log(`   Users: ${userCount}`)
  console.log(`   Projects: ${projectCount}`)
  console.log(`   Pages: ${pageCount}`)
  console.log(`   Components: ${componentCount}`)

  // Desglose por categoría
  console.log('\n📦 Components by Category:')
  const categories = await prisma.component.groupBy({
    by: ['category'],
    _count: { category: true },
  })
  categories.forEach(cat => {
    console.log(`   ${cat.category}: ${cat._count.category}`)
  })

  console.log('\n🎉 Database seeded successfully!\n')
  console.log('📝 Test Credentials:')
  console.log('   Admin:  admin@webbuilder.com / admin123')
  console.log('   User 1: user1@example.com / user123')
  console.log('   User 2: user2@example.com / user123')
  console.log('   Editor: editor@webbuilder.com / editor123\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
