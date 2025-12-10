// Configuración global de la aplicación
const socket = io('http://localhost:3000');

// Estado global
const AppState = {
    currentView: 'spy',
    socket: socket,
    connected: false,
    currentWorkflow: [],
    workflowName: '',
    selectedElement: null
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupSocketListeners();
    setupNavigation();
});

function initializeApp() {
    console.log('🤖 Alqvimia Iniciado');
    updateServerStatus(false);
}

function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('✅ Conectado al servidor');
        AppState.connected = true;
        updateServerStatus(true);
        showNotification('Conectado al servidor', 'success');
    });

    socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor');
        AppState.connected = false;
        updateServerStatus(false);
        showNotification('Desconectado del servidor', 'error');
    });

    socket.on('workflow-status', (status) => {
        updateExecutionStatus(status);

        // Actualizar barra de progreso si está disponible
        if (typeof ProgressOverlay !== 'undefined' && status.currentStep && status.totalSteps) {
            const percentage = (status.currentStep / status.totalSteps) * 100;
            const actionText = status.actionDescription || `Ejecutando paso ${status.currentStep} de ${status.totalSteps}`;
            ProgressOverlay.updateProgress(percentage, actionText);
        }
    });

    socket.on('workflow-completed', (result) => {
        showNotification('Workflow completado exitosamente', 'success');
        addLogEntry('Workflow completado', 'success');

        // Mostrar completado en barra de progreso
        if (typeof ProgressOverlay !== 'undefined') {
            ProgressOverlay.showComplete();
        }
    });

    socket.on('workflow-error', (error) => {
        showNotification(`Error: ${error.error}`, 'error');
        addLogEntry(`Error: ${error.error}`, 'error');

        // Mostrar error en barra de progreso
        if (typeof ProgressOverlay !== 'undefined') {
            ProgressOverlay.showError(error.error || 'Error en el proceso');
        }
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');

            // Actualizar navegación
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Cambiar vista - buscar TODAS las vistas dinámicamente cada vez
            const allViews = document.querySelectorAll('.view');
            allViews.forEach(view => view.classList.remove('active'));

            const targetView = document.getElementById(`${viewName}-view`);
            if (targetView) {
                targetView.classList.add('active');
            }

            AppState.currentView = viewName;
        });
    });
}

function updateServerStatus(connected) {
    const statusIndicator = document.getElementById('serverStatus');
    if (connected) {
        statusIndicator.classList.add('connected');
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i><span>Conectado</span>';
    } else {
        statusIndicator.classList.remove('connected');
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i><span>Desconectado</span>';
    }
}

function showNotification(message, type = 'info') {
    // Crear notificación toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Errores a la izquierda con 10 segundos, otros a la derecha con 3 segundos
    const isError = type === 'error';
    const position = isError ? 'left: 20px;' : 'right: 20px;';
    const duration = isError ? 10000 : 3000;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        ${position}
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s;
        max-width: 400px;
        word-wrap: break-word;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('executionLog');
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-message">${message}</span>
    `;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateExecutionStatus(status) {
    const monitor = document.getElementById('executionMonitor');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    monitor.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-cog fa-spin" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>${status.message}</h3>
        </div>
    `;

    if (status.progress) {
        progressSection.style.display = 'block';
        progressFill.style.width = `${status.progress}%`;
        progressText.textContent = `${Math.round(status.progress)}%`;
    }

    addLogEntry(status.message, status.status === 'error' ? 'error' : 'info');
}

// Utilidades
function generateSelector(element) {
    const selectors = [];

    // ID Selector
    if (element.id) {
        selectors.push({ type: 'ID', value: `#${element.id}`, priority: 1 });
    }

    // Class Selector
    if (element.className && typeof element.className === 'string') {
        const classes = element.className.trim().split(/\s+/).join('.');
        if (classes) {
            selectors.push({ type: 'Class', value: `.${classes}`, priority: 2 });
        }
    }

    // Name Selector
    if (element.name) {
        selectors.push({ type: 'Name', value: `[name="${element.name}"]`, priority: 3 });
    }

    // Tag + nth-child
    const parent = element.parentElement;
    if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        selectors.push({
            type: 'nth-child',
            value: `${element.tagName.toLowerCase()}:nth-child(${index})`,
            priority: 4
        });
    }

    // XPath
    const xpath = getXPath(element);
    selectors.push({ type: 'XPath', value: xpath, priority: 5 });

    return selectors.sort((a, b) => a.priority - b.priority);
}

function getXPath(element) {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }

    if (element === document.body) {
        return '/html/body';
    }

    let ix = 0;
    const siblings = element.parentNode.childNodes;

    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }

        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
