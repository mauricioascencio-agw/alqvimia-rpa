/**
 * Sistema de Configuración de Notificaciones
 * Permite personalizar posición, duración y colores de las notificaciones
 */

class NotificationConfig {
    constructor() {
        // Configuración por defecto
        this.config = this.loadConfig() || {
            error: {
                position: 'top-left',  // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
                duration: 10000,       // milisegundos
                color: '#ef4444'       // rojo
            },
            success: {
                position: 'top-right',
                duration: 3000,
                color: '#10b981'       // verde
            },
            info: {
                position: 'top-right',
                duration: 3000,
                color: '#2563eb'       // azul
            },
            warning: {
                position: 'top-right',
                duration: 5000,
                color: '#f59e0b'       // amarillo
            }
        };
    }

    /**
     * Carga configuración desde localStorage
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem('notificationConfig');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error al cargar configuración de notificaciones:', error);
            return null;
        }
    }

    /**
     * Guarda configuración en localStorage
     */
    saveConfig() {
        try {
            localStorage.setItem('notificationConfig', JSON.stringify(this.config));
            showNotification('✅ Configuración de notificaciones guardada', 'success');
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            showNotification('❌ Error al guardar configuración', 'error');
        }
    }

    /**
     * Obtiene configuración para un tipo de notificación
     */
    getConfig(type = 'info') {
        return this.config[type] || this.config.info;
    }

    /**
     * Actualiza configuración de un tipo
     */
    updateConfig(type, settings) {
        this.config[type] = { ...this.config[type], ...settings };
        this.saveConfig();
    }

    /**
     * Resetea a configuración por defecto
     */
    reset() {
        this.config = {
            error: {
                position: 'top-left',
                duration: 10000,
                color: '#ef4444'
            },
            success: {
                position: 'top-right',
                duration: 3000,
                color: '#10b981'
            },
            info: {
                position: 'top-right',
                duration: 3000,
                color: '#2563eb'
            },
            warning: {
                position: 'top-right',
                duration: 5000,
                color: '#f59e0b'
            }
        };
        this.saveConfig();
    }

    /**
     * Convierte posición a CSS
     */
    getPositionCSS(position) {
        const positions = {
            'top-left': 'top: 20px; left: 20px;',
            'top-right': 'top: 20px; right: 20px;',
            'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
        };
        return positions[position] || positions['top-right'];
    }

    /**
     * Muestra el modal de configuración
     */
    showConfigModal() {
        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'notificationConfigModal';
        modal.className = 'modal';
        modal.style.display = 'flex';

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-bell"></i> Configuración de Notificaciones</h2>
                    <button class="close-modal" onclick="document.getElementById('notificationConfigModal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                        Personaliza cómo y dónde aparecen las notificaciones del sistema.
                    </p>

                    ${this.renderTypeConfig('error', '❌ Errores')}
                    ${this.renderTypeConfig('success', '✅ Éxito')}
                    ${this.renderTypeConfig('info', 'ℹ️ Información')}
                    ${this.renderTypeConfig('warning', '⚠️ Advertencias')}

                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(37, 99, 235, 0.1); border-left: 3px solid var(--primary-color); border-radius: 4px;">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">
                            <i class="fas fa-lightbulb"></i> Vista Previa
                        </h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-sm" onclick="notificationConfig.testNotification('error')">
                                <i class="fas fa-times-circle"></i> Probar Error
                            </button>
                            <button class="btn btn-sm" onclick="notificationConfig.testNotification('success')">
                                <i class="fas fa-check-circle"></i> Probar Éxito
                            </button>
                            <button class="btn btn-sm" onclick="notificationConfig.testNotification('info')">
                                <i class="fas fa-info-circle"></i> Probar Info
                            </button>
                            <button class="btn btn-sm" onclick="notificationConfig.testNotification('warning')">
                                <i class="fas fa-exclamation-triangle"></i> Probar Warning
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="notificationConfig.reset()">
                        <i class="fas fa-undo"></i> Restaurar Valores
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('notificationConfigModal').remove()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Agregar event listeners
        this.attachEventListeners();
    }

