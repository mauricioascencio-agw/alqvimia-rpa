# BACKEND - Alqvimia RPA

> Documento consolidado de todas las funcionalidades, APIs y configuraciones del Backend.
> **Ultima actualizacion**: 2024-12-12

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [APIs Disponibles](#apis-disponibles)
3. [Videoconferencia API](#videoconferencia-api)
4. [Configuracion del Servidor](#configuracion-del-servidor)
5. [Dependencias](#dependencias)
6. [Historial de Cambios](#historial-de-cambios)

---

## Arquitectura General

### Estructura de Archivos

```
server/
├── index.js                      # Servidor principal Express
├── video-conference-routes.js    # Rutas de videoconferencia
├── engine/
│   └── recorder-engine.js        # Motor de grabacion
└── ...

Archivos raiz:
├── package.json                  # Dependencias npm
├── iniciar-servidor.bat          # Script inicio Windows
└── .env (opcional)               # Variables de entorno
```

### Tecnologias Utilizadas

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Framework web |
| Socket.io | 4.x | WebSockets |
| Nodemailer | 7.x | Envio de emails |
| Multer | 1.x | Upload de archivos |

---

## APIs Disponibles

### Rutas Base

| Ruta Base | Archivo | Descripcion |
|-----------|---------|-------------|
| `/api/workflows` | index.js | CRUD de workflows |
| `/api/video-conference` | video-conference-routes.js | Videoconferencia |
| `/api/settings` | index.js | Configuraciones |
| `/api/recorder` | index.js | Grabador |

---

## Videoconferencia API

**Archivo**: `server/video-conference-routes.js`

### Endpoints Disponibles

#### POST `/api/video-conference/upload-recording`
Subir grabacion de video.

```javascript
// Request (multipart/form-data)
{
    video: File,
    workflowId: string,
    sessionId: string
}

// Response
{
    success: true,
    path: string
}
```

#### POST `/api/video-conference/upload-file`
Subir archivo compartido en sesion.

```javascript
// Request (multipart/form-data)
{
    file: File,
    workflowId: string,
    sessionId: string
}
```

#### POST `/api/video-conference/save-session`
Guardar datos completos de sesion.

```javascript
// Request
{
    sessionId: string,
    workflowId: string,
    title: string,
    participants: array,
    messages: array,
    notes: array,
    recordings: array,
    startTime: Date,
    endTime: Date
}
```

#### POST `/api/video-conference/save-minutes`
Guardar minutas generadas.

```javascript
// Request
{
    sessionId: string,
    workflowId: string,
    minutes: {
        asIs: string,
        toBe: string,
        summary: string,
        actionItems: array
    }
}
```

#### POST `/api/video-conference/test-smtp`
Probar conexion SMTP y enviar email de prueba.

```javascript
// Request
{
    smtp: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        user: "email@gmail.com",
        password: "contrasena-app",
        fromName: "Alqvimia",
        fromEmail: "noreply@alqvimia.com"
    }
}

// Response exitoso
{
    success: true,
    message: "Conexion SMTP exitosa. Email de prueba enviado."
}

// Response error
{
    success: false,
    error: "Mensaje de error"
}
```

#### POST `/api/video-conference/send-invitation`
Enviar invitacion de videoconferencia por email.

```javascript
// Request
{
    smtp: { ... },  // Configuracion SMTP
    invitation: {
        sessionTitle: "Reunion de Equipo",
        sessionUrl: "http://localhost:3000/vc?session=abc123",
        sessionDate: "2024-12-12",
        sessionTime: "10:00",
        hostName: "Juan Perez",
        participants: [
            { name: "Maria", email: "maria@example.com" },
            { name: "Pedro", email: "pedro@example.com" }
        ]
    }
}

// Response
{
    success: true,
    message: "Invitaciones enviadas a 2 participante(s)"
}
```

#### POST `/api/video-conference/ai-process`
Procesar contenido con IA (GPT, Claude, Gemini).

```javascript
// Request
{
    provider: "openai" | "anthropic" | "google",
    apiKey: string,
    prompt: string,
    maxTokens: number
}
```

---

## Configuracion del Servidor

### Variables de Entorno (.env)

```env
# Puerto del servidor
PORT=3000

# SMTP (opcional, se puede configurar desde UI)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=contrasena-de-aplicacion

# APIs de IA (opcional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_KEY=...
```

### Iniciar Servidor

**Windows**:
```batch
iniciar-servidor.bat
```

**Manual**:
```bash
node server/index.js
```

### Puerto por Defecto

- HTTP: `http://localhost:3000`
- WebSocket: `ws://localhost:3000`

---

## Dependencias

### Principales (package.json)

```json
{
    "dependencies": {
        "express": "^4.18.2",
        "socket.io": "^4.7.2",
        "nodemailer": "^7.0.11",
        "multer": "^1.4.5-lts.1",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1"
    }
}
```

### Nodemailer - Uso Correcto

```javascript
// CORRECTO
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'email@gmail.com',
        pass: 'contrasena-app'
    }
});

// INCORRECTO (error comun)
// nodemailer.createTransporter() - NO EXISTE
```

---

## Historial de Cambios

### 2024-12-12

#### API SMTP
- [x] Corregido typo: `createTransporter` -> `createTransport` (linea 256)
- [x] Agregado endpoint `/api/video-conference/test-smtp`
- [x] Agregado endpoint `/api/video-conference/send-invitation`
- [x] Templates HTML profesionales para emails

#### Archivos Modificados
- `server/video-conference-routes.js` - Lineas 256, 636-857

#### Errores Corregidos
| Error | Causa | Solucion |
|-------|-------|----------|
| `createTransporter is not a function` | Typo en API nodemailer | Cambiar a `createTransport` |
| `Unexpected token '<'` | URL frontend incorrecta | Corregido en frontend |

---

## Notas para Desarrolladores

### Agregar Nuevo Endpoint

```javascript
// En video-conference-routes.js

router.post('/nuevo-endpoint', async (req, res) => {
    try {
        const { data } = req.body;

        // Validacion
        if (!data) {
            return res.status(400).json({
                success: false,
                error: 'Falta parametro data'
            });
        }

        // Logica
        const result = await procesarData(data);

        // Respuesta exitosa
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

### Configuracion Gmail para SMTP

1. Activar verificacion en 2 pasos
2. Ir a: https://myaccount.google.com/apppasswords
3. Generar contrasena de aplicacion para "Correo"
4. Usar esa contrasena en el campo password

### Debugging

```javascript
// Agregar logs para debugging
console.log('📨 Enviando email a:', recipient);
console.log('✅ Email enviado exitosamente');
console.error('❌ Error:', error.message);
```

---

## WebSocket Events

### Eventos del Servidor

| Evento | Descripcion |
|--------|-------------|
| `connection` | Cliente conectado |
| `disconnect` | Cliente desconectado |
| `join-session` | Unirse a sesion VC |
| `leave-session` | Salir de sesion VC |
| `chat-message` | Mensaje de chat |
| `recording-started` | Grabacion iniciada |
| `recording-stopped` | Grabacion detenida |

### Ejemplo de Uso

```javascript
// Servidor
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        io.to(sessionId).emit('user-joined', socket.id);
    });
});

// Cliente
socket.emit('join-session', 'session-123');
socket.on('user-joined', (userId) => {
    console.log('Usuario unido:', userId);
});
```

---

> **Importante**: Este documento debe actualizarse cada vez que se realicen cambios en el backend. No crear nuevos archivos MD, modificar este.
