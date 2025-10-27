#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check Web Builder Status on Production Server
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

def run_ssh_command(command):
    """Execute command on remote server via gcloud ssh"""
    ssh_cmd = [
        "gcloud.cmd", "compute", "ssh", SERVER,
        "--zone", ZONE,
        "--command", command
    ]

    result = subprocess.run(
        ssh_cmd,
        capture_output=True,
        text=True,
        timeout=60
    )

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    return result.returncode == 0

print("Checking Web Builder status on prod-server...")
print("="*60)

# Check if containers are running
print("\n1. Docker Compose Status:")
run_ssh_command(f"cd {PROJECT_DIR} && docker compose ps")

# Check logs
print("\n2. Application Logs (last 30 lines):")
run_ssh_command(f"cd {PROJECT_DIR} && docker compose logs --tail=30 web")

# Check if port is accessible
print("\n3. Port Check:")
run_ssh_command("netstat -tuln | grep 3000")

print("\n" + "="*60)
print("Status check complete")
