#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check if @prisma symlink exists
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
  Verificar symlinks de @prisma
=========================================
""")

# Check if symlink exists
print("Verificando si /app/node_modules/@prisma es un symlink...")
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'ls -la /app/node_modules/ | grep -E \"@|prisma\"'"
]

result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

# Check what's in pnpm store
print("\n\nContenido de .pnpm/node_modules/@prisma:")
ssh_cmd2 = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'ls -la /app/node_modules/.pnpm/node_modules/@prisma/ 2>/dev/null | head -20'"
]

result2 = subprocess.run(ssh_cmd2, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result2.stdout:
    print(result2.stdout)
else:
    print("❌ No existe /app/node_modules/.pnpm/node_modules/@prisma/")

if result2.stderr:
    print(result2.stderr, file=sys.stderr)

print("""
=========================================
""")
