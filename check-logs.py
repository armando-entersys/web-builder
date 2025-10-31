#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check production logs
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
  Verificar logs del servidor
=========================================
""")

# Check logs
print("Obteniendo últimos 50 logs del contenedor web...")
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose logs web --tail 50"
]

result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

print("""
=========================================
""")
