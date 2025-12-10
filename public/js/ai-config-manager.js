// 🤖 GESTOR DE CONFIGURACIÓN DE IA/OCR
// Permite configurar y cambiar entre diferentes proveedores de IA

const AIConfigManager = {
    currentConfig: null,

    // Proveedores disponibles
    providers: {
        claude: {
            id: 'claude',
            name: 'Claude (Anthropic)',
            icon: '🧠',
            color: '#D4A574',
            description: 'Claude 3.5 Sonnet - Excelente para análisis de documentos y extracción estructurada',
            capabilities: ['OCR', 'Análisis de documentos', 'Extracción de campos', 'Visión de imágenes'],
            fields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-ant-...' },
                { name: 'model', label: 'Modelo', type: 'select', required: true, options: [
                    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Recomendado)' },
                    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Más potente)' },
                    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Más rápido)' }
                ]},
                { name: 'maxTokens', label: 'Max Tokens', type: 'number', required: false, default: 4096, placeholder: '4096' }
            ],
            testEndpoint: 'https://api.anthropic.com/v1/messages',
            docsUrl: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api'
        },
        openai: {
            id: 'openai',
            name: 'OpenAI GPT-4 Vision',
            icon: '🎯',
            color: '#10A37F',
            description: 'GPT-4 Vision - Excelente para OCR y análisis visual de documentos',
            capabilities: ['OCR', 'Visión de imágenes', 'Análisis de documentos', 'Extracción de datos'],
            fields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-...' },
                { name: 'model', label: 'Modelo', type: 'select', required: true, options: [
                    { value: 'gpt-4o', label: 'GPT-4o (Recomendado)' },
                    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                    { value: 'gpt-4-vision-preview', label: 'GPT-4 Vision Preview' }
                ]},
                { name: 'maxTokens', label: 'Max Tokens', type: 'number', required: false, default: 4096, placeholder: '4096' }
            ],
            testEndpoint: 'https://api.openai.com/v1/chat/completions',
            docsUrl: 'https://platform.openai.com/docs/guides/vision'
        },
        google: {
            id: 'google',
            name: 'Google Cloud Vision',
            icon: '🔍',
            color: '#4285F4',
            description: 'Google Cloud Vision API - OCR especializado con alta precisión',
            capabilities: ['OCR avanzado', 'Detección de texto', 'Análisis de documentos', 'Reconocimiento de formularios'],
            fields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'AIza...' },
                { name: 'projectId', label: 'Project ID', type: 'text', required: false, placeholder: 'my-project-id' }
            ],
            testEndpoint: 'https://vision.googleapis.com/v1/images:annotate',
            docsUrl: 'https://cloud.google.com/vision/docs/ocr'
        },
        azure: {
            id: 'azure',
            name: 'Azure Document Intelligence',
            icon: '☁️',
            color: '#0078D4',
            description: 'Azure AI Document Intelligence - Especializado en formularios y facturas',
            capabilities: ['OCR', 'Análisis de formularios', 'Extracción de tablas', 'Modelos preentrenados'],
            fields: [
                { name: 'endpoint', label: 'Endpoint', type: 'text', required: true, placeholder: 'https://xxx.cognitiveservices.azure.com/' },
                { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
                { name: 'model', label: 'Modelo', type: 'select', required: true, options: [
                    { value: 'prebuilt-invoice', label: 'Facturas (Prebuilt)' },
                    { value: 'prebuilt-receipt', label: 'Recibos (Prebuilt)' },
                    { value: 'prebuilt-layout', label: 'Layout General' },
                    { value: 'prebuilt-document', label: 'Documento General' }
                ]}
            ],
            testEndpoint: null,
            docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/'
        },
        tesseract: {
            id: 'tesseract',
            name: 'Tesseract OCR (Local/Gratuito)',
            icon: '📝',
            color: '#38BDF8',
            description: 'Tesseract.js - OCR local gratuito, ideal para textos simples',
            capabilities: ['OCR básico', 'Procesamiento local', 'Sin costo', 'Múltiples idiomas'],
            fields: [
                { name: 'language', label: 'Idioma', type: 'select', required: true, options: [
                    { value: 'spa', label: 'Español' },
                    { value: 'eng', label: 'Inglés' },
                    { value: 'fra', label: 'Francés' },
                    { value: 'deu', label: 'Alemán' }
                ]},
                { name: 'psm', label: 'Page Segmentation Mode', type: 'select', required: false, options: [
                    { value: '3', label: 'Auto (Recomendado)' },
                    { value: '6', label: 'Bloque de texto uniforme' },
                    { value: '11', label: 'Texto disperso' }
                ]}
            ],
            testEndpoint: null,
            docsUrl: 'https://tesseract.projectnaptha.com/'
        }
    },

    // Inicializar
    async init() {
        await this.loadConfig();
        console.log('✅ AI Config Manager initialized');
    },

    // Cargar configuración guardada
    async loadConfig() {
        try {
            const saved = localStorage.getItem('ai_ocr_config');
            if (saved) {
                this.currentConfig = JSON.parse(saved);
                console.log('📝 Configuración cargada:', this.currentConfig.provider);
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
        }
    },

    // Guardar configuración
    async saveConfig(config) {
        try {
            this.currentConfig = config;
            localStorage.setItem('ai_ocr_config', JSON.stringify(config));

            // También guardar en servidor
            await fetch('/api/ai-config/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            showNotification('Configuración guardada correctamente', 'success');
            return true;
        } catch (error) {
            console.error('Error guardando configuración:', error);
            showNotification('Error guardando configuración: ' + error.message, 'error');
            return false;
        }
    },

    // Abrir wizard de configuración
    openConfigWizard() {
        const modal = this.createConfigModal();
        document.body.appendChild(modal);

        // Seleccionar proveedor actual si existe
        if (this.currentConfig?.provider) {
            this.selectProvider(this.currentConfig.provider);
        }
    },

    // Crear modal de configuración
    createConfigModal() {
        const modal = document.createElement('div');
        modal.id = 'aiConfigModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow: auto;">
                <div class="wizard-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; color: white; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 0 -1.5rem;">
                    <span class="close" onclick="AIConfigManager.closeConfigWizard()" style="color: white; opacity: 0.9;">&times;</span>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <i class="fas fa-cog" style="font-size: 2.5rem;"></i>
                        <div>
                            <h2 style="margin: 0; font-size: 1.75rem;">Configuración de IA/OCR</h2>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Configura el proveedor de inteligencia artificial para análisis de documentos</p>
                        </div>
                    </div>
                </div>

                <div class="wizard-body" style="padding: 2rem;">
                    <!-- Selector de Proveedor -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: #e2e8f0; margin-bottom: 1rem;">
                            <i class="fas fa-robot"></i> Selecciona tu Proveedor de IA
                        </h3>

                        <div id="providerSelector" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                            ${Object.values(this.providers).map(provider => this.renderProviderCard(provider)).join('')}
                        </div>
                    </div>

                    <!-- Formulario de Configuración -->
                    <div id="providerConfigForm" style="display: none;">
                        <h3 style="color: #e2e8f0; margin-bottom: 1rem;">
                            <i class="fas fa-sliders-h"></i> Configuración
                        </h3>

                        <div id="configFields"></div>

                        <!-- Botón de prueba -->
                        <div style="margin-top: 2rem; padding: 1.5rem; background: #1e293b; border-radius: 8px;">
                            <h4 style="color: #e2e8f0; margin-top: 0;">
                                <i class="fas fa-vial"></i> Probar Conexión
                            </h4>
                            <button class="btn btn-secondary" onclick="AIConfigManager.testConnection()" style="width: 100%;">
                                <i class="fas fa-plug"></i> Probar Configuración
                            </button>
                            <div id="testResult" style="margin-top: 1rem; display: none;"></div>
                        </div>
                    </div>

                    <!-- Información de Configuración Actual -->
                    ${this.currentConfig ? `
                        <div style="margin-top: 2rem; padding: 1.5rem; background: #1e3a5f; border-left: 4px solid #3b82f6; border-radius: 4px;">
                            <h4 style="margin-top: 0; color: #e2e8f0;">
                                <i class="fas fa-info-circle"></i> Configuración Actual
                            </h4>
                            <p style="color: #cbd5e1; margin: 0;">
                                Proveedor: <strong>${this.providers[this.currentConfig.provider]?.name}</strong>
                            </p>
                        </div>
                    ` : ''}
                </div>

                <div class="wizard-footer" style="padding: 1.5rem; border-top: 1px solid #334155; display: flex; justify-content: space-between; margin: 0 -1.5rem -1.5rem -1.5rem; background: #1e293b; border-radius: 0 0 8px 8px;">
                    <button class="btn btn-secondary" onclick="AIConfigManager.closeConfigWizard()">
                        Cancelar
                    </button>
                    <button class="btn btn-success" id="btnSaveConfig" onclick="AIConfigManager.saveCurrentConfig()" disabled>
                        <i class="fas fa-save"></i> Guardar Configuración
                    </button>
                </div>
            </div>
        `;

        return modal;
    },

    // Renderizar tarjeta de proveedor
    renderProviderCard(provider) {
        const isSelected = this.currentConfig?.provider === provider.id;

        return `
            <div class="provider-card ${isSelected ? 'selected' : ''}"
                 data-provider="${provider.id}"
                 onclick="AIConfigManager.selectProvider('${provider.id}')"
                 style="
                    background: ${isSelected ? provider.color + '20' : '#0f172a'};
                    border: 2px solid ${isSelected ? provider.color : '#334155'};
                    border-radius: 12px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                 "
                 onmouseenter="this.style.borderColor='${provider.color}'; this.style.transform='translateY(-3px)'"
                 onmouseleave="if(!this.classList.contains('selected')) this.style.borderColor='#334155'; this.style.transform='translateY(0)'">

                ${isSelected ? '<div style="position: absolute; top: 10px; right: 10px; color: ' + provider.color + ';"><i class="fas fa-check-circle"></i></div>' : ''}

                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${provider.icon}</div>
                <h4 style="color: #e2e8f0; margin: 0.5rem 0; font-size: 1rem;">${provider.name}</h4>
                <p style="color: #94a3b8; font-size: 0.85rem; margin: 0.5rem 0;">${provider.description}</p>

                <div style="margin-top: 1rem;">
                    ${provider.capabilities.slice(0, 3).map(cap => `
                        <div style="color: #cbd5e1; font-size: 0.75rem; margin: 0.25rem 0;">
                            <i class="fas fa-check" style="color: ${provider.color}; margin-right: 0.5rem;"></i>${cap}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Seleccionar proveedor
    selectProvider(providerId) {
        const provider = this.providers[providerId];
        if (!provider) return;

        // Actualizar UI
        document.querySelectorAll('.provider-card').forEach(card => {
            card.classList.remove('selected');
            card.style.background = '#0f172a';
            card.style.borderColor = '#334155';
        });

        const selectedCard = document.querySelector(`[data-provider="${providerId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            selectedCard.style.background = provider.color + '20';
            selectedCard.style.borderColor = provider.color;
        }

        // Mostrar formulario de configuración
        this.renderConfigForm(provider);
    },

    // Renderizar formulario de configuración
    renderConfigForm(provider) {
        const formContainer = document.getElementById('providerConfigForm');
        const fieldsContainer = document.getElementById('configFields');

        formContainer.style.display = 'block';

        let fieldsHTML = `
            <div style="background: linear-gradient(135deg, ${provider.color}20, ${provider.color}10); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid ${provider.color}40;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="font-size: 2.5rem;">${provider.icon}</div>
                    <div>
                        <h4 style="margin: 0; color: #e2e8f0;">${provider.name}</h4>
                        <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.9rem;">${provider.description}</p>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${provider.capabilities.map(cap => `
                        <span style="background: ${provider.color}30; color: #e2e8f0; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">
                            ${cap}
                        </span>
                    `).join('')}
                </div>

                ${provider.docsUrl ? `
                    <div style="margin-top: 1rem;">
                        <a href="${provider.docsUrl}" target="_blank" style="color: ${provider.color}; text-decoration: none; font-size: 0.9rem;">
                            <i class="fas fa-book"></i> Ver documentación
                        </a>
                    </div>
                ` : ''}
            </div>

            <form id="configForm" onsubmit="return false;">
        `;

        // Renderizar campos del formulario
        provider.fields.forEach(field => {
            fieldsHTML += `
                <div class="form-group">
                    <label style="color: #e2e8f0; font-weight: 500; margin-bottom: 0.5rem; display: block;">
                        ${field.label} ${field.required ? '<span style="color: #ef4444;">*</span>' : ''}
                    </label>
                    ${this.renderFormField(field, provider)}
                    ${field.placeholder ? `<small style="color: #64748b; font-size: 0.85rem;">${field.placeholder}</small>` : ''}
                </div>
            `;
        });

        fieldsHTML += '</form>';

        fieldsContainer.innerHTML = fieldsHTML;

        // Habilitar botón de guardar
        document.getElementById('btnSaveConfig').disabled = false;

        // Si hay configuración previa, rellenar campos
        if (this.currentConfig?.provider === provider.id) {
            this.fillFormWithConfig(this.currentConfig);
        }
    },

    // Renderizar campo de formulario
    renderFormField(field, provider) {
        const value = this.currentConfig?.config?.[field.name] || field.default || '';

        switch (field.type) {
            case 'password':
                return `<input type="password" name="${field.name}" class="form-control"
                              placeholder="${field.placeholder || ''}"
                              ${field.required ? 'required' : ''}
                              value="${value}">`;

            case 'select':
                return `
                    <select name="${field.name}" class="form-control" ${field.required ? 'required' : ''}>
                        ${field.options.map(opt => `
                            <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                                ${opt.label}
                            </option>
                        `).join('')}
                    </select>
                `;

            case 'number':
                return `<input type="number" name="${field.name}" class="form-control"
                              placeholder="${field.placeholder || ''}"
                              ${field.required ? 'required' : ''}
                              value="${value}">`;

            default: // text
                return `<input type="text" name="${field.name}" class="form-control"
                              placeholder="${field.placeholder || ''}"
                              ${field.required ? 'required' : ''}
                              value="${value}">`;
        }
    },

    // Rellenar formulario con configuración existente
    fillFormWithConfig(config) {
        const form = document.getElementById('configForm');
        if (!form || !config.config) return;

        Object.keys(config.config).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = config.config[key];
            }
        });
    },

    // Probar conexión
    async testConnection() {
        const selectedProvider = document.querySelector('.provider-card.selected');
        if (!selectedProvider) {
            showNotification('Selecciona un proveedor primero', 'warning');
            return;
        }

        const providerId = selectedProvider.dataset.provider;
        const provider = this.providers[providerId];
        const form = document.getElementById('configForm');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const config = {};
        formData.forEach((value, key) => config[key] = value);

        const testResult = document.getElementById('testResult');
        testResult.style.display = 'block';
        testResult.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <div class="spinner" style="border: 3px solid #475569; border-top: 3px solid ${provider.color}; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="color: #94a3b8; margin-top: 1rem;">Probando conexión...</p>
            </div>
        `;

        try {
            const result = await this.testProviderConnection(providerId, config);

            if (result.success) {
                testResult.innerHTML = `
                    <div style="background: #10b98120; border: 1px solid #10b981; padding: 1rem; border-radius: 8px;">
                        <i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.5rem;"></i>
                        <span style="color: #10b981; font-weight: 600;">Conexión exitosa</span>
                        ${result.details ? `<p style="color: #cbd5e1; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${result.details}</p>` : ''}
                    </div>
                `;
            } else {
                testResult.innerHTML = `
                    <div style="background: #ef444420; border: 1px solid #ef4444; padding: 1rem; border-radius: 8px;">
                        <i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 0.5rem;"></i>
                        <span style="color: #ef4444; font-weight: 600;">Error de conexión</span>
                        <p style="color: #cbd5e1; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${result.error}</p>
                    </div>
                `;
            }
        } catch (error) {
            testResult.innerHTML = `
                <div style="background: #ef444420; border: 1px solid #ef4444; padding: 1rem; border-radius: 8px;">
                    <i class="fas fa-exclamation-circle" style="color: #ef4444; margin-right: 0.5rem;"></i>
                    <span style="color: #ef4444; font-weight: 600;">Error</span>
                    <p style="color: #cbd5e1; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${error.message}</p>
                </div>
            `;
        }
    },

    // Probar conexión con proveedor
    async testProviderConnection(providerId, config) {
        try {
            const response = await fetch('/api/ai-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: providerId, config })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Guardar configuración actual
    async saveCurrentConfig() {
        const selectedProvider = document.querySelector('.provider-card.selected');
        if (!selectedProvider) {
            showNotification('Selecciona un proveedor primero', 'warning');
            return;
        }

        const providerId = selectedProvider.dataset.provider;
        const form = document.getElementById('configForm');

        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const config = {};
        formData.forEach((value, key) => config[key] = value);

        const configData = {
            provider: providerId,
            config: config,
            updatedAt: new Date().toISOString()
        };

        const saved = await this.saveConfig(configData);
        if (saved) {
            this.closeConfigWizard();
        }
    },

    // Cerrar wizard
    closeConfigWizard() {
        const modal = document.getElementById('aiConfigModal');
        if (modal) modal.remove();
    },

    // Obtener configuración actual
    getConfig() {
        return this.currentConfig;
    },

    // Verificar si está configurado
    isConfigured() {
        return this.currentConfig !== null && this.currentConfig.provider !== null;
    }
};

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIConfigManager.init());
} else {
    AIConfigManager.init();
}
