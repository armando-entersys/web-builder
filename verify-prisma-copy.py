#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verify Prisma Client was copied to standalone
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
  Verificar copia de Prisma Client
=========================================
""")

commands = [
    ("¿Existe /app/apps/web/node_modules/@prisma?", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/@prisma/"),
    ("¿Existe /app/apps/web/node_modules/.prisma?", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/.prisma/"),
    ("Contenido de @prisma/client", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/@prisma/client/"),
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
        print("ERROR:", result.stderr, file=sys.stderr)

print("""
=========================================
""")
