// 🎯 ALQVIMIA - BACKGROUND SERVICE WORKER
// Gestiona la comunicación entre la extensión y las páginas web

console.log('🟢 Alqvimia Extension - Background Service Worker iniciado');

// Estado de grabación
let isRecording = false;
let currentTabId = null;
let serverUrl = 'http://localhost:3000';

// Escuchar mensajes desde content-script y popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Mensaje recibido en background:', message);

  switch (message.type) {
    case 'START_RECORDING':
      handleStartRecording(message.config, sender.tab?.id);
      sendResponse({ success: true });
      break;

    case 'STOP_RECORDING':
      handleStopRecording();
      sendResponse({ success: true });
      break;

    case 'GET_STATUS':
      sendResponse({
        isRecording,
        currentTabId,
        serverUrl
      });
      break;

    case 'EVENT_CAPTURED':
      // Evento capturado desde content-script, reenviar al servidor
      forwardEventToServer(message.event);
      sendResponse({ success: true });
      break;

    case 'OBJECT_CAPTURED':
      // Objeto capturado, reenviar al servidor
      forwardObjectToServer(message.object);
      sendResponse({ success: true });
      break;

    default:
      console.warn('⚠️ Tipo de mensaje desconocido:', message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
  }

  return true; // Mantener el canal abierto para respuestas asíncronas
});

// Iniciar grabación
function handleStartRecording(config, tabId) {
  console.log('🎬 Iniciando grabación...', config);

  isRecording = true;
  currentTabId = tabId;

  // Guardar configuración en storage
  chrome.storage.local.set({
    isRecording: true,
    currentTabId: tabId,
    projectConfig: config
  });

  // Notificar al servidor que inició grabación
  fetch(`${serverUrl}/api/recording/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: config.projectName,
      projectFolder: config.projectFolder,
      browserType: config.browserType || 'chrome-extension'
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Servidor notificado - Grabación iniciada:', data);
  })
  .catch(err => {
    console.error('❌ Error notificando al servidor:', err);
  });

  // Inyectar script de captura en la pestaña actual
  if (tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: activateRecording
    });
  }
}

// Detener grabación
function handleStopRecording() {
  console.log('⏹️ Deteniendo grabación...');

  isRecording = false;

  chrome.storage.local.set({
    isRecording: false,
    currentTabId: null
  });

  // Notificar al servidor
  fetch(`${serverUrl}/api/recording/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Grabación detenida:', data);
  })
  .catch(err => {
    console.error('❌ Error deteniendo grabación:', err);
  });

  // Desactivar captura en la página
  if (currentTabId) {
    chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      func: deactivateRecording
    });
  }

  currentTabId = null;
}

// Reenviar evento al servidor
function forwardEventToServer(event) {
  if (!isRecording) return;

  fetch(`${serverUrl}/api/events/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  })
  .then(res => res.json())
  .then(data => {
    console.log('📊 Evento enviado al servidor:', event.type);
  })
  .catch(err => {
    console.error('❌ Error enviando evento:', err);
  });
}

// Reenviar objeto al servidor
function forwardObjectToServer(object) {
  if (!isRecording) return;

  fetch(`${serverUrl}/api/objects/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object)
  })
  .then(res => res.json())
  .then(data => {
    console.log('🎯 Objeto enviado al servidor:', object.varName);
  })
  .catch(err => {
    console.error('❌ Error enviando objeto:', err);
  });
}

// Funciones inyectadas en la página
function activateRecording() {
  console.log('✅ Activando sistema de captura en página...');
  window.postMessage({ type: 'RPA_ACTIVATE_RECORDING' }, '*');
}

function deactivateRecording() {
  console.log('⏹️ Desactivando sistema de captura en página...');
  window.postMessage({ type: 'RPA_DEACTIVATE_RECORDING' }, '*');
}

// Detectar cuando se cambia de pestaña
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (isRecording && activeInfo.tabId !== currentTabId) {
    console.log('⚠️ Cambio de pestaña detectado durante grabación');
    // Podrías pausar la grabación o notificar al usuario
  }
});

// Detectar cuando se cierra una pestaña
chrome.tabs.onRemoved.addListener((tabId) => {
  if (isRecording && tabId === currentTabId) {
    console.log('⚠️ Pestaña de grabación cerrada');
    handleStopRecording();
  }
});
