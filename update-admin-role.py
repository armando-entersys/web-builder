#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update User Role to ADMIN via SQL
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
  Actualizar Role de Usuario a ADMIN
=========================================
""")

# Update role using direct SQL
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T postgres psql -U postgres -d webbuilder -c \"UPDATE users SET role='ADMIN' WHERE email='admin@web-builder.com'; SELECT email, role FROM users WHERE email='admin@web-builder.com';\""
]

print("Ejecutando actualización SQL...")
result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

if result.returncode == 0:
    print("\n✅ Role actualizado exitosamente!")
else:
    print("\n❌ Error al actualizar role")

print("""
=========================================
📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login
=========================================
""")
