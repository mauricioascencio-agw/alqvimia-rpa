// 🎯 SISTEMA DE DISPARADORES (TRIGGERS) PARA WORKFLOWS

const WorkflowTriggers = {
    triggers: [], // Lista de triggers configurados

    // Inicializar sistema de triggers
    init() {
        this.loadTriggers();
        this.setupUI();
    },

    // Cargar triggers guardados
    loadTriggers() {
        const saved = localStorage.getItem('workflow_triggers');
        if (saved) {
            try {
                this.triggers = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading triggers:', e);
                this.triggers = [];
            }
        }
    },

    // Guardar triggers
    saveTriggers() {
        localStorage.setItem('workflow_triggers', JSON.stringify(this.triggers));
    },

    // Configurar UI
    setupUI() {
        // Agregar botón de triggers en el toolbar del workflow
        const workflowToolbar = document.querySelector('.workflow-toolbar');
        if (workflowToolbar) {
            const triggersBtn = document.createElement('button');
            triggersBtn.className = 'btn btn-secondary';
            triggersBtn.innerHTML = '<i class="fas fa-bolt"></i> Disparadores';
            triggersBtn.onclick = () => this.showTriggersModal();

            // Insertar antes del botón de vista
            const viewToggle = document.getElementById('viewToggle');
            if (viewToggle) {
                viewToggle.parentNode.insertBefore(triggersBtn, viewToggle);
            } else {
                workflowToolbar.appendChild(triggersBtn);
            }
        }
    },

    // Mostrar modal de configuración de triggers
    showTriggersModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-bolt"></i> Disparadores del Workflow</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                        <button class="btn btn-primary" id="addTriggerBtn">
                            <i class="fas fa-plus"></i> Agregar Disparador
                        </button>
                    </div>

                    <div id="triggersListContainer">
                        ${this.renderTriggersList()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.querySelector('#addTriggerBtn').onclick = () => this.showAddTriggerModal();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    },

    // Renderizar lista de triggers
    renderTriggersList() {
        if (this.triggers.length === 0) {
            return `
                <div style="text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-bolt" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p style="font-size: 1.1rem; margin: 0;">No hay disparadores configurados</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Los disparadores ejecutan workflows automáticamente</p>
                </div>
            `;
        }

        return `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${this.triggers.map((trigger, index) => this.renderTriggerCard(trigger, index)).join('')}
            </div>
        `;
    },

    // Renderizar tarjeta individual de trigger
    renderTriggerCard(trigger, index) {
        const typeIcons = {
            workflow: 'fa-project-diagram',
            email: 'fa-envelope',
            schedule: 'fa-clock',
            webhook: 'fa-link'
        };

        const typeLabels = {
            workflow: 'Workflow',
            email: 'Email',
            schedule: 'Programado',
            webhook: 'Webhook'
        };

        const statusColor = trigger.enabled ? '#10b981' : '#64748b';
        const statusLabel = trigger.enabled ? 'Activo' : 'Inactivo';

        return `
            <div class="trigger-card" data-trigger-index="${index}" style="
                background: #1e293b;
                border: 1px solid #334155;
                border-left: 4px solid ${statusColor};
                border-radius: 8px;
                padding: 1.25rem;
                transition: all 0.2s;
            ">
                <div style="display: flex; align-items: start; gap: 1rem;">
                    <!-- Icono -->
                    <div style="
                        width: 48px;
                        height: 48px;
                        background: linear-gradient(135deg, #334155 0%, #475569 100%);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    ">
                        <i class="fas ${typeIcons[trigger.type] || 'fa-bolt'}" style="color: #60a5fa; font-size: 1.5rem;"></i>
                    </div>

                    <!-- Información -->
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0; color: #e2e8f0; font-size: 1.1rem;">${trigger.name || 'Sin nombre'}</h4>
                            <span style="
                                background: ${statusColor}20;
                                color: ${statusColor};
                                padding: 0.25rem 0.75rem;
                                border-radius: 12px;
                                font-size: 0.75rem;
                                font-weight: 600;
                            ">${statusLabel}</span>
                        </div>

                        <div style="display: flex; gap: 2rem; margin-bottom: 0.75rem;">
                            <div style="color: #94a3b8; font-size: 0.9rem;">
                                <strong>Tipo:</strong> ${typeLabels[trigger.type]}
                            </div>
                            <div style="color: #94a3b8; font-size: 0.9rem;">
                                <strong>Workflow:</strong> ${trigger.workflowName || 'No asignado'}
                            </div>
                        </div>

                        <div style="color: #64748b; font-size: 0.85rem;">
                            ${this.getTriggerDetails(trigger)}
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                        <button class="btn btn-sm btn-secondary" onclick="WorkflowTriggers.toggleTrigger(${index})" title="${trigger.enabled ? 'Desactivar' : 'Activar'}">
                            <i class="fas ${trigger.enabled ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="WorkflowTriggers.editTrigger(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="WorkflowTriggers.deleteTrigger(${index})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Obtener detalles del trigger según tipo
    getTriggerDetails(trigger) {
        switch (trigger.type) {
            case 'workflow':
                return `<i class="fas fa-arrow-right"></i> Ejecutar cuando termine: ${trigger.sourceWorkflow || 'No configurado'}`;
            case 'email':
                return `<i class="fas fa-inbox"></i> Monitorear: ${trigger.emailAddress || 'No configurado'}${trigger.subject ? ` | Asunto: "${trigger.subject}"` : ''}`;
            case 'schedule':
                return `<i class="fas fa-calendar"></i> ${trigger.scheduleType || 'No configurado'}`;
            case 'webhook':
                return `<i class="fas fa-link"></i> URL: ${trigger.webhookUrl || 'No configurado'}`;
            default:
                return 'No configurado';
        }
    },

    // Mostrar modal para agregar/editar trigger
    showAddTriggerModal(editIndex = null) {
        const trigger = editIndex !== null ? this.triggers[editIndex] : {
            type: 'workflow',
            enabled: true,
            name: '',
            workflowId: '',
            workflowName: ''
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-bolt"></i> ${editIndex !== null ? 'Editar' : 'Agregar'} Disparador</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="triggerForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
                        <!-- Nombre -->
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                                <i class="fas fa-tag"></i> Nombre del Disparador
                            </label>
                            <input type="text" id="triggerName" class="form-control" placeholder="Ej: Enviar reporte diario" value="${trigger.name || ''}" required>
                        </div>

                        <!-- Tipo de trigger -->
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                                <i class="fas fa-bolt"></i> Tipo de Disparador
                            </label>
                            <select id="triggerType" class="form-control">
                                <option value="workflow" ${trigger.type === 'workflow' ? 'selected' : ''}>Workflow (cuando termine otro workflow)</option>
                                <option value="email" ${trigger.type === 'email' ? 'selected' : ''}>Email (cuando llegue un correo)</option>
                                <option value="schedule" ${trigger.type === 'schedule' ? 'selected' : ''}>Programado (en horarios específicos)</option>
                                <option value="webhook" ${trigger.type === 'webhook' ? 'selected' : ''}>Webhook (llamada HTTP)</option>
                            </select>
                        </div>

                        <!-- Workflow destino -->
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                                <i class="fas fa-project-diagram"></i> Workflow a Ejecutar
                            </label>
                            <select id="targetWorkflow" class="form-control" required>
                                <option value="">Seleccionar workflow...</option>
                                ${this.getWorkflowOptions(trigger.workflowId)}
                            </select>
                        </div>

                        <!-- Configuración específica por tipo -->
                        <div id="triggerConfig">
                            ${this.renderTriggerConfig(trigger)}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="saveTriggerBtn">
                        <i class="fas fa-save"></i> ${editIndex !== null ? 'Actualizar' : 'Guardar'}
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

        // Cambiar configuración según tipo
        modal.querySelector('#triggerType').onchange = (e) => {
            const configDiv = modal.querySelector('#triggerConfig');
            configDiv.innerHTML = this.renderTriggerConfig({ type: e.target.value });
        };

        // Guardar trigger
        modal.querySelector('#saveTriggerBtn').onclick = () => {
            const form = modal.querySelector('#triggerForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const newTrigger = this.collectTriggerData(modal, editIndex !== null ? trigger : null);

            if (editIndex !== null) {
                this.triggers[editIndex] = newTrigger;
            } else {
                this.triggers.push(newTrigger);
            }

            this.saveTriggers();
            modal.remove();

            // Reabrir modal de triggers
            this.showTriggersModal();
        };
    },

    // Renderizar configuración específica del trigger
    renderTriggerConfig(trigger) {
        switch (trigger.type) {
            case 'workflow':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-project-diagram"></i> Workflow Fuente
                        </label>
                        <select id="sourceWorkflow" class="form-control">
                            <option value="">Seleccionar workflow que dispara...</option>
                            ${this.getWorkflowOptions(trigger.sourceWorkflowId)}
                        </select>
                        <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                            Cuando este workflow termine, se ejecutará el workflow destino
                        </small>
                    </div>
                `;

            case 'email':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-envelope"></i> Dirección de Email
                        </label>
                        <input type="email" id="emailAddress" class="form-control" placeholder="ejemplo@correo.com" value="${trigger.emailAddress || ''}">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-heading"></i> Filtro de Asunto (opcional)
                        </label>
                        <input type="text" id="emailSubject" class="form-control" placeholder="Palabras clave en el asunto" value="${trigger.subject || ''}">
                    </div>
                    <small style="color: #64748b;">
                        Monitorea esta dirección y ejecuta el workflow cuando llegue un correo
                    </small>
                `;

            case 'schedule':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-calendar"></i> Tipo de Programación
                        </label>
                        <select id="scheduleType" class="form-control">
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                            <option value="interval">Cada X tiempo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-clock"></i> Hora de Ejecución
                        </label>
                        <input type="time" id="scheduleTime" class="form-control" value="${trigger.scheduleTime || '09:00'}">
                    </div>
                    <small style="color: #64748b;">
                        El workflow se ejecutará automáticamente según el horario configurado
                    </small>
                `;

            case 'webhook':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-link"></i> URL del Webhook
                        </label>
                        <input type="url" id="webhookUrl" class="form-control" placeholder="https://api.ejemplo.com/webhook" value="${trigger.webhookUrl || ''}" readonly>
                        <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                            Esta URL se generará automáticamente. Envía POST a esta URL para ejecutar el workflow.
                        </small>
                    </div>
                `;

            default:
                return '';
        }
    },

    // Obtener opciones de workflows guardados
    getWorkflowOptions(selectedId = '') {
        const savedWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        return savedWorkflows.map(wf => `
            <option value="${wf.id}" ${wf.id === selectedId ? 'selected' : ''}>
                ${wf.name || 'Sin nombre'}
            </option>
        `).join('');
    },

    // Recolectar datos del formulario
    collectTriggerData(modal, existingTrigger = null) {
        const type = modal.querySelector('#triggerType').value;
        const name = modal.querySelector('#triggerName').value;
        const workflowId = modal.querySelector('#targetWorkflow').value;
        const workflowName = modal.querySelector('#targetWorkflow').selectedOptions[0].text;

        const trigger = {
            id: existingTrigger?.id || Date.now().toString(),
            type,
            name,
            workflowId,
            workflowName,
            enabled: existingTrigger?.enabled ?? true,
            createdAt: existingTrigger?.createdAt || new Date().toISOString()
        };

        // Datos específicos por tipo
        switch (type) {
            case 'workflow':
                const sourceWf = modal.querySelector('#sourceWorkflow');
                trigger.sourceWorkflowId = sourceWf.value;
                trigger.sourceWorkflow = sourceWf.selectedOptions[0].text;
                break;

            case 'email':
                trigger.emailAddress = modal.querySelector('#emailAddress').value;
                trigger.subject = modal.querySelector('#emailSubject').value;
                break;

            case 'schedule':
                trigger.scheduleType = modal.querySelector('#scheduleType').value;
                trigger.scheduleTime = modal.querySelector('#scheduleTime').value;
                break;

            case 'webhook':
                trigger.webhookUrl = `${window.location.origin}/api/webhook/${trigger.id}`;
                break;
        }

        return trigger;
    },

    // Activar/desactivar trigger
    toggleTrigger(index) {
        this.triggers[index].enabled = !this.triggers[index].enabled;
        this.saveTriggers();
        this.showTriggersModal();
    },

    // Editar trigger
    editTrigger(index) {
        document.querySelector('.modal-overlay').remove();
        this.showAddTriggerModal(index);
    },

    // Eliminar trigger
    deleteTrigger(index) {
        if (confirm('¿Eliminar este disparador?')) {
            this.triggers.splice(index, 1);
            this.saveTriggers();
            this.showTriggersModal();
        }
    }
};

// Inicializar cuando cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WorkflowTriggers.init());
} else {
    WorkflowTriggers.init();
}
