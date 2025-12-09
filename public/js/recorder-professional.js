// Sistema Profesional de Grabación RPA - Estilo Alqvimia
const ProfessionalRecorder = {
    recording: false,
    paused: false,
    actions: [],
    recordingWindow: null,
    projectFolder: '',
    projectName: '',
    capturedImages: [],
    capturedObjects: [],
    eventLogs: [], // 📋 NUEVO: Array para guardar TODOS los eventos detectados

    init() {
        this.setupEventListeners();
    },

    // 📋 NUEVO: Función para agregar log de eventos
    addEventLog(eventType, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            timestampMs: Date.now(),
            eventType: eventType,
            details: details,
            windowState: this.getWindowState()
        };

        this.eventLogs.push(logEntry);
        console.log(`📋 LOG [${eventType}]:`, logEntry);

        // Limitar a últimos 1000 eventos para no consumir mucha memoria
        if (this.eventLogs.length > 1000) {
            this.eventLogs.shift();
        }
    },

    // 📋 NUEVO: Obtener estado de la ventana
    getWindowState() {
        if (!this.recordingWindow || this.recordingWindow.closed) {
            return { status: 'closed' };
        }

        try {
            return {
                status: 'open',
                outerWidth: this.recordingWindow.outerWidth,
                outerHeight: this.recordingWindow.outerHeight,
                innerWidth: this.recordingWindow.innerWidth,
                innerHeight: this.recordingWindow.innerHeight,
                screenX: this.recordingWindow.screenX,
                screenY: this.recordingWindow.screenY,
                scrollX: this.recordingWindow.scrollX,
                scrollY: this.recordingWindow.scrollY,
                url: this.recordingWindow.location.href,
                focused: this.recordingWindow.document.hasFocus()
            };
        } catch (e) {
            return { status: 'error', error: e.message };
        }
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

    async startRecording() {
        // PASO 1: Preguntar carpeta y nombre del proyecto
        const projectConfig = await this.askProjectConfig();
        if (!projectConfig) return;

        this.projectName = projectConfig.name;
        this.projectFolder = projectConfig.folder;
        this.recording = true;
        this.paused = false;
        this.actions = [];
        this.capturedImages = [];
        this.capturedObjects = [];

        // Actualizar UI
        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
        document.getElementById('pauseRecording').disabled = false;

        const status = document.getElementById('recordingStatus');
        status.classList.add('active');
        status.innerHTML = `<i class="fas fa-circle"></i><span>Grabando: ${this.projectName}</span>`;

        showNotification(`🎬 Proyecto: ${this.projectName}`, 'success');

        // PASO 2: Preguntar URL inicial
        this.openRecordingWindow();
    },

    askProjectConfig() {
        return new Promise((resolve) => {
            const modal = document.getElementById('actionModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            modalTitle.innerHTML = '🗂️ Configurar Proyecto de Automatización';

            modalBody.innerHTML = `
                <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center; color: white;">
                    <h3 style="margin: 0 0 10px 0;">🚀 Nuevo Proyecto RPA</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Crea un proyecto profesional con estructura organizada</p>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                        🌐 Navegador a Usar:
                    </label>
                    <select id="browser-type" style="width: 100%; padding: 12px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; color: white; font-size: 14px;">
                        <option value="current" selected>🌐 Navegador Actual (Limitado por CSP en sitios externos)</option>
                        <option value="chrome">🟢 Google Chrome (Recomendado - Requiere extensión)</option>
                        <option value="edge">🔵 Microsoft Edge (Requiere extensión)</option>
                        <option value="firefox">🟠 Mozilla Firefox (Requiere extensión)</option>
                    </select>
                    <small style="color: #94a3b8; font-size: 12px; display: block; margin-top: 5px;">
                        ⚠️ Sitios como Google/Facebook bloquean script injection. Usa extensión para soporte completo.
                    </small>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                        📁 Carpeta del Proyecto:
                    </label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="project-folder" placeholder="Ej: C:\\Proyectos\\AutomacionGoogle"
                            style="flex: 1; padding: 12px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; color: white; font-size: 14px;"
                            value="C:\\Dev\\aagw\\OCR\\workflows">
                        <button type="button" id="browse-folder" style="padding: 12px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; font-size: 14px; white-space: nowrap;">
                            📂 Explorar
                        </button>
                    </div>
                    <small style="color: #94a3b8; font-size: 12px; display: block; margin-top: 5px;">
                        Se creará la estructura de carpetas automáticamente
                    </small>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                        🏷️ Nombre del Proyecto:
                    </label>
                    <input type="text" id="project-name" placeholder="Ej: BusquedaGoogle, LoginSistema, ProcesoFacturas"
                        style="width: 100%; padding: 12px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; color: white; font-size: 14px;"
                        value="Proyecto_${Date.now()}">
                    <small style="color: #94a3b8; font-size: 12px; display: block; margin-top: 5px;">
                        Usa nombres descriptivos sin espacios (usa guiones bajos)
                    </small>
                </div>

                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <h4 style="margin: 0 0 10px 0; color: #10b981; font-size: 14px;">📂 Estructura que se creará:</h4>
                    <pre style="margin: 0; font-size: 12px; color: #cbd5e1; font-family: 'Courier New', monospace; line-height: 1.6;">
[Carpeta]/
└── [Nombre]/
    ├── main.json          (Workflow principal)
    ├── config.json        (Configuración)
    ├── images/            (Imágenes capturadas)
    ├── objects/           (Objetos identificados)
    ├── screenshots/       (Capturas de pantalla)
    └── logs/              (Logs de eventos)
        ├── events.json    (Todos los eventos)
        ├── events.log     (Logs legibles)
        └── summary.json   (Resumen de eventos)
                    </pre>
                </div>
            `;

            modal.classList.add('active');

            // Folder picker functionality
            document.getElementById('browse-folder').onclick = async () => {
                try {
                    // Check if File System Access API is available
                    if ('showDirectoryPicker' in window) {
                        const dirHandle = await window.showDirectoryPicker();
                        // Note: Can't get full path in browser for security, but we can show name
                        document.getElementById('project-folder').value = dirHandle.name;
                        showNotification('📂 Carpeta seleccionada: ' + dirHandle.name, 'success');
                    } else {
                        // Fallback: just show message
                        showNotification('⚠️ Por favor ingresa la ruta manualmente', 'info');
                        document.getElementById('project-folder').focus();
                    }
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Error selecting folder:', err);
                        showNotification('⚠️ Por favor ingresa la ruta manualmente', 'info');
                    }
                }
            };

            document.getElementById('confirmAction').onclick = () => {
                const folder = document.getElementById('project-folder').value.trim();
                const name = document.getElementById('project-name').value.trim();
                const browser = document.getElementById('browser-type').value;

                if (!folder || !name) {
                    showNotification('❌ Por favor completa todos los campos', 'error');
                    return;
                }

                // Show warning if browser extension is needed
                if (browser !== 'current') {
                    showNotification(`⚠️ ${browser.toUpperCase()}: Extensión requerida para sitios externos`, 'warning');
                }

                modal.classList.remove('active');
                resolve({ folder, name, browser });
            };

            document.getElementById('cancelAction').onclick = () => {
                modal.classList.remove('active');
                resolve(null);
            };

            document.getElementById('closeModal').onclick = () => {
                modal.classList.remove('active');
                resolve(null);
            };
        });
    },

    openRecordingWindow() {
        const url = prompt(
            `🌐 URL INICIAL DEL FLUJO\n\n` +
            `Proyecto: ${this.projectName}\n\n` +
            `Ingresa la URL donde comenzará la automatización:`,
            'https://www.google.com'
        );

        if (!url) {
            this.stopRecording();
            return;
        }

        // Crear acción de navegación inicial
        this.askNavigationDetails(url, true);

        // Abrir ventana
        this.recordingWindow = window.open(url, 'RPARecorder', 'width=1200,height=800');

        if (!this.recordingWindow) {
            showNotification('❌ Error: Permite ventanas emergentes', 'error');
            this.stopRecording();
            return;
        }

        // Inyectar sistema de captura
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos

        const checkLoad = setInterval(() => {
            attempts++;

            try {
                if (this.recordingWindow.document.readyState === 'complete') {
                    clearInterval(checkLoad);

                    // Intentar inyectar sistema
                    try {
                        this.injectCaptureSystem();
                        this.addEventLog('INJECTION_SUCCESS', {
                            url: this.recordingWindow.location.href,
                            attempts: attempts
                        });
                        showNotification('✅ Sistema de captura activado', 'success');
                    } catch (injectError) {
                        this.addEventLog('INJECTION_FAILED', {
                            url: this.recordingWindow.location.href,
                            error: injectError.message,
                            reason: 'CSP o CORS bloqueó la inyección'
                        });

                        this.showCSPWarning();
                    }
                }
            } catch (e) {
                clearInterval(checkLoad);
                this.addEventLog('PAGE_ACCESS_BLOCKED', {
                    error: e.message,
                    reason: 'CORS - No se puede acceder a página externa'
                });

                this.showCSPWarning();
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkLoad);
                this.addEventLog('INJECTION_TIMEOUT', {
                    attempts: attempts,
                    reason: 'Página no cargó en tiempo esperado'
                });
            }
        }, 100);
    },

    showCSPWarning() {
        const warningHTML = `
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);">
                <h3 style="margin: 0 0 15px 0; font-size: 18px;">
                    ⚠️ PÁGINA BLOQUEADA POR SEGURIDAD (CSP/CORS)
                </h3>
                <p style="margin: 0 0 15px 0; line-height: 1.6;">
                    La página que intentas grabar tiene políticas de seguridad (Content Security Policy)
                    que impiden la inyección de scripts externos.
                </p>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">✅ LO QUE SÍ FUNCIONA:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Captura de navegación (ya se registró)</li>
                        <li>Logs de eventos del sistema</li>
                        <li>Agregar acciones manualmente</li>
                    </ul>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">❌ LO QUE NO FUNCIONA:</p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Click automático en elementos</li>
                        <li>Detección de inputs</li>
                        <li>Highlight de elementos</li>
                    </ul>
                </div>
                <div style="background: #059669; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">💡 SOLUCIONES:</p>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li><strong>Usa páginas locales o propias</strong> (sin CSP)</li>
                        <li><strong>Usa Chrome con extensión RPA</strong></li>
                        <li><strong>Agrega acciones manualmente</strong> usando el panel de captura</li>
                        <li><strong>Usa DevTools</strong> para obtener selectores y agrégalos manualmente</li>
                    </ol>
                </div>
            </div>
        `;

        showNotification('⚠️ Página bloqueada por CSP - Ver detalles en la lista', 'warning');

        // Agregar advertencia a la lista de acciones
        const listContainer = document.getElementById('recordedActionsList');
        const warningItem = document.createElement('div');
        warningItem.className = 'action-item';
        warningItem.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
        warningItem.innerHTML = warningHTML;
        listContainer.appendChild(warningItem);
    },

    askNavigationDetails(url, isInitial = false) {
        const modal = document.getElementById('actionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.innerHTML = '🌐 Configurar Navegación';

        modalBody.innerHTML = `
            <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #06b6d4;">URL:</h4>
                <code style="color: #10b981; font-size: 13px; word-break: break-all;">${url}</code>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    🏷️ Nombre de la Ventana/Paso:
                </label>
                <input type="text" id="nav-name"
                    value="${isInitial ? 'Ventana Principal' : 'Navegacion ' + (this.actions.length + 1)}"
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    ⏱️ Tiempo de Espera (ms):
                </label>
                <input type="number" id="nav-delay" value="3000" min="0" step="500"
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
                <small style="color: #94a3b8; font-size: 12px;">Tiempo para que la página cargue completamente</small>
            </div>

            <div class="form-group">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    📝 Descripción:
                </label>
                <textarea id="nav-notes"
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; min-height: 60px;"
                    placeholder="Descripción de esta navegación...">${isInitial ? 'Página inicial del flujo' : ''}</textarea>
            </div>
        `;

        modal.classList.add('active');

        document.getElementById('confirmAction').onclick = () => {
            const action = {
                type: 'navigate',
                varName: document.getElementById('nav-name').value.trim() || 'Navegacion',
                url: url,
                delay: parseInt(document.getElementById('nav-delay').value) || 3000,
                notes: document.getElementById('nav-notes').value.trim(),
                timestamp: Date.now(),
                windowName: document.getElementById('nav-name').value.trim()
            };

            this.actions.push(action);
            this.updateActionsList();
            this.updateCounter();

            modal.classList.remove('active');

            showNotification(`✅ Navegación agregada: ${action.windowName}`, 'success');
        };

        document.getElementById('cancelAction').onclick = () => {
            modal.classList.remove('active');
        };

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
        };
    },

    injectCaptureSystem() {
        if (!this.recordingWindow) return;

        const doc = this.recordingWindow.document;

        // Indicador
        const indicator = doc.createElement('div');
        indicator.id = 'rpa-indicator';
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
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
            font-size: 13px;
        `;
        indicator.innerHTML = `
            <span style="width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></span>
            <span>🎬 ${this.projectName}</span>
            <span id="rpa-count" style="background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 12px;">${this.actions.length}</span>
        `;

        const style = doc.createElement('style');
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

        doc.head.appendChild(style);
        doc.body.appendChild(indicator);

        // 📋 LOGGING COMPLETO DE EVENTOS

        // Eventos de Mouse
        doc.addEventListener('mouseover', (e) => {
            if (this.paused) return;
            if (!e.target.closest('#rpa-indicator')) {
                e.target.classList.add('rpa-hover');
            }
        }, true);

        doc.addEventListener('mouseout', (e) => {
            e.target.classList.remove('rpa-hover');
        }, true);

        doc.addEventListener('click', (e) => {
            this.addEventLog('CLICK', {
                tagName: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 50),
                coordinates: { x: e.clientX, y: e.clientY, pageX: e.pageX, pageY: e.pageY },
                button: e.button,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey
            });

            e.preventDefault();
            e.stopPropagation();

            if (this.paused) {
                this.addEventLog('CLICK_IGNORED', { reason: 'paused' });
                return;
            }
            if (e.target.closest('#rpa-indicator')) {
                this.addEventLog('CLICK_IGNORED', { reason: 'indicator_clicked' });
                return;
            }

            this.captureElement(e.target);
        }, true);

        // Click derecho (contextmenu)
        doc.addEventListener('contextmenu', (e) => {
            this.addEventLog('RIGHT_CLICK', {
                tagName: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 50),
                coordinates: { x: e.clientX, y: e.clientY }
            });
        }, true);

        // Doble click
        doc.addEventListener('dblclick', (e) => {
            this.addEventLog('DOUBLE_CLICK', {
                tagName: e.target.tagName,
                id: e.target.id,
                className: e.target.className,
                text: e.target.textContent?.substring(0, 50)
            });
        }, true);

        // Eventos de teclado
        doc.addEventListener('keydown', (e) => {
            this.addEventLog('KEY_DOWN', {
                key: e.key,
                code: e.code,
                keyCode: e.keyCode,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                target: {
                    tagName: e.target.tagName,
                    id: e.target.id,
                    value: e.target.value
                }
            });
        }, true);

        doc.addEventListener('keyup', (e) => {
            this.addEventLog('KEY_UP', {
                key: e.key,
                code: e.code,
                target: {
                    tagName: e.target.tagName,
                    value: e.target.value
                }
            });
        }, true);

        // Eventos de input/change
        doc.addEventListener('input', (e) => {
            this.addEventLog('INPUT', {
                tagName: e.target.tagName,
                id: e.target.id,
                name: e.target.name,
                value: e.target.value,
                inputType: e.inputType
            });
        }, true);

        doc.addEventListener('change', (e) => {
            this.addEventLog('CHANGE', {
                tagName: e.target.tagName,
                id: e.target.id,
                name: e.target.name,
                value: e.target.value,
                type: e.target.type
            });
        }, true);

        // Eventos de scroll
        doc.addEventListener('scroll', (e) => {
            this.addEventLog('SCROLL', {
                scrollX: this.recordingWindow.scrollX,
                scrollY: this.recordingWindow.scrollY
            });
        }, true);

        // Eventos de ventana
        this.recordingWindow.addEventListener('resize', (e) => {
            this.addEventLog('WINDOW_RESIZE', {
                width: this.recordingWindow.innerWidth,
                height: this.recordingWindow.innerHeight,
                outerWidth: this.recordingWindow.outerWidth,
                outerHeight: this.recordingWindow.outerHeight
            });
        });

        this.recordingWindow.addEventListener('focus', (e) => {
            this.addEventLog('WINDOW_FOCUS', {
                url: this.recordingWindow.location.href
            });
        });

        this.recordingWindow.addEventListener('blur', (e) => {
            this.addEventLog('WINDOW_BLUR', {
                url: this.recordingWindow.location.href
            });
        });

        console.log('✅ Sistema de captura profesional activado con LOGGING COMPLETO');
    },

    captureElement(element) {
        const info = this.analyzeElement(element);

        // Volver a ventana principal
        window.focus();

        setTimeout(() => {
            this.showElementDialog(info);
        }, 100);
    },

    analyzeElement(element) {
        const selectors = typeof generateSelector === 'function' ?
            generateSelector(element) :
            [{ value: element.tagName.toLowerCase(), type: 'tag' }];

        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;

        // 🔍 AUTO-EXTRAER TODAS LAS PROPIEDADES DEL ELEMENTO
        const htmlAttributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            htmlAttributes[attr.name] = attr.value;
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
            dataAttributes: this.extractDataAttributes(element),
            htmlAttributes: htmlAttributes, // 🆕 TODOS los atributos HTML
            isImage: element.tagName === 'IMG' || element.tagName === 'CANVAS',
            isInput: element.tagName === 'INPUT' || element.tagName === 'TEXTAREA',
            isButton: element.tagName === 'BUTTON' || element.type === 'button' || element.type === 'submit',
            isLink: element.tagName === 'A',
            isSelect: element.tagName === 'SELECT',
            selector: selectors[0]?.value || element.tagName.toLowerCase(),
            allSelectors: selectors,
            rect: element.getBoundingClientRect(),
            backgroundImage: backgroundImage,
            computedStyles: {
                width: computedStyle.width,
                height: computedStyle.height,
                display: computedStyle.display,
                visibility: computedStyle.visibility
            }
        };
    },

    // 🆕 FUNCIÓN PARA EXTRAER DATA-ATTRIBUTES
    extractDataAttributes(element) {
        const dataAttrs = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (attr.name.startsWith('data-')) {
                const key = attr.name.substring(5); // Remover 'data-'
                dataAttrs[key] = attr.value;
            }
        }
        return dataAttrs;
    },

    showElementDialog(info) {
        const modal = document.getElementById('actionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        // Determinar acciones sugeridas según tipo de elemento
        let suggestedActions = [];

        if (info.isImage || info.src) {
            suggestedActions = [
                { value: 'click', label: '🖱️ CLICK en Imagen', icon: 'fa-mouse-pointer' },
                { value: 'save-image', label: '💾 GUARDAR Imagen', icon: 'fa-save' },
                { value: 'screenshot', label: '📸 CAPTURAR Imagen', icon: 'fa-camera' }
            ];
        } else if (info.isInput) {
            suggestedActions = [
                { value: 'type', label: '⌨️ ESCRIBIR Texto', icon: 'fa-keyboard' },
                { value: 'click', label: '🖱️ CLICK Simple', icon: 'fa-mouse-pointer' },
                { value: 'double-click', label: '🖱️🖱️ DOBLE CLICK', icon: 'fa-mouse-pointer' },
                { value: 'clear', label: '🗑️ LIMPIAR Campo', icon: 'fa-eraser' }
            ];
        } else if (info.isButton) {
            suggestedActions = [
                { value: 'click', label: '🖱️ CLICK Simple', icon: 'fa-mouse-pointer' },
                { value: 'double-click', label: '🖱️🖱️ DOBLE CLICK', icon: 'fa-mouse-pointer' },
                { value: 'hover', label: '👆 HOVER (pasar mouse)', icon: 'fa-hand-pointer' }
            ];
        } else {
            suggestedActions = [
                { value: 'click', label: '🖱️ CLICK Simple', icon: 'fa-mouse-pointer' },
                { value: 'double-click', label: '🖱️🖱️ DOBLE CLICK', icon: 'fa-mouse-pointer' },
                { value: 'extract', label: '📥 EXTRAER Texto', icon: 'fa-download' },
                { value: 'hover', label: '👆 HOVER', icon: 'fa-hand-pointer' }
            ];
        }

        const isImageElement = info.isImage || info.src || (info.backgroundImage && info.backgroundImage !== 'none');

        modalTitle.innerHTML = `${isImageElement ? '🖼️' : '🎯'} Configurar Elemento: <span style="color: #10b981;">&lt;${info.tag}&gt;</span>`;

        modalBody.innerHTML = `
            <!-- Información del Elemento -->
            <div style="background: ${isImageElement ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#1e293b'}; padding: 15px; border-radius: 8px; margin-bottom: 20px; ${isImageElement ? 'color: white;' : ''}">
                <h4 style="margin: 0 0 10px 0; ${isImageElement ? 'color: white;' : 'color: #10b981;'}">
                    ${isImageElement ? '🖼️ IMAGEN DETECTADA' : '🎯 ELEMENTO WEB'}
                </h4>
                <div style="font-size: 13px; line-height: 1.6; ${isImageElement ? 'color: rgba(255,255,255,0.9);' : 'color: #cbd5e1;'}">
                    <div><strong>Tag:</strong> &lt;${info.tag}&gt;</div>
                    ${info.id ? `<div><strong>ID:</strong> ${info.id}</div>` : ''}
                    ${info.type ? `<div><strong>Tipo:</strong> ${info.type}</div>` : ''}
                    ${info.text ? `<div><strong>Texto:</strong> "${info.text.substring(0, 50)}${info.text.length > 50 ? '...' : ''}"</div>` : ''}
                    ${info.src ? `<div><strong>Src:</strong> ${info.src.substring(0, 60)}...</div>` : ''}
                    ${info.placeholder ? `<div><strong>Placeholder:</strong> ${info.placeholder}</div>` : ''}
                </div>
            </div>

            <!-- Tipo de Acción -->
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; font-size: 15px;">
                    🎬 ¿Qué acción deseas realizar?
                </label>
                <select id="action-type" style="width: 100%; padding: 12px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; color: white; font-size: 14px;">
                    ${suggestedActions.map((action, i) => `
                        <option value="${action.value}" ${i === 0 ? 'selected' : ''}>
                            ${action.label}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- Nombre del Objeto -->
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    🏷️ Nombre del Objeto:
                </label>
                <input type="text" id="object-name" placeholder="Ej: btnLogin, txtUsuario, imgLogo"
                    value="${this.generateObjectName(info)}"
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
                <small style="color: #94a3b8; font-size: 12px;">
                    Este objeto se guardará en: objects/${this.generateObjectName(info)}.json
                </small>
            </div>

            <!-- Campo de Texto (para TYPE) -->
            <div id="text-input-group" style="display: none; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    ⌨️ Texto a Escribir:
                </label>
                <input type="text" id="text-value" placeholder="Ingresa el texto..."
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
                <div style="margin-top: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="send-enter" style="width: 18px; height: 18px;">
                        <span>Presionar ENTER después de escribir</span>
                    </label>
                </div>
            </div>

            <!-- Delay -->
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    ⏱️ Tiempo de Espera (ms):
                </label>
                <input type="number" id="action-delay" value="500" min="0" step="100"
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white;">
            </div>

            <!-- Selector -->
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    🎯 Selector CSS:
                </label>
                <select id="object-selector" style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; font-family: 'Courier New', monospace; font-size: 12px;">
                    ${info.allSelectors.map((s, i) => `
                        <option value="${s.value}" ${i === 0 ? 'selected' : ''}>
                            ${s.type}: ${s.value}
                        </option>
                    `).join('')}
                </select>
            </div>

            <!-- Propiedades Personalizadas AUTO-RELLENADAS -->
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    🔧 Propiedades del Objeto:
                </label>
                <div style="background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid #334155;">
                    <div id="auto-properties-container"></div>
                    <small style="color: #10b981; font-size: 11px; display: block; margin-top: 8px;">
                        ✅ Propiedades detectadas automáticamente del HTML - Puedes modificarlas
                    </small>
                </div>
            </div>

            <!-- Notas -->
            <div class="form-group">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    📝 Notas:
                </label>
                <textarea id="action-notes" placeholder="Descripción de esta acción..."
                    style="width: 100%; padding: 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: white; min-height: 60px; resize: vertical;"></textarea>
            </div>
        `;

        // Mostrar/ocultar campo de texto
        const actionTypeSelect = document.getElementById('action-type');
        const textInputGroup = document.getElementById('text-input-group');

        actionTypeSelect.addEventListener('change', () => {
            textInputGroup.style.display = actionTypeSelect.value === 'type' ? 'block' : 'none';
        });

        if (suggestedActions[0]?.value === 'type') {
            textInputGroup.style.display = 'block';
        }

        modal.classList.add('active');

        // 🆕 AUTO-RELLENAR PROPIEDADES detectadas del HTML
        this.autoFillProperties(info);

        document.getElementById('confirmAction').onclick = async () => {
            const actionType = document.getElementById('action-type').value;
            const objectName = document.getElementById('object-name').value.trim();
            const delay = parseInt(document.getElementById('action-delay').value) || 500;
            const selector = document.getElementById('object-selector').value;
            const notes = document.getElementById('action-notes').value.trim();

            const action = {
                type: actionType,
                objectName: objectName,
                selector: selector,
                delay: delay,
                notes: notes,
                element: info,
                timestamp: Date.now()
            };

            if (actionType === 'type') {
                action.text = document.getElementById('text-value').value;
                action.sendEnter = document.getElementById('send-enter').checked;
            }

            // Capturar propiedades personalizadas (TODAS las auto-rellenadas + las agregadas manualmente)
            const customProperties = {};
            let propIndex = 1;
            while (true) {
                const keyInput = document.getElementById(`prop-key-${propIndex}`);
                const valueInput = document.getElementById(`prop-value-${propIndex}`);

                if (!keyInput || !valueInput) break; // No hay más propiedades

                const key = keyInput.value.trim();
                const value = valueInput.value.trim();

                if (key && value) {
                    customProperties[key] = value;
                }

                propIndex++;
                if (propIndex > 50) break; // Límite de seguridad
            }

            // Guardar imagen si es necesario
            if (isImageElement && (actionType === 'click' || actionType === 'save-image')) {
                action.imagePath = `images/${objectName}.png`;
                this.capturedImages.push({
                    name: objectName,
                    src: info.src || 'background-image',
                    path: action.imagePath
                });
            }

            // Guardar objeto con TODAS sus propiedades
            const objectNumber = this.capturedObjects.length + 1; // Número secuencial del objeto

            const objectData = {
                // 🔢 NÚMERO DE OBJETO EN EL FLUJO
                objectNumber: objectNumber,
                sequenceId: `OBJ_${String(objectNumber).padStart(3, '0')}`, // OBJ_001, OBJ_002, etc.

                varName: objectName,
                selector: selector,
                type: info.tag,
                elementType: info.isImage ? 'image' : info.isInput ? 'input' : info.isButton ? 'button' : info.isLink ? 'link' : info.isSelect ? 'select' : 'element',

                // Propiedades básicas
                properties: {
                    id: info.id || '',
                    className: info.className || '',
                    name: info.name || '',
                    type: info.type || '',
                    placeholder: info.placeholder || '',
                    value: info.value || '',
                    text: info.text || '',
                    href: info.href || '',
                    src: info.src || '',
                    alt: info.alt || '',

                    // Propiedades personalizadas definidas por el usuario
                    ...customProperties
                },

                // Metadata de captura
                captured: new Date().toISOString(),
                capturedTimestamp: Date.now(),
                orderInFlow: objectNumber, // Orden en el flujo

                // Acciones sugeridas para este objeto
                suggestedActions: info.isInput ? ['type', 'click', 'clear'] :
                                 info.isButton ? ['click', 'double-click'] :
                                 info.isImage ? ['click', 'save-image'] :
                                 ['click', 'extract'],

                // Acción actual
                currentAction: actionType,

                // Selector completo con todas las opciones
                allSelectors: info.allSelectors || [],

                // Notas
                notes: notes
            };

            this.capturedObjects.push(objectData);
            console.log(`🎯 OBJETO #${objectNumber} CAPTURADO:`, objectData);

            this.actions.push(action);
            this.updateActionsList();
            this.updateCounter();

            modal.classList.remove('active');

            showNotification(`✅ ${objectName} agregado (${actionType})`, 'success');

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

    generateObjectName(info) {
        let prefix = '';

        if (info.isButton) prefix = 'btn';
        else if (info.isInput) prefix = 'txt';
        else if (info.isImage || info.src) prefix = 'img';
        else if (info.isLink) prefix = 'lnk';
        else if (info.isSelect) prefix = 'sel';
        else prefix = 'elem';

        let name = info.id || info.name || info.className.split(' ')[0] || info.text.substring(0, 20).replace(/\s+/g, '');
        name = name.replace(/[^a-zA-Z0-9]/g, '');

        if (!name) {
            name = info.tag + (this.actions.length + 1);
        }

        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
    },

    // 🆕 AUTO-RELLENAR PROPIEDADES DEL HTML
    autoFillProperties(info) {
        const container = document.getElementById('auto-properties-container');
        if (!container) return;

        container.innerHTML = '';

        // Extraer propiedades relevantes automáticamente
        const autoProps = {};

        // Propiedades básicas del elemento
        if (info.id) autoProps['html-id'] = info.id;
        if (info.name) autoProps['html-name'] = info.name;
        if (info.type) autoProps['html-type'] = info.type;
        if (info.placeholder) autoProps['placeholder'] = info.placeholder;
        if (info.title) autoProps['title'] = info.title;
        if (info.role) autoProps['role'] = info.role;
        if (info.ariaLabel) autoProps['aria-label'] = info.ariaLabel;

        // Data attributes
        if (info.dataAttributes && Object.keys(info.dataAttributes).length > 0) {
            Object.entries(info.dataAttributes).forEach(([key, value]) => {
                autoProps[`data-${key}`] = value;
            });
        }

        // Computed styles relevantes
        if (info.computedStyles) {
            if (info.computedStyles.width) autoProps['width'] = info.computedStyles.width;
            if (info.computedStyles.height) autoProps['height'] = info.computedStyles.height;
        }

        // Crear inputs para cada propiedad detectada
        let propIndex = 0;
        Object.entries(autoProps).forEach(([key, value]) => {
            if (value && propIndex < 10) { // Máximo 10 propiedades visibles
                const propRow = document.createElement('div');
                propRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;';

                propRow.innerHTML = `
                    <input type="text"
                        id="prop-key-${propIndex + 1}"
                        value="${key}"
                        style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 12px;">
                    <input type="text"
                        id="prop-value-${propIndex + 1}"
                        value="${value}"
                        style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 12px;">
                `;

                container.appendChild(propRow);
                propIndex++;
            }
        });

        // Si no hay propiedades, agregar 3 campos vacíos
        if (propIndex === 0) {
            for (let i = 1; i <= 3; i++) {
                const propRow = document.createElement('div');
                propRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;';

                propRow.innerHTML = `
                    <input type="text"
                        id="prop-key-${i}"
                        placeholder="Nombre (ej: date, string, cool)"
                        style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 12px;">
                    <input type="text"
                        id="prop-value-${i}"
                        placeholder="Valor"
                        style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: white; font-size: 12px;">
                `;

                container.appendChild(propRow);
            }
        }

        console.log('✅ Propiedades auto-rellenadas:', autoProps);
    },

    updateCounter() {
        document.getElementById('actionCount').textContent = `(${this.actions.length})`;

        if (this.recordingWindow && !this.recordingWindow.closed) {
            try {
                const counter = this.recordingWindow.document.getElementById('rpa-count');
                if (counter) {
                    counter.textContent = this.actions.length;
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
                    <small>Haz click en elementos para comenzar</small>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';

        this.actions.forEach((action, index) => {
            const item = document.createElement('div');
            item.className = 'action-item newly-added';

            const isImage = action.element?.isImage || action.imagePath;
            const objectNumber = index + 1; // Número de acción en el flujo

            const iconMap = {
                'click': 'fa-mouse-pointer',
                'double-click': 'fa-mouse-pointer',
                'type': 'fa-keyboard',
                'navigate': 'fa-globe',
                'save-image': 'fa-image',
                'screenshot': 'fa-camera',
                'extract': 'fa-download',
                'hover': 'fa-hand-pointer',
                'clear': 'fa-eraser'
            };

            item.innerHTML = `
                <div class="action-info">
                    <!-- 🔢 NÚMERO DE OBJETO EN EL FLUJO -->
                    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-right: 12px; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);">
                        ${objectNumber}
                    </div>
                    <div class="action-icon" style="background: ${isImage ? '#10b981' : '#2563eb'};">
                        <i class="fas ${iconMap[action.type] || 'fa-cog'}"></i>
                    </div>
                    <div class="action-details">
                        <h4>
                            <span style="color: #8b5cf6; font-weight: 600; margin-right: 8px;">OBJ_${String(objectNumber).padStart(3, '0')}</span>
                            ${action.objectName || action.windowName || action.varName} ${isImage ? '🖼️' : ''}
                        </h4>
                        <p>${this.getActionDescription(action)}</p>
                        ${action.notes ? `<small style="color: #94a3b8; font-size: 11px;">💬 ${action.notes}</small>` : ''}
                    </div>
                </div>
                <div class="action-actions">
                    <button onclick="ProfessionalRecorder.editAction(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="ProfessionalRecorder.deleteAction(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            setTimeout(() => item.classList.remove('newly-added'), 500);
            listContainer.appendChild(item);
        });
    },

    getActionDescription(action) {
        let desc = '';

        switch (action.type) {
            case 'navigate':
                desc = `🌐 Ir a: ${action.url} • Delay: ${action.delay}ms`;
                break;
            case 'click':
                desc = `🖱️ Click • Delay: ${action.delay}ms`;
                break;
            case 'double-click':
                desc = `🖱️🖱️ Doble Click • Delay: ${action.delay}ms`;
                break;
            case 'type':
                desc = `⌨️ Escribir: "${action.text}"${action.sendEnter ? ' + ENTER' : ''} • Delay: ${action.delay}ms`;
                break;
            case 'save-image':
                desc = `💾 Guardar imagen: ${action.imagePath}`;
                break;
            default:
                desc = `${action.type} • Delay: ${action.delay}ms`;
        }

        return desc;
    },

    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('pauseRecording');
        const status = document.getElementById('recordingStatus');

        if (this.paused) {
            btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            status.innerHTML = '<i class="fas fa-pause"></i><span>Pausado</span>';
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            status.classList.add('active');
            status.innerHTML = `<i class="fas fa-circle"></i><span>Grabando: ${this.projectName}</span>`;
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

        showNotification(`✅ ${this.actions.length} acciones capturadas`, 'success');
    },

    async saveRecording() {
        if (this.actions.length === 0) {
            showNotification('❌ No hay acciones para guardar', 'error');
            return;
        }

        const confirmed = confirm(
            `💾 GUARDAR PROYECTO\n\n` +
            `Proyecto: ${this.projectName}\n` +
            `Carpeta: ${this.projectFolder}\n` +
            `Acciones: ${this.actions.length}\n` +
            `Objetos: ${this.capturedObjects.length}\n` +
            `Imágenes: ${this.capturedImages.length}\n\n` +
            `¿Guardar ahora?`
        );

        if (!confirmed) return;

        // Crear estructura de proyecto CON LOGS
        const projectData = {
            main: {
                name: this.projectName,
                folder: this.projectFolder,
                created: new Date().toISOString(),
                actions: this.actions,
                totalActions: this.actions.length
            },
            config: {
                projectName: this.projectName,
                version: '1.0',
                created: new Date().toISOString(),
                objects: this.capturedObjects.length,
                images: this.capturedImages.length,
                totalEvents: this.eventLogs.length // 📋 NUEVO: Total de eventos logueados
            },
            objects: this.capturedObjects,
            images: this.capturedImages,
            // 📋 NUEVO: Incluir TODOS los logs de eventos
            logs: this.eventLogs
        };

        // Guardar en servidor usando el endpoint correcto con logs
        try {
            console.log('💾 Guardando proyecto...', {
                projectFolder: this.projectFolder,
                projectName: this.projectName,
                actions: this.actions.length,
                objects: this.capturedObjects.length,
                logs: this.eventLogs.length
            });

            const response = await fetch('http://localhost:3000/api/projects/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectFolder: this.projectFolder,
                    projectName: this.projectName,
                    projectData: projectData
                })
            });

            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);

            if (data.success) {
                showNotification(`✅ Proyecto guardado en: ${data.path}`, 'success');
                console.log('✅ Estadísticas:', data.stats);

                // Descargar JSON localmente también
                this.downloadProjectJSON(projectData);

                this.clearRecording();

                if (typeof Library !== 'undefined') {
                    Library.loadWorkflows();
                }
            } else {
                showNotification(`❌ Error al guardar: ${data.error}`, 'error');
                console.error('Error del servidor:', data.error);
            }
        } catch (error) {
            console.error('❌ Error guardando proyecto:', error);
            showNotification(`❌ Error de conexión: ${error.message}`, 'error');
        }
    },

    downloadProjectJSON(projectData) {
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.projectName}_main.json`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification(`📥 JSON descargado: ${this.projectName}_main.json`, 'success');
    },

    clearRecording() {
        if (this.actions.length > 0 && !confirm('¿Limpiar todas las acciones?')) {
            return;
        }

        this.actions = [];
        this.capturedObjects = [];
        this.capturedImages = [];
        this.projectName = '';
        this.projectFolder = '';

        this.updateActionsList();
        document.getElementById('actionCount').textContent = '(0)';
        document.getElementById('saveRecording').disabled = true;
        document.getElementById('clearRecording').disabled = true;

        const status = document.getElementById('recordingStatus');
        status.innerHTML = '<i class="fas fa-info-circle"></i><span>Listo para grabar</span>';
    },

    editAction(index) {
        showNotification('⚠️ Edición en desarrollo', 'info');
    },

    deleteAction(index) {
        if (confirm(`¿Eliminar "${this.actions[index].objectName || this.actions[index].varName}"?`)) {
            this.actions.splice(index, 1);
            this.updateActionsList();
            this.updateCounter();
        }
    }
};

// Reemplazar Recorder
window.Recorder = ProfessionalRecorder;

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProfessionalRecorder.init());
} else {
    ProfessionalRecorder.init();
}

console.log('✅ Sistema Profesional RPA cargado');
