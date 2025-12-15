@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  PRUEBA DE ENVIO DE MENSAJES
echo  Alqvimia RPA - Omnicanalidad
echo ========================================
echo.

:menu
echo Selecciona el canal:
echo 1. WhatsApp
echo 2. Telegram
echo 3. Salir
echo.
set /p opcion="Opcion: "

if "%opcion%"=="1" goto whatsapp
if "%opcion%"=="2" goto telegram
if "%opcion%"=="3" goto fin
echo Opcion invalida
echo.
goto menu

:whatsapp
echo.
echo --- ENVIO POR WHATSAPP ---
echo.
set /p numero="Numero de telefono (con codigo de pais, ej: 5215512345678): "
set /p mensaje="Mensaje a enviar: "

if "%numero%"=="" (
    echo ERROR: Debes ingresar un numero
    echo.
    goto menu
)

echo.
echo Enviando mensaje...

curl -X POST http://localhost:3000/api/omnichannel/send-message ^
  -H "Content-Type: application/json" ^
  -d "{\"channel\":\"whatsapp\",\"recipient\": \"%numero%\",\"message\":\"%mensaje%\"}"

echo.
echo.
pause
goto menu

:telegram
echo.
echo --- ENVIO POR TELEGRAM ---
echo.
set /p chatid="Chat ID (numero): "
set /p mensaje="Mensaje a enviar: "

if "%chatid%"=="" (
    echo ERROR: Debes ingresar un chat ID
    echo.
    goto menu
)

echo.
echo Enviando mensaje...

curl -X POST http://localhost:3000/api/omnichannel/send-message ^
  -H "Content-Type: application/json" ^
  -d "{\"channel\":\"telegram\",\"recipient\":\"%chatid%\",\"message\":\"%mensaje%\"}"

echo.
echo.
pause
goto menu

:fin
echo.
echo Saliendo...
