// 📊 DASHBOARD DE IA - DOCUMENT AUTOMATION AGENT

const AIDashboard = {
    stats: {
        documentsProcessed: 0,
        averageAccuracy: 0,
        workflowsGenerated: 0,
        timeSaved: 0
    },

    processingHistory: [],

    // Inicializar dashboard
    init() {
        this.loadStats();
        this.loadHistory();
        this.updateUI();
    },

    // Cargar estadísticas
    loadStats() {
        const saved = localStorage.getItem('aiDashboardStats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    },

    // Guardar estadísticas
    saveStats() {
        localStorage.setItem('aiDashboardStats', JSON.stringify(this.stats));
    },

    // Cargar historial
    loadHistory() {
        const saved = localStorage.getItem('aiProcessingHistory');
        if (saved) {
            this.processingHistory = JSON.parse(saved);
        }
    },

    // Guardar historial
    saveHistory() {
        localStorage.setItem('aiProcessingHistory', JSON.stringify(this.processingHistory));
    },

    // Actualizar UI
    updateUI() {
        // Actualizar estadísticas
        document.getElementById('totalDocumentsProcessed').textContent = this.stats.documentsProcessed;
        document.getElementById('averageAccuracy').textContent = Math.round(this.stats.averageAccuracy * 100) + '%';
        document.getElementById('totalWorkflowsGenerated').textContent = this.stats.workflowsGenerated;
        document.getElementById('timeSaved').textContent = this.stats.timeSaved + 'h';

        // Actualizar historial
        this.renderHistory();
    },

    // Renderizar historial
    renderHistory() {
        const tbody = document.getElementById('processingHistory');
        if (!tbody) return;

        if (this.processingHistory.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 3rem; text-align: center; color: #64748b;">
                        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No hay documentos procesados aún</p>
                        <button class="btn btn-primary" onclick="AIWizard.open()" style="margin-top: 1rem;">
                            <i class="fas fa-robot"></i> Procesar Primer Documento
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        this.processingHistory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #334155';
            row.innerHTML = `
                <td style="padding: 1rem; color: #e2e8f0;">
                    <i class="fas ${this.getDocumentIcon(item.type)}" style="margin-right: 0.5rem; color: #6366f1;"></i>
                    ${item.documentName}
                </td>
                <td style="padding: 1rem; color: #e2e8f0;">
                    <span style="background: #1e3a5f; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                        ${item.documentType}
                    </span>
                </td>
                <td style="padding: 1rem; color: #e2e8f0;">${item.fieldsExtracted} campos</td>
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="flex: 1; background: #0f172a; height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${item.accuracy * 100}%; height: 100%; background: ${this.getAccuracyColor(item.accuracy)};"></div>
                        </div>
                        <span style="color: ${this.getAccuracyColor(item.accuracy)}; font-weight: 600; font-size: 0.9rem;">
                            ${Math.round(item.accuracy * 100)}%
                        </span>
                    </div>
                </td>
                <td style="padding: 1rem; color: #94a3b8; font-size: 0.9rem;">${this.formatDate(item.date)}</td>
                <td style="padding: 1rem;">
                    <button class="btn btn-sm btn-secondary" onclick="AIDashboard.viewDetails(${index})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="AIDashboard.reprocess(${index})" title="Reprocesar">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="AIDashboard.deleteHistory(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Agregar documento procesado
    addProcessedDocument(data) {
        const item = {
            documentName: data.name,
            documentType: data.type,
            fieldsExtracted: data.fields.length,
            accuracy: data.accuracy,
            date: new Date().toISOString(),
            fields: data.fields
        };

        this.processingHistory.unshift(item);

        // Actualizar estadísticas
        this.stats.documentsProcessed++;
        this.stats.averageAccuracy = ((this.stats.averageAccuracy * (this.stats.documentsProcessed - 1)) + data.accuracy) / this.stats.documentsProcessed;
        this.stats.workflowsGenerated++;
        this.stats.timeSaved += this.estimateTimeSaved(data);

        this.saveStats();
        this.saveHistory();
        this.updateUI();
    },

    // Estimar tiempo ahorrado
    estimateTimeSaved(data) {
        // Estimación: 5 minutos por campo extraído manualmente
        const minutesPerField = 5;
        const totalMinutes = data.fields.length * minutesPerField;
        return Math.round(totalMinutes / 60 * 10) / 10; // horas con 1 decimal
    },

    // Ver detalles de documento
    viewDetails(index) {
        const item = this.processingHistory[index];
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white;">
                    <h3><i class="fas fa-file-alt"></i> Detalles del Documento</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <h4>Información General</h4>
                        <div style="background: #1e293b; padding: 1rem; border-radius: 8px;">
                            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <strong style="color: #94a3b8;">Documento:</strong>
                                <span>${item.documentName}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <strong style="color: #94a3b8;">Tipo:</strong>
                                <span>${item.documentType}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <strong style="color: #94a3b8;">Precisión:</strong>
                                <span style="color: ${this.getAccuracyColor(item.accuracy)};">${Math.round(item.accuracy * 100)}%</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 0.5rem;">
                                <strong style="color: #94a3b8;">Fecha:</strong>
                                <span>${this.formatDate(item.date)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4>Campos Extraídos (${item.fieldsExtracted})</h4>
                        <div style="display: grid; gap: 0.75rem;">
                            ${item.fields.map(field => `
                                <div style="background: #1e293b; padding: 1rem; border-radius: 8px; border-left: 4px solid #6366f1;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <strong>${field.label}</strong>
                                        <span style="background: ${this.getConfidenceColor(field.confidence)}; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem;">
                                            ${Math.round(field.confidence * 100)}%
                                        </span>
                                    </div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">
                                        <span style="color: #cbd5e1;">${field.value}</span>
                                        <span style="margin-left: 1rem; color: #64748b;">(${field.type})</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Reprocesar documento
    reprocess(index) {
        const item = this.processingHistory[index];
        if (!item) return;

        if (confirm(`¿Reprocesar "${item.documentName}"?`)) {
            showNotification('Reprocesando documento...', 'info');
            // Aquí iría la lógica de reprocesamiento
            setTimeout(() => {
                showNotification('Documento reprocesado exitosamente', 'success');
            }, 2000);
        }
    },

    // Eliminar del historial
    deleteHistory(index) {
        if (confirm('¿Eliminar este registro del historial?')) {
            this.processingHistory.splice(index, 1);
            this.saveHistory();
            this.renderHistory();
            showNotification('Registro eliminado', 'success');
        }
    },

    // Entrenar modelo
    trainModel() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">
                    <h3><i class="fas fa-graduation-cap"></i> Entrenar Modelo de IA</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: #94a3b8; margin-bottom: 2rem;">
                        Mejora la precisión del modelo subiendo documentos de ejemplo etiquetados correctamente.
                    </p>

                    <div class="upload-zone" style="border: 2px dashed #475569; border-radius: 8px; padding: 3rem; text-align: center; background: #1e293b; cursor: pointer;">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 4rem; color: #10b981; margin-bottom: 1rem;"></i>
                        <h4>Sube documentos de entrenamiento</h4>
                        <p style="color: #94a3b8;">Arrastra archivos aquí o haz click para seleccionar</p>
                        <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" style="display: none;">
                    </div>

                    <div style="margin-top: 2rem; padding: 1rem; background: #1e3a5f; border-radius: 4px; border-left: 4px solid #6366f1;">
                        <h4 style="margin-top: 0;"><i class="fas fa-lightbulb"></i> Consejos para mejor entrenamiento:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem; color: #cbd5e1;">
                            <li>Usa al menos 10-20 documentos de ejemplo</li>
                            <li>Asegúrate que los documentos sean del mismo tipo</li>
                            <li>Verifica que los valores estén correctos</li>
                            <li>Incluye variaciones de formato si es posible</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn btn-success">
                        <i class="fas fa-brain"></i> Iniciar Entrenamiento
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Procesamiento por lotes
    batchProcess() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">
                    <h3><i class="fas fa-layer-group"></i> Procesamiento por Lotes</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: #94a3b8; margin-bottom: 2rem;">
                        Procesa múltiples documentos a la vez con el mismo workflow.
                    </p>

                    <div class="form-group">
                        <label>Seleccionar Workflow:</label>
                        <select class="form-control">
                            <option value="">Selecciona un workflow...</option>
                            <option value="invoices">Extracción de Facturas</option>
                            <option value="receipts">Extracción de Recibos</option>
                            <option value="forms">Formularios Generales</option>
                        </select>
                    </div>

                    <div class="upload-zone" style="border: 2px dashed #475569; border-radius: 8px; padding: 3rem; text-align: center; background: #1e293b; cursor: pointer; margin-top: 1rem;">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 4rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                        <h4>Sube documentos para procesar</h4>
                        <p style="color: #94a3b8;">Arrastra archivos aquí o haz click para seleccionar</p>
                        <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx" style="display: none;">
                    </div>

                    <div style="margin-top: 2rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #cbd5e1;">Archivos seleccionados:</span>
                            <span style="color: #6366f1; font-weight: 600;">0</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button class="btn btn-primary" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none;">
                        <i class="fas fa-play"></i> Iniciar Procesamiento
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // Obtener icono de documento
    getDocumentIcon(type) {
        const icons = {
            'Factura': 'fa-file-invoice',
            'Recibo': 'fa-receipt',
            'Formulario': 'fa-file-alt',
            'PDF': 'fa-file-pdf',
            'Excel': 'fa-file-excel',
            'Imagen': 'fa-file-image'
        };
        return icons[type] || 'fa-file';
    },

    // Obtener color según precisión
    getAccuracyColor(accuracy) {
        if (accuracy >= 0.9) return '#10b981';
        if (accuracy >= 0.7) return '#fbbf24';
        return '#ef4444';
    },

    // Obtener color según confianza
    getConfidenceColor(confidence) {
        if (confidence >= 0.9) return '#10b981';
        if (confidence >= 0.7) return '#fbbf24';
        return '#ef4444';
    },

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;

        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
};

// Inicializar cuando se carga el dashboard
document.addEventListener('DOMContentLoaded', () => {
    AIDashboard.init();
});

// Actualizar cuando cambia de vista
window.addEventListener('message', (event) => {
    if (event.data.type === 'VIEW_CHANGED' && event.data.view === 'ai-dashboard') {
        AIDashboard.updateUI();
    }
});
