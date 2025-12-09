// 🔢 GESTOR DE VARIABLES DEL WORKFLOW
// Sistema completo para detectar, crear, editar y usar variables

const VariablesManager = {
    variables: [],
    currentWorkflow: null,

    init() {
        console.log('VariablesManager initialized');
    },

    // Detectar todas las variables en las acciones del workflow
    detectVariables(actions) {
        const detectedVars = new Set();

        actions.forEach(action => {
            // Buscar variables en set_variable y get_variable
            if (action.type === 'set_variable' || action.type === 'get_variable') {
                if (action.variableName) {
                    detectedVars.add(action.variableName);
                }
            }

            // Buscar variables en propiedades de otras acciones
            // Buscar patrón ${nombreVariable} en todas las propiedades
            Object.keys(action).forEach(key => {
                const value = action[key];
                if (typeof value === 'string') {
                    const matches = value.match(/\$\{([^}]+)\}/g);
                    if (matches) {
                        matches.forEach(match => {
                            const varName = match.slice(2, -1); // Remover ${ y }
                            detectedVars.add(varName);
                        });
                    }
                }
            });

            // Buscar en saveName, outputVariable, etc.
            ['saveName', 'outputVariable', 'destination', 'resultVariable'].forEach(prop => {
                if (action[prop]) {
                    detectedVars.add(action[prop]);
                }
            });
        });

        // Actualizar lista de variables
        this.variables = Array.from(detectedVars).map(name => {
            // Buscar si ya existe la variable con su metadata
            const existing = this.variables.find(v => v.name === name);
            if (existing) {
                return existing;
            }

            // Crear nueva variable
            return {
                name: name,
                type: this.inferType(name),
                description: '',
                defaultValue: '',
                scope: 'workflow',
                createdAt: new Date().toISOString()
            };
        });

        return this.variables;
    },

    // Inferir tipo de variable por su nombre
    inferType(name) {
        const lowerName = name.toLowerCase();

        if (lowerName.includes('count') || lowerName.includes('total') || lowerName.includes('num')) {
            return 'number';
        }
        if (lowerName.includes('is') || lowerName.includes('has') || lowerName.includes('enable')) {
            return 'boolean';
        }
        if (lowerName.includes('list') || lowerName.includes('array') || lowerName.includes('items')) {
            return 'array';
        }
        if (lowerName.includes('data') || lowerName.includes('result') || lowerName.includes('response')) {
            return 'object';
        }

        return 'string'; // Por defecto
    },

    // Obtener todas las variables
    getAll() {
        return this.variables;
    },

    // Obtener variable por nombre
    get(name) {
        return this.variables.find(v => v.name === name);
    },

    // Crear o actualizar variable
    set(variable) {
        const index = this.variables.findIndex(v => v.name === variable.name);

        if (index !== -1) {
            this.variables[index] = { ...this.variables[index], ...variable };
        } else {
            this.variables.push({
                ...variable,
                createdAt: variable.createdAt || new Date().toISOString()
            });
        }

        this.renderVariablesPanel();
        return this.variables[index !== -1 ? index : this.variables.length - 1];
    },

    // Eliminar variable
    delete(name) {
        this.variables = this.variables.filter(v => v.name !== name);
        this.renderVariablesPanel();
    },

    // Renderizar panel de variables en el workflow
    renderVariablesPanel() {
        const container = document.getElementById('workflowVariablesPanel');
        if (!container) return;

        if (this.variables.length === 0) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #64748b;">
                    <i class="fas fa-code" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <h3 style="margin: 0;">No hay variables detectadas</h3>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Las variables se detectarán automáticamente cuando uses acciones</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #e2e8f0; font-size: 1rem;">
                        <i class="fas fa-code"></i> Variables (${this.variables.length})
                    </h3>
                    <button class="btn btn-sm btn-primary" onclick="VariablesManager.showCreateModal()">
                        <i class="fas fa-plus"></i> Nueva
                    </button>
                </div>

                <div class="variables-list">
                    ${this.variables.map(variable => this.renderVariableItem(variable)).join('')}
                </div>
            </div>
        `;
    },

    // Renderizar item de variable
    renderVariableItem(variable) {
        const typeIcons = {
            string: 'fa-font',
            number: 'fa-hashtag',
            boolean: 'fa-check-square',
            array: 'fa-list',
            object: 'fa-cube'
        };

        const typeColors = {
            string: '#10b981',
            number: '#3b82f6',
            boolean: '#f59e0b',
            array: '#8b5cf6',
            object: '#ef4444'
        };

        return `
            <div class="variable-item" data-variable="${variable.name}">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="variable-icon" style="background: ${typeColors[variable.type]};">
                        <i class="fas ${typeIcons[variable.type]}"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <strong style="color: #e2e8f0; font-size: 0.95rem;">${variable.name}</strong>
                            <span class="badge" style="background: ${typeColors[variable.type]}; font-size: 0.75rem;">
                                ${variable.type}
                            </span>
                        </div>
                        ${variable.description ? `
                            <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem;">
                                ${variable.description}
                            </div>
                        ` : ''}
                        ${variable.defaultValue ? `
                            <div style="color: #64748b; font-size: 0.8rem; margin-top: 0.25rem; font-family: monospace;">
                                Default: ${variable.defaultValue}
                            </div>
                        ` : ''}
                    </div>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-sm btn-secondary" onclick="VariablesManager.showEditModal('${variable.name}')"
                                title="Editar variable">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="VariablesManager.confirmDelete('${variable.name}')"
                                title="Eliminar variable">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Mostrar modal de crear variable
    showCreateModal() {
        this.showVariableModal(null);
    },

    // Mostrar modal de editar variable
    showEditModal(name) {
        const variable = this.get(name);
        if (variable) {
            this.showVariableModal(variable);
        }
    },

    // Modal para crear/editar variable
    showVariableModal(variable = null) {
        const isEdit = variable !== null;
        const v = variable || {
            name: '',
            type: 'string',
            description: '',
            defaultValue: '',
            scope: 'workflow'
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-code"></i>
                        ${isEdit ? 'Editar' : 'Crear'} Variable
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label><i class="fas fa-tag"></i> Nombre de Variable *</label>
                        <input type="text" id="varName" class="form-control" required
                               value="${v.name}" placeholder="miVariable" ${isEdit ? 'readonly' : ''}>
                        <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                            Usa camelCase o snake_case. Sin espacios ni caracteres especiales.
                        </small>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-shapes"></i> Tipo de Dato *</label>
                        <select id="varType" class="form-control">
                            <option value="string" ${v.type === 'string' ? 'selected' : ''}>String (Texto)</option>
                            <option value="number" ${v.type === 'number' ? 'selected' : ''}>Number (Número)</option>
                            <option value="boolean" ${v.type === 'boolean' ? 'selected' : ''}>Boolean (Verdadero/Falso)</option>
                            <option value="array" ${v.type === 'array' ? 'selected' : ''}>Array (Lista)</option>
                            <option value="object" ${v.type === 'object' ? 'selected' : ''}>Object (Objeto)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-info-circle"></i> Descripción (Opcional)</label>
                        <textarea id="varDescription" class="form-control" rows="3"
                                  placeholder="Describe para qué sirve esta variable...">${v.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-code"></i> Valor por Defecto (Opcional)</label>
                        <input type="text" id="varDefaultValue" class="form-control"
                               value="${v.defaultValue}" placeholder="Valor inicial">
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-layer-group"></i> Alcance</label>
                        <select id="varScope" class="form-control">
                            <option value="workflow" ${v.scope === 'workflow' ? 'selected' : ''}>Workflow (Este flujo)</option>
                            <option value="global" ${v.scope === 'global' ? 'selected' : ''}>Global (Todos los flujos)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-success" onclick="VariablesManager.saveVariable(${isEdit})">
                        <i class="fas fa-save"></i> ${isEdit ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    },

    // Guardar variable desde modal
    saveVariable(isEdit) {
        const name = document.getElementById('varName').value.trim();
        const type = document.getElementById('varType').value;
        const description = document.getElementById('varDescription').value.trim();
        const defaultValue = document.getElementById('varDefaultValue').value.trim();
        const scope = document.getElementById('varScope').value;

        if (!name) {
            showNotification('El nombre de la variable es requerido', 'error');
            return;
        }

        // Validar nombre de variable
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            showNotification('Nombre de variable inválido. Usa solo letras, números y guiones bajos.', 'error');
            return;
        }

        const variable = {
            name,
            type,
            description,
            defaultValue,
            scope
        };

        this.set(variable);

        document.querySelector('.modal-overlay').remove();
        showNotification(`Variable "${name}" ${isEdit ? 'actualizada' : 'creada'} exitosamente`, 'success');
    },

    // Confirmar eliminación
    confirmDelete(name) {
        if (confirm(`¿Estás seguro de eliminar la variable "${name}"?\n\nEsta acción no afectará las referencias en las acciones.`)) {
            this.delete(name);
            showNotification(`Variable "${name}" eliminada`, 'success');
        }
    },

    // Obtener lista de variables para dropdowns
    getVariablesList() {
        return this.variables.map(v => ({
            value: v.name,
            label: `${v.name} (${v.type})`
        }));
    },

    // Renderizar selector de variables para usar en campos
    renderVariableSelector(currentValue = '', fieldId = 'variableSelector') {
        const variables = this.getVariablesList();

        return `
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; align-items: center;">
                <label style="display: flex; align-items: center; gap: 0.25rem; cursor: pointer; white-space: nowrap;">
                    <input type="checkbox" id="${fieldId}_useVar"
                           ${currentValue.startsWith('${') ? 'checked' : ''}
                           onchange="VariablesManager.toggleVariableMode('${fieldId}')">
                    <span style="font-size: 0.9rem;">Usar variable</span>
                </label>
                <div id="${fieldId}_container">
                    ${this.renderVariableField(fieldId, currentValue, variables)}
                </div>
            </div>
        `;
    },

    renderVariableField(fieldId, currentValue, variables) {
        const isVariable = currentValue.startsWith('${');
        const value = isVariable ? currentValue.slice(2, -1) : currentValue;

        if (isVariable) {
            return `
                <select id="${fieldId}" class="form-control">
                    <option value="">Seleccionar variable...</option>
                    ${variables.map(v => `
                        <option value="\${${v.value}}" ${value === v.value ? 'selected' : ''}>
                            ${v.label}
                        </option>
                    `).join('')}
                </select>
            `;
        } else {
            return `
                <input type="text" id="${fieldId}" class="form-control" value="${value}"
                       placeholder="C:/ruta/archivo.xlsx">
            `;
        }
    },

    toggleVariableMode(fieldId) {
        const useVar = document.getElementById(`${fieldId}_useVar`).checked;
        const container = document.getElementById(`${fieldId}_container`);
        const currentField = document.getElementById(fieldId);
        const currentValue = currentField.value;

        const variables = this.getVariablesList();
        container.innerHTML = this.renderVariableField(fieldId, useVar ? '${' : currentValue, variables);
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VariablesManager.init());
} else {
    VariablesManager.init();
}
