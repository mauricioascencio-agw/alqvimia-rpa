// 📊 VISTAS DEL WORKFLOW - LISTA Y DIAGRAMA

// Agregar funciones al WorkflowEditor
if (typeof WorkflowEditor !== 'undefined') {
    WorkflowEditor.currentView = 'diagram'; // 'diagram' o 'list'

    // Toggle entre vistas
    WorkflowEditor.toggleView = function() {
        this.currentView = this.currentView === 'diagram' ? 'list' : 'diagram';

        // Actualizar botón
        const btn = document.getElementById('viewToggle');
        if (btn) {
            if (this.currentView === 'list') {
                btn.innerHTML = '<i class="fas fa-project-diagram"></i> Vista: Lista';
            } else {
                btn.innerHTML = '<i class="fas fa-list"></i> Vista: Diagrama';
            }
        }

        // Renderizar con la nueva vista
        this.renderWorkflow();
    };

    // Guardar el renderWorkflow original
    const originalRenderWorkflow = WorkflowEditor.renderWorkflow;

    // Sobrescribir renderWorkflow para soportar ambas vistas
    WorkflowEditor.renderWorkflow = function() {
        const canvas = document.getElementById('workflowCanvas');

        if (this.currentWorkflow.length === 0) {
            canvas.style.display = 'flex';
            canvas.innerHTML = `
                <div class="canvas-empty">
                    <i class="fas fa-project-diagram"></i>
                    <p>Arrastra acciones aquí para construir tu workflow</p>
                </div>
            `;
            return;
        }

        if (this.currentView === 'list') {
            this.renderListView();
        } else {
            this.renderDiagramView();
        }
    };

    // Vista de lista (estilo Alqvimia)
    WorkflowEditor.renderListView = function() {
        const canvas = document.getElementById('workflowCanvas');
        canvas.style.display = 'block';
        canvas.innerHTML = '';

        // Contenedor de lista
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0;
        `;

        this.currentWorkflow.forEach((action, index) => {
            const listItem = this.createListItem(action, index);
            listContainer.appendChild(listItem);
        });

        canvas.appendChild(listContainer);
    };

    // Vista de diagrama (con conexiones visuales)
    WorkflowEditor.renderDiagramView = function() {
        const canvas = document.getElementById('workflowCanvas');
        canvas.style.display = 'block';
        canvas.innerHTML = '';

        // Recrear SVG canvas para conexiones
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
        canvas.appendChild(svg);

        this.currentWorkflow.forEach((action, index) => {
            const actionEl = this.createActionElement(action, index);
            canvas.appendChild(actionEl);
        });

        // Redibujar conexiones
        if (typeof WorkflowConnections !== 'undefined') {
            setTimeout(() => WorkflowConnections.redrawConnections(), 100);
        }
    };

    // Crear elemento de lista (estilo compacto)
    WorkflowEditor.createListItem = function(action, index) {
        const item = document.createElement('div');
        item.className = 'workflow-list-item';
        item.style.cssText = `
            background: #1e293b;
            border-left: 4px solid #2563eb;
            border-bottom: 1px solid #334155;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
        `;

        // Número de secuencia
        const seqNum = document.createElement('div');
        seqNum.style.cssText = `
            background: #334155;
            color: #cbd5e1;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.85rem;
            flex-shrink: 0;
        `;
        seqNum.textContent = index + 1;

        // Icono de acción
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = `
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        `;

        const iconMap = {
            // Web
            navigate: 'fa-globe',
            click: 'fa-mouse-pointer',
            type: 'fa-keyboard',
            wait: 'fa-clock',
            screenshot: 'fa-camera',
            extract: 'fa-download',
            scroll: 'fa-arrows-alt-v',
            hover: 'fa-hand-pointer',

            // Active Directory
            ad_connect: 'fa-server',
            ad_get_user: 'fa-user',
            ad_create_user: 'fa-user-plus',
            ad_disable_user: 'fa-user-lock',
            ad_add_to_group: 'fa-users',

            // AI
            ai_text_generation: 'fa-robot',
            ai_sentiment: 'fa-smile',
            ai_classification: 'fa-tags',
            ai_translation: 'fa-language',

            // AWS SageMaker
            sage_deploy_model: 'fa-rocket',
            sage_invoke: 'fa-play-circle',
            sage_train: 'fa-graduation-cap',

            // Hugging Face
            hf_load_model: 'fa-download',
            hf_inference: 'fa-magic',
            hf_pipeline: 'fa-stream',

            // AI Skill
            skill_extract_data: 'fa-file-export',
            skill_summarize: 'fa-compress-alt',
            skill_validate: 'fa-check-circle',

            // Analyze
            analyze_performance: 'fa-tachometer-alt',
            analyze_data: 'fa-analytics',
            analyze_logs: 'fa-file-alt',

            // App Integration
            app_api_call: 'fa-network-wired',
            app_webhook: 'fa-link',
            app_oauth: 'fa-key',

            // Application
            app_open: 'fa-external-link-alt',
            app_close: 'fa-times-circle',
            app_maximize: 'fa-expand',
            app_minimize: 'fa-compress',

            // Boolean
            bool_and: 'fa-intersection',
            bool_or: 'fa-union',
            bool_not: 'fa-not-equal',
            bool_xor: 'fa-exchange-alt',

            // Bot Migration
            migrate_legacy: 'fa-file-import',
            update_bot: 'fa-sync-alt',
            validate_migration: 'fa-check-double',

            // Browser
            browser_close: 'fa-times',
            browser_download: 'fa-download',
            browser_get_source: 'fa-code',
            browser_run_js: 'fa-js',
            browser_call_function: 'fa-function',
            browser_find_links: 'fa-link',
            browser_go_back: 'fa-arrow-left',
            browser_open: 'fa-window-restore',

            // Clipboard
            clipboard_copy: 'fa-copy',
            clipboard_paste: 'fa-paste',
            clipboard_clear: 'fa-eraser',

            // CSV/TXT
            csv_close: 'fa-times-circle',
            csv_open: 'fa-folder-open',
            csv_read: 'fa-book-open',

            // Data Table
            dt_assign: 'fa-equals',
            dt_change_column_type: 'fa-edit',
            dt_clear: 'fa-broom',
            dt_get_columns: 'fa-columns',
            dt_delete_column: 'fa-minus-circle',
            dt_delete_row: 'fa-trash-alt',
            dt_insert_column: 'fa-plus-square',
            dt_insert_row: 'fa-plus',
            dt_join: 'fa-object-group',
            dt_merge: 'fa-compress-arrows-alt',
            dt_remove_duplicates: 'fa-clone',
            dt_get_rows: 'fa-list-ol',
            dt_search: 'fa-search',
            dt_get_value: 'fa-hand-point-right',
            dt_sort: 'fa-sort',
            dt_write_file: 'fa-file-export',
            dt_write_stream: 'fa-stream',

            // Database
            db_connect: 'fa-link',
            db_disconnect: 'fa-unlink',
            db_query: 'fa-search',
            db_insert: 'fa-plus-circle',
            db_begin_transaction: 'fa-play',
            db_end_transaction: 'fa-stop',
            db_read: 'fa-book-reader',
            db_stored_procedure: 'fa-cogs',
            db_export_datatable: 'fa-file-export',
            db_export_stream: 'fa-stream',
            db_manage_procedure: 'fa-tasks',
            db_insert_update: 'fa-edit',

            // Datetime
            dt_add: 'fa-plus',
            dt_difference: 'fa-minus',
            dt_get: 'fa-calendar-day',
            dt_is_after: 'fa-arrow-right',
            dt_is_before: 'fa-arrow-left',
            dt_is_equal: 'fa-equals',
            dt_is_leap: 'fa-calendar-check',
            dt_subtract: 'fa-minus-circle',
            dt_to_string: 'fa-font',

            // Delay
            delay_wait: 'fa-clock',

            // Email
            email_change_status: 'fa-flag',
            email_check_folder: 'fa-folder-open',
            email_delete_all: 'fa-trash-alt',
            email_delete: 'fa-trash',
            email_disconnect: 'fa-plug',
            email_connect: 'fa-link',
            email_forward: 'fa-share',
            email_move_all: 'fa-folder-plus',
            email_move: 'fa-exchange-alt',
            email_reply_all: 'fa-reply-all',
            email_reply: 'fa-reply',
            email_save_all_attachments: 'fa-paperclip',
            email_save_attachments: 'fa-save',
            email_save: 'fa-envelope-open',
            email_send: 'fa-paper-plane',
            send_email: 'fa-paper-plane',
            read_email: 'fa-inbox',

            // Excel
            excel_read: 'fa-file-excel',
            excel_write: 'fa-file-excel',
            excel_password_protected: 'fa-lock',
            excel_append: 'fa-plus-square',
            excel_append_worksheet: 'fa-file-medical',
            excel_close: 'fa-times-circle',
            excel_convert_pdf: 'fa-file-pdf',
            excel_create_workbook: 'fa-file-excel',
            excel_create_worksheet: 'fa-file-alt',
            excel_delete_cells: 'fa-trash',
            excel_delete_column: 'fa-columns',
            excel_delete_workbook_links: 'fa-unlink',
            excel_delete_worksheet: 'fa-file-excel',
            excel_disable_realtime_screen: 'fa-eye-slash',
            excel_filter: 'fa-filter',
            excel_find: 'fa-search',
            excel_find_next_empty: 'fa-step-forward',
            excel_get_cell_color: 'fa-palette',
            excel_get_worksheet_name: 'fa-tag',
            excel_get_multiple_cells: 'fa-th',
            excel_get_rows: 'fa-bars',
            excel_get_sensitivity: 'fa-shield-alt',
            excel_get_single_cell: 'fa-square',
            excel_get_cell_address: 'fa-map-pin',
            excel_get_column_name: 'fa-font',
            excel_get_column_number: 'fa-sort-numeric-down',
            excel_get_table_range: 'fa-table',
            excel_get_workbook_links: 'fa-link',
            excel_get_worksheet_datatable: 'fa-database',

            // PDF
            pdf_read: 'fa-file-pdf',
            pdf_create: 'fa-file-pdf',

            // OCR
            ocr_image: 'fa-eye',
            ocr_pdf: 'fa-eye',

            // Control de Flujo
            if_condition: 'fa-code-branch',
            for_loop: 'fa-redo',
            while_loop: 'fa-sync',

            // Variables
            set_variable: 'fa-cog',
            get_variable: 'fa-download',

            // Scripts
            run_javascript: 'fa-code',
            run_python: 'fa-python',
            run_powershell: 'fa-terminal',

            // Archivos
            read_file: 'fa-file',
            write_file: 'fa-file-edit',
            copy_file: 'fa-copy',
            move_file: 'fa-exchange-alt',

            // MCP Connectors - Zoho
            mcp_zoho_get: 'fa-chart-bar',
            mcp_zoho_create: 'fa-plus-circle',
            mcp_zoho_update: 'fa-edit',

            // MCP Connectors - Jira
            mcp_jira_get_issue: 'fa-tasks',
            mcp_jira_create_issue: 'fa-plus-square',
            mcp_jira_update_issue: 'fa-sync',

            // MCP Connectors - SAP
            mcp_sap_get_data: 'fa-building',
            mcp_sap_create_order: 'fa-shopping-cart',
            mcp_sap_update: 'fa-save',

            // MCP Connectors - PeopleSoft
            mcp_peoplesoft_get: 'fa-users',
            mcp_peoplesoft_update: 'fa-user-edit',

            // MCP Connectors - Oracle
            mcp_oracle_query: 'fa-database',
            mcp_oracle_execute: 'fa-cogs',

            // MCP Connectors - MySQL
            mcp_mysql_query: 'fa-database',
            mcp_mysql_insert: 'fa-plus',
            mcp_mysql_update: 'fa-edit',

            // MCP Connectors - Office 365
            mcp_o365_send_email: 'fa-envelope',
            mcp_o365_get_calendar: 'fa-calendar',
            mcp_o365_upload_file: 'fa-cloud-upload-alt',

            // MCP Connectors - Zendesk
            mcp_zendesk_get_ticket: 'fa-ticket-alt',
            mcp_zendesk_create_ticket: 'fa-plus-circle',
            mcp_zendesk_update: 'fa-comment',

            // MCP Connectors - NetSuite
            mcp_netsuite_get_customer: 'fa-user-tie',
            mcp_netsuite_create_invoice: 'fa-file-invoice-dollar',
            mcp_netsuite_update: 'fa-sync-alt',

            // MCP Connectors - Odoo
            mcp_odoo_get: 'fa-box',
            mcp_odoo_create: 'fa-cart-plus',
            mcp_odoo_update: 'fa-warehouse',

            // MCP Connectors - SAT México
            mcp_sat_validate_cfdi: 'fa-check-circle',
            mcp_sat_generate_invoice: 'fa-file-invoice',
            mcp_sat_cancel_cfdi: 'fa-ban',
            mcp_sat_process_payroll: 'fa-money-check-alt',
            mcp_sat_generate_diot: 'fa-file-alt',
            mcp_sat_download_mailbox: 'fa-inbox'
        };

        const icon = document.createElement('i');
        icon.className = `fas ${iconMap[action.type] || 'fa-cog'}`;
        icon.style.color = '#60a5fa';
        icon.style.fontSize = '1.25rem';
        iconDiv.appendChild(icon);

        // Información de la acción
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        `;

        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = `
            font-weight: 600;
            color: #e2e8f0;
            font-size: 0.95rem;
        `;
        titleDiv.textContent = this.getActionLabel(action.type);

        const detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = `
            color: #94a3b8;
            font-size: 0.85rem;
        `;
        detailsDiv.textContent = this.getActionDetails(action);

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(detailsDiv);

        // Botones de acción
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = `
            display: flex;
            gap: 0.5rem;
        `;

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-secondary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            this.showActionConfigModal(action.type, (newConfig) => {
                this.currentWorkflow[index] = newConfig;
                this.renderWorkflow();
            });
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('¿Eliminar esta acción?')) {
                this.currentWorkflow.splice(index, 1);
                this.renderWorkflow();
            }
        };

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        // Ensamblar item
        item.appendChild(seqNum);
        item.appendChild(iconDiv);
        item.appendChild(infoDiv);
        item.appendChild(actionsDiv);

        // Hover effect
        item.addEventListener('mouseenter', () => {
            item.style.background = '#334155';
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = '#1e293b';
        });

        return item;
    };

    // Obtener etiqueta legible de la acción
    WorkflowEditor.getActionLabel = function(type) {
        const labels = {
            // Web
            navigate: 'Navegar a URL',
            click: 'Click en Elemento',
            type: 'Escribir Texto',
            wait: 'Esperar',
            screenshot: 'Captura de Pantalla',
            extract: 'Extraer Datos',
            scroll: 'Desplazar Página',
            hover: 'Hover sobre Elemento',

            // Active Directory
            ad_connect: 'Conectar Active Directory',
            ad_get_user: 'Obtener Usuario AD',
            ad_create_user: 'Crear Usuario AD',
            ad_disable_user: 'Deshabilitar Usuario AD',
            ad_add_to_group: 'Agregar a Grupo AD',

            // AI
            ai_text_generation: 'Generar Texto IA',
            ai_sentiment: 'Análisis de Sentimiento',
            ai_classification: 'Clasificación IA',
            ai_translation: 'Traducción IA',

            // AWS SageMaker
            sage_deploy_model: 'Desplegar Modelo SageMaker',
            sage_invoke: 'Invocar Endpoint SageMaker',
            sage_train: 'Entrenar Modelo SageMaker',

            // Hugging Face
            hf_load_model: 'Cargar Modelo Hugging Face',
            hf_inference: 'Inferencia Hugging Face',
            hf_pipeline: 'Pipeline Hugging Face',

            // AI Skill
            skill_extract_data: 'Extraer Datos IA',
            skill_summarize: 'Resumir con IA',
            skill_validate: 'Validar con IA',

            // Analyze
            analyze_performance: 'Analizar Performance',
            analyze_data: 'Analizar Datos',
            analyze_logs: 'Analizar Logs',

            // App Integration
            app_api_call: 'Llamada API',
            app_webhook: 'Webhook',
            app_oauth: 'Autenticación OAuth',

            // Application
            app_open: 'Abrir Programa',
            app_close: 'Cerrar Aplicación',
            app_maximize: 'Maximizar Ventana',
            app_minimize: 'Minimizar Ventana',

            // Boolean
            bool_and: 'Operador AND',
            bool_or: 'Operador OR',
            bool_not: 'Operador NOT',
            bool_xor: 'Operador XOR',

            // Bot Migration
            migrate_legacy: 'Migrar Bot Legacy',
            update_bot: 'Actualizar Bot',
            validate_migration: 'Validar Migración',

            // Browser
            browser_close: 'Cerrar Navegador',
            browser_download: 'Descargar Archivo',
            browser_get_source: 'Obtener Código Fuente',
            browser_run_js: 'Ejecutar JavaScript',
            browser_call_function: 'Llamar Función JS',
            browser_find_links: 'Buscar Links Rotos',
            browser_go_back: 'Navegar Atrás',
            browser_open: 'Abrir Navegador',

            // Clipboard
            clipboard_copy: 'Copiar de Portapapeles',
            clipboard_paste: 'Pegar a Portapapeles',
            clipboard_clear: 'Limpiar Portapapeles',

            // CSV/TXT
            csv_close: 'Cerrar CSV',
            csv_open: 'Abrir CSV',
            csv_read: 'Leer CSV',

            // Data Table
            dt_assign: 'Asignar DataTable',
            dt_change_column_type: 'Cambiar Tipo Columna',
            dt_clear: 'Limpiar Contenido',
            dt_get_columns: 'Obtener Número de Columnas',
            dt_delete_column: 'Eliminar Columna',
            dt_delete_row: 'Eliminar Fila',
            dt_insert_column: 'Insertar Columna',
            dt_insert_row: 'Insertar Fila',
            dt_join: 'Join DataTables',
            dt_merge: 'Merge DataTables',
            dt_remove_duplicates: 'Eliminar Duplicados',
            dt_get_rows: 'Obtener Número de Filas',
            dt_search: 'Buscar Valor',
            dt_get_value: 'Obtener Valor de Celda',
            dt_sort: 'Ordenar DataTable',
            dt_write_file: 'Escribir a Archivo',
            dt_write_stream: 'Escribir a Stream',

            // Database
            db_connect: 'Conectar Base de Datos',
            db_disconnect: 'Desconectar Base de Datos',
            db_query: 'Consultar Base de Datos',
            db_insert: 'Insertar en Base de Datos',
            db_begin_transaction: 'Iniciar Transacción',
            db_end_transaction: 'Finalizar Transacción',
            db_read: 'Leer de Base de Datos',
            db_stored_procedure: 'Ejecutar Procedimiento',
            db_export_datatable: 'Exportar a DataTable',
            db_export_stream: 'Exportar a Stream',
            db_manage_procedure: 'Gestionar Procedimiento',
            db_insert_update: 'Insertar/Actualizar',

            // Datetime
            dt_add: 'Agregar Fecha/Hora',
            dt_difference: 'Diferencia entre Fechas',
            dt_get: 'Obtener Fecha/Hora',
            dt_is_after: 'Es Después',
            dt_is_before: 'Es Antes',
            dt_is_equal: 'Fecha Es Igual',
            dt_is_leap: 'Es Año Bisiesto',
            dt_subtract: 'Restar Fecha/Hora',
            dt_to_string: 'Fecha a String',

            // Delay
            delay_wait: 'Esperar Tiempo',

            // Email
            email_change_status: 'Cambiar Estado Email',
            email_check_folder: 'Verificar Carpeta',
            email_delete_all: 'Eliminar Todos los Emails',
            email_delete: 'Eliminar Email',
            email_disconnect: 'Desconectar Email',
            email_connect: 'Conectar Email',
            email_forward: 'Reenviar Email',
            email_move_all: 'Mover Todos',
            email_move: 'Mover Email',
            email_reply_all: 'Responder a Todos',
            email_reply: 'Responder Email',
            email_save_all_attachments: 'Guardar Todos los Adjuntos',
            email_save_attachments: 'Guardar Adjunto',
            email_save: 'Guardar Email',
            email_send: 'Enviar Email',
            send_email: 'Enviar Email',
            read_email: 'Leer Email',

            // Excel
            excel_read: 'Leer Excel',
            excel_write: 'Escribir Excel',
            excel_password_protected: 'Acceder con Password',
            excel_append: 'Append Workbook',
            excel_append_worksheet: 'Append Worksheet',
            excel_close: 'Close',
            excel_convert_pdf: 'Convert to PDF',
            excel_create_workbook: 'Create Workbook',
            excel_create_worksheet: 'Create Worksheet',
            excel_delete_cells: 'Delete Cells',
            excel_delete_column: 'Delete Table Column',
            excel_delete_workbook_links: 'Delete Workbook Links',
            excel_delete_worksheet: 'Delete Worksheet',
            excel_disable_realtime_screen: 'Disable Real-time Screen',
            excel_filter: 'Filter',
            excel_find: 'Find',
            excel_find_next_empty: 'Find Next Empty Cell',
            excel_get_cell_color: 'Get Cell Color',
            excel_get_worksheet_name: 'Get Current Worksheet Name',
            excel_get_multiple_cells: 'Get Multiple Cells',
            excel_get_rows: 'Get Number of Rows',
            excel_get_sensitivity: 'Get Sensitivity Label',
            excel_get_single_cell: 'Get Single Cell',
            excel_get_cell_address: 'Get Cell Address',
            excel_get_column_name: 'Get Column Name',
            excel_get_column_number: 'Get Column Number',
            excel_get_table_range: 'Get Table Range',
            excel_get_workbook_links: 'Get Workbook Links',
            excel_get_worksheet_datatable: 'Get Worksheet as DataTable',

            // PDF
            pdf_read: 'Leer PDF',
            pdf_create: 'Crear PDF',

            // OCR
            ocr_image: 'OCR de Imagen',
            ocr_pdf: 'OCR de PDF',

            // Control de Flujo
            if_condition: 'Condición IF',
            for_loop: 'Bucle FOR',
            while_loop: 'Bucle WHILE',

            // Variables
            set_variable: 'Establecer Variable',
            get_variable: 'Obtener Variable',

            // Scripts
            run_javascript: 'Ejecutar JavaScript',
            run_python: 'Ejecutar Python',
            run_powershell: 'Ejecutar PowerShell',

            // Archivos
            read_file: 'Leer Archivo',
            write_file: 'Escribir Archivo',
            copy_file: 'Copiar Archivo',
            move_file: 'Mover Archivo',

            // MCP Connectors - Zoho
            mcp_zoho_get: 'Zoho: Get Data',
            mcp_zoho_create: 'Zoho: Create Record',
            mcp_zoho_update: 'Zoho: Update Record',

            // MCP Connectors - Jira
            mcp_jira_get_issue: 'Jira: Get Issue',
            mcp_jira_create_issue: 'Jira: Create Issue',
            mcp_jira_update_issue: 'Jira: Update Issue',

            // MCP Connectors - SAP
            mcp_sap_get_data: 'SAP: Get Data',
            mcp_sap_create_order: 'SAP: Create Order',
            mcp_sap_update: 'SAP: Update Data',

            // MCP Connectors - PeopleSoft
            mcp_peoplesoft_get: 'PeopleSoft: Get Employee',
            mcp_peoplesoft_update: 'PeopleSoft: Update Employee',

            // MCP Connectors - Oracle
            mcp_oracle_query: 'Oracle: Query DB',
            mcp_oracle_execute: 'Oracle: Execute SP',

            // MCP Connectors - MySQL
            mcp_mysql_query: 'MySQL: Query',
            mcp_mysql_insert: 'MySQL: Insert',
            mcp_mysql_update: 'MySQL: Update',

            // MCP Connectors - Office 365
            mcp_o365_send_email: 'O365: Send Email',
            mcp_o365_get_calendar: 'O365: Get Calendar',
            mcp_o365_upload_file: 'O365: Upload to OneDrive',

            // MCP Connectors - Zendesk
            mcp_zendesk_get_ticket: 'Zendesk: Get Ticket',
            mcp_zendesk_create_ticket: 'Zendesk: Create Ticket',
            mcp_zendesk_update: 'Zendesk: Add Comment',

            // MCP Connectors - NetSuite
            mcp_netsuite_get_customer: 'NetSuite: Get Customer',
            mcp_netsuite_create_invoice: 'NetSuite: Create Invoice',
            mcp_netsuite_update: 'NetSuite: Update Record',

            // MCP Connectors - Odoo
            mcp_odoo_get: 'Odoo: Get Product',
            mcp_odoo_create: 'Odoo: Create Sale Order',
            mcp_odoo_update: 'Odoo: Update Inventory',

            // MCP Connectors - SAT México
            mcp_sat_validate_cfdi: 'SAT: Validar CFDI',
            mcp_sat_generate_invoice: 'SAT: Generar Factura',
            mcp_sat_cancel_cfdi: 'SAT: Cancelar CFDI',
            mcp_sat_process_payroll: 'SAT: Procesar Nómina',
            mcp_sat_generate_diot: 'SAT: Generar DIOT',
            mcp_sat_download_mailbox: 'SAT: Descargar Buzón'
        };
        return labels[type] || type.toUpperCase();
    };

    // Obtener detalles de la acción para mostrar
    WorkflowEditor.getActionDetails = function(action) {
        switch (action.type) {
            case 'navigate':
                return action.url || 'No configurado';
            case 'click':
            case 'type':
            case 'extract':
            case 'hover':
                return action.selector || 'No configurado';
            case 'wait':
                return `${action.duration}ms`;
            case 'db_connect':
                return action.connectionName || 'Sin nombre';
            case 'db_query':
                return action.saveName || 'Consulta SQL';
            case 'excel_read':
            case 'pdf_read':
                return action.filePath || 'Sin archivo';
            case 'set_variable':
                return `${action.varName} = ${action.value}`;
            default:
                return 'Configurado';
        }
    };
}
