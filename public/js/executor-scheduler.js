// 📅 PROGRAMADOR Y CALENDARIO DE EJECUCIONES

const ExecutorScheduler = {
    schedules: [], // Programaciones guardadas

    // Inicializar
    init() {
        this.loadSchedules();
        this.setupUI();
    },

    // Cargar programaciones
    loadSchedules() {
        const saved = localStorage.getItem('workflow_schedules');
        if (saved) {
            try {
                this.schedules = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading schedules:', e);
                this.schedules = [];
            }
        }
    },

    // Guardar programaciones
    saveSchedules() {
        localStorage.setItem('workflow_schedules', JSON.stringify(this.schedules));
    },

    // Configurar UI
    setupUI() {
        // Agregar botón de programación en la sección de ejecución
        const executeSection = document.querySelector('.workflow-controls');
        if (executeSection) {
            const scheduleBtn = document.createElement('button');
            scheduleBtn.className = 'btn btn-secondary';
            scheduleBtn.innerHTML = '<i class="fas fa-calendar-alt"></i> Programar';
            scheduleBtn.onclick = () => this.showSchedulerModal();
            scheduleBtn.style.marginLeft = '0.5rem';

            const executeBtn = document.getElementById('executeWorkflow');
            if (executeBtn) {
                executeBtn.parentNode.insertBefore(scheduleBtn, executeBtn.nextSibling);
            }
        }
    },

    // Mostrar modal del programador
    showSchedulerModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-alt"></i> Programador de Ejecuciones</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <!-- Panel izquierdo: Nueva programación -->
                        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem;">
                            <h4 style="margin-top: 0; color: #e2e8f0; margin-bottom: 1.5rem;">
                                <i class="fas fa-plus-circle"></i> Nueva Programación
                            </h4>
                            ${this.renderScheduleForm()}
                        </div>

                        <!-- Panel derecho: Calendario y programaciones -->
                        <div>
                            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                                <h4 style="margin-top: 0; color: #e2e8f0; margin-bottom: 1.5rem;">
                                    <i class="fas fa-calendar"></i> Calendario de Ejecuciones
                                </h4>
                                ${this.renderCalendar()}
                            </div>

                            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem;">
                                <h4 style="margin-top: 0; color: #e2e8f0; margin-bottom: 1.5rem;">
                                    <i class="fas fa-list"></i> Programaciones Activas
                                </h4>
                                ${this.renderSchedulesList()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Configurar formulario
        this.setupScheduleForm(modal);
    },

    // Renderizar formulario de nueva programación
    renderScheduleForm() {
        return `
            <form id="scheduleForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <!-- Workflow -->
                <div class="form-group">
                    <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                        <i class="fas fa-project-diagram"></i> Workflow
                    </label>
                    <select id="scheduleWorkflow" class="form-control" required>
                        <option value="">Seleccionar workflow...</option>
                        ${this.getWorkflowOptions()}
                    </select>
                </div>

                <!-- Tipo de programación -->
                <div class="form-group">
                    <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                        <i class="fas fa-clock"></i> Tipo de Programación
                    </label>
                    <select id="scheduleType" class="form-control">
                        <option value="once">Una vez</option>
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="interval">Cada X tiempo</option>
                    </select>
                </div>

                <!-- Configuración según tipo -->
                <div id="scheduleConfig">
                    ${this.renderScheduleConfig('once')}
                </div>

                <!-- Botón guardar -->
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Guardar Programación
                </button>

                <!-- Tarea programada de Windows -->
                <div style="border-top: 1px solid #334155; padding-top: 1rem; margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1; cursor: pointer;">
                        <input type="checkbox" id="useWindowsScheduler" style="width: 18px; height: 18px;">
                        <span>Crear tarea en Programador de Windows</span>
                    </label>
                    <small style="color: #64748b; display: block; margin-top: 0.5rem; margin-left: 1.75rem;">
                        Requiere permisos de administrador
                    </small>
                </div>
            </form>
        `;
    },

    // Renderizar configuración según tipo de programación
    renderScheduleConfig(type) {
        switch (type) {
            case 'once':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-calendar-day"></i> Fecha y Hora
                        </label>
                        <input type="datetime-local" id="scheduleDateTime" class="form-control" required>
                    </div>
                `;

            case 'daily':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-clock"></i> Hora de Ejecución
                        </label>
                        <input type="time" id="scheduleTime" class="form-control" value="09:00" required>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-calendar-check"></i> Días de la Semana
                        </label>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${this.renderDayCheckboxes()}
                        </div>
                    </div>
                `;

            case 'weekly':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-calendar-check"></i> Días de la Semana
                        </label>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${this.renderDayCheckboxes()}
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-clock"></i> Hora de Ejecución
                        </label>
                        <input type="time" id="scheduleTime" class="form-control" value="09:00" required>
                    </div>
                `;

            case 'interval':
                return `
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-redo"></i> Intervalo de Repetición
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                            <input type="number" id="intervalValue" class="form-control" placeholder="Cada..." min="1" value="1" required>
                            <select id="intervalUnit" class="form-control">
                                <option value="minutes">Minutos</option>
                                <option value="hours" selected>Horas</option>
                                <option value="days">Días</option>
                            </select>
                        </div>
                        <small style="color: #64748b; display: block; margin-top: 0.5rem;">
                            El workflow se ejecutará cada X tiempo indefinidamente
                        </small>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
                            <i class="fas fa-play-circle"></i> Inicio
                        </label>
                        <input type="datetime-local" id="intervalStart" class="form-control" required>
                    </div>
                `;

            default:
                return '';
        }
    },

    // Renderizar checkboxes de días de la semana
    renderDayCheckboxes() {
        const days = [
            { short: 'L', full: 'Lunes', value: 1 },
            { short: 'M', full: 'Martes', value: 2 },
            { short: 'X', full: 'Miércoles', value: 3 },
            { short: 'J', full: 'Jueves', value: 4 },
            { short: 'V', full: 'Viernes', value: 5 },
            { short: 'S', full: 'Sábado', value: 6 },
            { short: 'D', full: 'Domingo', value: 0 }
        ];

        return days.map(day => `
            <label style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem;
                background: #334155;
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 60px;
            " class="day-checkbox-label">
                <input type="checkbox" name="scheduleDays" value="${day.value}" class="day-checkbox" style="display: none;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #475569;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #cbd5e1;
                    font-size: 1rem;
                ">${day.short}</div>
                <span style="font-size: 0.75rem; color: #94a3b8;">${day.full}</span>
            </label>
        `).join('');
    },

    // Renderizar calendario visual
    renderCalendar() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

        let calendarHTML = `
            <div style="text-align: center; margin-bottom: 1rem; color: #e2e8f0; font-weight: 600; font-size: 1.1rem;">
                ${monthNames[currentMonth]} ${currentYear}
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">
                ${dayNames.map(day => `
                    <div style="text-align: center; font-weight: bold; color: #94a3b8; padding: 0.5rem; font-size: 0.85rem;">
                        ${day}
                    </div>
                `).join('')}
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
        `;

        // Días vacíos antes del primer día del mes
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < adjustedFirstDay; i++) {
            calendarHTML += '<div></div>';
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = day === today.getDate();
            const hasSchedule = this.hasScheduleOnDate(date);

            calendarHTML += `
                <div style="
                    padding: 0.75rem;
                    text-align: center;
                    border-radius: 8px;
                    background: ${isToday ? '#2563eb' : (hasSchedule ? '#10b981' : '#334155')};
                    color: ${isToday || hasSchedule ? '#fff' : '#cbd5e1'};
                    font-weight: ${isToday ? 'bold' : 'normal'};
                    position: relative;
                    cursor: ${hasSchedule ? 'pointer' : 'default'};
                " ${hasSchedule ? `title="Tiene ${this.getScheduleCountOnDate(date)} programación(es)"` : ''}>
                    ${day}
                    ${hasSchedule ? '<div style="position: absolute; top: 2px; right: 2px; width: 6px; height: 6px; background: #fbbf24; border-radius: 50%;"></div>' : ''}
                </div>
            `;
        }

        calendarHTML += `
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #334155; display: flex; gap: 1rem; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 16px; height: 16px; background: #2563eb; border-radius: 4px;"></div>
                    <span style="color: #94a3b8;">Hoy</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 16px; height: 16px; background: #10b981; border-radius: 4px;"></div>
                    <span style="color: #94a3b8;">Con programación</span>
                </div>
            </div>
        `;

        return calendarHTML;
    },

    // Verificar si hay programación en una fecha
    hasScheduleOnDate(date) {
        return this.schedules.some(schedule => {
            if (!schedule.enabled) return false;

            const scheduleDate = new Date(schedule.nextRun);
            return scheduleDate.toDateString() === date.toDateString();
        });
    },

    // Contar programaciones en una fecha
    getScheduleCountOnDate(date) {
        return this.schedules.filter(schedule => {
            if (!schedule.enabled) return false;

            const scheduleDate = new Date(schedule.nextRun);
            return scheduleDate.toDateString() === date.toDateString();
        }).length;
    },

    // Renderizar lista de programaciones
    renderSchedulesList() {
        if (this.schedules.length === 0) {
            return `
                <div style="text-align: center; padding: 2rem; color: #64748b;">
                    <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.3;"></i>
                    <p style="margin: 0;">No hay programaciones</p>
                </div>
            `;
        }

        return `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto;">
                ${this.schedules.map((schedule, index) => this.renderScheduleItem(schedule, index)).join('')}
            </div>
        `;
    },

    // Renderizar item de programación
    renderScheduleItem(schedule, index) {
        const typeLabels = {
            once: 'Una vez',
            daily: 'Diario',
            weekly: 'Semanal',
            interval: 'Intervalo'
        };

        const statusColor = schedule.enabled ? '#10b981' : '#64748b';

        return `
            <div style="
                background: #0f172a;
                border-left: 3px solid ${statusColor};
                padding: 0.75rem;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="flex: 1;">
                    <div style="color: #e2e8f0; font-weight: 500; margin-bottom: 0.25rem;">
                        ${schedule.workflowName}
                    </div>
                    <div style="color: #94a3b8; font-size: 0.85rem;">
                        <i class="fas fa-clock"></i> ${typeLabels[schedule.type]} |
                        Próxima: ${this.formatNextRun(schedule.nextRun)}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-secondary" onclick="ExecutorScheduler.toggleSchedule(${index})" title="${schedule.enabled ? 'Desactivar' : 'Activar'}">
                        <i class="fas ${schedule.enabled ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="ExecutorScheduler.deleteSchedule(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // Formatear próxima ejecución
    formatNextRun(dateString) {
        const date = new Date(dateString);
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            return `Hoy ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        }

        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Configurar formulario
    setupScheduleForm(modal) {
        const form = modal.querySelector('#scheduleForm');
        const typeSelect = modal.querySelector('#scheduleType');
        const configDiv = modal.querySelector('#scheduleConfig');

        // Cambiar configuración según tipo
        typeSelect.onchange = (e) => {
            configDiv.innerHTML = this.renderScheduleConfig(e.target.value);
            this.setupDayCheckboxes(modal);
        };

        // Configurar checkboxes de días
        this.setupDayCheckboxes(modal);

        // Envío del formulario
        form.onsubmit = (e) => {
            e.preventDefault();
            this.saveSchedule(modal);
        };
    },

    // Configurar estilo de checkboxes de días
    setupDayCheckboxes(modal) {
        const labels = modal.querySelectorAll('.day-checkbox-label');
        labels.forEach(label => {
            const checkbox = label.querySelector('.day-checkbox');

            label.onclick = (e) => {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    label.style.borderColor = '#2563eb';
                    label.style.background = '#1e40af20';
                } else {
                    label.style.borderColor = 'transparent';
                    label.style.background = '#334155';
                }
            };
        });
    },

    // Guardar programación
    saveSchedule(modal) {
        const workflowSelect = modal.querySelector('#scheduleWorkflow');
        const type = modal.querySelector('#scheduleType').value;
        const useWindowsScheduler = modal.querySelector('#useWindowsScheduler').checked;

        const schedule = {
            id: Date.now().toString(),
            workflowId: workflowSelect.value,
            workflowName: workflowSelect.selectedOptions[0].text,
            type,
            enabled: true,
            createdAt: new Date().toISOString(),
            useWindowsScheduler
        };

        // Configuración específica según tipo
        switch (type) {
            case 'once':
                schedule.dateTime = modal.querySelector('#scheduleDateTime').value;
                schedule.nextRun = schedule.dateTime;
                break;

            case 'daily':
            case 'weekly':
                schedule.time = modal.querySelector('#scheduleTime').value;
                const dayCheckboxes = modal.querySelectorAll('input[name="scheduleDays"]:checked');
                schedule.days = Array.from(dayCheckboxes).map(cb => parseInt(cb.value));
                schedule.nextRun = this.calculateNextRun(schedule);
                break;

            case 'interval':
                schedule.intervalValue = parseInt(modal.querySelector('#intervalValue').value);
                schedule.intervalUnit = modal.querySelector('#intervalUnit').value;
                schedule.startDate = modal.querySelector('#intervalStart').value;
                schedule.nextRun = schedule.startDate;
                break;
        }

        this.schedules.push(schedule);
        this.saveSchedules();

        // Crear tarea de Windows si se solicitó
        if (useWindowsScheduler) {
            this.createWindowsTask(schedule);
        }

        showNotification('Programación guardada correctamente', 'success');
        modal.remove();
        this.showSchedulerModal();
    },

    // Calcular próxima ejecución
    calculateNextRun(schedule) {
        const now = new Date();
        const [hours, minutes] = schedule.time.split(':');

        const next = new Date(now);
        next.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Si ya pasó la hora de hoy, buscar el siguiente día válido
        if (next <= now || !schedule.days.includes(next.getDay())) {
            let found = false;
            for (let i = 1; i <= 7; i++) {
                next.setDate(next.getDate() + 1);
                if (schedule.days.includes(next.getDay())) {
                    found = true;
                    break;
                }
            }
        }

        return next.toISOString();
    },

    // Crear tarea en Programador de Windows
    createWindowsTask(schedule) {
        // Enviar al servidor para crear tarea
        socket.emit('create-windows-task', schedule);
        showNotification('Creando tarea en Programador de Windows...', 'info');
    },

    // Obtener opciones de workflows
    getWorkflowOptions() {
        const savedWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        return savedWorkflows.map(wf => `
            <option value="${wf.id}">${wf.name || 'Sin nombre'}</option>
        `).join('');
    },

    // Activar/desactivar programación
    toggleSchedule(index) {
        this.schedules[index].enabled = !this.schedules[index].enabled;
        this.saveSchedules();
        this.showSchedulerModal();
    },

    // Eliminar programación
    deleteSchedule(index) {
        if (confirm('¿Eliminar esta programación?')) {
            this.schedules.splice(index, 1);
            this.saveSchedules();
            this.showSchedulerModal();
        }
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ExecutorScheduler.init());
} else {
    ExecutorScheduler.init();
}
