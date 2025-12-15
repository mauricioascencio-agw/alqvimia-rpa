# 🚀 MEJORAS PARA EDITOR DE WORKFLOWS

## ✅ Tareas Solicitadas

1. ✅ **Highlight de elementos** - COMPLETADO (ver solución abajo)
2. 📋 **Cargar workflows existentes de carpeta**
3. 🗑️ **Botón eliminar workflow con confirmación**
4. 📁 **Vista carpetas vs lista**
5. ⚡ **Más acciones disponibles** (Excel, PDF, DB, Scripts, IF, FOR, Variables)

---

## 1️⃣ HIGHLIGHT ARREGLADO ✅

### Cambio Realizado:

**Archivo:** `chrome-extension/injected-recorder.js`

**Antes:**
```javascript
// Solo mostraba highlight con Ctrl presionado
if (e.ctrlKey || e.shiftKey) {
  highlightElement(e.target);
} else {
  hideHighlight();
}
```

**Ahora:**
```javascript
// 🆕 SIEMPRE mostrar highlight cuando esté grabando
highlightElement(e.target);
```

### Para Aplicar:
1. Chrome → `chrome://extensions/`
2. Click en **"Actualizar"** (🔄) en la extensión
3. Recargar la página web (F5)

---

## 2️⃣ CARGAR WORKFLOWS EXISTENTES

### Nuevo Método para `workflow-editor.js`:

```javascript
// 🆕 Cargar lista de workflows guardados
async loadWorkflowList() {
    try {
        const response = await fetch('http://localhost:3000/api/workflows/list');
        const data = await response.json();

        if (data.success) {
            this.workflows = data.workflows;
            this.renderWorkflowList();
        }
    } catch (error) {
        console.error('Error cargando workflows:', error);
        showNotification('Error cargando workflows', 'error');
    }
},

// 🆕 Renderizar lista de workflows
renderWorkflowList() {
    const container = document.getElementById('workflowListContainer');

    if (!this.workflows || this.workflows.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #64748b;">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No hay workflows guardados</p>
                <p style="font-size: 0.9rem;">Crea uno nuevo o graba acciones con la extensión</p>
            </div>
        `;
        return;
    }

    container.innerHTML = this.workflows.map(wf => `
        <div class="workflow-card" onclick="WorkflowEditor.loadWorkflowById('${wf.name}')">
            <div class="workflow-icon">
                <i class="fas fa-project-diagram"></i>
            </div>
            <div class="workflow-info">
                <h3>${wf.name}</h3>
                <p>${wf.actionCount || 0} acciones</p>
                <small>${new Date(wf.createdAt).toLocaleDateString()}</small>
            </div>
            <div class="workflow-actions">
                <button onclick="event.stopPropagation(); WorkflowEditor.deleteWorkflow('${wf.name}')"
                        class="btn-delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
},
```

### Endpoint Necesario en `server/index.js`:

```javascript
// 🆕 Listar workflows guardados
app.get('/api/workflows/list', async (req, res) => {
    try {
        const workflowsPath = path.join(__dirname, '..', 'workflows');

        // Verificar que exista la carpeta
        if (!fs.existsSync(workflowsPath)) {
            return res.json({ success: true, workflows: [] });
        }

        const folders = await fs.readdir(workflowsPath);
        const workflows = [];

        for (const folder of folders) {
            const folderPath = path.join(workflowsPath, folder);
            const stats = await fs.stat(folderPath);

            if (stats.isDirectory()) {
                const mainJsonPath = path.join(folderPath, 'main.json');

                if (fs.existsSync(mainJsonPath)) {
                    const mainJson = JSON.parse(await fs.readFile(mainJsonPath, 'utf-8'));

                    workflows.push({
                        name: folder,
                        actionCount: mainJson.totalActions || 0,
                        createdAt: mainJson.createdAt || stats.birthtime,
                        path: folderPath
                    });
                }
            }
        }

        res.json({ success: true, workflows });
    } catch (error) {
        console.error('Error listando workflows:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🆕 Obtener workflow por nombre
app.get('/api/workflows/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const workflowPath = path.join(__dirname, '..', 'workflows', name);

        if (!fs.existsSync(workflowPath)) {
            return res.status(404).json({ success: false, error: 'Workflow no encontrado' });
        }

        const mainJsonPath = path.join(workflowPath, 'main.json');
        const mainJson = JSON.parse(await fs.readFile(mainJsonPath, 'utf-8'));

        res.json({ success: true, workflow: mainJson });
    } catch (error) {
        console.error('Error cargando workflow:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

---

## 3️⃣ BOTÓN ELIMINAR WORKFLOW CON CONFIRMACIÓN

### Método para `workflow-editor.js`:

```javascript
// 🆕 Eliminar workflow con confirmación
async deleteWorkflow(workflowName) {
    // Modal de confirmación personalizado
    const confirmed = await this.showConfirmDialog(
        '¿Eliminar Workflow?',
        `¿Estás seguro de eliminar "${workflowName}"? Esta acción no se puede deshacer.`,
        'Eliminar',
        'Cancelar',
        'danger'
    );

    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/api/workflows/${workflowName}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Workflow eliminado exitosamente', 'success');
            this.loadWorkflowList(); // Recargar lista
        } else {
            showNotification('Error al eliminar workflow', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
},

// 🆕 Modal de confirmación
showConfirmDialog(title, message, confirmText, cancelText, type = 'warning') {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const colors = {
            danger: { bg: '#ef4444', hover: '#dc2626' },
            warning: { bg: '#f59e0b', hover: '#d97706' },
            info: { bg: '#3b82f6', hover: '#2563eb' }
        };

        const color = colors[type] || colors.warning;

        modal.innerHTML = `
            <div style="background: #1e293b; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%;">
                <h2 style="margin: 0 0 1rem; color: white;">${title}</h2>
                <p style="color: #cbd5e1; margin-bottom: 2rem;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="cancelBtn" style="
                        padding: 0.75rem 1.5rem;
                        background: #475569;
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                        font-weight: bold;
                    ">${cancelText}</button>
                    <button id="confirmBtn" style="
                        padding: 0.75rem 1.5rem;
                        background: ${color.bg};
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                        font-weight: bold;
                    ">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#confirmBtn').onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };

        modal.querySelector('#cancelBtn').onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve(false);
            }
        };
    });
},
```

### Endpoint DELETE en `server/index.js`:

```javascript
// 🆕 Eliminar workflow
app.delete('/api/workflows/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const workflowPath = path.join(__dirname, '..', 'workflows', name);

        if (!fs.existsSync(workflowPath)) {
            return res.status(404).json({ success: false, error: 'Workflow no encontrado' });
        }

        // Eliminar carpeta completa recursivamente
        await fs.rm(workflowPath, { recursive: true, force: true });

        res.json({ success: true, message: 'Workflow eliminado' });
    } catch (error) {
        console.error('Error eliminando workflow:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

---

## 4️⃣ VISTA CARPETAS VS LISTA

### HTML para Toggle de Vista:

```html
<div id="viewToggle" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
    <button id="viewGrid" class="view-toggle-btn active" onclick="WorkflowEditor.setView('grid')">
        <i class="fas fa-th-large"></i> Carpetas
    </button>
    <button id="viewList" class="view-toggle-btn" onclick="WorkflowEditor.setView('list')">
        <i class="fas fa-list"></i> Lista
    </button>
</div>

<div id="workflowListContainer"></div>
```

### CSS para las Vistas:

```css
/* Vista de Carpetas */
.workflows-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.workflow-card {
    background: #1e293b;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
}

.workflow-card:hover {
    border-color: #3b82f6;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.workflow-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

/* Vista de Lista */
.workflows-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.workflow-list-item {
    background: #1e293b;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 0.2s;
}

.workflow-list-item:hover {
    background: #334155;
}

.view-toggle-btn {
    padding: 0.5rem 1rem;
    background: #334155;
    border: none;
    border-radius: 6px;
    color: #cbd5e1;
    cursor: pointer;
    transition: all 0.2s;
}

.view-toggle-btn.active {
    background: #3b82f6;
    color: white;
}
```

### Método JavaScript:

```javascript
// 🆕 Cambiar vista
setView(viewType) {
    this.currentView = viewType;

    // Actualizar botones
    document.getElementById('viewGrid').classList.toggle('active', viewType === 'grid');
    document.getElementById('viewList').classList.toggle('active', viewType === 'list');

    // Renderizar según vista
    this.renderWorkflowList();
},

// 🆕 Renderizar según vista actual
renderWorkflowList() {
    const container = document.getElementById('workflowListContainer');

    if (!this.workflows || this.workflows.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: #64748b;"></i>
                <p style="color: #64748b; margin-top: 1rem;">No hay workflows guardados</p>
            </div>
        `;
        return;
    }

    if (this.currentView === 'grid') {
        container.className = 'workflows-grid';
        container.innerHTML = this.workflows.map(wf => `
            <div class="workflow-card" onclick="WorkflowEditor.loadWorkflowById('${wf.name}')">
                <div class="workflow-icon">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="workflow-info">
                    <h3 style="margin: 0 0 0.5rem;">${wf.name}</h3>
                    <p style="color: #cbd5e1; font-size: 0.9rem; margin: 0 0 0.25rem;">
                        ${wf.actionCount || 0} acciones
                    </p>
                    <small style="color: #64748b;">
                        ${new Date(wf.createdAt).toLocaleDateString()}
                    </small>
                </div>
                <button onclick="event.stopPropagation(); WorkflowEditor.deleteWorkflow('${wf.name}')"
                        style="margin-top: 1rem; padding: 0.5rem; width: 100%; background: #ef4444; border: none; border-radius: 6px; color: white; cursor: pointer;">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `).join('');
    } else {
        container.className = 'workflows-list';
        container.innerHTML = this.workflows.map(wf => `
            <div class="workflow-list-item" onclick="WorkflowEditor.loadWorkflowById('${wf.name}')">
                <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                    <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-project-diagram"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; color: white;">${wf.name}</h4>
                        <small style="color: #64748b;">
                            ${wf.actionCount || 0} acciones • ${new Date(wf.createdAt).toLocaleDateString()}
                        </small>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); WorkflowEditor.deleteWorkflow('${wf.name}')"
                        style="padding: 0.5rem 1rem; background: #ef4444; border: none; border-radius: 6px; color: white; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
},
```

---

## 5️⃣ ACCIONES AVANZADAS

### Nuevas Acciones a Agregar:

```javascript
const ADVANCED_ACTIONS = {
    // 📊 EXCEL
    excel_read: {
        icon: 'fa-file-excel',
        name: 'Leer Excel',
        category: 'excel',
        config: ['filePath', 'sheetName', 'range']
    },
    excel_write: {
        icon: 'fa-file-excel',
        name: 'Escribir Excel',
        category: 'excel',
        config: ['filePath', 'sheetName', 'data', 'startCell']
    },

    // 📄 PDF
    pdf_read: {
        icon: 'fa-file-pdf',
        name: 'Extraer Texto PDF',
        category: 'pdf',
        config: ['filePath', 'pages']
    },
    pdf_create: {
        icon: 'fa-file-pdf',
        name: 'Crear PDF',
        category: 'pdf',
        config: ['htmlContent', 'outputPath']
    },

    // 🗄️ BASE DE DATOS
    db_connect: {
        icon: 'fa-database',
        name: 'Conectar DB',
        category: 'database',
        config: ['type', 'host', 'database', 'user', 'password']
    },
    db_query: {
        icon: 'fa-database',
        name: 'Consulta SQL',
        category: 'database',
        config: ['connection', 'query']
    },
    db_insert: {
        icon: 'fa-database',
        name: 'Insertar Datos',
        category: 'database',
        config: ['connection', 'table', 'data']
    },

    // 🔀 CONTROL DE FLUJO
    if_condition: {
        icon: 'fa-code-branch',
        name: 'IF (Condición)',
        category: 'control',
        config: ['condition', 'thenActions', 'elseActions']
    },
    for_loop: {
        icon: 'fa-sync',
        name: 'FOR (Bucle)',
        category: 'control',
        config: ['variable', 'from', 'to', 'step', 'actions']
    },
    while_loop: {
        icon: 'fa-redo',
        name: 'WHILE (Mientras)',
        category: 'control',
        config: ['condition', 'actions', 'maxIterations']
    },

    // 📦 VARIABLES
    set_variable: {
        icon: 'fa-cube',
        name: 'Establecer Variable',
        category: 'variables',
        config: ['varName', 'value', 'type']
    },
    get_variable: {
        icon: 'fa-cube',
        name: 'Obtener Variable',
        category: 'variables',
        config: ['varName']
    },

    // 💻 SCRIPTS
    run_javascript: {
        icon: 'fa-code',
        name: 'JavaScript',
        category: 'scripts',
        config: ['code']
    },
    run_python: {
        icon: 'fa-code',
        name: 'Python',
        category: 'scripts',
        config: ['scriptPath', 'args']
    },
    run_powershell: {
        icon: 'fa-terminal',
        name: 'PowerShell',
        category: 'scripts',
        config: ['command', 'args']
    }
};
```

### HTML para Paleta de Acciones Agrupadas:

```html
<div class="actions-palette">
    <!-- WEB -->
    <div class="action-category">
        <h3><i class="fas fa-globe"></i> Web</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="navigate">
                <i class="fas fa-globe"></i> Navegar
            </div>
            <div class="palette-item" draggable="true" data-action="click">
                <i class="fas fa-mouse-pointer"></i> Click
            </div>
            <div class="palette-item" draggable="true" data-action="type">
                <i class="fas fa-keyboard"></i> Escribir
            </div>
            <div class="palette-item" draggable="true" data-action="wait">
                <i class="fas fa-clock"></i> Esperar
            </div>
            <div class="palette-item" draggable="true" data-action="screenshot">
                <i class="fas fa-camera"></i> Captura
            </div>
            <div class="palette-item" draggable="true" data-action="extract">
                <i class="fas fa-download"></i> Extraer
            </div>
            <div class="palette-item" draggable="true" data-action="scroll">
                <i class="fas fa-arrows-alt-v"></i> Scroll
            </div>
        </div>
    </div>

    <!-- EXCEL -->
    <div class="action-category">
        <h3><i class="fas fa-file-excel"></i> Excel</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="excel_read">
                <i class="fas fa-file-excel"></i> Leer Excel
            </div>
            <div class="palette-item" draggable="true" data-action="excel_write">
                <i class="fas fa-file-excel"></i> Escribir Excel
            </div>
        </div>
    </div>

    <!-- PDF -->
    <div class="action-category">
        <h3><i class="fas fa-file-pdf"></i> PDF</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="pdf_read">
                <i class="fas fa-file-pdf"></i> Leer PDF
            </div>
            <div class="palette-item" draggable="true" data-action="pdf_create">
                <i class="fas fa-file-pdf"></i> Crear PDF
            </div>
        </div>
    </div>

    <!-- DATABASE -->
    <div class="action-category">
        <h3><i class="fas fa-database"></i> Base de Datos</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="db_connect">
                <i class="fas fa-database"></i> Conectar
            </div>
            <div class="palette-item" draggable="true" data-action="db_query">
                <i class="fas fa-database"></i> Consulta SQL
            </div>
            <div class="palette-item" draggable="true" data-action="db_insert">
                <i class="fas fa-database"></i> Insertar
            </div>
        </div>
    </div>

    <!-- CONTROL DE FLUJO -->
    <div class="action-category">
        <h3><i class="fas fa-code-branch"></i> Control de Flujo</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="if_condition">
                <i class="fas fa-code-branch"></i> IF
            </div>
            <div class="palette-item" draggable="true" data-action="for_loop">
                <i class="fas fa-sync"></i> FOR
            </div>
            <div class="palette-item" draggable="true" data-action="while_loop">
                <i class="fas fa-redo"></i> WHILE
            </div>
        </div>
    </div>

    <!-- VARIABLES -->
    <div class="action-category">
        <h3><i class="fas fa-cube"></i> Variables</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="set_variable">
                <i class="fas fa-cube"></i> Establecer
            </div>
            <div class="palette-item" draggable="true" data-action="get_variable">
                <i class="fas fa-cube"></i> Obtener
            </div>
        </div>
    </div>

    <!-- SCRIPTS -->
    <div class="action-category">
        <h3><i class="fas fa-code"></i> Scripts</h3>
        <div class="action-items">
            <div class="palette-item" draggable="true" data-action="run_javascript">
                <i class="fas fa-code"></i> JavaScript
            </div>
            <div class="palette-item" draggable="true" data-action="run_python">
                <i class="fab fa-python"></i> Python
            </div>
            <div class="palette-item" draggable="true" data-action="run_powershell">
                <i class="fas fa-terminal"></i> PowerShell
            </div>
        </div>
    </div>
</div>
```

### CSS para Categorías:

```css
.action-category {
    margin-bottom: 1.5rem;
}

.action-category h3 {
    margin: 0 0 0.75rem;
    padding: 0.5rem;
    background: #1e293b;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #cbd5e1;
}

.action-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
}

.palette-item {
    padding: 0.75rem;
    background: #334155;
    border-radius: 6px;
    cursor: move;
    text-align: center;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.palette-item:hover {
    background: #475569;
    transform: translateY(-2px);
}

.palette-item i {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}
```

---

## 📦 PAQUETES NECESARIOS

Para implementar las nuevas acciones, necesitarás:

```bash
npm install xlsx              # Para Excel
npm install pdf-parse         # Para leer PDF
npm install pdfkit            # Para crear PDF
npm install mysql2            # Para MySQL
npm install pg                # Para PostgreSQL
npm install sqlite3           # Para SQLite
npm install mongodb           # Para MongoDB
```

---

## 🚀 RESUMEN DE IMPLEMENTACIÓN

### Orden Recomendado:

1. ✅ **Highlight** - Ya está arreglado
2. 📋 **Cargar workflows** - Agregar endpoints en server + método en editor
3. 🗑️ **Eliminar workflow** - Agregar endpoint DELETE + confirmación
4. 📁 **Vista carpetas/lista** - Agregar HTML + CSS + método setView()
5. ⚡ **Acciones avanzadas** - Actualizar paleta + agregar casos en showActionConfigModal()

### Archivos a Modificar:

1. `server/index.js` - Agregar endpoints (list, get, delete)
2. `public/js/workflow-editor.js` - Agregar métodos nuevos
3. `public/index.html` - Actualizar paleta de acciones
4. `chrome-extension/injected-recorder.js` - Ya modificado (highlight)

---

## 📞 SIGUIENTE PASO

¿Quieres que implemente alguna de estas funcionalidades específica ahora? Puedo:

1. Crear los endpoints del servidor
2. Actualizar el workflow-editor.js completo
3. Crear el HTML de la paleta agrupada
4. Implementar casos de configuración para nuevas acciones

¡Dime cuál prefieres y lo hago! 🚀
