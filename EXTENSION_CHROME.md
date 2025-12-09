# 🟢 EXTENSIÓN DE CHROME - RPA Recorder

## 📋 ¿Por qué necesitas una extensión?

**Problema:** Sitios como Google, Facebook, Twitter, etc. usan **Content Security Policy (CSP)** que bloquea la inyección de scripts externos.

**Solución:** Una extensión de Chrome tiene permisos especiales para inyectar scripts en **CUALQUIER** página, sin importar el CSP.

---

## 🚀 CÓMO CREAR LA EXTENSIÓN

### PASO 1: Crear Estructura de Carpetas

```bash
cd C:\Dev\aagw\OCR
mkdir chrome-extension
cd chrome-extension
```

Crea esta estructura:
```
chrome-extension/
├── manifest.json          (Configuración de la extensión)
├── background.js          (Script de fondo)
├── content-script.js      (Script inyectado en páginas)
├── popup.html            (Interfaz de control)
├── popup.js              (Lógica del popup)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── recorder-injected.js   (Sistema de captura)
```

---

### PASO 2: Crear `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "RPA Recorder - Element Spy",
  "version": "1.0.0",
  "description": "Graba acciones en cualquier sitio web para automatización RPA",

  "permissions": [
    "activeTab",
    "tabs",
    "storage",
    "scripting"
  ],

  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],

  "background": {
    "service_worker": "background.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "run_at": "document_idle",
      "all_frames": false
    }
  ],

  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

### PASO 3: Crear `content-script.js`

Este script se inyecta automáticamente en TODAS las páginas:

```javascript
// content-script.js - Se ejecuta en TODAS las páginas
console.log('🎬 RPA Recorder Extension - Content Script Loaded');

// Estado de grabación
let isRecording = false;
let recordedActions = [];
let eventLogs = [];

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Mensaje recibido:', request);

  if (request.action === 'start-recording') {
    startRecording();
    sendResponse({ status: 'recording started' });
  }

  if (request.action === 'stop-recording') {
    const actions = stopRecording();
    sendResponse({ status: 'recording stopped', actions: actions, logs: eventLogs });
  }

  if (request.action === 'get-status') {
    sendResponse({
      recording: isRecording,
      actionsCount: recordedActions.length,
      logsCount: eventLogs.length
    });
  }

  return true; // Mantener el canal abierto para respuesta asíncrona
});

function startRecording() {
  isRecording = true;
  recordedActions = [];
  eventLogs = [];

  console.log('✅ Grabación iniciada');

  // Crear indicador visual
  createIndicator();

  // Instalar event listeners
  installEventListeners();

  addEventLog('RECORDING_STARTED', {
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
}

function stopRecording() {
  isRecording = false;

  console.log('⏹️ Grabación detenida');

  // Remover indicador
  removeIndicator();

  // Remover event listeners
  removeEventListeners();

  addEventLog('RECORDING_STOPPED', {
    totalActions: recordedActions.length,
    totalEvents: eventLogs.length,
    timestamp: new Date().toISOString()
  });

  return recordedActions;
}

function createIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'rpa-extension-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-weight: bold;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    font-size: 13px;
  `;

  indicator.innerHTML = `
    <span style="width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></span>
    <span>🎬 GRABANDO</span>
    <span id="rpa-count" style="background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 12px;">0</span>
  `;

  // Agregar animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .rpa-hover {
      outline: 3px solid #10b981 !important;
      outline-offset: 2px;
      background: rgba(16, 185, 129, 0.1) !important;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(indicator);
}

