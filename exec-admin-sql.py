#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Execute create-admin.sql on server
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
  Ejecutar SQL desde archivo
=========================================
""")

# Read the SQL file locally
with open('create-admin.sql', 'r') as f:
    sql_content = f.read()

print("SQL a ejecutar:")
print(sql_content)
print("\nEjecutando en servidor...")

# Execute SQL via stdin (avoid file path issues)
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T postgres psql -U postgres -d webbuilder"
]

result = subprocess.run(
    ssh_cmd,
    input=sql_content,
    capture_output=True,
    text=True,
    timeout=60,
    encoding='utf-8',
    errors='replace'
)

if result.stdout:
    print("\n=== Output ===")
    print(result.stdout)
if result.stderr:
    print("\n=== Stderr ===")
    print(result.stderr, file=sys.stderr)

if result.returncode == 0:
    print("\n✅ Usuario admin creado exitosamente!")
else:
    print(f"\n❌ Error (código {result.returncode})")

print("""
=========================================
📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login
=========================================
""")
