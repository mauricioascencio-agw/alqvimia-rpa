// Executor Module
const Executor = {
    executing: false,

    init() {
        document.getElementById('executeWorkflow').addEventListener('click', () => {
            this.execute();
        });

        document.getElementById('stopExecution').addEventListener('click', () => {
            this.stop();
        });
    },

    async execute() {
        // Obtener workflow actual
        let workflow = [];

        if (WorkflowEditor.currentWorkflow && WorkflowEditor.currentWorkflow.length > 0) {
            workflow = WorkflowEditor.currentWorkflow;
        } else if (Recorder.actions && Recorder.actions.length > 0) {
            workflow = Recorder.actions;
        } else if (AppState.currentWorkflow && AppState.currentWorkflow.length > 0) {
            workflow = AppState.currentWorkflow;
        } else {
            showNotification('No hay workflow para ejecutar. Crea uno primero.', 'error');
            return;
        }

        this.executing = true;

        // Actualizar UI
        document.getElementById('executeWorkflow').disabled = true;
        document.getElementById('stopExecution').disabled = false;

        const monitor = document.getElementById('executionMonitor');
        const progressSection = document.getElementById('progressSection');

        progressSection.style.display = 'block';

        addLogEntry('='.repeat(50), 'info');
        addLogEntry('Iniciando ejecución de workflow', 'info');
        addLogEntry(`Total de acciones: ${workflow.length}`, 'info');
        addLogEntry('='.repeat(50), 'info');

        // Emitir al servidor para ejecución
        socket.emit('execute-workflow', workflow);

        showNotification('Ejecutando workflow...', 'info');
    },

    stop() {
        this.executing = false;

        document.getElementById('executeWorkflow').disabled = false;
        document.getElementById('stopExecution').disabled = true;

        const monitor = document.getElementById('executionMonitor');
        monitor.innerHTML = `
            <div class="monitor-idle">
                <i class="fas fa-stop-circle" style="color: #ef4444;"></i>
                <p>Ejecución detenida</p>
            </div>
        `;

        addLogEntry('Ejecución detenida por el usuario', 'error');
        showNotification('Ejecución detenida', 'warning');
    },

    reset() {
        this.executing = false;

        document.getElementById('executeWorkflow').disabled = false;
        document.getElementById('stopExecution').disabled = true;

        const monitor = document.getElementById('executionMonitor');
        monitor.innerHTML = `
            <div class="monitor-idle">
                <i class="fas fa-robot"></i>
                <p>Esperando ejecución...</p>
            </div>
        `;

        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = 'none';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Executor.init());
} else {
    Executor.init();
}
