# 🎥 Sistema de Videoconferencia - Alqvimia RPA

Sistema completo de videoconferencia con grabación, transcripción en tiempo real, notas colaborativas, integración con IA y generación automática de documentación AS-IS/TO-BE.

---

## 📋 Características Principales

### 🎬 Grabación y Medios
- ✅ Grabación de video en calidad HD (1280x720)
- ✅ Grabación de audio con cancelación de eco
- ✅ Compartir pantalla con cursor visible
- ✅ Controles de audio/video (silenciar, pausar)
- ✅ Pausar y reanudar grabación
- ✅ Timer en tiempo real
- ✅ Indicador visual de grabación

### 👥 Participantes y Colaboración
- ✅ Gestión de participantes
- ✅ Invitación por email
- ✅ Carga masiva desde JSON
- ✅ Generación automática de enlaces
- ✅ Barra de participantes en tiempo real

### 💬 Comunicación
- ✅ Chat integrado con timestamps
- ✅ Compartir archivos (imágenes, PDFs, documentos)
- ✅ Historial completo de conversaciones
- ✅ Notificaciones de nuevos mensajes

### 🎙️ Transcripción
- ✅ Transcripción en tiempo real
- ✅ Reconocimiento de voz en español
- ✅ Identificación de speakers
- ✅ Exportación de transcripción
- ✅ Sincronización con timestamps

### 📝 Notas y Documentación
- ✅ Notas colaborativas
- ✅ Editor de texto enriquecido
- ✅ Exportación de notas
- ✅ Timestamps automáticos

### 🤖 Integración con IA
- ✅ ChatGPT (GPT-4)
- ✅ Claude AI (Sonnet/Opus)
- ✅ Google Gemini
- ✅ Generación automática de:
  - Resúmenes ejecutivos
  - Items de acción
  - Minutas formales
  - Requerimientos

### 📊 Análisis de Procesos
- ✅ Captura AS-IS (Estado Actual)
- ✅ Diseño TO-BE (Estado Deseado)
- ✅ Gestión de requerimientos
- ✅ Priorización (Crítica, Alta, Media, Baja)

### 💾 Almacenamiento y Organización
- ✅ Estructura de carpetas automática
- ✅ Organización por workflow
- ✅ Carpetas AS-IS / TO-BE
- ✅ Guardado de:
  - Videos de grabación
  - Transcripciones
  - Notas
  - Chat
  - Archivos compartidos
  - Minutas
  - Requerimientos
  - README del proyecto

---

## 🚀 Instalación

### 1. Dependencias

Instala las dependencias necesarias:

```bash
npm install multer nodemailer
```

### 2. Integrar en el servidor

Edita `server/index.js` y agrega:

```javascript
// Importar rutas de videoconferencia
const videoConferenceRoutes = require('./video-conference-routes');

// Registrar rutas
app.use('/api/video-conference', videoConferenceRoutes);

// Servir archivos estáticos de grabaciones
app.use('/files', express.static(path.join(__dirname, '..', 'workflows')));
```

### 3. Agregar a HTML

En tu archivo HTML principal (por ejemplo `public/index.html`), agrega:

```html
<!-- CSS -->
<link rel="stylesheet" href="/css/video-conference.css">

<!-- JavaScript -->
<script src="/js/video-conference.js"></script>
<script src="/js/video-conference-features.js"></script>
```

### 4. Configurar SMTP (Opcional)

Para enviar invitaciones por email, configura variables de entorno:

```bash
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
```

---

## 📖 Uso

### Iniciar una Sesión

```javascript
// Desde JavaScript
VideoConference.startSession('workflow-123', 'Reunión de Levantamiento de Requerimientos');
```

### Desde un Componente

Crea un botón en tu interfaz:

```html
<button onclick="VideoConference.startSession()">
    <i class="fas fa-video"></i>
    Iniciar Videoconferencia
</button>
```

### Invitar Participantes desde JSON

1. Prepara un archivo JSON con el formato:

```json
{
  "invitees": [
    {
      "name": "Juan Pérez",
      "email": "juan.perez@empresa.com",
      "role": "Gerente"
    }
  ]
}
```

2. Usa el ejemplo incluido: [invitees-example.json](invitees-example.json)

3. En la sesión, haz clic en "Invitar Participantes" → "Cargar desde JSON"

### Usar Plugins de IA

