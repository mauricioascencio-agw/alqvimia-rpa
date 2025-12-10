# ⚡ Inicio Rápido - Alqvimia RPA con Omnicanalidad

**Sistema completo de automatización RPA + Chatbots de WhatsApp y Telegram**

---

## 🎯 ¿Qué puedes hacer?

### 🤖 RPA (Automatización Web)
- ✅ Grabar acciones en páginas web
- ✅ Crear workflows automáticos
- ✅ Ejecutar tareas repetitivas
- ✅ Extraer datos de sitios web
- ✅ **NUEVO:** Soporte multi-ventana/multi-pestaña

### 📱 Omnicanalidad
- ✅ Chatbot de WhatsApp
- ✅ Chatbot de Telegram
- ✅ Envío masivo de mensajes
- ✅ Auto-respuestas
- ✅ Integración con workflows RPA

---

## 🚀 Instalación en 3 Pasos

### Opción A: Instalación Automática (Recomendado)

```bash
# Paso 1: Doble click en el archivo
setup-complete.bat

# Paso 2: Sigue las instrucciones en pantalla
# - Ingresa tu token de Telegram (opcional)
# - Escanea el QR de WhatsApp cuando aparezca

# Paso 3: ¡Listo! Ya funciona
```

**Tiempo:** 5 minutos

---

### Opción B: Instalación Manual

```bash
# Paso 1: Instalar dependencias
npm install whatsapp-web.js node-telegram-bot-api

# Paso 2: Configurar
test-omnichannel-setup.bat

# Paso 3: Iniciar
start-server.bat
# En otra ventana:
init-omnichannel.bat
```

**Tiempo:** 7 minutos

---

## 📖 Documentación

| Tema | Archivo | Descripción |
|------|---------|-------------|
| **Índice General** | [INDICE_OMNICANALIDAD.md](INDICE_OMNICANALIDAD.md) | 📚 Índice maestro con todo |
| **Scripts .bat** | [INSTALADORES_BAT.md](INSTALADORES_BAT.md) | 🔧 Guía de instaladores Windows |
| **Instalación Rápida** | [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md) | ⚡ Guía de 5 minutos |
| **Documentación Completa** | [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md) | 📘 Referencia técnica completa |
| **Detalles Técnicos** | [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md) | 🔍 Arquitectura y código |

---

## 🎬 Ejemplos Rápidos

### Ejemplo 1: Enviar Mensaje por WhatsApp

```bash
# Opción A: Usar el script interactivo
test-send-message.bat

# Opción B: Usar curl (API REST)
curl -X POST http://localhost:3000/api/omnichannel/send-message ^
  -H "Content-Type: application/json" ^
  -d "{\"channel\":\"whatsapp\",\"recipient\":\"5215512345678\",\"message\":\"Hola!\"}"
```

### Ejemplo 2: Enviar Mensaje por Telegram

```bash
# Opción A: Usar el script interactivo
test-send-message.bat

# Opción B: Usar curl (API REST)
curl -X POST http://localhost:3000/api/omnichannel/send-message ^
  -H "Content-Type: application/json" ^
  -d "{\"channel\":\"telegram\",\"recipient\":\"123456789\",\"message\":\"Hola!\"}"
```

### Ejemplo 3: Verificar Estado

```bash
check-omnichannel-status.bat
```

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                 Alqvimia RPA Server                 │
│                  (Express + Node.js)                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐         ┌──────────────────────┐ │
│  │   RPA Engine │         │  Omnicanalidad MCP  │ │
│  │              │         │                      │ │
│  │ - Puppeteer  │         │ ┌──────────────────┐ │ │
│  │ - Recorder   │         │ │ WhatsApp Agent   │ │ │
│  │ - Workflows  │         │ │ - whatsapp-web.js│ │ │
│  │ - Multi-     │◄────────┤ │ - Twilio API     │ │ │
│  │   Window     │         │ └──────────────────┘ │ │
│  └──────────────┘         │                      │ │
│                            │ ┌──────────────────┐ │ │
│                            │ │ Telegram Agent   │ │ │
│                            │ │ - Bot API        │ │ │
│                            │ │ - Comandos       │ │ │
│                            │ └──────────────────┘ │ │
│                            └──────────────────────┘ │
└─────────────────────────────────────────────────────┘
           │                           │
           │                           │
           ▼                           ▼
    ┌──────────────┐          ┌──────────────┐
    │  Navegador   │          │   Mensajería │
    │  (Chrome)    │          │   WhatsApp   │
    │              │          │   Telegram   │
    └──────────────┘          └──────────────┘
