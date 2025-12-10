@echo off
echo ========================================
echo  INICIALIZADOR DE OMNICANALIDAD
echo ========================================
echo.

if not exist "omnichannel-config.js" (
    echo ERROR: No se encontro el archivo de configuracion
    echo.
    echo Por favor ejecuta primero: test-omnichannel-setup.bat
    echo.
    pause
    exit /b 1
)

if not exist "init-omnichannel.js" (
    echo ERROR: No se encontro el script de inicializacion
    echo.
    echo Por favor ejecuta primero: test-omnichannel-setup.bat
    echo.
    pause
    exit /b 1
)

echo Verificando que el servidor este corriendo...
echo.

timeout /t 2 /nobreak >nul

echo Ejecutando script de inicializacion...
echo.

node init-omnichannel.js

echo.
echo ========================================
echo.
echo Si ves un QR code arriba:
echo 1. Copia el texto completo del QR
echo 2. Ve a https://qrcode.show/
echo 3. Pegalo para verlo como imagen
echo 4. Escanea con WhatsApp
echo.
echo ========================================
echo.
pause
