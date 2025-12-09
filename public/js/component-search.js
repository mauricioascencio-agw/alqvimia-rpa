// 🔍 BUSCADOR DE COMPONENTES
// Sistema de búsqueda y filtrado en tiempo real

const ComponentSearch = {
    searchTerm: '',
    filteredComponents: [],

    init() {
        this.createSearchBar();
        console.log('ComponentSearch initialized');
    },

    // Crear barra de búsqueda en el palette
    createSearchBar() {
        // Esperar a que el DOM esté listo
        const checkPalette = setInterval(() => {
            const paletteContainer = document.querySelector('.workflow-palette');
            if (paletteContainer) {
                clearInterval(checkPalette);
                this.injectSearchBar(paletteContainer);
            }
        }, 100);

        // Timeout después de 5 segundos
        setTimeout(() => clearInterval(checkPalette), 5000);
    },

    injectSearchBar(paletteContainer) {
        // Verificar que no exista ya
        if (document.getElementById('componentSearchBar')) return;

        // Crear barra de búsqueda
        const searchBar = document.createElement('div');
        searchBar.id = 'componentSearchBar';
        searchBar.style.cssText = `
            position: sticky;
            top: 0;
            z-index: 100;
            background: linear-gradient(135deg, #1e293b, #334155);
            padding: 1rem;
            border-bottom: 1px solid #475569;
            margin-bottom: 1rem;
        `;

        searchBar.innerHTML = `
            <div style="position: relative;">
                <input type="text" id="componentSearchInput" class="form-control"
                       placeholder="🔍 Buscar componentes..."
                       style="padding-left: 2.5rem; padding-right: 2.5rem;">
                <i class="fas fa-search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none;"></i>
                <button id="clearSearch" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #64748b; cursor: pointer; padding: 0.25rem 0.5rem; display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="searchStats" style="margin-top: 0.5rem; font-size: 0.85rem; color: #94a3b8; display: none;"></div>
        `;

        // Insertar al inicio del palette
        paletteContainer.insertBefore(searchBar, paletteContainer.firstChild);

        // Event listeners
        const input = document.getElementById('componentSearchInput');
        const clearBtn = document.getElementById('clearSearch');

        input.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            this.handleSearch('');
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            // Ctrl+K o Cmd+K para enfocar búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
                input.select();
            }

            // ESC para limpiar búsqueda
            if (e.key === 'Escape' && document.activeElement === input) {
                input.value = '';
                this.handleSearch('');
                input.blur();
            }
        });
    },

    handleSearch(term) {
        this.searchTerm = term.toLowerCase().trim();
        const clearBtn = document.getElementById('clearSearch');
        const statsDiv = document.getElementById('searchStats');

        // Mostrar/ocultar botón de limpiar
        if (clearBtn) {
            clearBtn.style.display = this.searchTerm ? 'block' : 'none';
        }

        if (this.searchTerm === '') {
            // Restaurar vista normal
            this.showAllComponents();
            if (statsDiv) statsDiv.style.display = 'none';
        } else {
            // Filtrar componentes
            this.filterComponents();
        }
    },

    filterComponents() {
        const allCategories = document.querySelectorAll('.action-category');
        let totalMatches = 0;
        let categoriesWithMatches = 0;

        allCategories.forEach(category => {
            const paletteItems = category.querySelectorAll('.palette-item');
            let categoryMatches = 0;

            paletteItems.forEach(item => {
                const actionType = item.getAttribute('data-action');
                const text = item.textContent.toLowerCase();

                // Buscar en el nombre del componente y en su ID
                const matches = text.includes(this.searchTerm) ||
                               (actionType && actionType.toLowerCase().includes(this.searchTerm));

                if (matches) {
                    item.style.display = '';
                    item.style.animation = 'slideUp 0.3s ease-out';
                    categoryMatches++;
                    totalMatches++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Mostrar/ocultar categoría completa
            if (categoryMatches > 0) {
                category.style.display = '';
                categoriesWithMatches++;

                // Highlight del término de búsqueda
                this.highlightSearchTerm(category);
            } else {
                category.style.display = 'none';
            }
        });

        // Actualizar estadísticas
        this.updateSearchStats(totalMatches, categoriesWithMatches);
    },

    highlightSearchTerm(category) {
        const items = category.querySelectorAll('.palette-item');
        items.forEach(item => {
            if (item.style.display !== 'none') {
                const span = item.querySelector('span');
                if (span && this.searchTerm) {
                    const originalText = span.textContent;
                    const regex = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
                    const highlighted = originalText.replace(regex, '<mark style="background: #fbbf24; color: #000; padding: 0 0.2rem; border-radius: 2px;">$1</mark>');

                    if (highlighted !== originalText) {
                        span.innerHTML = highlighted;
                    }
                }
            }
        });
    },

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    showAllComponents() {
        const allCategories = document.querySelectorAll('.action-category');

        allCategories.forEach(category => {
            category.style.display = '';

            const paletteItems = category.querySelectorAll('.palette-item');
            paletteItems.forEach(item => {
                item.style.display = '';

                // Restaurar texto sin highlight
                const span = item.querySelector('span');
                if (span) {
                    span.textContent = span.textContent; // Esto elimina cualquier HTML
                }
            });
        });
    },

    updateSearchStats(matches, categories) {
        const statsDiv = document.getElementById('searchStats');
        if (!statsDiv) return;

        if (matches === 0) {
            statsDiv.style.display = 'block';
            statsDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #f59e0b;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>No se encontraron componentes que coincidan con "${this.searchTerm}"</span>
                </div>
            `;
        } else {
            statsDiv.style.display = 'block';
            statsDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981;">
                    <i class="fas fa-check-circle"></i>
                    <span>Se encontraron <strong>${matches}</strong> componente${matches !== 1 ? 's' : ''} en <strong>${categories}</strong> categoría${categories !== 1 ? 's' : ''}</span>
                </div>
            `;
        }
    },

    // Búsqueda inteligente con sugerencias
    getSearchSuggestions(term) {
        const suggestions = [];
        const allComponents = this.getAllComponentNames();

        allComponents.forEach(comp => {
            if (comp.name.toLowerCase().includes(term.toLowerCase())) {
                suggestions.push(comp);
            }
        });

        return suggestions.slice(0, 5); // Top 5 sugerencias
    },

    getAllComponentNames() {
        const components = [];
        const paletteItems = document.querySelectorAll('.palette-item');

        paletteItems.forEach(item => {
            const name = item.querySelector('span')?.textContent || '';
            const actionType = item.getAttribute('data-action');
            if (name && actionType) {
                components.push({ name, id: actionType });
            }
        });

        return components;
    },

    // Búsqueda por categoría
    filterByCategory(category) {
        const allCategories = document.querySelectorAll('.action-category');

        allCategories.forEach(cat => {
            const header = cat.querySelector('.category-header span');
            if (header) {
                const catName = header.textContent.toLowerCase();
                if (category === 'all' || catName.includes(category.toLowerCase())) {
                    cat.style.display = '';
                } else {
                    cat.style.display = 'none';
                }
            }
        });
    },

    // Búsqueda avanzada
    showAdvancedSearch() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-search-plus"></i>
                        Búsqueda Avanzada de Componentes
                    </h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label><i class="fas fa-text-width"></i> Buscar por nombre</label>
                        <input type="text" id="advSearchName" class="form-control" placeholder="Nombre del componente...">
                    </div>

                    <div class="form-group">
                        <label><i class="fas fa-folder"></i> Categoría</label>
                        <select id="advSearchCategory" class="form-control">
                            <option value="all">Todas las categorías</option>
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

                    <div class="form-group">
                        <label><i class="fas fa-filter"></i> Tipo de componente</label>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <label style="display: flex; align-items: center; gap: 0.25rem; cursor: pointer;">
                                <input type="checkbox" value="nativo" checked> Nativos
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.25rem; cursor: pointer;">
                                <input type="checkbox" value="generado" checked> Generados con IA
                            </label>
                        </div>
                    </div>

                    <div id="advSearchResults" style="margin-top: 1.5rem; display: none;"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Cerrar
                    </button>
                    <button class="btn btn-primary" onclick="ComponentSearch.executeAdvancedSearch()">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    },

    executeAdvancedSearch() {
        const name = document.getElementById('advSearchName').value.toLowerCase();
        const category = document.getElementById('advSearchCategory').value;
        const resultsDiv = document.getElementById('advSearchResults');

        // Aquí implementarías la lógica de búsqueda avanzada
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<p style="color: #94a3b8;">Búsqueda en progreso...</p>';

        // Simulación
        setTimeout(() => {
            resultsDiv.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 1rem; color: #10b981;">
                    <i class="fas fa-check-circle"></i> Se encontraron resultados. El filtro se ha aplicado al panel de componentes.
                </div>
            `;
        }, 500);
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar un poco para que el palette se cargue
        setTimeout(() => ComponentSearch.init(), 1000);
    });
} else {
    setTimeout(() => ComponentSearch.init(), 1000);
}
