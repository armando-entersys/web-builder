const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    // Delete existing admin if exists
    try {
      await prisma.user.delete({
        where: { email: 'admin@web-builder.com' }
      });
      console.log('Usuario admin anterior eliminado');
    } catch (e) {
      console.log('No habia usuario admin previo');
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'admin@web-builder.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    });
    console.log('');
    console.log('✅ Usuario admin creado exitosamente!');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('ID:', user.id);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
