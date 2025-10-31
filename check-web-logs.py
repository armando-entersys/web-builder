#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Web Container Logs
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
  Logs del Contenedor Web
=========================================
""")

# Check logs from web container
ssh_cmd = [
    "gcloud.cmd", "compute", "ssh", SERVER,
    "--zone", ZONE,
    "--command",
    f"cd {PROJECT_DIR} && docker compose logs --tail=50 web"
]

print("Obteniendo últimas 50 líneas de logs...")
result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60, encoding='utf-8', errors='replace')

if result.stdout:
    print("\n=== Logs ===")
    print(result.stdout)
if result.stderr:
    print("\n=== Stderr ===")
    print(result.stderr, file=sys.stderr)

print("""
=========================================
""")
