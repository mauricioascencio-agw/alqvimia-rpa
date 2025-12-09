// Recorder Module
const Recorder = {
    recording: false,
    paused: false,
    actions: [],
    recordingWindow: null,

    init() {
        document.getElementById('startRecording').addEventListener('click', () => {
            this.startRecording();
        });

        document.getElementById('stopRecording').addEventListener('click', () => {
            this.stopRecording();
        });

        document.getElementById('pauseRecording').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('saveRecording').addEventListener('click', () => {
            this.saveRecording();
        });

        document.getElementById('clearRecording').addEventListener('click', () => {
            this.clearRecording();
        });

        // Escuchar eventos del servidor
        socket.on('action-recorded', (action) => {
            this.addRecordedAction(action);
        });

        socket.on('recording-stopped', (actions) => {
            this.actions = actions;
            this.updateActionsList();
        });
    },

    startRecording() {
        this.recording = true;
        this.paused = false;
        this.actions = [];

        // Notificar al servidor
        socket.emit('start-recording');

        // Actualizar UI
        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
        document.getElementById('pauseRecording').disabled = false;

        const status = document.getElementById('recordingStatus');
        status.classList.add('active');
        status.innerHTML = '<i class="fas fa-circle"></i><span>Grabando...</span>';

        // Abrir ventana para grabar
        this.openRecordingWindow();

        showNotification('Grabación iniciada', 'success');
    },

    stopRecording() {
        this.recording = false;
        this.paused = false;

        // Notificar al servidor
        socket.emit('stop-recording');

        // Cerrar ventana de grabación si existe
        if (this.recordingWindow && !this.recordingWindow.closed) {
            this.recordingWindow.close();
        }

        // Actualizar UI
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
        document.getElementById('pauseRecording').disabled = true;
        document.getElementById('saveRecording').disabled = false;
        document.getElementById('clearRecording').disabled = false;

        const status = document.getElementById('recordingStatus');
        status.classList.remove('active');
        status.innerHTML = '<i class="fas fa-check-circle"></i><span>Grabación completada</span>';

        showNotification(`Grabación detenida - ${this.actions.length} acciones capturadas`, 'success');
    },

    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('pauseRecording');
        const status = document.getElementById('recordingStatus');

        if (this.paused) {
            btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            status.innerHTML = '<i class="fas fa-pause"></i><span>Pausado</span>';
            showNotification('Grabación pausada', 'info');
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            status.innerHTML = '<i class="fas fa-circle"></i><span>Grabando...</span>';
            status.classList.add('active');
            showNotification('Grabación reanudada', 'success');
        }
    },

    openRecordingWindow() {
        const url = prompt('Ingresa la URL para comenzar a grabar:', 'https://www.google.com');
        if (!url) {
            this.stopRecording();
            return;
        }

        this.recordingWindow = window.open(url, 'RecordingWindow', 'width=1200,height=800');

        if (!this.recordingWindow) {
            showNotification('Error: Permitir ventanas emergentes', 'error');
            this.stopRecording();
            return;
        }

        // Intentar inyectar script de grabación
        const checkLoad = setInterval(() => {
            try {
                if (this.recordingWindow.document.readyState === 'complete') {
                    clearInterval(checkLoad);
                    this.injectRecordingScript();
                }
            } catch (e) {
                clearInterval(checkLoad);
                showNotification('Modo manual: Captura acciones manualmente', 'warning');
            }
        }, 100);
    },

    injectRecordingScript() {
        if (!this.recordingWindow) return;

        const doc = this.recordingWindow.document;

        // Crear overlay indicador mejorado
        const indicator = doc.createElement('div');
        indicator.id = 'rpa-recorder-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-weight: bold;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-size: 14px;
        `;
        indicator.innerHTML = `
            <span style="width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></span>
            <span>🎥 GRABANDO</span>
            <span id="rpa-action-count" style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 15px; font-size: 12px;">0</span>
        `;

        // Agregar animación
        const style = doc.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        doc.head.appendChild(style);
        doc.body.appendChild(indicator);

        // Capturar eventos
        this.captureEvents(doc);
    },

    captureEvents(doc) {
        // Crear highlight temporal para clicks
        const createClickHighlight = (x, y) => {
            const highlight = doc.createElement('div');
            highlight.style.cssText = `
                position: fixed;
                left: ${x - 15}px;
                top: ${y - 15}px;
                width: 30px;
                height: 30px;
                border: 3px solid #ef4444;
                border-radius: 50%;
                background: rgba(239, 68, 68, 0.2);
                pointer-events: none;
                z-index: 99999999;
                animation: clickPulse 0.6s ease-out;
            `;

            const style = doc.createElement('style');
            style.textContent = `
                @keyframes clickPulse {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `;

            if (!doc.querySelector('#clickPulseStyle')) {
                style.id = 'clickPulseStyle';
                doc.head.appendChild(style);
            }

            doc.body.appendChild(highlight);
            setTimeout(() => highlight.remove(), 600);
        };

        // Capturar TODOS los clicks con feedback visual
        doc.addEventListener('click', (e) => {
            if (this.paused) return;

            const element = e.target;
            const selectors = generateSelector(element);

            // Crear highlight visual
            createClickHighlight(e.clientX, e.clientY);

            // Capturar screenshot del elemento si es imagen
            let isImage = false;
            let imageSrc = '';

            if (element.tagName === 'IMG') {
                isImage = true;
                imageSrc = element.src;
            } else if (element.tagName === 'CANVAS') {
                isImage = true;
                imageSrc = 'canvas';
            } else if (window.getComputedStyle(element).backgroundImage !== 'none') {
                isImage = true;
                imageSrc = window.getComputedStyle(element).backgroundImage;
            }

            const action = {
                type: 'click',
                selector: selectors[0].value,
                element: {
                    tag: element.tagName.toLowerCase(),
                    text: element.textContent.substring(0, 50),
                    isImage: isImage,
                    imageSrc: imageSrc,
                    innerHTML: element.innerHTML.substring(0, 100),
                    classList: Array.from(element.classList),
                    id: element.id || ''
                },
                position: {
                    x: e.clientX,
                    y: e.clientY
                },
                timestamp: Date.now()
            };

            console.log('✅ CLICK CAPTURADO:', action);
            this.addRecordedAction(action);
            this.showCaptureNotification('Click capturado', element);
        }, true);

        // Capturar mousedown para mejor detección
        doc.addEventListener('mousedown', (e) => {
            if (this.paused) return;
            console.log('🖱️ MOUSEDOWN detectado en:', e.target.tagName);
        }, true);

        // Capturar todos los tipos de input
        doc.addEventListener('input', (e) => {
            if (this.paused) return;

            const element = e.target;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                const selectors = generateSelector(element);

                const action = {
                    type: element.tagName === 'SELECT' ? 'select' : 'type',
                    selector: selectors[0].value,
                    text: element.value,
                    element: {
                        tag: element.tagName.toLowerCase(),
                        name: element.name || '',
                        type: element.type || '',
                        placeholder: element.placeholder || ''
                    },
                    timestamp: Date.now()
                };

                // Evitar duplicados rápidos del mismo campo
                const lastAction = this.actions[this.actions.length - 1];
                if (!lastAction || lastAction.selector !== action.selector ||
                    Date.now() - lastAction.timestamp > 1000) {
                    console.log('✅ INPUT CAPTURADO:', action);
                    this.addRecordedAction(action);
                    this.showCaptureNotification('Texto capturado', element);
                }
            }
        });

        // Capturar cambios en select
        doc.addEventListener('change', (e) => {
            if (this.paused) return;

            const element = e.target;
            if (element.tagName === 'SELECT') {
                const selectors = generateSelector(element);

                const action = {
                    type: 'select',
                    selector: selectors[0].value,
                    value: element.value,
                    text: element.options[element.selectedIndex]?.text || '',
                    element: {
                        tag: 'select',
                        name: element.name || ''
                    },
                    timestamp: Date.now()
                };

                console.log('✅ SELECT CAPTURADO:', action);
                this.addRecordedAction(action);
                this.showCaptureNotification('Selección capturada', element);
            }
        });

        // Detectar imágenes cargadas
        const detectImages = () => {
            const images = doc.querySelectorAll('img[src]');
            console.log(`🖼️ Imágenes detectadas en página: ${images.length}`);

            images.forEach((img, index) => {
                // Marcar imágenes detectadas
                if (!img.dataset.rpaDetected) {
                    img.dataset.rpaDetected = 'true';
                    img.style.outline = '2px dashed #10b981';

                    setTimeout(() => {
                        img.style.outline = '';
                    }, 2000);
                }
            });
        };

        // Ejecutar detección de imágenes
        setTimeout(detectImages, 1000);
        setInterval(detectImages, 5000);

        // Capturar navegación
        let lastUrl = this.recordingWindow.location.href;
        setInterval(() => {
            try {
                const currentUrl = this.recordingWindow.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    const action = {
                        type: 'navigate',
                        url: currentUrl,
                        timestamp: Date.now()
                    };
                    console.log('✅ NAVEGACIÓN CAPTURADA:', action);
                    this.addRecordedAction(action);
                    this.showCaptureNotification('Navegación capturada', null);
                }
            } catch (e) {
                // Ignorar errores de CORS
            }
        }, 500);

        // Capturar scroll
        let scrollTimeout;
        doc.addEventListener('scroll', () => {
            if (this.paused) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const action = {
                    type: 'scroll',
                    x: window.scrollX || doc.documentElement.scrollLeft,
                    y: window.scrollY || doc.documentElement.scrollTop,
                    timestamp: Date.now()
                };
                console.log('✅ SCROLL CAPTURADO:', action);
                this.addRecordedAction(action);
            }, 500);
        }, true);

        console.log('🎯 Sistema de captura activado. Listo para grabar TODOS los eventos.');
    },

    showCaptureNotification(message, element) {
        // Actualizar contador en tiempo real en la ventana principal
        const count = document.getElementById('actionCount');
        if (count) {
            count.textContent = `(${this.actions.length})`;
            count.style.animation = 'none';
            setTimeout(() => {
                count.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
        }

        // Actualizar contador en la ventana de grabación
        if (this.recordingWindow && !this.recordingWindow.closed) {
            try {
                const recordingCount = this.recordingWindow.document.getElementById('rpa-action-count');
                if (recordingCount) {
                    recordingCount.textContent = this.actions.length;
                    recordingCount.style.transform = 'scale(1.3)';
                    recordingCount.style.background = 'rgba(16, 185, 129, 0.4)';
                    setTimeout(() => {
                        recordingCount.style.transform = 'scale(1)';
                        recordingCount.style.background = 'rgba(255, 255, 255, 0.2)';
                    }, 300);
                }
            } catch (e) {
                // Ignorar errores de acceso
            }
        }

        // Mostrar notificación temporal en la ventana principal
        showNotification(`📹 ${message} (${this.actions.length})`, 'success');

        // Log en consola
        console.log(`📹 ${message} - Total: ${this.actions.length}`, element);
    },

    addRecordedAction(action) {
        this.actions.push(action);
        this.updateActionsList();
        document.getElementById('actionCount').textContent = `(${this.actions.length})`;
    },

    updateActionsList() {
        const listContainer = document.getElementById('recordedActionsList');

        if (this.actions.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-video-slash"></i>
                    <p>No hay acciones grabadas</p>
                    <small>Inicia la grabación para capturar acciones</small>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';

        this.actions.forEach((action, index) => {
            const item = document.createElement('div');
            item.className = 'action-item newly-added';
            item.setAttribute('data-type', action.type);

            // Agregar clase especial si es una imagen
            if (action.element && action.element.isImage) {
                item.classList.add('has-image');
            }

            const iconMap = {
                click: 'fa-mouse-pointer',
                type: 'fa-keyboard',
                navigate: 'fa-globe',
                wait: 'fa-clock',
                extract: 'fa-download',
                scroll: 'fa-arrows-alt-v',
                select: 'fa-list'
            };

            // Badge de imagen si aplica
            const imageBadge = (action.element && action.element.isImage) ?
                '<span class="image-badge">IMAGEN</span>' : '';

            item.innerHTML = `
                <div class="action-info">
                    <div class="action-icon">
                        <i class="fas ${iconMap[action.type] || 'fa-cog'}"></i>
                    </div>
                    <div class="action-details">
                        <h4>${action.type.toUpperCase()}${imageBadge}</h4>
                        <p>${this.getActionDescription(action)}</p>
                    </div>
                </div>
                <div class="action-actions">
                    <button onclick="Recorder.editAction(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="Recorder.deleteAction(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Remover clase de animación después de un tiempo
            setTimeout(() => {
                item.classList.remove('newly-added');
            }, 500);

            listContainer.appendChild(item);
        });
    },

    getActionDescription(action) {
        switch (action.type) {
            case 'click':
                if (action.element && action.element.isImage) {
                    return `🖼️ Click en IMAGEN: ${action.element.imageSrc ? action.element.imageSrc.substring(0, 60) + '...' : action.selector}`;
                }
                const elemInfo = action.element ? `<${action.element.tag}> ${action.element.text ? '"' + action.element.text.substring(0, 30) + '..."' : ''}` : '';
                return `Click en: ${elemInfo || action.selector}`;
            case 'type':
                return `⌨️ Escribir: "${action.text}" en ${action.selector}`;
            case 'select':
                return `📋 Seleccionar: "${action.text}" en ${action.selector}`;
            case 'navigate':
                return `🌐 Navegar a: ${action.url}`;
            case 'scroll':
                return `📜 Scroll a posición: X=${action.x}, Y=${action.y}`;
            case 'wait':
                return `⏱️ Esperar ${action.duration}ms`;
            case 'extract':
                return `📥 Extraer de: ${action.selector}`;
            default:
                return action.selector || 'Sin descripción';
        }
    },

    editAction(index) {
        showNotification('Edición de acciones próximamente', 'info');
    },

    deleteAction(index) {
        if (confirm('¿Eliminar esta acción?')) {
            this.actions.splice(index, 1);
            this.updateActionsList();
            document.getElementById('actionCount').textContent = `(${this.actions.length})`;
            showNotification('Acción eliminada', 'success');
        }
    },

    saveRecording() {
        if (this.actions.length === 0) {
            showNotification('No hay acciones para guardar', 'error');
            return;
        }

        const name = prompt('Nombre del workflow:', `Workflow ${new Date().toLocaleDateString()}`);
        if (!name) return;

        // Guardar en el servidor
        fetch('http://localhost:3000/api/workflows/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                workflow: this.actions
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Workflow guardado exitosamente', 'success');
                    this.clearRecording();

                    // Actualizar biblioteca
                    if (typeof Library !== 'undefined') {
                        Library.loadWorkflows();
                    }
                } else {
                    showNotification('Error al guardar workflow', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión', 'error');
            });
    },

    clearRecording() {
        if (this.actions.length > 0 && !confirm('¿Limpiar todas las acciones grabadas?')) {
            return;
        }

        this.actions = [];
        this.updateActionsList();
        document.getElementById('actionCount').textContent = '(0)';
        document.getElementById('saveRecording').disabled = true;
        document.getElementById('clearRecording').disabled = true;

        const status = document.getElementById('recordingStatus');
        status.innerHTML = '<i class="fas fa-info-circle"></i><span>Listo para grabar</span>';

        showNotification('Acciones limpiadas', 'info');
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Recorder.init());
} else {
    Recorder.init();
}
