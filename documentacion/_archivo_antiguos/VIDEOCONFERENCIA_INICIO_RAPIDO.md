# ⚡ Videoconferencia - Inicio Rápido

Guía rápida de 5 minutos para comenzar a usar el sistema de videoconferencia.

---

## 🚀 Instalación Rápida

### 1. Instalar Dependencias (1 minuto)

```bash
cd c:\AlqVimia\alqvimia-rpa
npm install multer nodemailer
```

### 2. Integrar en el Servidor (2 minutos)

Edita [server/index.js](server/index.js) y agrega estas líneas:

```javascript
// Al inicio del archivo, con los otros requires
const videoConferenceRoutes = require('./video-conference-routes');

// Después de las rutas existentes
app.use('/api/video-conference', videoConferenceRoutes);

// Para servir archivos de grabaciones
app.use('/files', express.static(path.join(__dirname, '..', 'workflows')));
```

### 3. Agregar al HTML (1 minuto)

En tu archivo HTML principal, agrega:

```html
<head>
    <!-- ... otros CSS ... -->
    <link rel="stylesheet" href="/css/video-conference.css">
</head>

<body>
    <!-- ... tu contenido ... -->

    <!-- Antes del cierre de </body> -->
    <script src="/js/video-conference.js"></script>
    <script src="/js/video-conference-features.js"></script>
</body>
```

### 4. Reiniciar Servidor (30 segundos)

```bash
npm start
```

---

## 🎬 Uso Básico

### Iniciar Videoconferencia

Agrega un botón en tu interfaz:

```html
<button onclick="VideoConference.startSession('mi-proyecto', 'Reunión de Levantamiento')">
    <i class="fas fa-video"></i>
    Iniciar Videoconferencia
</button>
```

O desde consola:

```javascript
VideoConference.startSession('proyecto-id', 'Título de la Sesión');
```

---

## 📋 Flujo Típico de Uso

### Reunión de Levantamiento de Requerimientos

```
1. Iniciar sesión
   ↓
2. Invitar participantes
   - Usar JSON: invitees-example.json
   - O invitar manualmente por email
   ↓
3. Iniciar grabación ⏺️
   ↓
4. Activar transcripción 🎙️
   ↓
5. Tomar notas durante la reunión 📝
   ↓
6. Compartir archivos si es necesario 📎
   ↓
7. Al terminar: "Finalizar" 🏁
   ↓
8. Completar AS-IS/TO-BE
   - Proceso actual (AS-IS)
   - Proceso mejorado (TO-BE)
   - Requerimientos con prioridades
   ↓
9. Generar minutas con IA 🤖
   ↓
10. ¡Todo guardado automáticamente! ✅
```

---

## 📁 ¿Dónde se Guardan los Archivos?

```
workflows/
└── [nombre-proyecto]/
    └── Video/
        └── [session-id]/
            ├── README.md              # Documentación
            ├── recording_xxx.webm     # Video grabado
            ├── transcript.txt         # Transcripción
            ├── notes.txt              # Notas
            ├── chat.txt               # Chat
            ├── minutas.md             # Minutas generadas
            ├── requerimientos.md      # Requerimientos
            ├── AS-IS/
            │   └── proceso-actual.md
            └── TO-BE/
                └── proceso-mejorado.md
```

---

## 🎮 Controles Básicos

### Durante la Sesión

| Control | Función |
|---------|---------|
| 🎤 | Silenciar/Activar micrófono |
| 📹 | Encender/Apagar cámara |
| 🖥️ | Compartir pantalla |
| ⏺️ **Grabar** | Iniciar grabación |
| ⏸️ | Pausar grabación |
| ⏹️ **Detener** | Detener y guardar grabación |
| 📞 **Finalizar** | Terminar sesión |

### Paneles Laterales

- **Participantes**: Ver y gestionar asistentes
- **Chat**: Mensajes en tiempo real
- **Notas**: Tomar notas colaborativas
- **Archivos**: Compartir documentos
- **Transcripción**: Ver transcripción en vivo
- **IA**: Generar resúmenes y minutas

---

## 🤖 Usar IA (Opcional)

### Configurar Plugin de IA

1. Abre el panel "IA"
2. Activa un plugin (GPT, Claude o Gemini)
3. Ingresa tu API Key
4. Usa las acciones:
   - **Resumir Sesión**
   - **Generar Tareas**
   - **Generar Minutas**

### Obtener API Keys

| IA | Enlace |
|----|--------|
| ChatGPT | https://platform.openai.com/api-keys |
| Claude | https://console.anthropic.com/ |
| Gemini | https://makersuite.google.com/app/apikey |

---

## 👥 Invitar Participantes

### Opción 1: Desde JSON (Recomendado)

1. Usa el archivo de ejemplo: [invitees-example.json](invitees-example.json)

2. Formato:
```json
{
  "invitees": [
    {
      "name": "Juan Pérez",
      "email": "juan@empresa.com",
      "role": "Gerente"
    }
  ]
}
```

3. En la sesión → "Invitar Participantes" → "Cargar desde JSON"

### Opción 2: Manual