    /**
     * Renderiza la configuración de un tipo
     */
    renderTypeConfig(type, label) {
        const config = this.config[type];
        return `
            <div class="notification-type-config" style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(30, 41, 59, 0.5); border-radius: 8px;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1rem;">${label}</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <!-- Posición -->
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">
                            <i class="fas fa-map-marker-alt"></i> Posición
                        </label>
                        <select class="input" data-type="${type}" data-field="position" style="width: 100%;">
                            <option value="top-left" ${config.position === 'top-left' ? 'selected' : ''}>⬆️ Arriba Izquierda</option>
                            <option value="top-right" ${config.position === 'top-right' ? 'selected' : ''}>⬆️ Arriba Derecha</option>
                            <option value="top-center" ${config.position === 'top-center' ? 'selected' : ''}>⬆️ Arriba Centro</option>
                            <option value="bottom-left" ${config.position === 'bottom-left' ? 'selected' : ''}>⬇️ Abajo Izquierda</option>
                            <option value="bottom-right" ${config.position === 'bottom-right' ? 'selected' : ''}>⬇️ Abajo Derecha</option>
                            <option value="bottom-center" ${config.position === 'bottom-center' ? 'selected' : ''}>⬇️ Abajo Centro</option>
                        </select>
                    </div>

                    <!-- Duración -->
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> Duración (segundos)
                        </label>
                        <input type="number"
                               class="input"
                               data-type="${type}"
                               data-field="duration"
                               value="${config.duration / 1000}"
                               min="1"
                               max="60"
                               step="0.5"
                               style="width: 100%;">
                    </div>

                    <!-- Color -->
                    <div style="grid-column: 1 / -1;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">
                            <i class="fas fa-palette"></i> Color
                        </label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="color"
                                   class="input"
                                   data-type="${type}"
                                   data-field="color"
                                   value="${config.color}"
                                   style="width: 60px; height: 40px; padding: 0.25rem;">
                            <input type="text"
                                   class="input"
                                   value="${config.color}"
                                   readonly
                                   style="flex: 1;">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Agrega event listeners a los campos
     */
    attachEventListeners() {
        const modal = document.getElementById('notificationConfigModal');
        if (!modal) return;

        // Selects y inputs
        modal.querySelectorAll('select, input[type="number"], input[type="color"]').forEach(field => {
            field.addEventListener('change', (e) => {
                const type = e.target.dataset.type;
                const fieldName = e.target.dataset.field;
                let value = e.target.value;

                // Convertir duración a milisegundos
                if (fieldName === 'duration') {
                    value = parseFloat(value) * 1000;
                }

                // Actualizar configuración
                this.config[type][fieldName] = value;
                this.saveConfig();

                // Actualizar texto del color si es color picker
                if (e.target.type === 'color') {
                    const textInput = e.target.parentElement.querySelector('input[readonly]');
                    if (textInput) textInput.value = value;
                }
            });
        });
    }

    /**
     * Prueba una notificación
     */
    testNotification(type) {
        const messages = {
            error: '❌ Este es un mensaje de error de prueba',
            success: '✅ Operación completada exitosamente',
            info: 'ℹ️ Información importante del sistema',
            warning: '⚠️ Advertencia: revisa esta configuración'
        };

        showNotification(messages[type] || messages.info, type);
    }
}

// Crear instancia global
window.notificationConfig = new NotificationConfig();

// Función mejorada de showNotification que usa la configuración
const originalShowNotification = window.showNotification;

window.showNotification = function(message, type = 'info') {
    const config = window.notificationConfig.getConfig(type);

    // Crear notificación toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        ${window.notificationConfig.getPositionCSS(config.position)}
        padding: 1rem 1.5rem;
        background: ${config.color};
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
    }, config.duration);
};
