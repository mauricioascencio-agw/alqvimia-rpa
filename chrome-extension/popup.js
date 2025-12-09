// 🎯 ELEMENT SPY RPA - POPUP SCRIPT
// Interfaz de usuario de la extensión

console.log('🟢 Element Spy RPA Popup cargado');

let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let eventCount = 0;
let objectCount = 0;

// Elementos del DOM
const configSection = document.getElementById('configSection');
const recordingSection = document.getElementById('recordingSection');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnSave = document.getElementById('btnSave');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const projectFolder = document.getElementById('projectFolder');
const projectName = document.getElementById('projectName');
const browserType = document.getElementById('browserType');
const messageArea = document.getElementById('messageArea');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupEventListeners();
});

// Cargar estado
function loadState() {
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
    if (response && response.isRecording) {
      isRecording = true;
      updateUI();
    }
  });

  // Cargar configuración guardada
  chrome.storage.local.get(['projectConfig'], (result) => {
    if (result.projectConfig) {
      projectFolder.value = result.projectConfig.projectFolder || projectFolder.value;
      projectName.value = result.projectConfig.projectName || '';
      browserType.value = result.projectConfig.browserType || 'chrome-extension';
    }
  });

  // Cargar estadísticas
  chrome.storage.local.get(['eventCount', 'objectCount'], (result) => {
    eventCount = result.eventCount || 0;
    objectCount = result.objectCount || 0;
    updateStats();
  });
}

// Setup event listeners
function setupEventListeners() {
  btnStart.addEventListener('click', startRecording);
  btnStop.addEventListener('click', stopRecording);
  btnSave.addEventListener('click', saveRecording);

  // Escuchar mensajes del background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EVENT_CAPTURED') {
      eventCount++;
      updateStats();
      saveStats();
    } else if (message.type === 'OBJECT_CAPTURED') {
      objectCount++;
      updateStats();
      saveStats();
    }
  });
}

// Iniciar grabación
async function startRecording() {
  const folder = projectFolder.value.trim();
  const name = projectName.value.trim();

  if (!folder || !name) {
    showMessage('⚠️ Por favor completa todos los campos', 'error');
    return;
  }

  // Validar nombre de proyecto (sin espacios)
  if (name.includes(' ')) {
    showMessage('⚠️ El nombre del proyecto no puede contener espacios. Usa guiones bajos (_)', 'error');
    return;
  }

  // Obtener pestaña actual
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
    showMessage('❌ No se pudo obtener la pestaña actual', 'error');
    return;
  }

  // Configuración de grabación
  const config = {
    projectFolder: folder,
    projectName: name,
    browserType: browserType.value,
    startUrl: tab.url,
    startTime: Date.now()
  };

  // Guardar configuración
  await chrome.storage.local.set({ projectConfig: config });

  // Enviar mensaje al background
  chrome.runtime.sendMessage({
    type: 'START_RECORDING',
    config: config
  }, (response) => {
    if (response && response.success) {
      isRecording = true;
      recordingStartTime = Date.now();
      eventCount = 0;
      objectCount = 0;

      updateUI();
      startTimer();
      showMessage('✅ Grabación iniciada correctamente', 'success');

      console.log('✅ Grabación iniciada:', config);
    } else {
      showMessage('❌ Error al iniciar grabación', 'error');
    }
  });
}

// Detener grabación
function stopRecording() {
  chrome.runtime.sendMessage({ type: 'STOP_RECORDING' }, (response) => {
    if (response && response.success) {
      isRecording = false;
      recordingStartTime = null;

      stopTimer();
      updateUI();
      showMessage('⏹️ Grabación detenida', 'info');

      console.log('⏹️ Grabación detenida');
    }
  });
}

// Guardar grabación
async function saveRecording() {
  showMessage('💾 Guardando proyecto...', 'info');

  try {
    // Obtener configuración
    const result = await chrome.storage.local.get(['projectConfig', 'eventLogs', 'capturedObjects']);

    const projectData = {
      main: {
        name: result.projectConfig.projectName,
        createdAt: new Date(result.projectConfig.startTime).toISOString(),
        totalActions: eventCount,
        totalObjects: objectCount
      },
      config: result.projectConfig,
      objects: result.capturedObjects || [],
      logs: result.eventLogs || []
    };

    // Enviar al servidor
    const response = await fetch('http://localhost:3000/api/projects/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectFolder: result.projectConfig.projectFolder,
        projectName: result.projectConfig.projectName,
        projectData: projectData
      })
    });

    const data = await response.json();

    if (data.success) {
      showMessage(`✅ Proyecto guardado en: ${data.path}`, 'success');
      console.log('✅ Proyecto guardado:', data);

      // Limpiar storage
      await chrome.storage.local.remove(['eventLogs', 'capturedObjects', 'eventCount', 'objectCount']);
      eventCount = 0;
      objectCount = 0;
      updateStats();
    } else {
      throw new Error(data.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('❌ Error guardando:', error);
    showMessage(`❌ Error: ${error.message}`, 'error');
  }
}

// Actualizar UI
function updateUI() {
  if (isRecording) {
    statusDot.classList.add('recording');
    statusText.textContent = 'Grabando';
    configSection.classList.add('hidden');
    recordingSection.classList.remove('hidden');
  } else {
    statusDot.classList.remove('recording');
    statusText.textContent = 'Detenido';
    configSection.classList.remove('hidden');
    recordingSection.classList.add('hidden');
  }
}

// Actualizar estadísticas
function updateStats() {
  document.getElementById('eventCount').textContent = eventCount;
  document.getElementById('objectCount').textContent = objectCount;
}

// Guardar estadísticas
function saveStats() {
  chrome.storage.local.set({
    eventCount: eventCount,
    objectCount: objectCount
  });
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (!recordingStartTime) return;

    const elapsed = Date.now() - recordingStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    document.getElementById('recordingTime').textContent =
      `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Mostrar mensaje
function showMessage(message, type = 'info') {
  const className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';

  messageArea.innerHTML = `
    <div class="${className}">
      ${message}
    </div>
  `;

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    messageArea.innerHTML = '';
  }, 5000);
}
