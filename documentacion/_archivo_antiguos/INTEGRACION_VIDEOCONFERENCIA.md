# 🔧 Integración del Sistema de Videoconferencia

Instrucciones paso a paso para integrar el sistema de videoconferencia con tu sistema RPA existente.

---

## 📋 Requisitos Previos

- ✅ Node.js instalado
- ✅ Sistema Alqvimia RPA funcionando
- ✅ Acceso a archivos del servidor

---

## 🚀 PASO 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto:

```bash
cd c:\AlqVimia\alqvimia-rpa
npm install multer nodemailer
```

---

## 🔧 PASO 2: Integrar Rutas en el Servidor

### Editar `server/index.js`

Abre el archivo [server/index.js](server/index.js) y realiza los siguientes cambios:

#### 2.1. Agregar Import (al inicio del archivo)

Busca la sección donde se importan los módulos y agrega:

```javascript
// Importar rutas existentes
const mcpRoutes = require('./mcp/mcp-routes');
const omnichannelRoutes = require('./omnichannel-routes');

// ⭐ AGREGAR ESTA LÍNEA
const videoConferenceRoutes = require('./video-conference-routes');
```

#### 2.2. Registrar Rutas (después de las rutas existentes)

Busca donde se registran las rutas y agrega:

```javascript
// Rutas existentes
app.use('/api/mcp', mcpRoutes);
app.use('/api/omnichannel', omnichannelRoutes);

// ⭐ AGREGAR ESTAS LÍNEAS
app.use('/api/video-conference', videoConferenceRoutes);
app.use('/files', express.static(path.join(__dirname, '..', 'workflows')));
```

#### Ejemplo Completo:

```javascript
const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Importar rutas
const mcpRoutes = require('./mcp/mcp-routes');
const omnichannelRoutes = require('./omnichannel-routes');
const videoConferenceRoutes = require('./video-conference-routes');  // ⭐ NUEVO

// Registrar rutas
app.use('/api/mcp', mcpRoutes);
app.use('/api/omnichannel', omnichannelRoutes);
app.use('/api/video-conference', videoConferenceRoutes);  // ⭐ NUEVO
app.use('/files', express.static(path.join(__dirname, '..', 'workflows')));  // ⭐ NUEVO

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

---

## 🎨 PASO 3: Agregar al HTML Principal

### Editar `public/index.html`

Abre el archivo HTML principal y agrega:

#### 3.1. En el `<head>` (CSS)

```html
<head>
    <!-- ... otros estilos ... -->

    <!-- ⭐ AGREGAR ESTE CSS -->
    <link rel="stylesheet" href="/css/video-conference.css">
</head>
```

#### 3.2. Antes del cierre de `</body>` (JavaScript)

```html
<body>
    <!-- ... tu contenido ... -->

    <!-- Scripts existentes -->
    <script src="/js/app.js"></script>
    <script src="/js/workflow-editor.js"></script>

    <!-- ⭐ AGREGAR ESTOS SCRIPTS -->
    <script src="/js/video-conference.js"></script>
    <script src="/js/video-conference-features.js"></script>
</body>
```

---

## 🎮 PASO 4: Agregar Botón de Acceso

### Opción A: Agregar al Menú Principal

En tu HTML, agrega un botón en el menú:

```html
<div class="menu-section">
    <button class="menu-item" onclick="VideoConference.startSession()">
        <i class="fas fa-video"></i>
        <span>Videoconferencia</span>
    </button>
</div>
```

### Opción B: Agregar a Workflows

Para iniciar videoconferencia desde un workflow específico:

```html
<button
    class="btn-video-conference"
    onclick="VideoConference.startSession('${workflowId}', '${workflowTitle}')"
>
    <i class="fas fa-video"></i>
    Iniciar Sesión de Video
