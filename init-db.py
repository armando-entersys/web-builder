#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Initialize Database and Create Admin User
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
  Web Builder - Database Initialization
=========================================
""")

# Step 1: Run Prisma migrations
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"const {{execSync}} = require('child_process'); execSync('cd packages/db && npx prisma db push --skip-generate', {{stdio: 'inherit'}})\"",
    "Paso 1: Ejecutar migraciones de Prisma"
):
    print("\n⚠️ Migraciones pueden haber fallado, pero continuando...")

# Step 2: Check if there are any users
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"(async () => {{ const {{ prisma }} = await import('./packages/db/src/index.ts'); const count = await prisma.user.count(); console.log('Usuarios existentes:', count); process.exit(count > 0 ? 0 : 1); }})()\"",
    "Paso 2: Verificar si existen usuarios"
):
    print("\n📝 No hay usuarios, creando admin por defecto...")

    # Create default admin user
    run_ssh_command(
        f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"(async () => {{ const {{ prisma }} = await import('./packages/db/src/index.ts'); const bcrypt = require('bcryptjs'); const hashedPassword = await bcrypt.hash('admin123', 10); await prisma.user.create({{ data: {{ email: 'admin@web-builder.com', password: hashedPassword, name: 'Admin' }} }}); console.log('Usuario admin creado exitosamente'); }})()\"",
        "Paso 3: Crear usuario admin"
    )

print("""
=========================================
✅ BASE DE DATOS INICIALIZADA
=========================================

📝 Usuario admin creado:
   Email: admin@web-builder.com
   Password: admin123

⚠️ IMPORTANTE: Cambia esta contraseña después del primer login
=========================================
""")
