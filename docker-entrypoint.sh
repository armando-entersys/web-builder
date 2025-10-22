#!/bin/sh
set -e

echo "🚀 Starting Web Builder..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until PGPASSWORD=password psql -h "postgres" -U "postgres" -d "webbuilder" -c '\q' 2>/dev/null; do
  echo "⏳ Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "📦 Running database migrations..."
cd /app/packages/db
pnpm prisma db push --accept-data-loss || true

# Run seed (only if SEED_DB=true)
if [ "$SEED_DB" = "true" ]; then
  echo "🌱 Seeding database..."
  pnpm db:seed || echo "⚠️  Seed failed or already seeded"
fi

# Start the application
echo "🎉 Starting application..."
cd /app/apps/web
exec node server.js
