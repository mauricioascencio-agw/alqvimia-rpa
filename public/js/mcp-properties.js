// 🔧 PROPIEDADES ESPECÍFICAS PARA CADA COMPONENTE MCP

const MCPProperties = {
    // ==========================================
    // BASE DE DATOS - MySQL / Bases de Datos
    // ==========================================
    mcp_mysql_connect: {
        title: 'Conectar a Base de Datos',
        icon: 'fa-plug',
        properties: [
            { name: 'connectionName', label: 'Nombre de Conexión', type: 'select', options: 'db_connections', required: true },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 30 },
            { name: 'autoReconnect', label: 'Reconectar Automáticamente', type: 'checkbox', default: true },
            { name: 'pooling', label: 'Usar Pool de Conexiones', type: 'checkbox', default: true },
            { name: 'maxConnections', label: 'Conexiones Máximas', type: 'number', default: 10 }
        ]
    },

    mcp_mysql_disconnect: {
        title: 'Desconectar Base de Datos',
        icon: 'fa-plug',
        properties: [
            { name: 'connectionName', label: 'Conexión a Cerrar', type: 'select', options: 'active_connections', required: true },
            { name: 'forceClose', label: 'Forzar Cierre', type: 'checkbox', default: false },
            { name: 'timeout', label: 'Timeout de Cierre (segundos)', type: 'number', default: 5 },
            { name: 'saveState', label: 'Guardar Estado antes de cerrar', type: 'checkbox', default: true }
        ]
    },

    mcp_mysql_query: {
        title: 'Ejecutar Query SQL',
        icon: 'fa-code',
        properties: [
            { name: 'connectionName', label: 'Conexión', type: 'select', options: 'active_connections', required: true },
            { name: 'query', label: 'Query SQL', type: 'textarea', required: true, placeholder: 'SELECT * FROM users WHERE id = ?' },
            { name: 'parameters', label: 'Parámetros (JSON)', type: 'text', placeholder: '[1, "john"]' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 30 },
            { name: 'resultVariable', label: 'Guardar Resultado en Variable', type: 'text', required: true }
        ]
    },

    mcp_mysql_execute: {
        title: 'Ejecutar Comando SQL',
        icon: 'fa-terminal',
        properties: [
            { name: 'connectionName', label: 'Conexión', type: 'select', options: 'active_connections', required: true },
            { name: 'command', label: 'Comando SQL', type: 'textarea', required: true, placeholder: 'INSERT INTO users (name, email) VALUES (?, ?)' },
            { name: 'parameters', label: 'Parámetros', type: 'text' },
            { name: 'affectedRowsVar', label: 'Variable para Filas Afectadas', type: 'text' }
        ]
    },

    mcp_mysql_transaction: {
        title: 'Iniciar Transacción',
        icon: 'fa-exchange-alt',
        properties: [
            { name: 'connectionName', label: 'Conexión', type: 'select', options: 'active_connections', required: true },
            { name: 'isolationLevel', label: 'Nivel de Aislamiento', type: 'select', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'] },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 60 }
        ]
    },

    mcp_mysql_commit: {
        title: 'Commit Transacción',
        icon: 'fa-check-circle',
        properties: [
            { name: 'connectionName', label: 'Conexión', type: 'select', options: 'active_connections', required: true }
        ]
    },

    mcp_mysql_rollback: {
        title: 'Rollback Transacción',
        icon: 'fa-undo',
        properties: [
            { name: 'connectionName', label: 'Conexión', type: 'select', options: 'active_connections', required: true },
            { name: 'reason', label: 'Razón del Rollback', type: 'text' }
        ]
    },

    // ==========================================
    // ZOHO CRM
    // ==========================================
    mcp_zoho_get: {
        title: 'Zoho: Obtener Datos',
        icon: 'fa-download',
        properties: [
            { name: 'module', label: 'Módulo', type: 'select', options: ['Leads', 'Contacts', 'Accounts', 'Deals', 'Tasks'], required: true },
            { name: 'recordId', label: 'ID del Registro', type: 'text' },
            { name: 'filters', label: 'Filtros (JSON)', type: 'textarea', placeholder: '{"status": "Active"}' },
            { name: 'fields', label: 'Campos a Obtener', type: 'text', placeholder: 'name,email,phone' },
            { name: 'limit', label: 'Límite de Resultados', type: 'number', default: 100 },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    mcp_zoho_create: {
        title: 'Zoho: Crear Registro',
        icon: 'fa-plus-circle',
        properties: [
            { name: 'module', label: 'Módulo', type: 'select', options: ['Leads', 'Contacts', 'Accounts', 'Deals'], required: true },
            { name: 'data', label: 'Datos (JSON)', type: 'textarea', required: true, placeholder: '{"First_Name": "John", "Last_Name": "Doe", "Email": "john@example.com"}' },
            { name: 'trigger', label: 'Ejecutar Workflows de Zoho', type: 'checkbox', default: true },
            { name: 'resultVariable', label: 'Variable para ID Creado', type: 'text' }
        ]
    },

    mcp_zoho_update: {
        title: 'Zoho: Actualizar Registro',
        icon: 'fa-edit',
        properties: [
            { name: 'module', label: 'Módulo', type: 'select', options: ['Leads', 'Contacts', 'Accounts', 'Deals'], required: true },
            { name: 'recordId', label: 'ID del Registro', type: 'text', required: true },
            { name: 'data', label: 'Datos a Actualizar (JSON)', type: 'textarea', required: true },
            { name: 'trigger', label: 'Ejecutar Workflows', type: 'checkbox', default: true }
        ]
    },

    mcp_zoho_delete: {
        title: 'Zoho: Eliminar Registro',
        icon: 'fa-trash',
        properties: [
            { name: 'module', label: 'Módulo', type: 'select', options: ['Leads', 'Contacts', 'Accounts', 'Deals'], required: true },
            { name: 'recordId', label: 'ID del Registro', type: 'text', required: true },
            { name: 'permanent', label: 'Eliminación Permanente', type: 'checkbox', default: false }
        ]
    },

    // ==========================================
    // JIRA
    // ==========================================
    mcp_jira_get_issue: {
        title: 'Jira: Obtener Issue',
        icon: 'fa-ticket-alt',
        properties: [
            { name: 'issueKey', label: 'Clave del Issue', type: 'text', required: true, placeholder: 'PROJ-123' },
            { name: 'fields', label: 'Campos a Obtener', type: 'text', placeholder: 'summary,status,assignee' },
            { name: 'expand', label: 'Expandir', type: 'text', placeholder: 'changelog,renderedFields' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    mcp_jira_create_issue: {
        title: 'Jira: Crear Issue',
        icon: 'fa-plus-circle',
        properties: [
            { name: 'project', label: 'Proyecto', type: 'text', required: true, placeholder: 'PROJ' },
            { name: 'issueType', label: 'Tipo de Issue', type: 'select', options: ['Bug', 'Task', 'Story', 'Epic'], required: true },
            { name: 'summary', label: 'Resumen', type: 'text', required: true },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'priority', label: 'Prioridad', type: 'select', options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'] },
            { name: 'assignee', label: 'Asignado a', type: 'text' },
            { name: 'labels', label: 'Etiquetas', type: 'text', placeholder: 'bug,urgent' },
            { name: 'resultVariable', label: 'Variable para Issue ID', type: 'text' }
        ]
    },

    mcp_jira_update_issue: {
        title: 'Jira: Actualizar Issue',
        icon: 'fa-edit',
        properties: [
            { name: 'issueKey', label: 'Clave del Issue', type: 'text', required: true },
            { name: 'fields', label: 'Campos a Actualizar (JSON)', type: 'textarea', required: true },
            { name: 'notifyUsers', label: 'Notificar Usuarios', type: 'checkbox', default: true }
        ]
    },

    mcp_jira_transition: {
        title: 'Jira: Transición de Issue',
        icon: 'fa-exchange-alt',
        properties: [
            { name: 'issueKey', label: 'Clave del Issue', type: 'text', required: true },
            { name: 'transitionId', label: 'ID de Transición', type: 'text', required: true },
            { name: 'comment', label: 'Comentario', type: 'textarea' },
            { name: 'resolution', label: 'Resolución', type: 'select', options: ['Done', 'Fixed', 'Won\'t Fix', 'Duplicate'] }
        ]
    },

    mcp_jira_search: {
        title: 'Jira: Buscar Issues',
        icon: 'fa-search',
        properties: [
            { name: 'jql', label: 'JQL Query', type: 'textarea', required: true, placeholder: 'project = PROJ AND status = Open' },
            { name: 'maxResults', label: 'Máximo de Resultados', type: 'number', default: 50 },
            { name: 'fields', label: 'Campos', type: 'text' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // SAP
    // ==========================================
    mcp_sap_connect: {
        title: 'SAP: Conectar',
        icon: 'fa-plug',
        properties: [
            { name: 'system', label: 'Sistema SAP', type: 'text', required: true, placeholder: 'PRD' },
            { name: 'client', label: 'Mandante', type: 'text', required: true, placeholder: '100' },
            { name: 'user', label: 'Usuario', type: 'text', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true },
            { name: 'language', label: 'Idioma', type: 'select', options: ['ES', 'EN', 'DE'], default: 'ES' },
            { name: 'ashost', label: 'Application Server', type: 'text', required: true },
            { name: 'sysnr', label: 'System Number', type: 'text', required: true, placeholder: '00' }
        ]
    },

    mcp_sap_read_table: {
        title: 'SAP: Leer Tabla',
        icon: 'fa-table',
        properties: [
            { name: 'tableName', label: 'Nombre de Tabla', type: 'text', required: true, placeholder: 'MARA, VBAK, etc.' },
            { name: 'fields', label: 'Campos', type: 'text', placeholder: 'MATNR,MAKTX' },
            { name: 'where', label: 'Condiciones WHERE', type: 'textarea', placeholder: 'MATNR = \'000000000100\'' },
            { name: 'rowcount', label: 'Número de Filas', type: 'number', default: 100 },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    mcp_sap_bapi: {
        title: 'SAP: Ejecutar BAPI',
        icon: 'fa-cogs',
        properties: [
            { name: 'bapiName', label: 'Nombre del BAPI', type: 'text', required: true, placeholder: 'BAPI_CUSTOMER_GETLIST' },
            { name: 'import', label: 'Parámetros Import (JSON)', type: 'textarea' },
            { name: 'tables', label: 'Tablas (JSON)', type: 'textarea' },
            { name: 'commit', label: 'Ejecutar COMMIT', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // OFFICE 365
    // ==========================================
    mcp_office365_send_email: {
        title: 'Office 365: Enviar Email',
        icon: 'fa-envelope',
        properties: [
            { name: 'to', label: 'Para', type: 'text', required: true, placeholder: 'user@example.com' },
            { name: 'cc', label: 'CC', type: 'text' },
            { name: 'bcc', label: 'BCC', type: 'text' },
            { name: 'subject', label: 'Asunto', type: 'text', required: true },
            { name: 'body', label: 'Cuerpo del Mensaje', type: 'textarea', required: true },
            { name: 'bodyType', label: 'Tipo de Cuerpo', type: 'select', options: ['HTML', 'Text'], default: 'HTML' },
            { name: 'attachments', label: 'Adjuntos (rutas separadas por coma)', type: 'text' },
            { name: 'importance', label: 'Importancia', type: 'select', options: ['Low', 'Normal', 'High'], default: 'Normal' }
        ]
    },

    mcp_office365_get_emails: {
        title: 'Office 365: Obtener Emails',
        icon: 'fa-inbox',
        properties: [
            { name: 'folder', label: 'Carpeta', type: 'select', options: ['Inbox', 'Sent', 'Drafts', 'Deleted'], default: 'Inbox' },
            { name: 'filter', label: 'Filtro', type: 'text', placeholder: 'isRead eq false' },
            { name: 'top', label: 'Cantidad', type: 'number', default: 10 },
            { name: 'select', label: 'Campos a Seleccionar', type: 'text', placeholder: 'subject,from,receivedDateTime' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    mcp_office365_create_event: {
        title: 'Office 365: Crear Evento de Calendario',
        icon: 'fa-calendar-plus',
        properties: [
            { name: 'subject', label: 'Asunto', type: 'text', required: true },
            { name: 'start', label: 'Fecha/Hora Inicio', type: 'datetime-local', required: true },
            { name: 'end', label: 'Fecha/Hora Fin', type: 'datetime-local', required: true },
            { name: 'location', label: 'Ubicación', type: 'text' },
            { name: 'body', label: 'Descripción', type: 'textarea' },
            { name: 'attendees', label: 'Asistentes (emails separados por coma)', type: 'text' },
            { name: 'isOnline', label: 'Reunión en Línea (Teams)', type: 'checkbox', default: false }
        ]
    },

    // ==========================================
    // EXCEL - OPERACIONES
    // ==========================================
    excel_read: {
        title: 'Excel: Leer Archivo',
        icon: 'fa-file-excel',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true, placeholder: 'C:/datos/archivo.xlsx' },
            { name: 'sheetName', label: 'Hoja de Excel', type: 'text', default: 'Hoja1', placeholder: 'Hoja1' },
            { name: 'range', label: 'Rango (opcional, ej: A1:D10)', type: 'text', placeholder: 'A1:D10' },
            { name: 'saveAs', label: 'Guardar como', type: 'select', options: ['DataFrame Temporal', 'Variable', 'Archivo JSON'], default: 'DataFrame Temporal' },
            { name: 'destinationName', label: 'Nombre del Destino', type: 'text', required: true, placeholder: 'df_excel' }
        ]
    },

    excel_write: {
        title: 'Excel: Escribir Archivo',
        icon: 'fa-file-excel',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true, placeholder: 'C:/salida/resultado.xlsx' },
            { name: 'sheetName', label: 'Hoja de Excel', type: 'text', default: 'Hoja1', placeholder: 'Hoja1' },
            { name: 'dataSource', label: 'Fuente de Datos', type: 'select', options: ['DataFrame Temporal', 'Variable'], required: true },
            { name: 'sourceName', label: 'Nombre de la Fuente', type: 'text', required: true, placeholder: 'df_datos' },
            { name: 'startCell', label: 'Celda de Inicio', type: 'text', default: 'A1', placeholder: 'A1' },
            { name: 'includeHeaders', label: 'Incluir Encabezados', type: 'checkbox', default: true },
            { name: 'overwrite', label: 'Sobrescribir si existe', type: 'checkbox', default: false }
        ]
    },

    excel_append: {
        title: 'Excel: Agregar Datos',
        icon: 'fa-plus-square',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true, placeholder: 'C:/datos/archivo.xlsx' },
            { name: 'sheetName', label: 'Hoja de Excel', type: 'text', default: 'Hoja1' },
            { name: 'dataSource', label: 'Fuente de Datos', type: 'select', options: ['DataFrame Temporal', 'Variable'], required: true },
            { name: 'sourceName', label: 'Nombre de la Fuente', type: 'text', required: true }
        ]
    },

    excel_create_workbook: {
        title: 'Excel: Crear Libro',
        icon: 'fa-file-excel',
        properties: [
            { name: 'filePath', label: 'Ruta del Nuevo Archivo', type: 'text_or_variable', required: true, placeholder: 'C:/nuevo/libro.xlsx' },
            { name: 'sheetName', label: 'Nombre de la Primera Hoja', type: 'text', default: 'Hoja1' },
            { name: 'template', label: 'Usar Plantilla', type: 'text_or_variable', placeholder: 'Ruta a plantilla (opcional)' }
        ]
    },

    excel_create_worksheet: {
        title: 'Excel: Crear Hoja',
        icon: 'fa-file',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'sheetName', label: 'Nombre de la Nueva Hoja', type: 'text', required: true, placeholder: 'Datos2024' }
        ]
    },

    excel_delete_worksheet: {
        title: 'Excel: Eliminar Hoja',
        icon: 'fa-trash',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'sheetName', label: 'Nombre de la Hoja a Eliminar', type: 'text', required: true }
        ]
    },

    excel_find: {
        title: 'Excel: Buscar Valor',
        icon: 'fa-search',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'sheetName', label: 'Hoja de Excel', type: 'text', default: 'Hoja1' },
            { name: 'searchValue', label: 'Valor a Buscar', type: 'text', required: true },
            { name: 'searchDirection', label: 'Dirección', type: 'select', options: ['Horizontal', 'Vertical'], default: 'Horizontal' },
            { name: 'resultVariable', label: 'Variable para Resultado (Celda)', type: 'text', required: true, placeholder: 'celdaEncontrada' }
        ]
    },

    excel_get_cell_color: {
        title: 'Excel: Obtener Color de Celda',
        icon: 'fa-palette',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'sheetName', label: 'Hoja de Excel', type: 'text', default: 'Hoja1' },
            { name: 'cellAddress', label: 'Dirección de Celda', type: 'text', required: true, placeholder: 'A1' },
            { name: 'resultVariable', label: 'Variable para Color (HEX)', type: 'text', required: true }
        ]
    },

    excel_filter: {
        title: 'Excel: Filtrar Datos',
        icon: 'fa-filter',
        properties: [
            { name: 'dataSource', label: 'Fuente de Datos', type: 'text', required: true },
            { name: 'columnName', label: 'Nombre de Columna', type: 'text', required: true },
            { name: 'filterValue', label: 'Valor a Filtrar', type: 'text', required: true },
            { name: 'operator', label: 'Operador', type: 'select', options: ['Igual', 'Contiene', 'Mayor que', 'Menor que', 'Diferente'], default: 'Igual' },
            { name: 'resultVariable', label: 'Variable para Resultado', type: 'text', required: true }
        ]
    },

    excel_convert_pdf: {
        title: 'Excel: Convertir a PDF',
        icon: 'fa-file-pdf',
        properties: [
            { name: 'excelPath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'pdfPath', label: 'Ruta del PDF de Salida', type: 'text_or_variable', required: true, placeholder: 'C:/salida/documento.pdf' },
            { name: 'sheetName', label: 'Hoja a Convertir (vacío = todas)', type: 'text', placeholder: 'Dejar vacío para todas' },
            { name: 'orientation', label: 'Orientación', type: 'select', options: ['Vertical', 'Horizontal'], default: 'Vertical' }
        ]
    },

    excel_password_protected: {
        title: 'Excel: Abrir con Contraseña',
        icon: 'fa-lock',
        properties: [
            { name: 'filePath', label: 'Ruta del Archivo Excel', type: 'text_or_variable', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true },
            { name: 'action', label: 'Acción', type: 'select', options: ['Leer', 'Escribir', 'Abrir'], default: 'Leer' }
        ]
    },

    // ==========================================
    // ANTICAPTCHA - RESOLUCIÓN DE CAPTCHAS
    // ==========================================
    anticaptcha_recaptcha_v2: {
        title: 'AntiCaptcha: reCAPTCHA v2',
        icon: 'fa-shield-alt',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'websiteURL', label: 'URL del Sitio Web', type: 'text', required: true, placeholder: 'https://ejemplo.com' },
            { name: 'websiteKey', label: 'Site Key (data-sitekey)', type: 'text', required: true, placeholder: '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-' },
            { name: 'isInvisible', label: 'reCAPTCHA Invisible', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable para Token', type: 'text', required: true, placeholder: 'captchaToken' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    anticaptcha_recaptcha_v3: {
        title: 'AntiCaptcha: reCAPTCHA v3',
        icon: 'fa-shield-alt',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'websiteURL', label: 'URL del Sitio Web', type: 'text', required: true, placeholder: 'https://ejemplo.com' },
            { name: 'websiteKey', label: 'Site Key', type: 'text', required: true },
            { name: 'pageAction', label: 'Action (del sitio)', type: 'text', default: 'verify', placeholder: 'verify, homepage, etc.' },
            { name: 'minScore', label: 'Score Mínimo', type: 'number', default: 0.3, placeholder: '0.1 a 0.9' },
            { name: 'resultVariable', label: 'Variable para Token', type: 'text', required: true, placeholder: 'captchaToken' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    anticaptcha_hcaptcha: {
        title: 'AntiCaptcha: hCaptcha',
        icon: 'fa-shield-alt',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'websiteURL', label: 'URL del Sitio Web', type: 'text', required: true },
            { name: 'websiteKey', label: 'Site Key', type: 'text', required: true },
            { name: 'isInvisible', label: 'hCaptcha Invisible', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable para Token', type: 'text', required: true, placeholder: 'captchaToken' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    anticaptcha_image: {
        title: 'AntiCaptcha: Imagen',
        icon: 'fa-image',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'imageSource', label: 'Fuente de Imagen', type: 'select', options: ['Archivo Local', 'URL', 'Base64', 'Captura de Pantalla'], required: true },
            { name: 'imagePath', label: 'Ruta/URL/Base64', type: 'text_or_variable', required: true, placeholder: 'C:/captcha.png o https://...' },
            { name: 'caseSensitive', label: 'Sensible a Mayúsculas', type: 'checkbox', default: false },
            { name: 'numericOnly', label: 'Solo Números', type: 'checkbox', default: false },
            { name: 'minLength', label: 'Longitud Mínima', type: 'number', default: 0 },
            { name: 'maxLength', label: 'Longitud Máxima', type: 'number', default: 0 },
            { name: 'resultVariable', label: 'Variable para Texto', type: 'text', required: true, placeholder: 'captchaText' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    anticaptcha_funcaptcha: {
        title: 'AntiCaptcha: FunCaptcha',
        icon: 'fa-puzzle-piece',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'websiteURL', label: 'URL del Sitio Web', type: 'text', required: true },
            { name: 'websitePublicKey', label: 'Public Key', type: 'text', required: true },
            { name: 'funcaptchaApiJSSubdomain', label: 'Subdominio API JS (opcional)', type: 'text', placeholder: 'client-api.arkoselabs.com' },
            { name: 'resultVariable', label: 'Variable para Token', type: 'text', required: true, placeholder: 'captchaToken' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    anticaptcha_geetest: {
        title: 'AntiCaptcha: GeeTest',
        icon: 'fa-shield-alt',
        properties: [
            { name: 'apiKey', label: 'API Key de AntiCaptcha', type: 'password', required: true },
            { name: 'websiteURL', label: 'URL del Sitio Web', type: 'text', required: true },
            { name: 'gt', label: 'GT Parameter', type: 'text', required: true },
            { name: 'challenge', label: 'Challenge Parameter', type: 'text', required: true },
            { name: 'geetestApiServerSubdomain', label: 'API Server Subdomain (opcional)', type: 'text' },
            { name: 'resultVariable', label: 'Variable para Resultado', type: 'text', required: true, placeholder: 'geetestResult' },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 120 }
        ]
    },

    // ==========================================
    // SAT MÉXICO - PORTAL DEL SAT
    // ==========================================
    sat_login: {
        title: 'SAT: Iniciar Sesión',
        icon: 'fa-sign-in-alt',
        properties: [
            { name: 'rfc', label: 'RFC', type: 'text', required: true, placeholder: 'XAXX010101000' },
            { name: 'password', label: 'Contraseña / e.firma', type: 'password', required: true },
            { name: 'authMethod', label: 'Método de Autenticación', type: 'select', options: ['Contraseña', 'e.firma (FIEL)', 'e.firma (archivo)'], default: 'Contraseña' },
            { name: 'cerFile', label: 'Archivo .cer (si aplica)', type: 'text_or_variable', placeholder: 'C:/certificados/cert.cer' },
            { name: 'keyFile', label: 'Archivo .key (si aplica)', type: 'text_or_variable', placeholder: 'C:/certificados/key.key' },
            { name: 'keyPassword', label: 'Contraseña de la llave (si aplica)', type: 'password' },
            { name: 'saveSession', label: 'Guardar Sesión', type: 'checkbox', default: true },
            { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 60 }
        ]
    },

    sat_consultar_facturas: {
        title: 'SAT: Consultar Facturas',
        icon: 'fa-file-invoice',
        properties: [
            { name: 'tipoConsulta', label: 'Tipo de Consulta', type: 'select', options: ['Emitidas', 'Recibidas', 'Todas'], required: true, default: 'Emitidas' },
            { name: 'fechaInicio', label: 'Fecha Inicio', type: 'text', required: true, placeholder: 'YYYY-MM-DD o ${variable}' },
            { name: 'fechaFin', label: 'Fecha Fin', type: 'text', required: true, placeholder: 'YYYY-MM-DD o ${variable}' },
            { name: 'rfcReceptor', label: 'RFC Receptor (opcional)', type: 'text', placeholder: 'Filtrar por RFC específico' },
            { name: 'estadoComprobante', label: 'Estado', type: 'select', options: ['Todos', 'Vigente', 'Cancelado'], default: 'Todos' },
            { name: 'tipoComprobante', label: 'Tipo de Comprobante', type: 'select', options: ['Todos', 'Ingreso', 'Egreso', 'Traslado', 'Nómina', 'Pago'], default: 'Todos' },
            { name: 'resultVariable', label: 'Variable para Resultados', type: 'text', required: true, placeholder: 'facturasSAT' }
        ]
    },

    sat_descargar_xml: {
        title: 'SAT: Descargar XML',
        icon: 'fa-download',
        properties: [
            { name: 'sourceVariable', label: 'Variable con Facturas', type: 'text', required: true, placeholder: 'facturasSAT' },
            { name: 'downloadPath', label: 'Carpeta de Descarga', type: 'text_or_variable', required: true, placeholder: 'C:/Descargas/Facturas' },
            { name: 'downloadMetadata', label: 'Descargar Metadata', type: 'checkbox', default: true },
            { name: 'organizeBy', label: 'Organizar por', type: 'select', options: ['Fecha', 'RFC', 'Tipo', 'Sin Organizar'], default: 'Fecha' },
            { name: 'overwrite', label: 'Sobrescribir Existentes', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable para Resultado (cantidad descargada)', type: 'text', placeholder: 'xmlDescargados' }
        ]
    },

    sat_validar_cfdi: {
        title: 'SAT: Validar CFDI',
        icon: 'fa-check-circle',
        properties: [
            { name: 'xmlSource', label: 'Fuente del XML', type: 'select', options: ['Archivo Local', 'Variable', 'URL'], required: true },
            { name: 'xmlPath', label: 'Ruta/Variable/URL del XML', type: 'text_or_variable', required: true },
            { name: 'validationType', label: 'Tipo de Validación', type: 'select', options: ['Estructura', 'Sello', 'Estado en SAT', 'Completa'], default: 'Completa' },
            { name: 'checkCancellation', label: 'Verificar si está Cancelado', type: 'checkbox', default: true },
            { name: 'resultVariable', label: 'Variable para Resultado', type: 'text', required: true, placeholder: 'validacionCFDI' }
        ]
    },

    sat_obtener_certificados: {
        title: 'SAT: Obtener Certificados',
        icon: 'fa-certificate',
        properties: [
            { name: 'rfc', label: 'RFC', type: 'text', required: true },
            { name: 'listType', label: 'Listar', type: 'select', options: ['Todos', 'Vigentes', 'Revocados', 'Caducados'], default: 'Vigentes' },
            { name: 'downloadCertificates', label: 'Descargar Certificados', type: 'checkbox', default: false },
            { name: 'downloadPath', label: 'Carpeta de Descarga', type: 'text_or_variable', placeholder: 'C:/Certificados' },
            { name: 'resultVariable', label: 'Variable para Lista', type: 'text', required: true, placeholder: 'certificadosSAT' }
        ]
    },

    sat_consultar_csd: {
        title: 'SAT: Consultar CSD (Certificado de Sello Digital)',
        icon: 'fa-id-card',
        properties: [
            { name: 'rfc', label: 'RFC', type: 'text', required: true },
            { name: 'serialNumber', label: 'Número de Serie (opcional)', type: 'text', placeholder: 'Dejar vacío para todos' },
            { name: 'includeDetails', label: 'Incluir Detalles Completos', type: 'checkbox', default: true },
            { name: 'resultVariable', label: 'Variable para Información', type: 'text', required: true, placeholder: 'infoCSD' }
        ]
    },

    sat_constancia_situacion: {
        title: 'SAT: Descargar Constancia de Situación Fiscal',
        icon: 'fa-file-pdf',
        properties: [
            { name: 'rfc', label: 'RFC', type: 'text', required: true },
            { name: 'outputPath', label: 'Ruta de Salida', type: 'text_or_variable', required: true, placeholder: 'C:/Descargas/Constancia.pdf' },
            { name: 'format', label: 'Formato', type: 'select', options: ['PDF', 'XML'], default: 'PDF' },
            { name: 'resultVariable', label: 'Variable para Ruta del Archivo', type: 'text', placeholder: 'rutaConstancia' }
        ]
    },

    sat_declaraciones: {
        title: 'SAT: Consultar/Presentar Declaraciones',
        icon: 'fa-file-alt',
        properties: [
            { name: 'action', label: 'Acción', type: 'select', options: ['Consultar', 'Presentar', 'Descargar Acuse'], required: true },
            { name: 'tipoDeclaracion', label: 'Tipo de Declaración', type: 'select', options: ['Normal', 'Complementaria', 'Extemporánea'], default: 'Normal' },
            { name: 'periodo', label: 'Periodo', type: 'text', placeholder: 'Mes/Año (ej: 01/2024)' },
            { name: 'ejercicio', label: 'Ejercicio', type: 'text', placeholder: '2024' },
            { name: 'tipoImpuesto', label: 'Tipo de Impuesto', type: 'select', options: ['ISR', 'IVA', 'IEPS', 'Retenciones'], default: 'ISR' },
            { name: 'datosDeclaracion', label: 'Datos de la Declaración (JSON)', type: 'textarea', placeholder: 'Variable o JSON con los datos' },
            { name: 'outputPath', label: 'Ruta de Salida (para descargas)', type: 'text_or_variable', placeholder: 'C:/Declaraciones' },
            { name: 'resultVariable', label: 'Variable para Resultado', type: 'text', required: true, placeholder: 'resultadoDeclaracion' }
        ]
    },

    sat_opinion_cumplimiento: {
        title: 'SAT: Obtener Opinión de Cumplimiento',
        icon: 'fa-thumbs-up',
        properties: [
            { name: 'rfc', label: 'RFC', type: 'text', required: true },
            { name: 'tipoOpinion', label: 'Tipo de Opinión', type: 'select', options: ['32-D (General)', '32-D IMSS', '32-D INFONAVIT'], default: '32-D (General)' },
            { name: 'outputPath', label: 'Ruta de Salida PDF', type: 'text_or_variable', required: true, placeholder: 'C:/Descargas/Opinion.pdf' },
            { name: 'resultVariable', label: 'Variable para Información', type: 'text', required: true, placeholder: 'opinionCumplimiento' }
        ]
    },

    sat_buzontributario: {
        title: 'SAT: Consultar Buzón Tributario',
        icon: 'fa-inbox',
        properties: [
            { name: 'tipoDocumento', label: 'Tipo de Documento', type: 'select', options: ['Todos', 'Notificaciones', 'Requerimientos', 'Resoluciones', 'Avisos'], default: 'Todos' },
            { name: 'estado', label: 'Estado', type: 'select', options: ['Todos', 'Pendiente', 'Leído', 'Procesado'], default: 'Pendiente' },
            { name: 'fechaInicio', label: 'Fecha Inicio (opcional)', type: 'text', placeholder: 'YYYY-MM-DD' },
            { name: 'fechaFin', label: 'Fecha Fin (opcional)', type: 'text', placeholder: 'YYYY-MM-DD' },
            { name: 'marcarComoLeido', label: 'Marcar como Leído', type: 'checkbox', default: false },
            { name: 'descargarAdjuntos', label: 'Descargar Adjuntos', type: 'checkbox', default: false },
            { name: 'downloadPath', label: 'Carpeta de Descarga', type: 'text_or_variable', placeholder: 'C:/BuzonTributario' },
            { name: 'resultVariable', label: 'Variable para Documentos', type: 'text', required: true, placeholder: 'documentosBuzon' }
        ]
    },

    sat_logout: {
        title: 'SAT: Cerrar Sesión',
        icon: 'fa-sign-out-alt',
        properties: [
            { name: 'clearCache', label: 'Limpiar Caché', type: 'checkbox', default: true },
            { name: 'closeBrowser', label: 'Cerrar Navegador', type: 'checkbox', default: false }
        ]
    },

    // Función para obtener las propiedades de un componente
    getProperties(actionType) {
        return this[actionType] || {
            title: 'Configuración',
            icon: 'fa-cog',
            properties: [
                { name: 'description', label: 'Descripción', type: 'text' }
            ]
        };
    },

    // Renderizar formulario de propiedades
    renderPropertiesForm(actionType, currentValues = {}) {
        const config = this.getProperties(actionType);

        let html = `
            <div class="mcp-properties-form">
                <div class="mcp-form-header">
                    <i class="fas ${config.icon}"></i>
                    <h4>${config.title}</h4>
                </div>
                <div class="mcp-form-body">
        `;

        config.properties.forEach(prop => {
            const value = currentValues[prop.name] || prop.default || '';
            html += this.renderField(prop, value);
        });

        html += `
                </div>
            </div>
        `;

        return html;
    },

    renderField(prop, value) {
        let field = '';

        switch (prop.type) {
            case 'text_or_variable':
                // Campo especial que permite texto o seleccionar variable
                field = `
                    <div class="form-group">
                        <label>${prop.label}${prop.required ? ' <span class="required">*</span>' : ''}</label>
                        ${typeof VariablesManager !== 'undefined' ?
                            VariablesManager.renderVariableSelector(value, prop.name) :
                            `<input type="text" name="${prop.name}" class="form-control" value="${value}" placeholder="${prop.placeholder || ''}" ${prop.required ? 'required' : ''}>`
                        }
                    </div>
                `;
                break;

            case 'text':
            case 'number':
            case 'password':
            case 'datetime-local':
                field = `
                    <div class="form-group">
                        <label>${prop.label}${prop.required ? ' <span class="required">*</span>' : ''}</label>
                        <input type="${prop.type}"
                               name="${prop.name}"
                               class="form-control"
                               value="${value}"
                               placeholder="${prop.placeholder || ''}"
                               ${prop.required ? 'required' : ''}>
                    </div>
                `;
                break;

            case 'textarea':
                field = `
                    <div class="form-group">
                        <label>${prop.label}${prop.required ? ' <span class="required">*</span>' : ''}</label>
                        <textarea name="${prop.name}"
                                  class="form-control"
                                  rows="4"
                                  placeholder="${prop.placeholder || ''}"
                                  ${prop.required ? 'required' : ''}>${value}</textarea>
                    </div>
                `;
                break;

            case 'select':
                const options = Array.isArray(prop.options) ? prop.options : [];
                field = `
                    <div class="form-group">
                        <label>${prop.label}${prop.required ? ' <span class="required">*</span>' : ''}</label>
                        <select name="${prop.name}" class="form-control" ${prop.required ? 'required' : ''}>
                            <option value="">-- Seleccionar --</option>
                            ${options.map(opt => {
                                // Soportar tanto strings simples como objetos {value, label}
                                const optValue = typeof opt === 'object' ? opt.value : opt;
                                const optLabel = typeof opt === 'object' ? opt.label : opt;
                                return `<option value="${optValue}" ${value === optValue ? 'selected' : ''}>${optLabel}</option>`;
                            }).join('')}
                        </select>
                    </div>
                `;
                break;

            case 'checkbox':
                field = `
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox"
                                   name="${prop.name}"
                                   ${value || prop.default ? 'checked' : ''}>
                            <span>${prop.label}</span>
                        </label>
                    </div>
                `;
                break;
        }

        return field;
    },

    // ==========================================
    // IA - INTELIGENCIA ARTIFICIAL
    // ==========================================
    ai_text_generation: {
        title: 'IA: Generar Texto',
        icon: 'fa-robot',
        properties: [
            { name: 'prompt', label: 'Prompt / Instrucción', type: 'textarea', required: true, placeholder: 'Escribe un resumen de este texto...' },
            { name: 'context', label: 'Contexto (opcional)', type: 'textarea', placeholder: 'Información adicional...' },
            { name: 'maxTokens', label: 'Máximo de Tokens', type: 'number', default: 500 },
            { name: 'temperature', label: 'Creatividad (0-1)', type: 'number', default: 0.7 },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    ai_sentiment: {
        title: 'IA: Análisis de Sentimientos',
        icon: 'fa-smile',
        properties: [
            { name: 'text', label: 'Texto a Analizar', type: 'textarea', required: true },
            { name: 'language', label: 'Idioma', type: 'select', options: ['Español', 'Inglés', 'Auto'], default: 'Auto' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    ai_classification: {
        title: 'IA: Clasificación de Texto',
        icon: 'fa-tags',
        properties: [
            { name: 'text', label: 'Texto a Clasificar', type: 'textarea', required: true },
            { name: 'categories', label: 'Categorías (separadas por coma)', type: 'text', required: true, placeholder: 'Urgente, Normal, Bajo' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    ai_translation: {
        title: 'IA: Traducción',
        icon: 'fa-language',
        properties: [
            { name: 'text', label: 'Texto a Traducir', type: 'textarea', required: true },
            { name: 'sourceLang', label: 'Idioma Origen', type: 'select', options: ['Auto', 'Español', 'Inglés', 'Francés', 'Alemán'], default: 'Auto' },
            { name: 'targetLang', label: 'Idioma Destino', type: 'select', options: ['Español', 'Inglés', 'Francés', 'Alemán'], required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // OCR - RECONOCIMIENTO ÓPTICO DE CARACTERES
    // ==========================================
    ocr_image: {
        title: 'OCR: Extraer Texto de Imagen',
        icon: 'fa-image',
        properties: [
            { name: 'imagePath', label: 'Ruta de la Imagen', type: 'text_or_variable', required: true, placeholder: 'C:/imagenes/documento.png' },
            { name: 'language', label: 'Idioma', type: 'select', options: ['Español', 'Inglés', 'Francés'], default: 'Español' },
            { name: 'ocrEngine', label: 'Motor OCR', type: 'select', options: ['Tesseract', 'Google Vision', 'Azure'], default: 'Tesseract' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    ocr_pdf: {
        title: 'OCR: Extraer Texto de PDF',
        icon: 'fa-file-pdf',
        properties: [
            { name: 'pdfPath', label: 'Ruta del PDF', type: 'text_or_variable', required: true, placeholder: 'C:/documentos/archivo.pdf' },
            { name: 'pages', label: 'Páginas (ej: 1-3,5)', type: 'text', placeholder: 'all' },
            { name: 'language', label: 'Idioma', type: 'select', options: ['Español', 'Inglés', 'Francés'], default: 'Español' },
            { name: 'extractImages', label: 'Extraer Imágenes también', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    pdf_read: {
        title: 'PDF: Leer Documento',
        icon: 'fa-book-open',
        properties: [
            { name: 'filePath', label: 'Ruta del PDF', type: 'text_or_variable', required: true, placeholder: 'C:/documentos/archivo.pdf' },
            { name: 'pages', label: 'Páginas (ej: 1-3)', type: 'text', placeholder: 'all' },
            { name: 'extractText', label: 'Extraer Texto', type: 'checkbox', default: true },
            { name: 'extractMetadata', label: 'Extraer Metadatos', type: 'checkbox', default: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    pdf_create: {
        title: 'PDF: Crear Documento',
        icon: 'fa-file-pdf',
        properties: [
            { name: 'outputPath', label: 'Ruta de Salida', type: 'text', required: true, placeholder: 'C:/salida/documento.pdf' },
            { name: 'content', label: 'Contenido', type: 'textarea', required: true },
            { name: 'title', label: 'Título del Documento', type: 'text' },
            { name: 'author', label: 'Autor', type: 'text' },
            { name: 'pageSize', label: 'Tamaño de Página', type: 'select', options: ['A4', 'Letter', 'Legal'], default: 'A4' }
        ]
    },

    // ==========================================
    // AMAZON SAGEMAKER
    // ==========================================
    sage_deploy_model: {
        title: 'SageMaker: Desplegar Modelo',
        icon: 'fa-rocket',
        properties: [
            { name: 'modelName', label: 'Nombre del Modelo', type: 'text', required: true },
            { name: 'endpointName', label: 'Nombre del Endpoint', type: 'text', required: true },
            { name: 'instanceType', label: 'Tipo de Instancia', type: 'select', options: ['ml.t2.medium', 'ml.m5.large', 'ml.c5.xlarge'], default: 'ml.t2.medium' },
            { name: 'instanceCount', label: 'Número de Instancias', type: 'number', default: 1 }
        ]
    },

    sage_invoke: {
        title: 'SageMaker: Invocar Modelo',
        icon: 'fa-play-circle',
        properties: [
            { name: 'endpointName', label: 'Nombre del Endpoint', type: 'text', required: true },
            { name: 'inputData', label: 'Datos de Entrada (JSON)', type: 'textarea', required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    sage_train: {
        title: 'SageMaker: Entrenar Modelo',
        icon: 'fa-graduation-cap',
        properties: [
            { name: 'trainingJobName', label: 'Nombre del Job', type: 'text', required: true },
            { name: 's3TrainingData', label: 'Ubicación S3 de Datos', type: 'text', required: true },
            { name: 'algorithm', label: 'Algoritmo', type: 'select', options: ['XGBoost', 'Linear Learner', 'K-Means'], required: true },
            { name: 'instanceType', label: 'Tipo de Instancia', type: 'select', options: ['ml.m5.large', 'ml.p3.2xlarge'], default: 'ml.m5.large' }
        ]
    },

    // ==========================================
    // HUGGING FACE
    // ==========================================
    hf_load_model: {
        title: 'HuggingFace: Cargar Modelo',
        icon: 'fa-download',
        properties: [
            { name: 'modelId', label: 'ID del Modelo', type: 'text', required: true, placeholder: 'bert-base-uncased' },
            { name: 'task', label: 'Tarea', type: 'select', options: ['text-classification', 'ner', 'question-answering', 'summarization'], required: true },
            { name: 'modelVariable', label: 'Variable del Modelo', type: 'text', required: true }
        ]
    },

    hf_inference: {
        title: 'HuggingFace: Inferencia',
        icon: 'fa-magic',
        properties: [
            { name: 'modelVariable', label: 'Variable del Modelo', type: 'text', required: true },
            { name: 'inputText', label: 'Texto de Entrada', type: 'textarea', required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    hf_pipeline: {
        title: 'HuggingFace: Pipeline',
        icon: 'fa-stream',
        properties: [
            { name: 'task', label: 'Tarea', type: 'select', options: ['sentiment-analysis', 'text-generation', 'translation'], required: true },
            { name: 'model', label: 'Modelo (opcional)', type: 'text', placeholder: 'Dejar vacío para usar modelo por defecto' },
            { name: 'inputText', label: 'Texto', type: 'textarea', required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // DOCUMENT AI SKILLS
    // ==========================================
    skill_extract_data: {
        title: 'Skill: Extraer Datos',
        icon: 'fa-file-export',
        properties: [
            { name: 'documentPath', label: 'Ruta del Documento', type: 'text_or_variable', required: true },
            { name: 'extractionType', label: 'Tipo de Extracción', type: 'select', options: ['Facturas', 'Recibos', 'Formularios', 'Tablas'], required: true },
            { name: 'fields', label: 'Campos a Extraer (JSON)', type: 'textarea', placeholder: '["nombre", "total", "fecha"]' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    skill_summarize: {
        title: 'Skill: Resumir Documento',
        icon: 'fa-compress-alt',
        properties: [
            { name: 'text', label: 'Texto a Resumir', type: 'textarea', required: true },
            { name: 'maxLength', label: 'Longitud Máxima (palabras)', type: 'number', default: 150 },
            { name: 'style', label: 'Estilo', type: 'select', options: ['Conciso', 'Detallado', 'Ejecutivo'], default: 'Conciso' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    skill_validate: {
        title: 'Skill: Validar Datos',
        icon: 'fa-check-circle',
        properties: [
            { name: 'data', label: 'Datos a Validar (JSON)', type: 'textarea', required: true },
            { name: 'rules', label: 'Reglas de Validación (JSON)', type: 'textarea', required: true, placeholder: '{"email": "regex", "age": "number"}' },
            { name: 'strictMode', label: 'Modo Estricto', type: 'checkbox', default: false },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // ACTIVE DIRECTORY
    // ==========================================
    ad_connect: {
        title: 'AD: Conectar a Active Directory',
        icon: 'fa-server',
        properties: [
            { name: 'server', label: 'Servidor AD', type: 'text', required: true, placeholder: 'ldap://dc.empresa.com' },
            { name: 'domain', label: 'Dominio', type: 'text', required: true, placeholder: 'EMPRESA' },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true },
            { name: 'connectionName', label: 'Nombre de Conexión', type: 'text', required: true }
        ]
    },

    ad_get_user: {
        title: 'AD: Obtener Usuario',
        icon: 'fa-user',
        properties: [
            { name: 'connectionName', label: 'Conexión AD', type: 'text', required: true },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'attributes', label: 'Atributos (separados por coma)', type: 'text', placeholder: 'displayName,mail,department' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    ad_create_user: {
        title: 'AD: Crear Usuario',
        icon: 'fa-user-plus',
        properties: [
            { name: 'connectionName', label: 'Conexión AD', type: 'text', required: true },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'displayName', label: 'Nombre Completo', type: 'text', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true },
            { name: 'ou', label: 'Unidad Organizativa', type: 'text', placeholder: 'OU=Usuarios,DC=empresa,DC=com' },
            { name: 'email', label: 'Email', type: 'text' }
        ]
    },

    ad_disable_user: {
        title: 'AD: Deshabilitar Usuario',
        icon: 'fa-user-lock',
        properties: [
            { name: 'connectionName', label: 'Conexión AD', type: 'text', required: true },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'reason', label: 'Razón', type: 'text' }
        ]
    },

    ad_add_to_group: {
        title: 'AD: Agregar a Grupo',
        icon: 'fa-users',
        properties: [
            { name: 'connectionName', label: 'Conexión AD', type: 'text', required: true },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'groupName', label: 'Nombre del Grupo', type: 'text', required: true }
        ]
    },

    // ==========================================
    // BROWSER / NAVEGADOR
    // ==========================================
    browser_open: {
        title: 'Navegador: Abrir',
        icon: 'fa-window-restore',
        properties: [
            { name: 'browserType', label: 'Navegador', type: 'select', options: ['Chrome', 'Firefox', 'Edge'], default: 'Chrome' },
            { name: 'url', label: 'URL Inicial', type: 'text', placeholder: 'https://ejemplo.com' },
            { name: 'headless', label: 'Modo Oculto', type: 'checkbox', default: false },
            { name: 'windowSize', label: 'Tamaño de Ventana', type: 'text', placeholder: '1920x1080' }
        ]
    },

    browser_close: {
        title: 'Navegador: Cerrar',
        icon: 'fa-times',
        properties: [
            { name: 'saveSession', label: 'Guardar Sesión', type: 'checkbox', default: false }
        ]
    },

    browser_go_back: {
        title: 'Navegador: Retroceder',
        icon: 'fa-arrow-left',
        properties: []
    },

    browser_download: {
        title: 'Navegador: Descargar Archivo',
        icon: 'fa-download',
        properties: [
            { name: 'url', label: 'URL del Archivo', type: 'text', required: true },
            { name: 'savePath', label: 'Ruta de Guardado', type: 'text', required: true },
            { name: 'waitForDownload', label: 'Esperar a que Complete', type: 'checkbox', default: true }
        ]
    },

    browser_get_source: {
        title: 'Navegador: Obtener Código Fuente',
        icon: 'fa-code',
        properties: [
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    browser_run_js: {
        title: 'Navegador: Ejecutar JavaScript',
        icon: 'fa-js',
        properties: [
            { name: 'script', label: 'Código JavaScript', type: 'textarea', required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text' }
        ]
    },

    browser_find_links: {
        title: 'Navegador: Buscar Enlaces',
        icon: 'fa-link',
        properties: [
            { name: 'pattern', label: 'Patrón de Búsqueda', type: 'text', placeholder: '*producto*' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // CLIPBOARD / PORTAPAPELES
    // ==========================================
    clipboard_copy: {
        title: 'Portapapeles: Copiar',
        icon: 'fa-copy',
        properties: [
            { name: 'text', label: 'Texto a Copiar', type: 'textarea', required: true }
        ]
    },

    clipboard_paste: {
        title: 'Portapapeles: Pegar',
        icon: 'fa-paste',
        properties: [
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    clipboard_clear: {
        title: 'Portapapeles: Limpiar',
        icon: 'fa-eraser',
        properties: []
    },

    // ==========================================
    // ANÁLISIS Y REPORTING
    // ==========================================
    analyze_performance: {
        title: 'Análisis: Performance',
        icon: 'fa-tachometer-alt',
        properties: [
            { name: 'workflowId', label: 'ID del Workflow', type: 'text', required: true },
            { name: 'metrics', label: 'Métricas', type: 'select', options: ['Tiempo de Ejecución', 'Uso de Memoria', 'Errores', 'Todo'], default: 'Todo' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    analyze_data: {
        title: 'Análisis: Datos',
        icon: 'fa-chart-bar',
        properties: [
            { name: 'dataSource', label: 'Fuente de Datos', type: 'text', required: true },
            { name: 'analysisType', label: 'Tipo de Análisis', type: 'select', options: ['Estadísticas Básicas', 'Correlación', 'Tendencias'], required: true },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    analyze_logs: {
        title: 'Análisis: Logs',
        icon: 'fa-file-alt',
        properties: [
            { name: 'logPath', label: 'Ruta del Log', type: 'text', required: true },
            { name: 'pattern', label: 'Patrón de Búsqueda', type: 'text', placeholder: 'ERROR|WARN' },
            { name: 'lastNLines', label: 'Últimas N Líneas', type: 'number', default: 100 },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    },

    // ==========================================
    // APP / APLICACIONES
    // ==========================================
    app_open: {
        title: 'App: Abrir Aplicación',
        icon: 'fa-external-link-alt',
        properties: [
            { name: 'appPath', label: 'Ruta de la Aplicación', type: 'text', required: true, placeholder: 'C:/Program Files/App/app.exe' },
            { name: 'arguments', label: 'Argumentos', type: 'text', placeholder: '--start --fullscreen' },
            { name: 'waitForReady', label: 'Esperar a que esté Lista', type: 'checkbox', default: true }
        ]
    },

    app_close: {
        title: 'App: Cerrar Aplicación',
        icon: 'fa-times-circle',
        properties: [
            { name: 'appName', label: 'Nombre de la Aplicación', type: 'text', required: true },
            { name: 'forceClose', label: 'Forzar Cierre', type: 'checkbox', default: false }
        ]
    },

    app_maximize: {
        title: 'App: Maximizar Ventana',
        icon: 'fa-expand',
        properties: [
            { name: 'appName', label: 'Nombre de la Aplicación', type: 'text', required: true }
        ]
    },

    app_minimize: {
        title: 'App: Minimizar Ventana',
        icon: 'fa-compress',
        properties: [
            { name: 'appName', label: 'Nombre de la Aplicación', type: 'text', required: true }
        ]
    },

    app_api_call: {
        title: 'App: Llamada API',
        icon: 'fa-network-wired',
        properties: [
            { name: 'url', label: 'URL', type: 'text', required: true },
            { name: 'method', label: 'Método', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
            { name: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Authorization": "Bearer token"}' },
            { name: 'body', label: 'Body (JSON)', type: 'textarea' },
            { name: 'resultVariable', label: 'Variable de Resultado', type: 'text', required: true }
        ]
    }
};
