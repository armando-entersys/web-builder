@echo off
echo =========================================
echo    Web Builder - Docker Deployment
echo =========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Creating .env from .env.docker template...
    copy .env.docker .env
    echo.
    echo WARNING: Please edit .env file and add your API keys:
    echo    - OPENAI_API_KEY
    echo    - ANTHROPIC_API_KEY
    echo    - GOOGLE_AI_API_KEY
    echo    - AUTH_SECRET (generate with: openssl rand -base64 32)
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

REM Check if AUTH_SECRET is configured
findstr /C:"generate-a-random-secret-here" .env >nul
if %errorlevel%==0 (
    echo WARNING: AUTH_SECRET not configured!
    echo Generate one with: openssl rand -base64 32
    echo.
    set /p continue="Continue anyway? (y/N) "
    if /i not "%continue%"=="y" exit /b 1
)

echo Starting Docker containers...
docker-compose up -d --build

if %errorlevel%==0 (
    echo.
    echo =========================================
    echo    Deployment Successful!
    echo =========================================
    echo.
    echo Application: http://localhost:3000
    echo Database: localhost:5432
    echo.
    echo View logs:
    echo    docker-compose logs -f
    echo.
    echo Stop containers:
    echo    docker-compose down
    echo.

    findstr /C:"SEED_DB=true" .env >nul
    if %errorlevel%==0 (
        echo Database will be seeded with test data
        echo.
        echo Test Credentials:
        echo    Admin:  admin@webbuilder.com / admin123
        echo    User 1: user1@example.com / user123
        echo    User 2: user2@example.com / user123
        echo    Editor: editor@webbuilder.com / editor123
        echo.
    )
) else (
    echo.
    echo ERROR: Deployment failed!
    echo Check logs with: docker-compose logs
    pause
    exit /b 1
)

pause
