// 🎯 WORKFLOW EXPORTER - Sistema avanzado de exportación con análisis de componentes
const WorkflowExporter = {
    selectedFormat: null,
    currentWorkflow: null,

    init() {
        // Listener para el botón "Guardar Como..."
        const saveBtn = document.getElementById('saveWorkflowWithFormat');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.openModal());
        }

        // Listener para cambio de formato
        const formatSelect = document.getElementById('exportFormat');
        if (formatSelect) {
            formatSelect.addEventListener('change', (e) => this.onFormatChange(e.target.value));
        }
    },

    openModal() {
        // Obtener workflow actual
        if (typeof WorkflowEditor !== 'undefined' && WorkflowEditor.currentWorkflow) {
            this.currentWorkflow = WorkflowEditor.currentWorkflow;
        } else {
            showNotification('No hay workflow para exportar', 'error');
            return;
        }

        // Mostrar modal
        const modal = document.getElementById('exportFormatModal');
        if (modal) {
            modal.style.display = 'flex';
        }

        // Resetear formulario
        document.getElementById('exportFormat').value = '';
        document.getElementById('formatDescription').style.display = 'none';
        document.getElementById('componentsAnalysis').style.display = 'none';
        document.getElementById('confirmExport').disabled = true;
    },

    closeModal() {
        const modal = document.getElementById('exportFormatModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    onFormatChange(format) {
        this.selectedFormat = format;

        const descElement = document.getElementById('formatDescription');
        const descText = document.getElementById('formatDescriptionText');
        const confirmBtn = document.getElementById('confirmExport');

        if (!format) {
            descElement.style.display = 'none';
            confirmBtn.disabled = true;
            document.getElementById('componentsAnalysis').style.display = 'none';
            return;
        }

        // Mostrar descripción del formato
        const descriptions = {
            json: 'Formato estándar para workflows. Ideal para integración con otros sistemas y versionamiento.',
            mermaid: 'Diagrama de flujo visual usando sintaxis Mermaid. Perfecto para documentación y presentaciones.',
            markdown: 'Documento de texto estructurado con formato Markdown. Fácil de leer y editar.',
            word: 'Documento de Microsoft Word (.docx). Ideal para reportes y documentación profesional.',
            pdf: 'Documento PDF con diagrama y descripción detallada. Perfecto para compartir y archivar.'
        };

        descText.textContent = descriptions[format] || '';
        descElement.style.display = 'block';
        confirmBtn.disabled = false;

        // Analizar componentes del workflow
        this.analyzeComponents();
    },

    analyzeComponents() {
        if (!this.currentWorkflow || !this.currentWorkflow.length) {
            return;
        }

        const analysisDiv = document.getElementById('componentsAnalysis');
        const analysisContent = document.getElementById('componentsAnalysisContent');

        // Recopilar todos los componentes usados
        const usedComponents = new Set();
        const componentDetails = [];

        this.currentWorkflow.forEach((action, index) => {
            usedComponents.add(action.type);
            componentDetails.push({
                index: index + 1,
                type: action.type,
                name: action.name || action.type,
                config: action.config || {}
            });
        });

        // Verificar si los componentes existen
        const existingComponents = [];
        const missingComponents = [];

        usedComponents.forEach(compType => {
            const exists = this.componentExists(compType);
            if (exists) {
                existingComponents.push({
                    type: compType,
                    definition: exists
                });
            } else {
                missingComponents.push(compType);
            }
        });

        // Generar HTML del análisis
        let html = '';

        // Componentes existentes
        if (existingComponents.length > 0) {
            html += `
                <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 4px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: #10b981;">
                        <i class="fas fa-check-circle"></i> Componentes Existentes (${existingComponents.length})
                    </h5>
                    <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
                        ${existingComponents.map(comp => `
                            <li style="margin: 0.25rem 0;">
                                <strong>${comp.type}</strong>
                                ${comp.definition.title ? `- ${comp.definition.title}` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        // Componentes faltantes
        if (missingComponents.length > 0) {
            html += `
                <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 4px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: #ef4444;">
                        <i class="fas fa-exclamation-triangle"></i> Componentes No Encontrados (${missingComponents.length})
                    </h5>
                    <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
                        ${missingComponents.map(comp => `
                            <li style="margin: 0.25rem 0;">
                                <strong>${comp}</strong>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn btn-primary" style="margin-top: 1rem; font-size: 0.85rem;" onclick="WorkflowExporter.generateMissingComponents()">
                        <i class="fas fa-magic"></i> Generar Componentes Faltantes con IA
                    </button>
                </div>
            `;
        }

        // Resumen del workflow
        html += `
            <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; border-radius: 4px;">
                <h5 style="margin: 0 0 0.5rem 0; color: #3b82f6;">
                    <i class="fas fa-info-circle"></i> Resumen del Workflow
                </h5>
                <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
                    <li>Total de pasos: <strong>${this.currentWorkflow.length}</strong></li>
                    <li>Componentes únicos: <strong>${usedComponents.size}</strong></li>
                    <li>Formato seleccionado: <strong>${this.getFormatName(this.selectedFormat)}</strong></li>
                </ul>
            </div>
        `;

        analysisContent.innerHTML = html;
        analysisDiv.style.display = 'block';
    },

    componentExists(componentType) {
        // Verificar en MCPProperties
        if (typeof MCPProperties !== 'undefined' && MCPProperties[componentType]) {
            return MCPProperties[componentType];
        }

        // Verificar en componentes generados
        try {
            const generated = localStorage.getItem('generated_components');
            if (generated) {
                const components = JSON.parse(generated);
                const found = components.find(c => c.id === componentType);
                if (found) return found;
            }
        } catch (error) {
            console.error('Error checking generated components:', error);
        }

        return null;
    },

    async generateMissingComponents() {
        showNotification('Generando componentes faltantes con IA...', 'info');

        // Recopilar componentes faltantes
        const usedComponents = new Set();
        this.currentWorkflow.forEach(action => {
            usedComponents.add(action.type);
        });

        const missingComponents = [];
        usedComponents.forEach(compType => {
            if (!this.componentExists(compType)) {
                missingComponents.push(compType);
            }
        });

        if (missingComponents.length === 0) {
            showNotification('No hay componentes faltantes', 'success');
            return;
        }

        // Generar cada componente usando ComponentGenerator
        if (typeof ComponentGenerator !== 'undefined') {
            for (const compType of missingComponents) {
                await this.generateSingleComponent(compType);
            }

            showNotification(`✅ ${missingComponents.length} componentes generados exitosamente`, 'success');

            // Reanalizar componentes
            this.analyzeComponents();
        } else {
            showNotification('El generador de componentes no está disponible', 'error');
        }
    },

    async generateSingleComponent(componentType) {
        // Crear descripción basada en el tipo
        const description = `Componente para ${componentType.replace(/_/g, ' ')}`;

        // Simular generación (en producción usaría IA real)
        const newComponent = {
            id: componentType,
            title: componentType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            icon: 'fas fa-cog',
            category: 'Generated',
            properties: [
                {
                    name: 'config',
                    label: 'Configuración',
                    type: 'text',
                    required: false
                }
            ]
        };

        // Guardar en localStorage
        try {
            let components = [];
            const saved = localStorage.getItem('generated_components');
            if (saved) {
                components = JSON.parse(saved);
            }

            components.push(newComponent);
            localStorage.setItem('generated_components', JSON.stringify(components));

            console.log(`✅ Componente ${componentType} generado y guardado`);
        } catch (error) {
            console.error(`Error generando componente ${componentType}:`, error);
        }
    },

    getFormatName(format) {
        const names = {
            json: 'JSON',
            mermaid: 'Mermaid Chart',
            markdown: 'Markdown',
            word: 'Word',
            pdf: 'PDF'
        };
        return names[format] || format;
    },

    async selectFolder() {
        if (!this.selectedFormat) {
            showNotification('Por favor selecciona un formato', 'error');
            return;
        }

        // Solicitar carpeta al usuario (usando input de tipo file con webkitdirectory)
        const folderPath = await this.promptForFolder();

        if (!folderPath) {
            return; // Usuario canceló
        }

        // Generar el archivo según el formato
        await this.generateFile(folderPath);
    },

    async promptForFolder() {
        return new Promise((resolve) => {
            // Crear input temporal
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'C:\\Proyectos\\Workflows';
            input.style.width = '100%';
            input.style.padding = '0.75rem';
            input.style.marginBottom = '1rem';

            // Crear modal temporal
            const tempModal = document.createElement('div');
            tempModal.className = 'modal';
            tempModal.style.display = 'flex';
            tempModal.innerHTML = `
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-folder-open"></i> Seleccionar Carpeta</h3>
                    </div>
                    <div class="modal-body">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                            Ruta de la carpeta del proyecto:
                        </label>
                        <div id="folderInputContainer"></div>
                        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #94a3b8;">
                            Ejemplo: C:\\Proyectos\\Workflows\\MiWorkflow
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelFolder">Cancelar</button>
                        <button class="btn btn-success" id="confirmFolder">
                            <i class="fas fa-check"></i> Confirmar
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(tempModal);
            document.getElementById('folderInputContainer').appendChild(input);

            document.getElementById('cancelFolder').onclick = () => {
                tempModal.remove();
                resolve(null);
            };

            document.getElementById('confirmFolder').onclick = () => {
                const path = input.value.trim();
                if (!path) {
                    showNotification('Por favor ingresa una ruta válida', 'error');
                    return;
                }
                tempModal.remove();
                resolve(path);
            };
        });
    },

    async generateFile(folderPath) {
        const workflowName = document.getElementById('workflowName')?.value || 'Workflow';

        let fileContent = '';
        let fileName = '';
        let mimeType = '';

        switch (this.selectedFormat) {
            case 'json':
                fileContent = this.generateJSON();
                fileName = `${workflowName}.json`;
                mimeType = 'application/json';
                break;

            case 'mermaid':
                fileContent = this.generateMermaid();
                fileName = `${workflowName}.md`;
                mimeType = 'text/markdown';
                break;

            case 'markdown':
                fileContent = this.generateMarkdown();
                fileName = `${workflowName}.md`;
                mimeType = 'text/markdown';
                break;

            case 'word':
                await this.generateWord(folderPath, workflowName);
                return;

            case 'pdf':
                await this.generatePDF(folderPath, workflowName);
                return;
        }

        // Enviar al servidor para guardar
        try {
            const response = await fetch('/api/save-workflow-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderPath,
                    fileName,
                    content: fileContent,
                    format: this.selectedFormat
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ Workflow guardado en: ${result.fullPath}`, 'success');
                this.showResult(fileContent, result.fullPath);
                this.closeModal();
            } else {
                showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            showNotification(`Error guardando archivo: ${error.message}`, 'error');
        }
    },

    generateJSON() {
        return JSON.stringify({
            name: document.getElementById('workflowName')?.value || 'Workflow',
            version: '1.0.0',
            created: new Date().toISOString(),
            steps: this.currentWorkflow
        }, null, 2);
    },

    generateMermaid() {
        let mermaid = '```mermaid\nflowchart TD\n';
        mermaid += '    Start([Inicio])\n';

        this.currentWorkflow.forEach((action, index) => {
            const id = `Step${index + 1}`;
            const nextId = index < this.currentWorkflow.length - 1 ? `Step${index + 2}` : 'End';
            const label = action.name || action.type;

            mermaid += `    ${id}[${label}]\n`;

            if (index === 0) {
                mermaid += `    Start --> ${id}\n`;
            }

            if (index < this.currentWorkflow.length - 1) {
                mermaid += `    ${id} --> ${nextId}\n`;
            } else {
                mermaid += `    ${id} --> End\n`;
            }
        });

        mermaid += '    End([Fin])\n';
        mermaid += '```\n';

        return mermaid;
    },

    generateMarkdown() {
        const workflowName = document.getElementById('workflowName')?.value || 'Workflow';

        let md = `# ${workflowName}\n\n`;
        md += `**Creado:** ${new Date().toLocaleString('es-ES')}\n\n`;
        md += `**Total de pasos:** ${this.currentWorkflow.length}\n\n`;
        md += `---\n\n`;
        md += `## Diagrama de Flujo\n\n`;
        md += this.generateMermaid();
        md += `\n---\n\n`;
        md += `## Descripción de Pasos\n\n`;

        this.currentWorkflow.forEach((action, index) => {
            md += `### ${index + 1}. ${action.name || action.type}\n\n`;
            md += `**Tipo:** \`${action.type}\`\n\n`;

            if (action.config && Object.keys(action.config).length > 0) {
                md += `**Configuración:**\n\n`;
                md += `\`\`\`json\n`;
                md += JSON.stringify(action.config, null, 2);
                md += `\n\`\`\`\n\n`;
            }
        });

        md += `---\n\n`;
        md += `*Generado con Alqvimia RPA*\n`;

        return md;
    },

    async generateWord(folderPath, workflowName) {
        // Para Word necesitamos el servidor
        showNotification('Generando documento Word...', 'info');

        try {
            const response = await fetch('/api/generate-workflow-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderPath,
                    fileName: `${workflowName}.docx`,
                    workflow: {
                        name: workflowName,
                        steps: this.currentWorkflow
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ Documento Word guardado en: ${result.fullPath}`, 'success');
                this.closeModal();
            } else {
                showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification(`Error generando Word: ${error.message}`, 'error');
        }
    },

    async generatePDF(folderPath, workflowName) {
        // Para PDF necesitamos el servidor
        showNotification('Generando documento PDF...', 'info');

        try {
            const response = await fetch('/api/generate-workflow-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderPath,
                    fileName: `${workflowName}.pdf`,
                    workflow: {
                        name: workflowName,
                        steps: this.currentWorkflow,
                        mermaidDiagram: this.generateMermaid()
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ Documento PDF guardado en: ${result.fullPath}`, 'success');
                this.closeModal();
            } else {
                showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification(`Error generando PDF: ${error.message}`, 'error');
        }
    },

    showResult(content, filePath) {
        // Mostrar resultado en un modal o área de resultados
        console.log('📄 Archivo generado:', filePath);
        console.log('Contenido:', content);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    WorkflowExporter.init();
});
