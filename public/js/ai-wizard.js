// 🤖 GENERADOR DE COMPONENTES CON IA - WIZARD
// Similar a Document Automation Agent de Alqvimia

const AIWizard = {
    currentStep: 1,
    totalSteps: 4,
    extractionData: null,

    // Inicializar wizard
    init() {
        this.attachEventListeners();
    },

    // Abrir wizard
    open() {
        const modal = this.createWizardModal();
        document.body.appendChild(modal);
        this.showStep(1);
    },

    // Crear modal del wizard
    createWizardModal() {
        const modal = document.createElement('div');
        modal.id = 'aiWizardModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 90%; max-height: 90vh; overflow: auto;">
                <div class="wizard-header" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 2rem; color: white; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 0 -1.5rem;">
                    <span class="close" onclick="AIWizard.close()" style="color: white; opacity: 0.9;">&times;</span>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <i class="fas fa-robot" style="font-size: 2.5rem;"></i>
                        <div>
                            <h2 style="margin: 0; font-size: 1.75rem;">Generador Inteligente de Workflows</h2>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Crea workflows automáticamente con IA</p>
                        </div>
                    </div>

                    <!-- Progress Steps -->
                    <div class="wizard-progress" style="display: flex; justify-content: space-between; margin-top: 2rem;">
                        <div class="wizard-step" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Seleccionar Documento</div>
                        </div>
                        <div class="wizard-step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Analizar con IA</div>
                        </div>
                        <div class="wizard-step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Configurar Campos</div>
                        </div>
                        <div class="wizard-step" data-step="4">
                            <div class="step-number">4</div>
                            <div class="step-label">Generar Workflow</div>
                        </div>
                    </div>
                </div>

                <div class="wizard-body" style="padding: 2rem; min-height: 500px;">
                    <!-- Step 1: Seleccionar Documento -->
                    <div class="wizard-step-content" id="wizardStep1" style="display: none;">
                        <h3><i class="fas fa-file-upload"></i> Paso 1: Seleccionar Documento</h3>
                        <p style="color: #94a3b8; margin-bottom: 2rem;">Sube un documento de ejemplo para entrenar la IA</p>

                        <div class="upload-zone" style="border: 2px dashed #475569; border-radius: 8px; padding: 3rem; text-align: center; background: #1e293b; cursor: pointer;" onclick="document.getElementById('fileInput').click()">
                            <i class="fas fa-cloud-upload-alt" style="font-size: 4rem; color: #6366f1; margin-bottom: 1rem;"></i>
                            <h4 style="margin: 1rem 0;">Arrastra un archivo aquí o haz click para seleccionar</h4>
                            <p style="color: #94a3b8;">Formatos soportados: PDF, PNG, JPG, XLSX, DOCX</p>
                            <input type="file" id="fileInput" style="display: none;" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx" onchange="AIWizard.handleFileUpload(event)">
                        </div>

                        <div id="filePreview" style="margin-top: 2rem; display: none;">
                            <h4>Archivo seleccionado:</h4>
                            <div style="background: #1e293b; padding: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem;">
                                <i class="fas fa-file" id="fileIcon" style="font-size: 2rem; color: #6366f1;"></i>
                                <div style="flex: 1;">
                                    <div id="fileName" style="font-weight: 600;"></div>
                                    <div id="fileSize" style="color: #94a3b8; font-size: 0.9rem;"></div>
                                </div>
                                <button class="btn btn-danger" onclick="AIWizard.clearFile()">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Analizar con IA -->
                    <div class="wizard-step-content" id="wizardStep2" style="display: none;">
                        <h3><i class="fas fa-brain"></i> Paso 2: Análisis Inteligente</h3>
                        <p style="color: #94a3b8; margin-bottom: 2rem;">La IA está analizando tu documento...</p>

                        <div id="aiAnalysisStatus">
                            <div class="analysis-progress" style="text-align: center; padding: 3rem;">
                                <div class="spinner" style="border: 4px solid #475569; border-top: 4px solid #6366f1; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin: 0 auto 2rem;"></div>
                                <h4 id="analysisMessage">Procesando documento...</h4>
                                <p id="analysisDetail" style="color: #94a3b8; margin-top: 0.5rem;">Extrayendo texto e identificando campos</p>

                                <div class="analysis-steps" style="margin-top: 2rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                                    <div class="analysis-step" id="stepOCR" style="padding: 0.75rem; margin: 0.5rem 0; background: #1e293b; border-radius: 4px;">
                                        <i class="fas fa-spinner fa-spin" style="color: #6366f1;"></i> Extrayendo texto (OCR)...
                                    </div>
                                    <div class="analysis-step" id="stepFields" style="padding: 0.75rem; margin: 0.5rem 0; background: #1e293b; border-radius: 4px; opacity: 0.5;">
                                        <i class="fas fa-circle-notch"></i> Identificando campos...
                                    </div>
                                    <div class="analysis-step" id="stepStructure" style="padding: 0.75rem; margin: 0.5rem 0; background: #1e293b; border-radius: 4px; opacity: 0.5;">
                                        <i class="fas fa-circle-notch"></i> Analizando estructura...
                                    </div>
                                    <div class="analysis-step" id="stepWorkflow" style="padding: 0.75rem; margin: 0.5rem 0; background: #1e293b; border-radius: 4px; opacity: 0.5;">
                                        <i class="fas fa-circle-notch"></i> Generando workflow sugerido...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Configurar Campos -->
                    <div class="wizard-step-content" id="wizardStep3" style="display: none;">
                        <h3><i class="fas fa-tasks"></i> Paso 3: Configurar Campos Detectados</h3>
                        <p style="color: #94a3b8; margin-bottom: 2rem;">La IA detectó los siguientes campos. Revisa y ajusta según necesites.</p>

                        <div id="detectedFieldsList" style="display: grid; gap: 1rem;">
                            <!-- Los campos detectados se insertarán aquí -->
                        </div>

                        <button class="btn btn-secondary" onclick="AIWizard.addCustomField()" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Agregar Campo Personalizado
                        </button>
                    </div>

                    <!-- Step 4: Generar Workflow -->
                    <div class="wizard-step-content" id="wizardStep4" style="display: none;">
                        <h3><i class="fas fa-check-circle"></i> Paso 4: Workflow Generado</h3>
                        <p style="color: #94a3b8; margin-bottom: 2rem;">Tu workflow está listo. Revisa el resumen:</p>

                        <div id="workflowSummary" style="background: #1e293b; padding: 2rem; border-radius: 8px;">
                            <!-- Resumen del workflow se insertará aquí -->
                        </div>

                        <div style="margin-top: 2rem; padding: 1.5rem; background: #1e3a5f; border-left: 4px solid #6366f1; border-radius: 4px;">
                            <h4 style="margin-top: 0;"><i class="fas fa-lightbulb"></i> Sugerencias de la IA</h4>
                            <ul id="aiSuggestions" style="margin: 0; padding-left: 1.5rem;">
                                <!-- Sugerencias se insertarán aquí -->
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="wizard-footer" style="padding: 1.5rem; border-top: 1px solid #334155; display: flex; justify-content: space-between; margin: 0 -1.5rem -1.5rem -1.5rem; background: #1e293b; border-radius: 0 0 8px 8px;">
                    <button class="btn btn-secondary" id="btnPrevious" onclick="AIWizard.previousStep()" style="display: none;">
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>
                    <div style="flex: 1;"></div>
                    <button class="btn btn-secondary" onclick="AIWizard.close()" style="margin-right: 1rem;">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" id="btnNext" onclick="AIWizard.nextStep()">
                        Siguiente <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="btn btn-success" id="btnFinish" onclick="AIWizard.finish()" style="display: none;">
                        <i class="fas fa-check"></i> Crear Workflow
                    </button>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .wizard-step {
                    flex: 1;
                    text-align: center;
                    position: relative;
                    opacity: 0.5;
                }

                .wizard-step.active {
                    opacity: 1;
                }

                .wizard-step.completed {
                    opacity: 1;
                }

                .wizard-step::after {
                    content: '';
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    width: 100%;
                    height: 2px;
                    background: rgba(255,255,255,0.2);
                    z-index: -1;
                }

                .wizard-step:last-child::after {
                    display: none;
                }

                .wizard-step .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    margin: 0 auto 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .wizard-step.active .step-number {
                    background: white;
                    color: #6366f1;
                    box-shadow: 0 0 20px rgba(255,255,255,0.5);
                }

                .wizard-step.completed .step-number {
                    background: #10b981;
                    color: white;
                }

                .wizard-step .step-label {
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .upload-zone:hover {
                    background: #2d3748;
                    border-color: #6366f1;
                }

                .field-card {
                    background: #0f172a;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    transition: all 0.2s;
                }

                .field-card:hover {
                    border-color: #6366f1;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
            </style>
        `;

        return modal;
    },

    // Mostrar paso específico
    showStep(step) {
        this.currentStep = step;

        // Ocultar todos los pasos
        document.querySelectorAll('.wizard-step-content').forEach(el => el.style.display = 'none');

        // Mostrar paso actual
        const currentStepEl = document.getElementById(`wizardStep${step}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }

        // Actualizar indicadores de progreso
        document.querySelectorAll('.wizard-step').forEach((el, index) => {
            el.classList.remove('active', 'completed');
            if (index + 1 === step) {
                el.classList.add('active');
            } else if (index + 1 < step) {
                el.classList.add('completed');
                el.querySelector('.step-number').innerHTML = '<i class="fas fa-check"></i>';
            } else {
                el.querySelector('.step-number').textContent = index + 1;
            }
        });

        // Actualizar botones
        const btnPrevious = document.getElementById('btnPrevious');
        const btnNext = document.getElementById('btnNext');
        const btnFinish = document.getElementById('btnFinish');

        btnPrevious.style.display = step > 1 ? 'inline-block' : 'none';
        btnNext.style.display = step < this.totalSteps ? 'inline-block' : 'none';
        btnFinish.style.display = step === this.totalSteps ? 'inline-block' : 'none';
    },

    // Siguiente paso
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            if (this.validateStep(this.currentStep)) {
                if (this.currentStep === 1) {
                    // Iniciar análisis
                    this.showStep(2);
                    this.startAnalysis();
                } else {
                    this.showStep(this.currentStep + 1);
                }
            }
        }
    },

    // Paso anterior
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },

    // Validar paso
    validateStep(step) {
        switch (step) {
            case 1:
                const fileInput = document.getElementById('fileInput');
                if (!fileInput.files || fileInput.files.length === 0) {
                    showNotification('Por favor selecciona un archivo', 'error');
                    return false;
                }
                return true;
            default:
                return true;
        }
    },

    // Manejar subida de archivo
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const preview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileIcon = document.getElementById('fileIcon');

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        // Cambiar icono según tipo
        const ext = file.name.split('.').pop().toLowerCase();
        const iconMap = {
            pdf: 'fa-file-pdf',
            png: 'fa-file-image',
            jpg: 'fa-file-image',
            jpeg: 'fa-file-image',
            xlsx: 'fa-file-excel',
            docx: 'fa-file-word'
        };
        fileIcon.className = `fas ${iconMap[ext] || 'fa-file'}`;

        preview.style.display = 'block';
    },

    // Limpiar archivo
    clearFile() {
        document.getElementById('fileInput').value = '';
        document.getElementById('filePreview').style.display = 'none';
    },

    // Iniciar análisis
    async startAnalysis() {
        const steps = ['stepOCR', 'stepFields', 'stepStructure', 'stepWorkflow'];
        const messages = [
            { msg: 'Extrayendo texto...', detail: 'OCR en progreso' },
            { msg: 'Identificando campos...', detail: 'Análisis de datos estructurados' },
            { msg: 'Analizando estructura...', detail: 'Detectando patrones' },
            { msg: 'Generando workflow...', detail: 'Creando acciones automáticas' }
        ];

        for (let i = 0; i < steps.length; i++) {
            await this.simulateStep(steps[i], messages[i]);
        }

        // Simular datos extraídos
        this.extractionData = {
            fields: [
                { name: 'invoice_number', label: 'Número de Factura', type: 'text', confidence: 0.95, value: 'INV-2025-001' },
                { name: 'invoice_date', label: 'Fecha de Factura', type: 'date', confidence: 0.92, value: '2025-01-15' },
                { name: 'total_amount', label: 'Monto Total', type: 'number', confidence: 0.98, value: '1,250.00' },
                { name: 'customer_name', label: 'Nombre del Cliente', type: 'text', confidence: 0.89, value: 'Acme Corporation' },
                { name: 'due_date', label: 'Fecha de Vencimiento', type: 'date', confidence: 0.90, value: '2025-02-15' }
            ],
            documentType: 'Factura',
            confidence: 0.93
        };

        // Ir al siguiente paso
        setTimeout(() => {
            this.showStep(3);
            this.renderDetectedFields();
        }, 500);
    },

    // Simular paso de análisis
    async simulateStep(stepId, message) {
        const stepEl = document.getElementById(stepId);
        const msgEl = document.getElementById('analysisMessage');
        const detailEl = document.getElementById('analysisDetail');

        msgEl.textContent = message.msg;
        detailEl.textContent = message.detail;

        stepEl.style.opacity = '1';
        stepEl.querySelector('i').className = 'fas fa-spinner fa-spin';
        stepEl.style.color = '#6366f1';

        await new Promise(resolve => setTimeout(resolve, 2000));

        stepEl.querySelector('i').className = 'fas fa-check-circle';
        stepEl.style.color = '#10b981';
    },

    // Renderizar campos detectados
    renderDetectedFields() {
        const container = document.getElementById('detectedFieldsList');
        container.innerHTML = '';

        this.extractionData.fields.forEach((field, index) => {
            const card = document.createElement('div');
            card.className = 'field-card';
            card.innerHTML = `
                <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0;">${field.label}</h4>
                            <span style="background: ${this.getConfidenceColor(field.confidence)}; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">
                                ${Math.round(field.confidence * 100)}% confianza
                            </span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                            <div>
                                <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.25rem;">Nombre del Campo</label>
                                <input type="text" class="form-control" value="${field.name}" onchange="AIWizard.updateField(${index}, 'name', this.value)">
                            </div>
                            <div>
                                <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.25rem;">Tipo de Dato</label>
                                <select class="form-control" onchange="AIWizard.updateField(${index}, 'type', this.value)">
                                    <option value="text" ${field.type === 'text' ? 'selected' : ''}>Texto</option>
                                    <option value="number" ${field.type === 'number' ? 'selected' : ''}>Número</option>
                                    <option value="date" ${field.type === 'date' ? 'selected' : ''}>Fecha</option>
                                    <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                                    <option value="phone" ${field.type === 'phone' ? 'selected' : ''}>Teléfono</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 0.25rem;">Valor Detectado</label>
                                <input type="text" class="form-control" value="${field.value}" readonly style="background: #0f172a;">
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="AIWizard.removeField(${index})" title="Eliminar campo">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Obtener color según confianza
    getConfidenceColor(confidence) {
        if (confidence >= 0.9) return '#10b981';
        if (confidence >= 0.7) return '#fbbf24';
        return '#ef4444';
    },

    // Actualizar campo
    updateField(index, property, value) {
        this.extractionData.fields[index][property] = value;
    },

    // Remover campo
    removeField(index) {
        this.extractionData.fields.splice(index, 1);
        this.renderDetectedFields();
    },

    // Agregar campo personalizado
    addCustomField() {
        this.extractionData.fields.push({
            name: 'custom_field',
            label: 'Campo Personalizado',
            type: 'text',
            confidence: 1.0,
            value: ''
        });
        this.renderDetectedFields();
    },

    // Finalizar y crear workflow
    finish() {
        // Generar workflow basado en los campos
        const workflow = this.generateWorkflow();

        // Cerrar wizard
        this.close();

        // Agregar workflow al editor
        WorkflowEditor.currentWorkflow = workflow;
        WorkflowEditor.renderWorkflow();

        showNotification('Workflow generado exitosamente con IA', 'success');
    },

    // Generar workflow
    generateWorkflow() {
        const workflow = [];

        // 1. Leer el documento
        workflow.push({
            type: 'pdf_read',
            filePath: '{documento_entrada}',
            saveType: 'variable',
            saveName: 'texto_pdf'
        });

        // 2. Procesar OCR si es necesario
        workflow.push({
            type: 'ocr_pdf',
            pdfPath: '{documento_entrada}',
            language: 'spa',
            saveType: 'variable',
            saveName: 'texto_ocr'
        });

        // 3. Extraer cada campo
        this.extractionData.fields.forEach(field => {
            workflow.push({
                type: 'set_variable',
                varName: field.name,
                valueType: 'expression',
                value: `extractField('${field.label}', texto_ocr)`
            });
        });

        // 4. Guardar resultados en DataFrame
        workflow.push({
            type: 'db_insert',
            connection: 'default',
            table: 'extracted_data',
            dataSource: 'variable',
            data: JSON.stringify(this.extractionData.fields.map(f => f.name))
        });

        return workflow;
    },

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // Cerrar wizard
    close() {
        const modal = document.getElementById('aiWizardModal');
        if (modal) modal.remove();
    },

    // Adjuntar event listeners
    attachEventListeners() {
        // Drag and drop
        document.addEventListener('DOMContentLoaded', () => {
            const uploadZone = document.querySelector('.upload-zone');
            if (uploadZone) {
                uploadZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadZone.style.background = '#2d3748';
                    uploadZone.style.borderColor = '#6366f1';
                });

                uploadZone.addEventListener('dragleave', (e) => {
                    uploadZone.style.background = '#1e293b';
                    uploadZone.style.borderColor = '#475569';
                });

                uploadZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        document.getElementById('fileInput').files = files;
                        AIWizard.handleFileUpload({ target: { files: files } });
                    }
                    uploadZone.style.background = '#1e293b';
                    uploadZone.style.borderColor = '#475569';
                });
            }
        });
    }
};

// Inicializar
AIWizard.init();
