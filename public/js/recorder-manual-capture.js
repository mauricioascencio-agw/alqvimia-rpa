// Sistema de Captura Manual - Se activa cuando CORS bloquea la grabación automática

function createManualCapturePanel() {
    // Crear panel flotante para captura manual
    const panel = document.createElement('div');
    panel.id = 'manual-capture-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 999999;
        min-width: 280px;
        font-family: 'Segoe UI', Arial, sans-serif;
        display: none;
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📋</span>
                <strong style="font-size: 16px;">Captura Manual</strong>
            </div>
            <button id="close-manual-capture" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px; padding: 0;">&times;</button>
        </div>

        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 12px;">
            <strong>⚠️ Modo Manual Activado</strong><br>
            La página bloqueó la grabación automática (CORS).<br>
            Usa los botones para agregar acciones.
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="manual-btn-click" style="background: #2563eb; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                <span>🖱️</span> Agregar CLICK
            </button>

            <button id="manual-btn-type" style="background: #8b5cf6; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                <span>⌨️</span> Agregar TEXTO
            </button>

            <button id="manual-btn-navigate" style="background: #06b6d4; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                <span>🌐</span> Agregar NAVEGACIÓN
            </button>

            <button id="manual-btn-wait" style="background: #f59e0b; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                <span>⏱️</span> Agregar ESPERA
            </button>

            <button id="manual-btn-screenshot" style="background: #ec4899; border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                <span>📸</span> Agregar CAPTURA
            </button>
        </div>

        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11px; text-align: center; opacity: 0.8;">
            Acciones grabadas: <strong id="manual-action-count">0</strong>
        </div>
    `;

    document.body.appendChild(panel);

    // Event listeners
    document.getElementById('close-manual-capture').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    document.getElementById('manual-btn-click').addEventListener('click', () => {
        addManualClickAction();
    });

    document.getElementById('manual-btn-type').addEventListener('click', () => {
        addManualTypeAction();
    });

    document.getElementById('manual-btn-navigate').addEventListener('click', () => {
        addManualNavigateAction();
    });

    document.getElementById('manual-btn-wait').addEventListener('click', () => {
        addManualWaitAction();
    });

    document.getElementById('manual-btn-screenshot').addEventListener('click', () => {
        addManualScreenshotAction();
    });

    // Hover effects
    const buttons = panel.querySelectorAll('button[id^="manual-btn-"]');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });
    });

    return panel;
}

function showManualCapturePanel() {
    let panel = document.getElementById('manual-capture-panel');
    if (!panel) {
        panel = createManualCapturePanel();
    }
    panel.style.display = 'block';

    // Mostrar notificación
    showNotification('💡 Usa el panel verde para agregar acciones manualmente', 'info');
}

function hideManualCapturePanel() {
    const panel = document.getElementById('manual-capture-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function updateManualActionCount(count) {
    const counter = document.getElementById('manual-action-count');
    if (counter) {
        counter.textContent = count;
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
}

function addManualClickAction() {
    const selector = prompt(
        '🖱️ AGREGAR CLICK\n\n' +
        'Ingresa el selector CSS del elemento:\n\n' +
        'Ejemplos:\n' +
        '• #button-id\n' +
        '• .button-class\n' +
        '• button[type="submit"]\n' +
        '• a[href="/login"]\n' +
        '• img[alt="Logo"]'
    );

    if (!selector) return;

    const action = {
        type: 'click',
        selector: selector.trim(),
        element: {
            tag: 'manual',
            text: 'Click manual',
            isImage: selector.toLowerCase().includes('img'),
            classList: [],
            id: ''
        },
        timestamp: Date.now(),
        delay: 500
    };

    if (typeof Recorder !== 'undefined' && Recorder.addRecordedAction) {
        Recorder.addRecordedAction(action);
        updateManualActionCount(Recorder.actions.length);
        showNotification(`✅ Click agregado: ${selector}`, 'success');
        console.log('✅ CLICK MANUAL AGREGADO:', action);
    }
}

function addManualTypeAction() {
    const selector = prompt(
        '⌨️ AGREGAR TEXTO\n\n' +
        'Ingresa el selector CSS del input:\n\n' +
        'Ejemplos:\n' +
        '• #username\n' +
        '• input[name="email"]\n' +
        '• textarea[id="message"]'
    );

    if (!selector) return;

    const text = prompt(
        '⌨️ TEXTO A ESCRIBIR\n\n' +
        'Ingresa el texto que quieres escribir en el campo:'
    );

    if (text === null) return;

    const action = {
        type: 'type',
        selector: selector.trim(),
        text: text,
        element: {
            tag: 'input',
            name: 'manual',
            type: 'text',
            placeholder: ''
        },
        timestamp: Date.now(),
        delay: 500
    };

    if (typeof Recorder !== 'undefined' && Recorder.addRecordedAction) {
        Recorder.addRecordedAction(action);
        updateManualActionCount(Recorder.actions.length);
        showNotification(`✅ Texto agregado: "${text}"`, 'success');
        console.log('✅ TYPE MANUAL AGREGADO:', action);
    }
}

function addManualNavigateAction() {
    const url = prompt(
        '🌐 AGREGAR NAVEGACIÓN\n\n' +
        'Ingresa la URL completa:\n\n' +
        'Ejemplo:\n' +
        'https://www.google.com'
    );

    if (!url) return;

    const action = {
        type: 'navigate',
        url: url.trim(),
        timestamp: Date.now()
    };

    if (typeof Recorder !== 'undefined' && Recorder.addRecordedAction) {
        Recorder.addRecordedAction(action);
        updateManualActionCount(Recorder.actions.length);
        showNotification(`✅ Navegación agregada: ${url}`, 'success');
        console.log('✅ NAVIGATE MANUAL AGREGADO:', action);
    }
}

function addManualWaitAction() {
    // Crear modal para propiedades de espera
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-clock"></i> Agregar Espera</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label><i class="fas fa-window-restore"></i> Aplicar a Ventana</label>
                    <select id="waitWindowId" class="form-control">
                        <option value="current">Ventana Actual</option>
                        <option value="all">Todas las Ventanas</option>
                        <option value="new">Nueva Ventana</option>
                        <option value="main">Ventana Principal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-clock"></i> Duración *</label>
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
                        <input type="number" id="waitTimeValue" class="form-control" required
                               value="2" min="1" step="1" placeholder="Cantidad">
                        <select id="waitTimeUnit" class="form-control">
                            <option value="milliseconds">Milisegundos</option>
                            <option value="seconds" selected>Segundos</option>
                            <option value="minutes">Minutos</option>
                            <option value="hours">Horas</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-info-circle"></i> Descripción (Opcional)</label>
                    <input type="text" id="waitDescription" class="form-control"
                           placeholder="¿Por qué estamos esperando?">
                </div>
                <div style="background: #1e293b; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <div style="color: #94a3b8; font-size: 0.9rem;">
                        <strong>⏱️ Conversión Automática:</strong><br>
                        <span id="waitConversion" style="color: #2563eb; font-weight: bold;">
                            2000 ms = 2.00 seg = 0.03 min = 0.0006 hrs
                        </span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                    Cancelar
                </button>
                <button class="btn btn-success" id="saveWaitBtn">
                    <i class="fas fa-check"></i> Agregar Espera
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Actualizar conversión en tiempo real
    const updateConversion = () => {
        const value = parseFloat(document.getElementById('waitTimeValue').value) || 1;
        const unit = document.getElementById('waitTimeUnit').value;

        const conversions = {
            milliseconds: {
                ms: value,
                s: (value / 1000).toFixed(2),
                m: (value / 60000).toFixed(2),
                h: (value / 3600000).toFixed(4)
            },
            seconds: {
                ms: value * 1000,
                s: value,
                m: (value / 60).toFixed(2),
                h: (value / 3600).toFixed(4)
            },
            minutes: {
                ms: value * 60000,
                s: value * 60,
                m: value,
                h: (value / 60).toFixed(2)
            },
            hours: {
                ms: value * 3600000,
                s: value * 3600,
                m: value * 60,
                h: value
            }
        };

        const conv = conversions[unit];
        document.getElementById('waitConversion').textContent =
            `${conv.ms} ms = ${conv.s} seg = ${conv.m} min = ${conv.h} hrs`;
    };

    document.getElementById('waitTimeValue').addEventListener('input', updateConversion);
    document.getElementById('waitTimeUnit').addEventListener('change', updateConversion);

    // Cerrar modal
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Guardar acción
    document.getElementById('saveWaitBtn').onclick = () => {
        const timeValue = parseFloat(document.getElementById('waitTimeValue').value);
        const timeUnit = document.getElementById('waitTimeUnit').value;
        const windowId = document.getElementById('waitWindowId').value;
        const description = document.getElementById('waitDescription').value;

        if (!timeValue || timeValue < 1) {
            showNotification('❌ Duración inválida', 'error');
            return;
        }

        // Convertir a milisegundos
        const conversions = {
            milliseconds: 1,
            seconds: 1000,
            minutes: 60000,
            hours: 3600000
        };

        const ms = timeValue * conversions[timeUnit];

        const action = {
            type: 'wait',
            duration: ms,
            timeValue: timeValue,
            timeUnit: timeUnit,
            windowId: windowId,
            description: description,
            timestamp: Date.now()
        };

        if (typeof Recorder !== 'undefined' && Recorder.addRecordedAction) {
            Recorder.addRecordedAction(action);
            updateManualActionCount(Recorder.actions.length);
            showNotification(`✅ Espera agregada: ${timeValue} ${timeUnit}`, 'success');
            console.log('✅ WAIT MANUAL AGREGADO:', action);
        }

        modal.remove();
    };
}

function addManualScreenshotAction() {
    const path = prompt(
        '📸 AGREGAR CAPTURA\n\n' +
        'Ingresa el nombre del archivo (opcional):\n\n' +
        'Ejemplo:\n' +
        'screenshot.png',
        `screenshot-${Date.now()}.png`
    );

    if (path === null) return;

    const fullPage = confirm('¿Capturar página completa?\n\nOK = Sí, página completa\nCANCELAR = Solo área visible');

    const action = {
        type: 'screenshot',
        path: path || `screenshot-${Date.now()}.png`,
        fullPage: fullPage,
        timestamp: Date.now()
    };

    if (typeof Recorder !== 'undefined' && Recorder.addRecordedAction) {
        Recorder.addRecordedAction(action);
        updateManualActionCount(Recorder.actions.length);
        showNotification(`✅ Captura agregada: ${action.path}`, 'success');
        console.log('✅ SCREENSHOT MANUAL AGREGADO:', action);
    }
}

// Exportar funciones
window.ManualCapture = {
    show: showManualCapturePanel,
    hide: hideManualCapturePanel,
    updateCount: updateManualActionCount,
    addClick: addManualClickAction,
    addType: addManualTypeAction,
    addNavigate: addManualNavigateAction,
    addWait: addManualWaitAction,
    addScreenshot: addManualScreenshotAction
};

console.log('✅ Sistema de Captura Manual cargado');
