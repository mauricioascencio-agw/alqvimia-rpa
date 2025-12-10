// 📱 AGENTE TELEGRAM - Chatbot y gestión de mensajería
// Utiliza node-telegram-bot-api para la comunicación

const { EventEmitter } = require('events');

/**
 * Agente de Telegram para el servidor MCP Omnicanalidad
 * Maneja la conexión y comunicación con Telegram Bot API
 */
class TelegramAgent extends EventEmitter {
    constructor(mcpServer) {
        super();
        this.mcpServer = mcpServer;
        this.bot = null;
        this.status = 'disconnected';
        this.config = {};
        this.botInfo = null;
        this.commands = new Map();

        console.log('📱 Telegram Agent inicializado');
    }

    /**
     * Inicializa la conexión con Telegram
     */
    async initialize(config) {
        try {
            this.config = config;

            if (!config.token) {
                throw new Error('Token de Telegram es requerido');
            }

            console.log('📱 Inicializando Telegram Bot...');

            // Verificar si el módulo está instalado
            let TelegramBot;
            try {
                TelegramBot = require('node-telegram-bot-api');
            } catch (error) {
                console.warn('⚠️ node-telegram-bot-api no instalado. Usa: npm install node-telegram-bot-api');
                this.status = 'not_installed';
                this.mcpServer.updateChannelStatus('telegram', 'not_installed', {
                    message: 'Ejecuta: npm install node-telegram-bot-api'
                });
                return {
                    success: false,
                    status: 'not_installed',
                    message: 'node-telegram-bot-api no instalado'
                };
            }

            // Crear bot
            this.bot = new TelegramBot(config.token, {
                polling: config.polling !== false
            });

            // Obtener información del bot
            this.botInfo = await this.bot.getMe();
            console.log(`✅ Bot conectado: @${this.botInfo.username}`);

            this.status = 'connected';
            this.mcpServer.updateChannelStatus('telegram', 'connected', {
                username: this.botInfo.username,
                id: this.botInfo.id,
                firstName: this.botInfo.first_name
            });

            // Registrar manejadores de eventos
            this.setupEventHandlers();

            // Registrar comandos por defecto
            this.registerDefaultCommands();

            this.emit('ready', this.botInfo);

            return {
                success: true,
                status: this.status,
                botInfo: this.botInfo
            };

        } catch (error) {
            console.error('❌ Error al inicializar Telegram Agent:', error);
            this.status = 'error';
            this.mcpServer.updateChannelStatus('telegram', 'error', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Configura los manejadores de eventos del bot
     */
    setupEventHandlers() {
        // Evento: Mensaje de texto
        this.bot.on('message', async (msg) => {
            await this.handleIncomingMessage(msg);
        });

        // Evento: Comando
        this.bot.on('callback_query', async (query) => {
            await this.handleCallbackQuery(query);
        });

        // Evento: Error de polling
        this.bot.on('polling_error', (error) => {
            console.error('❌ Error de polling Telegram:', error);
            this.emit('polling_error', error);
        });

        // Evento: Error general
        this.bot.on('error', (error) => {
            console.error('❌ Error Telegram Bot:', error);
            this.emit('error', error);
        });
    }

    /**
     * Registra comandos por defecto
     */
    registerDefaultCommands() {
        // Comando /start
        this.registerCommand('start', async (msg) => {
            const welcomeMessage = this.config.welcomeMessage ||
                `¡Hola! 👋 Soy el bot de Alqvimia RPA.\n\nComandos disponibles:\n/help - Mostrar ayuda\n/status - Ver estado del bot`;

            await this.sendMessage(msg.chat.id, welcomeMessage);
        });

        // Comando /help
        this.registerCommand('help', async (msg) => {
            const commands = Array.from(this.commands.keys());
            const helpText = `📚 *Comandos disponibles:*\n\n${commands.map(cmd => `/${cmd}`).join('\n')}`;

            await this.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
        });

        // Comando /status
        this.registerCommand('status', async (msg) => {
            const stats = this.mcpServer.getStats();
            const statusText = `📊 *Estado del Sistema*\n\n` +
                `🤖 Bot: @${this.botInfo.username}\n` +
                `✅ Estado: ${this.status}\n` +
                `💬 Conversaciones: ${stats.conversations.byChannel.telegram}\n` +
                `📨 Mensajes en cola: ${stats.messages.queued}`;

            await this.sendMessage(msg.chat.id, statusText, { parse_mode: 'Markdown' });
        });
    }

    /**
     * Registra un comando personalizado
     */
    registerCommand(command, handler) {
        this.commands.set(command, handler);
        console.log(`✅ Comando registrado: /${command}`);

        // Registrar en el bot
        this.bot.onText(new RegExp(`^/${command}`), handler);
    }

    /**
     * Maneja mensajes entrantes
     */
    async handleIncomingMessage(msg) {
        try {
            const messageData = {
                id: msg.message_id,
                from: msg.from.id.toString(),
                text: msg.text || msg.caption || '',
                type: this.getMessageType(msg),
                timestamp: new Date(msg.date * 1000).toISOString(),
                metadata: {
                    chatId: msg.chat.id,
                    chatType: msg.chat.type,
                    firstName: msg.from.first_name,
                    lastName: msg.from.last_name,
                    username: msg.from.username,
                    isBot: msg.from.is_bot,
                    replyToMessage: msg.reply_to_message ? msg.reply_to_message.message_id : null
                }
            };

            // Procesar diferentes tipos de mensajes
            if (msg.photo) {
                messageData.photo = msg.photo[msg.photo.length - 1]; // Foto de mejor calidad
            }
            if (msg.document) {
                messageData.document = msg.document;
            }
            if (msg.video) {
                messageData.video = msg.video;
            }
            if (msg.audio) {
                messageData.audio = msg.audio;
            }
            if (msg.voice) {
                messageData.voice = msg.voice;
            }
            if (msg.location) {
                messageData.location = msg.location;
            }

            // Ignorar comandos (ya se manejan en los handlers)
            if (msg.text && msg.text.startsWith('/')) {
                return;
            }

            // Enviar al servidor MCP
            await this.mcpServer.receiveMessage('telegram', messageData);

            // Auto-respuesta si está configurada
            if (this.config.autoReply && this.config.autoReplyMessage) {
                await this.sendMessage(msg.chat.id, this.config.autoReplyMessage);
            }

        } catch (error) {
            console.error('❌ Error al manejar mensaje entrante:', error);
        }
    }

    /**
     * Determina el tipo de mensaje
     */
    getMessageType(msg) {
        if (msg.text) return 'text';
        if (msg.photo) return 'photo';
        if (msg.document) return 'document';
        if (msg.video) return 'video';
        if (msg.audio) return 'audio';
        if (msg.voice) return 'voice';
        if (msg.location) return 'location';
        if (msg.contact) return 'contact';
        if (msg.sticker) return 'sticker';
        return 'unknown';
    }

    /**
     * Maneja callback queries (botones inline)
     */
    async handleCallbackQuery(query) {
        try {
            const data = {
                queryId: query.id,
                from: query.from.id.toString(),
                data: query.data,
                messageId: query.message.message_id,
                chatId: query.message.chat.id
            };

            this.emit('callback_query', data);

            // Responder al query para quitar el loading
            await this.bot.answerCallbackQuery(query.id);

        } catch (error) {
            console.error('❌ Error al manejar callback query:', error);
        }
    }

    /**
     * Envía un mensaje de texto
     */
    async sendMessage(chatId, text, options = {}) {
        try {
            if (this.status !== 'connected') {
                throw new Error(`Telegram no conectado. Estado: ${this.status}`);
            }

            const result = await this.bot.sendMessage(chatId, text, options);

            return {
                success: true,
                messageId: result.message_id,
                chatId: result.chat.id,
                text: result.text,
                date: result.date
            };

        } catch (error) {
            console.error('❌ Error al enviar mensaje Telegram:', error);
            throw error;
        }
    }

    /**
     * Envía una foto
     */
    async sendPhoto(chatId, photo, options = {}) {
        try {
            if (this.status !== 'connected') {
                throw new Error(`Telegram no conectado. Estado: ${this.status}`);
            }

            const result = await this.bot.sendPhoto(chatId, photo, options);

            return {
                success: true,
                messageId: result.message_id,
                chatId: result.chat.id,
                photo: result.photo
            };

        } catch (error) {
            console.error('❌ Error al enviar foto Telegram:', error);
            throw error;
        }
    }

    /**
     * Envía un documento
     */
    async sendDocument(chatId, document, options = {}) {
        try {
            if (this.status !== 'connected') {
                throw new Error(`Telegram no conectado. Estado: ${this.status}`);
            }

            const result = await this.bot.sendDocument(chatId, document, options);

            return {
                success: true,
                messageId: result.message_id,
                chatId: result.chat.id,
                document: result.document
            };

        } catch (error) {
            console.error('❌ Error al enviar documento Telegram:', error);
            throw error;
        }
    }

    /**
     * Envía un mensaje con botones inline
     */
    async sendMessageWithButtons(chatId, text, buttons, options = {}) {
        try {
            const keyboard = {
                inline_keyboard: buttons
            };

            return await this.sendMessage(chatId, text, {
                reply_markup: keyboard,
                ...options
            });

        } catch (error) {
            console.error('❌ Error al enviar mensaje con botones:', error);
            throw error;
        }
    }

    /**
     * Envía una acción de chat (escribiendo, subiendo foto, etc.)
     */
    async sendChatAction(chatId, action) {
        try {
            // Acciones: typing, upload_photo, record_video, upload_video,
            // record_voice, upload_voice, upload_document, find_location,
            // record_video_note, upload_video_note
            await this.bot.sendChatAction(chatId, action);
        } catch (error) {
            console.error('❌ Error al enviar chat action:', error);
        }
    }

    /**
     * Obtiene información de un chat
     */
    async getChat(chatId) {
        try {
            const chat = await this.bot.getChat(chatId);
            return {
                id: chat.id,
                type: chat.type,
                title: chat.title,
                username: chat.username,
                firstName: chat.first_name,
                lastName: chat.last_name,
                description: chat.description,
                memberCount: chat.member_count
            };
        } catch (error) {
            console.error('❌ Error al obtener chat:', error);
            return null;
        }
    }

    /**
     * Obtiene información de un usuario
     */
    async getUser(userId) {
        try {
            const chatMember = await this.bot.getChatMember(userId, userId);
            return {
                id: chatMember.user.id,
                isBot: chatMember.user.is_bot,
                firstName: chatMember.user.first_name,
                lastName: chatMember.user.last_name,
                username: chatMember.user.username,
                status: chatMember.status
            };
        } catch (error) {
            console.error('❌ Error al obtener usuario:', error);
            return null;
        }
    }

    /**
     * Elimina un mensaje
     */
    async deleteMessage(chatId, messageId) {
        try {
            await this.bot.deleteMessage(chatId, messageId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar mensaje:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Edita un mensaje
     */
    async editMessage(chatId, messageId, text, options = {}) {
        try {
            const result = await this.bot.editMessageText(text, {
                chat_id: chatId,
                message_id: messageId,
                ...options
            });
            return { success: true, result };
        } catch (error) {
            console.error('❌ Error al editar mensaje:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Descarga un archivo
     */
    async downloadFile(fileId, downloadDir = './downloads') {
        try {
            const filePath = await this.bot.downloadFile(fileId, downloadDir);
            return {
                success: true,
                filePath
            };
        } catch (error) {
            console.error('❌ Error al descargar archivo:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cierra la conexión
     */
    async disconnect() {
        try {
            if (this.bot) {
                await this.bot.stopPolling();
                this.bot = null;
            }
            this.status = 'disconnected';
            this.mcpServer.updateChannelStatus('telegram', 'disconnected');
            console.log('🔴 Telegram Agent desconectado');
        } catch (error) {
            console.error('❌ Error al desconectar Telegram:', error);
        }
    }

    /**
     * Obtiene el estado actual
     */
    getStatus() {
        return {
            status: this.status,
            botInfo: this.botInfo,
            commands: Array.from(this.commands.keys()),
            config: {
                polling: this.config.polling !== false,
                autoReply: this.config.autoReply || false
            }
        };
    }
}

module.exports = TelegramAgent;
