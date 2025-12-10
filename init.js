// Script de inicialización de Omnicanalidad
// Ejecuta: node init.js

const http = require('http');
const fs = require('fs');

console.log('========================================');
console.log('  INICIALIZADOR DE OMNICANALIDAD');
console.log('========================================\n');

// Leer configuración
let config;
try {
  if (fs.existsSync('./omnichannel-config.js')) {
    config = require('./omnichannel-config');
    console.log('✅ Configuración cargada\n');
  } else {
    console.log('⚠️  No se encontró omnichannel-config.js');
    console.log('Creando configuración por defecto...\n');

    config = {
      whatsapp: {
        enabled: true,
        provider: 'whatsapp-web.js',
        autoReply: false,
        headless: false
      },
      telegram: {
        enabled: false,
        token: '',
        polling: true
      }
    };

    fs.writeFileSync('./omnichannel-config.js',
      'module.exports = ' + JSON.stringify(config, null, 2)
    );
    console.log('✅ Archivo omnichannel-config.js creado\n');
  }
} catch (error) {
  console.error('❌ Error al leer configuración:', error.message);
  process.exit(1);
}

// Función para hacer request HTTP
function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función principal
async function initialize() {
  try {
    console.log('🚀 Inicializando sistema de omnicanalidad...\n');

    // Inicializar
    const result = await makeRequest('/api/omnichannel/initialize', 'POST', { config });

    if (result.success) {
      console.log('✅ Sistema inicializado correctamente\n');
      console.log('Estado de canales:');
      console.log('- WhatsApp:', result.channels.whatsapp.status);
      console.log('- Telegram:', result.channels.telegram.status);
      console.log('');

      // Si WhatsApp está esperando QR
      if (result.channels.whatsapp.status === 'qr_ready') {
        console.log('⏳ Esperando generación de QR de WhatsApp...\n');

        // Esperar 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Obtener QR
        const qrResult = await makeRequest('/api/omnichannel/whatsapp/qr', 'GET');

        if (qrResult.success && qrResult.qr) {
          console.log('========================================');
          console.log('  📱 QR CODE DE WHATSAPP DISPONIBLE');
          console.log('========================================\n');
          console.log('Para escanear el QR:');
          console.log('1. Ve a: https://qrcode.show/');
          console.log('2. Pega este código completo:\n');
          console.log(qrResult.qr);
          console.log('\n3. Escanea con WhatsApp en tu teléfono');
          console.log('   (Configuración → Dispositivos vinculados)\n');
          console.log('========================================\n');
        } else {
          console.log('⚠️  QR aún no disponible. Espera unos segundos y ejecuta:');
          console.log('   node -e "const http = require(\'http\'); http.get(\'http://localhost:3000/api/omnichannel/whatsapp/qr\', res => { let data = \'\'; res.on(\'data\', chunk => data += chunk); res.on(\'end\', () => console.log(JSON.parse(data).qr)); });"');
          console.log('');
        }
      }

      // Si WhatsApp ya está conectado
      if (result.channels.whatsapp.status === 'connected') {
        console.log('✅ WhatsApp ya está conectado');
        console.log('   Teléfono:', result.channels.whatsapp.phone || 'N/A');
        console.log('');
      }

      // Info de Telegram
      if (result.channels.telegram.enabled && result.channels.telegram.status === 'connected') {
        console.log('✅ Telegram conectado');
        console.log('   Bot:', '@' + result.channels.telegram.username);
        console.log('');
      }

      console.log('========================================');
      console.log('  SISTEMA LISTO');
      console.log('========================================\n');
      console.log('Para enviar mensajes de prueba:');
      console.log('- Script: test-send-message.bat');
      console.log('- API: POST http://localhost:3000/api/omnichannel/send-message\n');
      console.log('Ver estado: http://localhost:3000/api/omnichannel/status\n');

    } else {
      console.error('❌ Error al inicializar:', result.error || result.message);
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('\nAsegúrate de que el servidor esté corriendo:');
    console.error('- Ejecuta: npm start');
    console.error('- O: START.bat\n');
    process.exit(1);
  }
}

// Ejecutar
initialize();
