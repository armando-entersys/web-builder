#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create Admin User
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
  Crear Usuario Administrador
=========================================
""")

# Delete existing admin user if exists and create new one
run_ssh_command(
    f"""cd {PROJECT_DIR} && docker compose exec -T web node -e "
const {{ PrismaClient }} = require('@prisma/client');
const bcrypt = require('bcryptjs');
(async () => {{
  const prisma = new PrismaClient();
  try {{
    // Delete existing admin if exists
    try {{
      await prisma.user.delete({{
        where: {{ email: 'admin@web-builder.com' }}
      }});
      console.log('Usuario admin anterior eliminado');
    }} catch (e) {{
      console.log('No habia usuario admin previo');
    }}

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({{
      data: {{
        email: 'admin@web-builder.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }}
    }});
    console.log('');
    console.log('✅ Usuario admin creado exitosamente!');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('ID:', user.id);
  }} catch (e) {{
    console.error('Error:', e.message);
    process.exit(1);
  }} finally {{
    await prisma.\$disconnect();
  }}
}})();
"
""",
    "Crear usuario administrador"
)

print("""
=========================================
✅ PROCESO COMPLETADO
=========================================

📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login

⚠️ IMPORTANTE: Cambia la contraseña después del primer login
=========================================
""")
