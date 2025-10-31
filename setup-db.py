#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Setup Database: Run Prisma migrations and create admin user
"""

import subprocess
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
SERVER = "prod-server"
ZONE = "us-central1-c"
PROJECT_DIR = "/srv/servicios/web-builder"

def run_ssh_command(command, description):
    """Execute command on remote server via gcloud ssh"""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}\n")

    ssh_cmd = [
        "gcloud.cmd", "compute", "ssh", SERVER,
        "--zone", ZONE,
        "--command", command
    ]

    result = subprocess.run(
        ssh_cmd,
        capture_output=True,
        text=True,
        timeout=120
    )

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    if result.returncode == 0:
        print(f"\n✅ {description} - Completado")
        return True
    else:
        print(f"\n❌ {description} - Falló")
        return False

print("""
=========================================
  Web Builder - Database Setup
=========================================
""")

# Step 1: Run Prisma db push
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'cd packages/db && npx prisma db push --accept-data-loss'",
    "Paso 1: Crear tablas de la base de datos"
):
    print("\n⚠️ No se pudo crear las tablas")
    sys.exit(1)

# Step 2: Create admin user with ADMIN role
if not run_ssh_command(
    f"""cd {PROJECT_DIR} && docker compose exec -T web node -e "
const {{ PrismaClient }} = require('@prisma/client');
const bcrypt = require('bcryptjs');
(async () => {{
  const prisma = new PrismaClient();
  try {{
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({{
      data: {{
        email: 'admin@web-builder.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }}
    }});
    console.log('Usuario admin creado:', user.email);
    console.log('Role:', user.role);
  }} catch (e) {{
    if (e.code === 'P2002') {{
      console.log('Usuario admin ya existe');
      const user = await prisma.user.findUnique({{ where: {{ email: 'admin@web-builder.com' }} }});
      console.log('Email:', user.email);
      console.log('Role:', user.role);
    }} else {{
      console.error('Error:', e.message);
      process.exit(1);
    }}
  }} finally {{
    await prisma.$disconnect();
  }}
}})();
"
""",
    "Paso 2: Crear usuario administrador"
):
    print("\n⚠️ Error al crear usuario admin")

print("""
=========================================
✅ BASE DE DATOS CONFIGURADA
=========================================

📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login

⚠️ IMPORTANTE: Cambia la contraseña después del primer login
=========================================
""")
