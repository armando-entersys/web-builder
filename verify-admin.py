#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verify Admin User Creation
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
  Verificando Usuario Admin
=========================================
""")

# Check if admin user exists
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"""cd {PROJECT_DIR} && docker compose exec -T web node -e "
(async () => {{
  const {{ PrismaClient }} = require('@prisma/client');
  const prisma = new PrismaClient();
  try {{
    const user = await prisma.user.findUnique({{
      where: {{ email: 'admin@web-builder.com' }}
    }});
    if (user) {{
      console.log('✅ Usuario admin encontrado');
      console.log('Email:', user.email);
      console.log('Nombre:', user.name);
      console.log('ID:', user.id);
    }} else {{
      console.log('❌ Usuario admin NO existe');
    }}
  }} catch (e) {{
    console.error('Error:', e.message);
  }} finally {{
    await prisma.$disconnect();
  }}
}})();
"
"""
]

result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60)

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

print("""
=========================================
""")
