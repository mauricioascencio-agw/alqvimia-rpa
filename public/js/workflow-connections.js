// 🔗 SISTEMA DE CONEXIONES VISUALES PARA WORKFLOW

const WorkflowConnections = {
    connections: [],
    svgCanvas: null,
    draggedNode: null,
    tempLine: null,

    // Inicializar sistema de conexiones
    init() {
        this.createSVGCanvas();
        this.attachEventListeners();
    },

    // Crear canvas SVG para las líneas
    createSVGCanvas() {
        const canvas = document.getElementById('workflowCanvas');
        if (!canvas) return;

        // Crear SVG overlay
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'connectionsCanvas';
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        canvas.style.position = 'relative';
        canvas.appendChild(svg);
        this.svgCanvas = svg;
    },

    // Adjuntar event listeners
    attachEventListeners() {
        // Observer para detectar cambios en el workflow
        const canvas = document.getElementById('workflowCanvas');
        if (!canvas) return;

        const observer = new MutationObserver(() => {
            this.redrawConnections();
        });

        observer.observe(canvas, {
            childList: true,
            subtree: true
        });

        // Redimensionamiento
        window.addEventListener('resize', () => {
            this.redrawConnections();
        });
    },

    // Agregar conexión entre dos nodos
    addConnection(fromIndex, toIndex) {
        // Verificar que no exista ya
        const exists = this.connections.some(
            conn => conn.from === fromIndex && conn.to === toIndex
        );

        if (!exists) {
            this.connections.push({ from: fromIndex, to: toIndex });
            this.redrawConnections();
        }
    },

    // Remover conexión
    removeConnection(fromIndex, toIndex) {
        this.connections = this.connections.filter(
            conn => !(conn.from === fromIndex && conn.to === toIndex)
        );
        this.redrawConnections();
    },

    // Redibujar todas las conexiones
    redrawConnections() {
        if (!this.svgCanvas) return;

        // Limpiar SVG
        this.svgCanvas.innerHTML = '';

        // Definir marcador de flecha
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3, 0 6');
        polygon.setAttribute('fill', '#60a5fa');

        marker.appendChild(polygon);
        defs.appendChild(marker);
        this.svgCanvas.appendChild(defs);

        // Obtener todos los nodos
        const nodes = document.querySelectorAll('.workflow-action-item');

        // Conectar nodos consecutivos automáticamente
        for (let i = 0; i < nodes.length - 1; i++) {
            this.drawConnection(nodes[i], nodes[i + 1]);
        }

        // Dibujar conexiones personalizadas
        this.connections.forEach(conn => {
            if (nodes[conn.from] && nodes[conn.to]) {
                this.drawConnection(nodes[conn.from], nodes[conn.to], true);
            }
        });
    },

    // Dibujar una conexión entre dos nodos
    drawConnection(fromNode, toNode, custom = false) {
        if (!this.svgCanvas || !fromNode || !toNode) return;

        const canvas = document.getElementById('workflowCanvas');
        const canvasRect = canvas.getBoundingClientRect();

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        // Calcular puntos de conexión
        const fromX = fromRect.left - canvasRect.left + fromRect.width / 2;
        const fromY = fromRect.bottom - canvasRect.top;
        const toX = toRect.left - canvasRect.left + toRect.width / 2;
        const toY = toRect.top - canvasRect.top;

        // Crear path curvo
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const midY = (fromY + toY) / 2;
        const d = `M ${fromX} ${fromY}
                   C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', custom ? '#f59e0b' : '#60a5fa');
        path.setAttribute('stroke-width', custom ? '3' : '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.setAttribute('opacity', '0.8');

        this.svgCanvas.appendChild(path);
    },

    // Limpiar todas las conexiones
    clearConnections() {
        this.connections = [];
        this.redrawConnections();
    }
};

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el canvas esté listo
    setTimeout(() => {
        WorkflowConnections.init();
    }, 500);
});
