#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificar .prisma/client generado
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
  Verificar .prisma/client generado
=========================================
""")

commands = [
    ("¿Existe .prisma en apps/web/node_modules?", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/.prisma/"),
    ("Ver index.js de .prisma/client", f"cd {PROJECT_DIR} && docker compose exec -T web cat /app/apps/web/node_modules/.prisma/client/index.js 2>&1 | head -50"),
    ("Buscar todas las ubicaciones de .prisma/client", f"cd {PROJECT_DIR} && docker compose exec -T web find /app -name 'client' -path '*/.prisma/*' -type d 2>/dev/null"),
    ("Probar require desde .prisma/client", f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"try {{ const {{ PrismaClient }} = require('.prisma/client'); console.log('SUCCESS from .prisma/client'); console.log('PrismaClient:', typeof PrismaClient); }} catch(e) {{ console.log('ERROR:', e.message); }}\""),
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
