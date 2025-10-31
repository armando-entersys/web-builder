#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check container structure to debug Prisma Client issue
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
  Verificar estructura del contenedor
=========================================
""")

commands = [
    ("Verificar /app/apps/web/node_modules", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/"),
    ("Verificar /app/node_modules/.prisma", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/node_modules/.prisma/"),
    ("Verificar /app/packages/db", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/packages/db/"),
    ("Buscar archivos .prisma", f"cd {PROJECT_DIR} && docker compose exec -T web find /app -name '.prisma' -type d 2>/dev/null"),
]

for desc, cmd in commands:
    print(f"\n{desc}:")
    print("=" * 50)
    ssh_cmd = [
        "gcloud.cmd", "compute", "ssh", SERVER,
        "--zone", ZONE,
        "--command", cmd
    ]

    result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=30, encoding='utf-8', errors='replace')

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

print("""
=========================================
""")