</button>
```

### Opción C: Agregar a Componentes

Crea un nuevo componente en tu generador:

```javascript
{
    "id": "videoconference_start",
    "title": "Iniciar Videoconferencia",
    "icon": "fa-video",
    "category": "mcp",
    "properties": [
        {
            "name": "sessionTitle",
            "label": "Título de la Sesión",
            "type": "text",
            "required": true,
            "placeholder": "Reunión de Levantamiento"
        }
    ],
    "action": "startVideoConference"
}
```

---

## ⚙️ PASO 5: Configurar SMTP (Opcional)

Para enviar invitaciones por email:

### 5.1. Crear archivo `.env`

En la raíz del proyecto, crea `.env`:

```bash
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
```

### 5.2. Instalar dotenv

```bash
npm install dotenv
```

### 5.3. Cargar en el servidor

Al inicio de `server/index.js`:

```javascript
require('dotenv').config();

// ... resto del código
```

### 5.4. Generar Contraseña de Aplicación (Gmail)

1. Ve a https://myaccount.google.com/security
2. "Verificación en 2 pasos" → Activar
3. "Contraseñas de aplicaciones"
4. Selecciona "Correo" y "Otro"
5. Copia la contraseña generada
6. Pégala en `SMTP_PASS`

---

## 🎨 PASO 6: Personalizar Estilos (Opcional)

Edita [public/css/video-conference.css](public/css/video-conference.css):

```css
/* Cambiar color primario */
.vc-btn-primary,
.vc-control-btn.vc-active {
    background: #2196F3;  /* Cambia a tu color */
}

.vc-tab.active {
    color: #2196F3;  /* Mismo color */
}

.vc-tab.active::after {
    background: #2196F3;  /* Mismo color */
}
```

---

## 🔍 PASO 7: Verificar Instalación

### 7.1. Reiniciar Servidor

```bash
npm start
```

### 7.2. Probar en Navegador

1. Abre http://localhost:3000
2. Abre la consola del navegador (F12)
3. Escribe:

```javascript
VideoConference.startSession('test', 'Sesión de Prueba');
```

4. Deberías ver la interfaz de videoconferencia

### 7.3. Verificar Permisos

- Acepta permisos de cámara y micrófono
- Deberías ver tu video local

---

## 📁 PASO 8: Crear Carpeta de Workflows

Asegúrate de que existe la carpeta:

```bash
mkdir -p workflows
```

O manualmente:
```
c:\AlqVimia\alqvimia-rpa\workflows\
```

---

## 🧪 PASO 9: Prueba Completa

### Test 1: Sesión Básica

```javascript
VideoConference.startSession('test-workflow', 'Prueba Básica');
// Verificar: video local, controles, timer
```

### Test 2: Grabación

1. Iniciar sesión
2. Click en "Grabar"
3. Hablar unos segundos
4. Click en "Detener"
5. Verificar: archivo .webm descargado

### Test 3: Transcripción

1. Iniciar sesión
2. Panel "Transcripción"
3. Click "Iniciar Transcripción"
4. Hablar claramente
5. Verificar: texto aparece en tiempo real

### Test 4: Notas

1. Iniciar sesión
2. Panel "Notas"
3. Click "Nueva Nota"
4. Escribir texto
5. Verificar: nota guardada

### Test 5: Chat

1. Iniciar sesión
2. Panel "Chat"
3. Escribir mensaje
4. Presionar Enter
5. Verificar: mensaje aparece

### Test 6: Archivos

1. Iniciar sesión
2. Panel "Archivos"
3. Click "Subir Archivo"
4. Seleccionar archivo
5. Verificar: archivo listado

### Test 7: Finalizar Sesión

1. Click "Finalizar"
2. Completar AS-IS y TO-BE
3. Agregar requerimientos
4. Click "Guardar"
5. Verificar: carpeta creada en `workflows/`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module './video-conference-routes'"

**Solución:**
Verifica que el archivo existe en `server/video-conference-routes.js`

### Error: "Cannot access camera/microphone"

**Solución:**
1. Usa HTTPS (no HTTP)
2. Verifica permisos del navegador
3. Cierra otras apps que usen la cámara

### Error: "multer is not defined"

**Solución:**
```bash
npm install multer
```

### Error: "Cannot upload file"

**Solución:**
Verifica que existe la carpeta `workflows/`

### La transcripción no funciona

**Solución:**
- Usa Chrome o Edge (Firefox/Safari no soportan)
- Verifica permisos de micrófono
- Habla claramente

---

## 📊 ESTRUCTURA FINAL DEL PROYECTO

Después de la integración:

```
alqvimia-rpa/
├── server/
│   ├── index.js                          # ⭐ MODIFICADO
│   └── video-conference-routes.js        # ⭐ NUEVO
├── public/
│   ├── index.html                        # ⭐ MODIFICADO
│   ├── css/
│   │   └── video-conference.css          # ⭐ NUEVO
│   └── js/
│       ├── video-conference.js           # ⭐ NUEVO
│       └── video-conference-features.js  # ⭐ NUEVO
├── workflows/                            # ⭐ NUEVO
│   └── [workflow-id]/
│       └── Video/
│           └── [session-id]/
├── invitees-example.json                 # ⭐ NUEVO
├── VIDEOCONFERENCIA_README.md            # ⭐ NUEVO
├── VIDEOCONFERENCIA_INICIO_RAPIDO.md     # ⭐ NUEVO
├── SISTEMA_VIDEOCONFERENCIA_COMPLETO.md  # ⭐ NUEVO
├── INTEGRACION_VIDEOCONFERENCIA.md       # Este archivo
├── .env                                  # ⭐ OPCIONAL
└── package.json                          # ⭐ MODIFICADO (dependencias)
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

