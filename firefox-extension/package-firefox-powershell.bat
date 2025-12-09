@echo off
:: Cambiar al directorio donde está el script
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     📦 EMPAQUETADOR FIREFOX (PowerShell) - Element Spy RPA     ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📂 Directorio: %CD%
echo.

echo [1/3] Verificando archivos necesarios...

if not exist "manifest.json" (
    echo ❌ Error: manifest.json no encontrado
    echo 💡 Ejecuta este script desde la carpeta firefox-extension
    pause
    exit /b 1
)

echo ✅ Archivos encontrados
echo.

echo [2/3] Creando archivo ZIP con PowerShell...

:: Eliminar ZIP anterior si existe
if exist "element-spy-rpa-firefox.zip" (
    del "element-spy-rpa-firefox.zip"
    echo 🗑️ ZIP anterior eliminado
)

:: Crear lista de archivos a comprimir
set FILES=manifest.json,background.js,content-script.js,injected-recorder.js,popup.html,popup.js,icon16.png,icon48.png,icon128.png

:: Usar PowerShell para comprimir
powershell -Command "Compress-Archive -Path %FILES% -DestinationPath element-spy-rpa-firefox.zip -Force"

if %ERRORLEVEL% EQU 0 (
    echo ✅ ZIP creado con PowerShell
) else (
    echo ❌ Error al crear ZIP
    pause
    exit /b 1
)

echo.

echo [3/3] Verificando resultado...

if exist "element-spy-rpa-firefox.zip" (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                                                                ║
    echo ║              ✅ EXTENSIÓN EMPAQUETADA EXITOSAMENTE              ║
    echo ║                                                                ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo 📦 Archivo creado: element-spy-rpa-firefox.zip
    echo 📂 Ubicación: %CD%\element-spy-rpa-firefox.zip
    echo.
    echo 📋 PRÓXIMOS PASOS:
    echo.
    echo    OPCIÓN 1 - INSTALACIÓN TEMPORAL (MÁS RÁPIDO):
    echo    ──────────────────────────────────────────────────
    echo    1. Abre Firefox
    echo    2. Escribe en la barra: about:debugging#/runtime/this-firefox
    echo    3. Haz clic en "Cargar complemento temporal..."
    echo    4. Selecciona el archivo: manifest.json (esta carpeta)
    echo.
    echo    OPCIÓN 2 - INSTALACIÓN PERMANENTE:
    echo    ──────────────────────────────────────────────────
    echo    1. Ve a: https://addons.mozilla.org/developers/
    echo    2. Inicia sesión o crea una cuenta Mozilla
    echo    3. Haz clic en "Submit a New Add-on"
    echo    4. Sube: element-spy-rpa-firefox.zip
    echo    5. Espera la firma automática (~5-10 minutos)
    echo    6. Descarga el archivo .xpi firmado
    echo    7. Arrastra el .xpi a Firefox para instalarlo
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.

    :: Abrir la carpeta en el explorador
    echo 📂 Abriendo carpeta en el explorador...
    start .

) else (
    echo ❌ Error: No se pudo crear el archivo ZIP
    pause
    exit /b 1
)

echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
