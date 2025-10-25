#!/bin/bash

# Deploy Web Builder to Production Server from GitHub
# Domain: web-builder.scram2k.com
# Server: prod-server (34.59.193.54)
# Repository: https://github.com/armando-entersys/web-builder

set -e

echo "========================================="
echo "  Web Builder - Production Deployment"
echo "  from GitHub Repository"
echo "  Domain: web-builder.scram2k.com"
echo "========================================="
echo ""

# Configuration
SERVER="prod-server"
ZONE="us-central1-c"
PROJECT_DIR="/srv/servicios/web-builder"
REPO_URL="https://github.com/armando-entersys/web-builder.git"
BRANCH="master"

echo "📋 Pre-flight checks..."

# Check if gcloud is configured
if ! gcloud config get-value project &> /dev/null; then
    echo "❌ gcloud is not configured. Please run: gcloud init"
    exit 1
fi

echo "✅ gcloud configured"

echo ""
echo "🔧 Step 1: Preparing production server..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    echo '📁 Creating project directory...' && \
    sudo mkdir -p $PROJECT_DIR && \
    sudo chown -R \$USER:\$USER $PROJECT_DIR && \
    echo '✅ Directory created: $PROJECT_DIR'
"

echo ""
echo "📦 Step 2: Cloning repository from GitHub..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    if [ -d '$PROJECT_DIR/.git' ]; then
        echo '🔄 Repository exists, pulling latest changes...'
        cd $PROJECT_DIR && \
        git pull origin $BRANCH
    else
        echo '📥 Cloning repository...'
        git clone $REPO_URL $PROJECT_DIR && \
        cd $PROJECT_DIR && \
        git checkout $BRANCH
    fi
"

echo ""
echo "🔐 Step 3: Configuring environment variables..."
# Note: .env file with production values should be manually created on the server
# or transferred securely. The .env.prod in the repo is just a template.
gcloud compute ssh $SERVER --zone=$ZONE --command="
    if [ ! -f '$PROJECT_DIR/.env' ]; then
        echo '⚠️  WARNING: .env file not found!'
        echo '   Creating .env from template. EDIT IT BEFORE RUNNING CONTAINERS!'
        cd $PROJECT_DIR && cp .env.prod .env
        echo '   You must edit $PROJECT_DIR/.env with your real API keys'
    else
        echo '✅ .env file already exists'
    fi
"

echo ""
echo "🔍 Step 4: Checking Docker and Traefik network..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    if ! docker network ls | grep -q traefik; then
        echo '🌐 Creating Traefik network...'
        docker network create traefik
    else
        echo '✅ Traefik network exists'
    fi
"

echo ""
echo "🐳 Step 5: Building and deploying containers..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    cd $PROJECT_DIR && \
    echo '🛑 Stopping existing containers (if any)...' && \
    docker compose -f docker-compose.prod.yml down 2>/dev/null || true && \
    echo '🏗️  Building Docker images...' && \
    docker compose -f docker-compose.prod.yml build --no-cache && \
    echo '🚀 Starting containers...' && \
    docker compose -f docker-compose.prod.yml up -d && \
    echo '✅ Containers started'
"

echo ""
echo "⏳ Step 6: Waiting for containers to be healthy..."
sleep 15

echo ""
echo "🔍 Step 7: Verifying deployment..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    cd $PROJECT_DIR && \
    echo '📊 Container Status:' && \
    docker compose -f docker-compose.prod.yml ps && \
    echo '' && \
    echo '📝 Recent Logs:' && \
    docker compose -f docker-compose.prod.yml logs --tail=20
"

echo ""
echo "========================================="
echo "  ✅ Deployment Complete!"
echo "========================================="
echo ""
echo "🌐 Application URL: https://web-builder.scram2k.com"
echo ""
echo "📊 Useful Commands:"
echo ""
echo "  View logs:"
echo "    gcloud compute ssh $SERVER --zone=$ZONE"
echo "    cd $PROJECT_DIR"
echo "    docker compose -f docker-compose.prod.yml logs -f web"
echo ""
echo "  Restart containers:"
echo "    docker compose -f docker-compose.prod.yml restart"
echo ""
echo "  Pull latest changes and redeploy:"
echo "    cd $PROJECT_DIR && git pull && docker compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "🔑 Test Credentials (if SEED_DB=true):"
echo "   Admin:  admin@webbuilder.com / admin123"
echo "   User 1: user1@example.com / user123"
echo "   User 2: user2@example.com / user123"
echo ""
