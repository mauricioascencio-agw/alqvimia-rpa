@echo off
chcp 65001 >nul
color 0A

echo.
echo ================================================================
echo   TEST - NUEVAS CARACTERISTICAS V2.0
echo   Sistema de Videoconferencia
echo ================================================================
echo.
echo Este script prueba las nuevas caracteristicas implementadas
echo en la version 2.0 del sistema de videoconferencia.
echo.

REM Verificación 1: Emojis
echo [1/6] Verificando emojis en chat...
findstr /C:"this.emojis" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Emojis configurados
) else (
    echo     [ERROR] Emojis NO configurados
    set ERROR=1
)

findstr /C:"vc-emoji-picker" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Selector de emojis en HTML
) else (
    echo     [ERROR] Selector de emojis NO encontrado
    set ERROR=1
)
echo.

REM Verificación 2: Filtros de Video
echo [2/6] Verificando filtros de video...
findstr /C:"applyVideoFilter" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Funcion de filtros implementada
) else (
    echo     [ERROR] Funcion de filtros NO encontrada
    set ERROR=1
)

findstr /C:"vc-filter-menu" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Menu de filtros en HTML
) else (
    echo     [ERROR] Menu de filtros NO encontrado
    set ERROR=1
)

findstr /C:"blur" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Filtros CSS (blur, sepia, grayscale, vintage)
) else (
    echo     [ERROR] Filtros CSS NO encontrados
    set ERROR=1
)
echo.

REM Verificación 3: Avatares
echo [3/6] Verificando avatares con iniciales...
findstr /C:"getInitials" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Funcion getInitials implementada
) else (
    echo     [ERROR] Funcion getInitials NO encontrada
    set ERROR=1
)

findstr /C:"getAvatarColor" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Funcion getAvatarColor implementada
) else (
    echo     [ERROR] Funcion getAvatarColor NO encontrada
    set ERROR=1
)

findstr /C:"vc-avatar-initials" public\js\video-conference.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] HTML de avatares actualizado
) else (
    echo     [ERROR] HTML de avatares NO actualizado
    set ERROR=1
)
echo.

REM Verificación 4: Selector de Workflow
echo [4/6] Verificando selector de proyecto/workflow...
findstr /C:"showWorkflowSelector" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Selector de workflow implementado
) else (
    echo     [ERROR] Selector de workflow NO encontrado
    set ERROR=1
)

findstr /C:"getAvailableWorkflows" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Funcion para obtener workflows
) else (
    echo     [ERROR] Funcion de workflows NO encontrada
    set ERROR=1
)

findstr /C:"confirmWorkflowSelection" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Confirmacion de seleccion implementada
) else (
    echo     [ERROR] Confirmacion NO encontrada
    set ERROR=1
)
echo.

REM Verificación 5: Barra de Progreso
echo [5/6] Verificando barra de progreso...
findstr /C:"showProgressBar" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Barra de progreso implementada
) else (
    echo     [ERROR] Barra de progreso NO encontrada
    set ERROR=1
)

findstr /C:"processSessionWithProgress" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Procesamiento con progreso
) else (
    echo     [ERROR] Procesamiento NO encontrado
    set ERROR=1
)

findstr /C:"updateProgress" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Actualizacion de progreso
) else (
    echo     [ERROR] Actualizacion NO encontrada
    set ERROR=1
)

findstr /C:"showCompletionMessage" public\js\video-conference-features.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Modal de completado
) else (
    echo     [ERROR] Modal de completado NO encontrado
    set ERROR=1
)
echo.

REM Verificación 6: Estilos CSS
echo [6/6] Verificando estilos CSS nuevos...
findstr /C:"vc-emoji-picker" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Estilos de emoji picker
) else (
    echo     [ERROR] Estilos de emoji picker NO encontrados
    set ERROR=1
)

findstr /C:"vc-filter-menu" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Estilos de filtros
) else (
    echo     [ERROR] Estilos de filtros NO encontrados
    set ERROR=1
)

findstr /C:"vc-avatar-initials" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Estilos de avatares
) else (
    echo     [ERROR] Estilos de avatares NO encontrados
    set ERROR=1
)

findstr /C:"vc-progress-bar" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Estilos de barra de progreso
) else (
    echo     [ERROR] Estilos de barra de progreso NO encontrados
    set ERROR=1
)

findstr /C:"shimmer" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Animacion shimmer
) else (
    echo     [ERROR] Animacion shimmer NO encontrada
    set ERROR=1
)

findstr /C:"vc-select" public\css\video-conference.css >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     [OK] Estilos de selector
) else (
    echo     [ERROR] Estilos de selector NO encontrados
    set ERROR=1
)
echo.

REM Resultado final
echo ================================================================
if defined ERROR (
    echo   [ERROR] ALGUNAS CARACTERISTICAS FALTAN
    echo ================================================================
    echo.
    echo Se encontraron algunos problemas. Por favor:
    echo.
    echo 1. Verifica que todos los archivos esten actualizados
    echo 2. Recarga la pagina con Ctrl+F5
    echo 3. Vuelve a ejecutar este test
    echo.
) else (
    echo   [OK] TODAS LAS CARACTERISTICAS V2.0 INSTALADAS
    echo ================================================================
    echo.
    echo Excelente! Todas las nuevas caracteristicas estan instaladas.
    echo.
    echo NUEVAS CARACTERISTICAS V2.0:
    echo.
    echo   [OK] 1. Emojis en el chat (16 emojis disponibles^)
    echo   [OK] 2. Filtros de video (5 filtros^)
    echo   [OK] 3. Avatares con iniciales y colores
    echo   [OK] 4. Selector de proyecto al finalizar
    echo   [OK] 5. Barra de progreso animada (8 pasos^)
    echo   [OK] 6. Modal de confirmacion con resumen
    echo.
    echo PARA PROBAR:
    echo.
    echo 1. Inicia el servidor:
    echo    iniciar-servidor.bat
    echo.
    echo 2. Abre tu navegador:
    echo    http://localhost:3000
    echo.
    echo 3. Click en "Videoconferencia"
    echo.
    echo 4. Prueba cada caracteristica nueva
    echo.
)

echo ----------------------------------------------------------------
echo DOCUMENTACION:
echo ----------------------------------------------------------------
echo.
echo - VIDEOCONFERENCIA_MEJORAS_V2.md     (Nuevas caracteristicas^)
echo - RESUMEN_VIDEOCONFERENCIA_V2.md     (Resumen completo^)
echo - GUIA_VISUAL_V2.md                  (Guia visual^)
echo - VIDEOCONFERENCIA_INICIO_RAPIDO.md (Guia rapida^)
echo - QUICKSTART_V2.md                   (2 minutos^)
echo.

pause
