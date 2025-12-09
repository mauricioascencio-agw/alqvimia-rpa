// 🗄️ GESTOR DE BASES DE DATOS - Similar a MySQL Workbench

const DatabaseManager = {
    connections: [],
    currentConnection: null,
    databases: [],
    currentDatabase: null,

    init() {
        this.loadConnections();
        console.log('DatabaseManager initialized');
    },

    loadConnections() {
        const saved = localStorage.getItem('db_connections');
        if (saved) {
            try {
                this.connections = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading connections:', e);
            }
        }
    },

    saveConnections() {
        localStorage.setItem('db_connections', JSON.stringify(this.connections));
    },

    // Mostrar modal de nueva conexión
    showConnectionModal(connection = null) {
        const isEdit = connection !== null;
        const conn = connection || {
            id: Date.now().toString(),
            name: '',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: '',
            ssl: false
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-database"></i>
                        ${isEdit ? 'Editar' : 'Nueva'} Conexión de Base de Datos
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="dbConnectionForm">
                        <div class="db-connection-grid">
                            <div class="form-group">
                                <label>Nombre de Conexión:</label>
                                <input type="text" id="connName" class="form-control" value="${conn.name}" placeholder="Ej: Producción MySQL" required>
                            </div>

                            <div class="form-group">
                                <label>Tipo de Base de Datos:</label>
                                <select id="connType" class="form-control">
                                    <option value="mysql" ${conn.type === 'mysql' ? 'selected' : ''}>MySQL</option>
                                    <option value="postgresql" ${conn.type === 'postgresql' ? 'selected' : ''}>PostgreSQL</option>
                                    <option value="sqlserver" ${conn.type === 'sqlserver' ? 'selected' : ''}>SQL Server</option>
                                    <option value="mongodb" ${conn.type === 'mongodb' ? 'selected' : ''}>MongoDB</option>
                                    <option value="oracle" ${conn.type === 'oracle' ? 'selected' : ''}>Oracle</option>
                                    <option value="mariadb" ${conn.type === 'mariadb' ? 'selected' : ''}>MariaDB</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Host / Servidor:</label>
                                <input type="text" id="connHost" class="form-control" value="${conn.host}" placeholder="localhost" required>
                            </div>

                            <div class="form-group">
                                <label>Puerto:</label>
                                <input type="number" id="connPort" class="form-control" value="${conn.port}" placeholder="3306" required>
                            </div>

                            <div class="form-group">
                                <label>Usuario:</label>
                                <input type="text" id="connUsername" class="form-control" value="${conn.username}" placeholder="root" required>
                            </div>

                            <div class="form-group">
                                <label>Contraseña:</label>
                                <div style="position: relative;">
                                    <input type="password" id="connPassword" class="form-control" value="${conn.password}" placeholder="••••••••">
                                    <button type="button" class="btn-toggle-password" onclick="DatabaseManager.togglePassword('connPassword')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="form-group full-width">
                                <label>Base de Datos (opcional):</label>
                                <input type="text" id="connDatabase" class="form-control" value="${conn.database}" placeholder="Dejar vacío para ver todas">
                            </div>

                            <div class="form-group full-width">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="connSSL" ${conn.ssl ? 'checked' : ''}>
                                    <span>Usar conexión SSL/TLS segura</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" onclick="DatabaseManager.testConnection()">
                        <i class="fas fa-plug"></i> Probar Conexión
                    </button>
                    <button class="btn btn-success" onclick="DatabaseManager.saveConnection(${isEdit ? `'${conn.id}'` : 'null'})">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Actualizar puerto por defecto según el tipo
        document.getElementById('connType').addEventListener('change', (e) => {
            const ports = {
                mysql: 3306,
                postgresql: 5432,
                sqlserver: 1433,
                mongodb: 27017,
                oracle: 1521,
                mariadb: 3306
            };
            document.getElementById('connPort').value = ports[e.target.value] || 3306;
        });
    },

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = event.target.closest('button').querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    },

    async testConnection() {
        const form = document.getElementById('dbConnectionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const connectionData = {
            type: document.getElementById('connType').value,
            host: document.getElementById('connHost').value,
            port: document.getElementById('connPort').value,
            username: document.getElementById('connUsername').value,
            password: document.getElementById('connPassword').value,
            database: document.getElementById('connDatabase').value,
            ssl: document.getElementById('connSSL').checked
        };

        showNotification('Probando conexión...', 'info');

        try {
            const response = await fetch('/api/database/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(connectionData)
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ Conexión exitosa! Servidor: ${result.serverVersion}`, 'success');
            } else {
                showNotification(`❌ Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification(`❌ Error de conexión: ${error.message}`, 'error');
        }
    },

    saveConnection(editId = null) {
        const form = document.getElementById('dbConnectionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const newConn = {
            id: editId || Date.now().toString(),
            name: document.getElementById('connName').value,
            type: document.getElementById('connType').value,
            host: document.getElementById('connHost').value,
            port: parseInt(document.getElementById('connPort').value),
            username: document.getElementById('connUsername').value,
            password: document.getElementById('connPassword').value,
            database: document.getElementById('connDatabase').value,
            ssl: document.getElementById('connSSL').checked,
            createdAt: new Date().toISOString()
        };

        if (editId) {
            const index = this.connections.findIndex(c => c.id === editId);
            if (index !== -1) {
                this.connections[index] = newConn;
            }
        } else {
            this.connections.push(newConn);
        }

        this.saveConnections();
        document.querySelector('.modal-overlay').remove();
        showNotification('Conexión guardada exitosamente', 'success');

        // Refrescar la vista si estamos en la página de BD
        if (document.getElementById('database-view')?.classList.contains('active')) {
            this.renderDatabaseView();
        }
    },

    async connect(connectionId) {
        const conn = this.connections.find(c => c.id === connectionId);
        if (!conn) return;

        showNotification('Conectando...', 'info');

        try {
            const response = await fetch('/api/database/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conn)
            });

            const result = await response.json();

            if (result.success) {
                this.currentConnection = conn;
                this.databases = result.databases || [];
                showNotification(`✅ Conectado a ${conn.name}`, 'success');
                this.showDatabaseExplorer();
            } else {
                showNotification(`❌ Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification(`❌ Error: ${error.message}`, 'error');
        }
    },

    showDatabaseExplorer() {
        // Esta función mostrará el explorador de BD con todas las tablas, vistas, etc.
        this.renderDatabaseExplorer();
    },

    async renderDatabaseExplorer() {
        const view = document.getElementById('database-view');
        if (!view || !this.currentConnection) return;

        view.innerHTML = `
            <div class="view-header">
                <h2>
                    <i class="fas fa-database"></i>
                    ${this.currentConnection.name}
                    <span style="font-size: 0.8rem; color: #94a3b8; font-weight: normal;">
                        (${this.currentConnection.host}:${this.currentConnection.port})
                    </span>
                </h2>
                <button class="btn btn-secondary" onclick="DatabaseManager.disconnect()">
                    <i class="fas fa-times"></i> Desconectar
                </button>
            </div>

            <div class="db-explorer" style="max-width: 1600px; margin: 0 auto; padding: 0 2rem;">
                <!-- Sidebar: Árbol de bases de datos -->
                <div class="db-sidebar">
                    <h3 style="color: #e2e8f0; margin-bottom: 1rem; font-size: 1rem;">
                        <i class="fas fa-folder-tree"></i> Esquema
                    </h3>
                    <div id="dbTree"></div>
                </div>

                <!-- Contenido principal -->
                <div class="db-main-content">
                    <div class="db-toolbar">
                        <button class="btn btn-primary" onclick="DatabaseManager.showQueryEditor()">
                            <i class="fas fa-code"></i> Nueva Consulta
                        </button>
                        <button class="btn btn-secondary" onclick="DatabaseManager.refreshSchema()">
                            <i class="fas fa-sync"></i> Refrescar
                        </button>
                        <button class="btn btn-info" onclick="DatabaseManager.showTableInfo()">
                            <i class="fas fa-info-circle"></i> Info de Tabla
                        </button>
                    </div>

                    <div id="dbMainArea">
                        <div style="text-align: center; padding: 4rem; color: #64748b;">
                            <i class="fas fa-mouse-pointer" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                            <h3>Selecciona una tabla del árbol</h3>
                            <p>O haz clic en "Nueva Consulta" para ejecutar SQL</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Cargar árbol de bases de datos
        this.loadDatabaseTree();
    },

    async loadDatabaseTree() {
        const treeContainer = document.getElementById('dbTree');
        if (!treeContainer) return;

        treeContainer.innerHTML = '<div style="color: #94a3b8; padding: 1rem;">Cargando...</div>';

        try {
            const response = await fetch('/api/database/list-databases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.currentConnection)
            });

            const result = await response.json();

            if (result.success && result.databases) {
                this.databases = result.databases;
                this.renderDatabaseTree();
            } else {
                treeContainer.innerHTML = `<div style="color: #ef4444; padding: 1rem;">Error: ${result.error}</div>`;
            }
        } catch (error) {
            treeContainer.innerHTML = `<div style="color: #ef4444; padding: 1rem;">Error: ${error.message}</div>`;
        }
    },

    renderDatabaseTree() {
        const treeContainer = document.getElementById('dbTree');
        if (!treeContainer) return;

        treeContainer.innerHTML = this.databases.map(db => `
            <div class="db-tree-item" onclick="DatabaseManager.toggleDatabase('${db}')">
                <i class="fas fa-database"></i>
                <span>${db}</span>
                <i class="fas fa-chevron-right" style="margin-left: auto; font-size: 0.75rem;"></i>
            </div>
            <div class="db-tree-children" id="db-${db}" style="display: none;">
                <div style="color: #94a3b8; padding: 0.5rem;">Cargando tablas...</div>
            </div>
        `).join('');
    },

    async toggleDatabase(dbName) {
        const dbContainer = document.getElementById(`db-${dbName}`);
        if (!dbContainer) return;

        // Si ya está abierto, cerrarlo
        if (dbContainer.style.display === 'block') {
            dbContainer.style.display = 'none';
            return;
        }

        // Abrir y cargar tablas
        dbContainer.style.display = 'block';
        this.currentDatabase = dbName;

        try {
            const response = await fetch('/api/database/list-tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.currentConnection,
                    database: dbName
                })
            });

            const result = await response.json();

            if (result.success && result.tables) {
                dbContainer.innerHTML = result.tables.map(table => `
                    <div class="db-tree-item" onclick="DatabaseManager.showTableData('${dbName}', '${table}')">
                        <i class="fas fa-table"></i>
                        <span>${table}</span>
                    </div>
                `).join('');
            } else {
                dbContainer.innerHTML = `<div style="color: #ef4444; padding: 0.5rem;">Error al cargar tablas</div>`;
            }
        } catch (error) {
            dbContainer.innerHTML = `<div style="color: #ef4444; padding: 0.5rem;">Error: ${error.message}</div>`;
        }
    },

    async showTableData(dbName, tableName) {
        const mainArea = document.getElementById('dbMainArea');
        if (!mainArea) return;

        mainArea.innerHTML = '<div style="padding: 2rem; color: #94a3b8;">Cargando datos...</div>';

        try {
            // Obtener estructura de la tabla
            const structureResponse = await fetch('/api/database/table-structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.currentConnection,
                    database: dbName,
                    table: tableName
                })
            });

            const structureResult = await structureResponse.json();

            // Obtener datos de la tabla (primeras 100 filas)
            const dataResponse = await fetch('/api/database/execute-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.currentConnection,
                    database: dbName,
                    query: `SELECT * FROM ${tableName} LIMIT 100`
                })
            });

            const dataResult = await dataResponse.json();

            if (structureResult.success && dataResult.success) {
                this.renderTableView(dbName, tableName, structureResult.structure, dataResult.results);
            } else {
                mainArea.innerHTML = `<div style="color: #ef4444; padding: 2rem;">Error al cargar tabla</div>`;
            }
        } catch (error) {
            mainArea.innerHTML = `<div style="color: #ef4444; padding: 2rem;">Error: ${error.message}</div>`;
        }
    },

    renderTableView(dbName, tableName, structure, data) {
        const mainArea = document.getElementById('dbMainArea');
        if (!mainArea) return;

        const rowCount = data.length;
        const columnCount = structure.length;

        mainArea.innerHTML = `
            <h3 style="color: #e2e8f0; margin-bottom: 1rem;">
                <i class="fas fa-table"></i> ${dbName}.${tableName}
            </h3>

            <!-- Estadísticas -->
            <div class="table-stats">
                <div class="stat-card">
                    <h4>Filas Mostradas</h4>
                    <div class="value">${rowCount}</div>
                </div>
                <div class="stat-card">
                    <h4>Columnas</h4>
                    <div class="value">${columnCount}</div>
                </div>
                <div class="stat-card">
                    <h4>Base de Datos</h4>
                    <div class="value" style="font-size: 1.2rem;">${dbName}</div>
                </div>
            </div>

            <!-- Botones de exportación -->
            <div class="export-buttons" style="margin-bottom: 1.5rem;">
                <button class="btn btn-success" onclick="DatabaseManager.exportTableData('${dbName}', '${tableName}', 'csv')">
                    <i class="fas fa-file-csv"></i> CSV
                </button>
                <button class="btn btn-info" onclick="DatabaseManager.exportTableData('${dbName}', '${tableName}', 'json')">
                    <i class="fas fa-file-code"></i> JSON
                </button>
                <button class="btn btn-warning" onclick="DatabaseManager.exportTableData('${dbName}', '${tableName}', 'excel')">
                    <i class="fas fa-file-excel"></i> Excel
                </button>
                <button class="btn btn-danger" onclick="DatabaseManager.exportTableData('${dbName}', '${tableName}', 'pdf')">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
            </div>

            <!-- Estructura de la tabla -->
            <details style="margin-bottom: 1.5rem;">
                <summary style="cursor: pointer; color: #2563eb; font-weight: bold; padding: 0.5rem;">
                    <i class="fas fa-chevron-right"></i> Ver Estructura (${columnCount} columnas)
                </summary>
                <table class="db-results-table" style="margin-top: 1rem;">
                    <thead>
                        <tr>
                            <th>Columna</th>
                            <th>Tipo</th>
                            <th>Null</th>
                            <th>Key</th>
                            <th>Default</th>
                            <th>Extra</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${structure.map(col => `
                            <tr>
                                <td><strong>${col.Field}</strong></td>
                                <td>${col.Type}</td>
                                <td>${col.Null}</td>
                                <td>${col.Key}</td>
                                <td>${col.Default || 'NULL'}</td>
                                <td>${col.Extra || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </details>

            <!-- Datos de la tabla -->
            <h4 style="color: #e2e8f0; margin-bottom: 1rem;">Datos (Primeras 100 filas)</h4>
            <div style="overflow-x: auto;">
                <table class="db-results-table">
                    <thead>
                        <tr>
                            ${structure.map(col => `<th>${col.Field}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${structure.map(col => `<td>${this.formatCellValue(row[col.Field])}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    formatCellValue(value) {
        if (value === null || value === undefined) return '<span style="color: #64748b; font-style: italic;">NULL</span>';
        if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    },

    showQueryEditor() {
        const mainArea = document.getElementById('dbMainArea');
        if (!mainArea) return;

        mainArea.innerHTML = `
            <h3 style="color: #e2e8f0; margin-bottom: 1rem;">
                <i class="fas fa-code"></i> Editor de Consultas SQL
            </h3>

            <div style="margin-bottom: 1rem;">
                <textarea class="query-editor" id="sqlQuery" placeholder="Escribe tu consulta SQL aquí...

Ejemplo:
SELECT * FROM usuarios WHERE activo = 1 LIMIT 10;"></textarea>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                <button class="btn btn-success" onclick="DatabaseManager.executeQuery()">
                    <i class="fas fa-play"></i> Ejecutar Consulta
                </button>
                <button class="btn btn-secondary" onclick="DatabaseManager.clearQuery()">
                    <i class="fas fa-eraser"></i> Limpiar
                </button>
                <select id="queryDatabase" class="form-control" style="max-width: 200px;">
                    <option value="">Seleccionar BD</option>
                    ${this.databases.map(db => `
                        <option value="${db}" ${db === this.currentDatabase ? 'selected' : ''}>${db}</option>
                    `).join('')}
                </select>
            </div>

            <div id="queryResults"></div>
        `;
    },

    async executeQuery() {
        const query = document.getElementById('sqlQuery').value.trim();
        const dbName = document.getElementById('queryDatabase').value;
        const resultsDiv = document.getElementById('queryResults');

        if (!query) {
            showNotification('Por favor escribe una consulta SQL', 'warning');
            return;
        }

        if (!dbName) {
            showNotification('Por favor selecciona una base de datos', 'warning');
            return;
        }

        resultsDiv.innerHTML = '<div style="padding: 1rem; color: #94a3b8;">Ejecutando consulta...</div>';

        try {
            const response = await fetch('/api/database/execute-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.currentConnection,
                    database: dbName,
                    query: query
                })
            });

            const result = await response.json();

            if (result.success) {
                if (result.results && result.results.length > 0) {
                    this.renderQueryResults(result.results);
                } else {
                    resultsDiv.innerHTML = `
                        <div style="padding: 1rem; color: #10b981; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                            <i class="fas fa-check-circle"></i> Consulta ejecutada exitosamente.
                            ${result.affectedRows ? `${result.affectedRows} filas afectadas.` : 'Sin resultados.'}
                        </div>
                    `;
                }
            } else {
                resultsDiv.innerHTML = `
                    <div style="padding: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                        <strong>Error:</strong> ${result.error}
                    </div>
                `;
            }
        } catch (error) {
            resultsDiv.innerHTML = `
                <div style="padding: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    },

    renderQueryResults(results) {
        const resultsDiv = document.getElementById('queryResults');
        if (!resultsDiv || !results || results.length === 0) return;

        const columns = Object.keys(results[0]);

        resultsDiv.innerHTML = `
            <div style="margin-bottom: 1rem; color: #10b981;">
                <i class="fas fa-check-circle"></i> ${results.length} fila(s) devuelta(s)
            </div>
            <div style="overflow-x: auto;">
                <table class="db-results-table">
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(row => `
                            <tr>
                                ${columns.map(col => `<td>${this.formatCellValue(row[col])}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    clearQuery() {
        document.getElementById('sqlQuery').value = '';
        document.getElementById('queryResults').innerHTML = '';
    },

    async exportTableData(dbName, tableName, format) {
        showNotification(`Exportando a ${format.toUpperCase()}...`, 'info');

        try {
            const response = await fetch('/api/database/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...this.currentConnection,
                    database: dbName,
                    table: tableName,
                    format: format
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${tableName}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                showNotification(`✅ Exportado a ${format.toUpperCase()}`, 'success');
            } else {
                showNotification('❌ Error al exportar', 'error');
            }
        } catch (error) {
            showNotification(`❌ Error: ${error.message}`, 'error');
        }
    },

    refreshSchema() {
        if (this.currentConnection) {
            this.loadDatabaseTree();
            showNotification('Esquema actualizado', 'success');
        }
    },

    showTableInfo() {
        showNotification('Selecciona una tabla del árbol para ver su información', 'info');
    },

    disconnect() {
        this.currentConnection = null;
        this.currentDatabase = null;
        this.databases = [];
        this.renderDatabaseView();
        showNotification('Desconectado', 'success');
    },

    renderDatabaseView() {
        // Renderizar vista principal de base de datos
        const view = document.getElementById('database-view');
        if (!view) return;

        view.innerHTML = `
            <div class="view-header">
                <h2><i class="fas fa-database"></i> Gestor de Bases de Datos</h2>
                <p>Conecta y gestiona tus bases de datos</p>
            </div>

            <div style="max-width: 1400px; margin: 0 auto; padding: 0 2rem;">
                <div style="margin-bottom: 2rem;">
                    <button class="btn btn-primary btn-lg" onclick="DatabaseManager.showConnectionModal()">
                        <i class="fas fa-plus-circle"></i> Nueva Conexión
                    </button>
                </div>

                <div class="db-connections-grid">
                    ${this.connections.length === 0 ? `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: #64748b;">
                            <i class="fas fa-database" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                            <h3>No hay conexiones configuradas</h3>
                            <p>Crea tu primera conexión para empezar</p>
                        </div>
                    ` : this.connections.map(conn => this.renderConnectionCard(conn)).join('')}
                </div>
            </div>
        `;
    },

    renderConnectionCard(conn) {
        const typeIcons = {
            mysql: 'fa-database',
            postgresql: 'fa-elephant',
            sqlserver: 'fa-server',
            mongodb: 'fa-leaf',
            oracle: 'fa-circle',
            mariadb: 'fa-database'
        };

        const typeColors = {
            mysql: '#00758F',
            postgresql: '#336791',
            sqlserver: '#CC2927',
            mongodb: '#47A248',
            oracle: '#F80000',
            mariadb: '#003545'
        };

        return `
            <div class="db-connection-card">
                <div class="db-conn-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div class="db-icon" style="background: ${typeColors[conn.type]}">
                            <i class="fas ${typeIcons[conn.type]}"></i>
                        </div>
                        <div>
                            <h3>${conn.name}</h3>
                            <div class="db-conn-details">
                                <span><i class="fas fa-server"></i> ${conn.host}:${conn.port}</span>
                                <span><i class="fas fa-user"></i> ${conn.username}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="db-conn-actions">
                    <button class="btn btn-success" onclick="DatabaseManager.connect('${conn.id}')">
                        <i class="fas fa-plug"></i> Conectar
                    </button>
                    <button class="btn btn-secondary" onclick="DatabaseManager.showConnectionModal(${JSON.stringify(conn).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="DatabaseManager.deleteConnection('${conn.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    deleteConnection(id) {
        if (confirm('¿Eliminar esta conexión?')) {
            this.connections = this.connections.filter(c => c.id !== id);
            this.saveConnections();
            this.renderDatabaseView();
            showNotification('Conexión eliminada', 'success');
        }
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DatabaseManager.init());
} else {
    DatabaseManager.init();
}
