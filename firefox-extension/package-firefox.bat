@echo off
:: Cambiar al directorio donde está el script
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     📦 EMPAQUETADOR DE EXTENSIÓN FIREFOX - Element Spy RPA     ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📂 Directorio: %CD%
echo.

echo [1/3] Verificando archivos necesarios...

if not exist "manifest.json" (
    echo ❌ Error: manifest.json no encontrado
    pause
    exit /b 1
)

if not exist "background.js" (
    echo ❌ Error: background.js no encontrado
    pause
    exit /b 1
)

if not exist "content-script.js" (
    echo ❌ Error: content-script.js no encontrado
    pause
    exit /b 1
)

echo ✅ Todos los archivos necesarios están presentes
echo.

echo [2/3] Creando archivo ZIP para Firefox...

:: Eliminar ZIP anterior si existe
if exist "element-spy-rpa-firefox.zip" (
    del "element-spy-rpa-firefox.zip"
)

:: Verificar si 7-Zip está instalado
if exist "C:\Program Files\7-Zip\7z.exe" (
    "C:\Program Files\7-Zip\7z.exe" a -tzip element-spy-rpa-firefox.zip manifest.json background.js content-script.js injected-recorder.js popup.html popup.js icon16.png icon48.png icon128.png
    echo ✅ ZIP creado con 7-Zip
) else if exist "C:\Program Files (x86)\7-Zip\7z.exe" (
    "C:\Program Files (x86)\7-Zip\7z.exe" a -tzip element-spy-rpa-firefox.zip manifest.json background.js content-script.js injected-recorder.js popup.html popup.js icon16.png icon48.png icon128.png
    echo ✅ ZIP creado con 7-Zip
) else (
    echo ⚠️ 7-Zip no encontrado. Por favor empaqueta manualmente los archivos:
    echo    manifest.json, background.js, content-script.js, injected-recorder.js,
    echo    popup.html, popup.js, icon16.png, icon48.png, icon128.png
    echo.
    echo O descarga 7-Zip desde: https://www.7-zip.org/
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
    echo.
    echo 📋 PRÓXIMOS PASOS:
    echo.
    echo    OPCIÓN 1 - INSTALACIÓN TEMPORAL:
    echo    1. Abre Firefox
    echo    2. Escribe: about:debugging#/runtime/this-firefox
    echo    3. Haz clic en "Cargar complemento temporal..."
    echo    4. Selecciona el archivo manifest.json de esta carpeta
    echo.
    echo    OPCIÓN 2 - INSTALACIÓN PERMANENTE:
    echo    1. Ve a: https://addons.mozilla.org/developers/
    echo    2. Inicia sesión o crea una cuenta
    echo    3. Haz clic en "Submit a New Add-on"
    echo    4. Sube el archivo element-spy-rpa-firefox.zip
    echo    5. Espera la firma automática
    echo    6. Descarga el .xpi firmado
    echo    7. Arrastra el .xpi a Firefox para instalarlo
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
) else (
    echo ❌ Error: No se pudo crear el archivo ZIP
    pause
    exit /b 1
)

pause
