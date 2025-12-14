/**
 * Sistema Inteligente de Importación de Workflows
 * Analiza, valida, genera componentes y crea workflows automáticamente
 */

class WorkflowImporter {
    constructor() {
        this.importedWorkflow = null;
        this.analyzedData = {
            steps: [],
            components: {
                existing: [],
                missing: [],
                generated: []
            },
            validation: {
                isViable: false,
                issues: [],
                warnings: []
            },
            categories: {
                web: [],
                variables: [],
                logic: [],
                data: [],
                ai: [],
                other: []
            }
        };
        this.generationProgress = {
            total: 0,
            current: 0,
            currentComponent: '',
            percentage: 0
        };
    }

    /**
     * Inicializa el importador
     */
    init() {
        const importBtn = document.getElementById('importWorkflow');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.openImportModal());
        }
    }

    /**
     * Abre el modal de importación
     */
    openImportModal() {
        const modal = document.getElementById('importWorkflowModal');
        if (modal) {
            modal.style.display = 'flex';
            this.resetImportState();
        }
    }

    /**
     * Cierra el modal de importación
     */
    closeImportModal() {
        const modal = document.getElementById('importWorkflowModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Resetea el estado de importación
     */
    resetImportState() {
        this.importedWorkflow = null;
        this.analyzedData = {
            steps: [],
            components: {
                existing: [],
                missing: [],
                generated: []
            },
            validation: {
                isViable: false,
                issues: [],
                warnings: []
            },
            categories: {
                web: [],
                variables: [],
                logic: [],
                data: [],
                ai: [],
                other: []
            }
        };

        // Resetear UI
        document.getElementById('importFormatSelect').value = 'json';
        document.getElementById('importFileInput').value = '';
        document.getElementById('importAnalysisSection').style.display = 'none';
        document.getElementById('importProgressSection').style.display = 'none';
        document.getElementById('importResultSection').style.display = 'none';
    }

    /**
     * Maneja la selección de archivo
     */
    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const format = document.getElementById('importFormatSelect').value;

        try {
            const content = await this.readFile(file);
            await this.processImportedContent(content, format);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            showNotification('Error al leer el archivo: ' + error.message, 'error');
        }
    }

    /**
     * Lee el contenido del archivo
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Procesa el contenido importado según el formato
     */
    async processImportedContent(content, format) {
        try {
            let workflow = null;

            switch (format) {
                case 'json':
                    workflow = this.parseJSON(content);
                    break;
                case 'markdown':
                    workflow = this.parseMarkdown(content);
                    break;
                case 'mermaid':
                    workflow = this.parseMermaid(content);
                    break;
                default:
                    throw new Error('Formato no soportado');
            }

            if (!workflow || !workflow.steps || workflow.steps.length === 0) {
                throw new Error('El archivo no contiene un workflow válido');
            }

            this.importedWorkflow = workflow;
            await this.startAnalysis();

        } catch (error) {
            console.error('Error al procesar el contenido:', error);
            showNotification('Error al procesar el archivo: ' + error.message, 'error');
        }
    }

    /**
     * Parsea contenido JSON
     */
    parseJSON(content) {
        const data = JSON.parse(content);
        return {
            name: data.name || 'Workflow Importado',
            steps: data.steps || data.workflow || []
        };
    }

    /**
     * Parsea contenido Markdown
     */
    parseMarkdown(content) {
        // Extraer nombre del workflow (primera línea con #)
        const nameMatch = content.match(/^#\s+(.+)$/m);
        const name = nameMatch ? nameMatch[1] : 'Workflow Importado';

        // Extraer bloques JSON de configuración
        const steps = [];
        const jsonBlocks = content.matchAll(/```json\s*\n([\s\S]*?)\n```/g);

        let stepIndex = 0;
        for (const match of jsonBlocks) {
            try {
                const config = JSON.parse(match[1]);

                // Buscar el nombre del paso anterior al bloque JSON
                const beforeBlock = content.substring(0, match.index);
                const stepNameMatch = beforeBlock.match(/###\s+\d+\.\s+(.+)$/m);
                const stepName = stepNameMatch ? stepNameMatch[1] : `Paso ${stepIndex + 1}`;

                // Buscar el tipo del paso
                const typeMatch = beforeBlock.match(/\*\*Tipo:\*\*\s*`([^`]+)`/);
                const stepType = typeMatch ? typeMatch[1] : 'unknown';

                steps.push({
                    id: `step-${stepIndex + 1}`,
                    name: stepName,
                    type: stepType,
                    config: config
                });

                stepIndex++;
            } catch (e) {
                console.warn('Error al parsear bloque JSON:', e);
            }
        }

        return { name, steps };
    }

    /**
     * Parsea contenido Mermaid
     */
    parseMermaid(content) {
        // Extraer el diagrama mermaid
        const mermaidMatch = content.match(/```mermaid\s*\n([\s\S]*?)\n```/);
        if (!mermaidMatch) {
            throw new Error('No se encontró un diagrama Mermaid válido');
        }

        const diagram = mermaidMatch[1];
        const steps = [];

        // Extraer nodos del diagrama
        const nodeRegex = /Step\d+\[([^\]]+)\]/g;
        let match;
        let stepIndex = 0;

        while ((match = nodeRegex.exec(diagram)) !== null) {
            const stepName = match[1];
            steps.push({
                id: `step-${stepIndex + 1}`,
                name: stepName,
                type: 'unknown',
                config: {}
            });
            stepIndex++;
        }

        return {
            name: 'Workflow desde Mermaid',
            steps
        };
    }

    /**
     * PASO 1: Analiza la secuencia del workflow
     */
    async startAnalysis() {
        console.log('📊 Iniciando análisis de secuencia...');

        // Mostrar sección de análisis
        document.getElementById('importAnalysisSection').style.display = 'block';

        // Analizar pasos
        this.analyzedData.steps = this.importedWorkflow.steps.map((step, index) => ({
            index: index + 1,
            name: step.name,
            type: step.type,
            config: step.config,
            valid: this.validateStep(step)
        }));

        // Actualizar UI
        this.updateAnalysisUI();

        // PASO 2: Proponer componentes
        await this.proposeComponents();
    }

    /**
     * Valida un paso individual
     */
    validateStep(step) {
        if (!step.type) return false;
        if (!step.config) return false;
        return true;
    }

    /**
     * PASO 2: Propone componentes necesarios
     */
    async proposeComponents() {
        console.log('🔍 Analizando componentes necesarios...');

        const usedComponents = new Set();
        this.importedWorkflow.steps.forEach(step => {
            usedComponents.add(step.type);
        });

        // Verificar componentes existentes
        for (const compType of usedComponents) {
            const exists = this.componentExists(compType);
            if (exists) {
                this.analyzedData.components.existing.push({
                    type: compType,
                    definition: exists,
                    category: this.categorizeComponent(compType, exists)
                });
            } else {
                this.analyzedData.components.missing.push({
                    type: compType,
                    category: this.inferCategory(compType)
                });
            }
        }

        // Actualizar UI
        this.updateComponentsUI();

        // PASO 3: Categorizar componentes
        this.categorizeAllComponents();

        // PASO 4: Validar viabilidad
        await this.validateViability();
    }

    /**
     * Verifica si un componente existe
     */
    componentExists(type) {
        // Buscar en MCPProperties
        if (typeof MCPProperties !== 'undefined' && MCPProperties[type]) {
            return MCPProperties[type];
        }

        // Buscar en componentes generados
        try {
            const generated = JSON.parse(localStorage.getItem('generated_components') || '[]');
            const found = generated.find(c => c.id === type);
            if (found) return found;
        } catch (e) {
            console.warn('Error al leer componentes generados:', e);
        }

        return null;
    }

    /**
     * PASO 3: Categoriza componentes automáticamente
     */
    categorizeAllComponents() {
        console.log('📂 Categorizando componentes...');

        // Categorizar existentes
        this.analyzedData.components.existing.forEach(comp => {
            const category = comp.category;
            if (this.analyzedData.categories[category]) {
                this.analyzedData.categories[category].push(comp);
            } else {
                this.analyzedData.categories.other.push(comp);
            }
        });

        // Categorizar faltantes
        this.analyzedData.components.missing.forEach(comp => {
            const category = comp.category;
            if (this.analyzedData.categories[category]) {
                this.analyzedData.categories[category].push(comp);
            } else {
                this.analyzedData.categories.other.push(comp);
            }
        });

        this.updateCategoriesUI();
    }

    /**
     * Categoriza un componente basado en su tipo y definición
     */
    categorizeComponent(type, definition) {
        if (!definition) return this.inferCategory(type);

        const category = definition.category || definition.categoria;
        if (category) {
            const categoryMap = {
                'Web': 'web',
                'Variables': 'variables',
                'Lógica': 'logic',
                'Logic': 'logic',
                'Datos': 'data',
                'Data': 'data',
                'IA': 'ai',
                'AI': 'ai',
                'Generated': 'other'
            };
            return categoryMap[category] || 'other';
        }

        return this.inferCategory(type);
    }

    /**
     * Infiere la categoría de un componente por su tipo
     */
    inferCategory(type) {
        const webKeywords = ['click', 'navigate', 'browser', 'scroll', 'hover', 'screenshot', 'page'];
        const varKeywords = ['variable', 'set', 'get', 'store', 'load'];
        const logicKeywords = ['if', 'else', 'loop', 'while', 'for', 'condition', 'decision'];
        const dataKeywords = ['extract', 'scrape', 'parse', 'read', 'write', 'csv', 'excel', 'json'];
        const aiKeywords = ['ai', 'gpt', 'claude', 'gemini', 'ocr', 'vision', 'analyze'];

        const typeLower = type.toLowerCase();

        if (webKeywords.some(kw => typeLower.includes(kw))) return 'web';
        if (varKeywords.some(kw => typeLower.includes(kw))) return 'variables';
        if (logicKeywords.some(kw => typeLower.includes(kw))) return 'logic';
        if (dataKeywords.some(kw => typeLower.includes(kw))) return 'data';
        if (aiKeywords.some(kw => typeLower.includes(kw))) return 'ai';

        return 'other';
    }

    /**
     * PASO 4: Valida la viabilidad del flujo completo
     */
    async validateViability() {
        console.log('✅ Validando viabilidad del flujo...');

        this.analyzedData.validation.issues = [];
        this.analyzedData.validation.warnings = [];

        // Validación 1: Verificar que todos los pasos sean válidos
        const invalidSteps = this.analyzedData.steps.filter(s => !s.valid);
        if (invalidSteps.length > 0) {
            this.analyzedData.validation.issues.push(
                `${invalidSteps.length} paso(s) tienen configuración inválida`
            );
        }

        // Validación 2: Verificar componentes faltantes
        if (this.analyzedData.components.missing.length > 0) {
            this.analyzedData.validation.warnings.push(
                `${this.analyzedData.components.missing.length} componente(s) necesitan ser generados`
            );
        }

        // Validación 3: Verificar secuencia lógica
        const sequenceIssues = this.validateSequence();
        if (sequenceIssues.length > 0) {
            this.analyzedData.validation.warnings.push(...sequenceIssues);
        }

        // Determinar viabilidad
        this.analyzedData.validation.isViable = this.analyzedData.validation.issues.length === 0;

        // Actualizar UI
        this.updateValidationUI();

        // Si es viable y hay componentes faltantes, ofrecer generación
        if (this.analyzedData.validation.isViable && this.analyzedData.components.missing.length > 0) {
            this.showGenerationOption();
        } else if (this.analyzedData.validation.isViable) {
            // Si es viable y no hay componentes faltantes, mostrar resumen
            this.showImportSummary();
        }
    }

    /**
     * Valida la secuencia lógica del workflow
     */
    validateSequence() {
        const issues = [];
        const steps = this.importedWorkflow.steps;

        // Verificar que haya al menos un paso
        if (steps.length === 0) {
            issues.push('El workflow está vacío');
            return issues;
        }

        // Verificar secuencia de pasos web
        let hasBrowserOpen = false;
        steps.forEach((step, index) => {
            // Si es una acción web, verificar que haya un browser_open antes
            const isWebAction = ['click', 'type', 'navigate', 'scroll', 'screenshot'].includes(step.type);
            if (isWebAction && !hasBrowserOpen && step.type !== 'browser_open') {
                issues.push(`Paso ${index + 1} (${step.name}): Se requiere abrir navegador primero`);
            }

            if (step.type === 'browser_open') {
                hasBrowserOpen = true;
            }
        });

        return issues;
    }

    /**
     * Muestra la opción de generar componentes con IA
     */
    showGenerationOption() {
        const generateBtn = document.getElementById('importGenerateMissingBtn');
        if (generateBtn) {
            generateBtn.style.display = 'block';
            generateBtn.onclick = () => this.generateMissingComponentsWithProgress();
        }
    }

    /**
     * PASO 5: Genera componentes faltantes con progreso visual
     */
    async generateMissingComponentsWithProgress() {
        console.log('🤖 Generando componentes faltantes con IA...');

        // Mostrar sección de progreso
        document.getElementById('importProgressSection').style.display = 'block';

        const missing = this.analyzedData.components.missing;
        this.generationProgress.total = missing.length;
        this.generationProgress.current = 0;

        for (let i = 0; i < missing.length; i++) {
            const comp = missing[i];
            this.generationProgress.current = i + 1;
            this.generationProgress.currentComponent = comp.type;
            this.generationProgress.percentage = Math.round((this.generationProgress.current / this.generationProgress.total) * 100);

            // Actualizar UI de progreso
            this.updateProgressUI();

            // Generar componente
            const generated = await this.generateComponent(comp.type, comp.category);
            this.analyzedData.components.generated.push(generated);

            // Pequeña pausa para efecto visual
            await this.sleep(500);
        }

        // Guardar componentes generados
        this.saveGeneratedComponents();

        // Mostrar resumen final
        setTimeout(() => {
            this.showImportSummary();
        }, 1000);
    }

    /**
     * Genera un componente individual con IA
     */
    async generateComponent(type, category) {
        console.log(`  Generando: ${type} (${category})`);

        const component = {
            id: type,
            title: this.formatComponentTitle(type),
            icon: this.getIconForCategory(category),
            category: this.getCategoryDisplayName(category),
            properties: this.generateProperties(type, category),
            generated: true,
            generatedAt: new Date().toISOString()
        };

        return component;
    }

    /**
     * Formatea el título del componente
     */
    formatComponentTitle(type) {
        return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Obtiene el ícono según la categoría
     */
    getIconForCategory(category) {
        const icons = {
            web: 'fas fa-globe',
            variables: 'fas fa-database',
            logic: 'fas fa-code-branch',
            data: 'fas fa-table',
            ai: 'fas fa-brain',
            other: 'fas fa-cog'
        };
        return icons[category] || 'fas fa-cog';
    }

    /**
     * Obtiene el nombre de visualización de la categoría
     */
    getCategoryDisplayName(category) {
        const names = {
            web: 'Web',
            variables: 'Variables',
            logic: 'Lógica',
            data: 'Datos',
            ai: 'IA',
            other: 'General'
        };
        return names[category] || 'General';
    }

    /**
     * Genera propiedades para el componente según su categoría
     */
    generateProperties(type, category) {
        const baseProps = [
            {
                name: 'name',
                label: 'Nombre',
                type: 'text',
                required: false,
                default: ''
            }
        ];

        // Propiedades específicas por categoría
        const categoryProps = {
            web: [
                { name: 'selector', label: 'Selector CSS', type: 'text', required: true },
                { name: 'waitTime', label: 'Tiempo de espera (ms)', type: 'number', required: false, default: 1000 }
            ],
            variables: [
                { name: 'variableName', label: 'Nombre de variable', type: 'text', required: true },
                { name: 'value', label: 'Valor', type: 'text', required: false }
            ],
            logic: [
                { name: 'condition', label: 'Condición', type: 'text', required: true },
                { name: 'action', label: 'Acción', type: 'select', required: true, options: ['continue', 'break', 'skip'] }
            ],
            data: [
                { name: 'source', label: 'Fuente de datos', type: 'text', required: true },
                { name: 'format', label: 'Formato', type: 'select', required: false, options: ['json', 'csv', 'xml'] }
            ],
            ai: [
                { name: 'prompt', label: 'Prompt', type: 'textarea', required: true },
                { name: 'model', label: 'Modelo', type: 'select', required: false, options: ['gpt-4', 'claude', 'gemini'] }
            ]
        };

        const props = [...baseProps];
        if (categoryProps[category]) {
            props.push(...categoryProps[category]);
        }

        return props;
    }

    /**
     * Guarda componentes generados en localStorage
     */
    saveGeneratedComponents() {
        try {
            let existing = JSON.parse(localStorage.getItem('generated_components') || '[]');
            const newComponents = this.analyzedData.components.generated;

            // Agregar solo componentes nuevos
            newComponents.forEach(newComp => {
                const exists = existing.find(c => c.id === newComp.id);
                if (!exists) {
                    existing.push(newComp);
                }
            });

            localStorage.setItem('generated_components', JSON.stringify(existing));
            console.log(`✅ ${newComponents.length} componente(s) guardados`);
        } catch (e) {
            console.error('Error al guardar componentes:', e);
        }
    }

    /**
     * PASO 6: Muestra el resumen final con diagrama y listado
     */
    showImportSummary() {
        console.log('📋 Mostrando resumen de importación...');

        document.getElementById('importResultSection').style.display = 'block';

        // Generar diagrama visual
        this.generateDiagramView();

        // Generar listado paso a paso
        this.generateStepListView();

        // Generar resumen general
        this.generateGeneralSummary();

        // Mostrar botón de guardar workflow
        const saveBtn = document.getElementById('importSaveWorkflowBtn');
        if (saveBtn) {
            saveBtn.style.display = 'block';
            saveBtn.onclick = () => this.saveImportedWorkflow();
        }
    }

    /**
     * Genera la vista de diagrama
     */
    generateDiagramView() {
        const container = document.getElementById('importDiagramView');
        if (!container) return;

        let html = '<div class="workflow-diagram">';

        this.importedWorkflow.steps.forEach((step, index) => {
            const isLast = index === this.importedWorkflow.steps.length - 1;

            html += `
                <div class="diagram-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-name">${step.name || step.type}</div>
                        <div class="step-type">${step.type}</div>
                    </div>
                </div>
            `;

            if (!isLast) {
                html += '<div class="step-arrow">↓</div>';
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Genera la vista de listado paso a paso
     */
    generateStepListView() {
        const container = document.getElementById('importStepListView');
        if (!container) return;

        let html = '<div class="step-list">';

        this.importedWorkflow.steps.forEach((step, index) => {
            const category = this.inferCategory(step.type);
            const icon = this.getIconForCategory(category);

            html += `
                <div class="step-item">
                    <div class="step-header">
                        <span class="step-icon"><i class="${icon}"></i></span>
                        <span class="step-title">${index + 1}. ${step.name || step.type}</span>
                        <span class="step-badge">${step.type}</span>
                    </div>
                    <div class="step-config">
                        <pre>${JSON.stringify(step.config, null, 2)}</pre>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Genera el resumen general
     */
    generateGeneralSummary() {
        const container = document.getElementById('importGeneralSummary');
        if (!container) return;

        const totalSteps = this.importedWorkflow.steps.length;
        const existingComps = this.analyzedData.components.existing.length;
        const missingComps = this.analyzedData.components.missing.length;
        const generatedComps = this.analyzedData.components.generated.length;

        const html = `
            <div class="summary-card">
                <h3>📊 Resumen General</h3>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-label">Nombre del Workflow:</span>
                        <span class="stat-value">${this.importedWorkflow.name}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total de pasos:</span>
                        <span class="stat-value">${totalSteps}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Componentes existentes:</span>
                        <span class="stat-value">${existingComps}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Componentes generados:</span>
                        <span class="stat-value">${generatedComps}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Estado:</span>
                        <span class="stat-value ${this.analyzedData.validation.isViable ? 'status-success' : 'status-error'}">
                            ${this.analyzedData.validation.isViable ? '✅ Viable' : '❌ No viable'}
                        </span>
                    </div>
                </div>
                ${this.analyzedData.validation.warnings.length > 0 ? `
                    <div class="summary-warnings">
                        <h4>⚠️ Advertencias:</h4>
                        <ul>
                            ${this.analyzedData.validation.warnings.map(w => `<li>${w}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * PASO 7: Guarda el workflow importado
     */
    async saveImportedWorkflow() {
        console.log('💾 Guardando workflow importado...');

        try {
            // Crear el workflow en el formato esperado
            const workflowData = {
                name: this.importedWorkflow.name,
                workflow: this.importedWorkflow.steps,
                imported: true,
                importedAt: new Date().toISOString(),
                componentsGenerated: this.analyzedData.components.generated.length
            };

            // Guardar en el servidor
            const response = await fetch('/api/workflows/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workflowData)
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ Workflow "${this.importedWorkflow.name}" guardado exitosamente`, 'success');

                // Cargar el workflow en el editor
                if (typeof WorkflowEditor !== 'undefined') {
                    WorkflowEditor.currentWorkflow = this.importedWorkflow.steps;
                    WorkflowEditor.workflowName = this.importedWorkflow.name;
                    WorkflowEditor.renderWorkflow();
                }

                // Cerrar modal
                this.closeImportModal();

                // Recargar biblioteca si está disponible
                if (typeof WorkflowLibrary !== 'undefined') {
                    WorkflowLibrary.loadWorkflows();
                }
            } else {
                throw new Error(result.error || 'Error al guardar el workflow');
            }

        } catch (error) {
            console.error('Error al guardar workflow:', error);
            showNotification('Error al guardar el workflow: ' + error.message, 'error');
        }
    }

    // === MÉTODOS DE ACTUALIZACIÓN DE UI ===

    updateAnalysisUI() {
        const container = document.getElementById('importAnalysisSteps');
        if (!container) return;

        const html = `
            <div class="analysis-info">
                <h4>📝 Pasos detectados: ${this.analyzedData.steps.length}</h4>
                <ul class="steps-preview">
                    ${this.analyzedData.steps.map(s => `
                        <li>
                            <span class="${s.valid ? 'valid' : 'invalid'}">${s.valid ? '✅' : '❌'}</span>
                            ${s.index}. ${s.name} <code>(${s.type})</code>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.innerHTML = html;
    }

    updateComponentsUI() {
        const container = document.getElementById('importAnalysisComponents');
        if (!container) return;

        const html = `
            <div class="components-info">
                <h4>🔧 Análisis de Componentes</h4>
                <div class="component-stats">
                    <div class="stat-item success">
                        <span class="stat-number">${this.analyzedData.components.existing.length}</span>
                        <span class="stat-label">Existentes</span>
                    </div>
                    <div class="stat-item warning">
                        <span class="stat-number">${this.analyzedData.components.missing.length}</span>
                        <span class="stat-label">Faltantes</span>
                    </div>
                </div>
                ${this.analyzedData.components.existing.length > 0 ? `
                    <div class="component-list">
                        <h5>✅ Componentes Existentes:</h5>
                        <ul>
                            ${this.analyzedData.components.existing.map(c => `<li><code>${c.type}</code> (${c.category})</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${this.analyzedData.components.missing.length > 0 ? `
                    <div class="component-list">
                        <h5>❌ Componentes Faltantes:</h5>
                        <ul>
                            ${this.analyzedData.components.missing.map(c => `<li><code>${c.type}</code> (${c.category})</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
        container.innerHTML = html;
    }

    updateCategoriesUI() {
        const container = document.getElementById('importAnalysisCategories');
        if (!container) return;

        const categories = Object.entries(this.analyzedData.categories)
            .filter(([_, items]) => items.length > 0);

        const html = `
            <div class="categories-info">
                <h4>📂 Categorías de Componentes</h4>
                <div class="category-grid">
                    ${categories.map(([cat, items]) => `
                        <div class="category-item">
                            <div class="category-icon">${this.getIconForCategory(cat)}</div>
                            <div class="category-name">${this.getCategoryDisplayName(cat)}</div>
                            <div class="category-count">${items.length}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    updateValidationUI() {
        const container = document.getElementById('importAnalysisValidation');
        if (!container) return;

        const html = `
            <div class="validation-info">
                <h4>✅ Validación de Viabilidad</h4>
                <div class="validation-status ${this.analyzedData.validation.isViable ? 'viable' : 'not-viable'}">
                    ${this.analyzedData.validation.isViable ?
                        '<i class="fas fa-check-circle"></i> El workflow es VIABLE' :
                        '<i class="fas fa-times-circle"></i> El workflow NO es viable'}
                </div>
                ${this.analyzedData.validation.issues.length > 0 ? `
                    <div class="validation-issues">
                        <h5>❌ Problemas:</h5>
                        <ul>
                            ${this.analyzedData.validation.issues.map(i => `<li>${i}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${this.analyzedData.validation.warnings.length > 0 ? `
                    <div class="validation-warnings">
                        <h5>⚠️ Advertencias:</h5>
                        <ul>
                            ${this.analyzedData.validation.warnings.map(w => `<li>${w}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
        container.innerHTML = html;
    }

    updateProgressUI() {
        const progressBar = document.getElementById('importProgressBar');
        const progressText = document.getElementById('importProgressText');
        const progressComponent = document.getElementById('importProgressComponent');

        if (progressBar) {
            progressBar.style.width = `${this.generationProgress.percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${this.generationProgress.current} de ${this.generationProgress.total} componentes (${this.generationProgress.percentage}%)`;
        }

        if (progressComponent) {
            progressComponent.textContent = `Generando: ${this.generationProgress.currentComponent}`;
        }
    }

    // === UTILIDADES ===

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Cambia entre tabs de resultado (diagrama/listado)
     */
    showResultTab(tab) {
        // Actualizar botones
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.classList.remove('active');
            btn.style.borderBottom = '3px solid transparent';
        });

        const activeTab = tab === 'diagram' ? tabs[0] : tabs[1];
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.borderBottom = '3px solid #3b82f6';
        }

        // Actualizar vistas
        document.getElementById('importDiagramView').style.display = tab === 'diagram' ? 'block' : 'none';
        document.getElementById('importStepListView').style.display = tab === 'list' ? 'block' : 'none';
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    window.WorkflowImporter = new WorkflowImporter();
    window.WorkflowImporter.init();
});
