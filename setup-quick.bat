@echo off
echo ========================================
echo  INSTALACION RAPIDA - OMNICANALIDAD
echo ========================================
echo.

echo Este script instalara las dependencias necesarias.
echo.
echo Dependencias a instalar:
echo - whatsapp-web.js
echo - node-telegram-bot-api
echo.
pause

echo.
echo Instalando dependencias...
echo.

call npm install whatsapp-web.js node-telegram-bot-api

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Hubo un problema con la instalacion
    echo.
    echo Intenta manualmente:
    echo npm install whatsapp-web.js
    echo npm install node-telegram-bot-api
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  INSTALACION EXITOSA
echo ========================================
echo.
echo Las dependencias fueron instaladas correctamente.
echo.
echo Proximos pasos:
echo 1. Ejecuta: start-server.bat
echo 2. Abre otra terminal y ejecuta: init-omnichannel.bat
echo.
echo Documentacion: INSTALACION_RAPIDA_OMNICANALIDAD.md
echo.
pause
