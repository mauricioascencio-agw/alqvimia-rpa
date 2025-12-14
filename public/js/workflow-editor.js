// Workflow Editor Module
const WorkflowEditor = {
    currentWorkflow: [],
    draggedAction: null,

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupPaletteToggle();
    },

    setupPaletteToggle() {
        const toggleBtn = document.getElementById('paletteToggle');
        const palette = document.getElementById('actionsPalette');
        const builder = document.getElementById('workflowBuilder');

        if (toggleBtn && palette && builder) {
            toggleBtn.addEventListener('click', () => {
                palette.classList.toggle('collapsed');
                builder.classList.toggle('palette-expanded');

                // Cambiar icono
                const icon = toggleBtn.querySelector('i');
                if (palette.classList.contains('collapsed')) {
                    icon.className = 'fas fa-bars';
                } else {
                    icon.className = 'fas fa-times';
                }
            });
        }
    },

    setupEventListeners() {
        document.getElementById('newWorkflow').addEventListener('click', () => {
            this.newWorkflow();
        });

        document.getElementById('saveWorkflow').addEventListener('click', () => {
            this.saveWorkflow();
        });

        document.getElementById('importWorkflow').addEventListener('click', () => {
            this.importWorkflow();
        });

        document.getElementById('exportWorkflow').addEventListener('click', () => {
            this.exportWorkflow();
        });
    },

    setupDragAndDrop() {
        const paletteItems = document.querySelectorAll('.palette-item');
        const canvas = document.getElementById('workflowCanvas');

        paletteItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedAction = item.getAttribute('data-action');
                e.dataTransfer.effectAllowed = 'copy';
            });

            item.addEventListener('dragend', () => {
                this.draggedAction = null;
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            canvas.style.borderColor = '#2563eb';
        });

        canvas.addEventListener('dragleave', () => {
            canvas.style.borderColor = '#334155';
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.style.borderColor = '#334155';

            if (this.draggedAction) {
                this.addActionToCanvas(this.draggedAction);
            }
        });
    },

    addActionToCanvas(actionType) {
        // Mostrar modal de configuración
        this.showActionConfigModal(actionType, (actionConfig) => {
            this.currentWorkflow.push(actionConfig);
            this.renderWorkflow();
            showNotification(`Acción "${actionType}" agregada`, 'success');
        });
    },

    showActionConfigModal(actionType, callback) {
        const modal = document.getElementById('actionModal');
        const modalBody = document.getElementById('modalBody');
        const modalTitle = document.getElementById('modalTitle');

        modalTitle.textContent = `Configurar: ${actionType.toUpperCase()}`;

        let formHTML = '';

        switch (actionType) {
            case 'navigate':
                formHTML = `
                    <div class="form-group">
                        <label>URL:</label>
                        <input type="url" id="configUrl" class="form-control" placeholder="https://ejemplo.com" required>
                    </div>
                `;
                break;

            case 'click':
                formHTML = `
                    <div class="form-group">
                        <label>Selector CSS:</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="configSelector" class="form-control" placeholder="#button-id" required>
                            <button type="button" class="btn btn-primary" onclick="WorkflowEditor.captureElement('configSelector')" style="white-space: nowrap;">
                                <i class="fas fa-crosshairs"></i> Capturar
                            </button>
                        </div>
                        <small style="color: #94a3b8;">O haz click en "Capturar" para seleccionar un elemento en la página</small>
                    </div>
                    <div class="form-group">
                        <label>Delay (ms):</label>
                        <input type="number" id="configDelay" class="form-control" value="500">
                    </div>
                `;
                break;

            case 'type':
                formHTML = `
                    <div class="form-group">
                        <label>Selector CSS:</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="configSelector" class="form-control" placeholder="#input-id" required>
                            <button type="button" class="btn btn-primary" onclick="WorkflowEditor.captureElement('configSelector')" style="white-space: nowrap;">
                                <i class="fas fa-crosshairs"></i> Capturar
                            </button>
                        </div>
                        <small style="color: #94a3b8;">O haz click en "Capturar" para seleccionar un elemento en la página</small>
                    </div>
                    <div class="form-group">
                        <label>Texto a escribir:</label>
                        <input type="text" id="configText" class="form-control" placeholder="Texto..." required>
                    </div>
                    <div class="form-group">
                        <label>Delay (ms):</label>
                        <input type="number" id="configDelay" class="form-control" value="500">
                    </div>
                `;
                break;

            case 'wait':
                formHTML = `
                    <div class="form-group">
                        <label>Duración (ms):</label>
                        <input type="number" id="configDuration" class="form-control" value="1000" required>
                    </div>
                `;
                break;

            case 'screenshot':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo:</label>
                        <input type="text" id="configPath" class="form-control" placeholder="screenshot.png">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="configFullPage"> Página completa
                        </label>
                    </div>
                `;
                break;

            case 'extract':
                formHTML = `
                    <div class="form-group">
                        <label>Selector CSS:</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="configSelector" class="form-control" placeholder=".data-item" required>
                            <button type="button" class="btn btn-primary" onclick="WorkflowEditor.captureElement('configSelector')" style="white-space: nowrap;">
                                <i class="fas fa-crosshairs"></i> Capturar
                            </button>
                        </div>
                        <small style="color: #94a3b8;">O haz click en "Capturar" para seleccionar un elemento en la página</small>
                    </div>
                    <div class="form-group">
                        <label>Guardar en variable:</label>
                        <input type="text" id="configSaveVar" class="form-control" placeholder="datos_extraidos">
                    </div>
                `;
                break;

            case 'scroll':
                formHTML = `
                    <div class="form-group">
                        <label>Desplazamiento X:</label>
                        <input type="number" id="configScrollX" class="form-control" value="0">
                    </div>
                    <div class="form-group">
                        <label>Desplazamiento Y:</label>
                        <input type="number" id="configScrollY" class="form-control" value="500">
                    </div>
                `;
                break;

            case 'hover':
                formHTML = `
                    <div class="form-group">
                        <label>Selector CSS:</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="configSelector" class="form-control" placeholder=".menu-item" required>
                            <button type="button" class="btn btn-primary" onclick="WorkflowEditor.captureElement('configSelector')" style="white-space: nowrap;">
                                <i class="fas fa-crosshairs"></i> Capturar
                            </button>
                        </div>
                        <small style="color: #94a3b8;">O haz click en "Capturar" para seleccionar un elemento en la página</small>
                    </div>
                `;
                break;

            // 🗄️ BASE DE DATOS
            case 'db_connect':
                formHTML = `
                    <div class="form-group">
                        <label>Tipo de Base de Datos:</label>
                        <select id="configDbType" class="form-control" required onchange="WorkflowEditor.updateDbConnectionFields(this.value)">
                            <option value="">Selecciona...</option>
                            <option value="mysql">MySQL</option>
                            <option value="postgres">PostgreSQL</option>
                            <option value="sqlserver">SQL Server</option>
                            <option value="oracle">Oracle</option>
                            <option value="mongodb">MongoDB</option>
                            <option value="sqlite">SQLite</option>
                        </select>
                    </div>
                    <div id="connectionFields"></div>
                    <div class="form-group">
                        <label>Nombre de Conexión (para reutilizar):</label>
                        <input type="text" id="configConnectionName" class="form-control" placeholder="miConexion" required>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" onclick="WorkflowEditor.testConnection()">
                            <i class="fas fa-plug"></i> Probar Conexión
                        </button>
                        <span id="connectionStatus" style="margin-left: 10px;"></span>
                    </div>
                `;
                break;

            case 'db_query':
                formHTML = `
                    <div class="form-group">
                        <label>Conexión a usar:</label>
                        <select id="configConnection" class="form-control" required>
                            <option value="">Selecciona una conexión...</option>
                            ${this.getAvailableConnections()}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Consulta SQL:</label>
                        <textarea id="configQuery" class="form-control" rows="5" placeholder="SELECT * FROM tabla WHERE id = ?" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Parámetros (separados por coma):</label>
                        <input type="text" id="configParams" class="form-control" placeholder="param1, param2, param3">
                    </div>
                    <div class="form-group">
                        <label>Guardar resultado en:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="dataframe">DataFrame Temporal</option>
                            <option value="json">Archivo JSON</option>
                            <option value="variable">Variable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="df_resultados" required>
                    </div>
                `;
                break;

            case 'db_insert':
                formHTML = `
                    <div class="form-group">
                        <label>Conexión a usar:</label>
                        <select id="configConnection" class="form-control" required>
                            <option value="">Selecciona una conexión...</option>
                            ${this.getAvailableConnections()}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tabla:</label>
                        <input type="text" id="configTable" class="form-control" placeholder="nombre_tabla" required>
                    </div>
                    <div class="form-group">
                        <label>Datos a insertar (JSON o desde DataFrame):</label>
                        <textarea id="configData" class="form-control" rows="4" placeholder='{"columna1": "valor1", "columna2": "valor2"}' required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Origen de datos:</label>
                        <select id="configDataSource" class="form-control">
                            <option value="manual">Manual (JSON)</option>
                            <option value="dataframe">Desde DataFrame</option>
                            <option value="variable">Desde Variable</option>
                        </select>
                    </div>
                `;
                break;

            // 📊 EXCEL
            case 'excel_read':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo Excel:</label>
                        <input type="text" id="configFilePath" class="form-control" placeholder="C:\\datos\\archivo.xlsx" required>
                    </div>
                    <div class="form-group">
                        <label>Hoja de Excel:</label>
                        <input type="text" id="configSheetName" class="form-control" placeholder="Hoja1" value="Hoja1">
                    </div>
                    <div class="form-group">
                        <label>Rango (opcional, ej: A1:D10):</label>
                        <input type="text" id="configRange" class="form-control" placeholder="A1:D10">
                    </div>
                    <div class="form-group">
                        <label>Guardar como:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="dataframe">DataFrame Temporal</option>
                            <option value="json">Archivo JSON</option>
                            <option value="variable">Variable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="df_excel" required>
                    </div>
                `;
                break;

            case 'excel_write':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo Excel:</label>
                        <input type="text" id="configFilePath" class="form-control" placeholder="C:\\datos\\salida.xlsx" required>
                    </div>
                    <div class="form-group">
                        <label>Hoja de Excel:</label>
                        <input type="text" id="configSheetName" class="form-control" placeholder="Hoja1" value="Hoja1">
                    </div>
                    <div class="form-group">
                        <label>Origen de datos:</label>
                        <select id="configDataSource" class="form-control" required>
                            <option value="dataframe">Desde DataFrame</option>
                            <option value="variable">Desde Variable</option>
                            <option value="manual">Manual (JSON)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del origen:</label>
                        <input type="text" id="configSourceName" class="form-control" placeholder="df_datos" required>
                    </div>
                    <div class="form-group">
                        <label>Celda inicial (opcional):</label>
                        <input type="text" id="configStartCell" class="form-control" placeholder="A1" value="A1">
                    </div>
                `;
                break;

            // 📄 PDF
            case 'pdf_read':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo PDF:</label>
                        <input type="text" id="configFilePath" class="form-control" placeholder="C:\\documentos\\archivo.pdf" required>
                    </div>
                    <div class="form-group">
                        <label>Páginas a extraer (opcional, ej: 1-5):</label>
                        <input type="text" id="configPages" class="form-control" placeholder="1-5 o dejar vacío para todas">
                    </div>
                    <div class="form-group">
                        <label>Guardar texto en:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="variable">Variable</option>
                            <option value="file">Archivo TXT</option>
                            <option value="json">Archivo JSON</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="texto_pdf" required>
                    </div>
                `;
                break;

            case 'pdf_create':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta de salida del PDF:</label>
                        <input type="text" id="configOutputPath" class="form-control" placeholder="C:\\documentos\\nuevo.pdf" required>
                    </div>
                    <div class="form-group">
                        <label>Origen del contenido:</label>
                        <select id="configContentSource" class="form-control" required>
                            <option value="html">HTML</option>
                            <option value="text">Texto plano</option>
                            <option value="variable">Desde Variable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Contenido:</label>
                        <textarea id="configContent" class="form-control" rows="6" placeholder="Escribe o pega el contenido aquí" required></textarea>
                    </div>
                `;
                break;

            // 👁️ OCR
            case 'ocr_image':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta de la imagen:</label>
                        <input type="text" id="configImagePath" class="form-control" placeholder="C:\\imagenes\\captura.png" required>
                    </div>
                    <div class="form-group">
                        <label>Idioma del OCR:</label>
                        <select id="configLanguage" class="form-control">
                            <option value="spa">Español</option>
                            <option value="eng">Inglés</option>
                            <option value="spa+eng">Español + Inglés</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Guardar texto en:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="variable">Variable</option>
                            <option value="file">Archivo TXT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="texto_ocr" required>
                    </div>
                `;
                break;

            case 'ocr_pdf':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del PDF:</label>
                        <input type="text" id="configPdfPath" class="form-control" placeholder="C:\\documentos\\escaneado.pdf" required>
                    </div>
                    <div class="form-group">
                        <label>Páginas (opcional, ej: 1-5):</label>
                        <input type="text" id="configPages" class="form-control" placeholder="Todas">
                    </div>
                    <div class="form-group">
                        <label>Idioma del OCR:</label>
                        <select id="configLanguage" class="form-control">
                            <option value="spa">Español</option>
                            <option value="eng">Inglés</option>
                            <option value="spa+eng">Español + Inglés</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Guardar texto en:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="variable">Variable</option>
                            <option value="dataframe">DataFrame (una fila por página)</option>
                            <option value="file">Archivo TXT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="texto_pdf_ocr" required>
                    </div>
                `;
                break;

            // 🔀 CONTROL DE FLUJO
            case 'if_condition':
                formHTML = `
                    <div class="form-group">
                        <label>Condición (JavaScript):</label>
                        <textarea id="configCondition" class="form-control" rows="3" placeholder="variable1 > 10" required></textarea>
                        <small style="color: #94a3b8;">Ejemplos: variable1 > 10, texto.includes('error'), !isEmpty(data)</small>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="configHasElse"> Agregar ELSE
                        </label>
                    </div>
                    <small style="color: #fbbf24;">Las acciones THEN y ELSE se agregarán después en el flujo</small>
                `;
                break;

            case 'for_loop':
                formHTML = `
                    <div class="form-group">
                        <label>Variable de iteración:</label>
                        <input type="text" id="configVariable" class="form-control" placeholder="i" value="i" required>
                    </div>
                    <div class="form-group">
                        <label>Desde:</label>
                        <input type="number" id="configFrom" class="form-control" value="0" required>
                    </div>
                    <div class="form-group">
                        <label>Hasta:</label>
                        <input type="number" id="configTo" class="form-control" value="10" required>
                    </div>
                    <div class="form-group">
                        <label>Incremento:</label>
                        <input type="number" id="configStep" class="form-control" value="1" required>
                    </div>
                    <small style="color: #fbbf24;">Las acciones del bucle se agregarán después en el flujo</small>
                `;
                break;

            case 'while_loop':
                formHTML = `
                    <div class="form-group">
                        <label>Condición (mientras sea verdadera):</label>
                        <textarea id="configCondition" class="form-control" rows="3" placeholder="contador < 100" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Máximo de iteraciones (seguridad):</label>
                        <input type="number" id="configMaxIterations" class="form-control" value="1000" required>
                    </div>
                    <small style="color: #fbbf24;">Las acciones del bucle se agregarán después en el flujo</small>
                `;
                break;

            // 📦 VARIABLES
            case 'set_variable':
                formHTML = `
                    <div class="form-group">
                        <label>Nombre de la variable:</label>
                        <input type="text" id="configVarName" class="form-control" placeholder="miVariable" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de valor:</label>
                        <select id="configValueType" class="form-control" onchange="WorkflowEditor.updateValueInput(this.value)">
                            <option value="string">Texto</option>
                            <option value="number">Número</option>
                            <option value="boolean">Booleano</option>
                            <option value="object">Objeto/JSON</option>
                            <option value="expression">Expresión JavaScript</option>
                        </select>
                    </div>
                    <div class="form-group" id="valueInputContainer">
                        <label>Valor:</label>
                        <input type="text" id="configValue" class="form-control" placeholder="Ingresa el valor" required>
                    </div>
                `;
                break;

            case 'get_variable':
                formHTML = `
                    <div class="form-group">
                        <label>Nombre de la variable:</label>
                        <input type="text" id="configVarName" class="form-control" placeholder="miVariable" required>
                    </div>
                    <div class="form-group">
                        <label>Guardar en (opcional):</label>
                        <input type="text" id="configSaveTo" class="form-control" placeholder="otraVariable">
                        <small style="color: #94a3b8;">Si no especificas, se usará en el siguiente paso</small>
                    </div>
                `;
                break;

            // 💻 SCRIPTS
            case 'run_javascript':
                formHTML = `
                    <div class="form-group">
                        <label>Código JavaScript:</label>
                        <textarea id="configCode" class="form-control" rows="10" placeholder="// Tu código aquí\nconst resultado = 10 + 20;\nreturn resultado;" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Guardar resultado en variable:</label>
                        <input type="text" id="configSaveVar" class="form-control" placeholder="resultado">
                    </div>
                `;
                break;

            case 'run_python':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del script Python:</label>
                        <input type="text" id="configScriptPath" class="form-control" placeholder="C:\\scripts\\mi_script.py" required>
                    </div>
                    <div class="form-group">
                        <label>Argumentos (separados por coma):</label>
                        <input type="text" id="configArgs" class="form-control" placeholder="arg1, arg2, arg3">
                    </div>
                    <div class="form-group">
                        <label>Guardar salida en variable:</label>
                        <input type="text" id="configSaveVar" class="form-control" placeholder="salida_python">
                    </div>
                `;
                break;

            case 'run_powershell':
                formHTML = `
                    <div class="form-group">
                        <label>Comando PowerShell:</label>
                        <textarea id="configCommand" class="form-control" rows="5" placeholder="Get-Process | Where-Object {$_.CPU -gt 100}" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Argumentos adicionales:</label>
                        <input type="text" id="configArgs" class="form-control" placeholder="-ExecutionPolicy Bypass">
                    </div>
                    <div class="form-group">
                        <label>Guardar salida en variable:</label>
                        <input type="text" id="configSaveVar" class="form-control" placeholder="salida_ps">
                    </div>
                `;
                break;

            // 📧 EMAIL
            case 'send_email':
                formHTML = `
                    <div class="form-group">
                        <label>Para (email):</label>
                        <input type="email" id="configTo" class="form-control" placeholder="destino@ejemplo.com" required>
                    </div>
                    <div class="form-group">
                        <label>Asunto:</label>
                        <input type="text" id="configSubject" class="form-control" placeholder="Asunto del email" required>
                    </div>
                    <div class="form-group">
                        <label>Cuerpo del mensaje:</label>
                        <textarea id="configBody" class="form-control" rows="6" placeholder="Mensaje..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Adjuntos (rutas separadas por coma):</label>
                        <input type="text" id="configAttachments" class="form-control" placeholder="C:\\archivo1.pdf, C:\\archivo2.xlsx">
                    </div>
                `;
                break;

            case 'read_email':
                formHTML = `
                    <div class="form-group">
                        <label>Carpeta de email:</label>
                        <select id="configFolder" class="form-control">
                            <option value="INBOX">Bandeja de entrada</option>
                            <option value="SENT">Enviados</option>
                            <option value="SPAM">Spam</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Filtro (opcional):</label>
                        <input type="text" id="configFilter" class="form-control" placeholder="FROM:remitente@ejemplo.com">
                    </div>
                    <div class="form-group">
                        <label>Número de emails a leer:</label>
                        <input type="number" id="configLimit" class="form-control" value="10">
                    </div>
                    <div class="form-group">
                        <label>Guardar en:</label>
                        <select id="configSaveType" class="form-control" required>
                            <option value="dataframe">DataFrame</option>
                            <option value="json">Archivo JSON</option>
                            <option value="variable">Variable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del destino:</label>
                        <input type="text" id="configSaveName" class="form-control" placeholder="emails" required>
                    </div>
                `;
                break;

            // 📁 ARCHIVOS
            case 'read_file':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo:</label>
                        <input type="text" id="configFilePath" class="form-control" placeholder="C:\\datos\\archivo.txt" required>
                    </div>
                    <div class="form-group">
                        <label>Codificación:</label>
                        <select id="configEncoding" class="form-control">
                            <option value="utf8">UTF-8</option>
                            <option value="latin1">Latin1</option>
                            <option value="ascii">ASCII</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Guardar en variable:</label>
                        <input type="text" id="configSaveVar" class="form-control" placeholder="contenido" required>
                    </div>
                `;
                break;

            case 'write_file':
                formHTML = `
                    <div class="form-group">
                        <label>Ruta del archivo:</label>
                        <input type="text" id="configFilePath" class="form-control" placeholder="C:\\datos\\salida.txt" required>
                    </div>
                    <div class="form-group">
                        <label>Contenido (o variable):</label>
                        <textarea id="configContent" class="form-control" rows="5" placeholder="Texto a escribir" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Modo de escritura:</label>
                        <select id="configWriteMode" class="form-control">
                            <option value="overwrite">Sobrescribir</option>
                            <option value="append">Agregar al final</option>
                        </select>
                    </div>
                `;
                break;

            case 'copy_file':
                formHTML = `
                    <div class="form-group">
                        <label>Archivo origen:</label>
                        <input type="text" id="configSource" class="form-control" placeholder="C:\\origen\\archivo.txt" required>
                    </div>
                    <div class="form-group">
                        <label>Destino:</label>
                        <input type="text" id="configDestination" class="form-control" placeholder="C:\\destino\\archivo.txt" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="configOverwrite"> Sobrescribir si existe
                        </label>
                    </div>
                `;
                break;

            case 'move_file':
                formHTML = `
                    <div class="form-group">
                        <label>Archivo origen:</label>
                        <input type="text" id="configSource" class="form-control" placeholder="C:\\origen\\archivo.txt" required>
                    </div>
                    <div class="form-group">
                        <label>Destino:</label>
                        <input type="text" id="configDestination" class="form-control" placeholder="C:\\destino\\archivo.txt" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="configOverwrite"> Sobrescribir si existe
                        </label>
                    </div>
                `;
                break;

            // DEFAULT: Use MCPProperties for generated/custom components
            default:
                let componentDef = null;

                // First, check if component is registered in MCPProperties
                if (typeof MCPProperties !== 'undefined' && MCPProperties[actionType]) {
                    componentDef = MCPProperties[actionType];
                } else {
                    // Check in generated components (from localStorage or injected)
                    const generatedComponents = this.getGeneratedComponents();
                    const foundComponent = generatedComponents.find(c => c.id === actionType);
                    if (foundComponent) {
                        componentDef = {
                            title: foundComponent.title,
                            properties: foundComponent.properties || []
                        };
                    }
                }

                if (componentDef) {
                    modalTitle.textContent = `Configurar: ${componentDef.title || actionType.toUpperCase()}`;
                    // Generate form from properties definition
                    formHTML = this.generateDynamicForm(componentDef.properties);
                } else {
                    // Fallback for truly unknown components
                    formHTML = `
                        <div class="alert" style="background: #fbbf24; color: #000; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                            Componente desconocido: <strong>${actionType}</strong>
                        </div>
                        <div class="form-group">
                            <label>Configuración (JSON):</label>
                            <textarea id="configRaw" class="form-control" rows="8" placeholder='{"propiedad": "valor"}' required></textarea>
                            <small style="color: #94a3b8;">Ingresa la configuración en formato JSON</small>
                        </div>
                    `;
                }
                break;
        }

        modalBody.innerHTML = formHTML;
        modal.classList.add('active');

        document.getElementById('confirmAction').onclick = () => {
            const config = this.getActionConfig(actionType);
            if (config) {
                callback(config);
                modal.classList.remove('active');
            }
        };

        document.getElementById('cancelAction').onclick = () => {
            modal.classList.remove('active');
        };

        document.getElementById('closeModal').onclick = () => {
            modal.classList.remove('active');
        };
    },

    // Generate dynamic form from properties definition (for MCPProperties components)
    generateDynamicForm(properties) {
        if (!properties || properties.length === 0) {
            return '<p style="color: #94a3b8;">Este componente no tiene propiedades configurables.</p>';
        }

        let formHTML = '';

        properties.forEach((prop, index) => {
            const fieldId = `configProp_${index}`;
            const required = prop.required ? 'required' : '';
            const placeholder = prop.placeholder || '';
            const defaultValue = prop.default || '';

            formHTML += '<div class="form-group">';
            formHTML += `<label>${prop.label}:`;
            if (prop.required) {
                formHTML += ' <span style="color: #ef4444;">*</span>';
            }
            formHTML += '</label>';

            switch (prop.type) {
                case 'text':
                case 'text_or_variable':
                    formHTML += `<input type="text" id="${fieldId}" data-prop-name="${prop.name}" class="form-control" placeholder="${placeholder}" value="${defaultValue}" ${required}>`;
                    break;

                case 'textarea':
                    formHTML += `<textarea id="${fieldId}" data-prop-name="${prop.name}" class="form-control" rows="4" placeholder="${placeholder}" ${required}>${defaultValue}</textarea>`;
                    break;

                case 'number':
                    formHTML += `<input type="number" id="${fieldId}" data-prop-name="${prop.name}" class="form-control" placeholder="${placeholder}" value="${defaultValue}" ${required}>`;
                    break;

                case 'password':
                    formHTML += `<input type="password" id="${fieldId}" data-prop-name="${prop.name}" class="form-control" placeholder="${placeholder}" ${required}>`;
                    break;

                case 'checkbox':
                    const checked = defaultValue ? 'checked' : '';
                    formHTML += `<label style="display: flex; align-items: center; gap: 0.5rem;"><input type="checkbox" id="${fieldId}" data-prop-name="${prop.name}" ${checked}> ${prop.label}</label>`;
                    break;

                case 'select':
                    formHTML += `<select id="${fieldId}" data-prop-name="${prop.name}" class="form-control" ${required}>`;
                    formHTML += '<option value="">Selecciona...</option>';
                    if (Array.isArray(prop.options)) {
                        prop.options.forEach(opt => {
                            // Soportar tanto strings simples como objetos {value, label}
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const selected = defaultValue === optValue ? 'selected' : '';
                            formHTML += `<option value="${optValue}" ${selected}>${optLabel}</option>`;
                        });
                    }
                    formHTML += '</select>';
                    break;

                case 'datetime-local':
                    formHTML += `<input type="datetime-local" id="${fieldId}" data-prop-name="${prop.name}" class="form-control" ${required}>`;
                    break;

                default:
                    formHTML += `<input type="text" id="${fieldId}" data-prop-name="${prop.name}" class="form-control" placeholder="${placeholder}" ${required}>`;
            }

            if (prop.help) {
                formHTML += `<small style="color: #94a3b8;">${prop.help}</small>`;
            }

            formHTML += '</div>';
        });

        return formHTML;
    },

    getActionConfig(actionType) {
        const config = { type: actionType };

        // Check if this is a dynamic/generated component
        if (typeof MCPProperties !== 'undefined' && MCPProperties[actionType]) {
            // Collect values from dynamically generated form
            const inputs = document.querySelectorAll('[data-prop-name]');
            inputs.forEach(input => {
                const propName = input.getAttribute('data-prop-name');
                if (input.type === 'checkbox') {
                    config[propName] = input.checked;
                } else if (input.type === 'number') {
                    config[propName] = input.value ? parseFloat(input.value) : '';
                } else {
                    config[propName] = input.value;
                }
            });
            return config;
        }

        // Original hardcoded logic for native components
        switch (actionType) {
            case 'navigate':
                const url = document.getElementById('configUrl').value;
                if (!url) {
                    showNotification('URL requerida', 'error');
                    return null;
                }
                config.url = url;
                break;

            case 'click':
            case 'hover':
            case 'extract':
                const selector = document.getElementById('configSelector').value;
                if (!selector) {
                    showNotification('Selector requerido', 'error');
                    return null;
                }
                config.selector = selector;
                if (actionType === 'click') {
                    config.delay = parseInt(document.getElementById('configDelay').value) || 500;
                }
                break;

            case 'type':
                config.selector = document.getElementById('configSelector').value;
                config.text = document.getElementById('configText').value;
                config.delay = parseInt(document.getElementById('configDelay').value) || 500;
                if (!config.selector || !config.text) {
                    showNotification('Selector y texto requeridos', 'error');
                    return null;
                }
                break;

            case 'wait':
                config.duration = parseInt(document.getElementById('configDuration').value);
                if (!config.duration) {
                    showNotification('Duración requerida', 'error');
                    return null;
                }
                break;

            case 'screenshot':
                config.path = document.getElementById('configPath').value || `screenshot-${Date.now()}.png`;
                config.fullPage = document.getElementById('configFullPage').checked;
                break;

            case 'scroll':
                config.x = parseInt(document.getElementById('configScrollX').value) || 0;
                config.y = parseInt(document.getElementById('configScrollY').value) || 0;
                break;
        }

        return config;
    },

    // Helper: Update DB connection fields based on DB type
    updateDbConnectionFields(dbType) {
        const container = document.getElementById('connectionFields');
        if (!container) return;

        let fieldsHTML = '';

        if (dbType === 'sqlite') {
            fieldsHTML = `
                <div class="form-group">
                    <label>Ruta del archivo SQLite:</label>
                    <input type="text" id="configFilePath" class="form-control"
                           placeholder="C:\\datos\\database.db" required>
                </div>
            `;
        } else if (dbType === 'mongodb') {
            fieldsHTML = `
                <div class="form-group">
                    <label>URI de conexión:</label>
                    <input type="text" id="configUri" class="form-control"
                           placeholder="mongodb://localhost:27017" required>
                </div>
                <div class="form-group">
                    <label>Base de datos:</label>
                    <input type="text" id="configDatabase" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Usuario (opcional):</label>
                    <input type="text" id="configUser" class="form-control">
                </div>
                <div class="form-group">
                    <label>Contraseña (opcional):</label>
                    <input type="password" id="configPassword" class="form-control">
                </div>
            `;
        } else if (dbType) {
            // MySQL, PostgreSQL, SQL Server, Oracle
            fieldsHTML = `
                <div class="form-group">
                    <label>Host/URL:</label>
                    <input type="text" id="configHost" class="form-control"
                           placeholder="localhost" value="localhost" required>
                </div>
                <div class="form-group">
                    <label>Puerto:</label>
                    <input type="number" id="configPort" class="form-control"
                           value="${this.getDefaultPort(dbType)}" required>
                </div>
                <div class="form-group">
                    <label>Base de datos:</label>
                    <input type="text" id="configDatabase" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Usuario:</label>
                    <input type="text" id="configUser" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="configPassword" class="form-control" required>
                </div>
            `;
        }

        container.innerHTML = fieldsHTML;
    },

    // Helper: Get default port for DB type
    getDefaultPort(dbType) {
        const ports = {
            mysql: 3306,
            postgres: 5432,
            sqlserver: 1433,
            oracle: 1521
        };
        return ports[dbType] || '';
    },

    // Helper: Test database connection
    async testConnection() {
        const dbType = document.getElementById('configDbType')?.value;
        if (!dbType) {
            showNotification('Selecciona un tipo de base de datos', 'error');
            return;
        }

        // Create status element if doesn't exist
        let statusEl = document.getElementById('connectionStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'connectionStatus';
            statusEl.style.cssText = 'margin-top: 10px; padding: 10px; border-radius: 4px;';
            document.querySelector('.modal-body').appendChild(statusEl);
        }

        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Probando conexión...';
        statusEl.style.background = '#3b82f6';
        statusEl.style.color = 'white';

        try {
            // Gather connection details
            const connectionData = {
                type: dbType,
                host: document.getElementById('configHost')?.value,
                port: document.getElementById('configPort')?.value,
                database: document.getElementById('configDatabase')?.value,
                user: document.getElementById('configUser')?.value,
                password: document.getElementById('configPassword')?.value,
                filePath: document.getElementById('configFilePath')?.value,
                uri: document.getElementById('configUri')?.value
            };

            // Call server to test connection and validate engine
            const response = await fetch('http://localhost:3000/api/test-db-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connectionData)
            });

            const result = await response.json();

            if (result.success) {
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Conexión exitosa';
                statusEl.style.background = '#10b981';
            } else {
                statusEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${result.error}`;
                statusEl.style.background = '#ef4444';
            }
        } catch (error) {
            statusEl.innerHTML = `<i class="fas fa-times-circle"></i> Error: ${error.message}`;
            statusEl.style.background = '#ef4444';
        }
    },

    // Helper: Get available DB connections
    getAvailableConnections() {
        // Get from localStorage or server
        const connections = JSON.parse(localStorage.getItem('dbConnections') || '[]');

        if (connections.length === 0) {
            return '<option value="">No hay conexiones guardadas</option>';
        }

        return connections.map(conn =>
            `<option value="${conn.name}">${conn.name} (${conn.type})</option>`
        ).join('');
    },

    // Helper: Update value input based on type
    updateValueInput(valueType) {
        const container = document.getElementById('valueInputContainer');
        if (!container) return;

        let inputHTML = '';

        switch (valueType) {
            case 'string':
                inputHTML = `
                    <div class="form-group">
                        <label>Valor:</label>
                        <input type="text" id="configValue" class="form-control"
                               placeholder="Texto" required>
                    </div>
                `;
                break;

            case 'number':
                inputHTML = `
                    <div class="form-group">
                        <label>Valor:</label>
                        <input type="number" id="configValue" class="form-control"
                               placeholder="123" step="any" required>
                    </div>
                `;
                break;

            case 'boolean':
                inputHTML = `
                    <div class="form-group">
                        <label>Valor:</label>
                        <select id="configValue" class="form-control" required>
                            <option value="true">Verdadero (true)</option>
                            <option value="false">Falso (false)</option>
                        </select>
                    </div>
                `;
                break;

            case 'object':
                inputHTML = `
                    <div class="form-group">
                        <label>Valor (JSON):</label>
                        <textarea id="configValue" class="form-control" rows="4"
                                  placeholder='{"clave": "valor"}' required></textarea>
                        <small>Formato JSON válido</small>
                    </div>
                `;
                break;

            case 'expression':
                inputHTML = `
                    <div class="form-group">
                        <label>Expresión JavaScript:</label>
                        <textarea id="configValue" class="form-control" rows="3"
                                  placeholder="variable1 + variable2" required></textarea>
                        <small>Se evaluará en tiempo de ejecución</small>
                    </div>
                `;
                break;
        }

        container.innerHTML = inputHTML;
    },

    // Helper: Capturar elemento de la página
    captureElement(inputId) {
        showNotification('Haz click en un elemento de la página para capturarlo...', 'info');

        // Minimizar modal temporalmente
        const modal = document.getElementById('actionModal');
        modal.style.opacity = '0.3';
        modal.style.pointerEvents = 'none';

        // Activar modo de captura
        window.postMessage({ type: 'START_ELEMENT_CAPTURE', inputId: inputId }, '*');

        // Escuchar el elemento capturado
        const captureListener = (event) => {
            if (event.data.type === 'ELEMENT_CAPTURED') {
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = event.data.selector;
                    showNotification('Elemento capturado correctamente', 'success');
                }

                // Restaurar modal
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';

                // Remover listener
                window.removeEventListener('message', captureListener);
            }
        };

        window.addEventListener('message', captureListener);
    },

    renderWorkflow() {
        const canvas = document.getElementById('workflowCanvas');

        if (this.currentWorkflow.length === 0) {
            canvas.style.display = 'flex'; // Centrar cuando está vacío
            canvas.innerHTML = `
                <div class="canvas-empty">
                    <i class="fas fa-project-diagram"></i>
                    <p>Arrastra acciones aquí para construir tu workflow</p>
                </div>
            `;
            return;
        }

        canvas.style.display = 'block'; // Modo lista cuando tiene contenido
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

        // Detectar y actualizar variables
        if (typeof VariablesManager !== 'undefined') {
            VariablesManager.detectVariables(this.currentWorkflow);
            VariablesManager.renderVariablesPanel();
        }
    },

    createActionElement(action, index) {
        const div = document.createElement('div');
        div.className = 'workflow-action-item';
        div.style.cssText = `
            background: #1e293b;
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const iconMap = {
            navigate: 'fa-globe',
            click: 'fa-mouse-pointer',
            type: 'fa-keyboard',
            wait: 'fa-clock',
            screenshot: 'fa-camera',
            extract: 'fa-download',
            scroll: 'fa-arrows-alt-v',
            hover: 'fa-hand-pointer'
        };

        // Get icon from MCPProperties for generated components, or use default
        let icon = iconMap[action.type] || 'fa-cog';
        if (typeof MCPProperties !== 'undefined' && MCPProperties[action.type]) {
            icon = MCPProperties[action.type].icon || icon;
        }

        // Get title from MCPProperties for generated components
        let title = action.type.toUpperCase();
        if (typeof MCPProperties !== 'undefined' && MCPProperties[action.type]) {
            title = MCPProperties[action.type].title || title;
        }

        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.25rem;">${title}</h4>
                    <p style="color: #cbd5e1; font-size: 0.9rem; margin: 0;">${this.getActionSummary(action)}</p>
                </div>
                <div style="color: #64748b;">#${index + 1}</div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="WorkflowEditor.editAction(${index})" style="padding: 0.5rem; background: #10b981; border: none; border-radius: 6px; color: white; cursor: pointer;" title="Editar propiedades">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="WorkflowEditor.moveAction(${index}, -1)" style="padding: 0.5rem; background: #475569; border: none; border-radius: 6px; color: white; cursor: pointer;" title="Subir">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button onclick="WorkflowEditor.moveAction(${index}, 1)" style="padding: 0.5rem; background: #475569; border: none; border-radius: 6px; color: white; cursor: pointer;" title="Bajar">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button onclick="WorkflowEditor.deleteActionFromCanvas(${index})" style="padding: 0.5rem; background: #ef4444; border: none; border-radius: 6px; color: white; cursor: pointer;" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return div;
    },

    getActionSummary(action) {
        switch (action.type) {
            case 'navigate':
                return `URL: ${action.url}`;
            case 'click':
                return `Selector: ${action.selector}`;
            case 'type':
                return `"${action.text}" → ${action.selector}`;
            case 'wait':
                return `${action.duration}ms`;
            case 'screenshot':
                return `${action.path} ${action.fullPage ? '(página completa)' : ''}`;
            case 'extract':
                return `Selector: ${action.selector}`;
            case 'scroll':
                return `X: ${action.x}, Y: ${action.y}`;
            case 'hover':
                return `Selector: ${action.selector}`;
            default:
                // For generated/custom components, show first few properties
                const props = Object.keys(action).filter(key => key !== 'type');
                if (props.length > 0) {
                    const summary = props.slice(0, 2).map(key => {
                        const value = action[key];
                        if (typeof value === 'string' && value.length > 30) {
                            return `${key}: ${value.substring(0, 30)}...`;
                        }
                        return `${key}: ${value}`;
                    }).join(', ');
                    return summary;
                }
                return 'Sin descripción';
        }
    },

    editAction(index) {
        const action = this.currentWorkflow[index];
        if (typeof ActionProperties !== 'undefined') {
            ActionProperties.showPropertiesModal(action, (updatedAction) => {
                this.currentWorkflow[index] = updatedAction;
                this.renderWorkflow();
                showNotification('Propiedades actualizadas', 'success');
            });
        } else {
            console.error('ActionProperties no está disponible');
            alert('Sistema de propiedades no disponible');
        }
    },

    moveAction(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.currentWorkflow.length) return;

        const temp = this.currentWorkflow[index];
        this.currentWorkflow[index] = this.currentWorkflow[newIndex];
        this.currentWorkflow[newIndex] = temp;

        this.renderWorkflow();
    },

    deleteActionFromCanvas(index) {
        if (confirm('¿Eliminar esta acción?')) {
            this.currentWorkflow.splice(index, 1);
            this.renderWorkflow();
            showNotification('Acción eliminada', 'success');
        }
    },

    newWorkflow() {
        if (this.currentWorkflow.length > 0 && !confirm('¿Crear nuevo workflow? Se perderán los cambios no guardados.')) {
            return;
        }

        this.currentWorkflow = [];
        document.getElementById('workflowName').value = '';
        this.renderWorkflow();
        showNotification('Nuevo workflow creado', 'info');
    },

    saveWorkflow() {
        if (this.currentWorkflow.length === 0) {
            showNotification('El workflow está vacío', 'error');
            return;
        }

        const name = document.getElementById('workflowName').value.trim();
        if (!name) {
            showNotification('Por favor ingresa un nombre para el workflow', 'error');
            document.getElementById('workflowName').focus();
            return;
        }

        fetch('http://localhost:3000/api/workflows/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                workflow: this.currentWorkflow
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Workflow guardado exitosamente', 'success');
                    if (typeof Library !== 'undefined') {
                        Library.loadWorkflows();
                    }
                } else {
                    showNotification('Error al guardar workflow', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión', 'error');
            });
    },

    importWorkflow() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const workflow = JSON.parse(event.target.result);
                    this.currentWorkflow = workflow.actions || workflow;
                    document.getElementById('workflowName').value = workflow.name || 'Workflow Importado';
                    this.renderWorkflow();
                    showNotification('Workflow importado exitosamente', 'success');
                } catch (error) {
                    showNotification('Error al importar workflow', 'error');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    },

    exportWorkflow() {
        if (this.currentWorkflow.length === 0) {
            showNotification('No hay workflow para exportar', 'error');
            return;
        }

        const name = document.getElementById('workflowName').value.trim() || 'workflow';
        const data = {
            name: name,
            actions: this.currentWorkflow,
            exportedAt: new Date().toISOString()
        };

        downloadJSON(data, `${name}.json`);
        showNotification('Workflow exportado', 'success');
    },

    loadWorkflow(workflow) {
        this.currentWorkflow = workflow.actions;
        document.getElementById('workflowName').value = workflow.name;
        this.renderWorkflow();

        // Cambiar a vista de workflows
        document.querySelector('[data-view="workflows"]').click();

        showNotification('Workflow cargado', 'success');
    },

    // Obtener componentes generados dinámicamente
    getGeneratedComponents() {
        try {
            const saved = localStorage.getItem('generated_components');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading generated components:', error);
        }
        return [];
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WorkflowEditor.init());
} else {
    WorkflowEditor.init();
}
