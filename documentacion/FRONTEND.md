# FRONTEND - Alqvimia RPA

> Documento consolidado de todas las funcionalidades, mejoras y configuraciones del Frontend.
> **Ultima actualizacion**: 2024-12-12

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Modulos Principales](#modulos-principales)
3. [Videoconferencia](#videoconferencia)
4. [Configuraciones](#configuraciones)
5. [Componentes UI](#componentes-ui)
6. [Extensiones de Navegador](#extensiones-de-navegador)
7. [Historial de Cambios](#historial-de-cambios)

---

## Arquitectura General

### Estructura de Archivos

```
public/
├── css/
│   ├── styles.css                    # Estilos principales
│   ├── video-conference.css          # Estilos videoconferencia
│   ├── video-conference-save-config.css  # Estilos modales guardado
│   ├── settings-styles.css           # Estilos configuraciones
│   ├── omnichannel-styles.css        # Estilos omnicanalidad
│   └── ...
├── js/
│   ├── app.js                        # Aplicacion principal
│   ├── video-conference.js           # Modulo videoconferencia
│   ├── video-conference-features.js  # Funciones avanzadas VC
│   ├── settings-manager.js           # Gestor de configuraciones
│   ├── workflow-editor.js            # Editor de workflows
│   ├── recorder.js                   # Grabador de acciones
│   └── ...
├── components/                       # Componentes reutilizables
└── index.html                        # Pagina principal
```

---

## Modulos Principales

### 1. Grabador de Acciones (Recorder)

**Archivos**: `recorder.js`, `recorder-professional.js`, `recorder-interactive.js`

**Funcionalidades**:
- Captura de acciones del usuario
- Generacion de selectores CSS/XPath
- Preview de elementos capturados
- Exportacion a workflow

### 2. Editor de Workflows

**Archivo**: `workflow-editor.js`

**Funcionalidades**:
- Drag & drop de componentes
- Conexiones visuales entre nodos
- Validacion de flujos
- Exportacion/importacion JSON

### 3. Ejecutor de Workflows

**Archivo**: `executor.js`

**Funcionalidades**:
- Ejecucion paso a paso
- Manejo de errores
- Logs en tiempo real
- Programacion de tareas

---

## Videoconferencia

### Archivos Principales

| Archivo | Descripcion |
|---------|-------------|
| `video-conference.js` | Clase principal VideoConference |
| `video-conference-features.js` | Funciones avanzadas (AS-IS/TO-BE, minutas, etc.) |
| `video-conference.css` | Estilos base |
| `video-conference-save-config.css` | Estilos de modales y stickers |

### Funcionalidades Implementadas

#### Stickers Animados (v2.0)
- 16 stickers animados de Google Noto Emoji
- Se muestran como imagenes GIF en el chat
- Fallback a emoji Unicode si falla la carga

```javascript
// Ubicacion: video-conference.js lineas 56-73
this.stickers = [
    { id: 'happy', name: 'Feliz', emoji: '😀', url: '...' },
    { id: 'laugh', name: 'Risa', emoji: '😂', url: '...' },
    // ... 14 mas
];
```

#### Modal de Configuracion de Guardado
- Seleccion de formato: WebM o MP4
- Seleccion de ubicacion: Predeterminada o Personalizada
- Opciones adicionales: Transcripcion, Chat, Notas

```javascript
// Ubicacion: video-conference-features.js lineas 758-938
async showSaveConfigModal() { ... }
async confirmSaveConfig() { ... }
async browseSaveLocation() { ... }
```

#### Flujo de Finalizacion de Sesion

```
Click "Finalizar"
    ↓
Confirmacion
    ↓
Modal: Configuracion de Guardado (NUEVO)
    - Formato: WebM / MP4
    - Ubicacion
    - Opciones
    ↓
Modal: Selector de Proyecto
    ↓
Modal: AS-IS / TO-BE
    ↓
Barra de Progreso
    ↓
Confirmacion Exitosa
```

---

## Configuraciones

### Settings Manager

**Archivo**: `settings-manager.js`

#### Estructura de Configuraciones

```javascript
const SettingsManager = {
    settings: {
        language: 'es',
        theme: 'dark',
        notifications: { ... },
        progressBar: { ... },
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
            videoQuality: 'high',
            audioQuality: 'high',
            // ...
        }
    }
};
```

#### Configuracion SMTP

**Campos editables** (lineas 327-392):
- Servidor SMTP (smtp.gmail.com)
- Puerto (587)
- Usuario/Email
- Contrasena (Contrasena de aplicacion para Gmail)
- Nombre del remitente
- Email del remitente
- Conexion segura SSL/TLS

**Caracteristicas**:
- Campos se habilitan al marcar checkbox "Habilitar envio de invitaciones"
- Guardado automatico con debouncing (500ms)
- Boton "Probar Conexion SMTP"

---

## Componentes UI

### Componentes Disponibles

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| Progress Overlay | `progress-overlay.js` | Barra de progreso global |
| Element Spy | `element-spy.js` | Inspector de elementos |
| Action Properties | `action-properties.js` | Panel de propiedades |
| Variables Manager | `variables-manager.js` | Gestor de variables |
| Database Manager | `database-manager.js` | Conexiones a BD |

### Estilos CSS

**Variables globales** (`variables-styles.css`):
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --bg-dark: #1a1a1a;
    --bg-card: #2c2c2c;
    --text-primary: #ffffff;
    --text-secondary: #94a3b8;
}
```

---

## Extensiones de Navegador

### Chrome Extension

**Ubicacion**: `chrome-extension/`

**Archivos**:
- `manifest.json` - Configuracion de la extension
- `background.js` - Service worker
- `content-script.js` - Script de contenido
- `popup.html/js` - Interfaz popup

**Instalacion**:
1. Abrir `chrome://extensions`
2. Activar "Modo desarrollador"
3. Click "Cargar descomprimida"
4. Seleccionar carpeta `chrome-extension`

### Firefox Extension

**Ubicacion**: `firefox-extension/`

**Instalacion**:
1. Abrir `about:debugging`
2. Click "Este Firefox"
3. Click "Cargar complemento temporal"
4. Seleccionar `manifest.json`

---

## Historial de Cambios

### 2024-12-12

#### Configuracion SMTP
- [x] Campos ahora son editables con `oninput` en lugar de `onchange`
- [x] Agregado atributo `disabled` dinamico a campos
- [x] Implementado debouncing (500ms) para guardado automatico
- [x] Corregida URL de API: `/api/video-conference/test-smtp`

#### Videoconferencia
- [x] Agregado modal de configuracion de guardado
- [x] Seleccion de formato: WebM o MP4
- [x] Seleccion de ubicacion personalizada
- [x] File System Access API para selector de carpetas
- [x] Stickers animados reemplazan emojis
- [x] 16 stickers GIF de Google Noto Emoji

#### Archivos Modificados
- `public/js/settings-manager.js` - Lineas 5, 327-392, 999-1058
- `public/js/video-conference.js` - Lineas 56-73, 1115-1244
- `public/js/video-conference-features.js` - Lineas 734-938
- `public/css/video-conference-save-config.css` - Nuevo archivo
- `public/index.html` - Linea 17

---

## Notas para Desarrolladores

### Agregar Nuevo Sticker

```javascript
// En video-conference.js, array this.stickers
{
    id: 'nuevo',
    name: 'Nombre',
    emoji: '🆕',
    url: 'https://url-del-gif.gif'
}
```

### Agregar Nueva Configuracion

```javascript
// En settings-manager.js
// 1. Agregar en objeto settings.videoConference
// 2. Agregar HTML en renderVideoConferenceSettings()
// 3. Usar oninput para campos de texto
// 4. Usar onchange para checkboxes
```

### Estilos de Modales

```css
/* Usar clases existentes */
.vc-modal { }
.vc-modal-content { }
.vc-modal-header { }
.vc-modal-body { }
.vc-modal-footer { }
.vc-btn-primary { }
.vc-btn-secondary { }
```

---

> **Importante**: Este documento debe actualizarse cada vez que se realicen cambios en el frontend. No crear nuevos archivos MD, modificar este.
