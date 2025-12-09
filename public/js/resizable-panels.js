// 📐 SISTEMA DE PANELES AJUSTABLES (Resizable)

const ResizablePanels = {
    init() {
        this.makeWorkflowEditorResizable();
        console.log('ResizablePanels initialized');
    },

    makeWorkflowEditorResizable() {
        const workflowView = document.getElementById('workflow-view');
        if (!workflowView) return;

        // Crear contenedor resizable
        const palette = workflowView.querySelector('.actions-palette');
        const canvas = workflowView.querySelector('.workflow-canvas');

        if (!palette || !canvas) return;

        // Envolver en contenedor flex
        const container = document.createElement('div');
        container.className = 'resizable-container';
        container.style.cssText = 'display: flex; height: 100%; gap: 0;';

        // Mover elementos al contenedor
        const parent = palette.parentElement;
        parent.insertBefore(container, palette);

        // Panel izquierdo (palette)
        const leftPanel = document.createElement('div');
        leftPanel.className = 'resizable-panel left-panel';
        leftPanel.style.cssText = 'flex: 0 0 350px; min-width: 200px; max-width: 600px; overflow-y: auto;';
        leftPanel.appendChild(palette);

        // Divisor resizable
        const divider = document.createElement('div');
        divider.className = 'panel-divider';
        divider.style.cssText = `
            flex: 0 0 4px;
            background: #334155;
            cursor: col-resize;
            position: relative;
            transition: background 0.2s;
        `;

        divider.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 40px;
                background: #475569;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            ">
                <i class="fas fa-grip-vertical" style="color: #94a3b8; font-size: 12px;"></i>
            </div>
        `;

        // Panel derecho (canvas)
        const rightPanel = document.createElement('div');
        rightPanel.className = 'resizable-panel right-panel';
        rightPanel.style.cssText = 'flex: 1; min-width: 400px; overflow: auto;';
        rightPanel.appendChild(canvas);

        // Ensamblar
        container.appendChild(leftPanel);
        container.appendChild(divider);
        container.appendChild(rightPanel);

        // Agregar funcionalidad de resize
        this.attachResizeListener(divider, leftPanel, rightPanel);

        // Hacer la paleta de acciones también resizable verticalmente
        this.makeActionsScrollable(leftPanel);
    },

    attachResizeListener(divider, leftPanel, rightPanel) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        divider.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = leftPanel.offsetWidth;

            divider.style.background = '#2563eb';
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const diff = e.clientX - startX;
            const newWidth = startWidth + diff;

            // Límites
            const minWidth = 200;
            const maxWidth = 600;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                leftPanel.style.flex = `0 0 ${newWidth}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                divider.style.background = '#334155';
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                // Guardar ancho en localStorage
                localStorage.setItem('workflow-palette-width', leftPanel.offsetWidth);
            }
        });

        // Hover effect
        divider.addEventListener('mouseenter', () => {
            if (!isResizing) {
                divider.style.background = '#475569';
            }
        });

        divider.addEventListener('mouseleave', () => {
            if (!isResizing) {
                divider.style.background = '#334155';
            }
        });

        // Restaurar ancho guardado
        const savedWidth = localStorage.getItem('workflow-palette-width');
        if (savedWidth) {
            leftPanel.style.flex = `0 0 ${savedWidth}px`;
        }
    },

    makeActionsScrollable(panel) {
        // Asegurar que la paleta sea scrollable
        panel.style.overflowY = 'auto';
        panel.style.overflowX = 'hidden';
    },

    // Hacer otros paneles ajustables (Executor, etc.)
    makeExecutorResizable() {
        const executorView = document.getElementById('executor-view');
        if (!executorView) return;

        const executorPanel = executorView.querySelector('.executor-panel');
        const monitor = executorView.querySelector('.execution-monitor');

        if (!executorPanel || !monitor) return;

        // Similar implementación para executor
        // ... código similar al de workflow
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ResizablePanels.init());
} else {
    ResizablePanels.init();
}
