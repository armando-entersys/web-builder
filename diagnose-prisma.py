#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Diagnóstico profundo de Prisma Client en contenedor
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
  Diagnóstico de Prisma Client
=========================================
""")

commands = [
    ("¿Dónde está @prisma/client en apps/web/node_modules?", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/@prisma/client/ 2>&1 | head -20"),
    ("¿Es un symlink?", f"cd {PROJECT_DIR} && docker compose exec -T web file /app/apps/web/node_modules/@prisma/client"),
    ("¿Qué hay en /app/node_modules/@prisma?", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/node_modules/@prisma/"),
    ("Intentar require desde Node", f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"try {{ const prisma = require('@prisma/client'); console.log('SUCCESS: Prisma loaded'); console.log('PrismaClient:', typeof prisma.PrismaClient); }} catch(e) {{ console.log('ERROR:', e.message); console.log('Stack:', e.stack); }}\""),
    ("Ver package.json de @prisma/client", f"cd {PROJECT_DIR} && docker compose exec -T web cat /app/apps/web/node_modules/@prisma/client/package.json 2>&1 | head -30"),
    ("Buscar index.js de Prisma", f"cd {PROJECT_DIR} && docker compose exec -T web find /app -name 'index.js' -path '*@prisma/client*' 2>/dev/null"),
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
        print("STDERR:", result.stderr, file=sys.stderr)

print("""
=========================================
""")
