@echo off
chcp 65001 >nul
color 0E

echo.
echo ================================================================
echo   HABILITAR SMTP - Alqvimia RPA
echo ================================================================
echo.
echo Este script abre la pagina de diagnostico para habilitar SMTP
echo de forma rapida.
echo.
echo PASOS:
echo.
echo 1. Se abrira una pagina de diagnostico
echo 2. Click en "Activar SMTP Enabled"
echo 3. Refresca la aplicacion principal (F5)
echo 4. Ve a Configuraciones -^> Videoconferencia
echo 5. Los campos estaran habilitados para editar
echo.
echo ================================================================
echo.

REM Abrir página de diagnóstico
start http://localhost:3000/../diagnosticar-configuracion.html

echo [OK] Pagina de diagnostico abierta
echo.
echo Sigue las instrucciones en la pagina que se abrio.
echo.
pause