```

---

## 🛠️ Scripts Disponibles

### Instalación y Configuración

| Script | Descripción |
|--------|-------------|
| `setup-complete.bat` | 🌟 Instalación completa automática |
| `install-omnichannel.bat` | Instala solo las dependencias |
| `test-omnichannel-setup.bat` | Asistente de configuración |

### Uso Diario

| Script | Descripción |
|--------|-------------|
| `start-server.bat` | Inicia el servidor RPA |
| `init-omnichannel.bat` | Activa WhatsApp y Telegram |
| `test-send-message.bat` | Envía mensajes de prueba |
| `check-omnichannel-status.bat` | Verifica el estado del sistema |

---

## 🎓 Tutoriales Interactivos

### Tutorial 1: Tu Primer Mensaje de WhatsApp

**Objetivo:** Enviar "Hola Mundo" a tu WhatsApp

**Pasos:**
1. ✅ Ejecutar `setup-complete.bat`
2. ✅ Escanear QR con tu teléfono
3. ✅ Ejecutar `test-send-message.bat`
4. ✅ Seleccionar WhatsApp
5. ✅ Ingresar tu número con código de país
6. ✅ Escribir mensaje y presionar Enter
7. ✅ ¡Recibirás el mensaje en tu WhatsApp!

**Tiempo:** 3 minutos

---

### Tutorial 2: Crear un Bot de Telegram

**Objetivo:** Bot que responda automáticamente

**Pasos:**
1. ✅ Abrir Telegram, buscar @BotFather
2. ✅ Enviar `/newbot` y seguir instrucciones
3. ✅ Copiar el token que te da
4. ✅ Ejecutar `test-omnichannel-setup.bat`
5. ✅ Pegar el token cuando lo pida
6. ✅ Ejecutar `start-server.bat`
7. ✅ En otra ventana: `init-omnichannel.bat`
8. ✅ Buscar tu bot en Telegram y enviarle `/start`
9. ✅ ¡El bot te responderá!

**Tiempo:** 5 minutos

---

### Tutorial 3: Workflow RPA con Notificación WhatsApp

**Objetivo:** Automatizar tarea web y enviar resultado por WhatsApp

**Pasos:**
1. ✅ Crear workflow en el dashboard web
2. ✅ Agregar acción "Navigate" a página web
3. ✅ Agregar acción "Extract" para obtener datos
4. ✅ Agregar acción "HTTP Request" para enviar mensaje:
   ```json
   POST http://localhost:3000/api/omnichannel/send-message
   {
     "channel": "whatsapp",
     "recipient": "5215512345678",
     "message": "Tarea completada! Resultado: {{extracted_data}}"
   }
   ```
5. ✅ Ejecutar workflow
6. ✅ ¡Recibirás notificación en WhatsApp!

**Tiempo:** 10 minutos

---

## 🔥 Casos de Uso Reales

### 1. Bot de Soporte al Cliente

**Escenario:** Responder automáticamente preguntas frecuentes

**Implementación:**
- WhatsApp: Auto-respuestas con `autoReply: true`
- Telegram: Comandos `/precio`, `/horario`, `/contacto`
- Webhooks para escalar a agente humano

**Beneficios:**
- ✅ Atención 24/7
- ✅ Respuestas instantáneas
- ✅ Reduce carga de trabajo

---

### 2. Notificaciones de Pedidos

**Escenario:** Notificar a clientes cuando su pedido cambia de estado

**Implementación:**
1. Workflow RPA monitorea sistema de pedidos
2. Detecta cambios de estado
3. Envía mensaje por WhatsApp/Telegram con detalles
4. Incluye link de seguimiento

**Beneficios:**
- ✅ Clientes informados en tiempo real
- ✅ Reduce consultas de "¿Dónde está mi pedido?"
- ✅ Mejora satisfacción del cliente

---

### 3. Alertas de Monitoreo

**Escenario:** Alertas cuando sistema tiene problemas

**Implementación:**
1. Workflow RPA verifica sitio web cada 5 minutos
2. Si detecta error, extrae detalles
3. Envía alerta por Telegram al equipo técnico
4. Incluye screenshot del error

**Beneficios:**
- ✅ Detección temprana de problemas
- ✅ Notificación inmediata al equipo
- ✅ Menos downtime

---

## 📈 Estadísticas del Sistema

### Lo que se instaló:

```
✅ Código Backend:
   - 4 componentes MCP (1,710 líneas)
   - Motor RPA mejorado (+100 líneas)
   - 13 endpoints REST (+280 líneas)

