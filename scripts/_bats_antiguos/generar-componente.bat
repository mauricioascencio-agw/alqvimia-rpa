@echo off
chcp 65001 >nul
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🤖 GENERADOR DE COMPONENTES - Alqvimia RPA                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Iniciando asistente interactivo...
echo.

node generar-componentes.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al ejecutar el generador.
    echo    Verifica que Node.js esté instalado correctamente.
    echo.
)

echo.
pause
