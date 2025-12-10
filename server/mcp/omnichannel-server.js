// 📱 SERVIDOR MCP OMNICANALIDAD - WhatsApp & Telegram
// Servidor MCP siguiendo el estándar Model Context Protocol

const { EventEmitter } = require('events');

/**
 * Servidor MCP para Omnicanalidad
 * Maneja comunicaciones con WhatsApp y Telegram como chatbots
 */
class OmnichannelMCPServer extends EventEmitter {
    constructor() {
        super();
        this.name = 'omnichannel-server';
        this.version = '1.0.0';
        this.description = 'Servidor MCP para gestión omnicanal (WhatsApp y Telegram)';

        // Configuración de canales
        this.channels = {
            whatsapp: {
                enabled: false,
                provider: null, // 'whatsapp-web.js' o 'twilio'
                status: 'disconnected',
                qr: null,
                client: null,
                phone: null,
                config: {}
            },
            telegram: {
                enabled: false,
                status: 'disconnected',
                bot: null,
                token: null,
                username: null,
                config: {}
            }
        };

        // Almacenamiento de mensajes y conversaciones
        this.conversations = new Map();
        this.messageQueue = [];
        this.templates = new Map();

        // Configuración de webhooks
        this.webhooks = {
            onMessage: [],
            onStatusChange: [],
            onError: []
        };

        console.log(`✅ ${this.name} v${this.version} inicializado`);
    }

    /**
     * Inicia el servidor MCP
     */
    async initialize(config = {}) {
        try {
            console.log('🚀 Iniciando servidor MCP Omnicanalidad...');

            // Configurar canales según configuración
            if (config.whatsapp && config.whatsapp.enabled) {
                await this.initializeWhatsApp(config.whatsapp);
            }

            if (config.telegram && config.telegram.enabled) {
                await this.initializeTelegram(config.telegram);
            }

            this.emit('server-ready');
            console.log('✅ Servidor MCP Omnicanalidad listo');

            return {
                success: true,
                message: 'Servidor inicializado correctamente',
                channels: this.getChannelsStatus()
            };
        } catch (error) {
            console.error('❌ Error al inicializar servidor MCP:', error);
            throw error;
        }
    }

    /**
     * Inicializa conexión con WhatsApp
     */
    async initializeWhatsApp(config) {
        console.log('📱 Inicializando WhatsApp...');

        this.channels.whatsapp.config = config;
        this.channels.whatsapp.provider = config.provider || 'whatsapp-web.js';

        // La implementación específica se carga dinámicamente
        // desde whatsapp-agent.js
        this.channels.whatsapp.enabled = true;
        this.channels.whatsapp.status = 'initializing';

        this.emit('whatsapp-initializing');
    }

    /**
     * Inicializa conexión con Telegram
     */
    async initializeTelegram(config) {
        console.log('📱 Inicializando Telegram...');

        this.channels.telegram.config = config;
        this.channels.telegram.token = config.token;

        // La implementación específica se carga dinámicamente
        // desde telegram-agent.js
        this.channels.telegram.enabled = true;
        this.channels.telegram.status = 'initializing';

        this.emit('telegram-initializing');
    }

    /**
     * Obtiene el estado de todos los canales
     */
    getChannelsStatus() {
        return {
            whatsapp: {
                enabled: this.channels.whatsapp.enabled,
                status: this.channels.whatsapp.status,
                phone: this.channels.whatsapp.phone,
                provider: this.channels.whatsapp.provider
            },
            telegram: {
                enabled: this.channels.telegram.enabled,
                status: this.channels.telegram.status,
                username: this.channels.telegram.username
            }
        };
    }

