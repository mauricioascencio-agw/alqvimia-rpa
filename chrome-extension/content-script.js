// 🎯 ALQVIMIA - CONTENT SCRIPT
// Se ejecuta en el contexto de cada página web y captura eventos

console.log('🟢 Alqvimia - Content Script cargado');

let isRecording = false;
let capturedObjects = [];
let eventLogs = [];
let objectCounter = 0;

// Escuchar mensajes desde la página
window.addEventListener('message', (event) => {
  // Solo aceptar mensajes de nuestra propia ventana
  if (event.source !== window) return;

  const message = event.data;

  switch (message.type) {
    case 'RPA_EXTENSION_CHECK':
      // Responder que la extensión está disponible
      window.postMessage({ type: 'RPA_EXTENSION_AVAILABLE' }, '*');
      break;

    case 'RPA_START_RECORDING':
      activateRecording(message.config);
      break;

    case 'RPA_STOP_RECORDING':
      deactivateRecording();
      break;

    case 'RPA_ACTIVATE_RECORDING':
      activateRecording();
      break;

    case 'RPA_DEACTIVATE_RECORDING':
      deactivateRecording();
      break;

    case 'RPA_EVENT_CAPTURED':
      // Evento capturado, enviar a background
      chrome.runtime.sendMessage({
        type: 'EVENT_CAPTURED',
        event: message.event
      });
      break;

    case 'RPA_OBJECT_CAPTURED':
      // Objeto capturado, enviar a background
      chrome.runtime.sendMessage({
        type: 'OBJECT_CAPTURED',
        object: message.object
      });
      break;
  }
});

// Activar sistema de captura
function activateRecording() {
  if (isRecording) return;

  console.log('✅ Sistema de captura activado en:', window.location.href);
  isRecording = true;

  // Inyectar el script de captura en la página
  injectRecorderScript();

  // Agregar listeners de eventos
  attachEventListeners();

  // Notificar que está activo
  showRecordingIndicator();
}

// Desactivar sistema de captura
function deactivateRecording() {
  if (!isRecording) return;

  console.log('⏹️ Sistema de captura desactivado');
  isRecording = false;

  // Remover listeners
  removeEventListeners();

  // Ocultar indicador
  hideRecordingIndicator();
}

// Inyectar script de captura en la página
function injectRecorderScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected-recorder.js');
  script.onload = () => {
    console.log('✅ Script de captura inyectado correctamente');
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

// Event Listeners
let clickListener, keydownListener, keyupListener, inputListener, changeListener, mousemoveListener;
let highlightOverlay = null;

function attachEventListeners() {
  // Crear overlay de resaltado
  createHighlightOverlay();

  // Mousemove para resaltar elementos
  mousemoveListener = (e) => {
    if (!isRecording) return;

    const element = e.target;

    // Evitar resaltar el mismo overlay
    if (element === highlightOverlay || element.id === 'rpa-recording-indicator') {
      return;
    }

    // Resaltar elemento
    highlightElement(element);
  };

  // Click
  clickListener = (e) => {
    if (!isRecording) return;

    const elementInfo = analyzeElement(e.target);

    const event = {
      type: 'CLICK',
      timestamp: Date.now(),
      url: window.location.href,
      element: elementInfo,
      coordinates: { x: e.clientX, y: e.clientY },
      button: e.button,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey
    };

    logEvent(event);

    // Mostrar diálogo de captura de objeto
    if (e.ctrlKey || e.shiftKey) { // Ctrl+Click o Shift+Click para capturar objeto
      e.preventDefault();
      captureObject(elementInfo);
    }
  };

  // Key Down
  keydownListener = (e) => {
    if (!isRecording) return;

    const event = {
      type: 'KEY_DOWN',
      timestamp: Date.now(),
      url: window.location.href,
      key: e.key,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      target: {
        tagName: e.target.tagName,
        id: e.target.id,
        name: e.target.name
      }
    };

    logEvent(event);
  };

  // Key Up
  keyupListener = (e) => {
    if (!isRecording) return;

    const event = {
      type: 'KEY_UP',
      timestamp: Date.now(),
      url: window.location.href,
      key: e.key,
      code: e.code
    };

    logEvent(event);
  };

  // Input
  inputListener = (e) => {
    if (!isRecording) return;

    const event = {
      type: 'INPUT',
      timestamp: Date.now(),
      url: window.location.href,
      value: e.target.value,
      target: {
        tagName: e.target.tagName,
        id: e.target.id,
        name: e.target.name,
        type: e.target.type
      }
    };

    logEvent(event);
  };

  // Change
  changeListener = (e) => {
    if (!isRecording) return;

    const event = {
      type: 'CHANGE',
      timestamp: Date.now(),
      url: window.location.href,
      value: e.target.value,
      target: {
        tagName: e.target.tagName,
        id: e.target.id,
        name: e.target.name
      }
    };

    logEvent(event);
  };

  // Adjuntar listeners
  document.addEventListener('mousemove', mousemoveListener, true);
  document.addEventListener('click', clickListener, true);
  document.addEventListener('keydown', keydownListener, true);
  document.addEventListener('keyup', keyupListener, true);
  document.addEventListener('input', inputListener, true);
  document.addEventListener('change', changeListener, true);
}

function removeEventListeners() {
  if (mousemoveListener) document.removeEventListener('mousemove', mousemoveListener, true);
  if (clickListener) document.removeEventListener('click', clickListener, true);
  if (keydownListener) document.removeEventListener('keydown', keydownListener, true);
  if (keyupListener) document.removeEventListener('keyup', keyupListener, true);
  if (inputListener) document.removeEventListener('input', inputListener, true);
  if (changeListener) document.removeEventListener('change', changeListener, true);

  // Remover overlay de resaltado
  if (highlightOverlay) {
    highlightOverlay.remove();
    highlightOverlay = null;
  }
}

// Crear overlay de resaltado
function createHighlightOverlay() {
  if (highlightOverlay) return;

  highlightOverlay = document.createElement('div');
  highlightOverlay.id = 'rpa-highlight-overlay';
  highlightOverlay.style.cssText = `
    position: absolute;
    border: 2px solid #2563eb;
    background: rgba(37, 99, 235, 0.1);
    pointer-events: none;
    z-index: 999999;
    display: none;
    transition: all 0.1s ease;
  `;
  document.body.appendChild(highlightOverlay);
}

// Resaltar elemento
function highlightElement(element) {
  if (!highlightOverlay) return;

  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  highlightOverlay.style.display = 'block';
  highlightOverlay.style.left = (rect.left + scrollX) + 'px';
  highlightOverlay.style.top = (rect.top + scrollY) + 'px';
  highlightOverlay.style.width = rect.width + 'px';
  highlightOverlay.style.height = rect.height + 'px';
}

// Analizar elemento
function analyzeElement(element) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  // Extraer todos los atributos HTML
  const htmlAttributes = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    htmlAttributes[attr.name] = attr.value;
  }

  // Extraer data-attributes
  const dataAttributes = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith('data-')) {
      dataAttributes[attr.name.substring(5)] = attr.value;
    }
  }

  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || '',
    className: element.className || '',
    name: element.name || '',
    type: element.type || '',
    text: element.textContent ? element.textContent.substring(0, 100).trim() : '',
    value: element.value || '',
    href: element.href || '',
    src: element.src || '',
    alt: element.alt || '',
    placeholder: element.placeholder || '',
    title: element.title || '',
    role: element.getAttribute('role') || '',
    ariaLabel: element.getAttribute('aria-label') || '',
    htmlAttributes: htmlAttributes,
    dataAttributes: dataAttributes,
    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    computedStyles: {
      width: computedStyle.width,
      height: computedStyle.height,
      display: computedStyle.display,
      visibility: computedStyle.visibility
    }
  };
}

