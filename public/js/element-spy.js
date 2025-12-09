// Element Spy Module
const ElementSpy = {
    active: false,
    targetWindow: null,

    init() {
        document.getElementById('launchSpy').addEventListener('click', () => {
            this.launchSpyWindow();
        });

        document.getElementById('addToWorkflow').addEventListener('click', () => {
            this.addElementToWorkflow();
        });

        document.getElementById('copySelector').addEventListener('click', () => {
            this.copySelectorToClipboard();
        });
    },

    launchSpyWindow() {
        const url = document.getElementById('spyUrl').value;
        if (!url) {
            showNotification('Por favor ingresa una URL válida', 'error');
            return;
        }

        showNotification('Abriendo ventana de espionaje...', 'info');

        // Crear ventana nueva
        this.targetWindow = window.open(url, 'ElementSpyWindow', 'width=1200,height=800');

        if (!this.targetWindow) {
            showNotification('Error: Permitir ventanas emergentes', 'error');
            return;
        }

        // Esperar a que cargue la página
        const checkLoad = setInterval(() => {
            try {
                if (this.targetWindow.document.readyState === 'complete') {
                    clearInterval(checkLoad);
                    this.injectSpyScript();
                    showNotification('Element Spy activado - Haz clic en cualquier elemento', 'success');
                }
            } catch (e) {
                // Error de CORS - página externa
                clearInterval(checkLoad);
                showNotification('Modo limitado: Esta es una página externa. Funcionalidad reducida.', 'warning');
                this.showExternalPageInfo();
            }
        }, 100);
    },

    injectSpyScript() {
        if (!this.targetWindow) return;

        const doc = this.targetWindow.document;

        // Crear overlay
        const overlay = doc.createElement('div');
        overlay.id = 'element-spy-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(37, 99, 235, 0.1);
            z-index: 999999;
            pointer-events: none;
            border: 3px solid #2563eb;
        `;
        doc.body.appendChild(overlay);

        // Crear tooltip
        const tooltip = doc.createElement('div');
        tooltip.id = 'element-spy-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #1e293b;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: Arial;
            font-size: 12px;
            z-index: 9999999;
            pointer-events: none;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        doc.body.appendChild(tooltip);

        // Crear highlight
        const highlight = doc.createElement('div');
        highlight.id = 'element-spy-highlight';
        highlight.style.cssText = `
            position: absolute;
            border: 2px solid #2563eb;
            background: rgba(37, 99, 235, 0.2);
            pointer-events: none;
            z-index: 9999998;
            display: none;
        `;
        doc.body.appendChild(highlight);

        // Event listeners
        doc.addEventListener('mousemove', (e) => {
            const element = doc.elementFromPoint(e.clientX, e.clientY);
            if (element && element.id !== 'element-spy-tooltip' && element.id !== 'element-spy-highlight') {
                this.highlightElement(element, tooltip, highlight);
            }
        });

        doc.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const element = doc.elementFromPoint(e.clientX, e.clientY);
            if (element && element.id !== 'element-spy-tooltip' && element.id !== 'element-spy-highlight') {
                this.selectElement(element);
            }
        }, true);
    },

    highlightElement(element, tooltip, highlight) {
        const rect = element.getBoundingClientRect();
        const scrollX = this.targetWindow.scrollX;
        const scrollY = this.targetWindow.scrollY;

        highlight.style.display = 'block';
        highlight.style.left = (rect.left + scrollX) + 'px';
        highlight.style.top = (rect.top + scrollY) + 'px';
        highlight.style.width = rect.width + 'px';
        highlight.style.height = rect.height + 'px';

        tooltip.style.display = 'block';
        tooltip.style.left = (rect.left + scrollX) + 'px';
        tooltip.style.top = (rect.top + scrollY - 30) + 'px';
        tooltip.textContent = `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ')[0] : ''}`;
    },

    selectElement(element) {
        const elementData = {
            tag: element.tagName.toLowerCase(),
            id: element.id || '',
            className: element.className || '',
            name: element.name || '',
            text: element.textContent.substring(0, 50) || '',
            attributes: {}
        };

        // Obtener atributos
        for (let attr of element.attributes) {
            elementData.attributes[attr.name] = attr.value;
        }

        // Generar selectores
        const selectors = generateSelector(element);

        // Actualizar UI
        this.displayElementInfo(elementData, selectors);
        AppState.selectedElement = { element: elementData, selectors };

        showNotification('Elemento seleccionado', 'success');
    },

    displayElementInfo(data, selectors) {
        const inspector = document.getElementById('elementInspector');
        inspector.style.display = 'block';

        document.getElementById('elemTag').value = data.tag;
        document.getElementById('elemId').value = data.id;
        document.getElementById('elemClass').value = data.className;
        document.getElementById('elemName').value = data.name;

        // Mostrar selectores
        const selectorList = document.getElementById('selectorList');
        selectorList.innerHTML = '';

        selectors.forEach(selector => {
            const item = document.createElement('div');
            item.className = 'selector-item';
            item.innerHTML = `
                <div>
                    <strong>${selector.type}:</strong>
                    <code>${selector.value}</code>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="ElementSpy.copyText('${selector.value}')">
                    <i class="fas fa-copy"></i>
                </button>
            `;
            selectorList.appendChild(item);
        });

        // Scroll al inspector
        inspector.scrollIntoView({ behavior: 'smooth' });
    },

    addElementToWorkflow() {
        if (!AppState.selectedElement) {
            showNotification('No hay elemento seleccionado', 'error');
            return;
        }

        const selector = AppState.selectedElement.selectors[0].value;

        // Mostrar modal para elegir acción
        this.showActionModal(selector);
    },

    showActionModal(selector) {
        const modal = document.getElementById('actionModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="form-group">
                <label>Tipo de Acción:</label>
                <select id="actionType" class="form-control">
                    <option value="click">Click</option>
                    <option value="type">Escribir Texto</option>
                    <option value="extract">Extraer Texto</option>
                    <option value="hover">Hover</option>
                </select>
            </div>
            <div class="form-group" id="textInputGroup" style="display:none; margin-top: 1rem;">
                <label>Texto a escribir:</label>
                <input type="text" id="actionText" class="form-control" placeholder="Ingresa el texto">
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Selector:</label>
                <input type="text" id="actionSelector" class="form-control" value="${selector}" readonly>
            </div>
        `;

        modal.classList.add('active');

        document.getElementById('actionType').addEventListener('change', (e) => {
            const textGroup = document.getElementById('textInputGroup');
            textGroup.style.display = e.target.value === 'type' ? 'block' : 'none';
        });

        document.getElementById('confirmAction').onclick = () => {
            const type = document.getElementById('actionType').value;
            const action = {
                type,
                selector,
                delay: 500
            };

            if (type === 'type') {
                action.text = document.getElementById('actionText').value;
            }

            AppState.currentWorkflow.push(action);
            showNotification(`Acción "${type}" agregada al workflow`, 'success');
            modal.classList.remove('active');
        };

        document.getElementById('cancelAction').onclick = () => {
            modal.classList.remove('active');
        };

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
        };
    },

    copySelectorToClipboard() {
        if (!AppState.selectedElement) {
            showNotification('No hay elemento seleccionado', 'error');
            return;
        }

        const selector = AppState.selectedElement.selectors[0].value;
        this.copyText(selector);
    },

    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Selector copiado al portapapeles', 'success');
        });
    },

    showExternalPageInfo() {
        const inspector = document.getElementById('elementInspector');
        inspector.style.display = 'block';
        inspector.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                <h3>Página Externa Detectada</h3>
                <p>Esta página está en un dominio diferente. Por seguridad del navegador (CORS),
                algunas funcionalidades están limitadas.</p>
                <p><strong>Solución:</strong> Usa el modo de grabación o ingresa manualmente los selectores.</p>
            </div>
        `;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ElementSpy.init());
} else {
    ElementSpy.init();
}
