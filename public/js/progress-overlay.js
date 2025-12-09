// 📊 BARRA DE PROGRESO TRANSPARENTE CONFIGURABLE

const ProgressOverlay = {
    overlay: null,
    progressBar: null,
    progressText: null,
    currentAction: null,
    settings: {
        barColor: '#2563eb',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        textColor: '#ffffff',
        height: '60px',
        position: 'top', // 'top' o 'bottom'
        showPercentage: true,
        showCurrentAction: true
    },

    // Inicializar
    init() {
        this.loadSettings();
        this.createOverlay();
        console.log('ProgressOverlay initialized');
    },

    // Cargar configuración guardada
    loadSettings() {
        const saved = localStorage.getItem('progress_overlay_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading progress overlay settings:', e);
            }
        }
    },

    // Guardar configuración
    saveSettings() {
        localStorage.setItem('progress_overlay_settings', JSON.stringify(this.settings));
    },

    // Crear overlay (oculto por defecto)
    createOverlay() {
        if (this.overlay) return; // Ya existe

        this.overlay = document.createElement('div');
        this.overlay.id = 'progressOverlay';
        this.overlay.style.cssText = `
            position: fixed;
            ${this.settings.position === 'top' ? 'top: 0;' : 'bottom: 0;'}
            left: 0;
            right: 0;
            height: ${this.settings.height};
            background: ${this.settings.backgroundColor};
            backdrop-filter: blur(10px);
            z-index: 99999;
            display: none;
            flex-direction: column;
            justify-content: center;
            padding: 0 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        `;

        // Contenedor de información
        const infoContainer = document.createElement('div');
        infoContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        `;

        // Texto de acción actual
        this.currentAction = document.createElement('div');
        this.currentAction.style.cssText = `
            color: ${this.settings.textColor};
            font-size: 0.95rem;
            font-weight: 500;
        `;
        this.currentAction.textContent = 'Iniciando...';

        // Porcentaje
        this.progressText = document.createElement('div');
        this.progressText.style.cssText = `
            color: ${this.settings.textColor};
            font-size: 1.1rem;
            font-weight: bold;
        `;
        this.progressText.textContent = '0%';

        infoContainer.appendChild(this.currentAction);
        infoContainer.appendChild(this.progressText);

        // Barra de progreso contenedor
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        `;

        // Barra de progreso activa
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: ${this.settings.barColor};
            border-radius: 4px;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px ${this.settings.barColor}80;
        `;

        progressContainer.appendChild(this.progressBar);

        // Ensamblar overlay
        if (this.settings.showCurrentAction) {
            this.overlay.appendChild(infoContainer);
        } else {
            infoContainer.style.justifyContent = 'flex-end';
            this.overlay.appendChild(infoContainer);
        }
        this.overlay.appendChild(progressContainer);

        document.body.appendChild(this.overlay);
    },

    // Mostrar overlay
    show() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    },

    // Ocultar overlay
    hide() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    },

    // Actualizar progreso
    updateProgress(percentage, actionText = null) {
        if (!this.overlay) return;

        // Actualizar porcentaje
        const percent = Math.min(100, Math.max(0, percentage));
        this.progressBar.style.width = `${percent}%`;

        if (this.settings.showPercentage) {
            this.progressText.textContent = `${Math.round(percent)}%`;
        }

        // Actualizar texto de acción actual
        if (actionText && this.settings.showCurrentAction) {
            this.currentAction.textContent = actionText;
        }
    },

    // Mostrar mensaje de completado
    showComplete() {
        this.updateProgress(100, 'Proceso terminado');
        setTimeout(() => {
            this.hide();
            this.reset();
        }, 2000);
    },

    // Mostrar mensaje de error
    showError(message = 'Error en el proceso') {
        if (!this.overlay) return;

        this.currentAction.textContent = message;
        this.progressBar.style.background = '#ef4444';
        this.progressBar.style.boxShadow = '0 0 10px #ef444480';

        setTimeout(() => {
            this.hide();
            this.reset();
        }, 3000);
    },

    // Reset
    reset() {
        if (!this.overlay) return;

        this.progressBar.style.width = '0%';
        this.progressBar.style.background = this.settings.barColor;
        this.progressBar.style.boxShadow = `0 0 10px ${this.settings.barColor}80`;
        this.progressText.textContent = '0%';
        this.currentAction.textContent = 'Iniciando...';
    },

    // Abrir configuración
    showSettings() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-sliders-h"></i> Configuración de Barra de Progreso</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label><i class="fas fa-palette"></i> Color de la barra</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="color" id="barColor" class="form-control" style="width: 80px; height: 40px;"
                                   value="${this.settings.barColor}">
                            <input type="text" class="form-control" readonly value="${this.settings.barColor}"
                                   id="barColorText" style="flex: 1;">
                        </div>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-fill-drip"></i> Color de fondo</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="color" id="bgColorPicker" class="form-control" style="width: 80px; height: 40px;"
                                   value="${this.hexFromRgba(this.settings.backgroundColor)}">
                            <input type="range" id="bgOpacity" class="form-control" min="0" max="100"
                                   value="${this.getOpacity(this.settings.backgroundColor) * 100}"
                                   style="flex: 1;">
                            <span id="bgOpacityValue">${Math.round(this.getOpacity(this.settings.backgroundColor) * 100)}%</span>
                        </div>
                        <small style="color: #64748b;">Ajusta la transparencia del fondo</small>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-font"></i> Color del texto</label>
                        <input type="color" id="textColor" class="form-control" style="width: 80px; height: 40px;"
                               value="${this.settings.textColor}">
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-arrows-alt-v"></i> Altura de la barra</label>
                        <select id="barHeight" class="form-control">
                            <option value="50px" ${this.settings.height === '50px' ? 'selected' : ''}>Pequeña (50px)</option>
                            <option value="60px" ${this.settings.height === '60px' ? 'selected' : ''}>Mediana (60px)</option>
                            <option value="80px" ${this.settings.height === '80px' ? 'selected' : ''}>Grande (80px)</option>
                            <option value="100px" ${this.settings.height === '100px' ? 'selected' : ''}>Extra Grande (100px)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-compass"></i> Posición</label>
                        <select id="barPosition" class="form-control">
                            <option value="top" ${this.settings.position === 'top' ? 'selected' : ''}>Arriba</option>
                            <option value="bottom" ${this.settings.position === 'bottom' ? 'selected' : ''}>Abajo</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="showPercentage" ${this.settings.showPercentage ? 'checked' : ''}>
                            <span>Mostrar porcentaje</span>
                        </label>
                    </div>

                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="showCurrentAction" ${this.settings.showCurrentAction ? 'checked' : ''}>
                            <span>Mostrar acción actual</span>
                        </label>
                    </div>

                    <!-- Vista previa -->
                    <div style="background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;">
                        <h4 style="margin-top: 0; margin-bottom: 1rem; color: #e2e8f0;">
                            <i class="fas fa-eye"></i> Vista Previa
                        </h4>
                        <button class="btn btn-secondary btn-sm" id="testProgressBtn">
                            <i class="fas fa-play"></i> Probar Animación
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="saveSettingsBtn">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Actualizar texto del color
        modal.querySelector('#barColor').oninput = (e) => {
            modal.querySelector('#barColorText').value = e.target.value;
        };

        // Actualizar opacidad
        const bgOpacityInput = modal.querySelector('#bgOpacity');
        const bgOpacityValue = modal.querySelector('#bgOpacityValue');
        bgOpacityInput.oninput = (e) => {
            bgOpacityValue.textContent = `${e.target.value}%`;
        };

        // Probar animación
        modal.querySelector('#testProgressBtn').onclick = () => {
            this.testProgress();
        };

        // Guardar
        modal.querySelector('#saveSettingsBtn').onclick = () => {
            this.settings.barColor = modal.querySelector('#barColor').value;
            this.settings.textColor = modal.querySelector('#textColor').value;
            this.settings.height = modal.querySelector('#barHeight').value;
            this.settings.position = modal.querySelector('#barPosition').value;
            this.settings.showPercentage = modal.querySelector('#showPercentage').checked;
            this.settings.showCurrentAction = modal.querySelector('#showCurrentAction').checked;

            // Construir background con opacidad
            const bgColor = modal.querySelector('#bgColorPicker').value;
            const bgOpacity = modal.querySelector('#bgOpacity').value / 100;
            this.settings.backgroundColor = this.hexToRgba(bgColor, bgOpacity);

            this.saveSettings();
            this.updateOverlayStyles();
            showNotification('Configuración guardada', 'success');
            modal.remove();
        };
    },

    // Actualizar estilos del overlay
    updateOverlayStyles() {
        if (!this.overlay) {
            this.createOverlay();
            return;
        }

        // Remover overlay existente y recrear
        this.overlay.remove();
        this.overlay = null;
        this.createOverlay();
    },

    // Probar progreso
    testProgress() {
        this.show();
        this.reset();

        const actions = [
            'Conectando a base de datos...',
            'Cargando datos...',
            'Procesando información...',
            'Generando reporte...',
            'Guardando resultados...'
        ];

        let progress = 0;
        let actionIndex = 0;

        const interval = setInterval(() => {
            progress += 20;
            this.updateProgress(progress, actions[actionIndex]);
            actionIndex++;

            if (progress >= 100) {
                clearInterval(interval);
                this.showComplete();
            }
        }, 800);
    },

    // Utilidades de color
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    hexFromRgba(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#0f172a';

        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    },

    getOpacity(rgba) {
        const match = rgba.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/);
        return match ? parseFloat(match[1]) : 1;
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProgressOverlay.init());
} else {
    ProgressOverlay.init();
}

// Integrar con el ejecutor
if (typeof Executor !== 'undefined') {
    const originalExecute = Executor.execute;
    Executor.execute = async function() {
        ProgressOverlay.show();
        ProgressOverlay.reset();

        try {
            await originalExecute.call(this);
        } catch (error) {
            ProgressOverlay.showError('Error en la ejecución');
            throw error;
        }
    };

    const originalStop = Executor.stop;
    Executor.stop = function() {
        ProgressOverlay.hide();
        originalStop.call(this);
    };
}
