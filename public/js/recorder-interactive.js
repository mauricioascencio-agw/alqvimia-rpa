// Sistema de Grabación Interactivo - Pregunta por cada acción
const InteractiveRecorder = {
    recording: false,
    paused: false,
    actions: [],
    recordingWindow: null,
    captureMode: 'interactive', // 'interactive' o 'automatic'

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
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
    },

    startRecording() {
        this.recording = true;
        this.paused = false;
        this.actions = [];

        // Actualizar UI
        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
        document.getElementById('pauseRecording').disabled = false;

        const status = document.getElementById('recordingStatus');
        status.classList.add('active');
        status.innerHTML = '<i class="fas fa-circle"></i><span>Grabando Interactivo...</span>';

        // Abrir ventana
        this.openInteractiveWindow();

        showNotification('🎯 Modo Interactivo: Haz click en elementos y configura cada acción', 'success');
    },

    openInteractiveWindow() {
        const url = prompt(
            '🌐 URL DE LA PÁGINA A AUTOMATIZAR\n\n' +
            'Ingresa la URL completa:\n' +
            '(Ejemplo: https://www.google.com)',
            'https://www.google.com'
        );

        if (!url) {
            this.stopRecording();
            return;
        }

        // Agregar navegación inicial
        this.addNavigateAction(url);

        // Abrir ventana
        this.recordingWindow = window.open(url, 'InteractiveRecorder', 'width=1200,height=800');

        if (!this.recordingWindow) {
            showNotification('❌ Error: Permite ventanas emergentes en tu navegador', 'error');
            this.stopRecording();
            return;
        }

        // Esperar a que cargue e inyectar
        const checkLoad = setInterval(() => {
            try {
                if (this.recordingWindow.document.readyState === 'complete') {
                    clearInterval(checkLoad);
                    this.injectInteractiveScript();
                }
            } catch (e) {
                clearInterval(checkLoad);
                showNotification('⚠️ Página externa - Usa modo manual', 'warning');
                this.showManualCaptureInstructions();
            }
        }, 100);
    },

    injectInteractiveScript() {
        if (!this.recordingWindow) return;

        const doc = this.recordingWindow.document;

        // Crear indicador
        const indicator = doc.createElement('div');
        indicator.id = 'interactive-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-weight: bold;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            font-size: 14px;
        `;
        indicator.innerHTML = `
            <span style="width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></span>
            <span>🎯 MODO INTERACTIVO</span>
            <span id="action-counter" style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 15px; font-size: 12px;">${this.actions.length}</span>
        `;

        // Estilos
        const style = doc.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            .rpa-highlight {
                outline: 3px solid #10b981 !important;
                outline-offset: 2px;
                background: rgba(16, 185, 129, 0.1) !important;
                cursor: pointer !important;
            }
        `;

        doc.head.appendChild(style);
        doc.body.appendChild(indicator);

        // Capturar eventos
        this.setupInteractiveCapture(doc);

        console.log('✅ Sistema Interactivo activado');
    },

    setupInteractiveCapture(doc) {
        // Hover para highlight
        doc.addEventListener('mouseover', (e) => {
            if (this.paused) return;
            const element = e.target;
            if (element.id !== 'interactive-indicator' && !element.closest('#interactive-indicator')) {
                element.classList.add('rpa-highlight');
            }
        }, true);

        doc.addEventListener('mouseout', (e) => {
            const element = e.target;
            element.classList.remove('rpa-highlight');
        }, true);

        // Click para capturar
        doc.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (this.paused) return;

            const element = e.target;
            if (element.id === 'interactive-indicator' || element.closest('#interactive-indicator')) {
                return;
            }

            // Capturar elemento
            this.captureElement(element);

        }, true);

        console.log('👆 Haz click en elementos para capturarlos');
    },

    captureElement(element) {
        // Analizar elemento
        const elementInfo = this.analyzeElement(element);

        // Volver a ventana principal
        window.focus();

        // Mostrar diálogo de configuración
        setTimeout(() => {
            this.showElementConfigDialog(elementInfo);
        }, 100);
    },

    analyzeElement(element) {
        const selectors = typeof generateSelector === 'function' ? generateSelector(element) : [{value: element.tagName.toLowerCase()}];

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
            isImage: element.tagName === 'IMG' || element.tagName === 'CANVAS',
            isInput: element.tagName === 'INPUT' || element.tagName === 'TEXTAREA',
            isButton: element.tagName === 'BUTTON' || element.type === 'button' || element.type === 'submit',
            isLink: element.tagName === 'A',
            isSelect: element.tagName === 'SELECT',
            selector: selectors[0]?.value || element.tagName.toLowerCase(),
            allSelectors: selectors,
            backgroundImage: element.style.backgroundImage || window.getComputedStyle(element).backgroundImage
        };
    },

    showElementConfigDialog(info) {
        const modal = document.getElementById('actionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        // Determinar tipo sugerido
        let suggestedType = 'click';
        if (info.isInput) suggestedType = 'type';
        if (info.isSelect) suggestedType = 'select';

        // Determinar si es imagen
        const isImage = info.isImage || info.src || (info.backgroundImage && info.backgroundImage !== 'none');

        modalTitle.innerHTML = `📋 Configurar Acción: <span style="color: #10b981;">${info.tag.toUpperCase()}</span>`;

        modalBody.innerHTML = `
            <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #10b981;">
                    ${isImage ? '🖼️ IMAGEN DETECTADA' : '🎯 ELEMENTO WEB'}
                </h4>
                <div style="font-size: 13px; line-height: 1.6; color: #cbd5e1;">
                    <div><strong>Tag:</strong> &lt;${info.tag}&gt;</div>
                    ${info.id ? `<div><strong>ID:</strong> ${info.id}</div>` : ''}
                    ${info.className ? `<div><strong>Clase:</strong> ${info.className}</div>` : ''}
                    ${info.text ? `<div><strong>Texto:</strong> "${info.text.substring(0, 50)}${info.text.length > 50 ? '...' : ''}"</div>` : ''}
                    ${info.src ? `<div><strong>Imagen:</strong> ${info.src.substring(0, 60)}...</div>` : ''}
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">🎬 Tipo de Acción:</label>
                <select id="config-action-type" style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 14px;">
                    <option value="click" ${suggestedType === 'click' ? 'selected' : ''}>🖱️ CLICK - Hacer click</option>
                    <option value="type" ${suggestedType === 'type' ? 'selected' : ''}>⌨️ TYPE - Escribir texto</option>
                    <option value="extract" >📥 EXTRACT - Extraer texto</option>
                    <option value="screenshot">📸 SCREENSHOT - Capturar imagen</option>
                    <option value="hover">👆 HOVER - Pasar mouse</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">🏷️ Nombre de la Variable:</label>
                <input type="text" id="config-var-name" placeholder="Ej: btnLogin, txtUsuario, imgLogo" style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;" value="${this.generateVarName(info)}">
                <small style="color: #94a3b8; font-size: 12px;">Este nombre te ayudará a identificar el elemento</small>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">🎯 Selector CSS:</label>
                <select id="config-selector" style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 13px; font-family: 'Courier New', monospace;">
                    ${info.allSelectors.map((s, i) => `
                        <option value="${s.value}" ${i === 0 ? 'selected' : ''}>
                            ${s.type}: ${s.value}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div id="type-text-group" style="display: none; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">⌨️ Texto a Escribir:</label>
                <input type="text" id="config-text" placeholder="Ingresa el texto..." style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
                <div style="margin-top: 8px;">
                    <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="config-keystroke">
                        <span>Simular keystrokes (Enter, Tab, etc.)</span>
                    </label>
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">⏱️ Delay (ms):</label>
                <input type="number" id="config-delay" value="500" min="0" step="100" style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
                <small style="color: #94a3b8; font-size: 12px;">Tiempo de espera después de esta acción (milisegundos)</small>
            </div>

            <div class="form-group">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">📝 Notas / Descripción:</label>
                <textarea id="config-notes" placeholder="Descripción opcional de esta acción..." style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; min-height: 60px; resize: vertical;"></textarea>
            </div>
        `;

        // Mostrar/ocultar campo de texto según tipo
        const actionTypeSelect = document.getElementById('config-action-type');
        const typeTextGroup = document.getElementById('type-text-group');

        actionTypeSelect.addEventListener('change', () => {
            typeTextGroup.style.display = actionTypeSelect.value === 'type' ? 'block' : 'none';
        });

        if (suggestedType === 'type') {
            typeTextGroup.style.display = 'block';
        }

        modal.classList.add('active');

        // Botones
        document.getElementById('confirmAction').onclick = () => {
            const actionConfig = {
                type: document.getElementById('config-action-type').value,
                varName: document.getElementById('config-var-name').value.trim() || 'elemento',
                selector: document.getElementById('config-selector').value,
                delay: parseInt(document.getElementById('config-delay').value) || 500,
                notes: document.getElementById('config-notes').value.trim(),
                element: {
                    ...info,
                    isImage: isImage
                },
                timestamp: Date.now()
            };

            // Agregar campos específicos según tipo
            if (actionConfig.type === 'type') {
                actionConfig.text = document.getElementById('config-text').value;
                actionConfig.keystroke = document.getElementById('config-keystroke').checked;
            }

            this.actions.push(actionConfig);
            this.updateActionsList();
            this.updateCounter();

            modal.classList.remove('active');

            showNotification(`✅ Acción agregada: ${actionConfig.varName} (${actionConfig.type})`, 'success');

            // Volver a ventana de grabación
            if (this.recordingWindow && !this.recordingWindow.closed) {
                this.recordingWindow.focus();
            }
        };

        document.getElementById('cancelAction').onclick = () => {
            modal.classList.remove('active');
            if (this.recordingWindow && !this.recordingWindow.closed) {
                this.recordingWindow.focus();
            }
        };

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
            if (this.recordingWindow && !this.recordingWindow.closed) {
                this.recordingWindow.focus();
            }
        };
    },

    generateVarName(info) {
        let prefix = '';

        if (info.isButton) prefix = 'btn';
        else if (info.isInput) prefix = 'txt';
        else if (info.isImage) prefix = 'img';
        else if (info.isLink) prefix = 'lnk';
        else if (info.isSelect) prefix = 'sel';
        else prefix = 'elem';

        // Intentar usar ID, clase o texto
        let name = info.id || info.className.split(' ')[0] || info.text.substring(0, 20).replace(/\s+/g, '');

        // Limpiar nombre
        name = name.replace(/[^a-zA-Z0-9]/g, '');

        if (!name) {
            name = info.tag + (this.actions.length + 1);
        }

        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
    },

    updateCounter() {
        document.getElementById('actionCount').textContent = `(${this.actions.length})`;

        if (this.recordingWindow && !this.recordingWindow.closed) {
            try {
                const counter = this.recordingWindow.document.getElementById('action-counter');
                if (counter) {
                    counter.textContent = this.actions.length;
                    counter.style.animation = 'none';
                    setTimeout(() => {
                        counter.style.animation = 'pulse 0.5s';
                    }, 10);
                }
            } catch (e) {}
        }
    },

    updateActionsList() {
        const listContainer = document.getElementById('recordedActionsList');

        if (this.actions.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-video-slash"></i>
                    <p>No hay acciones grabadas</p>
                    <small>Haz click en elementos de la página para capturarlos</small>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';

        this.actions.forEach((action, index) => {
            const item = document.createElement('div');
            item.className = 'action-item newly-added';
            item.setAttribute('data-type', action.type);

            if (action.element && action.element.isImage) {
                item.classList.add('has-image');
            }

            const iconMap = {
                click: 'fa-mouse-pointer',
                type: 'fa-keyboard',
                navigate: 'fa-globe',
                extract: 'fa-download',
                screenshot: 'fa-camera',
                hover: 'fa-hand-pointer'
            };

            const imageBadge = (action.element && action.element.isImage) ? '<span class="image-badge">🖼️ IMAGEN</span>' : '';

            item.innerHTML = `
                <div class="action-info">
                    <div class="action-icon">
                        <i class="fas ${iconMap[action.type] || 'fa-cog'}"></i>
                    </div>
                    <div class="action-details">
                        <h4>${action.varName} ${imageBadge}</h4>
                        <p>${this.getActionDescription(action)}</p>
                        ${action.notes ? `<small style="color: #94a3b8; font-size: 11px;">💬 ${action.notes}</small>` : ''}
                    </div>
                </div>
                <div class="action-actions">
                    <button onclick="InteractiveRecorder.editAction(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="InteractiveRecorder.deleteAction(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            setTimeout(() => {
                item.classList.remove('newly-added');
            }, 500);

            listContainer.appendChild(item);
        });
    },

    getActionDescription(action) {
        let desc = `${action.type.toUpperCase()}: ${action.selector}`;

        if (action.type === 'type') {
            desc = `⌨️ Escribir: "${action.text}" ${action.keystroke ? '+ Keystroke' : ''}`;
        } else if (action.type === 'navigate') {
            desc = `🌐 Ir a: ${action.url}`;
        } else if (action.element && action.element.isImage) {
            desc = `🖼️ ${action.type} en imagen`;
        }

        desc += ` • Delay: ${action.delay}ms`;

        return desc;
    },

    addNavigateAction(url) {
        this.actions.push({
            type: 'navigate',
            varName: 'navegacion' + (this.actions.length + 1),
            url: url,
            delay: 2000,
            notes: 'Navegación inicial',
            timestamp: Date.now()
        });
        this.updateActionsList();
        this.updateCounter();
    },

    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('pauseRecording');
        const status = document.getElementById('recordingStatus');

        if (this.paused) {
            btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            status.innerHTML = '<i class="fas fa-pause"></i><span>Pausado</span>';
            showNotification('⏸️ Grabación pausada', 'info');
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            status.innerHTML = '<i class="fas fa-circle"></i><span>Grabando Interactivo...</span>';
            status.classList.add('active');
            showNotification('▶️ Grabación reanudada', 'success');
        }
    },

    stopRecording() {
        this.recording = false;
        this.paused = false;

        if (this.recordingWindow && !this.recordingWindow.closed) {
            this.recordingWindow.close();
        }

        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
        document.getElementById('pauseRecording').disabled = true;
        document.getElementById('saveRecording').disabled = false;
        document.getElementById('clearRecording').disabled = false;

        const status = document.getElementById('recordingStatus');
        status.classList.remove('active');
        status.innerHTML = '<i class="fas fa-check-circle"></i><span>Grabación completada</span>';

        showNotification(`✅ Grabación finalizada - ${this.actions.length} acciones capturadas`, 'success');
    },

    saveRecording() {
        if (this.actions.length === 0) {
            showNotification('❌ No hay acciones para guardar', 'error');
            return;
        }

        const name = prompt(
            `💾 GUARDAR WORKFLOW\n\n` +
            `Ingresa un nombre descriptivo:\n` +
            `(${this.actions.length} acciones capturadas)`,
            `Workflow ${new Date().toLocaleDateString()}`
        );

        if (!name) return;

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
                    showNotification(`✅ Workflow "${name}" guardado exitosamente`, 'success');
                    this.clearRecording();

                    if (typeof Library !== 'undefined') {
                        Library.loadWorkflows();
                    }
                } else {
                    showNotification('❌ Error al guardar workflow', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('❌ Error de conexión', 'error');
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

        showNotification('🗑️ Acciones limpiadas', 'info');
    },

    editAction(index) {
        const action = this.actions[index];
        // TODO: Implementar edición
        showNotification('⚠️ Edición en desarrollo - Por ahora elimina y vuelve a agregar', 'info');
    },

    deleteAction(index) {
        if (confirm(`¿Eliminar acción "${this.actions[index].varName}"?`)) {
            this.actions.splice(index, 1);
            this.updateActionsList();
            this.updateCounter();
            showNotification('🗑️ Acción eliminada', 'success');
        }
    },

    showManualCaptureInstructions() {
        showNotification('💡 Página externa - Agrega acciones con el panel manual', 'warning');
        if (typeof ManualCapture !== 'undefined') {
            setTimeout(() => {
                ManualCapture.show();
            }, 1000);
        }
    }
};

// Reemplazar Recorder con InteractiveRecorder
if (typeof Recorder !== 'undefined') {
    // Guardar referencia original
    window.RecorderOriginal = Recorder;
}

// Asignar InteractiveRecorder como Recorder principal
window.Recorder = InteractiveRecorder;

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InteractiveRecorder.init());
} else {
    InteractiveRecorder.init();
}

console.log('✅ Sistema de Grabación Interactiva cargado');
