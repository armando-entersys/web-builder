@echo off
echo ========================================
echo   Web Builder - Database Seed Script
echo ========================================
echo.

echo Step 1: Pushing database schema...
cd packages\db
set DATABASE_URL=postgresql://postgres:password@localhost:5432/webbuilder?schema=public
call pnpm db:push

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to push database schema!
    echo Make sure PostgreSQL is running on localhost:5432
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Seeding database with test data...
call pnpm db:seed

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to seed database!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Seed completed successfully!
echo ========================================
echo.
echo You can now login with these credentials:
echo   Admin:  admin@webbuilder.com / admin123
echo   User 1: user1@example.com / user123
echo   User 2: user2@example.com / user123
echo   Editor: editor@webbuilder.com / editor123
echo.
pause