✅ Scripts de Instalación:
   - 7 archivos .bat automatizados

✅ Documentación:
   - 5 guías completas (2,500+ líneas)

✅ Funcionalidades:
   - 2 canales de mensajería (WhatsApp, Telegram)
   - 3 proveedores soportados
   - Sistema de templates
   - Sistema de webhooks
   - Historial de conversaciones
   - Multi-ventana en workflows RPA
```

---

## ❓ FAQ - Preguntas Frecuentes

### ¿Necesito pagar por WhatsApp o Telegram?

**No.** Ambos son gratuitos:
- WhatsApp usa `whatsapp-web.js` (gratis, como WhatsApp Web)
- Telegram Bot API es completamente gratuita

*Nota: Twilio WhatsApp es opcional y de pago*

### ¿Puedo usar solo WhatsApp o solo Telegram?

**Sí.** Puedes activar solo el canal que necesites en la configuración.

### ¿Los mensajes son seguros?

**Sí.** La comunicación usa los protocolos oficiales de WhatsApp y Telegram, con su encriptación nativa.

### ¿Cuántos mensajes puedo enviar?

**Ilimitados** con `whatsapp-web.js` y Telegram Bot API (con rate limits razonables).

### ¿Funciona con grupos de WhatsApp/Telegram?

**Sí.** Puedes enviar mensajes a grupos obteniendo su ID.

### ¿Puedo enviar imágenes y documentos?

**Sí.** Ambos canales soportan multimedia completo.

### ¿Se guarda el historial de conversaciones?

**Sí.** El sistema mantiene historial completo en memoria durante la ejecución.

---

## 🎯 Próximos Pasos

### Ahora que instalaste el sistema:

1. **📖 Lee la documentación:**
   - [INDICE_OMNICANALIDAD.md](INDICE_OMNICANALIDAD.md) para navegar todo

2. **🧪 Experimenta:**
   - Usa `test-send-message.bat` para probar
   - Crea comandos personalizados en Telegram
   - Envía tu primera imagen

3. **🔧 Personaliza:**
   - Edita `server/mcp/telegram-agent.js` para nuevos comandos
   - Crea templates de mensajes
   - Configura webhooks

4. **🚀 Integra con RPA:**
   - Lee los ejemplos en [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)
   - Crea workflows que envíen notificaciones
   - Automatiza completamente tus procesos

---

## 🆘 ¿Necesitas Ayuda?

### Consulta estas guías según tu problema:

| Problema | Solución |
|----------|----------|
| 🔴 Error al instalar | [INSTALADORES_BAT.md](INSTALADORES_BAT.md#-troubleshooting) |
| 🟡 QR no aparece | [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md#-problemas-comunes) |
| 🟢 ¿Cómo usar la API? | [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md) |
| 🔵 Detalles técnicos | [MEJORAS_IMPLEMENTADAS.md](MEJORAS_IMPLEMENTADAS.md) |

---

## 🌟 ¡Felicidades!

Has instalado exitosamente un sistema completo de:

✅ **RPA (Automatización Web)**
- Workflows multi-ventana
- Grabación de acciones
- Ejecución automatizada

✅ **Omnicanalidad (Chatbots)**
- WhatsApp Bot
- Telegram Bot
- Templates y Webhooks

✅ **Integración Completa**
- Workflows pueden enviar mensajes
- Mensajes pueden disparar workflows
- Sistema unificado y potente

**¡Empieza a automatizar! 🚀**

---

**Versión:** 1.0.0
**Fecha:** Diciembre 2024
**Sistema:** Alqvimia RPA + Omnicanalidad
