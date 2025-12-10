// 📱 AGENTE WHATSAPP - Chatbot y gestión de mensajería
// Soporta múltiples proveedores: whatsapp-web.js y Twilio

const { EventEmitter } = require('events');

/**
 * Agente de WhatsApp para el servidor MCP Omnicanalidad
 * Maneja la conexión y comunicación con WhatsApp
 */
class WhatsAppAgent extends EventEmitter {
    constructor(mcpServer) {
        super();
        this.mcpServer = mcpServer;
        this.provider = null;
        this.client = null;
        this.status = 'disconnected';
        this.config = {};
        this.qrCode = null;

        console.log('📱 WhatsApp Agent inicializado');
    }

    /**
     * Inicializa la conexión con WhatsApp
     */
    async initialize(config) {
        try {
            this.config = config;
            this.provider = config.provider || 'whatsapp-web.js';

            console.log(`📱 Inicializando WhatsApp con proveedor: ${this.provider}`);

            if (this.provider === 'whatsapp-web.js') {
                await this.initializeWebJS();
            } else if (this.provider === 'twilio') {
                await this.initializeTwilio();
            } else {
                throw new Error(`Proveedor no soportado: ${this.provider}`);
            }

            return {
                success: true,
                provider: this.provider,
                status: this.status
            };
        } catch (error) {
            console.error('❌ Error al inicializar WhatsApp Agent:', error);
            this.status = 'error';
            this.mcpServer.updateChannelStatus('whatsapp', 'error', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Inicializa whatsapp-web.js
     */
    async initializeWebJS() {
        try {
            // Verificar si el módulo está instalado
            let Client, LocalAuth;
            try {
                const wwebjs = require('whatsapp-web.js');
                Client = wwebjs.Client;
                LocalAuth = wwebjs.LocalAuth;
            } catch (error) {
                console.warn('⚠️ whatsapp-web.js no instalado. Usa: npm install whatsapp-web.js');
                this.status = 'not_installed';
                this.mcpServer.updateChannelStatus('whatsapp', 'not_installed', {
                    message: 'Ejecuta: npm install whatsapp-web.js',
                    provider: 'whatsapp-web.js'
                });
                return;
            }

            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: this.config.clientId || 'alqvimia-rpa-whatsapp'
                }),
                puppeteer: {
                    headless: this.config.headless !== false,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            });

            // Evento: QR Code generado
            this.client.on('qr', (qr) => {
                console.log('📱 QR Code generado para WhatsApp');
                this.qrCode = qr;
                this.status = 'qr_ready';

                this.mcpServer.updateChannelStatus('whatsapp', 'qr_ready', {
                    qr: qr,
                    message: 'Escanea el código QR con WhatsApp'
                });

                this.emit('qr', qr);
            });

            // Evento: Autenticación exitosa
            this.client.on('authenticated', () => {
                console.log('✅ WhatsApp autenticado correctamente');
                this.status = 'authenticated';
                this.mcpServer.updateChannelStatus('whatsapp', 'authenticated');
            });

            // Evento: Cliente listo
            this.client.on('ready', async () => {
                console.log('✅ WhatsApp cliente listo');
                this.status = 'connected';

                const info = this.client.info;
                this.mcpServer.updateChannelStatus('whatsapp', 'connected', {
                    phone: info.wid.user,
                    pushname: info.pushname,
                    platform: info.platform
                });

                this.emit('ready', info);
            });

            // Evento: Mensaje recibido
            this.client.on('message', async (message) => {
                await this.handleIncomingMessage(message);
            });

            // Evento: Desconexión
            this.client.on('disconnected', (reason) => {
                console.log('🔴 WhatsApp desconectado:', reason);
                this.status = 'disconnected';
                this.mcpServer.updateChannelStatus('whatsapp', 'disconnected', {
                    reason
                });
                this.emit('disconnected', reason);
            });

            // Evento: Error de autenticación
            this.client.on('auth_failure', (message) => {
                console.error('❌ Error de autenticación WhatsApp:', message);
                this.status = 'auth_failure';
                this.mcpServer.updateChannelStatus('whatsapp', 'auth_failure', {
                    error: message
                });
                this.emit('auth_failure', message);
            });

            // Inicializar cliente
            await this.client.initialize();

            console.log('📱 WhatsApp Web JS inicializado, esperando QR...');

        } catch (error) {
            console.error('❌ Error en initializeWebJS:', error);
            throw error;
        }
    }

    /**
     * Inicializa Twilio para WhatsApp
     */
    async initializeTwilio() {
        try {
            // Verificar si Twilio está instalado
            let twilio;
            try {
                twilio = require('twilio');
            } catch (error) {
                console.warn('⚠️ Twilio no instalado. Usa: npm install twilio');
                this.status = 'not_installed';
                this.mcpServer.updateChannelStatus('whatsapp', 'not_installed', {
                    message: 'Ejecuta: npm install twilio',
                    provider: 'twilio'
                });
                return;
            }

            if (!this.config.accountSid || !this.config.authToken) {
                throw new Error('Twilio requiere accountSid y authToken en la configuración');
            }

            this.client = twilio(
                this.config.accountSid,
                this.config.authToken
            );

            this.status = 'connected';
            this.mcpServer.updateChannelStatus('whatsapp', 'connected', {
                provider: 'twilio',
                from: this.config.from
            });

            console.log('✅ Twilio WhatsApp inicializado');

        } catch (error) {
            console.error('❌ Error en initializeTwilio:', error);
            throw error;
        }
    }

