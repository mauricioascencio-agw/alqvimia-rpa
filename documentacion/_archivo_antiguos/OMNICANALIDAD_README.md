# 📱 Sistema de Omnicanalidad - WhatsApp & Telegram

Sistema completo de chatbots y mensajería omnicanal integrado con Alqvimia RPA.

---

## 🌟 Características

### WhatsApp
- ✅ Conexión mediante WhatsApp Web (whatsapp-web.js)
- ✅ Alternativa con Twilio WhatsApp API
- ✅ Autenticación con QR Code
- ✅ Envío y recepción de mensajes
- ✅ Envío de multimedia (imágenes, videos, documentos)
- ✅ Gestión de contactos y chats
- ✅ Auto-respuestas configurables

### Telegram
- ✅ Bot API oficial de Telegram
- ✅ Comandos personalizables
- ✅ Envío de mensajes, fotos y documentos
- ✅ Botones inline interactivos
- ✅ Gestión de grupos y canales
- ✅ Webhooks para eventos

### Funcionalidades Comunes
- ✅ Sistema de templates de mensajes
- ✅ Historial de conversaciones
- ✅ Webhooks personalizables
- ✅ Estadísticas y métricas
- ✅ Integración completa con workflows RPA

---

## 📦 Instalación

### 1. Instalar dependencias

Para WhatsApp (elige una opción):

```bash
# Opción A: WhatsApp Web JS (Recomendado)
npm install whatsapp-web.js

# Opción B: Twilio
npm install twilio
```

Para Telegram:

```bash
npm install node-telegram-bot-api
```

### 2. Configuración

#### WhatsApp con whatsapp-web.js

No requiere configuración adicional, solo escanear el QR code al iniciar.

#### WhatsApp con Twilio

