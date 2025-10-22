#!/bin/bash

echo "========================================="
echo "   Web Builder - Docker Deployment"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.docker template..."
    cp .env.docker .env
    echo ""
    echo "⚠️  Please edit .env file and add your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - GOOGLE_AI_API_KEY"
    echo "   - AUTH_SECRET (generate with: openssl rand -base64 32)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if AUTH_SECRET is set
if grep -q "generate-a-random-secret-here" .env; then
    echo "⚠️  WARNING: AUTH_SECRET not configured!"
    echo "Generate one with: openssl rand -base64 32"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🐳 Starting Docker containers..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "   ✅ Deployment Successful!"
    echo "========================================="
    echo ""
    echo "🌐 Application: http://localhost:3000"
    echo "🗄️  Database: localhost:5432"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop containers:"
    echo "   docker-compose down"
    echo ""

    if grep -q "SEED_DB=true" .env; then
        echo "🌱 Database will be seeded with test data"
        echo ""
        echo "🔑 Test Credentials:"
        echo "   Admin:  admin@webbuilder.com / admin123"
        echo "   User 1: user1@example.com / user123"
        echo "   User 2: user2@example.com / user123"
        echo "   Editor: editor@webbuilder.com / editor123"
        echo ""
    fi
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check logs with: docker-compose logs"
    exit 1
fi
