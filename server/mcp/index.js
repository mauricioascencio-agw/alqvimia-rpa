// 🔌 MCP OMNICANALIDAD - Punto de entrada principal
// Integración del servidor MCP con agentes de WhatsApp y Telegram

const OmnichannelMCPServer = require('./omnichannel-server');
const WhatsAppAgent = require('./whatsapp-agent');
const TelegramAgent = require('./telegram-agent');

/**
 * Controlador principal del MCP Omnicanalidad
 */
class OmnichannelController {
    constructor() {
        this.server = new OmnichannelMCPServer();
        this.whatsappAgent = new WhatsAppAgent(this.server);
        this.telegramAgent = new TelegramAgent(this.server);
        this.initialized = false;

        this.setupIntegration();
    }

    /**
     * Configura la integración entre servidor y agentes
     */
    setupIntegration() {
        // Escuchar eventos del servidor para los agentes
        this.server.on('whatsapp-initializing', async () => {
            try {
                await this.whatsappAgent.initialize(this.server.channels.whatsapp.config);
            } catch (error) {
                console.error('❌ Error al inicializar WhatsApp:', error);
            }
        });

        this.server.on('telegram-initializing', async () => {
            try {
                await this.telegramAgent.initialize(this.server.channels.telegram.config);
            } catch (error) {
                console.error('❌ Error al inicializar Telegram:', error);
            }
        });

        // Escuchar envío de mensajes desde el servidor
        this.server.on('send-whatsapp', async (messageData) => {
            try {
                await this.whatsappAgent.sendMessage(
                    messageData.recipient,
                    messageData.message,
                    messageData.options
                );
            } catch (error) {
                console.error('❌ Error al enviar mensaje WhatsApp:', error);
            }
        });

        this.server.on('send-telegram', async (messageData) => {
            try {
                await this.telegramAgent.sendMessage(
                    messageData.recipient,
                    messageData.message,
                    messageData.options
                );
            } catch (error) {
                console.error('❌ Error al enviar mensaje Telegram:', error);
            }
        });

        // Escuchar eventos de los agentes
        this.whatsappAgent.on('qr', (qr) => {
            console.log('📱 QR Code disponible para WhatsApp');
            this.server.channels.whatsapp.qr = qr;
        });

        this.whatsappAgent.on('ready', (info) => {
            console.log('✅ WhatsApp listo:', info);
        });

        this.telegramAgent.on('ready', (info) => {
            console.log('✅ Telegram listo:', info);
        });
    }

    /**
     * Inicializa el sistema completo
     */
    async initialize(config = {}) {
        try {
            const result = await this.server.initialize(config);
            this.initialized = true;
            return result;
        } catch (error) {
            console.error('❌ Error al inicializar controlador:', error);
            throw error;
        }
    }

    /**
     * Envía un mensaje a través de cualquier canal
     */
    async sendMessage(channel, recipient, message, options = {}) {
        return await this.server.sendMessage(channel, recipient, message, options);
    }

    /**
     * Obtiene estadísticas del sistema
     */
    getStats() {
        return this.server.getStats();
    }

    /**
     * Obtiene el estado de los canales
     */
    getChannelsStatus() {
        return this.server.getChannelsStatus();
    }

    /**
     * Registra un webhook
     */
    registerWebhook(event, callback) {
        this.server.registerWebhook(event, callback);
    }

    /**
     * Registra un template de mensaje
     */
    registerTemplate(name, template) {
        this.server.registerTemplate(name, template);
    }

    /**
     * Envía un mensaje usando un template
     */
    async sendTemplateMessage(channel, recipient, templateName, variables = {}) {
        return await this.server.sendTemplateMessage(channel, recipient, templateName, variables);
    }

    /**
     * Obtiene conversaciones
     */
    getConversations(channel = null) {
        if (channel) {
            return this.server.getConversationsByChannel(channel);
        }
        return Array.from(this.server.conversations.values());
    }

    /**
     * Obtiene una conversación específica
     */
    getConversation(conversationId) {
        return this.server.getConversation(conversationId);
    }

    /**
     * Registra un comando de Telegram
     */
    registerTelegramCommand(command, handler) {
        if (this.telegramAgent) {
            this.telegramAgent.registerCommand(command, handler);
        }
    }

    /**
     * Obtiene información de un contacto de WhatsApp
     */
    async getWhatsAppContact(contactId) {
        if (this.whatsappAgent) {
            return await this.whatsappAgent.getContact(contactId);
        }
        return null;
    }

    /**
     * Obtiene chats de WhatsApp
     */
    async getWhatsAppChats() {
        if (this.whatsappAgent) {
            return await this.whatsappAgent.getChats();
        }
        return [];
    }

    /**
     * Obtiene información de un chat de Telegram
     */
    async getTelegramChat(chatId) {
        if (this.telegramAgent) {
            return await this.telegramAgent.getChat(chatId);
        }
        return null;
    }

    /**
     * Envía una foto por WhatsApp
     */
    async sendWhatsAppMedia(to, mediaPath, caption = '', options = {}) {
        if (this.whatsappAgent) {
            return await this.whatsappAgent.sendMedia(to, mediaPath, caption, options);
        }
        throw new Error('WhatsApp agent no disponible');
    }

    /**
     * Envía una foto por Telegram
     */
    async sendTelegramPhoto(chatId, photo, options = {}) {
        if (this.telegramAgent) {
            return await this.telegramAgent.sendPhoto(chatId, photo, options);
        }
        throw new Error('Telegram agent no disponible');
    }

    /**
     * Envía un documento por Telegram
     */
    async sendTelegramDocument(chatId, document, options = {}) {
        if (this.telegramAgent) {
            return await this.telegramAgent.sendDocument(chatId, document, options);
        }
        throw new Error('Telegram agent no disponible');
    }

    /**
     * Envía un mensaje con botones en Telegram
     */
    async sendTelegramMessageWithButtons(chatId, text, buttons, options = {}) {
        if (this.telegramAgent) {
            return await this.telegramAgent.sendMessageWithButtons(chatId, text, buttons, options);
        }
        throw new Error('Telegram agent no disponible');
    }

    /**
     * Obtiene el QR de WhatsApp
     */
    getWhatsAppQR() {
        return this.server.channels.whatsapp.qr;
    }

    /**
     * Cierra todas las conexiones
     */
    async shutdown() {
        try {
            await this.whatsappAgent.disconnect();
            await this.telegramAgent.disconnect();
            await this.server.shutdown();
            this.initialized = false;
            console.log('✅ Sistema de omnicanalidad cerrado');
        } catch (error) {
            console.error('❌ Error al cerrar sistema:', error);
        }
    }
}

// Crear instancia singleton
let instance = null;

function getInstance() {
    if (!instance) {
        instance = new OmnichannelController();
    }
    return instance;
}

module.exports = {
    OmnichannelController,
    getInstance,
    OmnichannelMCPServer,
    WhatsAppAgent,
    TelegramAgent
};