1. Crear cuenta en [Twilio](https://www.twilio.com/)
2. Obtener credenciales:
   - Account SID
   - Auth Token
   - Número de WhatsApp de Twilio

#### Telegram

1. Hablar con [@BotFather](https://t.me/botfather) en Telegram
2. Crear un nuevo bot con `/newbot`
3. Copiar el token de acceso

---

## 🚀 Uso

### Inicializar el Sistema

**Endpoint:** `POST /api/omnichannel/initialize`

**Body:**

```json
{
  "config": {
    "whatsapp": {
      "enabled": true,
      "provider": "whatsapp-web.js",
      "autoReply": true,
      "autoReplyMessage": "Hola! Gracias por tu mensaje. Te responderemos pronto.",
      "headless": false
    },
    "telegram": {
      "enabled": true,
      "token": "TU_TOKEN_DE_TELEGRAM",
      "polling": true,
      "autoReply": false,
      "welcomeMessage": "¡Hola! Bienvenido al bot de Alqvimia RPA."
    }
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Servidor inicializado correctamente",
  "channels": {
    "whatsapp": {
      "enabled": true,
      "status": "qr_ready",
      "phone": null,
      "provider": "whatsapp-web.js"
    },
    "telegram": {
      "enabled": true,
      "status": "connected",
      "username": "tu_bot"
    }
  }
}
```

### Obtener QR de WhatsApp

**Endpoint:** `GET /api/omnichannel/whatsapp/qr`

**Respuesta:**

```json
{
  "success": true,
  "qr": "QR_CODE_STRING_AQUI"
}
```

Usa una librería como `qrcode` para mostrar el QR en el frontend:

```javascript
const QRCode = require('qrcode');

fetch('/api/omnichannel/whatsapp/qr')
  .then(res => res.json())
  .then(data => {
    QRCode.toCanvas(document.getElementById('canvas'), data.qr);
  });
```

### Verificar Estado del Sistema

**Endpoint:** `GET /api/omnichannel/status`

**Respuesta:**

```json
{
  "success": true,
  "initialized": true,
  "channels": {
    "whatsapp": {
      "enabled": true,
      "status": "connected",
      "phone": "5215512345678",
      "provider": "whatsapp-web.js"
    },
    "telegram": {
      "enabled": true,
      "status": "connected",
      "username": "alqvimia_bot"
    }
  },
  "stats": {
    "server": {
      "name": "omnichannel-server",
      "version": "1.0.0",
      "uptime": 3600
    },
    "conversations": {
      "total": 45,
      "byChannel": {
        "whatsapp": 30,
        "telegram": 15
      }
    },
    "messages": {
      "queued": 2,
      "templates": 5
    }
  }
}
```

---

## 💬 Enviar Mensajes

### Enviar Mensaje Simple

**Endpoint:** `POST /api/omnichannel/send-message`

**WhatsApp:**

```json
{
  "channel": "whatsapp",
  "recipient": "5215512345678",
  "message": "Hola! Este es un mensaje de prueba.",
  "options": {}
}
```

**Telegram:**

```json
{
  "channel": "telegram",
  "recipient": "123456789",
  "message": "Hola! Este es un mensaje de prueba.",
  "options": {
    "parse_mode": "Markdown"
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "messageId": "msg_1234567890_abc123",
  "channel": "whatsapp",
  "recipient": "5215512345678",
  "timestamp": "2024-12-10T10:30:00.000Z"
}
```

### Enviar Multimedia

**WhatsApp - Enviar Imagen:**

**Endpoint:** `POST /api/omnichannel/whatsapp/send-media`

```json
{
  "to": "5215512345678",
  "mediaPath": "/path/to/image.jpg",
  "caption": "Mira esta imagen!",
  "options": {}
}
```

**Telegram - Enviar Foto:**

**Endpoint:** `POST /api/omnichannel/telegram/send-photo`

```json
{
  "chatId": "123456789",
  "photo": "/path/to/image.jpg",
  "options": {
    "caption": "Mira esta imagen!"
  }
}
```

**Telegram - Enviar Documento:**

**Endpoint:** `POST /api/omnichannel/telegram/send-document`

```json
{
  "chatId": "123456789",
  "document": "/path/to/document.pdf",
  "options": {
    "caption": "Aquí está el documento solicitado"
  }
}
```

---

## 📋 Templates de Mensajes

### Registrar Template

**Endpoint:** `POST /api/omnichannel/templates`

```json
{
  "name": "bienvenida",
  "template": {
    "text": "Hola {{nombre}}! Bienvenido a {{empresa}}. Tu código de confirmación es: {{codigo}}",
    "options": {
      "parse_mode": "Markdown"
    }
  }
}
```

### Enviar Mensaje con Template

**Endpoint:** `POST /api/omnichannel/send-template`

```json
{
  "channel": "whatsapp",
  "recipient": "5215512345678",
  "templateName": "bienvenida",
  "variables": {
    "nombre": "Juan",
    "empresa": "Alqvimia RPA",
    "codigo": "ABC123"
  }
}
```

**Mensaje enviado:**
```
Hola Juan! Bienvenido a Alqvimia RPA. Tu código de confirmación es: ABC123
```

---

## 🎯 Telegram - Botones Interactivos

**Endpoint:** `POST /api/omnichannel/telegram/send-buttons`

```json
{
  "chatId": "123456789",
  "text": "¿Qué acción deseas realizar?",
  "buttons": [
    [
      { "text": "✅ Confirmar", "callback_data": "confirm" },
      { "text": "❌ Cancelar", "callback_data": "cancel" }
    ],
    [
      { "text": "ℹ️ Más información", "url": "https://example.com" }
    ]
  ],
  "options": {
    "parse_mode": "Markdown"
  }
}
```

---

## 📊 Conversaciones

### Obtener Todas las Conversaciones

**Endpoint:** `GET /api/omnichannel/conversations`

**Query Parameters:**
- `channel` (opcional): `whatsapp` o `telegram`

**Respuesta:**

```json
{
  "success": true,
  "conversations": [
    {
      "id": "whatsapp_5215512345678",
      "channel": "whatsapp",
      "userId": "5215512345678",
      "messages": [
        {
          "id": "msg_123",
          "from": "5215512345678",
          "text": "Hola!",
          "type": "text",
          "timestamp": "2024-12-10T10:00:00.000Z"
        }
      ],
      "createdAt": "2024-12-10T10:00:00.000Z",
      "updatedAt": "2024-12-10T10:05:00.000Z"
    }
  ]
}
```

### Obtener Conversación Específica

**Endpoint:** `GET /api/omnichannel/conversations/:id`

**Ejemplo:** `GET /api/omnichannel/conversations/whatsapp_5215512345678`

---

## 🔗 Webhooks

Registra webhooks para recibir notificaciones en tiempo real.

**Endpoint:** `POST /api/omnichannel/webhooks`

```json
{
  "event": "onMessage",
  "url": "https://tu-servidor.com/webhook/messages"
}
```

**Eventos disponibles:**
- `onMessage` - Cuando se recibe un mensaje
- `onStatusChange` - Cuando cambia el estado de un canal
- `onError` - Cuando ocurre un error

**Payload enviado al webhook:**

```json
{
  "id": "msg_123",
  "conversationId": "whatsapp_5215512345678",
  "channel": "whatsapp",
  "from": "5215512345678",
  "text": "Hola, necesito ayuda",
  "type": "text",
  "timestamp": "2024-12-10T10:30:00.000Z",
  "metadata": {
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

---

## 🤖 Comandos de Telegram

### Comandos por Defecto

Los siguientes comandos están registrados automáticamente:

- `/start` - Mensaje de bienvenida
- `/help` - Lista de comandos disponibles
- `/status` - Estado del sistema

### Registrar Comando Personalizado

En el código del servidor, puedes registrar comandos personalizados:

```javascript
const { getInstance } = require('./server/mcp');
const omnichannel = getInstance();

await omnichannel.initialize(config);

// Registrar comando personalizado
omnichannel.registerTelegramCommand('precio', async (msg) => {
  await omnichannel.sendMessage('telegram', msg.chat.id,
    'El precio actual es: $999.00 MXN'
  );
});
```

---

## 🔧 Configuración Avanzada

### WhatsApp con Twilio

```json
{
  "config": {
    "whatsapp": {
      "enabled": true,
      "provider": "twilio",
      "accountSid": "TU_ACCOUNT_SID",
      "authToken": "TU_AUTH_TOKEN",
      "from": "+14155238886"
    }
  }
}
```

### Telegram sin Polling (Webhooks)

```json
{
  "config": {
    "telegram": {
      "enabled": true,
      "token": "TU_TOKEN",
      "polling": false,
      "webhookUrl": "https://tu-servidor.com/telegram/webhook"
    }
  }
}
```

---

## 🧪 Ejemplos de Uso

### Ejemplo 1: Sistema de Notificaciones

```javascript
// Enviar notificación por ambos canales
async function enviarNotificacion(mensaje) {
  const omnichannel = getInstance();

  // WhatsApp
  await omnichannel.sendMessage(
    'whatsapp',
    '5215512345678',
    mensaje
  );

  // Telegram
  await omnichannel.sendMessage(
    'telegram',
    '123456789',
    mensaje
  );
}

await enviarNotificacion('¡Tu pedido ha sido enviado! 📦');
```

### Ejemplo 2: Bot de Soporte

```javascript
// Registrar webhook para mensajes entrantes
await fetch('http://localhost:3000/api/omnichannel/webhooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'onMessage',
    url: 'https://tu-servidor.com/handle-message'
  })
});

