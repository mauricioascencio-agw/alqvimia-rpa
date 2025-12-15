@echo off
chcp 65001 >nul
color 0B

echo.
echo ================================================================
echo   INSTALACION - SISTEMA DE VIDEOCONFERENCIA
echo   Alqvimia RPA
echo ================================================================
echo.
echo Instalando dependencias necesarias...
echo.

REM Verificar que Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado.
    echo         Descarga Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado:
node --version
echo.

REM Instalar dependencias
echo [INSTALANDO] Dependencias...
echo              - multer (manejo de archivos^)
echo              - nodemailer (envio de emails^)
echo.

npm install multer nodemailer

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Dependencias instaladas correctamente
    echo.
) else (
    echo.
    echo [ERROR] Hubo un problema al instalar las dependencias
    echo.
    pause
    exit /b 1
)

REM Verificar que existe la carpeta workflows
if not exist "workflows" (
    echo [CREANDO] Carpeta workflows/
    mkdir workflows
    echo [OK] Carpeta workflows creada
    echo.
)

echo ================================================================
echo   INSTALACION COMPLETADA
echo ================================================================
echo.
echo El sistema de videoconferencia esta listo.
echo.
echo PROXIMOS PASOS:
echo.
echo 1. (Opcional^) Configurar SMTP para invitaciones:
echo    configurar-smtp.bat
echo.
echo 2. Iniciar el servidor:
echo    iniciar-servidor.bat
echo.
echo 3. Abrir navegador:
echo    http://localhost:3000
echo.
echo 4. Click en "Videoconferencia" en el menu
echo.
echo DOCUMENTACION:
echo - QUICKSTART_V2.md
echo - VIDEOCONFERENCIA_MEJORAS_V2.md
echo.

pause
