#!/bin/bash
# Script para despliegue remoto - Deployment #29

set -e

echo "===== Deployment #29: Mover Prisma a apps/web ====="
echo "Fecha: $(date)"
echo ""

cd /home/Usuario/web-builder

echo "1. Pulling latest code from master..."
git pull origin master

echo "2. Stopping containers..."
sudo docker compose down

echo "3. Building and starting containers..."
sudo docker compose up --build -d

echo "4. Waiting for containers to be ready..."
sleep 10

echo "5. Checking container status..."
sudo docker compose ps

echo ""
echo "===== Deployment #29 Complete ====="
echo "Check logs with: sudo docker compose logs -f web"
