#!/bin/bash

# Deploy Web Builder to Production Server (dev-server)
# Domain: web-builder.scram2k.com
# Server: 34.134.14.202 (dev-server)

set -e

echo "========================================="
echo "  Web Builder - Production Deployment"
echo "  Domain: web-builder.scram2k.com"
echo "========================================="
echo ""

# Configuration
SERVER="dev-server"
ZONE="us-central1-c"
PROJECT_DIR="/srv/servicios/web-builder"
LOCAL_DIR="."

echo "📋 Pre-flight checks..."

# Check if gcloud is configured
if ! gcloud config get-value project &> /dev/null; then
    echo "❌ gcloud is not configured. Please run: gcloud init"
    exit 1
fi

echo "✅ gcloud configured"

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ .env.prod file not found!"
    echo "Please create .env.prod with your production environment variables"
    exit 1
fi

echo "✅ .env.prod found"

# Check if AUTH_SECRET is configured
if grep -q "REPLACE_WITH_RANDOM_SECRET" .env.prod; then
    echo "❌ AUTH_SECRET not configured in .env.prod"
    echo "Please generate one with: openssl rand -base64 32"
    exit 1
fi

echo "✅ AUTH_SECRET configured"

echo ""
echo "🔧 Step 1: Creating project directory on server..."
gcloud compute ssh $SERVER --zone=$ZONE --command="sudo mkdir -p $PROJECT_DIR && sudo chown -R \$USER:$USER $PROJECT_DIR"

echo ""
echo "📦 Step 2: Transferring project files..."
echo "This may take a few minutes..."

# Create tar of the project excluding node_modules and other large files
echo "Creating archive..."
tar -czf /tmp/web-builder-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.turbo' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='temp-react-bits' \
    --exclude='.claude' \
    .

echo "Transferring archive to server..."
gcloud compute scp /tmp/web-builder-deploy.tar.gz $SERVER:~/web-builder-deploy.tar.gz --zone=$ZONE

echo "Extracting on server..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    tar -xzf ~/web-builder-deploy.tar.gz -C $PROJECT_DIR && \
    rm ~/web-builder-deploy.tar.gz
"

# Clean up local tar
rm /tmp/web-builder-deploy.tar.gz

echo ""
echo "🔐 Step 3: Configuring environment variables..."
gcloud compute scp .env.prod $SERVER:$PROJECT_DIR/.env --zone=$ZONE

echo ""
echo "🐳 Step 4: Building and deploying containers..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    cd $PROJECT_DIR && \
    # Use production docker-compose
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true && \
    docker-compose -f docker-compose.prod.yml build --no-cache && \
    docker-compose -f docker-compose.prod.yml up -d
"

echo ""
echo "⏳ Step 5: Waiting for containers to start..."
sleep 10

echo ""
echo "🔍 Step 6: Verifying deployment..."
gcloud compute ssh $SERVER --zone=$ZONE --command="
    cd $PROJECT_DIR && \
    docker-compose -f docker-compose.prod.yml ps
"

echo ""
echo "========================================="
echo "  ✅ Deployment Complete!"
echo "========================================="
echo ""
echo "🌐 Application URL: https://web-builder.scram2k.com"
echo ""
echo "📊 View logs:"
echo "   gcloud compute ssh $SERVER --zone=$ZONE"
echo "   cd $PROJECT_DIR"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔑 Test Credentials (if SEED_DB=true):"
echo "   Admin:  admin@webbuilder.com / admin123"
echo "   User 1: user1@example.com / user123"
echo ""
echo "🛑 Stop containers:"
echo "   gcloud compute ssh $SERVER --zone=$ZONE"
echo "   cd $PROJECT_DIR"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""
