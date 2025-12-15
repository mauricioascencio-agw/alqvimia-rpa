@echo off
chcp 65001 >nul
title Alqvimia RPA - Servidor
color 0A

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║                                                               ║
echo  ║     █████╗ ██╗      ██████╗ ██╗   ██╗██╗███╗   ███╗██╗ █████╗ ║
echo  ║    ██╔══██╗██║     ██╔═══██╗██║   ██║██║████╗ ████║██║██╔══██╗║
echo  ║    ███████║██║     ██║   ██║██║   ██║██║██╔████╔██║██║███████║║
echo  ║    ██╔══██║██║     ██║▄▄ ██║╚██╗ ██╔╝██║██║╚██╔╝██║██║██╔══██║║
echo  ║    ██║  ██║███████╗╚██████╔╝ ╚████╔╝ ██║██║ ╚═╝ ██║██║██║  ██║║
echo  ║    ╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝   ╚═══╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝║
echo  ║                                                               ║
echo  ║                    RPA Automation System                      ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Verificar si Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] Node.js no esta instalado.
    echo.
    echo  Por favor, instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si existe node_modules
if not exist "node_modules" (
    color 0E
    echo  [AVISO] Dependencias no instaladas.
    echo.
    echo  Instalando dependencias...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo  [ERROR] Fallo la instalacion de dependencias.
        pause
        exit /b 1
    )
    echo.
    color 0A
)

echo  [OK] Iniciando servidor...
echo.
echo  ════════════════════════════════════════════════════════════════
echo.
echo    URL Local:    http://localhost:3000
echo    Documentacion: /documentacion
echo.
echo    Presiona Ctrl+C para detener el servidor
echo.
echo  ════════════════════════════════════════════════════════════════
echo.

REM Iniciar servidor
node server/index.js

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  [ERROR] El servidor se detuvo con errores.
    echo.
    pause
)
