// 🔗 INTEGRADOR DE COMPONENTES GENERADOS
// Integra componentes generados en el workflow y grabador

const ComponentIntegrator = {
    init() {
        this.injectGeneratedComponents();
        this.observeComponentChanges();
        console.log('ComponentIntegrator initialized');
    },

    // Inyectar componentes generados en el palette
    injectGeneratedComponents() {
        if (typeof ComponentGenerator === 'undefined') {
            console.warn('ComponentIntegrator: ComponentGenerator no disponible');
            return;
        }

        const generatedComponents = ComponentGenerator.generatedComponents || [];
        console.log(`ComponentIntegrator: Encontrados ${generatedComponents.length} componentes generados`);

        if (generatedComponents.length === 0) return;

        // Buscar o crear la categoría "Componentes Personalizados"
        const palette = document.querySelector('.actions-palette');
        if (!palette) return;

        // Verificar si ya existe la categoría
        let customCategory = document.getElementById('custom-components-category');

        if (!customCategory) {
            // Crear la categoría si no existe
            customCategory = document.createElement('div');
            customCategory.id = 'custom-components-category';
            customCategory.className = 'action-category';
            customCategory.innerHTML = `
                <div class="category-header">
                    <i class="fas fa-magic"></i>
                    <span>Componentes Generados (${generatedComponents.length})</span>
                </div>
                <div class="palette-items" id="custom-components-list"></div>
            `;

            // Insertar después del generador IA
            const generatorSection = palette.querySelector('div[style*="background: linear-gradient"]');
            if (generatorSection) {
                generatorSection.after(customCategory);
            } else {
                palette.appendChild(customCategory);
            }
        }

        // Actualizar la lista de componentes
        const componentsList = document.getElementById('custom-components-list');
        if (!componentsList) return;

        // Limpiar lista actual
        componentsList.innerHTML = '';

        // Agregar cada componente generado
        generatedComponents.forEach(component => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.draggable = true;
            item.setAttribute('data-action', component.id);
            item.innerHTML = `
                <i class="fas ${component.icon}"></i>
                <span>${component.title}</span>
            `;

            componentsList.appendChild(item);
        });

        // Actualizar contador en el header
        const header = customCategory.querySelector('.category-header span');
        if (header) {
            header.textContent = `Componentes Generados (${generatedComponents.length})`;
        }

        // Inicializar drag and drop para los nuevos componentes
        this.initializeDragAndDrop(componentsList);
    },

    // Inicializar drag and drop para componentes generados
    initializeDragAndDrop(container) {
        const items = container.querySelectorAll('.palette-item');

        items.forEach(item => {
            // Configurar el evento dragstart igual que en workflow-editor.js
            item.addEventListener('dragstart', (e) => {
                const actionType = item.getAttribute('data-action');

                // Compatibilidad con WorkflowEditor si existe
                if (typeof WorkflowEditor !== 'undefined' && WorkflowEditor.draggedAction !== undefined) {
                    WorkflowEditor.draggedAction = actionType;
                }

                e.dataTransfer.setData('text/plain', actionType);
                e.dataTransfer.effectAllowed = 'copy';
            });

            item.addEventListener('dragend', () => {
                // Limpiar draggedAction si existe WorkflowEditor
                if (typeof WorkflowEditor !== 'undefined' && WorkflowEditor.draggedAction !== undefined) {
                    WorkflowEditor.draggedAction = null;
                }
            });
        });
    },

    // Observar cambios en los componentes generados
    observeComponentChanges() {
        // Escuchar cambios en localStorage para componentes generados
        window.addEventListener('storage', (e) => {
            if (e.key === 'generated_components') {
                this.injectGeneratedComponents();
            }
        });

        // También escuchar eventos personalizados
        document.addEventListener('componentsUpdated', () => {
            this.injectGeneratedComponents();
        });
    },

    // Refrescar componentes
    refresh() {
        this.injectGeneratedComponents();
    },

    // Integrar componente al grabador
    integrateToRecorder(component) {
        // El grabador usará MCPProperties automáticamente
        // Solo necesitamos asegurarnos de que el componente esté registrado
        if (typeof MCPProperties !== 'undefined' && !MCPProperties[component.id]) {
            MCPProperties[component.id] = {
                title: component.title,
                icon: component.icon,
                properties: component.properties
            };
        }
    },

    // Integrar todos los componentes generados al grabador
    integrateAllToRecorder() {
        if (typeof ComponentGenerator === 'undefined') return;

        const generatedComponents = ComponentGenerator.generatedComponents || [];
        generatedComponents.forEach(component => {
            this.integrateToRecorder(component);
        });
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar a que ComponentGenerator y WorkflowEditor se inicialicen
        setTimeout(() => {
            ComponentIntegrator.init();
            ComponentIntegrator.integrateAllToRecorder();
        }, 2000);
    });
} else {
    setTimeout(() => {
        ComponentIntegrator.init();
        ComponentIntegrator.integrateAllToRecorder();
    }, 2000);
}

// Refrescar al cambiar a la vista de workflows
document.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (navItem && navItem.getAttribute('data-view') === 'workflows') {
        // Dar tiempo para que se renderice la vista
        setTimeout(() => ComponentIntegrator.refresh(), 500);
    }
});

// Exponer globalmente para uso en otros módulos
window.ComponentIntegrator = ComponentIntegrator;
