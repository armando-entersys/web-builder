#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Admin User in Database
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
  Verificando Usuario en Base de Datos
=========================================
""")

# Check all users in database
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"""cd {PROJECT_DIR} && docker compose exec -T web node -e "
(async () => {{
  const {{ PrismaClient }} = require('@prisma/client');
  const prisma = new PrismaClient();
  try {{
    const users = await prisma.user.findMany();
    console.log('Total usuarios:', users.length);
    console.log('');
    users.forEach(user => {{
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Password hash:', user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD');
      console.log('---');
    }});
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
