// 🤖 SISTEMA DE AGENTES PERSONALIZABLES CON AVATARES

const AgentsManager = {
    agents: [],
    avatars: [
        { id: 'robot1', name: 'Robot Azul', icon: '🤖', type: 'robot' },
        { id: 'robot2', name: 'Robot Dorado', icon: '🦾', type: 'robot' },
        { id: 'bot1', name: 'Bot Amigable', icon: '🦿', type: 'robot' },
        { id: 'ai1', name: 'IA Cerebro', icon: '🧠', type: 'ai' },
        { id: 'ai2', name: 'IA Estrella', icon: '⭐', type: 'ai' },
        { id: 'dog', name: 'Perro', icon: '🐕', type: 'pet' },
        { id: 'cat', name: 'Gato', icon: '🐈', type: 'pet' },
        { id: 'bird', name: 'Pájaro', icon: '🐦', type: 'pet' },
        { id: 'fish', name: 'Pez', icon: '🐠', type: 'pet' },
        { id: 'dragon', name: 'Dragón', icon: '🐉', type: 'pet' },
        { id: 'unicorn', name: 'Unicornio', icon: '🦄', type: 'pet' },
        { id: 'lion', name: 'León', icon: '🦁', type: 'pet' },
        { id: 'eagle', name: 'Águila', icon: '🦅', type: 'pet' },
        { id: 'owl', name: 'Búho', icon: '🦉', type: 'pet' },
        { id: 'rocket', name: 'Cohete', icon: '🚀', type: 'tech' },
        { id: 'lightning', name: 'Rayo', icon: '⚡', type: 'tech' },
        { id: 'gear', name: 'Engranaje', icon: '⚙️', type: 'tech' },
        { id: 'crystal', name: 'Cristal', icon: '💎', type: 'magic' },
        { id: 'fire', name: 'Fuego', icon: '🔥', type: 'magic' }
    ],

    // Inicializar
    init() {
        this.loadAgents();
        this.createAgentsTab();
        console.log('AgentsManager initialized');
    },

    // Cargar agentes guardados
    loadAgents() {
        const saved = localStorage.getItem('custom_agents');
        if (saved) {
            try {
                this.agents = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading agents:', e);
                this.agents = [];
            }
        }
    },

    // Guardar agentes
    saveAgents() {
        localStorage.setItem('custom_agents', JSON.stringify(this.agents));
    },

    // Crear pestaña de agentes en el nav
    createAgentsTab() {
        // Buscar el nav
        const nav = document.querySelector('.sidebar nav');
        if (!nav) return;

        // Crear item de navegación
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-view', 'agents');
        navItem.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>Agentes</span>
        `;

        // Insertar antes de "Biblioteca"
        const libraryItem = document.querySelector('.nav-item[data-view="library"]');
        if (libraryItem) {
            nav.insertBefore(navItem, libraryItem);
        } else {
            nav.appendChild(navItem);
        }

        // Crear vista de agentes
        this.createAgentsView();

        // Agregar event listener
        navItem.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.getElementById('agents-view').classList.add('active');

            this.renderAgents();
        });
    },

    // Crear vista de agentes
    createAgentsView() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const agentsView = document.createElement('div');
        agentsView.className = 'view';
        agentsView.id = 'agents-view';
        agentsView.innerHTML = `
            <div class="view-header">
                <h2><i class="fas fa-robot"></i> Agentes Personalizables</h2>
                <p>Crea y gestiona agentes inteligentes con avatares personalizados</p>
            </div>

            <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem;">
                <button class="btn btn-primary btn-lg" onclick="AgentsManager.showCreateAgentModal()">
                    <i class="fas fa-plus-circle"></i> Crear Nuevo Agente
                </button>
                <button class="btn btn-secondary" onclick="AgentsManager.showAvatarGallery()">
                    <i class="fas fa-images"></i> Galería de Avatares
                </button>
            </div>

            <div id="agentsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                <!-- Agentes se renderizan aquí -->
            </div>
        `;

        mainContent.appendChild(agentsView);
    },

    // Renderizar lista de agentes
    renderAgents() {
        const grid = document.getElementById('agentsGrid');
        if (!grid) return;

        if (this.agents.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-robot" style="font-size: 4rem; color: #64748b; margin-bottom: 1rem;"></i>
                    <h3 style="color: #e2e8f0; margin-bottom: 0.5rem;">No hay agentes creados</h3>
                    <p style="color: #94a3b8; margin-bottom: 2rem;">Crea tu primer agente personalizado para comenzar</p>
                    <button class="btn btn-primary" onclick="AgentsManager.showCreateAgentModal()">
                        <i class="fas fa-plus-circle"></i> Crear Primer Agente
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.agents.map((agent, index) => this.renderAgentCard(agent, index)).join('');
    },

    // Renderizar tarjeta de agente
    renderAgentCard(agent, index) {
        const avatar = this.avatars.find(a => a.id === agent.avatarId) || this.avatars[0];
        const statusColor = agent.active ? '#10b981' : '#64748b';
        const statusLabel = agent.active ? 'Activo' : 'Inactivo';

        return `
            <div class="agent-card" style="
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border: 1px solid #475569;
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.3s;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            " onmouseenter="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.3)';"
               onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none';">

                <!-- Status Badge -->
                <div style="position: absolute; top: 1rem; right: 1rem; background: ${statusColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                    ${statusLabel}
                </div>

                <!-- Avatar Grande -->
                <div style="text-align: center; margin-bottom: 1rem;">
                    <div style="
                        font-size: 5rem;
                        background: linear-gradient(135deg, #2563eb, #3b82f6);
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1rem;
                        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
                    ">
                        ${avatar.icon}
                    </div>
                    <h3 style="margin: 0; color: #e2e8f0; font-size: 1.3rem;">${agent.name}</h3>
                    <p style="margin: 0.25rem 0 0; color: #94a3b8; font-size: 0.9rem;">${agent.role || 'Sin rol asignado'}</p>
                </div>

                <!-- Descripción -->
                <div style="margin-bottom: 1rem; padding: 1rem; background: #0f172a; border-radius: 8px;">
                    <p style="margin: 0; color: #cbd5e1; font-size: 0.9rem; line-height: 1.5;">
                        ${agent.description || 'Sin descripción'}
                    </p>
                </div>

                <!-- Estadísticas -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
                    <div style="text-align: center; padding: 0.75rem; background: #1e293b; border-radius: 6px;">
                        <div style="color: #60a5fa; font-size: 1.5rem; font-weight: bold;">${agent.tasksCompleted || 0}</div>
                        <div style="color: #94a3b8; font-size: 0.75rem;">Tareas</div>
                    </div>
                    <div style="text-align: center; padding: 0.75rem; background: #1e293b; border-radius: 6px;">
                        <div style="color: #34d399; font-size: 1.5rem; font-weight: bold;">${agent.successRate || 100}%</div>
                        <div style="color: #94a3b8; font-size: 0.75rem;">Éxito</div>
                    </div>
                    <div style="text-align: center; padding: 0.75rem; background: #1e293b; border-radius: 6px;">
                        <div style="color: #fbbf24; font-size: 1.5rem; font-weight: bold;">${agent.level || 1}</div>
                        <div style="color: #94a3b8; font-size: 0.75rem;">Nivel</div>
                    </div>
                </div>

                <!-- Habilidades -->
                ${agent.skills && agent.skills.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.5rem;">Habilidades:</div>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${agent.skills.map(skill => `
                                <span style="background: #2563eb20; color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">
                                    ${skill}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Acciones -->
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-primary" onclick="AgentsManager.editAgent(${index})" style="flex: 1;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm ${agent.active ? 'btn-secondary' : 'btn-success'}" onclick="AgentsManager.toggleAgent(${index})" style="flex: 1;">
                        <i class="fas ${agent.active ? 'fa-pause' : 'fa-play'}"></i> ${agent.active ? 'Pausar' : 'Activar'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="AgentsManager.deleteAgent(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // Mostrar modal de crear/editar agente
    showCreateAgentModal(editIndex = null) {
        const agent = editIndex !== null ? this.agents[editIndex] : {
            name: '',
            role: '',
            description: '',
            avatarId: 'robot1',
            active: true,
            skills: [],
            tasksCompleted: 0,
            successRate: 100,
            level: 1
        };

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-robot"></i> ${editIndex !== null ? 'Editar' : 'Crear'} Agente</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="agentForm" style="display: flex; flex-direction: column; gap: 1.25rem;">

                        <!-- Avatar Selection -->
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 0.75rem; color: #e2e8f0; font-weight: 500;">
                                <i class="fas fa-image"></i> Avatar del Agente
                            </label>
                            <div id="avatarSelector" style="
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                                gap: 0.75rem;
                                max-height: 300px;
                                overflow-y: auto;
                                padding: 1rem;
                                background: #0f172a;
                                border-radius: 8px;
                            ">
                                ${this.avatars.map(avatar => `
                                    <div class="avatar-option" data-avatar-id="${avatar.id}" style="
                                        padding: 1rem;
                                        background: ${agent.avatarId === avatar.id ? '#2563eb' : '#1e293b'};
                                        border: 2px solid ${agent.avatarId === avatar.id ? '#3b82f6' : '#334155'};
                                        border-radius: 12px;
                                        text-align: center;
                                        cursor: pointer;
                                        transition: all 0.2s;
                                    " onclick="AgentsManager.selectAvatar('${avatar.id}', this)">
                                        <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">${avatar.icon}</div>
                                        <div style="font-size: 0.7rem; color: #cbd5e1; text-overflow: ellipsis; overflow: hidden;">
                                            ${avatar.name}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Nombre -->
                        <div class="form-group">
                            <label><i class="fas fa-signature"></i> Nombre del Agente *</label>
                            <input type="text" id="agentName" class="form-control" required
                                   value="${agent.name}" placeholder="Ej: Asistente Virtual">
                        </div>

                        <!-- Rol -->
                        <div class="form-group">
                            <label><i class="fas fa-briefcase"></i> Rol o Especialidad</label>
                            <input type="text" id="agentRole" class="form-control"
                                   value="${agent.role}" placeholder="Ej: Automatización de Reportes">
                        </div>

                        <!-- Descripción -->
                        <div class="form-group">
                            <label><i class="fas fa-align-left"></i> Descripción</label>
                            <textarea id="agentDescription" class="form-control" rows="3"
                                      placeholder="Describe las funciones de este agente...">${agent.description}</textarea>
                        </div>

                        <!-- Habilidades -->
                        <div class="form-group">
                            <label><i class="fas fa-star"></i> Habilidades (separadas por coma)</label>
                            <input type="text" id="agentSkills" class="form-control"
                                   value="${(agent.skills || []).join(', ')}"
                                   placeholder="Ej: Web Scraping, Excel, Email, IA">
                            <small style="color: #64748b;">Separa múltiples habilidades con comas</small>
                        </div>

                        <!-- Configuración avanzada -->
                        <div style="background: #1e293b; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-top: 0; color: #e2e8f0; font-size: 1rem;">
                                <i class="fas fa-cog"></i> Configuración Avanzada
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label>Nivel Inicial</label>
                                    <input type="number" id="agentLevel" class="form-control" min="1" max="100"
                                           value="${agent.level || 1}">
                                </div>
                                <div class="form-group">
                                    <label>Tasa de Éxito (%)</label>
                                    <input type="number" id="agentSuccessRate" class="form-control" min="0" max="100"
                                           value="${agent.successRate || 100}">
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="agentActive" ${agent.active ? 'checked' : ''}>
                                    <span>Activar agente inmediatamente</span>
                                </label>
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                    <button class="btn btn-primary" id="saveAgentBtn">
                        <i class="fas fa-save"></i> ${editIndex !== null ? 'Actualizar' : 'Crear'} Agente
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Guardar agente
        modal.querySelector('#saveAgentBtn').onclick = () => {
            const form = modal.querySelector('#agentForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const newAgent = {
                id: agent.id || Date.now().toString(),
                name: modal.querySelector('#agentName').value,
                role: modal.querySelector('#agentRole').value,
                description: modal.querySelector('#agentDescription').value,
                avatarId: this.selectedAvatarId || agent.avatarId,
                skills: modal.querySelector('#agentSkills').value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s),
                level: parseInt(modal.querySelector('#agentLevel').value) || 1,
                successRate: parseInt(modal.querySelector('#agentSuccessRate').value) || 100,
                tasksCompleted: agent.tasksCompleted || 0,
                active: modal.querySelector('#agentActive').checked,
                createdAt: agent.createdAt || new Date().toISOString()
            };

            if (editIndex !== null) {
                this.agents[editIndex] = newAgent;
            } else {
                this.agents.push(newAgent);
            }

            this.saveAgents();
            this.renderAgents();
            modal.remove();
            showNotification(`Agente ${editIndex !== null ? 'actualizado' : 'creado'} exitosamente`, 'success');
        };
    },

    selectedAvatarId: null,

    // Seleccionar avatar
    selectAvatar(avatarId, element) {
        this.selectedAvatarId = avatarId;

        // Actualizar estilos
        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.style.background = '#1e293b';
            opt.style.borderColor = '#334155';
        });

        element.style.background = '#2563eb';
        element.style.borderColor = '#3b82f6';
    },

    // Galería de avatares
    showAvatarGallery() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h3><i class="fas fa-images"></i> Galería de Avatares</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.renderAvatarsByCategory()}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    },

    // Renderizar avatares por categoría
    renderAvatarsByCategory() {
        const categories = {
            robot: 'Robots',
            ai: 'Inteligencia Artificial',
            pet: 'Mascotas',
            tech: 'Tecnología',
            magic: 'Mágicos'
        };

        return Object.entries(categories).map(([type, label]) => {
            const avatarsOfType = this.avatars.filter(a => a.type === type);
            if (avatarsOfType.length === 0) return '';

            return `
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #e2e8f0; margin-bottom: 1rem;">
                        <i class="fas fa-folder"></i> ${label}
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem;">
                        ${avatarsOfType.map(avatar => `
                            <div style="
                                padding: 1.5rem;
                                background: #1e293b;
                                border: 1px solid #334155;
                                border-radius: 12px;
                                text-align: center;
                                transition: all 0.2s;
                            " onmouseenter="this.style.borderColor='#2563eb'; this.style.background='#334155';"
                               onmouseleave="this.style.borderColor='#334155'; this.style.background='#1e293b';">
                                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${avatar.icon}</div>
                                <div style="font-size: 0.85rem; color: #cbd5e1;">${avatar.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Editar agente
    editAgent(index) {
        this.showCreateAgentModal(index);
    },

    // Activar/desactivar agente
    toggleAgent(index) {
        this.agents[index].active = !this.agents[index].active;
        this.saveAgents();
        this.renderAgents();
        showNotification(`Agente ${this.agents[index].active ? 'activado' : 'desactivado'}`, 'info');
    },

    // Eliminar agente
    deleteAgent(index) {
        if (confirm(`¿Eliminar el agente "${this.agents[index].name}"?`)) {
            this.agents.splice(index, 1);
            this.saveAgents();
            this.renderAgents();
            showNotification('Agente eliminado', 'success');
        }
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AgentsManager.init());
} else {
    AgentsManager.init();
}
