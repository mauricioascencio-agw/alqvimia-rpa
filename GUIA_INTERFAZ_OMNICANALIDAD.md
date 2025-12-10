# 🎨 Guía de la Interfaz de Omnicanalidad

## 📋 Índice

1. [Acceso a la Interfaz](#acceso-a-la-interfaz)
2. [Inicialización del Sistema](#inicialización-del-sistema)
3. [Conexión de WhatsApp](#conexión-de-whatsapp)
4. [Configuración de Telegram](#configuración-de-telegram)
5. [Envío de Mensajes](#envío-de-mensajes)
6. [Gestión de Plantillas](#gestión-de-plantillas)
7. [Conversaciones](#conversaciones)
8. [Configuración Avanzada](#configuración-avanzada)

---

## 🚀 Acceso a la Interfaz

### Paso 1: Iniciar el Servidor

```bash
npm start
```

O usando el archivo batch:

```bash
START.bat
```

### Paso 2: Abrir la Aplicación

Abre tu navegador en:

```
http://localhost:3000
```

### Paso 3: Acceder al Módulo de Omnicanalidad

En el menú lateral izquierdo, haz clic en:

```
💬 Omnicanalidad
```

---

## 🔧 Inicialización del Sistema

### Primera Vez

1. **Haz clic en el botón verde "Inicializar Sistema"**
   - Ubicado en la parte superior derecha
   - Icono: ⚡

2. **Espera la confirmación**
   - Verás un mensaje: "Sistema inicializado correctamente"
   - Las tarjetas de estado se actualizarán automáticamente

3. **Tarjetas de Estado**

   Verás 3 tarjetas:

   - **📱 WhatsApp**: Estado de la conexión de WhatsApp
   - **🤖 Telegram**: Estado de la conexión de Telegram
   - **📊 Estadísticas**: Métricas de mensajes enviados

---

## 📱 Conexión de WhatsApp

### Método 1: Código QR Automático

Después de inicializar, si WhatsApp está habilitado:

1. **Aparecerá automáticamente un modal con el QR**
   - O verás un botón "Ver QR" en la tarjeta de WhatsApp

2. **Escanea el QR con tu teléfono**
   - Abre WhatsApp en tu teléfono
   - Ve a: **Configuración → Dispositivos vinculados**
   - Toca "Vincular un dispositivo"
   - Escanea el código QR

3. **Conexión Exitosa**
   - El modal se cerrará automáticamente
   - La tarjeta de WhatsApp mostrará: ✅ Conectado
   - Verás tu número de teléfono

### Método 2: Ver QR Manualmente

Si el QR no aparece automáticamente:

1. En la tarjeta de **WhatsApp**, haz clic en "Ver QR"
2. Se abrirá un modal con el código QR
3. Escanéalo con WhatsApp

---

## 🤖 Configuración de Telegram

### Obtener Token de Bot

1. **Crear un bot en Telegram**
   - Abre Telegram
   - Busca: `@BotFather`
   - Envía: `/newbot`
   - Sigue las instrucciones
   - Recibirás un token como: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

2. **Configurar en la Interfaz**
   - Ve a la pestaña: **⚙️ Configuración**
   - En la sección "Telegram Bot", marca ✅ "Habilitar Telegram"
   - Pega tu token en el campo "Token del Bot"
   - Haz clic en "💾 Guardar Configuración"

3. **Reiniciar el Sistema**
   - Haz clic en "🔄 Refrescar Estado"
   - O reinicia el servidor: `npm start`

4. **Verificar Conexión**
   - La tarjeta de Telegram debería mostrar: ✅ Conectado
   - Verás el nombre de usuario del bot: @tu_bot

---

## ✉️ Envío de Mensajes

### Enviar por WhatsApp

1. **Ve a la pestaña "Mensajes"**
2. **Selecciona el canal**: WhatsApp
3. **Ingresa el número de teléfono**
   - Formato internacional: `5215512345678` (sin + ni espacios)
   - País + Código de área + Número
4. **Escribe tu mensaje**
5. **Haz clic en "📤 Enviar Mensaje"**

### Enviar por Telegram

1. **Ve a la pestaña "Mensajes"**
2. **Selecciona el canal**: Telegram
3. **Ingresa el Chat ID**
   - Puedes obtenerlo enviando un mensaje a tu bot
   - O usando: https://t.me/userinfobot
4. **Escribe tu mensaje**
5. **Haz clic en "📤 Enviar Mensaje"**

### Ejemplo Práctico

```
Canal: WhatsApp
Destinatario: 5215512345678
Mensaje: ¡Hola! Este es un mensaje de prueba desde Alqvimia RPA.
```

---

## 📝 Gestión de Plantillas

### Crear una Plantilla

1. **Ve a la pestaña "Plantillas"**
2. **En el formulario de la izquierda:**
   - **Nombre**: Ej. `bienvenida`
   - **Contenido**: Ej. `¡Hola {{nombre}}! Bienvenido a nuestro servicio.`
3. **Haz clic en "✅ Crear Plantilla"**

### Usar Variables en Plantillas

Usa la sintaxis `{{variable}}` para crear campos dinámicos:

```
Hola {{nombre}},

Tu pedido #{{pedido}} ha sido procesado.

Total: ${{total}}

Gracias por tu compra.
```

### Usar una Plantilla

1. **En la lista de plantillas (derecha), haz clic en "📤 Usar"**
2. **Se cargará automáticamente en el formulario de envío**
3. **Reemplaza las variables por valores reales**
4. **Envía el mensaje**

### Eliminar una Plantilla

1. **Haz clic en el botón "🗑️" junto a la plantilla**
2. **Confirma la eliminación**

---

## 💬 Conversaciones

### Ver Historial

1. **Ve a la pestaña "Conversaciones"**
2. **Verás una lista con:**
   - Canal (WhatsApp/Telegram)
   - Contacto (número o chat ID)
   - Último mensaje
   - Hora del último mensaje
   - Cantidad total de mensajes

### Filtrar Conversaciones

- **Por canal**: Usa los íconos de WhatsApp/Telegram
- **Por fecha**: Las más recientes aparecen primero

### Ver Detalles

- **Haz clic en una conversación** para ver más detalles
- Se mostrará todo el historial de mensajes

---

## ⚙️ Configuración Avanzada

### WhatsApp

```
✅ Habilitar WhatsApp
   - Activa/desactiva el canal de WhatsApp

✅ Auto-respuesta
   - Responde automáticamente a mensajes entrantes
```

### Telegram

```
✅ Habilitar Telegram
   - Activa/desactiva el canal de Telegram

Token del Bot:
   - Pega aquí el token de @BotFather
```

### Guardar Cambios

1. **Modifica las opciones**
2. **Haz clic en "💾 Guardar Configuración"**
3. **Reinicia el sistema para aplicar cambios**

---

## 📊 Tarjetas de Estado

### WhatsApp

| Estado | Icono | Significado |
|--------|-------|-------------|
| ✅ Conectado | Verde | WhatsApp listo para usar |
| 🔴 Desconectado | Rojo | No inicializado |
| ⏳ QR Disponible | Amarillo | Necesita escanear QR |
| 🔄 Conectando | Girando | Estableciendo conexión |

### Telegram

| Estado | Icono | Significado |
|--------|-------|-------------|
| ✅ Conectado | Verde | Bot activo y escuchando |
| 🔴 Desconectado | Rojo | No configurado o error |
| ⚠️ Error | Amarillo | Token inválido o problema |

### Estadísticas

```
📊 Total de Mensajes
   - Suma de todos los mensajes enviados

💬 Mensajes WhatsApp
   - Total de mensajes por WhatsApp

💬 Mensajes Telegram
   - Total de mensajes por Telegram
```

---

## 🔄 Actualización Automática

La interfaz se actualiza automáticamente cada 5 segundos:

- ✅ Estados de conexión
- ✅ Estadísticas de mensajes
- ✅ Nuevas conversaciones

### Actualización Manual

Haz clic en el botón **"🔄 Refrescar Estado"** en cualquier momento.

---

## 🎨 Pestañas Disponibles

### 1. 📤 Mensajes
- Formulario de envío rápido
- Selección de canal
- Campo de destinatario
- Área de texto para el mensaje

### 2. 💬 Conversaciones
- Historial completo de chats
- Filtros por canal
- Detalles de cada conversación

### 3. 📝 Plantillas
- Crear nuevas plantillas
- Lista de plantillas existentes
- Uso y eliminación de plantillas

### 4. ⚙️ Configuración
- Habilitar/deshabilitar canales
- Configurar tokens y opciones
- Guardar cambios

---

## 🛠️ Solución de Problemas

### El QR de WhatsApp no aparece

**Solución:**
1. Espera 10 segundos después de inicializar
2. Haz clic en "Ver QR" en la tarjeta de WhatsApp
3. Si no funciona, reinicia el servidor

### Telegram no se conecta

**Solución:**
1. Verifica que el token sea correcto
2. Asegúrate de que el bot esté activo en @BotFather
3. Guarda la configuración y reinicia

### Los mensajes no se envían

**Solución:**
1. Verifica que el canal esté conectado (✅ verde)
2. Comprueba el formato del destinatario:
   - WhatsApp: `5215512345678` (sin + ni espacios)
   - Telegram: Chat ID numérico
3. Revisa que el mensaje no esté vacío

### La interfaz no se actualiza

**Solución:**
1. Haz clic en "🔄 Refrescar Estado"
2. Recarga la página (F5)
3. Verifica que el servidor esté corriendo

---

## 📱 Ejemplos de Uso

### Caso 1: Enviar Notificación de Pedido

```
Canal: WhatsApp
Destinatario: 5215512345678
Mensaje:
¡Hola Juan!

Tu pedido #12345 ha sido confirmado.

Artículos: 3
Total: $599.00

Envío estimado: 2-3 días hábiles.

Gracias por tu compra.
```

### Caso 2: Recordatorio Automático

Crea una plantilla:
```
Nombre: recordatorio_cita
Contenido:
Hola {{nombre}},

Te recordamos tu cita para:
📅 {{fecha}}
🕐 {{hora}}
📍 {{lugar}}

Por favor confirma tu asistencia.
```

Luego úsala y reemplaza:
- `{{nombre}}` → Juan Pérez
- `{{fecha}}` → 15 de Diciembre
- `{{hora}}` → 10:00 AM
- `{{lugar}}` → Consultorio A

---

## 🎯 Consejos y Mejores Prácticas

### ✅ DO (Hacer)

- ✅ Mantén el servidor siempre corriendo
- ✅ Usa plantillas para mensajes repetitivos
- ✅ Guarda las configuraciones antes de cerrar
- ✅ Verifica los estados antes de enviar
- ✅ Usa el formato correcto de destinatarios

### ❌ DON'T (No Hacer)

- ❌ No cierres el navegador con WhatsApp desconectado
- ❌ No cambies el token de Telegram sin reiniciar
- ❌ No envíes mensajes sin verificar la conexión
- ❌ No uses espacios ni símbolos en números de WhatsApp

---

## 🔐 Seguridad

### Protección de Datos

- ✅ Todos los mensajes se almacenan localmente
- ✅ No se comparten datos con terceros
- ✅ Las sesiones de WhatsApp están encriptadas

### Token de Telegram

- ⚠️ **NUNCA** compartas tu token de bot
- ⚠️ **NO** lo publiques en repositorios públicos
- ✅ Guárdalo en un lugar seguro

---

## 📚 Recursos Adicionales

### Documentación Completa

- [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md) - API y referencia técnica
- [INSTALACION_RAPIDA_OMNICANALIDAD.md](INSTALACION_RAPIDA_OMNICANALIDAD.md) - Instalación en 5 minutos
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guía visual de inicio

### Archivos de Configuración

- `omnichannel-config.js` - Configuración principal
- `init.js` - Script de inicialización

### Scripts Útiles

```bash
# Iniciar servidor
npm start

# Inicializar omnicanalidad
node init.js

# Ver estado
curl http://localhost:3000/api/omnichannel/status
```

---

## 🆘 Soporte

### Si tienes problemas:

1. **Revisa esta guía** 📖
2. **Consulta la documentación técnica** en [OMNICANALIDAD_README.md](OMNICANALIDAD_README.md)
3. **Verifica los logs** en la consola del servidor
4. **Revisa la configuración** en la pestaña Configuración

---

## ✅ Checklist de Inicio

Usa esta lista para verificar que todo esté funcionando:

- [ ] ✅ Servidor iniciado (`npm start`)
- [ ] ✅ Navegador abierto en http://localhost:3000
- [ ] ✅ Módulo de Omnicanalidad visible en el menú
- [ ] ✅ Sistema inicializado (botón "Inicializar Sistema")
- [ ] ✅ WhatsApp conectado (QR escaneado)
- [ ] ✅ Telegram configurado (token ingresado)
- [ ] ✅ Tarjetas de estado en verde (✅ Conectado)
- [ ] ✅ Mensaje de prueba enviado correctamente

---

## 🎉 ¡Listo!

Ahora tienes todo configurado para enviar mensajes por WhatsApp y Telegram desde tu sistema RPA.

**Disfruta de la Omnicanalidad con Alqvimia RPA** 🚀

---

**Última actualización:** 2024-12-10
**Versión:** 1.0
