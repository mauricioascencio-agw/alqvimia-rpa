@echo off
chcp 65001 >nul
title Alqvimia RPA - Instalador
color 0B

echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║            ALQVIMIA RPA - INSTALADOR                          ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM ══════════════════════════════════════════════════════════════════
REM  VERIFICAR NODE.JS
REM ══════════════════════════════════════════════════════════════════

echo  [1/4] Verificando Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo  [ERROR] Node.js no esta instalado.
    echo.
    echo  Descarga Node.js desde: https://nodejs.org/
    echo  Recomendado: Version LTS (18.x o superior)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo         Node.js %NODE_VERSION% - OK
echo.

REM ══════════════════════════════════════════════════════════════════
REM  INSTALAR DEPENDENCIAS PRINCIPALES
REM ══════════════════════════════════════════════════════════════════

echo  [2/4] Instalando dependencias principales...
echo.

if exist "node_modules" (
    echo         Dependencias ya instaladas. Actualizando...
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b 1
)
echo.
echo         Dependencias principales - OK
echo.

REM ══════════════════════════════════════════════════════════════════
REM  VERIFICAR CARPETAS NECESARIAS
REM ══════════════════════════════════════════════════════════════════

echo  [3/4] Verificando estructura de carpetas...
echo.

if not exist "workflows" mkdir workflows
if not exist "workflows\general" mkdir workflows\general
if not exist "workflows\general\Video" mkdir workflows\general\Video
if not exist "logs" mkdir logs
if not exist "temp" mkdir temp

echo         Carpetas verificadas - OK
echo.

REM ══════════════════════════════════════════════════════════════════
REM  VERIFICAR ARCHIVOS DE CONFIGURACION
REM ══════════════════════════════════════════════════════════════════

echo  [4/4] Verificando configuracion...
echo.

if not exist ".env" (
    echo # Configuracion de Alqvimia RPA > .env
    echo PORT=3000 >> .env
    echo # SMTP_HOST=smtp.gmail.com >> .env
    echo # SMTP_PORT=587 >> .env
    echo # SMTP_USER= >> .env
    echo # SMTP_PASS= >> .env
    echo         Archivo .env creado
) else (
    echo         Archivo .env existente - OK
)
echo.

REM ══════════════════════════════════════════════════════════════════
REM  INSTALACION COMPLETADA
REM ══════════════════════════════════════════════════════════════════

color 0A
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║          INSTALACION COMPLETADA EXITOSAMENTE                  ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
echo  Para iniciar el sistema:
echo.
echo    1. Ejecuta: INICIAR.bat
echo    2. Abre en navegador: http://localhost:3000
echo.
echo  Documentacion disponible en: /documentacion
echo.
echo  ════════════════════════════════════════════════════════════════
echo.
pause