// Loguear evento
function logEvent(event) {
  eventLogs.push(event);

  // Enviar a background script
  window.postMessage({
    type: 'RPA_EVENT_CAPTURED',
    event: event
  }, '*');

  console.log('📊 Evento capturado:', event.type, event);
}

// Capturar objeto
function captureObject(elementInfo) {
  objectCounter++;

  const object = {
    objectNumber: objectCounter,
    sequenceId: `OBJ_${String(objectCounter).padStart(3, '0')}`,
    varName: generateVarName(elementInfo),
    selector: generateSelector(elementInfo),
    type: elementInfo.tag,
    elementType: elementInfo.tag,
    properties: elementInfo.htmlAttributes,
    dataAttributes: elementInfo.dataAttributes,
    captured: new Date().toISOString(),
    capturedTimestamp: Date.now(),
    orderInFlow: objectCounter
  };

  capturedObjects.push(object);

  // Enviar a background script
  window.postMessage({
    type: 'RPA_OBJECT_CAPTURED',
    object: object
  }, '*');

  console.log('🎯 Objeto capturado:', object);

  // Mostrar notificación
  showNotification(`✅ Objeto capturado: ${object.varName}`, 'success');
}

// Generar nombre de variable
function generateVarName(info) {
  let prefix = 'elem';

  if (info.tag === 'input') {
    prefix = 'txt';
  } else if (info.tag === 'button') {
    prefix = 'btn';
  } else if (info.tag === 'a') {
    prefix = 'lnk';
  } else if (info.tag === 'img') {
    prefix = 'img';
  } else if (info.tag === 'select') {
    prefix = 'sel';
  }

  const name = info.id || info.name || info.className.split(' ')[0] || info.tag;
  return prefix + name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '');
}

// Generar selector
function generateSelector(info) {
  if (info.id) return `#${info.id}`;
  if (info.name) return `[name="${info.name}"]`;
  if (info.className) return `.${info.className.split(' ')[0]}`;
  return info.tag;
}

// Mostrar indicador de grabación
function showRecordingIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'rpa-recording-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999999;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  indicator.innerHTML = `
    <div style="width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></div>
    <span>🎬 GRABANDO</span>
  `;

  // Agregar animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(indicator);
}

function hideRecordingIndicator() {
  const indicator = document.getElementById('rpa-recording-indicator');
  if (indicator) indicator.remove();
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 70px;
    right: 10px;
    z-index: 999999;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease-out;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Verificar estado al cargar
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
  if (response && response.isRecording) {
    activateRecording();
  }
});