    /**
     * Maneja mensajes entrantes
     */
    async handleIncomingMessage(message) {
        try {
            const messageData = {
                id: message.id._serialized || message.id,
                from: message.from,
                text: message.body,
                type: message.type,
                timestamp: message.timestamp,
                metadata: {
                    hasMedia: message.hasMedia,
                    isForwarded: message.isForwarded,
                    isStatus: message.isStatus,
                    fromMe: message.fromMe,
                    author: message.author,
                    mentionedIds: message.mentionedIds
                }
            };

            // Ignorar mensajes propios y estados
            if (messageData.metadata.fromMe || messageData.metadata.isStatus) {
                return;
            }

            // Procesar media si existe
            if (message.hasMedia) {
                try {
                    const media = await message.downloadMedia();
                    messageData.media = {
                        mimetype: media.mimetype,
                        data: media.data,
                        filename: media.filename
                    };
                } catch (error) {
                    console.error('❌ Error al descargar media:', error);
                }
            }

            // Enviar al servidor MCP
            await this.mcpServer.receiveMessage('whatsapp', messageData);

            // Auto-respuesta si está configurada
            if (this.config.autoReply && this.config.autoReplyMessage) {
                await this.sendMessage(message.from, this.config.autoReplyMessage);
            }

        } catch (error) {
            console.error('❌ Error al manejar mensaje entrante:', error);
        }
    }

    /**
     * Envía un mensaje por WhatsApp
     */
    async sendMessage(to, text, options = {}) {
        try {
            if (this.status !== 'connected') {
                throw new Error(`WhatsApp no conectado. Estado: ${this.status}`);
            }

            let result;

            if (this.provider === 'whatsapp-web.js') {
                // Formatear número para whatsapp-web.js
                const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
                result = await this.client.sendMessage(chatId, text, options);

                return {
                    success: true,
                    messageId: result.id._serialized || result.id,
                    to,
                    text,
                    timestamp: result.timestamp
                };

            } else if (this.provider === 'twilio') {
                result = await this.client.messages.create({
                    from: `whatsapp:${this.config.from}`,
                    to: `whatsapp:${to}`,
                    body: text,
                    ...options
                });

                return {
                    success: true,
                    messageId: result.sid,
                    to,
                    text,
                    status: result.status
                };
            }

        } catch (error) {
            console.error('❌ Error al enviar mensaje WhatsApp:', error);
            throw error;
        }
    }

    /**
     * Envía un mensaje con media (imagen, video, documento)
     */
    async sendMedia(to, mediaPath, caption = '', options = {}) {
        try {
            if (this.status !== 'connected') {
                throw new Error(`WhatsApp no conectado. Estado: ${this.status}`);
            }

            if (this.provider === 'whatsapp-web.js') {
                const MessageMedia = require('whatsapp-web.js').MessageMedia;
                const media = MessageMedia.fromFilePath(mediaPath);

                const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
                const result = await this.client.sendMessage(chatId, media, {
                    caption,
                    ...options
                });

                return {
                    success: true,
                    messageId: result.id._serialized || result.id,
                    to,
                    mediaPath,
                    caption
                };

            } else if (this.provider === 'twilio') {
                const result = await this.client.messages.create({
                    from: `whatsapp:${this.config.from}`,
                    to: `whatsapp:${to}`,
                    mediaUrl: [mediaPath],
                    body: caption,
                    ...options
                });

                return {
                    success: true,
                    messageId: result.sid,
                    to,
                    mediaPath,
                    caption
                };
            }

        } catch (error) {
            console.error('❌ Error al enviar media WhatsApp:', error);
            throw error;
        }
    }

    /**
     * Obtiene información de un contacto
     */
    async getContact(contactId) {
        try {
            if (this.provider === 'whatsapp-web.js' && this.client) {
                const contact = await this.client.getContactById(contactId);
                return {
                    id: contact.id._serialized,
                    name: contact.name || contact.pushname,
                    number: contact.number,
                    isMyContact: contact.isMyContact,
                    isBlocked: contact.isBlocked
                };
            }
            return null;
        } catch (error) {
            console.error('❌ Error al obtener contacto:', error);
            return null;
        }
    }

    /**
     * Obtiene los chats activos
     */
    async getChats() {
        try {
            if (this.provider === 'whatsapp-web.js' && this.client) {
                const chats = await this.client.getChats();
                return chats.map(chat => ({
                    id: chat.id._serialized,
                    name: chat.name,
                    isGroup: chat.isGroup,
                    unreadCount: chat.unreadCount,
                    timestamp: chat.timestamp
                }));
            }
            return [];
        } catch (error) {
            console.error('❌ Error al obtener chats:', error);
            return [];
        }
    }

    /**
     * Cierra la conexión
     */
    async disconnect() {
        try {
            if (this.client) {
                if (this.provider === 'whatsapp-web.js') {
                    await this.client.destroy();
                }
                this.client = null;
            }
            this.status = 'disconnected';
            this.mcpServer.updateChannelStatus('whatsapp', 'disconnected');
            console.log('🔴 WhatsApp Agent desconectado');
        } catch (error) {
            console.error('❌ Error al desconectar WhatsApp:', error);
        }
    }

    /**
     * Obtiene el estado actual
     */
    getStatus() {
        return {
            status: this.status,
            provider: this.provider,
            qrCode: this.qrCode,
            config: {
                autoReply: this.config.autoReply || false,
                headless: this.config.headless !== false
            }
        };
    }
}

module.exports = WhatsAppAgent;