function removeIndicator() {
  const indicator = document.getElementById('rpa-extension-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function updateCounter() {
  const counter = document.getElementById('rpa-count');
  if (counter) {
    counter.textContent = recordedActions.length;
  }
}

// Event Listeners
let clickListener, mouseoverListener, mouseoutListener;
let keydownListener, keyupListener, inputListener, changeListener;

function installEventListeners() {
  // Click
  clickListener = (e) => {
    addEventLog('CLICK', {
      tagName: e.target.tagName,
      id: e.target.id,
      className: e.target.className,
      text: e.target.textContent?.substring(0, 50),
      coordinates: { x: e.clientX, y: e.clientY }
    });

    if (!e.target.closest('#rpa-extension-indicator')) {
      e.preventDefault();
      e.stopPropagation();
      captureElement(e.target);
    }
  };

  // Hover
  mouseoverListener = (e) => {
    if (!e.target.closest('#rpa-extension-indicator')) {
      e.target.classList.add('rpa-hover');
    }
  };

  mouseoutListener = (e) => {
    e.target.classList.remove('rpa-hover');
  };

  // Keyboard
  keydownListener = (e) => {
    addEventLog('KEY_DOWN', {
      key: e.key,
      code: e.code,
      target: {
        tagName: e.target.tagName,
        id: e.target.id
      }
    });
  };

  document.addEventListener('click', clickListener, true);
  document.addEventListener('mouseover', mouseoverListener, true);
  document.addEventListener('mouseout', mouseoutListener, true);
  document.addEventListener('keydown', keydownListener, true);
}

function removeEventListeners() {
  document.removeEventListener('click', clickListener, true);
  document.removeEventListener('mouseover', mouseoverListener, true);
  document.removeEventListener('mouseout', mouseoutListener, true);
  document.removeEventListener('keydown', keydownListener, true);
}

function captureElement(element) {
  const selector = generateSelector(element);

  const action = {
    type: 'click',
    selector: selector,
    tagName: element.tagName,
    id: element.id || '',
    className: element.className || '',
    text: element.textContent?.substring(0, 100).trim() || '',
    timestamp: Date.now(),
    url: window.location.href
  };

  recordedActions.push(action);
  updateCounter();

  console.log('🎯 Acción capturada:', action);
}

function generateSelector(element) {
  // Prioridad: id > name > class > xpath
  if (element.id) {
    return `#${element.id}`;
  }

  if (element.name) {
    return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
  }

  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/);
    if (classes.length > 0 && classes[0]) {
      return `.${classes[0]}`;
    }
  }

  // Fallback: tag + nth-child
  let path = [];
  let current = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${current.id}`;
      path.unshift(selector);
      break;
    } else {
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (sibling.tagName === current.tagName) {
          nth++;
        }
      }
      if (nth > 1) {
        selector += `:nth-of-type(${nth})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

function addEventLog(eventType, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    timestampMs: Date.now(),
    eventType: eventType,
    details: details,
    windowState: {
      url: window.location.href,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    }
  };

  eventLogs.push(logEntry);
  console.log(`📋 LOG [${eventType}]:`, logEntry);
}

console.log('✅ Content Script inicializado - Listo para grabar');
```

---

### PASO 4: Crear `popup.html`

Interfaz de control de la extensión:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 350px;
      padding: 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
    }

    h1 {
      font-size: 18px;
      margin-bottom: 5px;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .status {
      background: #334155;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 13px;
    }

    .status.recording {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    button {
      width: 100%;
      padding: 12px;
      margin-bottom: 10px;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.2s;
    }

    button:hover {
      transform: scale(1.02);
    }

    button:active {
      transform: scale(0.98);
    }

    .btn-start {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .btn-stop {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
    }

    .btn-download {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 15px;
    }

    .stat {
      background: #334155;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
    }

    .stat-label {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <h1>🎬 RPA Recorder</h1>
  <p class="subtitle">Element Spy - Chrome Extension</p>

  <div id="status" class="status">
    <span id="status-text">⏸️ Listo para grabar</span>
  </div>

  <button id="start-btn" class="btn-start">▶️ Iniciar Grabación</button>
  <button id="stop-btn" class="btn-stop" style="display: none;">⏹️ Detener Grabación</button>
  <button id="download-btn" class="btn-download" style="display: none;">💾 Descargar JSON</button>

  <div class="stats">
    <div class="stat">
      <div class="stat-value" id="actions-count">0</div>
      <div class="stat-label">Acciones</div>
    </div>
    <div class="stat">
      <div class="stat-value" id="logs-count">0</div>
      <div class="stat-label">Eventos</div>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

---

### PASO 5: Crear `popup.js`

```javascript
// popup.js - Lógica del popup de la extensión
let recordedData = null;

document.getElementById('start-btn').addEventListener('click', startRecording);
document.getElementById('stop-btn').addEventListener('click', stopRecording);
document.getElementById('download-btn').addEventListener('click', downloadJSON);

// Verificar estado al abrir popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'get-status' }, (response) => {
    if (response && response.recording) {
      showRecordingUI();
      updateStats(response.actionsCount, response.logsCount);
    }
  });
});

