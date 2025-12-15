# ⚡ Instalación Rápida - Sistema de Omnicanalidad

Guía de 5 minutos para tener WhatsApp y Telegram funcionando.

---

## 📦 Paso 1: Instalar Dependencias

```bash
# En la carpeta del proyecto
cd c:\AlqVimia\alqvimia-rpa

# Instalar dependencias de omnicanalidad
npm install whatsapp-web.js node-telegram-bot-api
```

**Tiempo estimado:** 2-3 minutos

---

## 🤖 Paso 2: Obtener Token de Telegram (Opcional)

Si quieres usar Telegram:

1. Abre Telegram y busca [@BotFather](https://t.me/botfather)
2. Envía el comando `/newbot`
3. Sigue las instrucciones (nombre del bot, username)
4. Copia el **token** que te proporciona (ejemplo: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Tiempo estimado:** 1 minuto

---

## 🚀 Paso 3: Iniciar el Servidor

```bash
npm start
```

Deberías ver:

```
╔════════════════════════════════════════════════════════════════╗
║            🤖 ELEMENT SPY - RPA AUTOMATION TOOL 🤖             ║
║  Servidor corriendo en: http://localhost:3000                  ║
╚════════════════════════════════════════════════════════════════╝
```

**Tiempo estimado:** 10 segundos

---

## 📱 Paso 4: Inicializar Sistema de Omnicanalidad

### Opción A: Usar la API directamente

**1. Abre Postman, Insomnia, o usa curl:**

```bash
curl -X POST http://localhost:3000/api/omnichannel/initialize \
  -H "Content-Type: application/json" \
  -d "{
    \"config\": {
      \"whatsapp\": {
        \"enabled\": true,
        \"provider\": \"whatsapp-web.js\",
        \"autoReply\": false,
        \"headless\": false
      },
      \"telegram\": {
        \"enabled\": true,
        \"token\": \"TU_TOKEN_AQUI\",
        \"polling\": true
      }
    }
  }"
```

**2. Espera unos segundos...**

**3. Obtén el QR de WhatsApp:**

```bash
curl http://localhost:3000/api/omnichannel/whatsapp/qr
```

**4. Escanea el QR con WhatsApp:**
- Copia el string del QR
- Ve a [https://qrcode.show/](https://qrcode.show/) y pégalo
- Escanea con tu WhatsApp (Configuración → Dispositivos vinculados → Vincular dispositivo)

### Opción B: Usar el HTML de ejemplo

**1. Crea un archivo `test-omnichannel.html` en la raíz del proyecto:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Omnicanalidad</title>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
  <style>
    body { font-family: Arial; padding: 20px; }
    button { padding: 10px 20px; margin: 10px 0; cursor: pointer; }
    input, textarea { width: 100%; padding: 8px; margin: 5px 0; }
    #qr-canvas { border: 1px solid #ccc; margin: 10px 0; }
    .status { padding: 10px; background: #f0f0f0; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>🤖 Test de Omnicanalidad</h1>

  <div class="status" id="status">Estado: Esperando inicialización...</div>

  <h2>1. Inicializar Sistema</h2>
  <input type="text" id="telegram-token" placeholder="Token de Telegram (opcional)">
  <br>
  <button onclick="inicializar()">🚀 Inicializar</button>

  <h2>2. QR de WhatsApp</h2>
  <canvas id="qr-canvas"></canvas>
  <br>
  <button onclick="mostrarQR()">📱 Mostrar QR</button>

  <h2>3. Enviar Mensaje de Prueba</h2>
  <select id="channel">
    <option value="whatsapp">WhatsApp</option>
    <option value="telegram">Telegram</option>
  </select>
  <br>
  <input type="text" id="recipient" placeholder="Destinatario (número o chat ID)">
  <br>
  <textarea id="message" rows="3" placeholder="Escribe tu mensaje...">Hola! Este es un mensaje de prueba desde Alqvimia RPA 🤖</textarea>
  <br>
  <button onclick="enviarMensaje()">📤 Enviar Mensaje</button>

  <h2>4. Estado del Sistema</h2>
  <button onclick="verificarEstado()">🔍 Verificar Estado</button>
  <pre id="estado-completo"></pre>

  <script>
    const API_URL = 'http://localhost:3000';

    async function inicializar() {
      const token = document.getElementById('telegram-token').value;

      const config = {
        whatsapp: {
          enabled: true,
          provider: 'whatsapp-web.js',
          autoReply: false,
          headless: false
        },
        telegram: {
          enabled: token ? true : false,
          token: token || '',
          polling: true
        }
      };

      try {
        const response = await fetch(`${API_URL}/api/omnichannel/initialize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config })
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById('status').innerHTML =
            '✅ Sistema inicializado correctamente. WhatsApp: ' + data.channels.whatsapp.status;

          // Intentar mostrar QR automáticamente después de 2 segundos
          setTimeout(mostrarQR, 2000);
        } else {
          document.getElementById('status').innerHTML = '❌ Error: ' + data.error;
        }
      } catch (error) {
        document.getElementById('status').innerHTML = '❌ Error de conexión: ' + error.message;
      }
    }

    async function mostrarQR() {
      try {
        const response = await fetch(`${API_URL}/api/omnichannel/whatsapp/qr`);
        const data = await response.json();

        if (data.success && data.qr) {
          QRCode.toCanvas(document.getElementById('qr-canvas'), data.qr, {
            width: 300
          });
          document.getElementById('status').innerHTML =
            '📱 QR Code generado. Escanea con WhatsApp.';
        } else {
          document.getElementById('status').innerHTML =
            '⏳ QR no disponible aún. Esperando... (intenta de nuevo en 5 seg)';
        }
      } catch (error) {
        document.getElementById('status').innerHTML =
          '❌ Error al obtener QR: ' + error.message;
      }
    }

    async function enviarMensaje() {
      const channel = document.getElementById('channel').value;
      const recipient = document.getElementById('recipient').value;
      const message = document.getElementById('message').value;

      if (!recipient) {
        alert('Por favor ingresa un destinatario');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/omnichannel/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, recipient, message })
        });

        const data = await response.json();

        if (data.success) {
          alert('✅ Mensaje enviado exitosamente!');
        } else {
          alert('❌ Error: ' + data.error);
        }
      } catch (error) {
        alert('❌ Error de conexión: ' + error.message);
      }
    }

    async function verificarEstado() {
      try {
        const response = await fetch(`${API_URL}/api/omnichannel/status`);
        const data = await response.json();

        document.getElementById('estado-completo').textContent =
          JSON.stringify(data, null, 2);

        if (data.initialized) {
          let statusText = '📊 Estado Actual:\n\n';
          statusText += `WhatsApp: ${data.channels.whatsapp.status}\n`;
          statusText += `Telegram: ${data.channels.telegram.status}\n`;
          statusText += `\nConversaciones totales: ${data.stats.conversations.total}\n`;
          statusText += `- WhatsApp: ${data.stats.conversations.byChannel.whatsapp}\n`;
          statusText += `- Telegram: ${data.stats.conversations.byChannel.telegram}\n`;

          document.getElementById('status').innerHTML = statusText.replace(/\n/g, '<br>');
        } else {
          document.getElementById('status').innerHTML =
            '⚠️ Sistema no inicializado. Haz click en "Inicializar"';
        }
      } catch (error) {
        alert('❌ Error al verificar estado: ' + error.message);
      }
    }

    // Auto-verificar estado cada 10 segundos
    setInterval(() => {
      verificarEstado();
    }, 10000);
  </script>
</body>
</html>
```

**2. Abre el archivo en tu navegador:**

```
file:///c:/AlqVimia/alqvimia-rpa/test-omnichannel.html
```

**3. Sigue los pasos en la interfaz.**

**Tiempo estimado:** 2 minutos

---

## ✅ Verificación

### Verificar que todo funciona:

```bash
# Verificar estado
curl http://localhost:3000/api/omnichannel/status
```

Deberías ver algo como:

```json
{
  "success": true,
  "initialized": true,
  "channels": {
    "whatsapp": {
      "enabled": true,
      "status": "connected",
      "phone": "5215512345678"
    },
    "telegram": {
      "enabled": true,
      "status": "connected",
      "username": "tu_bot"
    }
  }
}
```

---

## 📤 Prueba Rápida de Envío

### Enviar mensaje por WhatsApp:

```bash
curl -X POST http://localhost:3000/api/omnichannel/send-message \
  -H "Content-Type: application/json" \
  -d "{
    \"channel\": \"whatsapp\",
    \"recipient\": \"5215512345678\",
    \"message\": \"Hola! Mensaje de prueba desde Alqvimia RPA\"
  }"
```

### Enviar mensaje por Telegram:

```bash
curl -X POST http://localhost:3000/api/omnichannel/send-message \
  -H "Content-Type: application/json" \
  -d "{
    \"channel\": \"telegram\",
    \"recipient\": \"123456789\",
    \"message\": \"Hola! Mensaje de prueba desde Alqvimia RPA\"
  }"
```

**Nota:** Reemplaza los números/IDs con tus propios destinatarios.

---

## 🎯 Siguiente Paso

Una vez que todo funcione, consulta la documentación completa:

- **[OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)** - Guía completa
- **[MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md)** - Detalles técnicos

---

## ❓ Problemas Comunes

### "whatsapp-web.js not found"

```bash
npm install whatsapp-web.js
```

### "node-telegram-bot-api not found"

```bash
npm install node-telegram-bot-api
```

### "QR no aparece"

- Espera 5-10 segundos después de inicializar
- Verifica que `headless: false` en la configuración
- Revisa los logs del servidor (`npm start`)

### "Telegram bot no responde"

- Verifica que el token sea correcto
- Asegúrate de haber iniciado una conversación con el bot
- Envía `/start` al bot primero

### "Sistema no inicializado"

- Llama primero a `/api/omnichannel/initialize`
- Verifica la respuesta del endpoint
- Revisa los logs del servidor

---

## 🎉 ¡Listo!

**Tiempo total:** ~5 minutos

Ahora tienes:
- ✅ WhatsApp funcionando con QR
- ✅ Telegram bot activo
- ✅ API REST completa
- ✅ Sistema listo para usar

**Siguiente paso:** Integrar con tus workflows RPA y automatizar comunicaciones! 🚀
