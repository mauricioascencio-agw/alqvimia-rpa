// ============================================================================
// OMNICHANNEL UI - WhatsApp & Telegram Interface
// ============================================================================

const OmnichannelUI = {
  // Estado del sistema
  initialized: false,
  currentTab: 'messages',
  channels: {
    whatsapp: { status: 'disconnected', enabled: false },
    telegram: { status: 'disconnected', enabled: false }
  },
  conversations: [],
  templates: [],
  statusInterval: null,

  // ========================================================================
  // INICIALIZACIÓN
  // ========================================================================

  /**
   * Inicializa el sistema de omnicanalidad
   */
  async initializeSystem() {
    try {
      const btn = event.target;
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inicializando...';

      // Obtener configuración actual
      const config = this.getConfigFromUI();

      const response = await fetch('/api/omnichannel/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });

      const result = await response.json();

      if (result.success) {
        this.initialized = true;
        this.channels = result.channels;

        this.showNotification('Sistema inicializado correctamente', 'success');
        this.updateStatusCards();

        // Si WhatsApp necesita QR, mostrarlo
        if (result.channels.whatsapp.status === 'qr_ready') {
          setTimeout(() => this.showWhatsAppQR(), 2000);
        }

        // Iniciar polling de estado
        this.startStatusPolling();
      } else {
        throw new Error(result.error || result.message || 'Error desconocido');
      }

      btn.disabled = false;
      btn.innerHTML = originalText;

    } catch (error) {
      console.error('Error al inicializar:', error);
      this.showNotification('Error al inicializar: ' + error.message, 'error');
      event.target.disabled = false;
      event.target.innerHTML = '<i class="fas fa-power-off"></i> Inicializar Sistema';
    }
  },

  /**
   * Obtiene la configuración desde la UI
   */
  getConfigFromUI() {
    return {
      whatsapp: {
        enabled: document.getElementById('config-whatsapp-enabled')?.checked || true,
        provider: 'whatsapp-web.js',
        autoReply: document.getElementById('config-whatsapp-autoreply')?.checked || false,
        headless: false
      },
      telegram: {
        enabled: document.getElementById('config-telegram-enabled')?.checked || false,
        token: document.getElementById('config-telegram-token')?.value || '',
        polling: true
      }
    };
  },

  // ========================================================================
  // POLLING DE ESTADO
  // ========================================================================

  /**
   * Inicia el polling periódico del estado
   */
  startStatusPolling() {
    // Limpiar intervalo anterior si existe
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }

    // Actualizar cada 5 segundos
    this.statusInterval = setInterval(() => {
      this.refreshStatus();
    }, 5000);

    // Primera actualización inmediata
    this.refreshStatus();
  },

  /**
   * Detiene el polling de estado
   */
  stopStatusPolling() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  },

  /**
   * Refresca el estado del sistema
   */
  async refreshStatus() {
    try {
      const response = await fetch('/api/omnichannel/status');
      const result = await response.json();

      if (result.success) {
        this.initialized = result.initialized;
        this.channels = result.channels;
        this.updateStatusCards();
      }
    } catch (error) {
      console.error('Error al obtener estado:', error);
    }
  },

  /**
   * Actualiza las tarjetas de estado en la UI
   */
  updateStatusCards() {
    // WhatsApp Status
    const waCard = document.querySelector('[data-channel="whatsapp"]');
    if (waCard) {
      const statusBadge = waCard.querySelector('.status-badge');
      const statusText = waCard.querySelector('.status-text');
      const details = waCard.querySelector('.channel-details');

      const wa = this.channels.whatsapp;
      const statusInfo = this.getStatusInfo(wa.status);

      statusBadge.className = `status-badge status-${statusInfo.class}`;
      statusBadge.innerHTML = `<i class="${statusInfo.icon}"></i> ${statusInfo.text}`;
      statusText.textContent = statusInfo.description;

      // Detalles adicionales
      if (wa.phone) {
        details.innerHTML = `<i class="fas fa-phone"></i> ${wa.phone}`;
      } else if (wa.status === 'qr_ready') {
        details.innerHTML = '<button onclick="OmnichannelUI.showWhatsAppQR()" class="btn btn-sm btn-primary">Ver QR</button>';
      } else {
        details.innerHTML = '';
      }
    }

    // Telegram Status
    const tgCard = document.querySelector('[data-channel="telegram"]');
    if (tgCard) {
      const statusBadge = tgCard.querySelector('.status-badge');
      const statusText = tgCard.querySelector('.status-text');
      const details = tgCard.querySelector('.channel-details');

      const tg = this.channels.telegram;
      const statusInfo = this.getStatusInfo(tg.status);

      statusBadge.className = `status-badge status-${statusInfo.class}`;
      statusBadge.innerHTML = `<i class="${statusInfo.icon}"></i> ${statusInfo.text}`;
      statusText.textContent = statusInfo.description;

      if (tg.username) {
        details.innerHTML = `<i class="fas fa-user"></i> @${tg.username}`;
      } else {
        details.innerHTML = '';
      }
    }

    // Statistics
    this.updateStatistics();
  },

  /**
   * Obtiene información visual del estado
   */
  getStatusInfo(status) {
    const statusMap = {
      'connected': {
        class: 'connected',
        icon: 'fas fa-check-circle',
        text: 'Conectado',
        description: 'Canal listo para enviar y recibir mensajes'
      },
      'disconnected': {
        class: 'disconnected',
        icon: 'fas fa-times-circle',
        text: 'Desconectado',
        description: 'Canal no inicializado'
      },
      'qr_ready': {
        class: 'pending',
        icon: 'fas fa-qrcode',
        text: 'QR Disponible',
        description: 'Escanea el código QR para conectar'
      },
      'connecting': {
        class: 'pending',
        icon: 'fas fa-spinner fa-spin',
        text: 'Conectando',
        description: 'Estableciendo conexión...'
      },
      'error': {
        class: 'error',
        icon: 'fas fa-exclamation-triangle',
        text: 'Error',
        description: 'Error en la conexión'
      }
    };

    return statusMap[status] || statusMap['disconnected'];
  },

  /**
   * Actualiza las estadísticas
   */
  async updateStatistics() {
    try {
      const response = await fetch('/api/omnichannel/conversations');
      const result = await response.json();

      if (result.success) {
        this.conversations = result.conversations;

        const stats = {
          total: result.conversations.length,
          whatsapp: result.conversations.filter(c => c.channel === 'whatsapp').length,
          telegram: result.conversations.filter(c => c.channel === 'telegram').length
        };

        // Actualizar tarjeta de estadísticas
        document.getElementById('stat-total-messages').textContent = stats.total;
        document.getElementById('stat-whatsapp-messages').textContent = stats.whatsapp;
        document.getElementById('stat-telegram-messages').textContent = stats.telegram;
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  },

  // ========================================================================
  // QR CODE DE WHATSAPP
  // ========================================================================

  /**
   * Muestra el código QR de WhatsApp
   */
  async showWhatsAppQR() {
    try {
      const response = await fetch('/api/omnichannel/whatsapp/qr');
      const result = await response.json();

      if (result.success && result.qr) {
        const modal = document.getElementById('qr-modal');
        const qrContainer = document.getElementById('qr-code-container');

        // Limpiar contenedor
        qrContainer.innerHTML = '';

        // Generar QR usando qrcode.js (debe estar incluido en index.html)
        if (typeof QRCode !== 'undefined') {
          new QRCode(qrContainer, {
            text: result.qr,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
        } else {
          // Fallback: mostrar texto
          qrContainer.innerHTML = `<pre style="font-size: 8px; line-height: 8px;">${result.qr}</pre>`;
        }

        modal.style.display = 'block';

        // Auto-cerrar cuando se conecte
        const checkInterval = setInterval(async () => {
          const status = await this.getChannelStatus('whatsapp');
          if (status === 'connected') {
            clearInterval(checkInterval);
            this.closeQRModal();
            this.showNotification('WhatsApp conectado correctamente', 'success');
          }
        }, 2000);

      } else {
        throw new Error('QR no disponible todavía. Intenta de nuevo en unos segundos.');
      }
    } catch (error) {
      console.error('Error al obtener QR:', error);
      this.showNotification('Error al obtener QR: ' + error.message, 'error');
    }
  },

  /**
   * Cierra el modal de QR
   */
  closeQRModal() {
    const modal = document.getElementById('qr-modal');
    modal.style.display = 'none';
  },

  /**
   * Obtiene el estado de un canal
   */
  async getChannelStatus(channel) {
    try {
      const response = await fetch('/api/omnichannel/status');
      const result = await response.json();
      return result.channels[channel]?.status || 'disconnected';
    } catch (error) {
      return 'error';
    }
  },

  // ========================================================================
  // ENVÍO DE MENSAJES
  // ========================================================================

  /**
   * Envía un mensaje
   */
  async sendMessage() {
    try {
      const channel = document.getElementById('message-channel').value;
      const recipient = document.getElementById('message-recipient').value.trim();
      const message = document.getElementById('message-text').value.trim();

      if (!recipient || !message) {
        this.showNotification('Por favor completa todos los campos', 'warning');
        return;
      }

      const btn = event.target;
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      const response = await fetch('/api/omnichannel/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, recipient, message })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Mensaje enviado correctamente', 'success');

        // Limpiar formulario
        document.getElementById('message-recipient').value = '';
        document.getElementById('message-text').value = '';

        // Actualizar estadísticas
        this.updateStatistics();
      } else {
        throw new Error(result.error || 'Error al enviar mensaje');
      }

      btn.disabled = false;
      btn.innerHTML = originalText;

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.showNotification('Error al enviar: ' + error.message, 'error');
      event.target.disabled = false;
      event.target.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
    }
  },

  // ========================================================================
  // TABS
  // ========================================================================

  /**
   * Cambia de pestaña
   */
  switchTab(tabName) {
    this.currentTab = tabName;

    // Actualizar botones de tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Cargar datos según la pestaña
    switch (tabName) {
      case 'conversations':
        this.loadConversations();
        break;
      case 'templates':
        this.loadTemplates();
        break;
    }
  },

  // ========================================================================
  // CONVERSACIONES
  // ========================================================================

  /**
   * Carga las conversaciones
   */
  async loadConversations() {
    try {
      const response = await fetch('/api/omnichannel/conversations');
      const result = await response.json();

      if (result.success) {
        this.conversations = result.conversations;
        this.renderConversations();
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    }
  },

  /**
   * Renderiza la lista de conversaciones
   */
  renderConversations() {
    const list = document.getElementById('conversations-list');

    if (this.conversations.length === 0) {
      list.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No hay conversaciones todavía</p>';
      return;
    }

    list.innerHTML = this.conversations.map(conv => `
      <div class="conversation-item" onclick="OmnichannelUI.viewConversation('${conv.id}')">
        <div class="conversation-header">
          <span class="conversation-channel">
            <i class="fab fa-${conv.channel === 'whatsapp' ? 'whatsapp' : 'telegram'}"></i>
            ${conv.channel}
          </span>
          <span class="conversation-contact">${conv.contact}</span>
        </div>
        <div class="conversation-preview">
          <span>${conv.lastMessage}</span>
          <span class="conversation-time">${this.formatTime(conv.timestamp)}</span>
        </div>
        <div class="conversation-stats">
          <span><i class="fas fa-comments"></i> ${conv.messageCount} mensajes</span>
        </div>
      </div>
    `).join('');
  },

  /**
   * Ver detalles de una conversación
   */
  viewConversation(conversationId) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return;

    // Aquí podrías abrir un modal con todos los mensajes
    console.log('Ver conversación:', conv);
    this.showNotification(`Conversación con ${conv.contact}`, 'info');
  },

  // ========================================================================
  // TEMPLATES
  // ========================================================================

  /**
   * Carga las plantillas
   */
  async loadTemplates() {
    try {
      const response = await fetch('/api/omnichannel/templates');
      const result = await response.json();

      if (result.success) {
        this.templates = result.templates;
        this.renderTemplates();
      }
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  },

  /**
   * Renderiza la lista de plantillas
   */
  renderTemplates() {
    const list = document.getElementById('templates-list');

    if (this.templates.length === 0) {
      list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay plantillas creadas</p>';
      return;
    }

    list.innerHTML = this.templates.map(tpl => `
      <div class="template-item">
        <div class="template-header">
          <strong>${tpl.name}</strong>
          <div>
            <button onclick="OmnichannelUI.useTemplate('${tpl.name}')" class="btn btn-sm btn-primary">
              <i class="fas fa-paper-plane"></i> Usar
            </button>
            <button onclick="OmnichannelUI.deleteTemplate('${tpl.name}')" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="template-content">${tpl.content}</div>
        ${tpl.variables ? `<div class="template-variables"><i class="fas fa-tag"></i> Variables: ${tpl.variables.join(', ')}</div>` : ''}
      </div>
    `).join('');
  },

  /**
   * Crea una nueva plantilla
   */
  async createTemplate() {
    try {
      const name = document.getElementById('template-name').value.trim();
      const content = document.getElementById('template-content').value.trim();

      if (!name || !content) {
        this.showNotification('Por favor completa todos los campos', 'warning');
        return;
      }

      const response = await fetch('/api/omnichannel/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Plantilla creada correctamente', 'success');

        // Limpiar formulario
        document.getElementById('template-name').value = '';
        document.getElementById('template-content').value = '';

        // Recargar plantillas
        this.loadTemplates();
      } else {
        throw new Error(result.error || 'Error al crear plantilla');
      }

    } catch (error) {
      console.error('Error al crear plantilla:', error);
      this.showNotification('Error: ' + error.message, 'error');
    }
  },

  /**
   * Usa una plantilla para enviar mensaje
   */
  useTemplate(templateName) {
    const template = this.templates.find(t => t.name === templateName);
    if (!template) return;

    // Cambiar a tab de mensajes
    document.querySelector('[onclick*="messages"]').click();

    // Llenar el campo de mensaje
    setTimeout(() => {
      document.getElementById('message-text').value = template.content;
      this.showNotification(`Plantilla "${templateName}" cargada`, 'info');
    }, 100);
  },

  /**
   * Elimina una plantilla
   */
  async deleteTemplate(templateName) {
    if (!confirm(`¿Eliminar la plantilla "${templateName}"?`)) return;

    try {
      const response = await fetch(`/api/omnichannel/templates/${templateName}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Plantilla eliminada', 'success');
        this.loadTemplates();
      } else {
        throw new Error(result.error || 'Error al eliminar');
      }

    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      this.showNotification('Error: ' + error.message, 'error');
    }
  },

  // ========================================================================
  // CONFIGURACIÓN
  // ========================================================================

  /**
   * Guarda la configuración
   */
  async saveConfiguration() {
    try {
      const config = this.getConfigFromUI();

      const response = await fetch('/api/omnichannel/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Configuración guardada. Reinicia el sistema para aplicar cambios.', 'success');
      } else {
        throw new Error(result.error || 'Error al guardar');
      }

    } catch (error) {
      console.error('Error al guardar configuración:', error);
      this.showNotification('Error: ' + error.message, 'error');
    }
  },

  // ========================================================================
  // UTILIDADES
  // ========================================================================

  /**
   * Muestra una notificación
   */
  showNotification(message, type = 'info') {
    // Usar el sistema de notificaciones del RPA si existe
    if (typeof showNotification === 'function') {
      showNotification(message, type);
      return;
    }

    // Fallback: alert simple
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    alert(`${icons[type] || ''} ${message}`);
  },

  /**
   * Formatea un timestamp
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Si es hoy
    if (diff < 86400000) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    // Si es esta semana
    if (diff < 604800000) {
      return date.toLocaleDateString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }

    // Fecha completa
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Limpia recursos al salir de la vista
   */
  cleanup() {
    this.stopStatusPolling();
  }
};

// ============================================================================
// AUTO-INICIALIZACIÓN
// ============================================================================

// Cuando se cambia de vista, iniciar/detener polling
document.addEventListener('DOMContentLoaded', () => {
  // Detectar cambios de vista
  const originalSwitchView = window.switchView;
  if (typeof originalSwitchView === 'function') {
    window.switchView = function(viewName) {
      // Si salimos de omnichannel, limpiar
      if (viewName !== 'omnichannel' && OmnichannelUI.statusInterval) {
        OmnichannelUI.cleanup();
      }

      // Llamar a la función original
      originalSwitchView(viewName);

      // Si entramos a omnichannel, iniciar polling si ya está inicializado
      if (viewName === 'omnichannel' && OmnichannelUI.initialized) {
        OmnichannelUI.startStatusPolling();
      }
    };
  }
});

// Cerrar modal de QR al hacer click fuera
window.onclick = function(event) {
  const modal = document.getElementById('qr-modal');
  if (event.target === modal) {
    OmnichannelUI.closeQRModal();
  }
};

console.log('✅ Omnichannel UI cargado correctamente');
