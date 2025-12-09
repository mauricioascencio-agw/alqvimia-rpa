# 🎯 ELEMENT SPY RPA - CHROME EXTENSION

## 📋 Descripción

Extensión de Chrome que permite grabar y automatizar acciones en **CUALQUIER sitio web**, sin las limitaciones de CSP (Content Security Policy) que afectan a la inyección de scripts normal.

**Características:**
- ✅ Funciona en Google, Facebook, Twitter, LinkedIn, etc.
- ✅ Captura clicks, teclas, inputs, cambios
- ✅ Auto-relleno de propiedades HTML
- ✅ Sistema de logging completo
- ✅ Guardado automático de proyectos
- ✅ Numeración automática de objetos (OBJ_001, OBJ_002...)
- ✅ Interfaz visual moderna

---

## 📦 Archivos Incluidos

```
chrome-extension/
├── manifest.json              # Configuración de la extensión
├── background.js              # Service worker (gestión de eventos)
├── content-script.js          # Script inyectado en páginas web
├── injected-recorder.js       # Sistema de captura de eventos
├── popup.html                 # Interfaz de usuario
├── popup.js                   # Lógica del popup
├── crear-iconos.html          # Generador de iconos
├── INSTALACION.md             # Guía de instalación detallada
├── README.md                  # Este archivo
├── icon16.png                 # Icono 16x16 (DEBES CREAR)
├── icon48.png                 # Icono 48x48 (DEBES CREAR)
└── icon128.png                # Icono 128x128 (DEBES CREAR)
```

---

## 🚀 INICIO RÁPIDO (3 PASOS)

### 1. Crear Iconos
```bash
# Abre en tu navegador:
C:\Dev\aagw\OCR\chrome-extension\crear-iconos.html

# Descarga los 3 iconos y guárdalos en chrome-extension/
```

### 2. Cargar Extensión
1. Abre Chrome: `chrome://extensions/`
2. Activa **"Modo de desarrollador"**
3. Click **"Cargar extensión sin empaquetar"**
4. Selecciona carpeta: `C:\Dev\aagw\OCR\chrome-extension\`

### 3. Probar
1. Abre cualquier sitio web (ej: google.com)
2. Click en el icono de la extensión
3. Configura proyecto y click **"🎬 Iniciar Grabación"**
4. Usa **Ctrl+Click** para capturar objetos

---

## 🎯 CÓMO USAR

### Iniciar Grabación:
1. Click en el icono de la extensión (🧩)
2. Configurar:
   - **Carpeta del Proyecto:** `C:\Dev\aagw\OCR\workflows`
   - **Nombre del Proyecto:** `MiProyecto` (sin espacios)
   - **Navegador:** Chrome (Extensión)
3. Click **"🎬 Iniciar Grabación"**

### Capturar Objetos:
1. Mantén presionado **Ctrl** o **Shift**
2. Los elementos se resaltan en azul al pasar el cursor
3. Haz **Ctrl+Click** en el elemento
4. Aparece notificación: "✅ Objeto capturado: [nombre]"

### Detener y Guardar:
1. Click **"⏹️ Detener"** en el popup
2. Click **"💾 Guardar"**
3. Verifica mensaje: "✅ Proyecto guardado en: [ruta]"

---

## 📊 ESTADÍSTICAS EN TIEMPO REAL

Mientras grabas, el popup muestra:

```
📊 Estadísticas de Grabación
┌──────────────────────────────────┐
│ Eventos capturados:        47    │
│ Objetos capturados:        4     │
│ Tiempo de grabación:    03:45    │
└──────────────────────────────────┘
```

---

## 🔧 ARQUITECTURA TÉCNICA

### Flujo de Comunicación:

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────┐
│   Popup     │ ───► │  Background  │ ───► │   Content   │ ───► │  Página  │
│  (UI)       │ ◄─── │  (Service    │ ◄─── │   Script    │ ◄─── │  Web     │
│             │      │   Worker)    │      │             │      │          │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────┘
      │                     │                      │                   │
      └─────────────────────┴──────────────────────┴──────────────────►
                    Servidor RPA (localhost:3000)
```

### Componentes:

1. **popup.html/js**: Interfaz de usuario, configuración, estadísticas
2. **background.js**: Gestiona estado de grabación, comunica con servidor
3. **content-script.js**: Se ejecuta en contexto de la página, captura eventos
4. **injected-recorder.js**: Script inyectado directamente en la página para máximo acceso

---

## 📡 API del Servidor

La extensión se comunica con el servidor RPA:

### Endpoints utilizados:

