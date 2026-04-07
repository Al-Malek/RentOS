@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Verificando integracion RentOS...
echo ========================================
echo.

REM Test 1: Backend
echo 1. Verificando backend...
curl -s -o nul -w "%%{http_code}" http://localhost:3001/vehiculos > temp_status.txt 2>nul
set /p BACKEND_STATUS=<temp_status.txt
del temp_status.txt 2>nul

if "%BACKEND_STATUS%"=="200" (
    echo [OK] Backend OK ^(Status: %BACKEND_STATUS%^)
    set BACKEND_OK=1
) else if "%BACKEND_STATUS%"=="401" (
    echo [OK] Backend OK ^(Status: %BACKEND_STATUS%^)
    set BACKEND_OK=1
) else (
    echo [ERROR] Backend ERROR ^(Status: %BACKEND_STATUS%^)
    echo    Asegurate de que el backend este corriendo: cd rentos-backend ^&^& docker-compose up -d
    set BACKEND_OK=0
)
echo.

REM Test 2: Frontend
echo 2. Verificando frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_status.txt 2>nul
set /p FRONTEND_STATUS=<temp_status.txt
del temp_status.txt 2>nul

if "%FRONTEND_STATUS%"=="200" (
    echo [OK] Frontend OK ^(Status: %FRONTEND_STATUS%^)
    set FRONTEND_OK=1
) else if "%FRONTEND_STATUS%"=="307" (
    echo [OK] Frontend OK ^(Status: %FRONTEND_STATUS%^)
    set FRONTEND_OK=1
) else (
    echo [ERROR] Frontend ERROR ^(Status: %FRONTEND_STATUS%^)
    echo    Asegurate de que el frontend este corriendo: cd RentOS ^&^& npm run dev
    set FRONTEND_OK=0
)
echo.

REM Test 3: Database
echo 3. Verificando PostgreSQL...
docker ps | findstr postgres >nul 2>&1
if %errorlevel%==0 (
    echo [OK] PostgreSQL corriendo
    set DB_OK=1
) else (
    echo [ERROR] PostgreSQL no encontrado
    echo    Inicia PostgreSQL: cd rentos-backend ^&^& docker-compose up -d postgres
    set DB_OK=0
)
echo.

REM Test 4: API Endpoints
if "%BACKEND_OK%"=="1" (
    echo 4. Verificando endpoints API...
    
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/vehiculos > temp_status.txt 2>nul
    set /p STATUS=<temp_status.txt
    if "!STATUS!"=="200" (echo [OK] /vehiculos ^(Status: !STATUS!^)) else (echo [ERROR] /vehiculos ^(Status: !STATUS!^))
    
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/clientes > temp_status.txt 2>nul
    set /p STATUS=<temp_status.txt
    if "!STATUS!"=="200" (echo [OK] /clientes ^(Status: !STATUS!^)) else (echo [ERROR] /clientes ^(Status: !STATUS!^))
    
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/reservas > temp_status.txt 2>nul
    set /p STATUS=<temp_status.txt
    if "!STATUS!"=="200" (echo [OK] /reservas ^(Status: !STATUS!^)) else (echo [ERROR] /reservas ^(Status: !STATUS!^))
    
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/tarifas > temp_status.txt 2>nul
    set /p STATUS=<temp_status.txt
    if "!STATUS!"=="200" (echo [OK] /tarifas ^(Status: !STATUS!^)) else (echo [ERROR] /tarifas ^(Status: !STATUS!^))
    
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/dashboard/metricas > temp_status.txt 2>nul
    set /p STATUS=<temp_status.txt
    if "!STATUS!"=="200" (echo [OK] /dashboard/metricas ^(Status: !STATUS!^)) else (echo [ERROR] /dashboard/metricas ^(Status: !STATUS!^))
    
    del temp_status.txt 2>nul
    echo.
)

REM Test 5: Environment Variables
echo 5. Verificando variables de entorno...
if exist "RentOS\.env.local" (
    findstr "NEXT_PUBLIC_API_URL" RentOS\.env.local >nul 2>&1
    if %errorlevel%==0 (
        echo [OK] NEXT_PUBLIC_API_URL configurado
    ) else (
        echo [ERROR] NEXT_PUBLIC_API_URL no encontrado en .env.local
    )
) else (
    echo [WARNING] Archivo .env.local no encontrado
    echo    Crea el archivo: copy RentOS\.env.local.example RentOS\.env.local
)

if exist "rentos-backend\.env" (
    echo [OK] Backend .env encontrado
) else (
    echo [WARNING] Backend .env no encontrado
    echo    Crea el archivo: copy rentos-backend\.env.example rentos-backend\.env
)
echo.

REM Test 6: Swagger
if "%BACKEND_OK%"=="1" (
    echo 6. Verificando Swagger docs...
    curl -s -o nul -w "%%{http_code}" http://localhost:3001/api/docs > temp_status.txt 2>nul
    set /p SWAGGER_STATUS=<temp_status.txt
    del temp_status.txt 2>nul
    
    if "!SWAGGER_STATUS!"=="200" (
        echo [OK] Swagger docs disponible: http://localhost:3001/api/docs
    ) else (
        echo [WARNING] Swagger docs no accesible ^(Status: !SWAGGER_STATUS!^)
    )
    echo.
)

REM Summary
echo ========================================
echo Resumen de Verificacion
echo ========================================

if "%BACKEND_OK%"=="1" if "%FRONTEND_OK%"=="1" if "%DB_OK%"=="1" (
    echo.
    echo [OK] Todo esta funcionando correctamente!
    echo.
    echo Accede a la aplicacion:
    echo   Frontend: http://localhost:3000
    echo   Backend:  http://localhost:3001
    echo   Swagger:  http://localhost:3001/api/docs
    echo.
    echo Credenciales por defecto:
    echo   Email:    admin@rentos.com
    echo   Password: admin123
) else (
    echo.
    echo [ERROR] Hay problemas que necesitan atencion
    echo.
    echo Pasos para solucionar:
    if "%DB_OK%"=="0" (
        echo   1. Inicia PostgreSQL: cd rentos-backend ^&^& docker-compose up -d postgres
    )
    if "%BACKEND_OK%"=="0" (
        echo   2. Inicia el backend: cd rentos-backend ^&^& docker-compose up -d
        echo      O en modo dev: cd rentos-backend ^&^& npm run start:dev
    )
    if "%FRONTEND_OK%"=="0" (
        echo   3. Inicia el frontend: cd RentOS ^&^& npm run dev
    )
)

echo.
echo ========================================
echo.
pause
