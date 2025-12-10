# 🚀 Guía de Instaladores BAT - Omnicanalidad

Scripts automatizados para instalar y configurar el sistema de omnicanalidad en Windows.

---

## 📋 Lista de Archivos BAT

| Archivo | Descripción |
|---------|-------------|
| [setup-complete.bat](#setup-completebat) | **Todo-en-uno**: Instalación completa automática |
| [install-omnichannel.bat](#install-omnichannelbat) | Instala dependencias (whatsapp-web.js, node-telegram-bot-api) |
| [test-omnichannel-setup.bat](#test-omnichannel-setupbat) | Asistente de configuración interactivo |
| [start-server.bat](#start-serverbat) | Inicia el servidor Alqvimia RPA |
| [init-omnichannel.bat](#init-omnichannelbat) | Inicializa el sistema de omnicanalidad |
| [test-send-message.bat](#test-send-messagebat) | Envía mensajes de prueba por WhatsApp/Telegram |
| [check-omnichannel-status.bat](#check-omnichannel-statusbat) | Verifica el estado del sistema |

---

## 🎯 Opción 1: Instalación Automática (Recomendado)

### setup-complete.bat

**Ejecuta la instalación completa en un solo comando.**

#### Uso:

```bash
# Doble click en el archivo o ejecuta:
setup-complete.bat
```

#### ¿Qué hace?

1. ✅ Instala dependencias de npm
2. ✅ Te guía para configurar Telegram
3. ✅ Genera archivos de configuración
4. ✅ Inicia el servidor automáticamente
5. ✅ Inicializa el sistema de omnicanalidad
6. ✅ Muestra el QR de WhatsApp

#### Duración: ~5 minutos

---

## 🔧 Opción 2: Instalación Paso a Paso

### Paso 1: install-omnichannel.bat

**Instala las dependencias necesarias.**

#### Uso:

```bash
install-omnichannel.bat
```

#### ¿Qué instala?

- `whatsapp-web.js` - Para conexión con WhatsApp
- `node-telegram-bot-api` - Para bot de Telegram

#### Salida esperada:

```
========================================
 INSTALADOR DE OMNICANALIDAD
========================================

[1/3] Verificando Node.js y npm...
OK - Node.js y npm encontrados

[2/3] Instalando dependencias...
Instalando whatsapp-web.js...
✓ whatsapp-web.js instalado

Instalando node-telegram-bot-api...
✓ node-telegram-bot-api instalado

[3/3] Verificando instalación...

========================================
 INSTALACION COMPLETADA
========================================
```

---

### Paso 2: test-omnichannel-setup.bat

**Asistente interactivo de configuración.**

#### Uso:

```bash
test-omnichannel-setup.bat
```

#### ¿Qué hace?

1. Te pide el token de Telegram (opcional)
2. Genera `omnichannel-config.js` con tu configuración
3. Genera `init-omnichannel.js` script de inicialización

#### Ejemplo de interacción:

```
========================================
 CONFIGURACION DE TELEGRAM
========================================

Si quieres usar Telegram, necesitas un token de @BotFather

Pasos para obtener el token:
1. Abre Telegram
2. Busca @BotFather
3. Envia /newbot
4. Sigue las instrucciones
5. Copia el token que te da

Ingresa tu token de Telegram (o deja vacio para omitir): 123456789:ABCdefGHIjklMNO...

========================================
 GENERANDO ARCHIVO DE CONFIGURACION
========================================

Archivo de configuracion creado: omnichannel-config.js
```

---

### Paso 3: start-server.bat

**Inicia el servidor Express.**

#### Uso:

```bash
start-server.bat
```

#### Salida:

```
========================================
 SERVIDOR ALQVIMIA RPA
 Sistema de Omnicanalidad Activo
========================================

╔════════════════════════════════════════════════════════════════╗
║            🤖 ELEMENT SPY - RPA AUTOMATION TOOL 🤖             ║
║  Servidor corriendo en: http://localhost:3000                  ║
╚════════════════════════════════════════════════════════════════╝
```

**⚠️ IMPORTANTE:** Mantén esta ventana abierta mientras uses el sistema.

---

### Paso 4: init-omnichannel.bat

**Inicializa WhatsApp y Telegram.**

#### Uso:

```bash
# En otra ventana (con el servidor corriendo)
init-omnichannel.bat
```

#### ¿Qué hace?

1. Lee la configuración de `omnichannel-config.js`
2. Llama a `/api/omnichannel/initialize`
3. Muestra el QR de WhatsApp si está configurado
4. Conecta con Telegram si hay token

#### Salida esperada:

```
========================================
 INICIALIZADOR DE OMNICANALIDAD
========================================

Ejecutando script de inicializacion...

Sistema inicializado correctamente
WhatsApp: qr_ready
Telegram: connected

Esperando QR de WhatsApp...

QR Code disponible!
Copia este codigo y pegalo en: https://qrcode.show/

[AQUI APARECE EL CODIGO QR]

========================================
```

---

## 🧪 Scripts de Prueba

### test-send-message.bat

**Envía mensajes de prueba por WhatsApp o Telegram.**

#### Uso:

```bash
test-send-message.bat
```

#### Interfaz:

```
========================================
 PRUEBA DE ENVIO DE MENSAJES
========================================

Selecciona el canal:
1. WhatsApp
2. Telegram
3. Salir

Opcion: 1

--- ENVIO POR WHATSAPP ---

Numero de telefono (con codigo de pais): 5215512345678
Mensaje a enviar: Hola! Mensaje de prueba

Enviando mensaje...
{"success":true,"messageId":"msg_123..."}
```

#### Ejemplos:

**WhatsApp:**
- Número: `5215512345678` (código país + número)
- Mensaje: `Hola desde Alqvimia RPA!`

**Telegram:**
- Chat ID: `123456789` (numérico)
- Mensaje: `Mensaje de prueba`

---

### check-omnichannel-status.bat

**Verifica el estado del sistema.**

#### Uso:

```bash
check-omnichannel-status.bat
```

#### Salida:

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
      "username": "tu_bot"
    }
  },
  "stats": {
    "conversations": {
      "total": 10,
      "byChannel": {
        "whatsapp": 7,
        "telegram": 3
      }
    },
    "messages": {
      "queued": 0,
      "templates": 2
    }
  }
}
```

---

## 📁 Archivos Generados

Después de ejecutar los scripts, se crearán estos archivos:

### omnichannel-config.js

```javascript
// Configuracion de Omnicanalidad
// Generado automaticamente

const config = {
  whatsapp: {
    enabled: true,
    provider: 'whatsapp-web.js',
    autoReply: false,
    headless: false
  },
  telegram: {
    enabled: true,
    token: 'TU_TOKEN_AQUI',
    polling: true,
    welcomeMessage: 'Hola! Bienvenido al bot de Alqvimia RPA.'
  }
};

module.exports = config;
```

### init-omnichannel.js

Script Node.js que inicializa el sistema llamando a la API REST.

---

## 🔄 Flujo Completo de Uso

### Primera Vez (Setup)

```
1. setup-complete.bat
   └─> Instala todo y configura
   └─> Inicia servidor
   └─> Muestra QR de WhatsApp
   └─> Escaneas QR con tu WhatsApp
   └─> ¡Listo!
```

### Uso Diario

```
1. start-server.bat (mantener abierto)
2. init-omnichannel.bat (si se cerró el servidor)
3. test-send-message.bat (para enviar mensajes)
4. check-omnichannel-status.bat (para ver estado)
```

---

## ❓ Troubleshooting

### Error: "Node.js no está instalado"

**Solución:** Instala Node.js desde [https://nodejs.org/](https://nodejs.org/)

### Error: "No se encontró el archivo de configuración"

**Solución:** Ejecuta primero `test-omnichannel-setup.bat`

### Error: "Sistema no inicializado"

**Solución:**
1. Verifica que el servidor esté corriendo (`start-server.bat`)
2. Ejecuta `init-omnichannel.bat`

### QR de WhatsApp no aparece

**Solución:**
1. Espera 5-10 segundos después de inicializar
2. Ejecuta `check-omnichannel-status.bat` para ver el estado
3. Si el estado es `qr_ready`, el QR está disponible
4. Ve a [https://qrcode.show/](https://qrcode.show/) y pega el código

### Telegram bot no responde

**Solución:**
1. Verifica que el token sea correcto en `omnichannel-config.js`
2. Abre Telegram y busca tu bot
3. Envía `/start` al bot
4. Intenta enviar un mensaje

### Curl no reconocido

**Solución:**

Si `curl` no está disponible en tu sistema, puedes:

**Opción A:** Usar PowerShell en lugar de CMD

**Opción B:** Instalar curl
- Windows 10+: Ya incluido
- Windows 7/8: Descarga desde [https://curl.se/windows/](https://curl.se/windows/)

**Opción C:** Usar el HTML de prueba
- Abre `test-omnichannel.html` en tu navegador

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Instalación desde cero

```bash
# Paso 1: Instalar
setup-complete.bat

# Sigue las instrucciones, ingresa tu token de Telegram

# Paso 2: Escanear QR de WhatsApp cuando aparezca

# Paso 3: ¡Listo! Ya puedes enviar mensajes
test-send-message.bat
```

### Ejemplo 2: Reinstalar después de cerrar

```bash
# Si cerraste el servidor, simplemente:
start-server.bat

# En otra ventana:
init-omnichannel.bat

# Ya está funcionando de nuevo
```

### Ejemplo 3: Solo WhatsApp (sin Telegram)

```bash
# 1. Ejecuta setup, deja vacío el token de Telegram
test-omnichannel-setup.bat
(presiona Enter cuando pida el token)

# 2. Inicia servidor
start-server.bat

# 3. Inicializa
init-omnichannel.bat

# Solo WhatsApp estará activo
```

### Ejemplo 4: Cambiar configuración de Telegram

```bash
# 1. Edita el archivo generado
notepad omnichannel-config.js

# 2. Cambia el token en la línea "token: '...'"

# 3. Guarda y cierra

# 4. Reinicia el sistema
start-server.bat (en una ventana)
init-omnichannel.bat (en otra ventana)
```

---

## 📊 Tabla Resumen de Scripts

| Script | Cuándo usarlo | Necesita servidor | Duración |
|--------|---------------|-------------------|----------|
| `setup-complete.bat` | Primera instalación | ❌ No | ~5 min |
| `install-omnichannel.bat` | Solo instalar dependencias | ❌ No | ~3 min |
| `test-omnichannel-setup.bat` | Configurar sistema | ❌ No | ~1 min |
| `start-server.bat` | Iniciar servidor | ❌ No | Continuo |
| `init-omnichannel.bat` | Activar omnicanalidad | ✅ Sí | ~10 seg |
| `test-send-message.bat` | Enviar mensajes de prueba | ✅ Sí | Interactivo |
| `check-omnichannel-status.bat` | Ver estado | ✅ Sí | ~2 seg |

---

## 🚀 Inicio Rápido (TL;DR)

```bash
# Ejecuta UNO de estos comandos:
setup-complete.bat

# O manualmente:
install-omnichannel.bat
test-omnichannel-setup.bat
start-server.bat
# (en otra ventana:)
init-omnichannel.bat

# Listo! Ahora prueba:
test-send-message.bat
```

---

## 📚 Recursos Adicionales

- **Guía completa:** [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)
- **Instalación rápida:** [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md)
- **Detalles técnicos:** [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md)

---

## ✅ Checklist de Verificación

Después de ejecutar los scripts, verifica:

- [ ] ✅ Dependencias instaladas (`npm list whatsapp-web.js node-telegram-bot-api`)
- [ ] ✅ Archivos de configuración creados (`omnichannel-config.js`, `init-omnichannel.js`)
- [ ] ✅ Servidor corriendo (`http://localhost:3000` responde)
- [ ] ✅ WhatsApp conectado (QR escaneado)
- [ ] ✅ Telegram conectado (si configuraste token)
- [ ] ✅ Puedes enviar mensajes de prueba

---

¡Disfruta tu sistema de omnicanalidad automatizado! 🎉
