@echo off
echo Stopping RentOS System...
echo.

REM Stop Frontend
echo Stopping Frontend...
cd RentOS
docker-compose down
echo Frontend stopped
echo.

REM Stop Backend
echo Stopping Backend...
cd ..\rentos-backend
docker-compose down
echo Backend stopped
echo.

echo.
echo ========================================
echo RentOS System stopped
echo ========================================
echo.
echo To start again, run: start-all.bat
echo.
pause
