# 📚 Índice Maestro - Sistema de Omnicanalidad

Guía completa para navegar todos los recursos del sistema de omnicanalidad de Alqvimia RPA.

---

## 🗂️ Documentación

### 📘 Guías de Usuario

| Documento | Descripción | Para quién |
|-----------|-------------|------------|
| **[GUIA_INTERFAZ_OMNICANALIDAD.md](GUIA_INTERFAZ_OMNICANALIDAD.md)** | 🌟 **Guía completa de la interfaz web** | Todos los usuarios, uso de la UI |
| **[INSTALADORES_BAT.md](INSTALADORES_BAT.md)** | Guía completa de scripts .bat de instalación | Usuarios Windows, instalación automatizada |
| **[INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md)** | Guía de 5 minutos para instalar manualmente | Usuarios que prefieren proceso manual |
| **[OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)** | Documentación técnica completa del sistema | Desarrolladores, uso avanzado |
| **[MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md)** | Detalles técnicos de la implementación | Desarrolladores, arquitectura |

---

## 🚀 Scripts de Instalación (.bat)

### Scripts Principales

| Archivo | Propósito | Uso |
|---------|-----------|-----|
| **[setup-complete.bat](setup-complete.bat)** | 🌟 **Instalación automática completa** | Doble click para instalar todo |
| **[install-omnichannel.bat](install-omnichannel.bat)** | Instala dependencias npm | Ejecutar primero si instalas manualmente |
| **[test-omnichannel-setup.bat](test-omnichannel-setup.bat)** | Asistente de configuración | Configura WhatsApp y Telegram |
| **[start-server.bat](start-server.bat)** | Inicia el servidor | Mantener abierto durante uso |
| **[init-omnichannel.bat](init-omnichannel.bat)** | Inicializa el sistema | Ejecutar después de start-server |

### Scripts de Prueba

| Archivo | Propósito | Cuándo usar |
|---------|-----------|-------------|
| **[test-send-message.bat](test-send-message.bat)** | Envía mensajes de prueba | Para probar que funciona |
| **[check-omnichannel-status.bat](check-omnichannel-status.bat)** | Verifica el estado | Para diagnosticar problemas |

---

## 💻 Código Fuente

### Backend (Node.js)

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| **[server/mcp/omnichannel-server.js](server/mcp/omnichannel-server.js)** | 460 | Servidor MCP principal |
| **[server/mcp/whatsapp-agent.js](server/mcp/whatsapp-agent.js)** | 470 | Agente de WhatsApp |
| **[server/mcp/telegram-agent.js](server/mcp/telegram-agent.js)** | 520 | Agente de Telegram |
| **[server/mcp/index.js](server/mcp/index.js)** | 260 | Controlador de integración |
| **[server/engine/workflow-engine.js](server/engine/workflow-engine.js)** | +100 | Motor de workflows (multi-ventana) |
| **[server/index.js](server/index.js)** | +280 | Servidor Express con endpoints REST |

---

## 🎯 Inicio Rápido por Tipo de Usuario

### 🟢 Usuario Nuevo (Primera Vez)

1. **Instalación automatizada:**
   ```bash
   setup-complete.bat
   ```

2. **Lee la guía:**
   - [INSTALADORES_BAT.md](INSTALADORES_BAT.md) - Cómo usar los scripts

3. **Prueba el sistema:**
   ```bash
   test-send-message.bat
   ```

**Tiempo total:** 5-10 minutos

---

### 🔵 Usuario Avanzado

1. **Instalación manual:**
   ```bash
   npm install whatsapp-web.js node-telegram-bot-api
   ```

2. **Consulta documentación técnica:**
   - [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)
   - [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md)

3. **Configura mediante API:**
   ```bash
   curl -X POST http://localhost:3000/api/omnichannel/initialize ...
   ```

---

### 🟣 Desarrollador

1. **Revisa arquitectura:**
   - [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md) - Arquitectura completa

2. **Explora código fuente:**
   - `server/mcp/` - Sistema de omnicanalidad
   - `server/engine/workflow-engine.js` - Multi-ventana

