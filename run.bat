@echo off
title Alqvimia RPA Server
color 0A
cls

echo ================================================
echo   ALQVIMIA RPA - SERVIDOR
echo ================================================
echo.
echo Iniciando servidor...
echo.

REM Matar procesos Node.js previos
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM Iniciar servidor
npm start

echo.
echo ================================================
echo   SERVIDOR DETENIDO
echo ================================================
echo.
pause
