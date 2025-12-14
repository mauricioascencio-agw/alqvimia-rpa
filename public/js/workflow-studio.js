/**
 * Workflow Studio - Gestor del nuevo diseño estilo UiPath/Automation Anywhere
 */

const WorkflowStudio = {
    currentWorkflow: [],
    selectedStep: null,
    draggedAction: null,
    tabs: ['main'],
    activeTab: 'main',

    init() {
        console.log('🎨 Inicializando Workflow Studio');

        // Prevenir inicialización duplicada
        if (this._dragDropInitialized) {
            console.log('⚠️ WorkflowStudio ya estaba inicializado');
            return;
        }

        // Inicializar inmediatamente en lugar de setTimeout
        try {
            this.setupDragAndDrop();
            this.setupEventListeners();
            this.updateStepsCount();
            this._dragDropInitialized = true;
            console.log('✅ Workflow Studio inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Workflow Studio:', error);
        }
    },

    setupEventListeners() {
        // OPTIMIZACIÓN: Eliminado setInterval - No es necesario polling
        // La actualización del estado se maneja mediante eventos en app.js
        console.log('✅ Event listeners configurados (sin polling)');
    },

    setupDragAndDrop() {
        // Configurar drag en action items
        const actionItems = document.querySelectorAll('.action-item');
        console.log(`🔧 Configurando drag & drop para ${actionItems.length} elementos`);

        if (actionItems.length === 0) {
            console.warn('⚠️ No se encontraron action-item elements para drag & drop');
            return;
        }

        actionItems.forEach(item => {
            // Verificar que el item es draggable
            if (!item.hasAttribute('draggable')) {
                item.setAttribute('draggable', 'true');
                console.log('📝 Añadido draggable=true a:', item.getAttribute('data-action'));
            }

            item.addEventListener('dragstart', (e) => {
                this.draggedAction = item.getAttribute('data-action');
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', this.draggedAction);
                item.style.opacity = '0.5';
                item.classList.add('dragging');
                console.log('🎯 Arrastrando:', this.draggedAction);
            });

            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
                item.classList.remove('dragging');
                console.log('🔚 Drag end:', this.draggedAction);
            });
        });

        // Configurar drop zone en el canvas
        const canvas = document.getElementById('workflowCanvas');
        if (!canvas) {
            console.error('❌ No se encontró workflowCanvas element');
            return;
        }

        console.log('✅ Canvas encontrado, configurando drop handlers');

        // Importante: Remover event listeners previos si existen
        canvas.removeEventListener('dragover', this._boundDragOver);
        canvas.removeEventListener('dragleave', this._boundDragLeave);
        canvas.removeEventListener('drop', this._boundDrop);

        // Crear funciones bound para poder removerlas después
        this._boundDragOver = this.handleDragOver.bind(this);
        this._boundDragLeave = this.handleDragLeave.bind(this);
        this._boundDrop = this.handleDrop.bind(this);

        // Añadir event listeners al canvas
        canvas.addEventListener('dragover', this._boundDragOver);
        canvas.addEventListener('dragleave', this._boundDragLeave);
        canvas.addEventListener('drop', this._boundDrop);

        console.log('✅ Drop handlers configurados en canvas');
    },

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        const canvas = document.getElementById('workflowCanvas');
        if (canvas) {
            canvas.classList.add('drag-over');
        }
        // Solo logear ocasionalmente para no saturar
        if (!this._lastDragOverLog || Date.now() - this._lastDragOverLog > 500) {
            console.log('↔️ DRAGOVER: sobre canvas');
            this._lastDragOverLog = Date.now();
        }
    },

    handleDragLeave(event) {
        const canvas = document.getElementById('workflowCanvas');
        if (canvas && event.target === canvas) {
            canvas.classList.remove('drag-over');
            console.log('↩️ DRAGLEAVE: salió del canvas');
        }
    },

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        const canvas = document.getElementById('workflowCanvas');
        if (canvas) {
            canvas.classList.remove('drag-over');
        }

        console.log('📦 DROP EVENT FIRED!');
        console.log('   draggedAction:', this.draggedAction);
        console.log('   dataTransfer:', event.dataTransfer.getData('text/plain'));

        if (this.draggedAction) {
            console.log('✅ Añadiendo step:', this.draggedAction);
            this.addStep(this.draggedAction);
            this.draggedAction = null;
            console.log('✅ Step añadido al workflow exitosamente');
        } else {
            console.warn('⚠️ WARNING: No hay acción para soltar (draggedAction es null)');
            // Intentar obtener del dataTransfer como fallback
            const actionFromTransfer = event.dataTransfer.getData('text/plain');
            if (actionFromTransfer) {
                console.log('🔄 Usando acción del dataTransfer:', actionFromTransfer);
                this.addStep(actionFromTransfer);
            }
        }
    },

    addStep(actionType) {
        const step = {
            id: `step-${Date.now()}`,
            type: actionType,
            name: this.getActionName(actionType),
            config: {}
        };

        this.currentWorkflow.push(step);
        this.renderWorkflow();
        this.updateStepsCount();

        console.log('✅ Step añadido:', step);
    },

    getActionName(actionType) {
        const names = {
            // Browser
            'browser_open': 'Abrir Navegador',
            'navigate': 'Navegar a URL',
            'click': 'Hacer Clic',
            'type': 'Escribir Texto',
            'extract_text': 'Extraer Texto',
            'screenshot': 'Captura de Pantalla',
            'scroll': 'Hacer Scroll',
            'browser_close': 'Cerrar Navegador',
            // Active Directory
            'ad_connect': 'Conectar AD',
            'ad_get_user': 'Obtener Usuario',
            'ad_create_user': 'Crear Usuario',
            'ad_disable_user': 'Deshabilitar Usuario',
            'ad_add_to_group': 'Agregar a Grupo',
            // AI
            'ai_text_generation': 'Generar Texto IA',
            'ai_sentiment': 'Análisis de Sentimiento',
            'ai_classification': 'Clasificación IA',
            'ai_translation': 'Traducción IA',
            // Database
            'db_connect': 'Conectar Base de Datos',
            'db_query': 'Ejecutar Consulta',
            'db_insert': 'Insertar Datos',
            'db_disconnect': 'Desconectar BD',
            // Files
            'file_read': 'Leer Archivo',
            'file_write': 'Escribir Archivo',
            'file_copy': 'Copiar Archivo',
            'file_move': 'Mover Archivo',
            'file_delete': 'Eliminar Archivo',
            'file_exists': 'Archivo Existe',
            // Email
            'email_send': 'Enviar Email',
            'email_read': 'Leer Email',
            'email_download_attachment': 'Descargar Adjunto',
            // Control Flow
            'if_condition': 'Si / Condición',
            'for_loop': 'Bucle For',
            'while_loop': 'Bucle While',
            'delay': 'Esperar/Delay',
            'try_catch': 'Try/Catch',
            // Excel
            'excel_read': 'Leer Excel',
            'excel_write': 'Escribir Excel',
            'excel_close': 'Cerrar Excel',
            // PDF
            'pdf_read': 'Leer PDF',
            'pdf_create': 'Crear PDF',
            // OCR
            'ocr_image': 'OCR Imagen',
            'ocr_pdf': 'OCR PDF',
            // Variables
            'set_variable': 'Establecer Variable',
            'get_variable': 'Obtener Variable',
            // Scripts
            'run_javascript': 'Ejecutar JavaScript',
            'run_python': 'Ejecutar Python',
            'run_powershell': 'Ejecutar PowerShell',
            // REST
            'rest_get': 'GET Request',
            'rest_post': 'POST Request',
            'rest_put': 'PUT Request',
            'rest_delete': 'DELETE Request',
            // SAP
            'sap_connect': 'Conectar SAP',
            'sap_get_data': 'Obtener Datos SAP',
            'sap_create_order': 'Crear Orden SAP',
            // Microsoft 365
            'm365_calendar': 'M365 Calendario',
            'm365_excel': 'M365 Excel',
            'm365_onedrive': 'M365 OneDrive',
            'm365_outlook': 'M365 Outlook',
            // Mouse & Keyboard
            'mouse_click': 'Click Mouse',
            'mouse_move': 'Mover Mouse',
            'keyboard_type': 'Teclear',
            'keyboard_hotkey': 'Tecla Rápida',
            // Clipboard
            'clipboard_copy': 'Copiar',
            'clipboard_paste': 'Pegar',
            'clipboard_clear': 'Limpiar Clipboard',
            // Data Table
            'dt_create': 'Crear Tabla',
            'dt_add_row': 'Agregar Fila',
            'dt_get_row': 'Obtener Fila',
            'dt_filter': 'Filtrar Tabla',
            'dt_sort': 'Ordenar Tabla',
            // Loop
            'loop_for_each': 'For Each',
            'loop_while': 'While',
            'loop_do_while': 'Do While',
            // Message Box
            'msgbox_show': 'Mostrar Mensaje',
            'msgbox_input': 'Solicitar Entrada',
            // Logging
            'log_message': 'Log Message',
            'log_error': 'Log Error',
            'log_info': 'Log Info',
            // Finanzas
            'finance_cfdi_validate': 'Validar CFDI SAT',
            'finance_bank_reconciliation': 'Conciliación Bancaria',
            'finance_pl_automation': 'P&L Automation',
            'finance_invoice_processing': 'Procesar Facturas',
            'finance_payment_validation': 'Validar Pagos',
            // Recursos Humanos
            'hr_recruitment_ai': 'Reclutamiento Inteligente',
            'hr_onboarding_digital': 'Onboarding Digital',
            'hr_cv_screening': 'Screening CV con IA',
            'hr_interview_scheduler': 'Agendar Entrevistas',
            'hr_payroll_processing': 'Procesamiento Nómina',
            // Ventas
            'sales_order_capture': 'Captura de Pedidos',
            'sales_order_tracking': 'Seguimiento Pedidos',
            'sales_collection_agent': 'Agente de Cobranza',
            'sales_quote_generator': 'Generar Cotizaciones',
            'sales_crm_sync': 'Sincronizar CRM',
            // Agentes IA
            'agent_customer_service': 'Atención al Cliente',
            'agent_it_support': 'Mesa de Ayuda TI',
            'agent_collection': 'Agente de Cobranza',
            'agent_cfo_assistant': 'CFO Assistant',
            'agent_sales_assistant': 'Asistente de Ventas',
            // Conectores
            'connector_rest_api': 'REST API',
            'connector_openapi': 'OpenAPI',
            'connector_postgresql': 'PostgreSQL',
            'connector_mysql': 'MySQL',
            'connector_mongodb': 'MongoDB',
            'connector_s3': 'Amazon S3',
            'connector_whatsapp': 'WhatsApp Business',
            'connector_slack': 'Slack',
            'connector_teams': 'Microsoft Teams'
        };
        return names[actionType] || actionType;
    },

    getActionIcon(actionType) {
        const icons = {
            // Browser
            'browser_open': 'fa-window-maximize',
            'navigate': 'fa-compass',
            'click': 'fa-mouse-pointer',
            'type': 'fa-keyboard',
            'extract_text': 'fa-font',
            'screenshot': 'fa-camera',
            'scroll': 'fa-arrows-alt-v',
            'browser_close': 'fa-times-circle',
            // Active Directory
            'ad_connect': 'fa-server',
            'ad_get_user': 'fa-user',
            'ad_create_user': 'fa-user-plus',
            'ad_disable_user': 'fa-user-lock',
            'ad_add_to_group': 'fa-users',
            // AI
            'ai_text_generation': 'fa-robot',
            'ai_sentiment': 'fa-smile',
            'ai_classification': 'fa-tags',
            'ai_translation': 'fa-language',
            // Database
            'db_connect': 'fa-plug',
            'db_query': 'fa-search',
            'db_insert': 'fa-plus-circle',
            'db_disconnect': 'fa-unlink',
            // Files
            'file_read': 'fa-file-alt',
            'file_write': 'fa-file-edit',
            'file_copy': 'fa-copy',
            'file_move': 'fa-file-export',
            'file_delete': 'fa-trash',
            'file_exists': 'fa-question-circle',
            // Email
            'email_send': 'fa-paper-plane',
            'email_read': 'fa-envelope-open',
            'email_download_attachment': 'fa-paperclip',
            // Control Flow
            'if_condition': 'fa-question',
            'for_loop': 'fa-redo',
            'while_loop': 'fa-sync',
            'delay': 'fa-clock',
            'try_catch': 'fa-shield-alt',
            // Excel
            'excel_read': 'fa-file-excel',
            'excel_write': 'fa-file-edit',
            'excel_close': 'fa-times-circle',
            // PDF
            'pdf_read': 'fa-file-pdf',
            'pdf_create': 'fa-file-pdf',
            // OCR
            'ocr_image': 'fa-image',
            'ocr_pdf': 'fa-file-pdf',
            // Variables
            'set_variable': 'fa-cube',
            'get_variable': 'fa-cube',
            // Scripts
            'run_javascript': 'fa-code',
            'run_python': 'fa-code',
            'run_powershell': 'fa-terminal',
            // REST
            'rest_get': 'fa-download',
            'rest_post': 'fa-upload',
            'rest_put': 'fa-edit',
            'rest_delete': 'fa-trash',
            // SAP
            'sap_connect': 'fa-plug',
            'sap_get_data': 'fa-database',
            'sap_create_order': 'fa-shopping-cart',
            // Microsoft 365
            'm365_calendar': 'fa-calendar',
            'm365_excel': 'fa-file-excel',
            'm365_onedrive': 'fa-cloud',
            'm365_outlook': 'fa-envelope',
            // Mouse & Keyboard
            'mouse_click': 'fa-mouse-pointer',
            'mouse_move': 'fa-arrows-alt',
            'keyboard_type': 'fa-keyboard',
            'keyboard_hotkey': 'fa-keyboard',
            // Clipboard
            'clipboard_copy': 'fa-copy',
            'clipboard_paste': 'fa-paste',
            'clipboard_clear': 'fa-eraser',
            // Data Table
            'dt_create': 'fa-plus',
            'dt_add_row': 'fa-plus-circle',
            'dt_get_row': 'fa-list-ol',
            'dt_filter': 'fa-filter',
            'dt_sort': 'fa-sort',
            // Loop
            'loop_for_each': 'fa-redo',
            'loop_while': 'fa-sync',
            'loop_do_while': 'fa-sync-alt',
            // Message Box
            'msgbox_show': 'fa-window-maximize',
            'msgbox_input': 'fa-keyboard',
            // Logging
            'log_message': 'fa-pen',
            'log_error': 'fa-exclamation-triangle',
            'log_info': 'fa-info-circle',
            // Finanzas
            'finance_cfdi_validate': 'fa-file-invoice',
            'finance_bank_reconciliation': 'fa-balance-scale',
            'finance_pl_automation': 'fa-chart-line',
            'finance_invoice_processing': 'fa-receipt',
            'finance_payment_validation': 'fa-money-check-alt',
            // Recursos Humanos
            'hr_recruitment_ai': 'fa-user-tie',
            'hr_onboarding_digital': 'fa-user-plus',
            'hr_cv_screening': 'fa-file-alt',
            'hr_interview_scheduler': 'fa-calendar-alt',
            'hr_payroll_processing': 'fa-money-bill-wave',
            // Ventas
            'sales_order_capture': 'fa-cart-plus',
            'sales_order_tracking': 'fa-search-dollar',
            'sales_collection_agent': 'fa-phone-volume',
            'sales_quote_generator': 'fa-file-invoice-dollar',
            'sales_crm_sync': 'fa-sync-alt',
            // Agentes IA
            'agent_customer_service': 'fa-headset',
            'agent_it_support': 'fa-laptop-medical',
            'agent_collection': 'fa-comments-dollar',
            'agent_cfo_assistant': 'fa-chart-pie',
            'agent_sales_assistant': 'fa-user-tie',
            // Conectores
            'connector_rest_api': 'fa-cloud',
            'connector_openapi': 'fa-book',
            'connector_postgresql': 'fa-database',
            'connector_mysql': 'fa-database',
            'connector_mongodb': 'fa-leaf',
            'connector_s3': 'fa-aws',
            'connector_whatsapp': 'fa-whatsapp',
            'connector_slack': 'fa-slack',
            'connector_teams': 'fa-microsoft'
        };
        return icons[actionType] || 'fa-cog';
    },

    renderWorkflow() {
        const container = document.getElementById('workflowSteps');
        const emptyState = document.getElementById('canvasEmptyState');

        if (this.currentWorkflow.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        container.innerHTML = this.currentWorkflow.map((step, index) => `
            <div class="workflow-step ${this.selectedStep === step.id ? 'selected' : ''}"
                 data-step-id="${step.id}"
                 onclick="WorkflowStudio.selectStep('${step.id}')">
                <div class="workflow-step-header">
                    <div class="workflow-step-icon">
                        <i class="fas ${this.getActionIcon(step.type)}"></i>
                    </div>
                    <div class="workflow-step-info">
                        <div class="workflow-step-name">${index + 1}. ${step.name}</div>
                        <div class="workflow-step-type">${step.type}</div>
                    </div>
                    <div class="workflow-step-actions">
                        <button onclick="event.stopPropagation(); WorkflowStudio.editStep('${step.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); WorkflowStudio.deleteStep('${step.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    selectStep(stepId) {
        this.selectedStep = stepId;
        this.renderWorkflow();
        this.showProperties(stepId);
    },

    showProperties(stepId) {
        const step = this.currentWorkflow.find(s => s.id === stepId);
        if (!step) return;

        const container = document.getElementById('propertiesContent');
        container.innerHTML = `
            <div class="property-group">
                <div class="property-group-title">Información General</div>
                <div class="property-field">
                    <label>Nombre del Paso</label>
                    <input type="text" value="${step.name}" onchange="WorkflowStudio.updateStepProperty('${stepId}', 'name', this.value)">
                </div>
                <div class="property-field">
                    <label>Tipo de Acción</label>
                    <input type="text" value="${step.type}" readonly>
                </div>
            </div>

            <div class="property-group">
                <div class="property-group-title">Configuración</div>
                ${this.getPropertiesForAction(step)}
            </div>
        `;
    },

    getPropertiesForAction(step) {
        // Aquí puedes personalizar las propiedades según el tipo de acción
        switch (step.type) {
            case 'navigate':
                return `
                    <div class="property-field">
                        <label>URL</label>
                        <input type="text" placeholder="https://ejemplo.com"
                               value="${step.config.url || ''}"
                               onchange="WorkflowStudio.updateStepConfig('${step.id}', 'url', this.value)">
                    </div>
                `;
            case 'click':
            case 'type':
            case 'extract_text':
                return `
                    <div class="property-field">
                        <label>Capturar objeto con</label>
                        <select onchange="WorkflowStudio.updateStepConfig('${step.id}', 'captureMethod', this.value)">
                            <option value="auto" ${step.config.captureMethod === 'auto' ? 'selected' : ''}>Objeto (detección automática)</option>
                            <option value="msaa" ${step.config.captureMethod === 'msaa' ? 'selected' : ''}>Microsoft Active Accessibility</option>
                            <option value="uia" ${step.config.captureMethod === 'uia' ? 'selected' : ''}>Automatización de interfaz de usuario de Microsoft</option>
                            <option value="com" ${step.config.captureMethod === 'com' ? 'selected' : ''}>Automatización de interfaz de usuario de Microsoft (COM)</option>
                            <option value="macos" ${step.config.captureMethod === 'macos' ? 'selected' : ''}>Accesibilidad de macOS</option>
                        </select>
                    </div>
                    <div class="property-field">
                        <label>Selector</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" placeholder="#elemento o .clase"
                                   value="${step.config.selector || ''}"
                                   onchange="WorkflowStudio.updateStepConfig('${step.id}', 'selector', this.value)"
                                   style="flex: 1;">
                            <button class="btn btn-sm btn-primary" onclick="WorkflowStudio.openElementPicker('${step.id}')" title="Seleccionar elemento">
                                <i class="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                    ${step.type === 'type' ? `
                    <div class="property-field">
                        <label>Texto</label>
                        <textarea placeholder="Texto a escribir"
                                  onchange="WorkflowStudio.updateStepConfig('${step.id}', 'text', this.value)">${step.config.text || ''}</textarea>
                    </div>
                    ` : ''}
                    ${step.type === 'extract_text' ? `
                    <div class="property-field">
                        <label>Variable de salida</label>
                        <input type="text" placeholder="nombreVariable"
                               value="${step.config.outputVariable || ''}"
                               onchange="WorkflowStudio.updateStepConfig('${step.id}', 'outputVariable', this.value)">
                    </div>
                    ` : ''}
                `;
            case 'delay':
                return `
                    <div class="property-field">
                        <label>Duración (ms)</label>
                        <input type="number" placeholder="1000"
                               value="${step.config.duration || 1000}"
                               onchange="WorkflowStudio.updateStepConfig('${step.id}', 'duration', this.value)">
                    </div>
                `;
            default:
                return `<p style="color: var(--text-secondary); font-size: 0.85rem;">Configure las propiedades específicas de esta acción</p>`;
        }
    },

    updateStepProperty(stepId, property, value) {
        const step = this.currentWorkflow.find(s => s.id === stepId);
        if (step) {
            step[property] = value;
            this.renderWorkflow();
        }
    },

    updateStepConfig(stepId, configKey, value) {
        const step = this.currentWorkflow.find(s => s.id === stepId);
        if (step) {
            step.config[configKey] = value;
            console.log('📝 Config actualizada:', step);
        }
    },

    editStep(stepId) {
        this.selectStep(stepId);
    },

    deleteStep(stepId) {
        if (confirm('¿Eliminar este paso del workflow?')) {
            this.currentWorkflow = this.currentWorkflow.filter(s => s.id !== stepId);
            this.renderWorkflow();
            this.updateStepsCount();

            // Limpiar panel de propiedades
            const container = document.getElementById('propertiesContent');
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                    <i class="fas fa-mouse-pointer" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <p>Selecciona una acción para ver sus propiedades</p>
                </div>
            `;
        }
    },

    updateStepsCount() {
        const countEl = document.getElementById('stepsCount');
        if (countEl) {
            const count = this.currentWorkflow.length;
            countEl.textContent = `${count} paso${count !== 1 ? 's' : ''}`;
        }
    },

    toggleCategory(headerEl) {
        const category = headerEl.parentElement;
        category.classList.toggle('expanded');
    },

    toggleLeftPanel() {
        const panel = document.getElementById('leftPanel');
        const studio = document.getElementById('workflowStudio');
        const btn = panel.querySelector('.panel-collapse-btn i');

        panel.classList.toggle('collapsed');
        studio.classList.toggle('left-collapsed');

        if (panel.classList.contains('collapsed')) {
            btn.className = 'fas fa-chevron-right';
        } else {
            btn.className = 'fas fa-chevron-left';
        }
    },

    toggleRightPanel() {
        const panel = document.getElementById('rightPanel');
        const studio = document.getElementById('workflowStudio');
        const btn = panel.querySelector('.panel-collapse-btn i');

        panel.classList.toggle('collapsed');
        studio.classList.toggle('right-collapsed');

        if (panel.classList.contains('collapsed')) {
            btn.className = 'fas fa-chevron-left';
        } else {
            btn.className = 'fas fa-chevron-right';
        }
    },

    filterActions(query) {
        const items = document.querySelectorAll('.action-item');
        const categories = document.querySelectorAll('.action-category');

        query = query.toLowerCase();

        if (!query) {
            items.forEach(item => item.style.display = '');
            categories.forEach(cat => cat.style.display = '');
            return;
        }

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = '';
                // Expandir categoría padre
                const category = item.closest('.action-category');
                if (category) {
                    category.classList.add('expanded');
                    category.style.display = '';
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Ocultar categorías sin items visibles
        categories.forEach(cat => {
            const visibleItems = cat.querySelectorAll('.action-item[style=""]');
            if (visibleItems.length === 0) {
                cat.style.display = 'none';
            }
        });
    },

    newTab() {
        const tabName = prompt('Nombre del nuevo workflow:', 'Nuevo Workflow');
        if (tabName) {
            // Por ahora solo soportamos un tab, pero la estructura está lista para múltiples
            alert('Múltiples tabs próximamente');
        }
    },

    closeTab(tabId) {
        if (confirm('¿Cerrar este workflow?')) {
            // Implementación futura
            alert('Funcionalidad próximamente');
        }
    },

    openElementPicker(stepId) {
        alert('🎯 Selector de Elementos\n\nEsta funcionalidad permite capturar elementos de la interfaz usando diferentes métodos:\n\n• Detección automática\n• Microsoft Active Accessibility (MSAA)\n• UI Automation (UIA)\n• COM Automation\n• macOS Accessibility\n\nFuncionalidad en desarrollo...');

        // TODO: Implementar selector visual de elementos
        // Similar a UiPath Element Picker
        console.log('🎯 Abriendo selector de elementos para step:', stepId);
    }
};

// Inicializar cuando el DOM esté listo y solo si estamos en la vista de workflows
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si existe el elemento del workflow studio
    const studioElement = document.getElementById('workflowStudio');
    if (studioElement) {
        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            WorkflowStudio.init();
        });
    } else {
        console.log('⏭️ WorkflowStudio no inicializado (elemento no encontrado)');
    }
});
