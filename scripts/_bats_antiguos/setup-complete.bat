@echo off
echo ========================================
echo  INSTALACION COMPLETA DE OMNICANALIDAD
echo  Script Todo-en-Uno
echo ========================================
echo.

echo Este script realizara:
echo 1. Instalacion de dependencias
echo 2. Configuracion del sistema
echo 3. Inicio del servidor
echo 4. Inicializacion de omnicanalidad
echo.
pause

echo.
echo ========================================
echo  PASO 1: INSTALACION DE DEPENDENCIAS
echo ========================================
echo.

call install-omnichannel.bat
if %errorlevel% neq 0 (
    echo ERROR en la instalacion
    pause
    exit /b 1
)

echo.
echo ========================================
echo  PASO 2: CONFIGURACION
echo ========================================
echo.

call test-omnichannel-setup.bat
if %errorlevel% neq 0 (
    echo ERROR en la configuracion
    pause
    exit /b 1
)

echo.
echo ========================================
echo  PASO 3: INICIAR SERVIDOR
echo ========================================
echo.
echo IMPORTANTE:
echo - Se abrira una nueva ventana con el servidor
echo - NO cierres esa ventana
echo - Vuelve a esta ventana para continuar
echo.
pause

start "Servidor Alqvimia RPA" cmd /k start-server.bat

echo.
echo Esperando a que el servidor inicie...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  PASO 4: INICIALIZAR OMNICANALIDAD
echo ========================================
echo.

call init-omnichannel.bat

echo.
echo ========================================
echo  INSTALACION COMPLETADA
echo ========================================
echo.
echo El sistema esta listo para usar!
echo.
echo Archivos utiles:
echo - test-send-message.bat (para enviar mensajes de prueba)
echo - check-omnichannel-status.bat (para ver el estado)
echo.
echo Para mas informacion consulta:
echo - INSTALACION_RAPIDA_OMNICANALIDAD.md
echo - OMNICANALIDAD_README.md
echo.
pause
