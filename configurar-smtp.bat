@echo off
chcp 65001 >nul
color 0E

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  📧 CONFIGURACIÓN SMTP - VIDEOCONFERENCIA                      ║
echo ║                    Alqvimia RPA                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Esta configuración es OPCIONAL y permite enviar invitaciones
echo por email a los participantes de las videoconferencias.
echo.
echo Si no necesitas esta funcionalidad, presiona Ctrl+C para salir.
echo.
pause

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PROVEEDORES SMTP COMPATIBLES                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [1] Gmail (smtp.gmail.com:587)
echo [2] Outlook/Hotmail (smtp-mail.outlook.com:587)
echo [3] Yahoo (smtp.mail.yahoo.com:587)
echo [4] Otro servidor SMTP
echo.
set /p proveedor="Selecciona tu proveedor [1-4]: "

REM Configurar según proveedor
if "%proveedor%"=="1" (
    set SMTP_HOST=smtp.gmail.com
    set SMTP_PORT=587
    echo.
    echo ✓ Gmail seleccionado
    echo.
    echo IMPORTANTE: Para Gmail necesitas una "Contraseña de aplicación"
    echo.
    echo Pasos para obtenerla:
    echo 1. Ve a https://myaccount.google.com/security
    echo 2. Activa "Verificación en 2 pasos"
    echo 3. Busca "Contraseñas de aplicaciones"
    echo 4. Selecciona "Correo" y "Otro"
    echo 5. Copia la contraseña generada (16 caracteres)
    echo.
    pause
)

if "%proveedor%"=="2" (
    set SMTP_HOST=smtp-mail.outlook.com
    set SMTP_PORT=587
    echo.
    echo ✓ Outlook/Hotmail seleccionado
)

if "%proveedor%"=="3" (
    set SMTP_HOST=smtp.mail.yahoo.com
    set SMTP_PORT=587
    echo.
    echo ✓ Yahoo seleccionado
)

if "%proveedor%"=="4" (
    echo.
    set /p SMTP_HOST="Ingresa el host SMTP (ej: smtp.tuservidor.com): "
    set /p SMTP_PORT="Ingresa el puerto (normalmente 587 o 465): "
)

echo.
echo ─────────────────────────────────────────────────────────────────
echo INGRESA TUS CREDENCIALES
echo ─────────────────────────────────────────────────────────────────
echo.
set /p SMTP_USER="Email completo: "
set /p SMTP_PASS="Contraseña o contraseña de aplicación: "

echo.
echo ─────────────────────────────────────────────────────────────────
echo GUARDANDO CONFIGURACIÓN
echo ─────────────────────────────────────────────────────────────────
echo.

REM Crear archivo .env
(
echo # Configuración SMTP para Videoconferencia
echo # Generado: %date% %time%
echo.
echo SMTP_HOST=%SMTP_HOST%
echo SMTP_PORT=%SMTP_PORT%
echo SMTP_USER=%SMTP_USER%
echo SMTP_PASS=%SMTP_PASS%
) > .env

if exist .env (
    echo ✅ Archivo .env creado exitosamente
    echo.
    echo Configuración guardada:
    echo   Host: %SMTP_HOST%
    echo   Puerto: %SMTP_PORT%
    echo   Usuario: %SMTP_USER%
    echo   Contraseña: ******** (oculta)
    echo.
) else (
    echo ❌ Error al crear archivo .env
    pause
    exit /b 1
)

echo ─────────────────────────────────────────────────────────────────
echo INSTALANDO DEPENDENCIA dotenv
echo ─────────────────────────────────────────────────────────────────
echo.

call npm install dotenv

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al instalar dotenv
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✅ CONFIGURACIÓN SMTP COMPLETADA                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Ahora puedes enviar invitaciones por email desde el sistema
echo de videoconferencia.
echo.
echo NOTA: El archivo .env contiene información sensible.
echo       NO lo compartas ni lo subas a repositorios públicos.
echo.
echo Próximo paso: Ejecuta iniciar-servidor.bat
echo.

pause
