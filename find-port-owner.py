#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Find what is using port 5432 on Production Server
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

print("Finding what is using port 5432...")
print("="*60)

# Check what's listening on port 5432
print("\n1. Processes listening on port 5432:")
run_ssh_command("sudo ss -tlnp | grep ':5432'")

# Check for PostgreSQL processes
print("\n2. PostgreSQL processes:")
run_ssh_command("ps aux | grep postgres | grep -v grep")

# Check for Docker containers (running or stopped)
print("\n3. All Docker containers:")
run_ssh_command("docker ps -a")

# Check Docker networks
print("\n4. Docker networks:")
run_ssh_command("docker network ls")

print("\n" + "="*60)
