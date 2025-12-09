// 🤖 GENERADOR DE COMPONENTES CON IA
// Sistema para crear componentes automáticamente mediante prompts

const ComponentGenerator = {
    generatedComponents: [],

    init() {
        this.loadGeneratedComponents();
        console.log('ComponentGenerator initialized');
    },

    loadGeneratedComponents() {
        const saved = localStorage.getItem('generated_components');
        if (saved) {
            try {
                this.generatedComponents = JSON.parse(saved);
                this.registerComponents();
            } catch (e) {
                console.error('Error loading generated components:', e);
            }
        }
    },

    saveGeneratedComponents() {
        localStorage.setItem('generated_components', JSON.stringify(this.generatedComponents));

        // Disparar evento para que ComponentIntegrator actualice
        document.dispatchEvent(new Event('componentsUpdated'));
    },

    // Mostrar modal para generar componente
    showGeneratorModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-magic"></i>
                        Generar Componente con IA
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label><i class="fas fa-comment-alt"></i> Describe el componente que necesitas *</label>
                        <textarea id="componentPrompt" class="form-control" rows="4"
                                  placeholder="Ejemplo: Quiero un componente que envíe mensajes de WhatsApp. Debe tener campos para número de teléfono, mensaje, y opción para adjuntar imagen."></textarea>
                        <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                            Sé específico sobre qué hace el componente, qué campos necesita y a qué categoría pertenece.
                        </small>
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-tag"></i> Nombre del Componente (opcional)</label>
                        <input type="text" id="componentName" class="form-control"
                               placeholder="Se generará automáticamente si se deja vacío">
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-folder"></i> Categoría Sugerida</label>
                        <select id="componentCategory" class="form-control">
                            <option value="auto">🤖 Auto-detectar</option>
                            <option value="web">🌐 Acciones Web</option>
                            <option value="windows">🪟 Acciones Windows</option>
                            <option value="excel">📊 Excel</option>
                            <option value="files">📁 Archivos</option>
                            <option value="data">💾 Data Processing</option>
                            <option value="flow">🔀 Control de Flujo</option>
                            <option value="mcp">🔌 MCP Connectors</option>
                            <option value="custom">⚙️ Personalizado</option>
                        </select>
                    </div>

                    <div id="generationProgress" style="display: none; margin-top: 1rem;">
                        <div style="background: rgba(37, 99, 235, 0.1); border: 1px solid #2563eb; border-radius: 8px; padding: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem; color: #2563eb;">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span id="progressText">Analizando descripción...</span>
                            </div>
                        </div>
                    </div>

                    <div id="generationResult" style="display: none; margin-top: 1rem;"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="ComponentGenerator.generateComponent()">
                        <i class="fas fa-magic"></i> Generar Componente
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
    },

    // Generar componente basado en prompt
    async generateComponent() {
        const prompt = document.getElementById('componentPrompt').value.trim();
        const name = document.getElementById('componentName').value.trim();
        const category = document.getElementById('componentCategory').value;

        if (!prompt) {
            showNotification('Por favor describe el componente que necesitas', 'error');
            return;
        }

        const progressDiv = document.getElementById('generationProgress');
        const resultDiv = document.getElementById('generationResult');
        const progressText = document.getElementById('progressText');

        progressDiv.style.display = 'block';
        resultDiv.style.display = 'none';

        try {
            // Paso 1: Analizar descripción
            progressText.textContent = 'Analizando descripción...';
            await this.delay(800);

            // Paso 2: Generar estructura
            progressText.textContent = 'Generando estructura del componente...';
            const component = await this.analyzeAndGenerate(prompt, name, category);
            await this.delay(600);

            // Paso 3: Crear propiedades
            progressText.textContent = 'Creando propiedades y configuración...';
            await this.delay(500);

            // Paso 4: Registrar componente
            progressText.textContent = 'Registrando componente...';
            this.generatedComponents.push(component);
            this.saveGeneratedComponents();
            this.registerComponent(component);
            await this.delay(400);

            // Mostrar resultado
            progressDiv.style.display = 'none';
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; padding: 1.5rem; color: white;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle" style="font-size: 2.5rem;"></i>
                        <div>
                            <h3 style="margin: 0; font-size: 1.3rem;">¡Componente Generado!</h3>
                            <p style="margin: 0.25rem 0 0 0; opacity: 0.9;">El componente ha sido creado exitosamente</p>
                        </div>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 1rem; margin-top: 1rem;">
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.75rem; font-size: 0.95rem;">
                            <strong>Nombre:</strong><span>${component.title}</span>
                            <strong>ID:</strong><span>${component.id}</span>
                            <strong>Categoría:</strong><span>${this.getCategoryName(component.category)}</span>
                            <strong>Propiedades:</strong><span>${component.properties.length} campos</span>
                        </div>
                    </div>
                </div>
            `;

            showNotification(`Componente "${component.title}" creado exitosamente`, 'success');

            // Cerrar modal después de 3 segundos
            setTimeout(() => {
                document.querySelector('.modal-overlay').remove();
                // Actualizar la vista de workflows si está activa
                if (typeof WorkflowEditor !== 'undefined') {
                    WorkflowEditor.renderPalette();
                }
            }, 3000);

        } catch (error) {
            progressDiv.style.display = 'none';
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 1rem; color: #ef4444;">
                    <strong><i class="fas fa-exclamation-triangle"></i> Error:</strong> ${error.message}
                </div>
            `;
        }
    },

    // Analizar prompt y generar estructura del componente
    async analyzeAndGenerate(prompt, customName, category) {
        // Detectar categoría automáticamente si es "auto"
        const detectedCategory = category === 'auto' ? this.detectCategory(prompt) : category;

        // Generar nombre del componente
        const componentName = customName || this.generateComponentName(prompt, detectedCategory);

        // Generar ID único
        const componentId = this.generateComponentId(componentName, detectedCategory);

        // Extraer propiedades del prompt
        const properties = this.extractProperties(prompt);

        // Detectar icono apropiado
        const icon = this.detectIcon(prompt, detectedCategory);

        return {
            id: componentId,
            title: componentName,
            icon: icon,
            category: detectedCategory,
            properties: properties,
            description: prompt,
            generatedAt: new Date().toISOString(),
            prompt: prompt
        };
    },

    // Detectar categoría basada en palabras clave
    detectCategory(prompt) {
        const lower = prompt.toLowerCase();

        const categories = {
            web: ['navegador', 'browser', 'click', 'web', 'url', 'página', 'internet', 'http', 'sitio'],
            windows: ['ventana', 'window', 'aplicación', 'app', 'ejecutar', 'proceso', 'desktop'],
            excel: ['excel', 'hoja', 'celda', 'fila', 'columna', 'xlsx', 'spreadsheet'],
            files: ['archivo', 'file', 'carpeta', 'folder', 'directorio', 'guardar', 'leer'],
            data: ['base de datos', 'database', 'sql', 'query', 'tabla', 'registro'],
            flow: ['condición', 'if', 'loop', 'repetir', 'while', 'esperar', 'delay'],
            mcp: ['api', 'servicio', 'integración', 'conector', 'webhook', 'rest']
        };

        for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lower.includes(keyword))) {
                return cat;
            }
        }

        return 'custom';
    },

    // Generar nombre del componente
    generateComponentName(prompt, category) {
        const lower = prompt.toLowerCase();

        // Intentar extraer el verbo principal y objeto
        const actionWords = ['enviar', 'crear', 'leer', 'escribir', 'obtener', 'buscar', 'eliminar',
                            'actualizar', 'abrir', 'cerrar', 'ejecutar', 'procesar', 'validar'];

        let action = 'Acción';
        for (const word of actionWords) {
            if (lower.includes(word)) {
                action = word.charAt(0).toUpperCase() + word.slice(1);
                break;
            }
        }

        // Extraer objeto (sustantivo)
        const objectWords = ['whatsapp', 'email', 'archivo', 'datos', 'mensaje', 'imagen',
                            'documento', 'texto', 'número', 'celda', 'ventana'];

        let object = '';
        for (const word of objectWords) {
            if (lower.includes(word)) {
                object = word.charAt(0).toUpperCase() + word.slice(1);
                break;
            }
        }

        if (object) {
            return `${action} ${object}`;
        }

        return `${this.getCategoryPrefix(category)}: ${action}`;
    },

    // Generar ID único del componente
    generateComponentId(name, category) {
        const prefix = category === 'custom' ? 'custom' : category;
        const slug = name.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

        return `${prefix}_${slug}_${Date.now().toString(36)}`;
    },

    // Extraer propiedades del prompt usando IA
    extractProperties(prompt) {
        const properties = [];
        const lower = prompt.toLowerCase();

        // Propiedades comunes detectadas por palabras clave
        const propertyPatterns = [
            { keywords: ['número', 'telefono', 'phone'], prop: { name: 'phoneNumber', label: 'Número de Teléfono', type: 'text', required: true, placeholder: '+521234567890' }},
            { keywords: ['mensaje', 'message', 'texto'], prop: { name: 'message', label: 'Mensaje', type: 'textarea', required: true, placeholder: 'Escribe tu mensaje...' }},
            { keywords: ['email', 'correo'], prop: { name: 'email', label: 'Email', type: 'text', required: true, placeholder: 'ejemplo@email.com' }},
            { keywords: ['archivo', 'file', 'ruta', 'path'], prop: { name: 'filePath', label: 'Ruta del Archivo', type: 'text_or_variable', required: true, placeholder: 'C:/ruta/archivo.ext' }},
            { keywords: ['imagen', 'image', 'foto', 'photo'], prop: { name: 'imagePath', label: 'Ruta de Imagen', type: 'text_or_variable', required: false, placeholder: 'C:/imagen.jpg' }},
            { keywords: ['url', 'link', 'enlace'], prop: { name: 'url', label: 'URL', type: 'text', required: true, placeholder: 'https://ejemplo.com' }},
            { keywords: ['usuario', 'username', 'user'], prop: { name: 'username', label: 'Usuario', type: 'text', required: true }},
            { keywords: ['contraseña', 'password', 'clave'], prop: { name: 'password', label: 'Contraseña', type: 'password', required: true }},
            { keywords: ['nombre', 'name'], prop: { name: 'name', label: 'Nombre', type: 'text', required: true }},
            { keywords: ['descripción', 'description'], prop: { name: 'description', label: 'Descripción', type: 'textarea', required: false }},
            { keywords: ['timeout', 'espera', 'tiempo'], prop: { name: 'timeout', label: 'Timeout (segundos)', type: 'number', default: 30 }},
            { keywords: ['variable', 'guardar en', 'resultado'], prop: { name: 'resultVariable', label: 'Variable para Resultado', type: 'text', required: true, placeholder: 'nombreVariable' }}
        ];

        // Detectar propiedades basadas en el prompt
        propertyPatterns.forEach(pattern => {
            if (pattern.keywords.some(keyword => lower.includes(keyword))) {
                // Evitar duplicados
                if (!properties.find(p => p.name === pattern.prop.name)) {
                    properties.push({ ...pattern.prop });
                }
            }
        });

        // Si no se detectaron propiedades, agregar algunas por defecto
        if (properties.length === 0) {
            properties.push(
                { name: 'value', label: 'Valor', type: 'text', required: true, placeholder: 'Ingresa el valor' },
                { name: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Descripción opcional' }
            );
        }

        // Siempre agregar una propiedad de resultado si no existe
        if (!properties.find(p => p.name === 'resultVariable')) {
            properties.push({
                name: 'resultVariable',
                label: 'Variable para Resultado (opcional)',
                type: 'text',
                placeholder: 'nombreVariable'
            });
        }

        return properties;
    },

    // Detectar icono apropiado
    detectIcon(prompt, category) {
        const lower = prompt.toLowerCase();

        const iconMap = {
            'whatsapp': 'fa-whatsapp',
            'email': 'fa-envelope',
            'mensaje': 'fa-comment',
            'archivo': 'fa-file',
            'imagen': 'fa-image',
            'datos': 'fa-database',
            'web': 'fa-globe',
            'api': 'fa-plug',
            'excel': 'fa-file-excel',
            'pdf': 'fa-file-pdf',
            'descargar': 'fa-download',
            'subir': 'fa-upload',
            'buscar': 'fa-search',
            'validar': 'fa-check-circle',
            'enviar': 'fa-paper-plane',
            'crear': 'fa-plus-circle',
            'eliminar': 'fa-trash',
            'editar': 'fa-edit'
        };

        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (lower.includes(keyword)) {
                return icon;
            }
        }

        // Iconos por categoría por defecto
        const categoryIcons = {
            web: 'fa-globe',
            windows: 'fa-window-maximize',
            excel: 'fa-file-excel',
            files: 'fa-folder',
            data: 'fa-database',
            flow: 'fa-random',
            mcp: 'fa-plug',
            custom: 'fa-cog'
        };

        return categoryIcons[category] || 'fa-cog';
    },

    getCategoryName(category) {
        const names = {
            web: '🌐 Acciones Web',
            windows: '🪟 Acciones Windows',
            excel: '📊 Excel',
            files: '📁 Archivos',
            data: '💾 Data Processing',
            flow: '🔀 Control de Flujo',
            mcp: '🔌 MCP Connectors',
            custom: '⚙️ Personalizado'
        };
        return names[category] || 'Custom';
    },

    getCategoryPrefix(category) {
        const prefixes = {
            web: 'Web',
            windows: 'Windows',
            excel: 'Excel',
            files: 'File',
            data: 'Data',
            flow: 'Flow',
            mcp: 'MCP',
            custom: 'Custom'
        };
        return prefixes[category] || 'Custom';
    },

    // Registrar todos los componentes generados
    registerComponents() {
        this.generatedComponents.forEach(component => {
            this.registerComponent(component);
        });
    },

    // Registrar un componente individual
    registerComponent(component) {
        // Agregar a MCPProperties
        if (typeof MCPProperties !== 'undefined') {
            MCPProperties[component.id] = {
                title: component.title,
                icon: component.icon,
                properties: component.properties
            };
        }

        // Agregar al palette si WorkflowEditor existe
        if (typeof WorkflowEditor !== 'undefined') {
            // Se actualizará cuando se renderice el palette
        }
    },

    // Obtener todos los componentes (nativos + generados)
    getAllComponents() {
        const native = Object.keys(MCPProperties || {}).map(id => ({
            id,
            title: MCPProperties[id].title,
            icon: MCPProperties[id].icon,
            category: this.detectCategoryById(id)
        }));

        return [...native, ...this.generatedComponents];
    },

    detectCategoryById(id) {
        if (id.startsWith('web_')) return 'web';
        if (id.startsWith('windows_')) return 'windows';
        if (id.startsWith('excel_')) return 'excel';
        if (id.startsWith('file_')) return 'files';
        if (id.startsWith('data_')) return 'data';
        if (id.startsWith('flow_')) return 'flow';
        if (id.startsWith('mcp_') || id.startsWith('sat_') || id.startsWith('anticaptcha_')) return 'mcp';
        return 'custom';
    },

    // Listar componentes generados
    showGeneratedComponents() {
        if (this.generatedComponents.length === 0) {
            showNotification('No hay componentes generados todavía', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-list"></i>
                        Componentes Generados (${this.generatedComponents.length})
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div style="display: grid; gap: 1rem;">
                        ${this.generatedComponents.map((comp, index) => `
                            <div style="background: linear-gradient(135deg, #1e293b, #334155); border: 1px solid #475569; border-radius: 8px; padding: 1rem;">
                                <div style="display: flex; align-items: start; gap: 1rem;">
                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <i class="fas ${comp.icon}" style="font-size: 1.5rem; color: white;"></i>
                                    </div>
                                    <div style="flex: 1; min-width: 0;">
                                        <h4 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1.1rem;">
                                            ${comp.title}
                                            <span style="background: #2563eb; color: white; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; margin-left: 0.5rem;">
                                                ${this.getCategoryName(comp.category)}
                                            </span>
                                        </h4>
                                        <p style="margin: 0 0 0.75rem 0; color: #94a3b8; font-size: 0.9rem; line-height: 1.4;">
                                            ${comp.description}
                                        </p>
                                        <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: #64748b;">
                                            <span><i class="fas fa-code"></i> ID: <code style="color: #94a3b8;">${comp.id}</code></span>
                                            <span><i class="fas fa-list"></i> ${comp.properties.length} propiedades</span>
                                            <span><i class="fas fa-clock"></i> ${new Date(comp.generatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-sm btn-danger" onclick="ComponentGenerator.deleteComponent(${index})" title="Eliminar componente">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    },

    // Eliminar componente generado
    deleteComponent(index) {
        if (confirm(`¿Eliminar el componente "${this.generatedComponents[index].title}"?`)) {
            const component = this.generatedComponents[index];

            // Eliminar de MCPProperties
            if (typeof MCPProperties !== 'undefined' && MCPProperties[component.id]) {
                delete MCPProperties[component.id];
            }

            // Eliminar de la lista
            this.generatedComponents.splice(index, 1);
            this.saveGeneratedComponents();

            // Cerrar modal y actualizar
            document.querySelector('.modal-overlay').remove();
            showNotification('Componente eliminado', 'success');

            // Actualizar palette
            if (typeof WorkflowEditor !== 'undefined') {
                WorkflowEditor.renderPalette();
            }
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ComponentGenerator.init());
} else {
    ComponentGenerator.init();
}