1. Click en "Invitar Participantes"
2. Ingresa email
3. Click "Enviar Invitación"

### Opción 3: Compartir Enlace

1. Click en "Invitar Participantes"
2. Copiar enlace de sesión
3. Compartir por WhatsApp, Slack, etc.

---

## 📝 Análisis AS-IS / TO-BE

Al finalizar la sesión, completa:

### AS-IS (Estado Actual)
Describe cómo funciona el proceso actualmente:

```
Ejemplo:
1. Cliente llama por teléfono
2. Operador toma datos en Excel
3. Gerente revisa manualmente
4. Se envía email de confirmación
```

### TO-BE (Estado Deseado)
Describe cómo debería funcionar:

```
Ejemplo:
1. Cliente llena formulario web
2. Sistema valida automáticamente
3. Notificación instantánea al gerente
4. Email automático de confirmación
```

### Requerimientos

Agrega los requerimientos identificados:

```
- [CRÍTICA] Validación automática de datos
- [ALTA] Integración con sistema actual
- [MEDIA] Panel de reportes
- [BAJA] Tema oscuro
```

---

## ✅ Checklist de Sesión

Antes de empezar:
- [ ] Cámara y micrófono funcionando
- [ ] Permisos del navegador otorgados
- [ ] Participantes invitados (si aplica)
- [ ] Documentos a compartir listos

Durante la sesión:
- [ ] Grabación iniciada
- [ ] Transcripción activada
- [ ] Notas importantes capturadas
- [ ] Archivos compartidos

Al finalizar:
- [ ] Completado AS-IS
- [ ] Completado TO-BE
- [ ] Requerimientos agregados
- [ ] Minutas generadas
- [ ] Grabación guardada

---

## 🎯 Casos de Uso Comunes

### 1. Levantamiento de Requerimientos

```javascript
VideoConference.startSession(
    'proyecto-nuevo',
    'Levantamiento - Sistema de Ventas'
);

// 1. Grabar reunión
// 2. Transcribir automáticamente
// 3. Tomar notas de puntos clave
// 4. Al final: AS-IS/TO-BE + requerimientos
// 5. Generar minutas con IA
```

### 2. Demo de Producto

```javascript
VideoConference.startSession(
    'demo-cliente',
    'Demo - Nueva Funcionalidad'
);

// 1. Compartir pantalla
// 2. Grabar demo
// 3. Responder preguntas en chat
// 4. Generar resumen con feedback
```

### 3. Sprint Planning

```javascript
VideoConference.startSession(
    'sprint-12',
    'Sprint Planning - Sprint 12'
);

// 1. Revisar backlog
// 2. Asignar tareas (notas)
// 3. Generar items de acción con IA
```

---

## 🔧 Configuración Opcional

### Emails de Invitación

Crea archivo `.env`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
```

---

## 🐛 Problemas Comunes

### "No se puede acceder a la cámara"

✅ Solución:
- Verifica permisos del navegador
- Cierra otras apps que usen la cámara
- Usa HTTPS (no HTTP)

### "La grabación no inicia"

✅ Solución:
- Usa Chrome, Edge o Firefox
- Verifica espacio en disco
- Recarga la página

### "La transcripción no funciona"

✅ Solución:
- Usa Chrome o Edge (Web Speech API)
- Verifica permisos de micrófono
- Habla claramente cerca del micrófono

---

## 📱 Compatibilidad

| Navegador | Video | Audio | Grabación | Transcripción | Pantalla |
|-----------|-------|-------|-----------|---------------|----------|
| Chrome    | ✅    | ✅    | ✅        | ✅            | ✅       |
| Edge      | ✅    | ✅    | ✅        | ✅            | ✅       |
| Firefox   | ✅    | ✅    | ✅        | ❌            | ✅       |
| Safari    | ✅    | ✅    | ⚠️        | ❌            | ⚠️       |

**Recomendado**: Chrome o Edge

---

## 🎓 Tutoriales

### Video 1: Primera Sesión

1. Iniciar sesión
2. Conocer los controles
3. Grabar y detener
4. Finalizar y guardar

### Video 2: Funciones Avanzadas

1. Transcripción en tiempo real
2. Notas colaborativas
3. Compartir archivos
4. Usar IA para resumir

### Video 3: Análisis de Procesos

1. Capturar AS-IS
2. Diseñar TO-BE
3. Gestionar requerimientos
4. Generar documentación

---

## 📞 Soporte

¿Necesitas ayuda?

- **Documentación completa**: [VIDEOCONFERENCIA_README.md](VIDEOCONFERENCIA_README.md)
- **Ejemplo de JSON**: [invitees-example.json](invitees-example.json)
- **Documentación general**: [README.md](README.md)

---

## 🎉 ¡Listo!

Ahora tienes todo para:

✅ Grabar reuniones profesionales
✅ Transcribir automáticamente
✅ Capturar AS-IS/TO-BE
✅ Generar minutas con IA
✅ Organizar todo automáticamente

**¡A grabar tu primera sesión!** 🚀

---

**Tiempo total de setup**: ~5 minutos
**Primera sesión**: ~10 minutos para familiarizarte

¡Disfruta! 🎥