    /**
     * Envía un mensaje a través del canal especificado
     */
    async sendMessage(channel, recipient, message, options = {}) {
        try {
            if (!this.channels[channel] || !this.channels[channel].enabled) {
                throw new Error(`Canal ${channel} no disponible`);
            }

            if (this.channels[channel].status !== 'connected') {
                throw new Error(`Canal ${channel} no está conectado`);
            }

            const messageData = {
                id: this.generateMessageId(),
                channel,
                recipient,
                message,
                options,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Agregar a la cola de mensajes
            this.messageQueue.push(messageData);

            // Emitir evento para que el agente específico lo procese
            this.emit(`send-${channel}`, messageData);

            console.log(`📤 Mensaje enviado via ${channel} a ${recipient}`);

            return {
                success: true,
                messageId: messageData.id,
                channel,
                recipient,
                timestamp: messageData.timestamp
            };
        } catch (error) {
            console.error(`❌ Error al enviar mensaje via ${channel}:`, error);
            throw error;
        }
    }

    /**
     * Recibe un mensaje de cualquier canal (callback desde agentes)
     */
    async receiveMessage(channel, messageData) {
        try {
            const conversationId = this.getOrCreateConversation(
                channel,
                messageData.from
            );

            const message = {
                id: messageData.id || this.generateMessageId(),
                conversationId,
                channel,
                from: messageData.from,
                text: messageData.text,
                type: messageData.type || 'text',
                timestamp: messageData.timestamp || new Date().toISOString(),
                metadata: messageData.metadata || {}
            };

            // Guardar en conversación
            if (this.conversations.has(conversationId)) {
                this.conversations.get(conversationId).messages.push(message);
            }

            // Emitir evento para webhooks
            this.emit('message-received', message);

            // Ejecutar webhooks registrados
            for (const webhook of this.webhooks.onMessage) {
                try {
                    await webhook(message);
                } catch (error) {
                    console.error('❌ Error en webhook onMessage:', error);
                }
            }

            console.log(`📥 Mensaje recibido de ${channel}: ${messageData.from}`);

            return message;
        } catch (error) {
            console.error('❌ Error al procesar mensaje recibido:', error);
            throw error;
        }
    }

    /**
     * Obtiene o crea una conversación
     */
    getOrCreateConversation(channel, userId) {
        const conversationId = `${channel}_${userId}`;

        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, {
                id: conversationId,
                channel,
                userId,
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                metadata: {}
            });
        }

        return conversationId;
    }

    /**
     * Obtiene el historial de conversaciones
     */
    getConversation(conversationId) {
        return this.conversations.get(conversationId);
    }

    /**
     * Obtiene todas las conversaciones de un canal
     */
    getConversationsByChannel(channel) {
        const conversations = [];
        for (const [id, conv] of this.conversations.entries()) {
            if (conv.channel === channel) {
                conversations.push(conv);
            }
        }
        return conversations;
    }

    /**
     * Registra un template de mensaje
     */
    registerTemplate(name, template) {
        this.templates.set(name, template);
        console.log(`📝 Template registrado: ${name}`);
    }

    /**
     * Envía un mensaje usando un template
     */
    async sendTemplateMessage(channel, recipient, templateName, variables = {}) {
        if (!this.templates.has(templateName)) {
            throw new Error(`Template ${templateName} no encontrado`);
        }

        const template = this.templates.get(templateName);
        let message = template.text;

        // Reemplazar variables en el template
        for (const [key, value] of Object.entries(variables)) {
            message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        return await this.sendMessage(channel, recipient, message, template.options);
    }

    /**
     * Registra un webhook
     */
    registerWebhook(event, callback) {
        if (!this.webhooks[event]) {
            this.webhooks[event] = [];
        }
        this.webhooks[event].push(callback);
        console.log(`🔗 Webhook registrado para evento: ${event}`);
    }

    /**
     * Actualiza el estado de un canal
     */
    updateChannelStatus(channel, status, metadata = {}) {
        if (this.channels[channel]) {
            this.channels[channel].status = status;
            Object.assign(this.channels[channel], metadata);

            this.emit('channel-status-changed', {
                channel,
                status,
                metadata
            });

            // Ejecutar webhooks de cambio de estado
            for (const webhook of this.webhooks.onStatusChange) {
                try {
                    webhook({ channel, status, metadata });
                } catch (error) {
                    console.error('❌ Error en webhook onStatusChange:', error);
                }
            }

            console.log(`🔄 Estado de ${channel} actualizado: ${status}`);
        }
    }

    /**
     * Genera un ID único para mensajes
     */
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtiene estadísticas del servidor
     */
    getStats() {
        return {
            server: {
                name: this.name,
                version: this.version,
                uptime: process.uptime()
            },
            channels: this.getChannelsStatus(),
            conversations: {
                total: this.conversations.size,
                byChannel: {
                    whatsapp: this.getConversationsByChannel('whatsapp').length,
                    telegram: this.getConversationsByChannel('telegram').length
                }
            },
            messages: {
                queued: this.messageQueue.length,
                templates: this.templates.size
            },
            webhooks: {
                onMessage: this.webhooks.onMessage.length,
                onStatusChange: this.webhooks.onStatusChange.length,
                onError: this.webhooks.onError.length
            }
        };
    }

    /**
     * Cierra todas las conexiones y limpia recursos
     */
    async shutdown() {
        console.log('🔴 Cerrando servidor MCP Omnicanalidad...');

        // Emitir evento de cierre
        this.emit('server-shutdown');

        // Limpiar conversaciones y mensajes
        this.conversations.clear();
        this.messageQueue = [];
        this.templates.clear();

        // Resetear estado de canales
        this.channels.whatsapp.status = 'disconnected';
        this.channels.telegram.status = 'disconnected';

        console.log('✅ Servidor MCP cerrado correctamente');
    }
}

module.exports = OmnichannelMCPServer;
