@echo off
echo Starting RentOS System...
echo.

REM Start Backend
echo Starting Backend (NestJS + PostgreSQL)...
cd rentos-backend
docker-compose up -d
echo Backend started
echo.

REM Wait for PostgreSQL
echo Waiting for PostgreSQL to be ready (30 seconds)...
timeout /t 30 /nobreak >nul
echo PostgreSQL ready
echo.

REM Seed database
echo Seeding database with initial data...
call npm run seed
echo Database seeded
echo.

REM Start Frontend
echo Starting Frontend (Next.js)...
cd ..\RentOS
docker-compose up -d
echo Frontend started
echo.

REM Show status
echo.
echo ========================================
echo RentOS System is ready!
echo ========================================
echo.
echo Access the application:
echo   Frontend:     http://localhost:3000
echo   Backend API:  http://localhost:3001
echo   Swagger Docs: http://localhost:3001/api
echo.
echo Default credentials:
echo   Email:    admin@rentos.com
echo   Password: admin123
echo.
echo To stop the system, run: stop-all.bat
echo.
pause
