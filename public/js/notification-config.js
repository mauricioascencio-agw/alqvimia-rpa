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

// Sistema de gestión de notificaciones apiladas
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.containers = {};
        this.errorLog = [];
        this.initContainers();
    }

    initContainers() {
        // Crear contenedores para cada posición
        const positions = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];
        positions.forEach(pos => {
            const container = document.createElement('div');
            container.id = `notification-container-${pos}`;
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                ${this.getPositionCSS(pos)}
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 9999;
                pointer-events: none;
                max-width: 450px;
            `;
            document.body.appendChild(container);
            this.containers[pos] = container;
        });
    }

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

    show(message, type = 'info') {
        const config = window.notificationConfig.getConfig(type);
        const container = this.containers[config.position];

        // Log de errores
        if (type === 'error') {
            this.errorLog.push({
                timestamp: new Date().toISOString(),
                message: message,
                type: type
            });
        }

        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        notification.id = notificationId;

        // Icono según tipo
        const icons = {
            error: 'fas fa-times-circle',
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px; pointer-events: all;">
                <i class="${icons[type] || icons.info}" style="font-size: 20px; margin-top: 2px;"></i>
                <div style="flex: 1; min-width: 0;">
                    <div style="word-wrap: break-word; white-space: pre-wrap;">${message}</div>
                    ${type === 'error' ? `
                        <div style="margin-top: 8px; display: flex; gap: 8px;">
                            <button onclick="notificationManager.copyError('${notificationId}')"
                                    class="notif-btn"
                                    title="Copiar error">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                            <button onclick="notificationManager.saveToLog('${notificationId}')"
                                    class="notif-btn"
                                    title="Guardar en log">
                                <i class="fas fa-save"></i> Guardar
                            </button>
                            <button onclick="notificationManager.viewAllErrors()"
                                    class="notif-btn"
                                    title="Ver todos los errores">
                                <i class="fas fa-list"></i> Ver Log (${this.errorLog.length})
                            </button>
                        </div>
                    ` : ''}
                </div>
                <button onclick="notificationManager.close('${notificationId}')"
                        style="background: none; border: none; color: white; cursor: pointer; padding: 0; font-size: 18px; line-height: 1; opacity: 0.7; pointer-events: all;"
                        title="Cerrar">
                    ×
                </button>
            </div>
        `;

        notification.style.cssText = `
            padding: 16px;
            background: ${config.color};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s;
            word-wrap: break-word;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 10px;
            border-left: 4px solid rgba(255,255,255,0.3);
        `;

        notification.dataset.message = message;
        notification.dataset.type = type;

        container.appendChild(notification);
        this.notifications.push(notificationId);

        // Auto-cerrar después de la duración configurada
        setTimeout(() => {
            this.close(notificationId);
        }, config.duration);

        return notificationId;
    }

    close(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.style.animation = 'slideOut 0.3s';
            setTimeout(() => {
                notification.remove();
                this.notifications = this.notifications.filter(id => id !== notificationId);
            }, 300);
        }
    }

    copyError(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            const message = notification.dataset.message;
            navigator.clipboard.writeText(message).then(() => {
                this.show('✅ Error copiado al portapapeles', 'success');
            }).catch(() => {
                this.show('❌ No se pudo copiar al portapapeles', 'error');
            });
        }
    }

    async saveToLog(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;

        const message = notification.dataset.message;
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ERROR: ${message}\n`;

        try {
            // Intentar guardar en el servidor
            const response = await fetch('/api/save-error-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp,
                    message,
                    type: 'error'
                })
            });

            if (response.ok) {
                this.show('✅ Error guardado en logs/errors.log', 'success');
            } else {
                // Si falla, descargar localmente
                this.downloadLog(logEntry);
            }
        } catch (error) {
            // Si no hay servidor, descargar localmente
            this.downloadLog(logEntry);
        }
    }

    downloadLog(content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${new Date().toISOString().replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        this.show('✅ Log descargado localmente', 'success');
    }

    viewAllErrors() {
        if (this.errorLog.length === 0) {
            this.show('ℹ️ No hay errores registrados', 'info');
            return;
        }

        // Crear modal con todos los errores
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const errorList = this.errorLog.map((err, idx) => {
            const date = new Date(err.timestamp);
            return `
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 4px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
                        <div style="flex: 1;">
                            <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 4px;">
                                ${date.toLocaleString('es-ES')}
                            </div>
                            <div style="color: #e2e8f0; word-wrap: break-word;">
                                ${err.message}
                            </div>
                        </div>
                        <button onclick="notificationManager.copyErrorFromLog(${idx})"
                                class="btn btn-sm"
                                title="Copiar">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 80vh;">
                <div class="modal-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> Log de Errores (${this.errorLog.length})</h2>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                    ${errorList}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="notificationManager.clearErrorLog()">
                        <i class="fas fa-trash"></i> Limpiar Log
                    </button>
                    <button class="btn btn-primary" onclick="notificationManager.downloadAllErrors()">
                        <i class="fas fa-download"></i> Descargar Todo
                    </button>
                    <button class="btn btn-primary" onclick="notificationManager.copyAllErrors()">
                        <i class="fas fa-copy"></i> Copiar Todo
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    copyErrorFromLog(index) {
        const error = this.errorLog[index];
        if (error) {
            const text = `[${error.timestamp}] ${error.message}`;
            navigator.clipboard.writeText(text).then(() => {
                this.show('✅ Error copiado', 'success');
            });
        }
    }

    copyAllErrors() {
        const text = this.errorLog.map(err =>
            `[${err.timestamp}] ${err.message}`
        ).join('\n\n');

        navigator.clipboard.writeText(text).then(() => {
            this.show('✅ Todos los errores copiados', 'success');
        });
    }

    downloadAllErrors() {
        const content = this.errorLog.map(err =>
            `[${err.timestamp}] ${err.message}`
        ).join('\n\n');

        this.downloadLog(content);
    }

    clearErrorLog() {
        if (confirm('¿Limpiar todos los errores del log?')) {
            this.errorLog = [];
            this.show('✅ Log de errores limpiado', 'success');
            const modal = document.querySelector('.modal');
            if (modal) modal.remove();
        }
    }
}

// Crear instancias globales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de configuración
    window.notificationConfig = new NotificationConfig();

    // Inicializar gestor de notificaciones
    window.notificationManager = new NotificationManager();

    // Reemplazar función global showNotification
    window.showNotification = function(message, type = 'info') {
        return window.notificationManager.show(message, type);
    };

    console.log('✅ Sistema de notificaciones mejorado cargado');
});

// Agregar estilos CSS para botones de notificación
const style = document.createElement('style');
style.textContent = `
    .notif-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Segoe UI', Arial, sans-serif;
        transition: background 0.2s;
    }
    .notif-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    .notif-btn i {
        margin-right: 4px;
    }
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