1. Abre el panel de IA
2. Activa el plugin deseado (GPT, Claude, Gemini)
3. Ingresa tu API Key
4. Usa las acciones disponibles:
   - **Resumir Sesión**: Genera un resumen ejecutivo
   - **Generar Tareas**: Extrae items de acción
   - **Generar Minutas**: Crea minutas formales

### Finalizar Sesión

1. Haz clic en "Finalizar"
2. Completa el análisis AS-IS/TO-BE
3. Agrega requerimientos
4. Guarda

Todo se almacenará automáticamente en:
```
workflows/[workflow-id]/Video/[session-id]/
```

---

## 📂 Estructura de Archivos Generados

Después de finalizar una sesión, se genera la siguiente estructura:

```
workflows/
└── [workflow-id]/
    └── Video/
        └── [session-id]/
            ├── README.md                    # Documentación del proyecto
            ├── session-data.json            # Datos completos
            ├── transcript.txt               # Transcripción
            ├── notes.txt                    # Notas
            ├── chat.txt                     # Historial de chat
            ├── minutas.md                   # Minutas generadas
            ├── minutas.json                 # Minutas en JSON
            ├── requerimientos.md            # Lista de requerimientos
            ├── AS-IS/
            │   └── proceso-actual.md        # Proceso AS-IS
            ├── TO-BE/
            │   └── proceso-mejorado.md      # Proceso TO-BE
            ├── recording_[timestamp].webm   # Grabación de video
            └── [archivos compartidos]       # Archivos subidos
```

---

## 🎮 Controles

### Controles de Medios

| Botón | Función |
|-------|---------|
| 🎤 | Silenciar/Activar micrófono |
| 📹 | Activar/Desactivar cámara |
| 🖥️ | Compartir pantalla |

### Controles de Grabación

| Botón | Función |
|-------|---------|
| ⏺️ Grabar | Iniciar grabación |
| ⏸️ | Pausar grabación |
| ⏹️ Detener | Detener y guardar |

### Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `F11` | Pantalla completa |
| `Ctrl+M` | Silenciar micrófono |
| `Ctrl+E` | Apagar cámara |

---

## 📊 Paneles Laterales

### Participantes
- Ver lista de participantes
- Invitar nuevos miembros
- Estado de conexión

### Chat
- Enviar mensajes
- Ver historial
- Notificaciones

### Notas
- Crear notas
- Editar en tiempo real
- Exportar

### Archivos
- Subir archivos
- Ver compartidos
- Descargar

### Transcripción
- Iniciar/Detener
- Ver en tiempo real
- Descargar transcripción

### IA
- Configurar plugins
- Generar resúmenes
- Crear minutas
- Extraer tareas

---

## 🤖 Configuración de IA

### ChatGPT (GPT-4)

1. Obtén una API Key en: https://platform.openai.com/api-keys
2. En el panel de IA, activa "ChatGPT"
3. Pega tu API Key

### Claude AI

1. Obtén una API Key en: https://console.anthropic.com/
2. En el panel de IA, activa "Claude AI"
3. Pega tu API Key

### Google Gemini

1. Obtén una API Key en: https://makersuite.google.com/app/apikey
2. En el panel de IA, activa "Google Gemini"
3. Pega tu API Key

---

## 📋 Ejemplos de Uso

### Ejemplo 1: Reunión de Levantamiento

```javascript
// Iniciar sesión
VideoConference.startSession(
    'proyecto-web',
    'Levantamiento de Requerimientos - Sistema Web'
);

// Durante la sesión:
// 1. Grabar la reunión
// 2. Activar transcripción
// 3. Tomar notas de puntos importantes
// 4. Compartir documentos relevantes

// Al finalizar:
// 1. Completar AS-IS (proceso actual del cliente)
// 2. Diseñar TO-BE (proceso mejorado)
// 3. Agregar requerimientos con prioridades
// 4. Generar minutas con IA
```

### Ejemplo 2: Demo de Producto

```javascript
// Iniciar con pantalla compartida
VideoConference.startSession('demo-producto', 'Demo - Nueva Funcionalidad');

// 1. Compartir pantalla
// 2. Grabar la demo
// 3. Responder preguntas en el chat
// 4. Tomar notas de feedback
// 5. Generar resumen con IA al terminar
```

### Ejemplo 3: Sesión de Trabajo

```javascript
// Reunión de equipo
VideoConference.startSession('sprint-planning', 'Sprint Planning - Sprint 12');

// 1. Revisar backlog (compartir pantalla)
// 2. Discutir tareas (transcribir)
// 3. Asignar responsables (chat + notas)
// 4. Generar items de acción con IA
```

