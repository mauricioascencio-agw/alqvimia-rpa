@echo off
chcp 65001 >nul
title Alqvimia RPA - Herramientas
color 0E

:MENU
cls
echo.
echo  ╔═══════════════════════════════════════════════════════════════╗
echo  ║            ALQVIMIA RPA - HERRAMIENTAS                        ║
echo  ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   [1] Verificar estado del sistema
echo   [2] Actualizar dependencias (npm update)
echo   [3] Limpiar cache (npm cache clean)
echo   [4] Verificar vulnerabilidades (npm audit)
echo   [5] Generar componente nuevo
echo   [6] Abrir documentacion
echo   [7] Ver logs del servidor
echo   [8] Abrir carpeta de workflows
echo.
echo   [0] Salir
echo.
echo  ════════════════════════════════════════════════════════════════
echo.
set /p opcion="  Selecciona una opcion: "

if "%opcion%"=="1" goto VERIFICAR
if "%opcion%"=="2" goto ACTUALIZAR
if "%opcion%"=="3" goto LIMPIAR
if "%opcion%"=="4" goto AUDIT
if "%opcion%"=="5" goto COMPONENTE
if "%opcion%"=="6" goto DOCS
if "%opcion%"=="7" goto LOGS
if "%opcion%"=="8" goto WORKFLOWS
if "%opcion%"=="0" goto SALIR

echo.
echo  [ERROR] Opcion no valida
timeout /t 2 >nul
goto MENU

:VERIFICAR
cls
echo.
echo  ══════════════════════════════════════════════════════════════════
echo   VERIFICANDO SISTEMA
echo  ══════════════════════════════════════════════════════════════════
echo.

echo  [Node.js]
node -v 2>nul || echo    No instalado

echo.
echo  [npm]
npm -v 2>nul || echo    No instalado

echo.
echo  [Dependencias]
if exist "node_modules" (
    echo    Carpeta node_modules existe - OK
) else (
    echo    [!] Ejecuta INSTALAR.bat primero
)

echo.
echo  [Carpetas]
if exist "workflows" (echo    workflows/ - OK) else (echo    [!] workflows/ no existe)
if exist "logs" (echo    logs/ - OK) else (echo    [!] logs/ no existe)
if exist "documentacion" (echo    documentacion/ - OK) else (echo    [!] documentacion/ no existe)

echo.
echo  [Puerto 3000]
netstat -an | findstr ":3000" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    Puerto 3000 en uso (servidor activo?)
) else (
    echo    Puerto 3000 libre
)

echo.
echo  ══════════════════════════════════════════════════════════════════
echo.
pause
goto MENU

:ACTUALIZAR
cls
echo.
echo  Actualizando dependencias...
echo.
call npm update
echo.
echo  Actualizacion completada.
echo.
pause
goto MENU

:LIMPIAR
cls
echo.
echo  Limpiando cache de npm...
echo.
call npm cache clean --force
echo.
echo  Cache limpiado.
echo.
pause
goto MENU

:AUDIT
cls
echo.
echo  Verificando vulnerabilidades...
echo.
call npm audit
echo.
echo  ══════════════════════════════════════════════════════════════════
echo.
echo  Para corregir automaticamente: npm audit fix
echo.
pause
goto MENU

:COMPONENTE
cls
echo.
echo  ══════════════════════════════════════════════════════════════════
echo   GENERAR COMPONENTE
echo  ══════════════════════════════════════════════════════════════════
echo.
echo  Esta funcionalidad abre la interfaz web para generar componentes.
echo.
echo  1. Inicia el servidor (INICIAR.bat)
echo  2. Abre http://localhost:3000
echo  3. Ve a Biblioteca ^> Generar Componente
echo.
pause
goto MENU

:DOCS
cls
echo.
echo  Abriendo carpeta de documentacion...
start "" "documentacion"
echo.
timeout /t 2 >nul
goto MENU

:LOGS
cls
echo.
if exist "logs" (
    echo  Abriendo carpeta de logs...
    start "" "logs"
) else (
    echo  [!] Carpeta logs no existe
    echo  Ejecuta el servidor para generar logs.
)
echo.
timeout /t 2 >nul
goto MENU

:WORKFLOWS
cls
echo.
if exist "workflows" (
    echo  Abriendo carpeta de workflows...
    start "" "workflows"
) else (
    echo  [!] Carpeta workflows no existe
    mkdir workflows
    start "" "workflows"
)
echo.
timeout /t 2 >nul
goto MENU

:SALIR
cls
exit /b 0
