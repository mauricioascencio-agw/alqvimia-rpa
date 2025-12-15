@echo off
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        VERIFICACION DEL SISTEMA RPA PROFESIONAL                ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Verificando archivos principales...
if exist "public\index.html" (
    echo     ✓ public\index.html existe
) else (
    echo     ✗ public\index.html NO EXISTE
    goto :error
)

if exist "public\js\recorder-professional.js" (
    echo     ✓ public\js\recorder-professional.js existe
) else (
    echo     ✗ public\js\recorder-professional.js NO EXISTE
    goto :error
)

if exist "server\index.js" (
    echo     ✓ server\index.js existe
) else (
    echo     ✗ server\index.js NO EXISTE
    goto :error
)

echo.
echo [2/5] Verificando scripts en index.html...
findstr /C:"recorder-professional.js" public\index.html >nul
if %errorlevel% equ 0 (
    echo     ✓ index.html usa recorder-professional.js
) else (
    echo     ✗ index.html NO usa recorder-professional.js
    echo     ! Necesitas actualizar el script en index.html
    goto :error
)

echo.
echo [3/5] Verificando dependencias...
if exist "node_modules" (
    echo     ✓ node_modules existe
) else (
    echo     ✗ node_modules NO EXISTE
    echo     ! Ejecuta: npm install
    goto :error
)

if exist "package.json" (
    echo     ✓ package.json existe
) else (
    echo     ✗ package.json NO EXISTE
    goto :error
)

echo.
echo [4/5] Verificando estructura de directorios...
if not exist "workflows" (
    echo     ! Creando carpeta workflows...
    mkdir workflows
    echo     ✓ Carpeta workflows creada
) else (
    echo     ✓ Carpeta workflows existe
)

if exist "public\css\styles.css" (
    echo     ✓ CSS principal existe
) else (
    echo     ✗ CSS principal NO EXISTE
    goto :error
)

echo.
echo [5/5] Verificando otros scripts...
if exist "public\js\app.js" (echo     ✓ app.js) else (echo     ✗ app.js)
if exist "public\js\element-spy.js" (echo     ✓ element-spy.js) else (echo     ✗ element-spy.js)
if exist "public\js\workflow-editor.js" (echo     ✓ workflow-editor.js) else (echo     ✗ workflow-editor.js)
if exist "public\js\executor.js" (echo     ✓ executor.js) else (echo     ✗ executor.js)
if exist "public\js\library.js" (echo     ✓ library.js) else (echo     ✗ library.js)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              ✅ VERIFICACION COMPLETADA CON EXITO              ║
echo ║                                                                ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║  El sistema está listo para usar.                             ║
echo ║                                                                ║
echo ║  Próximos pasos:                                               ║
echo ║  1. Inicia el servidor: npm start                             ║
echo ║  2. Abre el navegador: http://localhost:3000                  ║
echo ║  3. Ve a la pestaña "Grabador"                                ║
echo ║  4. Click en "Iniciar Grabación"                              ║
echo ║  5. Configura tu primer proyecto                              ║
echo ║                                                                ║
echo ║  Documentación disponible en:                                  ║
echo ║  - GUIA_RAPIDA_PROFESIONAL.md                                 ║
echo ║  - IMPLEMENTACION_COMPLETA.md                                 ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
goto :end

:error
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              ✗ VERIFICACION FALLIDA                            ║
echo ║                                                                ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║  Se encontraron problemas con la instalación.                 ║
echo ║  Revisa los mensajes de error arriba.                         ║
echo ║                                                                ║
echo ║  Posibles soluciones:                                          ║
echo ║  1. Ejecuta: npm install                                      ║
echo ║  2. Verifica que estás en la carpeta correcta                 ║
echo ║  3. Revisa los archivos mencionados                           ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
exit /b 1

:end
pause
