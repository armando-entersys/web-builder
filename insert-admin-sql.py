#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Insert Admin User Directly via SQL
"""

import subprocess
import sys
import io
import bcrypt

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
SERVER = "prod-server"
ZONE = "us-central1-c"
PROJECT_DIR = "/srv/servicios/web-builder"

print("""
=========================================
  Crear Usuario Admin via SQL
=========================================
""")

# Generate bcrypt hash locally
print("Generando hash de contraseña...")
password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')
print(f"Hash generado: {password_hash[:20]}...")

# Insert admin user via SQL
sql_insert = f"""
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
    'admin-' || substr(md5(random()::text), 1, 25),
    'admin@web-builder.com',
    'Admin',
    '{password_hash}',
    'ADMIN',
    NOW(),
    NOW()
);
"""

ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"""cd {PROJECT_DIR} && docker compose exec -T postgres psql -U postgres -d webbuilder -c '{sql_insert} SELECT id, email, name, role FROM users;'"""
]

print("\nInsertando usuario admin...")
result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

if result.returncode == 0:
    print("\n✅ Usuario admin creado exitosamente!")
else:
    print("\n❌ Error al crear usuario admin")

print("""
=========================================
📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login
=========================================
""")
