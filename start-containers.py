#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Start Web Builder Containers on Production Server
Uses existing built image
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

def run_ssh_command(command, description, timeout=120):
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
        timeout=timeout
    )

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    if result.returncode == 0:
        print(f"\n✅ {description} - Completado")
        return True
    else:
        print(f"\n❌ {description} - Falló con código {result.returncode}")
        return False

print("""
=========================================
  Starting Web Builder Containers
  Domain: web-builder.scram2k.com
=========================================
""")

# Step 1: Start containers
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose up -d",
    "Iniciando contenedores Docker",
    timeout=120
):
    print("\n❌ Falló al iniciar contenedores")
    sys.exit(1)

# Step 2: Check status
if not run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose ps",
    "Verificando estado de contenedores",
    timeout=30
):
    print("\n⚠️ No se pudo verificar estado")

# Step 3: Check logs
run_ssh_command(
    f"cd {PROJECT_DIR} && docker compose logs --tail=50",
    "Verificando logs",
    timeout=30
)

print("""
=========================================
✅ CONTENEDORES INICIADOS
=========================================

🌐 La aplicación debería estar disponible en:
   https://web-builder.scram2k.com

📝 Verifica que la aplicación esté funcionando correctamente
=========================================
""")