3. **Consulta API REST:**
   - [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md#-enviar-mensajes)

4. **Personaliza agentes:**
   - Modifica `server/mcp/whatsapp-agent.js`
   - Modifica `server/mcp/telegram-agent.js`

---

## 📋 Flujos de Trabajo Comunes

### Flujo 1: Primera Instalación

```
1. setup-complete.bat
   └─> Instala dependencias
   └─> Configura sistema
   └─> Inicia servidor
   └─> Inicializa omnicanalidad
   └─> Muestra QR de WhatsApp

2. Escanear QR con WhatsApp

3. test-send-message.bat
   └─> Enviar mensaje de prueba

4. ✅ Sistema funcionando
```

### Flujo 2: Uso Diario

```
1. start-server.bat
   └─> Mantener abierto

2. init-omnichannel.bat
   └─> Inicializa canales

3. Usar el sistema normalmente
   └─> API REST
   └─> Workflows RPA
   └─> test-send-message.bat

4. Al terminar: Cerrar servidor (Ctrl+C)
```

### Flujo 3: Cambiar Configuración

```
1. test-omnichannel-setup.bat
   └─> Ingresar nuevo token de Telegram

2. start-server.bat
   └─> Reiniciar servidor

3. init-omnichannel.bat
   └─> Reinicializar con nueva config

4. ✅ Configuración actualizada
```

### Flujo 4: Desarrollo de Bot Personalizado

```
1. Editar server/mcp/telegram-agent.js
   └─> Agregar nuevo comando

2. Reiniciar servidor

3. init-omnichannel.bat

4. Probar comando en Telegram
   └─> /mi_nuevo_comando

5. ✅ Funcionalidad agregada
```

---

## 🔍 Búsqueda Rápida

### "¿Cómo instalo el sistema?"

👉 Usa **[setup-complete.bat](setup-complete.bat)** o lee [INSTALADORES_BAT.md](INSTALADORES_BAT.md)

### "¿Cómo obtengo el QR de WhatsApp?"

👉 Ejecuta `init-omnichannel.bat` y lee [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md#-paso-4-inicializar-sistema-de-omnicanalidad)

### "¿Cómo envío un mensaje?"

👉 Usa **[test-send-message.bat](test-send-message.bat)** o lee [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md#-enviar-mensajes)

### "¿Cómo creo un bot de Telegram?"

👉 Lee [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md#-paso-2-obtener-token-de-telegram-opcional)

### "¿Cómo veo el estado del sistema?"

👉 Ejecuta **[check-omnichannel-status.bat](check-omnichannel-status.bat)**

### "¿Cómo funciona la arquitectura?"

👉 Lee [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md#-componente-1-servidor-mcp-omnicanalidad)

### "¿Qué endpoints REST hay disponibles?"

👉 Lee [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md) sección "Endpoints"

### "¿Cómo uso templates de mensajes?"

👉 Lee [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md#-templates-de-mensajes)

### "¿Cómo creo webhooks?"

👉 Lee [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md#-webhooks)

### "¿Cómo integro con workflows RPA?"

👉 Lee [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md#ejemplo-3-integración-con-workflow-rpa)

---

## 📊 Características del Sistema

### ✅ Canales Soportados

- **WhatsApp**
  - whatsapp-web.js (gratuito, con QR)
  - Twilio (pago, API directa)

- **Telegram**
  - Bot API oficial (gratuito)
  - Comandos personalizables
  - Botones interactivos

### ✅ Funcionalidades Principales

- ✅ Envío de mensajes de texto
- ✅ Envío de multimedia (imágenes, videos, documentos)
- ✅ Recepción de mensajes
- ✅ Historial de conversaciones
- ✅ Sistema de templates
- ✅ Webhooks
- ✅ Auto-respuestas
- ✅ Comandos de Telegram
- ✅ Botones inline (Telegram)
- ✅ Integración con workflows RPA
- ✅ API REST completa

### ✅ Multi-Ventana en RPA

- ✅ Soporte para múltiples ventanas/pestañas en workflows
- ✅ Selectores funcionan en la ventana correcta
- ✅ Acción `switch_window` para cambiar contexto
- ✅ Compatible con `recorder-professional.js`

---

## 🎓 Tutoriales

### Tutorial 1: "Hola Mundo" con WhatsApp

**Objetivo:** Enviar tu primer mensaje por WhatsApp

**Pasos:**

1. Instalar:
   ```bash
   setup-complete.bat
   ```

2. Escanear QR cuando aparezca

3. Enviar mensaje:
   ```bash
   test-send-message.bat
   ```
   - Seleccionar "WhatsApp"
   - Ingresar tu número: `5215512345678`
   - Mensaje: `Hola Mundo!`

4. ✅ Deberías recibir el mensaje en tu WhatsApp

---

### Tutorial 2: "Hola Mundo" con Telegram

**Objetivo:** Enviar tu primer mensaje por Telegram

**Pasos:**

1. Obtener token de @BotFather en Telegram

2. Configurar:
   ```bash
   test-omnichannel-setup.bat
   ```
   - Ingresar token cuando lo pida

3. Iniciar servidor:
   ```bash
   start-server.bat
   ```

4. En otra ventana:
   ```bash
   init-omnichannel.bat
   ```

5. Buscar tu bot en Telegram y enviarle `/start`

6. Obtener tu chat ID:
   - Envía cualquier mensaje al bot
   - Ve al servidor, verás el chat ID en los logs

7. Enviar mensaje de prueba:
   ```bash
   test-send-message.bat
   ```
   - Seleccionar "Telegram"
   - Ingresar tu chat ID
   - Mensaje: `Hola Mundo!`

8. ✅ Deberías recibir el mensaje en Telegram

---

### Tutorial 3: Crear un Bot de Soporte Automático

**Objetivo:** Bot que responde automáticamente a consultas comunes

**Pasos:**

1. Edita `server/mcp/telegram-agent.js`

2. Busca la función `registerDefaultCommands()`

3. Agrega un nuevo comando:
   ```javascript
   this.registerCommand('precio', async (msg) => {
     await this.sendMessage(msg.chat.id,
       '💰 Nuestros precios:\n\n' +
       '- Plan Básico: $99/mes\n' +
       '- Plan Pro: $199/mes\n' +
       '- Plan Enterprise: Contactar'
     );
   });
   ```

4. Guarda y reinicia el servidor

5. En Telegram, envía `/precio` a tu bot

6. ✅ El bot responderá con la lista de precios

---

## 🔧 Mantenimiento

### Actualizar Dependencias

```bash
npm update whatsapp-web.js node-telegram-bot-api
```

### Limpiar Sesión de WhatsApp

```bash
# Elimina la carpeta .wwebjs_auth
rmdir /s .wwebjs_auth
```

Luego reinicia y escanea el QR de nuevo.

### Cambiar Token de Telegram

1. Edita `omnichannel-config.js`
2. Cambia el valor de `token`
3. Reinicia: `start-server.bat` → `init-omnichannel.bat`

### Ver Logs del Servidor

Los logs aparecen en la ventana donde ejecutaste `start-server.bat`

---

## 📞 Soporte

### Problemas Comunes

Consulta la sección de **Troubleshooting** en:
- [INSTALADORES_BAT.md](INSTALADORES_BAT.md#-troubleshooting)
- [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md#-problemas-comunes)

### Reportar Bugs

Si encuentras un bug, incluye:
- Sistema operativo
- Versión de Node.js (`node --version`)
- Comando que ejecutaste
- Error completo
- Logs del servidor

---

## 🎯 Roadmap

### Futuras Mejoras

- [ ] Dashboard web interactivo
- [ ] Soporte para más canales (Discord, Slack)
- [ ] Base de datos para persistencia
- [ ] Sistema de colas con Redis
- [ ] Autenticación y autorización
- [ ] Rate limiting avanzado
- [ ] Análisis de sentimientos
- [ ] Respuestas con IA (GPT, Claude)
- [ ] Integración con CRM

---

## 📜 Licencia y Créditos

**Sistema desarrollado para:** Alqvimia RPA

**Desarrollado por:** Claude Sonnet 4.5

**Fecha:** Diciembre 2024

**Versión:** 1.0.0

---

## 🌟 Resumen de Archivos

### Documentación (6 archivos)
- ✅ INDICE_OMNICANALIDAD.md (este archivo)
- ✅ GUIA_INTERFAZ_OMNICANALIDAD.md
- ✅ INSTALADORES_BAT.md
- ✅ INSTALACION_RAPIDA_OMNICANALIDAD.md
- ✅ OMNICANALIDAD_README.md
- ✅ MEJORAS_IMPLEMENTADAS.md

### Scripts BAT (7 archivos)
- ✅ setup-complete.bat
- ✅ install-omnichannel.bat
- ✅ test-omnichannel-setup.bat
- ✅ start-server.bat
- ✅ init-omnichannel.bat
- ✅ test-send-message.bat
- ✅ check-omnichannel-status.bat

### Código Backend (6 archivos)
- ✅ server/mcp/omnichannel-server.js
- ✅ server/mcp/whatsapp-agent.js
- ✅ server/mcp/telegram-agent.js
- ✅ server/mcp/index.js
- ✅ server/engine/workflow-engine.js
- ✅ server/index.js

### Frontend (3 archivos)
- ✅ public/js/omnichannel-ui.js (750 líneas)
- ✅ public/css/omnichannel-styles.css (550 líneas)
- ✅ public/index.html (interfaz integrada)

**Total:** ~4,500 líneas de código + 3,500 líneas de documentación

---

¡Disfruta tu sistema de omnicanalidad! 🚀📱
