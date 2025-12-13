@echo off
chcp 65001 >nul
color 0A

echo.
echo ================================================================
echo   INICIANDO SERVIDOR - ALQVIMIA RPA
echo   Con Sistema de Videoconferencia Integrado
echo ================================================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo         Ejecuta primero: instalar-videoconferencia.bat
    echo.
    pause
    exit /b 1
)

REM Verificar dependencias
if not exist "node_modules\multer" (
    echo [AVISO] Dependencias de videoconferencia no instaladas
    echo         Ejecutando instalacion automatica...
    echo.
    call npm install multer nodemailer
)

REM Cargar variables de entorno si existe .env
if exist ".env" (
    echo [OK] Configuracion SMTP detectada
    echo      Se cargaran las variables de entorno
    echo.
)

echo ----------------------------------------------------------------
echo CARACTERISTICAS DISPONIBLES:
echo ----------------------------------------------------------------
echo.
echo   [OK] Element Spy
echo   [OK] Grabador de Acciones
echo   [OK] Editor de Workflows
echo   [OK] Ejecutor de Automatizaciones
echo   [OK] Sistema de IA
echo   [OK] Omnicanalidad (WhatsApp/Telegram^)
echo   [OK] VIDEOCONFERENCIA V2.0 (NUEVO^)
echo.
echo        - Emojis en chat
echo        - Filtros de video
echo        - Avatares automaticos
echo        - Selector de proyectos
echo        - Barra de progreso
echo        - Confirmacion detallada
echo.
echo ----------------------------------------------------------------
echo INICIANDO SERVIDOR...
echo ----------------------------------------------------------------
echo.

REM Iniciar servidor
npm start

REM Si el servidor se detiene
echo.
echo ================================================================
echo   SERVIDOR DETENIDO
echo ================================================================
echo.
echo Para reiniciar, ejecuta nuevamente este archivo.
echo.

pause
