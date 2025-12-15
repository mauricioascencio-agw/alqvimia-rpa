@echo off
chcp 65001 >nul
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🧪 TEST - SISTEMA DE VIDEOCONFERENCIA                         ║
echo ║                    Alqvimia RPA                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Este script verifica que el sistema de videoconferencia
echo esté correctamente instalado e integrado.
echo.

REM Verificación 1: Node.js
echo [1/8] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo     ❌ Node.js no encontrado
    set ERROR=1
) else (
    echo     ✅ Node.js instalado
    node --version
)
echo.

REM Verificación 2: Dependencias
echo [2/8] Verificando dependencias npm...
if exist "node_modules\multer" (
    echo     ✅ multer instalado
) else (
    echo     ❌ multer NO instalado
    set ERROR=1
)

if exist "node_modules\nodemailer" (
    echo     ✅ nodemailer instalado
) else (
    echo     ⚠️  nodemailer NO instalado (opcional)
)
echo.

REM Verificación 3: Archivos Frontend
echo [3/8] Verificando archivos frontend...
if exist "public\js\video-conference.js" (
    echo     ✅ video-conference.js presente
) else (
    echo     ❌ video-conference.js NO encontrado
    set ERROR=1
)

if exist "public\js\video-conference-features.js" (
    echo     ✅ video-conference-features.js presente
) else (
    echo     ❌ video-conference-features.js NO encontrado
    set ERROR=1
)

if exist "public\css\video-conference.css" (
    echo     ✅ video-conference.css presente
) else (
    echo     ❌ video-conference.css NO encontrado
    set ERROR=1
)
echo.

REM Verificación 4: Archivos Backend
echo [4/8] Verificando archivos backend...
if exist "server\video-conference-routes.js" (
    echo     ✅ video-conference-routes.js presente
) else (
    echo     ❌ video-conference-routes.js NO encontrado
    set ERROR=1
)
echo.

REM Verificación 5: Integración en index.html
echo [5/8] Verificando integración en index.html...
findstr /C:"video-conference.css" public\index.html >nul
if %ERRORLEVEL% EQU 0 (
    echo     ✅ CSS integrado en index.html
) else (
    echo     ❌ CSS NO integrado en index.html
    set ERROR=1
)

findstr /C:"video-conference.js" public\index.html >nul
if %ERRORLEVEL% EQU 0 (
    echo     ✅ Scripts integrados en index.html
) else (
    echo     ❌ Scripts NO integrados en index.html
    set ERROR=1
)

findstr /C:"videoconference-btn" public\index.html >nul
if %ERRORLEVEL% EQU 0 (
    echo     ✅ Botón UI agregado en index.html
) else (
    echo     ❌ Botón UI NO agregado en index.html
    set ERROR=1
)
echo.

REM Verificación 6: Integración en servidor
echo [6/8] Verificando integración en servidor...
findstr /C:"video-conference-routes" server\index.js >nul
if %ERRORLEVEL% EQU 0 (
    echo     ✅ Rutas integradas en server/index.js
) else (
    echo     ❌ Rutas NO integradas en server/index.js
    set ERROR=1
)
echo.

REM Verificación 7: Carpeta workflows
echo [7/8] Verificando carpeta workflows...
if exist "workflows" (
    echo     ✅ Carpeta workflows existe
) else (
    echo     ⚠️  Carpeta workflows no existe (se creará automáticamente)
    mkdir workflows 2>nul
)
echo.

REM Verificación 8: Configuración SMTP (opcional)
echo [8/8] Verificando configuración SMTP (opcional)...
if exist ".env" (
    echo     ✅ Archivo .env encontrado
    echo        Invitaciones por email: HABILITADAS
) else (
    echo     ⚠️  Archivo .env no encontrado
    echo        Invitaciones por email: DESHABILITADAS
    echo        Ejecuta configurar-smtp.bat para habilitar
)
echo.

REM Resultado final
echo ╔════════════════════════════════════════════════════════════════╗
if defined ERROR (
    echo ║  ❌ VERIFICACIÓN FALLIDA                                       ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo Se encontraron errores. Por favor:
    echo.
    echo 1. Ejecuta: instalar-videoconferencia.bat
    echo 2. Verifica que todos los archivos estén presentes
    echo 3. Vuelve a ejecutar este test
    echo.
) else (
    echo ║  ✅ VERIFICACIÓN EXITOSA                                       ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo El sistema de videoconferencia está correctamente instalado
    echo y listo para usar.
    echo.
    echo PRÓXIMOS PASOS:
    echo.
    echo 1. Inicia el servidor:
    echo    iniciar-servidor.bat
    echo.
    echo 2. Abre tu navegador en:
    echo    http://localhost:3000
    echo.
    echo 3. Click en "Videoconferencia" en el sidebar
    echo.
    echo 4. ¡Disfruta del sistema completo!
    echo.
)

echo ─────────────────────────────────────────────────────────────────
echo DOCUMENTACIÓN DISPONIBLE:
echo ─────────────────────────────────────────────────────────────────
echo.
echo • VIDEOCONFERENCIA_INICIO_RAPIDO.md  - Guía de 5 minutos
echo • INTEGRACION_COMPLETADA.md          - Cambios realizados
echo • INDICE_VIDEOCONFERENCIA.md         - Índice de recursos
echo • invitees-example.json              - Ejemplo de invitados
echo.

pause
