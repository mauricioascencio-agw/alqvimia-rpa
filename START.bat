@echo off
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║            🤖 ELEMENT SPY - RPA AUTOMATION TOOL 🤖             ║
echo ║                    Tipo Alqvimia                              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js detectado
echo.

echo [2/3] Verificando dependencias...
if not exist "node_modules\" (
    echo 📦 Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ Dependencias ya instaladas
)
echo.

echo [3/3] Iniciando servidor...
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🚀 Servidor iniciando en: http://localhost:3000
echo.
echo 📝 Presiona Ctrl+C para detener el servidor
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

start http://localhost:3000

node server/index.js
