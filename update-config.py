#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update Web Builder Configuration on Production Server
(Updates docker-compose.yml and restarts containers without rebuild)
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
BRANCH = "master"

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
  Web Builder - Update Configuration
  Domain: web-builder.scram2k.com
=========================================
""")

# Step 1: Pull latest changes
if not run_ssh_command(
    f"cd {PROJECT_DIR} && git fetch origin && git reset --hard origin/{BRANCH}",
    "Paso 1: Actualizar configuración desde GitHub"
):
    print("\n❌ Actualización falló")
    sys.exit(1)

# Step 2: Restart containers with new configuration
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose up -d",
    "Paso 2: Reiniciar contenedores con nueva configuración"
):
    print("\n❌ Reinicio falló")
    sys.exit(1)

# Step 3: Check status
run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose ps",
    "Paso 3: Verificar estado de contenedores"
)

print("""
=========================================
✅ CONFIGURACIÓN ACTUALIZADA
=========================================

🌐 Espera unos segundos y verifica:
   https://web-builder.scram2k.com

📝 Traefik generará el certificado SSL automáticamente
=========================================
""")
