#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create Admin User - Final Version
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
        timeout=120,
        encoding='utf-8',
        errors='replace'
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

# Create admin user with ADMIN role
js_code = "(async () => { const { PrismaClient } = require('@prisma/client'); const bcrypt = require('bcryptjs'); const prisma = new PrismaClient(); try { await prisma.user.deleteMany({ where: { email: 'admin@web-builder.com' } }); } catch(e) {} const hashedPassword = await bcrypt.hash('admin123', 10); const user = await prisma.user.create({ data: { email: 'admin@web-builder.com', password: hashedPassword, name: 'Admin', role: 'ADMIN' } }); console.log('Usuario creado:', user.email, 'Role:', user.role); })()"

run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose exec -T web node -e \\\"{js_code}\\\"",
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
