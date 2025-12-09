// 🗄️ GESTOR DE DATAFRAMES Y ARCHIVOS TEMPORALES

// Estado global de DataFrames
let dataFramesStore = [];

// Toggle sección de DataFrames
function toggleDataFramesSection() {
    const content = document.getElementById('dataframesContent');
    const isVisible = content.style.display !== 'none';
    content.style.display = isVisible ? 'none' : 'block';

    // Guardar estado en localStorage
    localStorage.setItem('dataframesSection-visible', !isVisible);
}

// Agregar DataFrame o archivo temporal
function addDataFrame(name, type, data, metadata = {}) {
    const dataFrame = {
        id: generateId(),
        name: name,
        type: type, // 'dataframe', 'json', 'csv', 'excel'
        data: data,
        metadata: {
            rows: metadata.rows || 0,
            columns: metadata.columns || 0,
            size: metadata.size || 0,
            created: new Date().toISOString(),
            ...metadata
        }
    };

    dataFramesStore.push(dataFrame);
    updateDataFramesUI();
    saveDataFramesToStorage();

    return dataFrame.id;
}

// Actualizar UI de DataFrames
function updateDataFramesUI() {
    const countBadge = document.getElementById('dataframesCount');
    const emptyState = document.getElementById('dataframesEmpty');
    const list = document.getElementById('dataframesList');

    const count = dataFramesStore.length;
    countBadge.textContent = count;

    if (count === 0) {
        emptyState.style.display = 'block';
        list.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        list.style.display = 'flex';
        renderDataFramesList();
    }
}

// Renderizar lista de DataFrames
function renderDataFramesList() {
    const list = document.getElementById('dataframesList');
    list.innerHTML = '';

    dataFramesStore.forEach(df => {
        const item = document.createElement('div');
        item.className = 'dataframe-item';
        item.innerHTML = `
            <i class="fas ${getIconForType(df.type)}"></i>
            <div class="dataframe-info">
                <div class="dataframe-name">${df.name}</div>
                <div class="dataframe-meta">
                    ${getMetadataText(df)}
                </div>
            </div>
            <div class="dataframe-actions">
                <button onclick="viewDataFrame('${df.id}')" title="Ver datos">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="exportDataFrame('${df.id}')" title="Exportar">
                    <i class="fas fa-download"></i>
                </button>
                <button class="delete" onclick="deleteDataFrame('${df.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Obtener icono según tipo
function getIconForType(type) {
    const icons = {
        dataframe: 'fa-table',
        json: 'fa-file-code',
        csv: 'fa-file-csv',
        excel: 'fa-file-excel',
        pdf: 'fa-file-pdf',
        text: 'fa-file-alt'
    };
    return icons[type] || 'fa-file';
}

// Obtener texto de metadata
function getMetadataText(df) {
    const parts = [];

    if (df.metadata.rows) {
        parts.push(`${df.metadata.rows} filas`);
    }
    if (df.metadata.columns) {
        parts.push(`${df.metadata.columns} columnas`);
    }
    if (df.metadata.size) {
        parts.push(formatBytes(df.metadata.size));
    }

    parts.push(formatDate(df.metadata.created));

    return parts.join(' • ');
}

// Formatear bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString();
}

// Ver DataFrame
function viewDataFrame(id) {
    const df = dataFramesStore.find(d => d.id === id);
    if (!df) return;

    // Crear modal para mostrar datos
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 90%;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3><i class="fas ${getIconForType(df.type)}"></i> ${df.name}</h3>
            <div style="overflow: auto; max-height: 70vh;">
                <pre style="background: #0f172a; padding: 1rem; border-radius: 4px; color: #e2e8f0;">${formatDataForView(df)}</pre>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Formatear datos para visualización
function formatDataForView(df) {
    if (typeof df.data === 'string') {
        return df.data;
    }
    return JSON.stringify(df.data, null, 2);
}

// Exportar DataFrame
function exportDataFrame(id) {
    const df = dataFramesStore.find(d => d.id === id);
    if (!df) return;

    let content = '';
    let mimeType = 'text/plain';
    let extension = '.txt';

    if (df.type === 'json' || df.type === 'dataframe') {
        content = JSON.stringify(df.data, null, 2);
        mimeType = 'application/json';
        extension = '.json';
    } else if (df.type === 'csv') {
        content = df.data;
        mimeType = 'text/csv';
        extension = '.csv';
    } else {
        content = typeof df.data === 'string' ? df.data : JSON.stringify(df.data);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = df.name + extension;
    a.click();
    URL.revokeObjectURL(url);
}

// Eliminar DataFrame
function deleteDataFrame(id) {
    if (!confirm('¿Eliminar este DataFrame?')) return;

    dataFramesStore = dataFramesStore.filter(d => d.id !== id);
    updateDataFramesUI();
    saveDataFramesToStorage();
}

// Obtener DataFrame por nombre
function getDataFrame(name) {
    return dataFramesStore.find(d => d.name === name);
}

// Guardar en localStorage
function saveDataFramesToStorage() {
    try {
        localStorage.setItem('dataFramesStore', JSON.stringify(dataFramesStore));
    } catch (error) {
        console.error('Error guardando DataFrames:', error);
    }
}

// Cargar desde localStorage
function loadDataFramesFromStorage() {
    try {
        const stored = localStorage.getItem('dataFramesStore');
        if (stored) {
            dataFramesStore = JSON.parse(stored);
            updateDataFramesUI();
        }
    } catch (error) {
        console.error('Error cargando DataFrames:', error);
    }
}

// Generar ID único
function generateId() {
    return 'df_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar DataFrames guardados
    loadDataFramesFromStorage();

    // Restaurar estado de visibilidad
    const wasVisible = localStorage.getItem('dataframesSection-visible') === 'true';
    if (wasVisible) {
        document.getElementById('dataframesContent').style.display = 'block';
    }
});

// Exponer funciones globalmente para uso en acciones
window.DataFramesManager = {
    add: addDataFrame,
    get: getDataFrame,
    delete: deleteDataFrame,
    export: exportDataFrame,
    view: viewDataFrame,
    getAll: () => dataFramesStore
};
