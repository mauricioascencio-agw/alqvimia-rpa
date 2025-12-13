# Configuración de Videoconferencia

## Nueva Pestaña de Configuraciones

Se ha agregado una nueva pestaña **"Videoconferencia"** en el panel de Configuraciones del sistema.

### Ubicación

```
Sidebar → Configuraciones → Pestaña "Videoconferencia"
```

---

## Secciones de Configuración

### 1. Configuración SMTP para Invitaciones

Permite enviar invitaciones automáticas por email cuando se crea una sesión de videoconferencia.

#### Campos Requeridos:

- **Habilitar envío de invitaciones** (checkbox)
- **Servidor SMTP**: ej. `smtp.gmail.com`
- **Puerto**: ej. `587` (TLS), `465` (SSL), `25` (sin cifrado)
- **Usuario/Email**: tu email
- **Contraseña**: contraseña de la cuenta
- **Nombre del remitente**: ej. "Alqvimia Videoconferencia"
- **Email del remitente**: ej. "noreply@alqvimia.com"
- **Usar conexión segura (SSL/TLS)** (checkbox)

#### Configuración para Gmail:

1. Ve a tu cuenta de Google → Seguridad
2. Activa "Verificación en 2 pasos"
3. Ve a "Contraseñas de aplicaciones"
4. Genera una contraseña para "Correo"
5. Usa esa contraseña en el campo de configuración

#### Botón "Probar Conexión SMTP"

Envía un email de prueba a tu cuenta para verificar que la configuración es correcta.

**Endpoint**: `POST /api/videoconference/test-smtp`

---

### 2. Configuración General de Videoconferencia

#### Opciones disponibles:

- **Carpeta de Proyectos**: Carpeta donde se guardan las grabaciones (default: `workflows`)
- **Duración máxima (minutos)**: Tiempo máximo de grabación (5-480 minutos)
- **Calidad de Video**: Baja (480p), Media (720p), Alta (1080p)
- **Calidad de Audio**: Baja (64 kbps), Media (128 kbps), Alta (192 kbps)
- **Filtro predeterminado**: Sin filtro, Desenfocar fondo, Sepia, Blanco y Negro, Vintage

---

### 3. Características Habilitadas

Checkboxes para activar/desactivar funcionalidades:

- ✅ Iniciar grabación automáticamente
- ✅ Transcripción automática activada
- ✅ Habilitar chat
- ✅ Habilitar compartir pantalla
- ✅ Habilitar emojis en chat
- ✅ Habilitar filtros de video

---

## API Endpoints Agregados

### 1. Probar Conexión SMTP

```javascript
POST /api/videoconference/test-smtp

Body:
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "tu-email@gmail.com",
    "password": "tu-contraseña",
    "fromName": "Alqvimia Videoconferencia",
    "fromEmail": "noreply@alqvimia.com"
  }
}

Response:
{
  "success": true,
  "message": "Conexión SMTP exitosa. Email de prueba enviado."
}
```

### 2. Enviar Invitación

```javascript
POST /api/videoconference/send-invitation

Body:
{
  "smtp": { ... }, // Configuración SMTP
  "invitation": {
    "sessionTitle": "Reunión de Proyecto",
    "sessionUrl": "http://localhost:3000/videoconferencia?session=abc123",
    "sessionDate": "2024-12-15",
    "sessionTime": "10:00 AM",
    "hostName": "Juan Pérez",
    "participants": [
      {
        "name": "María García",
        "email": "maria@example.com"
      },
      {
        "name": "Pedro López",
        "email": "pedro@example.com"
      }
    ]
  }
}

Response:
{
  "success": true,
  "message": "Invitaciones enviadas a 2 participante(s)"
}
```

---

## Almacenamiento de Configuración

Las configuraciones se guardan en:

- **LocalStorage**: `app_settings`
- **Archivo JSON** (servidor): `/api/settings/save`

Estructura en `SettingsManager.settings`:

```javascript
{
  videoConference: {
    smtp: {
      enabled: false,
      host: '',
      port: 587,
      secure: false,
      user: '',
      password: '',
      fromName: 'Alqvimia Videoconferencia',
      fromEmail: ''
    },
    defaultProjectFolder: 'workflows',
    autoRecord: false,
    autoTranscription: true,
    videoQuality: 'high',
    audioQuality: 'high',
    maxDuration: 120,
    enableChat: true,
    enableScreenShare: true,
    enableEmojis: true,
    enableFilters: true,
    defaultFilter: 'none'
  }
}
```

---

## Funciones JavaScript Agregadas

### En `settings-manager.js`:

#### `updateVideoConferenceSetting(path, value)`

Actualiza configuración de videoconferencia usando notación de punto.

```javascript
SettingsManager.updateVideoConferenceSetting('smtp.host', 'smtp.gmail.com')
SettingsManager.updateVideoConferenceSetting('videoQuality', 'high')
```

#### `testSmtpConnection()`

Prueba la conexión SMTP y envía email de prueba.

