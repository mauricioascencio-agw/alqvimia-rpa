@echo off
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        🦊 INSTALADOR RÁPIDO - FIREFOX EXTENSION 🦊             ║
echo ║                   Element Spy RPA                              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 INSTRUCCIONES:
echo.
echo    1. Firefox se abrirá automáticamente
echo    2. Haz clic en "Cargar complemento temporal..."
echo    3. Selecciona el archivo: manifest.json
echo    4. ¡Listo! La extensión estará instalada
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Presiona cualquier tecla para abrir Firefox...
pause >nul

:: Buscar Firefox en ubicaciones comunes
set FIREFOX_PATH=""

if exist "C:\Program Files\Mozilla Firefox\firefox.exe" (
    set FIREFOX_PATH="C:\Program Files\Mozilla Firefox\firefox.exe"
) else if exist "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" (
    set FIREFOX_PATH="C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
) else if exist "%LOCALAPPDATA%\Mozilla Firefox\firefox.exe" (
    set FIREFOX_PATH="%LOCALAPPDATA%\Mozilla Firefox\firefox.exe"
)

if %FIREFOX_PATH%=="" (
    echo.
    echo ❌ No se encontró Firefox instalado
    echo.
    echo 💡 Por favor:
    echo    1. Instala Firefox desde: https://www.mozilla.org/firefox/
    echo    2. O abre Firefox manualmente
    echo    3. Escribe en la barra: about:debugging#/runtime/this-firefox
    echo    4. Haz clic en "Cargar complemento temporal..."
    echo    5. Selecciona: %~dp0manifest.json
    echo.
    pause
    exit /b 1
)

echo.
echo 🔄 Abriendo Firefox...
echo.

:: Abrir Firefox en la página de debugging
start "" %FIREFOX_PATH% "about:debugging#/runtime/this-firefox"

echo.
echo ✅ Firefox abierto
echo.
echo 📂 Carpeta de la extensión:
echo    %~dp0
echo.
echo 📝 IMPORTANTE:
echo    • Haz clic en "Cargar complemento temporal..."
echo    • Selecciona el archivo: manifest.json
echo    • La extensión aparecerá con el ícono 🤖
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo ⚠️ NOTA: La extensión se desinstalará al cerrar Firefox.
echo    Esto es normal en modo de desarrollo.
echo.
echo    Para instalación permanente, ejecuta:
echo    package-firefox-powershell.bat
echo.
echo ════════════════════════════════════════════════════════════════
echo.

:: Abrir el explorador de archivos en esta carpeta
echo 📂 Abriendo carpeta en el explorador...
start "" "%~dp0"

echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
