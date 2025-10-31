#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Debug Prisma in build stage
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

print("""
=========================================
  Debug: ¿Dónde está @prisma?
=========================================
""")

# Check if @prisma exists in builder stage
print("Verificando si @prisma existe en imagen del builder...")
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'find /app -name \"@prisma\" -type d 2>/dev/null | head -20'"
]

result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print("Directorios @prisma encontrados:")
    print(result.stdout)
else:
    print("❌ No se encontró ningún directorio @prisma")

if result.stderr:
    print(result.stderr, file=sys.stderr)

# Check what's in the root node_modules
print("\n\nVerificando contenido de /app/node_modules/@prisma...")
ssh_cmd2 = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'ls -la /app/node_modules/ | grep prisma'"
]

result2 = subprocess.run(ssh_cmd2, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result2.stdout:
    print(result2.stdout)
if result2.stderr:
    print(result2.stderr, file=sys.stderr)

print("""
=========================================
""")
