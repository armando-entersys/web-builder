#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Run Create Admin Script on Server
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

# Read the script content
with open('create-admin-script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Copy script to server
print("Copiando script al servidor...")
with open('/tmp/create-admin-script.js', 'w', encoding='utf-8') as f:
    f.write(script_content)

subprocess.run([
    "gcloud.cmd", "compute", "scp",
    "/tmp/create-admin-script.js",
    f"{SERVER}:/tmp/create-admin-script.js",
    "--zone", ZONE
], timeout=60)

# Execute script in container
run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose exec -T web node /tmp/create-admin-script.js",
    "Ejecutar script de creación de admin"
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
