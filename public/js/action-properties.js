// 🔧 SISTEMA DE PROPIEDADES Y EDICIÓN DE ACCIONES

const ActionProperties = {
    // Inicializar
    init() {
        console.log('ActionProperties initialized');
    },

    // Mostrar modal de propiedades según el tipo de acción
    showPropertiesModal(action, onSave) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> Propiedades: ${this.getActionName(action.type)}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.renderProperties(action)}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="savePropertiesBtn">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Guardar propiedades
        modal.querySelector('#savePropertiesBtn').onclick = () => {
            const updatedAction = this.collectProperties(modal, action);
            onSave(updatedAction);
            modal.remove();
        };
    },

    // Obtener nombre legible de la acción
    getActionName(type) {
        const names = {
            // Web
            navigate: 'Navegar a URL',
            click: 'Click en Elemento',
            type: 'Escribir Texto',
            wait: 'Esperar',
            screenshot: 'Captura de Pantalla',
            extract: 'Extraer Datos',

            // Database
            db_connect: 'Conectar Base de Datos',
            db_query: 'Consultar SQL',
            db_insert: 'Insertar Datos',

            // Email
            email_send: 'Enviar Email',
            email_connect: 'Conectar Email',
            email_reply: 'Responder Email',

            // Variables
            set_variable: 'Establecer Variable',
            get_variable: 'Obtener Variable',

            // Control de Flujo
            if_condition: 'Condición IF',
            for_loop: 'Bucle FOR',
            while_loop: 'Bucle WHILE'
        };
        return names[type] || type.toUpperCase();
    },

    // Renderizar propiedades según el tipo
    renderProperties(action) {
        // Si es un componente MCP, usar MCPProperties
        if (action.type && action.type.startsWith('mcp_')) {
            if (typeof MCPProperties !== 'undefined') {
                return MCPProperties.renderPropertiesForm(action.type, action.properties || {});
            }
        }

        switch (action.type) {
            case 'navigate':
                return this.renderNavigateProperties(action);
            case 'click':
                return this.renderClickProperties(action);
            case 'type':
                return this.renderTypeProperties(action);
            case 'wait':
                return this.renderWaitProperties(action);
            case 'screenshot':
                return this.renderScreenshotProperties(action);
            case 'extract':
                return this.renderExtractProperties(action);
            case 'db_connect':
                return this.renderDbConnectProperties(action);
            case 'db_query':
                return this.renderDbQueryProperties(action);
            case 'email_send':
                return this.renderEmailSendProperties(action);
            case 'email_connect':
                return this.renderEmailConnectProperties(action);
            case 'set_variable':
                return this.renderSetVariableProperties(action);
            case 'get_variable':
                return this.renderGetVariableProperties(action);
            case 'if_condition':
                return this.renderIfConditionProperties(action);
            case 'for_loop':
                return this.renderForLoopProperties(action);
            default:
                return this.renderGenericProperties(action);
        }
    },

    // Propiedades genéricas
    renderGenericProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-tag"></i> Nombre de la Acción</label>
                <input type="text" id="actionName" class="form-control"
                       value="${action.name || ''}" placeholder="Nombre descriptivo">
            </div>
            <div class="form-group">
                <label><i class="fas fa-comment"></i> Descripción</label>
                <textarea id="actionDescription" class="form-control" rows="3"
                          placeholder="Descripción opcional">${action.description || ''}</textarea>
            </div>
            <div class="alert" style="background: #1e293b; border-left: 3px solid #f59e0b; padding: 1rem; margin-top: 1rem;">
                <i class="fas fa-info-circle"></i> Esta acción aún no tiene propiedades específicas configuradas.
            </div>
        `;
    },

    // Propiedades: Navigate
    renderNavigateProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-link"></i> URL *</label>
                <input type="url" id="url" class="form-control" required
                       value="${action.url || ''}" placeholder="https://ejemplo.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-clock"></i> Timeout (ms)</label>
                <input type="number" id="timeout" class="form-control"
                       value="${action.timeout || 30000}" min="1000" step="1000">
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="waitForLoad" ${action.waitForLoad ? 'checked' : ''}>
                    <span>Esperar a que la página cargue completamente</span>
                </label>
            </div>
        `;
    },

    // Propiedades: Click
    renderClickProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-bullseye"></i> Selector CSS *</label>
                <input type="text" id="selector" class="form-control" required
                       value="${action.selector || ''}" placeholder="#boton, .clase, button">
            </div>
            <div class="form-group">
                <label><i class="fas fa-mouse-pointer"></i> Tipo de Click</label>
                <select id="clickType" class="form-control">
                    <option value="single" ${action.clickType === 'single' ? 'selected' : ''}>Click simple</option>
                    <option value="double" ${action.clickType === 'double' ? 'selected' : ''}>Doble click</option>
                    <option value="right" ${action.clickType === 'right' ? 'selected' : ''}>Click derecho</option>
                </select>
            </div>
            <div class="form-group">
                <label><i class="fas fa-clock"></i> Esperar antes del click (ms)</label>
                <input type="number" id="delayBefore" class="form-control"
                       value="${action.delayBefore || 0}" min="0" step="100">
            </div>
        `;
    },

    // Propiedades: Type (escribir texto)
    renderTypeProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-bullseye"></i> Selector CSS *</label>
                <input type="text" id="selector" class="form-control" required
                       value="${action.selector || ''}" placeholder="#input, .campo">
            </div>
            <div class="form-group">
                <label><i class="fas fa-keyboard"></i> Texto a escribir *</label>
                <textarea id="text" class="form-control" rows="3" required
                          placeholder="Texto que se escribirá">${action.text || ''}</textarea>
            </div>
            <div class="form-group">
                <label><i class="fas fa-tachometer-alt"></i> Velocidad de escritura</label>
                <select id="typingSpeed" class="form-control">
                    <option value="instant" ${action.typingSpeed === 'instant' ? 'selected' : ''}>Instantáneo</option>
                    <option value="fast" ${action.typingSpeed === 'fast' ? 'selected' : ''}>Rápido (50ms)</option>
                    <option value="normal" ${action.typingSpeed === 'normal' || !action.typingSpeed ? 'selected' : ''}>Normal (100ms)</option>
                    <option value="slow" ${action.typingSpeed === 'slow' ? 'selected' : ''}>Lento (200ms)</option>
                </select>
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="clearBefore" ${action.clearBefore ? 'checked' : ''}>
                    <span>Limpiar campo antes de escribir</span>
                </label>
            </div>
        `;
    },

    // Propiedades: Wait
    renderWaitProperties(action) {
        const timeValue = action.timeValue || 1;
        const timeUnit = action.timeUnit || 'seconds';
        const windowId = action.windowId || 'current';

        return `
            <div class="form-group">
                <label><i class="fas fa-window-restore"></i> Aplicar a Ventana</label>
                <select id="windowId" class="form-control">
                    <option value="current" ${windowId === 'current' ? 'selected' : ''}>Ventana Actual</option>
                    <option value="all" ${windowId === 'all' ? 'selected' : ''}>Todas las Ventanas</option>
                    <option value="new" ${windowId === 'new' ? 'selected' : ''}>Nueva Ventana</option>
                    <option value="main" ${windowId === 'main' ? 'selected' : ''}>Ventana Principal</option>
                </select>
            </div>
            <div class="form-group">
                <label><i class="fas fa-clock"></i> Duración *</label>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
                    <input type="number" id="timeValue" class="form-control" required
                           value="${timeValue}" min="1" step="1">
                    <select id="timeUnit" class="form-control">
                        <option value="milliseconds" ${timeUnit === 'milliseconds' ? 'selected' : ''}>Milisegundos</option>
                        <option value="seconds" ${timeUnit === 'seconds' ? 'selected' : ''}>Segundos</option>
                        <option value="minutes" ${timeUnit === 'minutes' ? 'selected' : ''}>Minutos</option>
                        <option value="hours" ${timeUnit === 'hours' ? 'selected' : ''}>Horas</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label><i class="fas fa-info-circle"></i> Descripción</label>
                <input type="text" id="description" class="form-control"
                       value="${action.description || ''}" placeholder="¿Por qué estamos esperando?">
            </div>
            <div style="background: #1e293b; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <div style="color: #94a3b8; font-size: 0.9rem;">
                    <strong>⏱️ Conversión Automática:</strong><br>
                    <span id="timeConversion" style="color: #2563eb; font-weight: bold;">
                        ${this.calculateTimeConversion(timeValue, timeUnit)}
                    </span>
                </div>
            </div>
            <script>
                // Actualizar conversión en tiempo real
                document.getElementById('timeValue').addEventListener('input', updateConversion);
                document.getElementById('timeUnit').addEventListener('change', updateConversion);

                function updateConversion() {
                    const value = document.getElementById('timeValue').value;
                    const unit = document.getElementById('timeUnit').value;
                    const conversion = ActionProperties.calculateTimeConversion(value, unit);
                    document.getElementById('timeConversion').textContent = conversion;
                }
            </script>
        `;
    },

    // Calcular conversión de tiempo
    calculateTimeConversion(value, unit) {
        const conversions = {
            milliseconds: {
                ms: value,
                s: (value / 1000).toFixed(2),
                m: (value / 60000).toFixed(2),
                h: (value / 3600000).toFixed(4)
            },
            seconds: {
                ms: value * 1000,
                s: value,
                m: (value / 60).toFixed(2),
                h: (value / 3600).toFixed(4)
            },
            minutes: {
                ms: value * 60000,
                s: value * 60,
                m: value,
                h: (value / 60).toFixed(2)
            },
            hours: {
                ms: value * 3600000,
                s: value * 3600,
                m: value * 60,
                h: value
            }
        };

        const conv = conversions[unit];
        return `${conv.ms} ms = ${conv.s} seg = ${conv.m} min = ${conv.h} hrs`;
    },

    // Propiedades: Screenshot
    renderScreenshotProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-folder"></i> Ruta de guardado *</label>
                <input type="text" id="savePath" class="form-control" required
                       value="${action.savePath || ''}" placeholder="C:/screenshots/captura.png">
            </div>
            <div class="form-group">
                <label><i class="fas fa-crop"></i> Tipo de captura</label>
                <select id="screenshotType" class="form-control">
                    <option value="fullpage" ${action.screenshotType === 'fullpage' ? 'selected' : ''}>Página completa</option>
                    <option value="viewport" ${action.screenshotType === 'viewport' ? 'selected' : ''}>Solo viewport</option>
                    <option value="element" ${action.screenshotType === 'element' ? 'selected' : ''}>Elemento específico</option>
                </select>
            </div>
            <div class="form-group" id="elementSelectorGroup" style="display: ${action.screenshotType === 'element' ? 'block' : 'none'};">
                <label><i class="fas fa-bullseye"></i> Selector del elemento</label>
                <input type="text" id="elementSelector" class="form-control"
                       value="${action.elementSelector || ''}" placeholder="#elemento">
            </div>
            <div class="form-group">
                <label><i class="fas fa-image"></i> Formato</label>
                <select id="format" class="form-control">
                    <option value="png" ${action.format === 'png' || !action.format ? 'selected' : ''}>PNG</option>
                    <option value="jpeg" ${action.format === 'jpeg' ? 'selected' : ''}>JPEG</option>
                </select>
            </div>
        `;
    },

    // Propiedades: Extract
    renderExtractProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-bullseye"></i> Selector CSS *</label>
                <input type="text" id="selector" class="form-control" required
                       value="${action.selector || ''}" placeholder=".precio, h1, #descripcion">
            </div>
            <div class="form-group">
                <label><i class="fas fa-filter"></i> Atributo a extraer</label>
                <select id="attribute" class="form-control">
                    <option value="text" ${action.attribute === 'text' || !action.attribute ? 'selected' : ''}>Texto (textContent)</option>
                    <option value="innerHTML" ${action.attribute === 'innerHTML' ? 'selected' : ''}>HTML interno</option>
                    <option value="href" ${action.attribute === 'href' ? 'selected' : ''}>Atributo href</option>
                    <option value="src" ${action.attribute === 'src' ? 'selected' : ''}>Atributo src</option>
                    <option value="value" ${action.attribute === 'value' ? 'selected' : ''}>Atributo value</option>
                    <option value="custom" ${action.attribute === 'custom' ? 'selected' : ''}>Atributo personalizado</option>
                </select>
            </div>
            <div class="form-group" id="customAttributeGroup" style="display: ${action.attribute === 'custom' ? 'block' : 'none'};">
                <label><i class="fas fa-tag"></i> Nombre del atributo</label>
                <input type="text" id="customAttribute" class="form-control"
                       value="${action.customAttribute || ''}" placeholder="data-id, class, etc.">
            </div>
            <div class="form-group">
                <label><i class="fas fa-save"></i> Guardar en variable *</label>
                <input type="text" id="saveName" class="form-control" required
                       value="${action.saveName || ''}" placeholder="nombreVariable">
            </div>
        `;
    },

    // Propiedades: DB Connect
    renderDbConnectProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-database"></i> Nombre de la conexión *</label>
                <input type="text" id="connectionName" class="form-control" required
                       value="${action.connectionName || ''}" placeholder="MiBaseDatos">
            </div>
            <div class="form-group">
                <label><i class="fas fa-server"></i> Tipo de base de datos</label>
                <select id="dbType" class="form-control">
                    <option value="mysql" ${action.dbType === 'mysql' ? 'selected' : ''}>MySQL</option>
                    <option value="postgresql" ${action.dbType === 'postgresql' ? 'selected' : ''}>PostgreSQL</option>
                    <option value="sqlserver" ${action.dbType === 'sqlserver' ? 'selected' : ''}>SQL Server</option>
                    <option value="oracle" ${action.dbType === 'oracle' ? 'selected' : ''}>Oracle</option>
                    <option value="mongodb" ${action.dbType === 'mongodb' ? 'selected' : ''}>MongoDB</option>
                </select>
            </div>
            <div class="form-group">
                <label><i class="fas fa-network-wired"></i> Host *</label>
                <input type="text" id="host" class="form-control" required
                       value="${action.host || ''}" placeholder="localhost">
            </div>
            <div class="form-group">
                <label><i class="fas fa-plug"></i> Puerto</label>
                <input type="number" id="port" class="form-control"
                       value="${action.port || 3306}" min="1" max="65535">
            </div>
            <div class="form-group">
                <label><i class="fas fa-database"></i> Nombre de la base *</label>
                <input type="text" id="database" class="form-control" required
                       value="${action.database || ''}" placeholder="nombre_db">
            </div>
            <div class="form-group">
                <label><i class="fas fa-user"></i> Usuario *</label>
                <input type="text" id="username" class="form-control" required
                       value="${action.username || ''}" placeholder="usuario">
            </div>
            <div class="form-group">
                <label><i class="fas fa-key"></i> Contraseña *</label>
                <input type="password" id="password" class="form-control" required
                       value="${action.password || ''}" placeholder="••••••••">
            </div>
        `;
    },

    // Propiedades: DB Query
    renderDbQueryProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-link"></i> Conexión a usar *</label>
                <select id="connectionName" class="form-control" required>
                    <option value="">Seleccionar conexión...</option>
                    ${this.getDbConnections(action.connectionName)}
                </select>
            </div>
            <div class="form-group">
                <label><i class="fas fa-code"></i> Consulta SQL *</label>
                <textarea id="query" class="form-control" rows="6" required
                          placeholder="SELECT * FROM tabla WHERE...">${action.query || ''}</textarea>
            </div>
            <div class="form-group">
                <label><i class="fas fa-save"></i> Guardar resultado en *</label>
                <input type="text" id="saveName" class="form-control" required
                       value="${action.saveName || ''}" placeholder="resultadoConsulta">
            </div>
        `;
    },

    // Propiedades: Email Send
    renderEmailSendProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-envelope"></i> Para (destinatarios) *</label>
                <input type="text" id="to" class="form-control" required
                       value="${action.to || ''}" placeholder="destinatario@ejemplo.com, otro@ejemplo.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-copy"></i> CC</label>
                <input type="text" id="cc" class="form-control"
                       value="${action.cc || ''}" placeholder="copia@ejemplo.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-user-secret"></i> CCO</label>
                <input type="text" id="bcc" class="form-control"
                       value="${action.bcc || ''}" placeholder="copia-oculta@ejemplo.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-heading"></i> Asunto *</label>
                <input type="text" id="subject" class="form-control" required
                       value="${action.subject || ''}" placeholder="Asunto del correo">
            </div>
            <div class="form-group">
                <label><i class="fas fa-align-left"></i> Cuerpo del mensaje *</label>
                <textarea id="body" class="form-control" rows="8" required
                          placeholder="Contenido del correo...">${action.body || ''}</textarea>
            </div>
            <div class="form-group">
                <label><i class="fas fa-paperclip"></i> Archivos adjuntos</label>
                <input type="text" id="attachments" class="form-control"
                       value="${action.attachments || ''}" placeholder="C:/archivo1.pdf, C:/archivo2.xlsx">
                <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                    Separar múltiples archivos con comas
                </small>
            </div>
        `;
    },

    // Propiedades: Email Connect
    renderEmailConnectProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-server"></i> Servidor IMAP *</label>
                <input type="text" id="imapServer" class="form-control" required
                       value="${action.imapServer || ''}" placeholder="imap.gmail.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-plug"></i> Puerto IMAP</label>
                <input type="number" id="imapPort" class="form-control"
                       value="${action.imapPort || 993}" min="1" max="65535">
            </div>
            <div class="form-group">
                <label><i class="fas fa-envelope"></i> Email *</label>
                <input type="email" id="email" class="form-control" required
                       value="${action.email || ''}" placeholder="usuario@ejemplo.com">
            </div>
            <div class="form-group">
                <label><i class="fas fa-key"></i> Contraseña *</label>
                <input type="password" id="password" class="form-control" required
                       value="${action.password || ''}" placeholder="••••••••">
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="useSSL" ${action.useSSL !== false ? 'checked' : ''}>
                    <span>Usar SSL/TLS</span>
                </label>
            </div>
        `;
    },

    // Propiedades: Set Variable
    renderSetVariableProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-tag"></i> Nombre de la variable *</label>
                <input type="text" id="varName" class="form-control" required
                       value="${action.varName || ''}" placeholder="miVariable">
            </div>
            <div class="form-group">
                <label><i class="fas fa-equals"></i> Valor *</label>
                <textarea id="value" class="form-control" rows="4" required
                          placeholder="Valor a asignar...">${action.value || ''}</textarea>
            </div>
            <div class="form-group">
                <label><i class="fas fa-code"></i> Tipo de dato</label>
                <select id="dataType" class="form-control">
                    <option value="string" ${action.dataType === 'string' || !action.dataType ? 'selected' : ''}>Texto (String)</option>
                    <option value="number" ${action.dataType === 'number' ? 'selected' : ''}>Número</option>
                    <option value="boolean" ${action.dataType === 'boolean' ? 'selected' : ''}>Booleano</option>
                    <option value="json" ${action.dataType === 'json' ? 'selected' : ''}>JSON</option>
                </select>
            </div>
        `;
    },

    // Propiedades: Get Variable
    renderGetVariableProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-tag"></i> Nombre de la variable *</label>
                <input type="text" id="varName" class="form-control" required
                       value="${action.varName || ''}" placeholder="miVariable">
            </div>
            <div class="form-group">
                <label><i class="fas fa-save"></i> Guardar en *</label>
                <input type="text" id="saveName" class="form-control" required
                       value="${action.saveName || ''}" placeholder="nombreDestino">
            </div>
        `;
    },

    // Propiedades: IF Condition
    renderIfConditionProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-code"></i> Condición *</label>
                <input type="text" id="condition" class="form-control" required
                       value="${action.condition || ''}" placeholder="variable > 10">
            </div>
            <div class="form-group">
                <label><i class="fas fa-info-circle"></i> Descripción</label>
                <input type="text" id="description" class="form-control"
                       value="${action.description || ''}" placeholder="¿Qué evalúa esta condición?">
            </div>
            <div style="background: #1e293b; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <div style="color: #94a3b8; font-size: 0.9rem;">
                    <strong>Ejemplos de condiciones:</strong><br>
                    • precio > 100<br>
                    • nombre === "Juan"<br>
                    • edad >= 18 && activo === true
                </div>
            </div>
        `;
    },

    // Propiedades: FOR Loop
    renderForLoopProperties(action) {
        return `
            <div class="form-group">
                <label><i class="fas fa-redo"></i> Tipo de bucle</label>
                <select id="loopType" class="form-control">
                    <option value="count" ${action.loopType === 'count' || !action.loopType ? 'selected' : ''}>Número de iteraciones</option>
                    <option value="array" ${action.loopType === 'array' ? 'selected' : ''}>Iterar array/lista</option>
                    <option value="range" ${action.loopType === 'range' ? 'selected' : ''}>Rango de números</option>
                </select>
            </div>
            <div class="form-group" id="countGroup" style="display: ${action.loopType !== 'array' && action.loopType !== 'range' ? 'block' : 'none'};">
                <label><i class="fas fa-hashtag"></i> Número de iteraciones *</label>
                <input type="number" id="iterations" class="form-control"
                       value="${action.iterations || 10}" min="1">
            </div>
            <div class="form-group" id="arrayGroup" style="display: ${action.loopType === 'array' ? 'block' : 'none'};">
                <label><i class="fas fa-list"></i> Variable con el array *</label>
                <input type="text" id="arrayVar" class="form-control"
                       value="${action.arrayVar || ''}" placeholder="miArray">
            </div>
            <div class="form-group">
                <label><i class="fas fa-tag"></i> Variable del índice</label>
                <input type="text" id="indexVar" class="form-control"
                       value="${action.indexVar || 'i'}" placeholder="i">
            </div>
        `;
    },

    // Obtener conexiones de base de datos disponibles
    getDbConnections(selected = '') {
        // Aquí deberías obtener las conexiones desde localStorage o estado global
        const connections = ['MiDB', 'ProduccionDB', 'TestDB']; // Ejemplo
        return connections.map(conn =>
            `<option value="${conn}" ${conn === selected ? 'selected' : ''}>${conn}</option>`
        ).join('');
    },

    // Recolectar propiedades del formulario
    collectProperties(modal, action) {
        const updatedAction = { ...action };

        // Campos comunes
        const fields = modal.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                updatedAction[field.id] = field.checked;
            } else if (field.type === 'number') {
                updatedAction[field.id] = parseFloat(field.value) || 0;
            } else {
                updatedAction[field.id] = field.value;
            }
        });

        // Para acción Wait, convertir a milisegundos para compatibilidad
        if (action.type === 'wait' && updatedAction.timeValue && updatedAction.timeUnit) {
            const conversions = {
                milliseconds: 1,
                seconds: 1000,
                minutes: 60000,
                hours: 3600000
            };

            const timeValue = parseFloat(updatedAction.timeValue) || 1;
            const multiplier = conversions[updatedAction.timeUnit] || 1000;

            // Guardar en milisegundos para compatibilidad con el sistema existente
            updatedAction.duration = timeValue * multiplier;

            // Mantener valores originales para mostrar en la interfaz
            updatedAction.timeValue = timeValue;
            updatedAction.timeUnit = updatedAction.timeUnit || 'seconds';
        }

        return updatedAction;
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ActionProperties.init());
} else {
    ActionProperties.init();
}
