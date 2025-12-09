// Library Module
const Library = {
    workflows: [],

    init() {
        document.getElementById('refreshLibrary').addEventListener('click', () => {
            this.loadWorkflows();
        });

        document.getElementById('searchWorkflows').addEventListener('input', (e) => {
            this.filterWorkflows(e.target.value);
        });

        // Cargar workflows al iniciar
        this.loadWorkflows();
    },

    async loadWorkflows() {
        try {
            showNotification('Cargando workflows...', 'info');

            const response = await fetch('http://localhost:3000/api/workflows');
            const data = await response.json();

            if (data.success) {
                this.workflows = data.workflows;
                this.renderWorkflows();
                showNotification(`${this.workflows.length} workflows cargados`, 'success');
            } else {
                showNotification('Error al cargar workflows', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión', 'error');
        }
    },

    renderWorkflows(filteredWorkflows = null) {
        const grid = document.getElementById('workflowsGrid');
        const workflowsToRender = filteredWorkflows || this.workflows;

        if (workflowsToRender.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No hay workflows guardados</p>
                    <small>Crea tu primer workflow para comenzar</small>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';

        workflowsToRender.forEach(workflow => {
            const card = this.createWorkflowCard(workflow);
            grid.appendChild(card);
        });
    },

    createWorkflowCard(workflow) {
        const card = document.createElement('div');
        card.className = 'workflow-card';

        const createdDate = new Date(workflow.createdAt).toLocaleDateString();
        const actionCount = workflow.actions ? workflow.actions.length : 0;

        card.innerHTML = `
            <h3>${workflow.name}</h3>
            <p>
                <i class="fas fa-tasks"></i> ${actionCount} acciones<br>
                <i class="fas fa-calendar"></i> Creado: ${createdDate}
            </p>
            <div class="workflow-card-footer">
                <small style="color: #64748b;">ID: ${workflow.id.substring(0, 8)}...</small>
                <div class="workflow-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="Library.loadWorkflow('${workflow.id}')" title="Cargar">
                        <i class="fas fa-folder-open"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="Library.executeWorkflow('${workflow.id}')" title="Ejecutar">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="Library.exportWorkflow('${workflow.id}')" title="Exportar">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="Library.deleteWorkflow('${workflow.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    },

    filterWorkflows(searchTerm) {
        if (!searchTerm) {
            this.renderWorkflows();
            return;
        }

        const filtered = this.workflows.filter(workflow =>
            workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderWorkflows(filtered);
    },

    loadWorkflow(id) {
        const workflow = this.workflows.find(w => w.id === id);
        if (workflow && typeof WorkflowEditor !== 'undefined') {
            WorkflowEditor.loadWorkflow(workflow);
        }
    },

    async executeWorkflow(id) {
        const workflow = this.workflows.find(w => w.id === id);
        if (!workflow) {
            showNotification('Workflow no encontrado', 'error');
            return;
        }

        // Cambiar a vista de ejecutor
        document.querySelector('[data-view="executor"]').click();

        // Configurar workflow
        AppState.currentWorkflow = workflow.actions;

        // Ejecutar
        setTimeout(() => {
            if (typeof Executor !== 'undefined') {
                Executor.execute();
            }
        }, 500);
    },

    exportWorkflow(id) {
        const workflow = this.workflows.find(w => w.id === id);
        if (!workflow) {
            showNotification('Workflow no encontrado', 'error');
            return;
        }

        downloadJSON(workflow, `${workflow.name}.json`);
        showNotification('Workflow exportado', 'success');
    },

    async deleteWorkflow(id) {
        if (!confirm('¿Estás seguro de eliminar este workflow?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/workflows/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Workflow eliminado', 'success');
                this.loadWorkflows();
            } else {
                showNotification('Error al eliminar workflow', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error de conexión', 'error');
        }
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Library.init());
} else {
    Library.init();
}