function startRecording() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'start-recording' }, (response) => {
      console.log('Respuesta:', response);
      showRecordingUI();
    });
  });
}

function stopRecording() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stop-recording' }, (response) => {
      console.log('Grabación detenida:', response);
      recordedData = response;
      showStoppedUI();
      updateStats(response.actions.length, response.logs.length);
    });
  });
}

function downloadJSON() {
  if (!recordedData) return;

  const data = {
    main: {
      name: 'Recorded_' + Date.now(),
      created: new Date().toISOString(),
      actions: recordedData.actions,
      totalActions: recordedData.actions.length
    },
    logs: recordedData.logs
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: `rpa_recording_${Date.now()}.json`,
    saveAs: true
  });
}

function showRecordingUI() {
  document.getElementById('status').classList.add('recording');
  document.getElementById('status-text').textContent = '🔴 GRABANDO...';
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('stop-btn').style.display = 'block';
  document.getElementById('download-btn').style.display = 'none';
}

function showStoppedUI() {
  document.getElementById('status').classList.remove('recording');
  document.getElementById('status-text').textContent = '✅ Grabación completada';
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('stop-btn').style.display = 'none';
  document.getElementById('download-btn').style.display = 'block';
}

function updateStats(actions, logs) {
  document.getElementById('actions-count').textContent = actions;
  document.getElementById('logs-count').textContent = logs;
}
```

---

### PASO 6: Crear `background.js`

```javascript
// background.js - Service Worker de la extensión
console.log('🎬 RPA Recorder Extension - Background Script Loaded');

// Escuchar instalación
chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ RPA Recorder Extension instalada correctamente');
});

// Comunicación entre content script y popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Mensaje en background:', request);
  // Aquí puedes agregar lógica adicional si es necesario
  return true;
});
```

---

### PASO 7: Agregar Iconos

Crea una carpeta `icons/` y agrega imágenes de 16x16, 48x48 y 128x128 píxeles.

O usa iconos placeholder:
```bash
# Puedes usar cualquier imagen PNG
# Ejemplo: descarga un icono de https://www.flaticon.com
# O crea uno simple en Paint
```

---

## 📦 INSTALAR LA EXTENSIÓN EN CHROME

### 1. Abrir Chrome Extensions

```
chrome://extensions/
```

### 2. Activar "Modo de Desarrollador"

- Toggle en la esquina superior derecha

### 3. Click en "Cargar extensión sin empaquetar"

- Selecciona la carpeta `chrome-extension/`

### 4. ¡Listo!

Verás el icono de la extensión en la barra de Chrome.

---

## 🎯 CÓMO USAR LA EXTENSIÓN

### 1. Navega a cualquier sitio
```
https://www.google.com
https://www.facebook.com
https://www.amazon.com
¡CUALQUIER SITIO!
```

### 2. Click en el icono de la extensión

### 3. Click en "▶️ Iniciar Grabación"

### 4. Interactúa con la página
- Haz clicks
- Escribe en campos
- Navega

### 5. Click en "⏹️ Detener Grabación"

### 6. Click en "💾 Descargar JSON"

### 7. Importa el JSON en tu aplicación RPA

---

## ✅ VENTAJAS DE LA EXTENSIÓN

✅ **Funciona en CUALQUIER sitio** (Google, Facebook, etc.)
✅ **No se bloquea por CSP** (tiene permisos especiales)
✅ **Captura TODOS los eventos** (clicks, teclas, etc.)
✅ **Logs completos** en formato JSON
✅ **Interfaz visual** para control
✅ **Descarga directa** de grabaciones

---

## 🔄 INTEGRACIÓN CON LA APLICACIÓN PRINCIPAL

Para integrar con tu app RPA:

1. **Usuario graba con la extensión**
2. **Descarga el JSON**
3. **Importa en http://localhost:3000**
4. **Ejecuta el workflow**

O mejor aún:

**Conectar extensión con servidor:**
- Agrega comunicación HTTP desde la extensión
- Envía datos directamente a `http://localhost:3000/api/projects/save`
- ¡Sincronización automática!

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Crear la estructura de archivos
2. ✅ Cargar en Chrome
3. ✅ Probar en Google.com
4. 📝 Crear versiones para Firefox y Edge
5. 🔗 Conectar con servidor RPA

---

¡Ya tienes una extensión de Chrome profesional para RPA! 🎉
