#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificar si @repo/db es accesible
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
  Verificar @repo/db
=========================================
""")

commands = [
    ("Probar require de @repo/db", f"cd {PROJECT_DIR} && docker compose exec -T web node -e \"try {{ const db = require('@repo/db'); console.log('SUCCESS: @repo/db loaded'); console.log('prisma:', typeof db.prisma); }} catch(e) {{ console.log('ERROR:', e.message); console.log('Stack:', e.stack.split('\\n').slice(0,10).join('\\n')); }}\""),
    ("Ver qué hay en /app/apps/web/.next/server/chunks/756.js", f"cd {PROJECT_DIR} && docker compose exec -T web grep -A 5 -B 5 'did not initialize' /app/apps/web/.next/server/chunks/756.js 2>&1 | head -20"),
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
