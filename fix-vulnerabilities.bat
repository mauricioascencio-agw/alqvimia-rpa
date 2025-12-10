@echo off
cls
echo ========================================
echo  SOLUCIONADOR DE VULNERABILIDADES
echo  Alqvimia RPA
echo ========================================
echo.

echo Este script arreglara las vulnerabilidades de seguridad
echo encontradas en las dependencias npm.
echo.
pause

echo.
echo [1/5] Creando backup de package-lock.json...
if exist package-lock.json (
    copy package-lock.json package-lock.json.backup >nul 2>&1
    echo OK - Backup creado: package-lock.json.backup
) else (
    echo ADVERTENCIA - No se encontro package-lock.json
)
echo.

echo [2/5] Analizando vulnerabilidades...
echo.
call npm audit
echo.

echo ========================================
echo.
echo Opciones:
echo 1. Arreglo SEGURO (sin breaking changes)
echo 2. Arreglo FORZADO (puede romper compatibilidad)
echo 3. Cancelar
echo.
set /p opcion="Selecciona una opcion (1-3): "

if "%opcion%"=="1" goto seguro
if "%opcion%"=="2" goto forzado
if "%opcion%"=="3" goto cancelar

echo Opcion invalida
pause
exit /b 1

:seguro
echo.
echo [3/5] Ejecutando arreglo SEGURO...
echo.
call npm audit fix
goto verificar

:forzado
echo.
echo [3/5] Ejecutando arreglo FORZADO...
echo ADVERTENCIA: Esto puede hacer cambios importantes
echo.
pause
call npm audit fix --force
goto verificar

:verificar
echo.
echo [4/5] Reinstalando dependencias...
call npm install
echo.

echo [5/5] Verificando resultado...
echo.
call npm audit
echo.

echo ========================================
echo  PROCESO COMPLETADO
echo ========================================
echo.
echo IMPORTANTE: Prueba que todo funcione:
echo.
echo 1. npm start
echo 2. node init.js
echo 3. Probar envio de mensajes
echo.
echo Si algo no funciona, restaura el backup:
echo   copy package-lock.json.backup package-lock.json
echo   npm install
echo.
pause
exit /b 0

:cancelar
echo.
echo Proceso cancelado
echo.
pause
exit /b 0
