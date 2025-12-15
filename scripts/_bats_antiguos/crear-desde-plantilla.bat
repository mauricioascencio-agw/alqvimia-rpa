@echo off
chcp 65001 >nul
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  📦 PLANTILLAS DE COMPONENTES - Alqvimia RPA                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

if "%1"=="" (
    echo Mostrando todas las plantillas disponibles...
    echo.
    node plantillas-componentes.js
) else (
    echo Creando componente desde plantilla: %1
    echo.
    node plantillas-componentes.js %1
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al ejecutar el generador.
    echo    Verifica que Node.js esté instalado correctamente.
    echo.
)

echo.
pause
