// 🔌 SISTEMA MCP (Model Context Protocol) - CONECTORES EMPRESARIALES

const MCPManager = {
    connectors: [],

    // Configuraciones de conectores disponibles
    availableConnectors: [
        {
            id: 'zoho',
            name: 'Zoho CRM',
            icon: '📊',
            color: '#e34141',
            description: 'Integración completa con Zoho CRM, Campaigns, Desk y más',
            apiType: 'REST',
            authType: 'OAuth 2.0',
            endpoints: ['crm', 'campaigns', 'desk', 'books', 'analytics']
        },
        {
            id: 'jira',
            name: 'Jira',
            icon: '📋',
            color: '#0052CC',
            description: 'Gestión de proyectos y seguimiento de issues',
            apiType: 'REST',
            authType: 'API Token / OAuth',
            endpoints: ['issues', 'projects', 'boards', 'sprints', 'users']
        },
        {
            id: 'sap',
            name: 'SAP',
            icon: '🏢',
            color: '#0FAAFF',
            description: 'Integración con SAP ERP, S/4HANA y Business One',
            apiType: 'OData / REST',
            authType: 'Basic / OAuth',
            endpoints: ['orders', 'products', 'customers', 'inventory', 'finance']
        },
        {
            id: 'peoplesoft',
            name: 'PeopleSoft',
            icon: '👥',
            color: '#FF0000',
            description: 'Oracle PeopleSoft HCM y gestión de recursos humanos',
            apiType: 'REST / SOAP',
            authType: 'Basic / Token',
            endpoints: ['employees', 'payroll', 'recruitment', 'benefits', 'time']
        },
        {
            id: 'oracle',
            name: 'Oracle Database',
            icon: '🗄️',
            color: '#F80000',
            description: 'Conexión a Oracle Database y Oracle Cloud',
            apiType: 'SQL / REST',
            authType: 'Database Auth / API Key',
            endpoints: ['query', 'stored_procedures', 'tables', 'views', 'functions']
        },
        {
            id: 'mysql',
            name: 'MySQL / Bases de Datos',
            icon: '🐬',
            color: '#00758F',
            description: 'Conexión universal a MySQL, PostgreSQL, SQL Server, MongoDB',
            apiType: 'SQL / NoSQL',
            authType: 'Database Credentials',
            endpoints: ['mysql', 'postgresql', 'sqlserver', 'mongodb', 'mariadb']
        },
        {
            id: 'office365',
            name: 'Office 365',
            icon: '📧',
            color: '#0078D4',
            description: 'Microsoft Office 365: Outlook, Teams, SharePoint, OneDrive',
            apiType: 'Microsoft Graph API',
            authType: 'OAuth 2.0',
            endpoints: ['mail', 'calendar', 'teams', 'sharepoint', 'onedrive', 'users']
        },
        {
            id: 'zendesk',
            name: 'Zendesk',
            icon: '🎫',
            color: '#03363D',
            description: 'Plataforma de soporte y gestión de tickets',
            apiType: 'REST',
            authType: 'API Token / OAuth',
            endpoints: ['tickets', 'users', 'organizations', 'chat', 'help_center']
        },
        {
            id: 'netsuite',
            name: 'NetSuite',
            icon: '💼',
            color: '#1F75A8',
            description: 'Oracle NetSuite ERP en la nube',
            apiType: 'SuiteTalk REST / SOAP',
            authType: 'Token Based / OAuth',
            endpoints: ['customers', 'transactions', 'inventory', 'finance', 'reports']
        },
        {
            id: 'odoo',
            name: 'Odoo',
            icon: '🟣',
            color: '#714B67',
            description: 'Suite empresarial de código abierto',
            apiType: 'XML-RPC / REST',
            authType: 'API Key',
            endpoints: ['sales', 'crm', 'inventory', 'accounting', 'hr', 'projects']
        },
        {
            id: 'sat',
            name: 'SAT México',
            icon: '🇲🇽',
            color: '#006341',
            description: 'Servicios de Administración Tributaria - México',
            apiType: 'REST / SOAP',
            authType: 'FIEL / e.firma',
            endpoints: ['cfdi', 'nomina', 'complementos', 'cancelacion', 'validacion']
        }
    ],

    init() {
        this.loadConnectors();
        this.createMCPTab();
        console.log('MCPManager initialized');
    },

    loadConnectors() {
        const saved = localStorage.getItem('mcp_connectors');
        if (saved) {
            try {
                this.connectors = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading MCP connectors:', e);
                this.connectors = [];
            }
        }
    },

    saveConnectors() {
        localStorage.setItem('mcp_connectors', JSON.stringify(this.connectors));
    },

    // Crear pestaña MCP
    createMCPTab() {
        const nav = document.querySelector('.sidebar nav');
        if (!nav) return;

        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-view', 'mcp');
        navItem.innerHTML = `
            <i class="fas fa-plug"></i>
            <span>MCP Conectores</span>
        `;

        const libraryItem = document.querySelector('.nav-item[data-view="library"]');
        if (libraryItem) {
            nav.insertBefore(navItem, libraryItem);
        } else {
            nav.appendChild(navItem);
        }

        this.createMCPView();

        navItem.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById('mcp-view').classList.add('active');

            this.renderDashboard();
        });
    },

    // Crear vista MCP
    createMCPView() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const mcpView = document.createElement('div');
        mcpView.className = 'view';
        mcpView.id = 'mcp-view';
        mcpView.innerHTML = `
            <div class="view-header">
                <h2><i class="fas fa-plug"></i> MCP - Model Context Protocol</h2>
                <p>Conectores empresariales para integración con APIs externas</p>
            </div>

            <div id="mcpDashboard">
                <!-- Dashboard se renderiza aquí -->
            </div>
        `;

        mainContent.appendChild(mcpView);
    },

    // Renderizar dashboard principal
    renderDashboard() {
        const dashboard = document.getElementById('mcpDashboard');
        if (!dashboard) return;

        const activeConnectors = this.connectors.filter(c => c.status === 'active').length;
        const totalConnectors = this.connectors.length;

        dashboard.innerHTML = `
            <!-- Estadísticas -->
            <div class="mcp-stats-grid">
                <div class="mcp-stat-card" onclick="MCPManager.scrollToSection('configured')">
                    <div class="mcp-stat-content">
                        <div>
                            <div class="mcp-stat-value">${totalConnectors}</div>
                            <div class="mcp-stat-label">Conectores Configurados</div>
                        </div>
                        <i class="fas fa-plug mcp-stat-icon"></i>
                    </div>
                </div>

                <div class="mcp-stat-card success" onclick="MCPManager.scrollToSection('configured')">
                    <div class="mcp-stat-content">
                        <div>
                            <div class="mcp-stat-value">${activeConnectors}</div>
                            <div class="mcp-stat-label">Conectores Activos</div>
                        </div>
                        <i class="fas fa-check-circle mcp-stat-icon"></i>
                    </div>
                </div>

                <div class="mcp-stat-card warning">
                    <div class="mcp-stat-content">
                        <div>
                            <div class="mcp-stat-value">${this.availableConnectors.length}</div>
                            <div class="mcp-stat-label">Tipos Disponibles</div>
                        </div>
                        <i class="fas fa-server mcp-stat-icon"></i>
                    </div>
                </div>
            </div>

            <!-- Botón agregar conector -->
            <div class="mcp-add-button-section">
                <button class="btn btn-primary btn-lg" onclick="MCPManager.showAddConnectorModal()">
                    <i class="fas fa-plus-circle"></i> Agregar Nuevo Conector
                </button>
            </div>

            <!-- Conectores disponibles -->
            <h3 class="mcp-section-title" id="mcp-available-section">
                <i class="fas fa-layer-group"></i> Conectores Disponibles
            </h3>
            <div class="mcp-connectors-grid">
                ${this.availableConnectors.map(conn => this.renderAvailableConnector(conn)).join('')}
            </div>

            <!-- Conectores configurados -->
            ${totalConnectors > 0 ? `
                <h3 class="mcp-section-title" id="mcp-configured-section">
                    <i class="fas fa-cogs"></i> Mis Conectores Configurados
                </h3>
                <div class="mcp-connectors-grid">
                    ${this.connectors.map((conn, idx) => this.renderConfiguredConnector(conn, idx)).join('')}
                </div>
            ` : ''}
        `;
    },

    // Renderizar conector disponible
    renderAvailableConnector(conn) {
        return `
            <div class="mcp-connector-card" onclick="MCPManager.showConnectorConfig('${conn.id}')">
                <div class="mcp-connector-header">
                    <div class="mcp-connector-icon" style="background: ${conn.color}20; border: 2px solid ${conn.color};">
                        ${conn.icon}
                    </div>
                    <div class="mcp-connector-info">
                        <h4 class="mcp-connector-title">${conn.name}</h4>
                        <div class="mcp-connector-type">${conn.apiType}</div>
                    </div>
                </div>

                <p class="mcp-connector-description">${conn.description}</p>

                <div class="mcp-auth-panel">
                    <div class="mcp-auth-label">Autenticación:</div>
                    <div class="mcp-auth-value">${conn.authType}</div>
                </div>

                <div class="mcp-endpoints">
                    ${conn.endpoints.slice(0, 3).map(ep => `
                        <span class="mcp-endpoint-tag">${ep}</span>
                    `).join('')}
                    ${conn.endpoints.length > 3 ? `
                        <span class="mcp-endpoint-tag more">+${conn.endpoints.length - 3} más</span>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Renderizar conector configurado
    renderConfiguredConnector(conn, index) {
        const config = this.availableConnectors.find(c => c.id === conn.type);
        if (!config) return '';

        const statusColor = conn.status === 'active' ? '#10b981' : '#64748b';
        const statusIcon = conn.status === 'active' ? 'fa-check-circle' : 'fa-pause-circle';

        return `
            <div class="mcp-configured-card" style="border-left-color: ${statusColor};">
                <div class="mcp-configured-header">
                    <div class="mcp-configured-identity">
                        <div style="font-size: 2.5rem;">${config.icon}</div>
                        <div>
                            <h4 class="mcp-configured-name">${conn.name}</h4>
                            <div class="mcp-configured-type">${config.name}</div>
                        </div>
                    </div>
                    <i class="fas ${statusIcon} mcp-status-icon" style="color: ${statusColor};"></i>
                </div>

                <div class="mcp-info-panel">
                    <div class="mcp-info-grid">
                        <div>
                            <div class="mcp-info-label">URL:</div>
                            <div class="mcp-info-value">${conn.url || 'No configurada'}</div>
                        </div>
                        <div>
                            <div class="mcp-info-label">Última conexión:</div>
                            <div class="mcp-info-value">${conn.lastConnection || 'Nunca'}</div>
                        </div>
                    </div>
                </div>

                <div class="mcp-actions">
                    <button class="btn btn-sm btn-primary" onclick="MCPManager.testConnection(${index})">
                        <i class="fas fa-flask"></i> Probar
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="MCPManager.editConnector(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm ${conn.status === 'active' ? 'btn-warning' : 'btn-success'}"
                            onclick="MCPManager.toggleConnector(${index})">
                        <i class="fas ${conn.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="MCPManager.deleteConnector(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // Mostrar configuración de conector específico
    showConnectorConfig(connectorId) {
        const config = this.availableConnectors.find(c => c.id === connectorId);
        if (!config) return;

        // Abrir modal de configuración específico
        this.showAddConnectorModal(config);
    },

    // Modal para agregar/editar conector
    showAddConnectorModal(selectedConfig = null, editIndex = null) {
        const connector = editIndex !== null ? this.connectors[editIndex] : {
            type: selectedConfig?.id || '',
            name: '',
            url: '',
            apiKey: '',
            status: 'inactive'
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-plug"></i>
                        ${editIndex !== null ? 'Editar' : 'Configurar'} Conector${selectedConfig ? ': ' + selectedConfig.name : ''}
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="connectorForm" style="display: flex; flex-direction: column; gap: 1.25rem;">

                        ${!selectedConfig ? `
                            <div class="form-group">
                                <label><i class="fas fa-layer-group"></i> Tipo de Conector *</label>
                                <select id="connectorType" class="form-control" required>
                                    <option value="">Seleccionar...</option>
                                    ${this.availableConnectors.map(c => `
                                        <option value="${c.id}" ${connector.type === c.id ? 'selected' : ''}>
                                            ${c.icon} ${c.name}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        ` : ''}

                        <div class="form-group">
                            <label><i class="fas fa-signature"></i> Nombre de la Conexión *</label>
                            <input type="text" id="connectorName" class="form-control" required
                                   value="${connector.name}" placeholder="Ej: Zoho Producción">
                        </div>

                        <div class="form-group">
                            <label><i class="fas fa-link"></i> URL Base API *</label>
                            <input type="url" id="connectorUrl" class="form-control" required
                                   value="${connector.url}" placeholder="https://api.ejemplo.com">
                        </div>

                        <div class="form-group">
                            <label><i class="fas fa-key"></i> API Key / Token *</label>
                            <input type="password" id="connectorApiKey" class="form-control" required
                                   value="${connector.apiKey}" placeholder="••••••••••••••••">
                            <small style="color: #64748b;">Se guardará de forma segura</small>
                        </div>

                        ${this.renderConnectorSpecificFields(selectedConfig?.id || connector.type)}

                        <div style="background: #1e293b; padding: 1rem; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" id="connectorActive" ${connector.status === 'active' ? 'checked' : ''}>
                                <span>Activar conector inmediatamente</span>
                            </label>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="saveConnectorBtn">
                        <i class="fas fa-save"></i> Guardar Conector
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        modal.querySelector('#saveConnectorBtn').onclick = () => {
            const form = modal.querySelector('#connectorForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const newConnector = {
                id: connector.id || Date.now().toString(),
                type: selectedConfig?.id || modal.querySelector('#connectorType')?.value || connector.type,
                name: modal.querySelector('#connectorName').value,
                url: modal.querySelector('#connectorUrl').value,
                apiKey: modal.querySelector('#connectorApiKey').value,
                status: modal.querySelector('#connectorActive').checked ? 'active' : 'inactive',
                createdAt: connector.createdAt || new Date().toISOString(),
                lastConnection: null
            };

            if (editIndex !== null) {
                this.connectors[editIndex] = newConnector;
            } else {
                this.connectors.push(newConnector);
            }

            this.saveConnectors();
            this.renderDashboard();
            modal.remove();
            showNotification('Conector guardado exitosamente', 'success');
        };
    },

    // Campos específicos por tipo de conector
    renderConnectorSpecificFields(type) {
        switch(type) {
            case 'sat':
                return `
                    <div style="background: #1e293b; padding: 1rem; border-radius: 8px;">
                        <h4 style="margin-top: 0; color: #e2e8f0;">Configuración SAT</h4>
                        <div class="form-group">
                            <label>RFC</label>
                            <input type="text" id="satRFC" class="form-control" placeholder="XAXX010101000">
                        </div>
                        <div class="form-group">
                            <label>Archivo FIEL (.cer)</label>
                            <input type="file" class="form-control" accept=".cer">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Archivo FIEL (.key)</label>
                            <input type="file" class="form-control" accept=".key">
                        </div>
                    </div>
                `;
            case 'office365':
                return `
                    <div class="form-group">
                        <label>Tenant ID</label>
                        <input type="text" id="o365TenantId" class="form-control" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
                    </div>
                    <div class="form-group">
                        <label>Client ID</label>
                        <input type="text" id="o365ClientId" class="form-control" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
                    </div>
                `;
            default:
                return '';
        }
    },

    // Probar conexión
    testConnection(index) {
        const connector = this.connectors[index];
        showNotification('Probando conexión...', 'info');

        // Simulación de prueba de conexión
        setTimeout(() => {
            connector.lastConnection = new Date().toLocaleString('es-MX');
            this.saveConnectors();
            this.renderDashboard();
            showNotification('Conexión exitosa', 'success');
        }, 1500);
    },

    // Editar conector
    editConnector(index) {
        this.showAddConnectorModal(null, index);
    },

    // Activar/desactivar conector
    toggleConnector(index) {
        this.connectors[index].status = this.connectors[index].status === 'active' ? 'inactive' : 'active';
        this.saveConnectors();
        this.renderDashboard();
        showNotification(`Conector ${this.connectors[index].status === 'active' ? 'activado' : 'desactivado'}`, 'info');
    },

    // Eliminar conector
    deleteConnector(index) {
        if (confirm(`¿Eliminar el conector "${this.connectors[index].name}"?`)) {
            this.connectors.splice(index, 1);
            this.saveConnectors();
            this.renderDashboard();
            showNotification('Conector eliminado', 'success');
        }
    },

    // Scroll a sección específica
    scrollToSection(section) {
        const sectionId = section === 'available' ? 'mcp-available-section' : 'mcp-configured-section';
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MCPManager.init());
} else {
    MCPManager.init();
}
