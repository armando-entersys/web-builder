#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix Prisma Client in running container
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
  Generar Prisma Client en Contenedor
=========================================
""")

# Step 1: Generate Prisma Client
print("Paso 1: Generando Prisma Client...")
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T web sh -c 'cd packages/db && pnpm prisma generate'"
]

result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=120, encoding='utf-8', errors='replace')

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

if result.returncode == 0:
    print("✅ Prisma Client generado")
else:
    print(f"❌ Error generando Prisma Client (código {result.returncode})")
    sys.exit(1)

# Step 2: Restart web container
print("\nPaso 2: Reiniciando contenedor web...")
ssh_cmd2 = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose restart web"
]

result2 = subprocess.run(ssh_cmd2, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result2.stdout:
    print(result2.stdout)
if result2.stderr:
    print(result2.stderr, file=sys.stderr)

if result2.returncode == 0:
    print("✅ Contenedor reiniciado")
else:
    print(f"❌ Error reiniciando contenedor (código {result2.returncode})")

print("""
=========================================
🎉 Prisma Client configurado!

Ahora puedes probar registrar un usuario en:
https://web-builder.scram2k.com/auth/register
=========================================
""")