```javascript
POST /api/recording/start
Body: { projectName, projectFolder, browserType }

POST /api/recording/stop
Body: {}

POST /api/events/capture
Body: { type, timestamp, url, element, ... }

POST /api/objects/capture
Body: { objectNumber, varName, selector, properties, ... }

POST /api/projects/save
Body: { projectFolder, projectName, projectData }
```

---

## 🎨 PERSONALIZACIÓN

### Cambiar Colores del Popup:
Edita [popup.html](popup.html), líneas 20-30:

```css
.header {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  /* Cambia los colores aquí */
}
```

### Cambiar Selector de Captura:
Edita [content-script.js](content-script.js), línea 46:

```javascript
// Cambiar de Ctrl+Click a Alt+Click:
if (e.altKey) {  // Cambiar de e.ctrlKey a e.altKey
  captureObject(elementInfo);
}
```

### Cambiar Puerto del Servidor:
Edita [background.js](background.js), línea 8:

```javascript
let serverUrl = 'http://localhost:3000';  // Cambiar puerto aquí
```

---

## 🐛 DEBUGGING

### Ver Logs del Background:
1. `chrome://extensions/`
2. Busca "Element Spy RPA Recorder"
3. Click en **"Service Worker"**
4. Se abre DevTools con logs del background

### Ver Logs del Content Script:
1. Abre la página web
2. Presiona **F12**
3. Busca en consola: "🟢 Element Spy RPA - Content Script cargado"

### Ver Logs del Popup:
1. Click derecho en el icono de la extensión
2. **"Inspeccionar ventana emergente"**
3. Se abre DevTools del popup

---

## ⚠️ LIMITACIONES CONOCIDAS

1. **Requiere servidor corriendo**: Debe estar activo `npm start` en `localhost:3000`
2. **No captura eventos en iframes**: Solo la página principal
3. **No funciona en páginas especiales de Chrome**: `chrome://`, `chrome-extension://`, etc.
4. **Estadísticas se reinician**: Al cerrar el popup, las estadísticas se resetean (pero los datos están guardados en storage)

---

## 🔐 PERMISOS EXPLICADOS

```json
"permissions": [
  "activeTab",      // Acceder a la pestaña activa
  "scripting",      // Inyectar scripts
  "storage",        // Guardar configuración
  "tabs"            // Información de pestañas
],
"host_permissions": [
  "http://*/*",     // Acceso a sitios HTTP
  "https://*/*"     // Acceso a sitios HTTPS
]
```

---

## 📝 CHANGELOG

### v2.0.0 (2025-12-07)
- ✅ Versión inicial completa
- ✅ Captura de eventos (click, teclado, input)
- ✅ Auto-relleno de propiedades HTML
- ✅ Sistema de logging completo
- ✅ Interfaz visual moderna
- ✅ Integración con servidor RPA
- ✅ Numeración automática de objetos

---

## 🆕 PRÓXIMAS MEJORAS (ROADMAP)

- [ ] Captura de screenshots automáticos
- [ ] Export a formato JSON/XML/Excel
- [ ] Replay de grabaciones
- [ ] Editor visual de workflows
- [ ] Soporte para iframes
- [ ] Modo oscuro/claro
- [ ] Shortcuts de teclado personalizables
- [ ] Sincronización en la nube

---

## 🤝 CONTRIBUIR

Si quieres mejorar la extensión:

1. **Fork** el proyecto
2. Crea una rama: `git checkout -b feature/MiMejora`
3. Haz cambios y commit: `git commit -m "Add: MiMejora"`
4. Push: `git push origin feature/MiMejora`
5. Crea un **Pull Request**

---

## 📞 SOPORTE

### Problemas Comunes:

1. **Extensión no carga**: Verifica que existan los archivos `icon*.png`
2. **No captura eventos**: Verifica que el servidor esté corriendo
3. **Error al guardar**: Verifica permisos de la carpeta de destino
4. **Popup no aparece**: Inspecciona el popup y revisa errores en consola

### Documentación Completa:
- [INSTALACION.md](INSTALACION.md) - Guía paso a paso
- [LEEME_PRIMERO_V2.md](../LEEME_PRIMERO_V2.md) - Documentación del proyecto completo

---

## 📄 LICENCIA

Este proyecto es parte del **Element Spy RPA Tool**.

Creado por: **Claude Code**
Fecha: **2025-12-07**
Versión: **2.0.0**

---

## 🎉 ¡GRACIAS POR USAR ELEMENT SPY RPA!

Si esta extensión te ayudó, ⭐ dale una estrella al proyecto.

**¡Feliz automatización!** 🤖