// En tu servidor de webhooks
app.post('/handle-message', async (req, res) => {
  const { channel, from, text } = req.body;

  let respuesta = 'Lo siento, no entiendo tu pregunta.';

  if (text.toLowerCase().includes('precio')) {
    respuesta = 'El precio es $999 MXN';
  } else if (text.toLowerCase().includes('horario')) {
    respuesta = 'Atendemos de Lunes a Viernes, 9am - 6pm';
  }

  await fetch('http://localhost:3000/api/omnichannel/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel,
      recipient: from,
      message: respuesta
    })
  });

  res.json({ success: true });
});
```

### Ejemplo 3: Integración con Workflow RPA

```javascript
// Crear workflow que envía mensajes
const workflow = {
  name: 'Enviar confirmación por WhatsApp',
  actions: [
    {
      type: 'navigate',
      url: 'https://sistema-crm.com/pedidos',
      windowName: 'CRM'
    },
    {
      type: 'click',
      selector: '#btn-ver-pedido',
      windowName: 'CRM'
    },
    {
      type: 'extract',
      selector: '#numero-pedido',
      windowName: 'CRM'
    },
    {
      type: 'custom',
      handler: async (data) => {
        // Enviar WhatsApp con el número de pedido extraído
        await fetch('http://localhost:3000/api/omnichannel/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'whatsapp',
            recipient: '5215512345678',
            message: `Tu pedido ${data.numeroPedido} ha sido procesado.`
          })
        });
      }
    }
  ]
};
```

---

## 📱 Frontend de Ejemplo

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Omnicanalidad - Panel</title>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
</head>
<body>
  <h1>Panel de Omnicanalidad</h1>

  <div id="status"></div>

  <h2>WhatsApp QR</h2>
  <canvas id="qr-canvas"></canvas>

  <h2>Enviar Mensaje</h2>
  <select id="channel">
    <option value="whatsapp">WhatsApp</option>
    <option value="telegram">Telegram</option>
  </select>
  <input type="text" id="recipient" placeholder="Destinatario">
  <textarea id="message" placeholder="Mensaje"></textarea>
  <button onclick="enviarMensaje()">Enviar</button>

  <script>
    // Inicializar sistema
    async function inicializar() {
      const response = await fetch('/api/omnichannel/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            whatsapp: { enabled: true, provider: 'whatsapp-web.js' },
            telegram: { enabled: true, token: 'TU_TOKEN_AQUI' }
          }
        })
      });

      const data = await response.json();
      console.log('Inicializado:', data);

      // Obtener QR de WhatsApp
      if (data.channels.whatsapp.status === 'qr_ready') {
        setTimeout(mostrarQR, 2000);
      }

      // Verificar estado cada 5 segundos
      setInterval(verificarEstado, 5000);
    }

    async function mostrarQR() {
      const response = await fetch('/api/omnichannel/whatsapp/qr');
      const data = await response.json();

      if (data.success && data.qr) {
        QRCode.toCanvas(document.getElementById('qr-canvas'), data.qr);
      }
    }

    async function verificarEstado() {
      const response = await fetch('/api/omnichannel/status');
      const data = await response.json();

      document.getElementById('status').innerHTML = `
        <p>WhatsApp: ${data.channels.whatsapp.status}</p>
        <p>Telegram: ${data.channels.telegram.status}</p>
        <p>Conversaciones: ${data.stats.conversations.total}</p>
      `;
    }

    async function enviarMensaje() {
      const channel = document.getElementById('channel').value;
      const recipient = document.getElementById('recipient').value;
      const message = document.getElementById('message').value;

      const response = await fetch('/api/omnichannel/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, recipient, message })
      });

      const data = await response.json();
      alert(data.success ? 'Mensaje enviado!' : 'Error: ' + data.error);
    }

    // Iniciar al cargar la página
    inicializar();
  </script>
</body>
</html>
```

