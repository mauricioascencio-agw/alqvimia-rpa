@echo off
echo ========================================
echo  INSTALADOR DE OMNICANALIDAD
echo  Alqvimia RPA - WhatsApp y Telegram
echo ========================================
echo.

echo [1/3] Verificando Node.js y npm...
echo.

rem Verificar Node.js con timeout
node --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

rem Verificar npm
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm no esta disponible
    pause
    exit /b 1
)

echo OK - Node.js y npm encontrados
echo.

echo [2/3] Instalando dependencias de omnicanalidad...
echo.
echo Instalando whatsapp-web.js...
call npm install whatsapp-web.js
if %errorlevel% neq 0 (
    echo ERROR: No se pudo instalar whatsapp-web.js
    pause
    exit /b 1
)

echo.
echo Instalando node-telegram-bot-api...
call npm install node-telegram-bot-api
if %errorlevel% neq 0 (
    echo ERROR: No se pudo instalar node-telegram-bot-api
    pause
    exit /b 1
)

echo.
echo [3/3] Verificando instalacion...
npm list whatsapp-web.js >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: whatsapp-web.js puede no estar correctamente instalado
)

npm list node-telegram-bot-api >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: node-telegram-bot-api puede no estar correctamente instalado
)

echo.
echo ========================================
echo  INSTALACION COMPLETADA
echo ========================================
echo.
echo Las siguientes dependencias fueron instaladas:
echo - whatsapp-web.js (para WhatsApp)
echo - node-telegram-bot-api (para Telegram)
echo.
echo Proximos pasos:
echo 1. Ejecuta start-server.bat para iniciar el servidor
echo 2. Sigue la guia en INSTALACION_RAPIDA_OMNICANALIDAD.md
echo.
pause