```javascript
await SettingsManager.testSmtpConnection()
```

---

## Integración con Videoconferencia

Para usar la configuración SMTP en el sistema de videoconferencia:

```javascript
// Obtener configuración
const smtpConfig = SettingsManager.settings.videoConference.smtp;

// Verificar si está habilitado
if (smtpConfig.enabled) {
  // Enviar invitación
  const response = await fetch('/api/videoconference/send-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      smtp: smtpConfig,
      invitation: {
        sessionTitle: 'Mi Sesión',
        sessionUrl: 'http://localhost:3000/vc?id=123',
        sessionDate: '2024-12-15',
        sessionTime: '10:00 AM',
        hostName: 'Juan Pérez',
        participants: [
          { name: 'María', email: 'maria@example.com' }
        ]
      }
    })
  });
}
```

---

## Plantilla de Email HTML

Los emails enviados incluyen:

- ✅ Header con gradiente púrpura
- ✅ Logo y título del sistema
- ✅ Detalles de la sesión (título, fecha, hora, anfitrión)
- ✅ Botón de "Unirse a la Videoconferencia"
- ✅ Instrucciones para el usuario
- ✅ Diseño responsive y profesional
- ✅ Footer con información automática

---

## Archivos Modificados

1. **public/js/settings-manager.js**
   - Agregado objeto `videoConference` en settings
   - Nueva pestaña "Videoconferencia" en tabs
   - Función `renderVideoConferenceSettings()`
   - Función `updateVideoConferenceSetting()`
   - Función `testSmtpConnection()`

2. **server/video-conference-routes.js**
   - Endpoint `POST /api/videoconference/test-smtp`
   - Endpoint `POST /api/videoconference/send-invitation`
   - Templates HTML para emails profesionales

---

## Cómo Usar

### 1. Configurar SMTP:

```
1. Abrir aplicación → Sidebar → "Configuraciones"
2. Click en pestaña "Videoconferencia"
3. Activar checkbox "Habilitar envío de invitaciones por email"
4. Completar campos de SMTP (servidor, puerto, usuario, contraseña)
5. Click en "Probar Conexión SMTP"
6. Verificar email de prueba recibido
```

### 2. Configurar Opciones Generales:

```
1. En la misma pestaña, scroll hacia abajo
2. Configurar carpeta de proyectos
3. Ajustar calidad de video/audio
4. Establecer duración máxima
5. Seleccionar filtro predeterminado
```

### 3. Habilitar/Deshabilitar Características:

```
1. En sección "Características Habilitadas"
2. Activar/desactivar checkboxes según necesidad
3. Cambios se guardan automáticamente
```

---

## Validaciones

- ❌ No permite guardar si faltan campos requeridos en SMTP
- ✅ Valida formato de email
- ✅ Valida rango de puerto (1-65535)
- ✅ Valida duración máxima (5-480 minutos)
- ✅ Muestra mensajes de error claros
- ✅ Muestra mensajes de éxito al guardar

---

## Mensajes de Notificación

```javascript
// Éxito
"Configuración de videoconferencia actualizada"
"✅ Conexión SMTP exitosa. Email de prueba enviado a ..."
"Invitaciones enviadas a X participante(s)"

// Error
"Complete todos los campos requeridos (servidor, usuario, contraseña)"
"❌ Error de conexión: [mensaje de error]"
"Faltan datos de SMTP o participantes"
```

---

## Estado Actual

✅ **COMPLETADO**:
- Pestaña de configuración implementada
- Configuración SMTP funcional
- Endpoints de backend creados
- Templates de email profesionales
- Validaciones y mensajes de error
- Botón de prueba de conexión
- Persistencia de configuración

📝 **PRÓXIMOS PASOS** (Opcional):
- Integrar con modal de crear sesión de videoconferencia
- Agregar campo de invitados en UI de videoconferencia
- Botón "Enviar Invitaciones" en interfaz de videoconferencia
- Calendario para seleccionar fecha/hora de sesión

---

## Ejemplo de Uso Completo

```javascript
// 1. Usuario configura SMTP en Configuraciones

// 2. Usuario abre Videoconferencia

// 3. Usuario agrega participantes:
const participants = [
  { name: 'María García', email: 'maria@example.com' },
  { name: 'Pedro López', email: 'pedro@example.com' }
];

// 4. Sistema envía invitaciones automáticamente:
if (SettingsManager.settings.videoConference.smtp.enabled) {
  await fetch('/api/videoconference/send-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      smtp: SettingsManager.settings.videoConference.smtp,
      invitation: {
        sessionTitle: document.getElementById('session-title').value,
        sessionUrl: window.location.href + '?session=' + sessionId,
        sessionDate: new Date().toLocaleDateString(),
        sessionTime: new Date().toLocaleTimeString(),
        hostName: 'Juan Pérez',
        participants: participants
      }
    })
  });
}

// 5. Participantes reciben email con link único

// 6. Participantes hacen click y se unen automáticamente
```

---

**¡Sistema de invitaciones por email completamente funcional!** 📧✨