---

## 🔒 Seguridad

### Recomendaciones

1. **No expongas tokens en el frontend** - Siempre maneja tokens y credenciales en el backend
2. **Valida destinatarios** - Verifica que los números/IDs sean válidos antes de enviar
3. **Rate limiting** - Implementa límites de tasa para prevenir spam
4. **Encriptación** - Encripta las credenciales almacenadas
5. **Logs seguros** - No registres información sensible en logs

### Ejemplo con Variables de Entorno

```bash
# .env
TELEGRAM_BOT_TOKEN=tu_token_aqui
TWILIO_ACCOUNT_SID=tu_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
```

```javascript
require('dotenv').config();

const config = {
  telegram: {
    enabled: true,
    token: process.env.TELEGRAM_BOT_TOKEN
  }
};
```

---

## ❓ Troubleshooting

### WhatsApp QR no se genera

**Problema:** El QR de WhatsApp no aparece

**Solución:**
1. Verifica que `whatsapp-web.js` esté instalado
2. Asegúrate de que `headless: false` en la configuración
3. Espera unos segundos después de inicializar
4. Revisa los logs del servidor

### Telegram bot no responde

**Problema:** El bot de Telegram no recibe mensajes

**Solución:**
1. Verifica que el token sea correcto
2. Asegúrate de que `polling: true`
3. Verifica que el bot no esté bloqueado
4. Revisa los logs de errores de polling

### Mensajes no se envían

**Problema:** Los mensajes quedan en cola pero no se envían

**Solución:**
1. Verifica que el canal esté conectado (`status: 'connected'`)
2. Revisa que el formato del destinatario sea correcto
3. Para WhatsApp: número con código de país (ej: 5215512345678)
4. Para Telegram: chat ID numérico

---

## 📚 Recursos Adicionales

- [WhatsApp Web JS Documentation](https://wwebjs.dev/)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Node Telegram Bot API](https://github.com/yagop/node-telegram-bot-api)

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de omnicanalidad integrado con tu RPA de Alqvimia.

**Características implementadas:**
- ✅ WhatsApp (Web y Twilio)
- ✅ Telegram Bot
- ✅ Templates de mensajes
- ✅ Webhooks
- ✅ Historial de conversaciones
- ✅ Multimedia
- ✅ Botones interactivos (Telegram)
- ✅ Integración con workflows RPA

**¡Empieza a automatizar tu comunicación omnicanal! 🚀**
