@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  CONFIGURADOR DE OMNICANALIDAD
echo  Setup Rapido de WhatsApp y Telegram
echo ========================================
echo.

echo Este asistente te ayudara a configurar:
echo - WhatsApp (usando whatsapp-web.js)
echo - Telegram (usando Bot API)
echo.
pause

echo.
echo ========================================
echo  CONFIGURACION DE TELEGRAM
echo ========================================
echo.
echo Si quieres usar Telegram, necesitas un token de @BotFather
echo.
echo Pasos para obtener el token:
echo 1. Abre Telegram
echo 2. Busca @BotFather
echo 3. Envia /newbot
echo 4. Sigue las instrucciones
echo 5. Copia el token que te da
echo.

set /p telegram_token="Ingresa tu token de Telegram (o deja vacio para omitir): "

echo.
echo ========================================
echo  GENERANDO ARCHIVO DE CONFIGURACION
echo ========================================
echo.

(
echo // Configuracion de Omnicanalidad
echo // Generado automaticamente por test-omnichannel-setup.bat
echo.
echo const config = {
echo   whatsapp: {
echo     enabled: true,
echo     provider: 'whatsapp-web.js',
echo     autoReply: false,
echo     headless: false
echo   },
echo   telegram: {
if "!telegram_token!"=="" (
    echo     enabled: false,
    echo     token: '',
) else (
    echo     enabled: true,
    echo     token: '!telegram_token!',
)
echo     polling: true,
echo     welcomeMessage: 'Hola! Bienvenido al bot de Alqvimia RPA.'
echo   }
echo };
echo.
echo module.exports = config;
) > omnichannel-config.js

echo Archivo de configuracion creado: omnichannel-config.js
echo.

echo ========================================
echo  GENERANDO SCRIPT DE INICIALIZACION
echo ========================================
echo.

(
echo const fetch = require('node-fetch'^);
echo const config = require('./omnichannel-config'^);
echo.
echo async function initializeOmnichannel(^) {
echo   try {
echo     console.log('Inicializando sistema de omnicanalidad...'^);
echo.
echo     const response = await fetch('http://localhost:3000/api/omnichannel/initialize', {
echo       method: 'POST',
echo       headers: { 'Content-Type': 'application/json' },
echo       body: JSON.stringify({ config })
echo     }^);
echo.
echo     const data = await response.json(^);
echo.
echo     if (data.success^) {
echo       console.log('Sistema inicializado correctamente'^);
echo       console.log('WhatsApp:', data.channels.whatsapp.status^);
echo       console.log('Telegram:', data.channels.telegram.status^);
echo.
echo       if (data.channels.whatsapp.status === 'qr_ready'^) {
echo         console.log('\nEsperando QR de WhatsApp...'^);
echo         setTimeout(async (^) =^> {
echo           const qrResponse = await fetch('http://localhost:3000/api/omnichannel/whatsapp/qr'^);
echo           const qrData = await qrResponse.json(^);
echo           if (qrData.success ^&^& qrData.qr^) {
echo             console.log('\nQR Code disponible!'^);
echo             console.log('Copia este codigo y pegalo en: https://qrcode.show/'^);
echo             console.log('\n' + qrData.qr + '\n'^);
echo           }
echo         }, 3000^);
echo       }
echo     } else {
echo       console.error('Error:', data.error^);
echo     }
echo   } catch (error^) {
echo     console.error('Error de conexion:', error.message^);
echo     console.log('\nAsegurate de que el servidor este corriendo (npm start^)'^);
echo   }
echo }
echo.
echo initializeOmnichannel(^);
) > init-omnichannel.js

echo Script de inicializacion creado: init-omnichannel.js
echo.

echo ========================================
echo  CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Archivos creados:
echo - omnichannel-config.js (configuracion)
echo - init-omnichannel.js (script de inicio)
echo.
echo Para iniciar el sistema:
echo 1. Ejecuta start-server.bat (en otra ventana)
echo 2. Ejecuta init-omnichannel.bat
echo.
pause