Marca cada paso al completarlo:

- [ ] Paso 1: Dependencias instaladas (`npm install multer nodemailer`)
- [ ] Paso 2: Rutas agregadas en `server/index.js`
- [ ] Paso 3: CSS/JS agregados al HTML
- [ ] Paso 4: Botón de acceso agregado
- [ ] Paso 5: SMTP configurado (opcional)
- [ ] Paso 6: Estilos personalizados (opcional)
- [ ] Paso 7: Servidor reiniciado y probado
- [ ] Paso 8: Carpeta `workflows/` creada
- [ ] Paso 9: Pruebas completas exitosas

---

## 🎯 RESULTADO ESPERADO

Después de completar todos los pasos:

✅ Botón de "Videoconferencia" visible en la interfaz
✅ Click en el botón abre la interfaz
✅ Video local se muestra
✅ Todos los controles funcionan
✅ Grabación crea archivos en `workflows/`
✅ Transcripción funciona en tiempo real
✅ Chat, notas y archivos operativos
✅ Finalizar sesión crea estructura AS-IS/TO-BE

---

## 🚀 PRÓXIMOS PASOS

Después de integrar:

1. **Lee la documentación**:
   - [VIDEOCONFERENCIA_INICIO_RAPIDO.md](VIDEOCONFERENCIA_INICIO_RAPIDO.md)
   - [VIDEOCONFERENCIA_README.md](VIDEOCONFERENCIA_README.md)

2. **Configura IA** (opcional):
   - Obtén API Keys
   - Configura en el panel de IA
   - Prueba generar minutas

3. **Crea tu primer proyecto**:
   - Inicia sesión con un workflow real
   - Invita participantes
   - Completa análisis AS-IS/TO-BE

4. **Explora características avanzadas**:
   - Compartir pantalla
   - Plugins de IA
   - Generación de minutas

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa esta guía paso a paso
2. Consulta [VIDEOCONFERENCIA_README.md](VIDEOCONFERENCIA_README.md)
3. Verifica la consola del navegador (F12)
4. Revisa logs del servidor

---

## 🎉 ¡LISTO!

Tu sistema de videoconferencia está completamente integrado.

**¡A grabar tu primera reunión profesional!** 🎥🚀

---

**Tiempo estimado de integración**: 10-15 minutos
**Dificultad**: Fácil
**Resultado**: Sistema profesional de videoconferencia completo

