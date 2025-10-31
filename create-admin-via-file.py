#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create Admin User via SQL File
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
  Crear Usuario Admin via Archivo SQL
=========================================
""")

# Generate bcrypt hash locally
print("Generando hash de contraseña...")
password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')
print(f"Hash generado: {password_hash[:20]}...")

# Create SQL content
sql_content = f"""INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
    'clxadmin001',
    'admin@web-builder.com',
    'Admin',
    '{password_hash}',
    'ADMIN',
    NOW(),
    NOW()
);
SELECT id, email, name, role FROM users WHERE email='admin@web-builder.com';
"""

print("\nCreando archivo SQL en el servidor...")

# Step 1: Create SQL file on server
step1_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"echo \"{sql_content}\" > /tmp/create_admin.sql"
]

result1 = subprocess.run(step1_cmd, capture_output=True, text=True, timeout=30, encoding='utf-8', errors='replace')

if result1.returncode != 0:
    print("Error creando archivo SQL")
    if result1.stderr:
        print(result1.stderr, file=sys.stderr)
    sys.exit(1)

print("Archivo SQL creado en /tmp/create_admin.sql")

# Step 2: Execute SQL file
print("\nEjecutando SQL...")
step2_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose exec -T postgres psql -U postgres -d webbuilder -f /tmp/create_admin.sql"
]

result2 = subprocess.run(step2_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result2.stdout:
    print(result2.stdout)
if result2.stderr:
    print(result2.stderr, file=sys.stderr)

if result2.returncode == 0:
    print("\n✅ Usuario admin creado exitosamente!")
else:
    print("\n❌ Error al crear usuario admin")

# Step 3: Clean up
print("\nLimpiando archivo temporal...")
step3_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    "rm /tmp/create_admin.sql"
]
subprocess.run(step3_cmd, capture_output=True, timeout=30)

print("""
=========================================
📝 Credenciales de admin:
   Email:    admin@web-builder.com
   Password: admin123

🌐 Accede a: https://web-builder.scram2k.com/auth/login
=========================================
""")
