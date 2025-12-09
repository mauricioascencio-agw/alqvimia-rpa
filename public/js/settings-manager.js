// 🔧 SISTEMA DE CONFIGURACIONES GENERALES

const SettingsManager = {
    settings: {
        language: 'es',
        theme: 'dark', // dark, light, blue, purple, ocean
        notifications: {
            showSystem: true,
            playSound: true
        },
        progressBar: {
            barColor: '#2563eb',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            textColor: '#ffffff',
            height: '60px',
            position: 'top',
            showPercentage: true,
            showCurrentAction: true
        },
        credentials: []
    },

    translations: {
        es: {
            appTitle: 'Element Spy RPA',
            connected: 'Conectado',
            disconnected: 'Desconectado',
            elementSpy: 'Element Spy',
            recorder: 'Grabador',
            workflows: 'Workflows',
            executor: 'Ejecutor',
            agents: 'Agentes',
            mcpConnectors: 'MCP Conectores',
            library: 'Biblioteca',
            iaDashboard: 'IA Dashboard',
            settings: 'Configuraciones'
        },
        en: {
            appTitle: 'Element Spy RPA',
            connected: 'Connected',
            disconnected: 'Disconnected',
            elementSpy: 'Element Spy',
            recorder: 'Recorder',
            workflows: 'Workflows',
            executor: 'Executor',
            agents: 'Agents',
            mcpConnectors: 'MCP Connectors',
            library: 'Library',
            iaDashboard: 'AI Dashboard',
            settings: 'Settings'
        }
    },

    init() {
        this.loadSettings();
        this.createSettingsTab();
        this.applyTheme(this.settings.theme);
        this.applyLanguage(this.settings.language);
        console.log('SettingsManager initialized');
    },

    loadSettings() {
        const saved = localStorage.getItem('app_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    },

    saveSettings() {
        localStorage.setItem('app_settings', JSON.stringify(this.settings));

        // También guardar en archivo JSON a través del servidor
        this.saveToFile();
    },

    async saveToFile() {
        try {
            const response = await fetch('/api/settings/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: this.settings,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log('✅ Configuraciones guardadas en archivo');
            }
        } catch (error) {
            console.error('Error guardando configuraciones:', error);
        }
    },

    // Crear pestaña de Configuraciones
    createSettingsTab() {
        const nav = document.querySelector('.sidebar nav');
        if (!nav) return;

        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-view', 'settings');
        navItem.innerHTML = `
            <i class="fas fa-cog"></i>
            <span>Configuraciones</span>
        `;

        nav.appendChild(navItem);

        this.createSettingsView();

        navItem.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById('settings-view').classList.add('active');

            this.renderSettings();
        });
    },

    // Crear vista de configuraciones
    createSettingsView() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const settingsView = document.createElement('div');
        settingsView.className = 'view';
        settingsView.id = 'settings-view';
        settingsView.innerHTML = `
            <div class="view-header">
                <h2><i class="fas fa-cog"></i> Configuraciones Generales</h2>
                <p>Personaliza tu experiencia con Element Spy RPA</p>
            </div>

            <div id="settingsContainer">
                <!-- Configuraciones se renderizarán aquí -->
            </div>
        `;

        mainContent.appendChild(settingsView);
    },

    // Renderizar configuraciones
    renderSettings() {
        const container = document.getElementById('settingsContainer');
        if (!container) return;

        container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <!-- Tabs de secciones -->
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="general">
                        <i class="fas fa-sliders-h"></i> General
                    </button>
                    <button class="settings-tab" data-tab="progress">
                        <i class="fas fa-chart-line"></i> Barra de Progreso
                    </button>
                    <button class="settings-tab" data-tab="credentials">
                        <i class="fas fa-key"></i> Credenciales
                    </button>
                    <button class="settings-tab" data-tab="users">
                        <i class="fas fa-users"></i> Usuarios
                    </button>
                </div>

                <!-- Contenido de tabs -->
                <div class="settings-content">
                    <div class="settings-tab-content active" id="tab-general">
                        ${this.renderGeneralSettings()}
                    </div>
                    <div class="settings-tab-content" id="tab-progress">
                        ${this.renderProgressSettings()}
                    </div>
                    <div class="settings-tab-content" id="tab-credentials">
                        ${this.renderCredentialsSettings()}
                    </div>
                    <div class="settings-tab-content" id="tab-users">
                        ${this.renderUsersSettings()}
                    </div>
                </div>
            </div>
        `;

        this.attachTabListeners();
    },

    // Renderizar configuraciones generales
    renderGeneralSettings() {
        return `
            <div class="settings-section">
                <h3><i class="fas fa-globe"></i> Idioma / Language</h3>
                <div class="settings-card">
                    <div class="settings-item">
                        <label for="language">Seleccionar Idioma:</label>
                        <select id="language" class="form-control" onchange="SettingsManager.changeLanguage(this.value)">
                            <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-palette"></i> Tema / Theme</h3>
                <div class="settings-card">
                    <div class="settings-item">
                        <label>Selecciona tu tema:</label>
                        <div class="theme-selector">
                            <button class="theme-option ${this.settings.theme === 'dark' ? 'active' : ''}"
                                    onclick="SettingsManager.changeTheme('dark')" data-theme="dark">
                                <i class="fas fa-moon"></i>
                                <span>Oscuro</span>
                                <div class="theme-preview" style="background: linear-gradient(135deg, #0f172a, #1e293b);"></div>
                            </button>
                            <button class="theme-option ${this.settings.theme === 'light' ? 'active' : ''}"
                                    onclick="SettingsManager.changeTheme('light')" data-theme="light">
                                <i class="fas fa-sun"></i>
                                <span>Claro</span>
                                <div class="theme-preview" style="background: linear-gradient(135deg, #f8fafc, #e2e8f0);"></div>
                            </button>
                            <button class="theme-option ${this.settings.theme === 'blue' ? 'active' : ''}"
                                    onclick="SettingsManager.changeTheme('blue')" data-theme="blue">
                                <i class="fas fa-water"></i>
                                <span>Océano</span>
                                <div class="theme-preview" style="background: linear-gradient(135deg, #0c4a6e, #0e7490);"></div>
                            </button>
                            <button class="theme-option ${this.settings.theme === 'purple' ? 'active' : ''}"
                                    onclick="SettingsManager.changeTheme('purple')" data-theme="purple">
                                <i class="fas fa-crown"></i>
                                <span>Púrpura</span>
                                <div class="theme-preview" style="background: linear-gradient(135deg, #581c87, #7c3aed);"></div>
                            </button>
                            <button class="theme-option ${this.settings.theme === 'forest' ? 'active' : ''}"
                                    onclick="SettingsManager.changeTheme('forest')" data-theme="forest">
                                <i class="fas fa-tree"></i>
                                <span>Bosque</span>
                                <div class="theme-preview" style="background: linear-gradient(135deg, #14532d, #166534);"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-bell"></i> Notificaciones</h3>
                <div class="settings-card">
                    <div class="settings-item">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="notifSystem"
                                   ${this.settings.notifications.showSystem ? 'checked' : ''}
                                   onchange="SettingsManager.updateNotification('showSystem', this.checked)">
                            <span>Mostrar notificaciones de sistema</span>
                        </label>
                    </div>
                    <div class="settings-item">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="notifSound"
                                   ${this.settings.notifications.playSound ? 'checked' : ''}
                                   onchange="SettingsManager.updateNotification('playSound', this.checked)">
                            <span>Sonido en notificaciones</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar configuraciones de barra de progreso
    renderProgressSettings() {
        const pb = this.settings.progressBar;

        return `
            <div class="settings-section">
                <h3><i class="fas fa-chart-line"></i> Configuración de Barra de Progreso</h3>
                <div class="settings-card">
                    <div class="settings-grid">
                        <div class="settings-item">
                            <label for="barColor">Color de Barra:</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="color" id="barColor" value="${pb.barColor}"
                                       onchange="SettingsManager.updateProgressSetting('barColor', this.value)">
                                <input type="text" class="form-control" value="${pb.barColor}" readonly>
                            </div>
                        </div>

                        <div class="settings-item">
                            <label for="bgColor">Color de Fondo:</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="color" id="bgColor" value="${pb.backgroundColor}"
                                       onchange="SettingsManager.updateProgressSetting('backgroundColor', this.value)">
                                <input type="text" class="form-control" value="${pb.backgroundColor}" readonly>
                            </div>
                        </div>

                        <div class="settings-item">
                            <label for="textColor">Color de Texto:</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="color" id="textColor" value="${pb.textColor}"
                                       onchange="SettingsManager.updateProgressSetting('textColor', this.value)">
                                <input type="text" class="form-control" value="${pb.textColor}" readonly>
                            </div>
                        </div>

                        <div class="settings-item">
                            <label for="position">Posición:</label>
                            <select id="position" class="form-control"
                                    onchange="SettingsManager.updateProgressSetting('position', this.value)">
                                <option value="top" ${pb.position === 'top' ? 'selected' : ''}>Superior</option>
                                <option value="bottom" ${pb.position === 'bottom' ? 'selected' : ''}>Inferior</option>
                            </select>
                        </div>

                        <div class="settings-item">
                            <label for="height">Altura:</label>
                            <input type="range" id="height" min="40" max="100" value="${parseInt(pb.height)}"
                                   onchange="SettingsManager.updateProgressSetting('height', this.value + 'px')">
                            <span>${pb.height}</span>
                        </div>
                    </div>

                    <div class="settings-item" style="margin-top: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" ${pb.showPercentage ? 'checked' : ''}
                                   onchange="SettingsManager.updateProgressSetting('showPercentage', this.checked)">
                            <span>Mostrar Porcentaje</span>
                        </label>
                    </div>

                    <div class="settings-item">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" ${pb.showCurrentAction ? 'checked' : ''}
                                   onchange="SettingsManager.updateProgressSetting('showCurrentAction', this.checked)">
                            <span>Mostrar Acción Actual</span>
                        </label>
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <button class="btn btn-primary" onclick="SettingsManager.testProgressBar()">
                            <i class="fas fa-play"></i> Probar Configuración
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar configuraciones de credenciales
    renderCredentialsSettings() {
        return `
            <div class="settings-section">
                <h3><i class="fas fa-key"></i> Gestión de Credenciales</h3>

                <div style="margin-bottom: 1.5rem;">
                    <button class="btn btn-primary btn-lg" onclick="SettingsManager.showAddCredentialModal()">
                        <i class="fas fa-plus-circle"></i> Agregar Nueva Credencial
                    </button>
                </div>

                <div class="settings-card">
                    ${this.settings.credentials.length === 0 ? `
                        <div style="text-align: center; padding: 3rem; color: #64748b;">
                            <i class="fas fa-key" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                            <p>No hay credenciales almacenadas</p>
                            <p style="font-size: 0.9rem;">Las credenciales se almacenan de forma segura y cifrada</p>
                        </div>
                    ` : `
                        <div class="credentials-list">
                            ${this.settings.credentials.map((cred, idx) => this.renderCredentialCard(cred, idx)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // Renderizar tarjeta de credencial
    renderCredentialCard(credential, index) {
        const typeIcons = {
            'database': 'fa-database',
            'api': 'fa-cloud',
            'ssh': 'fa-terminal',
            'email': 'fa-envelope',
            'ftp': 'fa-folder',
            'other': 'fa-key'
        };

        return `
            <div class="credential-card">
                <div class="credential-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <i class="fas ${typeIcons[credential.type] || 'fa-key'}" style="font-size: 2rem; color: #2563eb;"></i>
                        <div>
                            <h4 style="margin: 0; color: #e2e8f0;">${credential.name}</h4>
                            <div style="color: #94a3b8; font-size: 0.85rem;">${credential.type.toUpperCase()}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="SettingsManager.editCredential(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="SettingsManager.deleteCredential(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="credential-body">
                    <div class="credential-info">
                        <span class="credential-label">Usuario:</span>
                        <span class="credential-value">${credential.username}</span>
                    </div>
                    <div class="credential-info">
                        <span class="credential-label">Password:</span>
                        <span class="credential-value">••••••••</span>
                    </div>
                    ${credential.host ? `
                        <div class="credential-info">
                            <span class="credential-label">Host:</span>
                            <span class="credential-value">${credential.host}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Renderizar configuraciones de usuarios
    renderUsersSettings() {
        return `
            <div class="settings-section">
                <h3><i class="fas fa-users"></i> Gestión de Usuarios</h3>
                <div class="settings-card">
                    <div style="text-align: center; padding: 3rem; color: #64748b;">
                        <i class="fas fa-users-cog" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Módulo de usuarios en desarrollo</p>
                        <p style="font-size: 0.9rem;">Próximamente podrás gestionar permisos y roles</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Adjuntar listeners de tabs
    attachTabListeners() {
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Actualizar tabs activos
                document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Actualizar contenido activo
                document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`tab-${tabName}`).classList.add('active');
            });
        });
    },

    // Cambiar idioma
    changeLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        this.applyLanguage(lang);
        showNotification(`${lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English'}`, 'success');
    },

    // Actualizar configuración de barra de progreso
    updateProgressSetting(key, value) {
        this.settings.progressBar[key] = value;
        this.saveSettings();

        // Actualizar ProgressOverlay si existe
        if (typeof ProgressOverlay !== 'undefined' && ProgressOverlay.settings) {
            ProgressOverlay.settings[key] = value;
            ProgressOverlay.saveSettings();
        }

        showNotification('Configuración actualizada', 'success');
    },

    // Probar barra de progreso
    testProgressBar() {
        if (typeof ProgressOverlay !== 'undefined') {
            ProgressOverlay.show();
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                ProgressOverlay.updateProgress(progress, `Acción de prueba ${progress}%`);
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        ProgressOverlay.showComplete();
                    }, 500);
                }
            }, 300);
        }
    },

    // Mostrar modal agregar credencial
    showAddCredentialModal(editIndex = null) {
        const credential = editIndex !== null ? this.settings.credentials[editIndex] : {
            name: '',
            type: 'database',
            username: '',
            password: '',
            host: ''
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-key"></i>
                        ${editIndex !== null ? 'Editar' : 'Agregar'} Credencial
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="credentialForm" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="form-group">
                            <label>Nombre de la Credencial:</label>
                            <input type="text" id="credName" class="form-control" value="${credential.name}" required>
                        </div>

                        <div class="form-group">
                            <label>Tipo:</label>
                            <select id="credType" class="form-control">
                                <option value="database" ${credential.type === 'database' ? 'selected' : ''}>Base de Datos</option>
                                <option value="api" ${credential.type === 'api' ? 'selected' : ''}>API</option>
                                <option value="ssh" ${credential.type === 'ssh' ? 'selected' : ''}>SSH</option>
                                <option value="email" ${credential.type === 'email' ? 'selected' : ''}>Email</option>
                                <option value="ftp" ${credential.type === 'ftp' ? 'selected' : ''}>FTP</option>
                                <option value="other" ${credential.type === 'other' ? 'selected' : ''}>Otro</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Usuario:</label>
                            <input type="text" id="credUsername" class="form-control" value="${credential.username}" required>
                        </div>

                        <div class="form-group">
                            <label>Password:</label>
                            <input type="password" id="credPassword" class="form-control" value="${credential.password}" required>
                        </div>

                        <div class="form-group">
                            <label>Host/Servidor (opcional):</label>
                            <input type="text" id="credHost" class="form-control" value="${credential.host || ''}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="saveCredBtn">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        modal.querySelector('#saveCredBtn').onclick = () => {
            const form = modal.querySelector('#credentialForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const newCred = {
                id: credential.id || Date.now().toString(),
                name: modal.querySelector('#credName').value,
                type: modal.querySelector('#credType').value,
                username: modal.querySelector('#credUsername').value,
                password: modal.querySelector('#credPassword').value,
                host: modal.querySelector('#credHost').value,
                createdAt: credential.createdAt || new Date().toISOString()
            };

            if (editIndex !== null) {
                this.settings.credentials[editIndex] = newCred;
            } else {
                this.settings.credentials.push(newCred);
            }

            this.saveSettings();
            this.renderSettings();
            modal.remove();
            showNotification('Credencial guardada exitosamente', 'success');
        };
    },

    // Editar credencial
    editCredential(index) {
        this.showAddCredentialModal(index);
    },

    // Eliminar credencial
    deleteCredential(index) {
        if (confirm(`¿Eliminar la credencial "${this.settings.credentials[index].name}"?`)) {
            this.settings.credentials.splice(index, 1);
            this.saveSettings();
            this.renderSettings();
            showNotification('Credencial eliminada', 'success');
        }
    },

    // Cambiar tema
    changeTheme(theme) {
        this.settings.theme = theme;
        this.saveSettings();
        this.applyTheme(theme);

        // Actualizar botones
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });

        showNotification(`Tema cambiado a ${this.getThemeName(theme)}`, 'success');
    },

    getThemeName(theme) {
        const names = {
            dark: 'Oscuro',
            light: 'Claro',
            blue: 'Océano',
            purple: 'Púrpura',
            forest: 'Bosque'
        };
        return names[theme] || theme;
    },

    applyTheme(theme) {
        const root = document.documentElement;

        const themes = {
            dark: {
                '--dark-bg': '#0f172a',
                '--card-bg': '#1e293b',
                '--border-color': '#334155',
                '--text-primary': '#f1f5f9',
                '--text-secondary': '#cbd5e1',
                '--hover-bg': '#475569'
            },
            light: {
                '--dark-bg': '#f8fafc',
                '--card-bg': '#ffffff',
                '--border-color': '#e2e8f0',
                '--text-primary': '#1e293b',
                '--text-secondary': '#475569',
                '--hover-bg': '#cbd5e1'
            },
            blue: {
                '--dark-bg': '#0c4a6e',
                '--card-bg': '#075985',
                '--border-color': '#0e7490',
                '--text-primary': '#f0f9ff',
                '--text-secondary': '#bae6fd',
                '--hover-bg': '#0e7490'
            },
            purple: {
                '--dark-bg': '#581c87',
                '--card-bg': '#6b21a8',
                '--border-color': '#7c3aed',
                '--text-primary': '#faf5ff',
                '--text-secondary': '#e9d5ff',
                '--hover-bg': '#7c3aed'
            },
            forest: {
                '--dark-bg': '#14532d',
                '--card-bg': '#166534',
                '--border-color': '#16a34a',
                '--text-primary': '#f0fdf4',
                '--text-secondary': '#bbf7d0',
                '--hover-bg': '#16a34a'
            }
        };

        const selectedTheme = themes[theme] || themes.dark;
        Object.keys(selectedTheme).forEach(key => {
            root.style.setProperty(key, selectedTheme[key]);
        });

        // Cambiar body background
        if (theme === 'light') {
            document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        } else {
            document.body.style.background = `linear-gradient(135deg, ${selectedTheme['--dark-bg']} 0%, ${selectedTheme['--card-bg']} 100%)`;
        }
    },

    applyLanguage(lang) {
        const t = this.translations[lang] || this.translations.es;

        // Actualizar textos de navegación
        const navItems = document.querySelectorAll('.nav-item span');
        const mapping = {
            'Element Spy': t.elementSpy,
            'Grabador': t.recorder,
            'Workflows': t.workflows,
            'Ejecutor': t.executor,
            'Agentes': t.agents,
            'MCP Conectores': t.mcpConnectors,
            'Biblioteca': t.library,
            'IA Dashboard': t.iaDashboard,
            'Configuraciones': t.settings
        };

        navItems.forEach(item => {
            const originalText = item.textContent.trim();
            if (mapping[originalText]) {
                item.textContent = mapping[originalText];
            }
        });

        // Actualizar status
        const statusText = document.querySelector('#serverStatus span');
        if (statusText) {
            const isConnected = statusText.parentElement.classList.contains('connected');
            statusText.textContent = isConnected ? t.connected : t.disconnected;
        }
    },

    updateNotification(key, value) {
        this.settings.notifications[key] = value;
        this.saveSettings();
        showNotification('Preferencia de notificaciones actualizada', 'success');
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SettingsManager.init());
} else {
    SettingsManager.init();
}
