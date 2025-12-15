@echo off
chcp 65001 >nul
color 0E

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ⚡ CREACIÓN RÁPIDA DE COMPONENTES - Alqvimia RPA              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Selecciona el tipo de componente que deseas crear:
echo.
echo   COMUNICACIÓN:
echo   [1] WhatsApp         - Enviar mensajes por WhatsApp
echo   [2] Telegram         - Enviar mensajes por Telegram
echo   [3] Email            - Enviar correos electrónicos
echo   [4] API REST         - Llamadas a APIs REST
echo.
echo   EXCEL:
echo   [5] Leer Excel       - Leer datos de Excel
echo   [6] Escribir Excel   - Escribir en Excel
echo.
echo   ARCHIVOS:
echo   [7] Leer Archivo     - Leer archivos de texto
echo   [8] Escribir Archivo - Escribir archivos de texto
echo.
echo   BASE DE DATOS:
echo   [9] Query SQL        - Ejecutar consultas SQL
echo.
echo   WEB:
echo   [10] Navegar URL     - Navegar a una página
echo.
echo   UTILIDADES:
echo   [11] Validar Email   - Validar formato de email
echo   [12] Esperar         - Pausar ejecución
echo   [13] Log             - Registrar mensajes
echo.
echo   [0] Componente personalizado (asistente completo)
echo.

set /p opcion="Ingresa el número de tu selección: "

if "%opcion%"=="1" (
    node plantillas-componentes.js whatsapp
) else if "%opcion%"=="2" (
    node plantillas-componentes.js telegram
) else if "%opcion%"=="3" (
    node plantillas-componentes.js email
) else if "%opcion%"=="4" (
    node plantillas-componentes.js api-rest
) else if "%opcion%"=="5" (
    node plantillas-componentes.js excel-leer
) else if "%opcion%"=="6" (
    node plantillas-componentes.js excel-escribir
) else if "%opcion%"=="7" (
    node plantillas-componentes.js archivo-leer
) else if "%opcion%"=="8" (
    node plantillas-componentes.js archivo-escribir
) else if "%opcion%"=="9" (
    node plantillas-componentes.js database-query
) else if "%opcion%"=="10" (
    node plantillas-componentes.js web-navegacion
) else if "%opcion%"=="11" (
    node plantillas-componentes.js validar-email
) else if "%opcion%"=="12" (
    node plantillas-componentes.js delay
) else if "%opcion%"=="13" (
    node plantillas-componentes.js log
) else if "%opcion%"=="0" (
    node generar-componentes.js
) else (
    echo.
    echo ❌ Opción inválida.
    echo.
    pause
    exit /b 1
)

echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo ✓ Proceso completado
echo ═══════════════════════════════════════════════════════════════
echo.
echo Los componentes generados se encuentran en:
echo   📁 public\js\components\
echo.
echo Para usarlos en tu aplicación:
echo   1. Recarga la interfaz web del sistema RPA
echo   2. Los nuevos componentes aparecerán en el palette
echo   3. Arrastra y suelta para usarlos en workflows
echo.

pause
