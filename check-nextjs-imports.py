#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Next.js imports for Prisma Client
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
  Verificar imports de Prisma en Next.js
=========================================
""")

commands = [
    ("Verificar contenido de chunk 756.js", f"cd {PROJECT_DIR} && docker compose exec -T web head -50 /app/apps/web/.next/server/chunks/756.js"),
    ("Buscar require('@prisma/client')", f"cd {PROJECT_DIR} && docker compose exec -T web grep -r \"@prisma/client\" /app/apps/web/.next/server/ 2>/dev/null | head -10"),
    ("Verificar si .prisma/client existe en standalone", f"cd {PROJECT_DIR} && docker compose exec -T web ls -la /app/apps/web/node_modules/.prisma/client/"),
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
    if result.stderr and "Binary file" not in result.stderr:
        print(result.stderr, file=sys.stderr)

print("""
=========================================
""")