---

## 🔧 API del Cliente

### Métodos Principales

```javascript
// Iniciar sesión
VideoConference.startSession(workflowId, titulo);

// Finalizar sesión
VideoConference.endSession();

// Controles de medios
VideoConference.toggleAudio();
VideoConference.toggleVideo();
VideoConference.toggleScreenShare();

// Grabación
VideoConference.startRecording();
VideoConference.pauseRecording();
VideoConference.stopRecording();

// Transcripción
VideoConference.toggleTranscription();
VideoConference.downloadTranscript();

// Notas
VideoConference.addNote();
VideoConference.exportNotes();

// Chat
VideoConference.sendMessage();

// Invitaciones
VideoConference.sendInviteToEmail(email, name);
VideoConference.loadInviteesFromJSON(fileEvent);

// IA
VideoConference.generateAISummary();
VideoConference.generateActionItems();
VideoConference.generateMinutes();
```

---

## 🌐 API del Servidor

### Endpoints

#### POST `/api/video-conference/upload-recording`
Subir grabación de video

**Body (FormData):**
- `video`: Archivo de video
- `workflowId`: ID del workflow
- `sessionId`: ID de la sesión

**Response:**
```json
{
  "success": true,
  "path": "workflows/proyecto/Video/session-123/recording.webm",
  "filename": "recording_123.webm",
  "size": 50000000
}
```

#### POST `/api/video-conference/upload-file`
Subir archivo compartido

**Body (FormData):**
- `file`: Archivo
- `workflowId`: ID del workflow
- `sessionId`: ID de la sesión

#### POST `/api/video-conference/save-session`
Guardar sesión completa

**Body:**
```json
{
  "id": "session-123",
  "workflowId": "proyecto-web",
  "startTime": "2024-12-10T10:00:00Z",
  "endTime": "2024-12-10T11:30:00Z",
  "participants": [...],
  "transcript": [...],
  "notes": [...],
  "messages": [...],
  "processAnalysis": {
    "asIs": "...",
    "toBe": "...",
    "requirements": [...]
  }
}
```

#### POST `/api/video-conference/send-invite`
Enviar invitación por email

**Body:**
```json
{
  "sessionId": "session-123",
  "email": "usuario@empresa.com",
  "name": "Juan Pérez",
  "link": "https://...",
  "title": "Reunión de Levantamiento"
}
```

#### POST `/api/video-conference/ai-process`
Procesar con IA

**Body:**
```json
{
  "provider": "gpt|claude|gemini",
  "apiKey": "sk-...",
  "prompt": "Genera un resumen de...",
  "maxTokens": 1500
}
```

---

## 🎨 Personalización

### Cambiar Colores

Edita `public/css/video-conference.css`:

```css
:root {
    --vc-primary-color: #4CAF50;
    --vc-bg-dark: #1a1a1a;
    --vc-bg-light: #2c2c2c;
}
```

### Agregar Nuevos Plugins de IA

1. Edita `public/js/video-conference.js`
2. Agrega el plugin en la sección de IA
3. Implementa la función de procesamiento en `server/video-conference-routes.js`

---

## 🐛 Solución de Problemas

### No se puede acceder a la cámara/micrófono

- Verifica permisos del navegador
- Usa HTTPS (requerido para getUserMedia)
- Verifica que no haya otra aplicación usando los dispositivos

### La grabación no funciona

- Verifica que el navegador soporte MediaRecorder API
- Chrome/Edge: ✅ Soportado
- Firefox: ✅ Soportado
- Safari: ⚠️ Soporte limitado

### La transcripción no inicia

- Solo funciona en navegadores con Web Speech API
- Chrome: ✅ Soportado
- Edge: ✅ Soportado
- Firefox/Safari: ❌ No soportado

### Las invitaciones no se envían

- Configura las variables SMTP en `.env`
- Verifica las credenciales
- Para Gmail, usa "Contraseñas de aplicación"

---

## 📄 Licencia

Parte del proyecto Alqvimia RPA.

---

## 🤝 Contribuciones

Para mejorar el sistema de videoconferencia:

1. Agrega nuevos plugins de IA
2. Mejora la UI/UX
3. Implementa nuevas características
4. Reporta bugs

---

## 📞 Soporte

Para dudas o problemas, consulta la documentación principal del proyecto.

---

**¡Disfruta de las videoconferencias con análisis AS-IS/TO-BE automático!** 🎉
