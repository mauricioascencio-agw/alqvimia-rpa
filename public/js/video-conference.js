/**
 * 🎥 MÓDULO DE VIDEOCONFERENCIA Y GRABACIÓN - Alqvimia RPA
 *
 * Sistema completo de videoconferencia con:
 * - Grabación de video/audio/pantalla
 * - Transcripción en tiempo real
 * - Chat integrado
 * - Compartir archivos
 * - Notas colaborativas
 * - Plugins de IA (GPT, Claude, Gemini)
 * - Generación automática de minutas
 * - Estructura AS-IS / TO-BE
 */

class VideoConference {
    constructor() {
        this.localStream = null;
        this.screenStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.isPaused = false;
        this.startTime = null;
        this.timerInterval = null;
        this.participants = [];
        this.currentWorkflow = null;

        // Configuración
        this.config = {
            recordingFormat: 'webm',
            audioEnabled: true,
            videoEnabled: true,
            screenShareEnabled: false,
            transcriptionEnabled: false,
            aiPlugins: [],
            videoFilter: 'none', // none, blur, sepia, grayscale, vintage
            avatar: null
        };

        // Datos de la sesión
        this.session = {
            id: null,
            startTime: null,
            endTime: null,
            participants: [],
            notes: [],
            transcript: [],
            messages: [],
            files: [],
            recordings: [],
            workflowId: null,
            workflowTitle: null
        };

        // Stickers disponibles (reemplazando emojis con imágenes)
        this.stickers = [
            { id: 'happy', name: 'Feliz', emoji: '😀', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/grinning-face_1f600.gif' },
            { id: 'laugh', name: 'Risa', emoji: '😂', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/face-with-tears-of-joy_1f602.gif' },
            { id: 'love', name: 'Amor', emoji: '😍', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/smiling-face-with-heart-eyes_1f60d.gif' },
            { id: 'thinking', name: 'Pensando', emoji: '🤔', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/thinking-face_1f914.gif' },
            { id: 'thumbsup', name: 'Me gusta', emoji: '👍', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/thumbs-up_1f44d.gif' },
            { id: 'thumbsdown', name: 'No me gusta', emoji: '👎', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/thumbs-down_1f44e.gif' },
            { id: 'heart', name: 'Corazón', emoji: '❤️', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/red-heart_2764-fe0f.gif' },
            { id: 'party', name: 'Fiesta', emoji: '🎉', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/party-popper_1f389.gif' },
            { id: 'fire', name: 'Fuego', emoji: '🔥', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/fire_1f525.gif' },
            { id: 'hundred', name: '100', emoji: '💯', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/hundred-points_1f4af.gif' },
            { id: 'check', name: 'Correcto', emoji: '✅', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/check-mark-button_2705.gif' },
            { id: 'cross', name: 'Incorrecto', emoji: '❌', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/cross-mark_274c.gif' },
            { id: 'memo', name: 'Nota', emoji: '📝', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/memo_1f4dd.gif' },
            { id: 'bulb', name: 'Idea', emoji: '💡', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/light-bulb_1f4a1.gif' },
            { id: 'rocket', name: 'Cohete', emoji: '🚀', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/rocket_1f680.gif' },
            { id: 'star', name: 'Estrella', emoji: '⭐', url: 'https://em-content.zobj.net/source/animated-noto-color-emoji/356/star_2b50.gif' }
        ];

        this.initializeEventHandlers();
    }

    /**
     * Inicializar manejadores de eventos
     */
    initializeEventHandlers() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupUI();
        });
    }

    /**
     * Configurar interfaz de usuario
     */
    setupUI() {
        // Crear contenedor principal si no existe
        if (!document.getElementById('video-conference-container')) {
            this.createMainContainer();
        }
    }

    /**
     * Crear contenedor principal de videoconferencia
     */
    createMainContainer() {
        const container = document.createElement('div');
        container.id = 'video-conference-container';
        container.className = 'video-conference-container hidden';
        container.innerHTML = `
            <div class="video-conference-wrapper">
                <!-- Header con controles principales -->
                <div class="vc-header">
                    <div class="vc-header-left">
                        <h2>
                            <i class="fas fa-video"></i>
                            <span id="vc-session-title">Sesión de Video</span>
                        </h2>
                        <span class="vc-timer" id="vc-timer">00:00:00</span>
                        <span class="vc-recording-indicator hidden" id="vc-recording-indicator">
                            <i class="fas fa-circle recording-pulse"></i>
                            Grabando
                        </span>
                    </div>
                    <div class="vc-header-right">
                        <button class="vc-btn" id="vc-fullscreen-btn" title="Pantalla completa">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="vc-btn" id="vc-settings-btn" title="Configuración">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="vc-btn vc-btn-danger" id="vc-close-btn" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Área principal de video -->
                <div class="vc-main-area">
                    <!-- Videos de participantes -->
                    <div class="vc-video-grid" id="vc-video-grid">
                        <!-- Video local -->
                        <div class="vc-video-item vc-local-video">
                            <video id="vc-local-video" autoplay muted playsinline></video>
                            <div class="vc-video-overlay">
                                <span class="vc-participant-name">Tú</span>
                            </div>
                        </div>

                        <!-- Videos remotos se agregarán dinámicamente -->
                    </div>

                    <!-- Panel lateral (Chat, Participantes, Notas) -->
                    <div class="vc-sidebar" id="vc-sidebar">
                        <div class="vc-sidebar-tabs">
                            <button class="vc-tab active" data-tab="participants">
                                <i class="fas fa-users"></i>
                                Participantes (<span id="vc-participants-count">0</span>)
                            </button>
                            <button class="vc-tab" data-tab="chat">
                                <i class="fas fa-comments"></i>
                                Chat
                                <span class="vc-badge hidden" id="vc-chat-badge">0</span>
                            </button>
                            <button class="vc-tab" data-tab="notes">
                                <i class="fas fa-sticky-note"></i>
                                Notas
                            </button>
                            <button class="vc-tab" data-tab="files">
                                <i class="fas fa-paperclip"></i>
                                Archivos
                            </button>
                            <button class="vc-tab" data-tab="transcript">
                                <i class="fas fa-closed-captioning"></i>
                                Transcripción
                            </button>
                            <button class="vc-tab" data-tab="ai">
                                <i class="fas fa-robot"></i>
                                IA
                            </button>
                        </div>

                        <div class="vc-sidebar-content">
                            <!-- Panel de Participantes -->
                            <div class="vc-panel active" id="vc-panel-participants">
                                <div class="vc-participants-list" id="vc-participants-list">
                                    <!-- Participantes se agregarán aquí -->
                                </div>
                                <div class="vc-invite-section">
                                    <button class="vc-btn-primary" id="vc-invite-btn">
                                        <i class="fas fa-user-plus"></i>
                                        Invitar Participantes
                                    </button>
                                </div>
                            </div>

                            <!-- Panel de Chat -->
                            <div class="vc-panel" id="vc-panel-chat">
                                <div class="vc-chat-messages" id="vc-chat-messages">
                                    <!-- Mensajes de chat -->
                                </div>
                                <div class="vc-emoji-picker hidden" id="vc-emoji-picker">
                                    <div class="vc-emoji-grid" id="vc-emoji-grid">
                                        <!-- Emojis se cargan dinámicamente -->
                                    </div>
                                </div>
                                <div class="vc-chat-input-container">
                                    <button class="vc-btn-emoji" id="vc-emoji-btn" title="Emojis">
                                        <i class="fas fa-smile"></i>
                                    </button>
                                    <textarea
                                        id="vc-chat-input"
                                        placeholder="Escribe un mensaje..."
                                        rows="2"
                                    ></textarea>
                                    <button class="vc-btn-send" id="vc-chat-send">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Panel de Notas -->
                            <div class="vc-panel" id="vc-panel-notes">
                                <div class="vc-notes-toolbar">
                                    <button class="vc-btn-sm" id="vc-add-note-btn">
                                        <i class="fas fa-plus"></i>
                                        Nueva Nota
                                    </button>
                                    <button class="vc-btn-sm" id="vc-export-notes-btn">
                                        <i class="fas fa-download"></i>
                                        Exportar
                                    </button>
                                </div>
                                <div class="vc-notes-list" id="vc-notes-list">
                                    <!-- Notas se agregarán aquí -->
                                </div>
                            </div>

                            <!-- Panel de Archivos -->
                            <div class="vc-panel" id="vc-panel-files">
                                <div class="vc-files-upload">
                                    <input type="file" id="vc-file-input" multiple hidden>
                                    <button class="vc-btn-primary" id="vc-upload-file-btn">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        Subir Archivo
                                    </button>
                                </div>
                                <div class="vc-files-list" id="vc-files-list">
                                    <!-- Archivos compartidos -->
                                </div>
                            </div>

                            <!-- Panel de Transcripción -->
                            <div class="vc-panel" id="vc-panel-transcript">
                                <div class="vc-transcript-controls">
                                    <button class="vc-btn-sm" id="vc-toggle-transcript-btn">
                                        <i class="fas fa-microphone"></i>
                                        <span id="vc-transcript-status">Iniciar Transcripción</span>
                                    </button>
                                    <button class="vc-btn-sm" id="vc-download-transcript-btn">
                                        <i class="fas fa-download"></i>
                                        Descargar
                                    </button>
                                </div>
                                <div class="vc-transcript-content" id="vc-transcript-content">
                                    <!-- Transcripción en tiempo real -->
                                </div>
                            </div>

                            <!-- Panel de IA -->
                            <div class="vc-panel" id="vc-panel-ai">
                                <div class="vc-ai-plugins">
                                    <div class="vc-ai-plugin" data-plugin="gpt">
                                        <div class="vc-ai-plugin-header">
                                            <i class="fas fa-brain"></i>
                                            <span>ChatGPT</span>
                                            <label class="vc-toggle">
                                                <input type="checkbox" id="vc-ai-gpt">
                                                <span class="vc-toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div class="vc-ai-plugin-config">
                                            <input type="text" placeholder="API Key" id="vc-ai-gpt-key">
                                        </div>
                                    </div>

                                    <div class="vc-ai-plugin" data-plugin="claude">
                                        <div class="vc-ai-plugin-header">
                                            <i class="fas fa-robot"></i>
                                            <span>Claude AI</span>
                                            <label class="vc-toggle">
                                                <input type="checkbox" id="vc-ai-claude">
                                                <span class="vc-toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div class="vc-ai-plugin-config">
                                            <input type="text" placeholder="API Key" id="vc-ai-claude-key">
                                        </div>
                                    </div>

                                    <div class="vc-ai-plugin" data-plugin="gemini">
                                        <div class="vc-ai-plugin-header">
                                            <i class="fas fa-gem"></i>
                                            <span>Google Gemini</span>
                                            <label class="vc-toggle">
                                                <input type="checkbox" id="vc-ai-gemini">
                                                <span class="vc-toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div class="vc-ai-plugin-config">
                                            <input type="text" placeholder="API Key" id="vc-ai-gemini-key">
                                        </div>
                                    </div>
                                </div>

                                <div class="vc-ai-actions">
                                    <button class="vc-btn-primary" id="vc-ai-summarize-btn">
                                        <i class="fas fa-compress-alt"></i>
                                        Resumir Sesión
                                    </button>
                                    <button class="vc-btn-primary" id="vc-ai-action-items-btn">
                                        <i class="fas fa-tasks"></i>
                                        Generar Tareas
                                    </button>
                                    <button class="vc-btn-primary" id="vc-ai-minutes-btn">
                                        <i class="fas fa-file-alt"></i>
                                        Generar Minutas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Controles inferiores -->
                <div class="vc-footer">
                    <div class="vc-controls">
                        <!-- Controles de audio/video -->
                        <button class="vc-control-btn" id="vc-toggle-audio" title="Silenciar/Activar micrófono">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button class="vc-control-btn" id="vc-toggle-video" title="Activar/Desactivar cámara">
                            <i class="fas fa-video"></i>
                        </button>
                        <button class="vc-control-btn" id="vc-share-screen" title="Compartir pantalla">
                            <i class="fas fa-desktop"></i>
                        </button>

                        <!-- Selector de filtros de video -->
                        <div class="vc-filter-selector">
                            <button class="vc-control-btn" id="vc-filter-btn" title="Filtros de video">
                                <i class="fas fa-magic"></i>
                            </button>
                            <div class="vc-filter-menu hidden" id="vc-filter-menu">
                                <button onclick="VideoConference.applyVideoFilter('none')">
                                    <i class="fas fa-times"></i> Sin filtro
                                </button>
                                <button onclick="VideoConference.applyVideoFilter('blur')">
                                    <i class="fas fa-adjust"></i> Desenfocar fondo
                                </button>
                                <button onclick="VideoConference.applyVideoFilter('sepia')">
                                    <i class="fas fa-image"></i> Sepia
                                </button>
                                <button onclick="VideoConference.applyVideoFilter('grayscale')">
                                    <i class="fas fa-moon"></i> Blanco y Negro
                                </button>
                                <button onclick="VideoConference.applyVideoFilter('vintage')">
                                    <i class="fas fa-camera-retro"></i> Vintage
                                </button>
                            </div>
                        </div>

                        <!-- Controles de grabación -->
                        <div class="vc-recording-controls">
                            <button class="vc-control-btn vc-btn-record" id="vc-start-recording" title="Iniciar grabación">
                                <i class="fas fa-circle"></i>
                                <span>Grabar</span>
                            </button>
                            <button class="vc-control-btn vc-btn-pause hidden" id="vc-pause-recording" title="Pausar grabación">
                                <i class="fas fa-pause"></i>
                            </button>
                            <button class="vc-control-btn vc-btn-stop hidden" id="vc-stop-recording" title="Detener grabación">
                                <i class="fas fa-stop"></i>
                                <span>Detener</span>
                            </button>
                        </div>

                        <!-- Botón de finalizar sesión -->
                        <button class="vc-control-btn vc-btn-end-call" id="vc-end-session" title="Finalizar sesión">
                            <i class="fas fa-phone-slash"></i>
                            <span>Finalizar</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de invitación -->
            <div class="vc-modal hidden" id="vc-invite-modal">
                <div class="vc-modal-content">
                    <div class="vc-modal-header">
                        <h3>Invitar Participantes</h3>
                        <button class="vc-modal-close" id="vc-invite-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="vc-modal-body">
                        <div class="vc-invite-options">
                            <button class="vc-btn-primary" id="vc-invite-from-json-btn">
                                <i class="fas fa-file-code"></i>
                                Cargar desde JSON
                            </button>
                            <input type="file" id="vc-json-file-input" accept=".json" hidden>
                        </div>

                        <div class="vc-invite-manual">
                            <h4>O invitar manualmente:</h4>
                            <input type="email" id="vc-invite-email" placeholder="Email del participante">
                            <button class="vc-btn-primary" id="vc-send-invite-btn">
                                <i class="fas fa-envelope"></i>
                                Enviar Invitación
                            </button>
                        </div>

                        <div class="vc-invite-link">
                            <h4>Enlace de la sesión:</h4>
                            <div class="vc-link-container">
                                <input type="text" id="vc-session-link" readonly>
                                <button class="vc-btn-copy" id="vc-copy-link-btn">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>

                        <div class="vc-invited-list" id="vc-invited-list">
                            <!-- Lista de invitados -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de configuración AS-IS/TO-BE -->
            <div class="vc-modal hidden" id="vc-process-modal">
                <div class="vc-modal-content vc-modal-large">
                    <div class="vc-modal-header">
                        <h3>Análisis de Proceso</h3>
                        <button class="vc-modal-close" id="vc-process-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="vc-modal-body">
                        <div class="vc-process-sections">
                            <div class="vc-process-section">
                                <h4>AS-IS (Estado Actual)</h4>
                                <textarea id="vc-as-is-notes" placeholder="Describe el proceso actual..."></textarea>
                            </div>
                            <div class="vc-process-section">
                                <h4>TO-BE (Estado Deseado)</h4>
                                <textarea id="vc-to-be-notes" placeholder="Describe el proceso mejorado..."></textarea>
                            </div>
                        </div>
                        <div class="vc-requirements-section">
                            <h4>Requerimientos</h4>
                            <div id="vc-requirements-list">
                                <!-- Lista de requerimientos -->
                            </div>
                            <button class="vc-btn-primary" id="vc-add-requirement-btn">
                                <i class="fas fa-plus"></i>
                                Agregar Requerimiento
                            </button>
                        </div>
                        <div class="vc-modal-footer">
                            <button class="vc-btn-primary" id="vc-save-process-btn">
                                <i class="fas fa-save"></i>
                                Guardar Análisis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.attachEventListeners();
    }

    /**
     * Adjuntar event listeners a los controles
     */
    attachEventListeners() {
        // Controles de audio/video
        document.getElementById('vc-toggle-audio')?.addEventListener('click', () => this.toggleAudio());
        document.getElementById('vc-toggle-video')?.addEventListener('click', () => this.toggleVideo());
        document.getElementById('vc-share-screen')?.addEventListener('click', () => this.toggleScreenShare());

        // Controles de grabación
        document.getElementById('vc-start-recording')?.addEventListener('click', () => this.startRecording());
        document.getElementById('vc-pause-recording')?.addEventListener('click', () => this.pauseRecording());
        document.getElementById('vc-stop-recording')?.addEventListener('click', () => this.stopRecording());

        // Controles de sesión
        document.getElementById('vc-end-session')?.addEventListener('click', () => this.endSession());
        document.getElementById('vc-close-btn')?.addEventListener('click', () => this.closeVideoConference());
        document.getElementById('vc-fullscreen-btn')?.addEventListener('click', () => this.toggleFullscreen());

        // Tabs del sidebar
        document.querySelectorAll('.vc-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
        });

        // Chat
        document.getElementById('vc-chat-send')?.addEventListener('click', () => this.sendMessage());
        document.getElementById('vc-chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Emojis
        document.getElementById('vc-emoji-btn')?.addEventListener('click', () => this.toggleEmojiPicker());

        // Filtros de video
        document.getElementById('vc-filter-btn')?.addEventListener('click', () => this.toggleFilterMenu());

        // Cargar emojis
        this.loadEmojis();

        // Notas
        document.getElementById('vc-add-note-btn')?.addEventListener('click', () => this.addNote());
        document.getElementById('vc-export-notes-btn')?.addEventListener('click', () => this.exportNotes());

        // Archivos
        document.getElementById('vc-upload-file-btn')?.addEventListener('click', () => {
            document.getElementById('vc-file-input').click();
        });
        document.getElementById('vc-file-input')?.addEventListener('change', (e) => this.handleFileUpload(e));

        // Transcripción
        document.getElementById('vc-toggle-transcript-btn')?.addEventListener('click', () => this.toggleTranscription());
        document.getElementById('vc-download-transcript-btn')?.addEventListener('click', () => this.downloadTranscript());

        // Invitación
        document.getElementById('vc-invite-btn')?.addEventListener('click', () => this.showInviteModal());
        document.getElementById('vc-invite-from-json-btn')?.addEventListener('click', () => {
            document.getElementById('vc-json-file-input').click();
        });
        document.getElementById('vc-json-file-input')?.addEventListener('change', (e) => this.loadInviteesFromJSON(e));
        document.getElementById('vc-send-invite-btn')?.addEventListener('click', () => this.sendInvite());
        document.getElementById('vc-copy-link-btn')?.addEventListener('click', () => this.copySessionLink());
        document.getElementById('vc-invite-modal-close')?.addEventListener('click', () => this.hideInviteModal());

        // IA
        document.getElementById('vc-ai-summarize-btn')?.addEventListener('click', () => this.generateAISummary());
        document.getElementById('vc-ai-action-items-btn')?.addEventListener('click', () => this.generateActionItems());
        document.getElementById('vc-ai-minutes-btn')?.addEventListener('click', () => this.generateMinutes());

        // Proceso AS-IS/TO-BE
        document.getElementById('vc-add-requirement-btn')?.addEventListener('click', () => this.addRequirement());
        document.getElementById('vc-save-process-btn')?.addEventListener('click', () => this.saveProcessAnalysis());
        document.getElementById('vc-process-modal-close')?.addEventListener('click', () => this.hideProcessModal());
    }

    /**
     * Iniciar sesión de video
     */
    async startSession(workflowId = null, sessionTitle = 'Sesión de Video') {
        try {
            this.currentWorkflow = workflowId;
            this.session.id = this.generateSessionId();
            this.session.startTime = new Date();

            // Actualizar título
            document.getElementById('vc-session-title').textContent = sessionTitle;

            // Generar enlace de sesión
            this.generateSessionLink();

            // Solicitar permisos de medios
            await this.initializeMedia();

            // Mostrar interfaz
            this.showVideoConference();

            // Iniciar timer
            this.startTimer();

            // Agregar usuario actual como participante
            this.addParticipant({
                id: 'local',
                name: 'Tú',
                email: 'local@user.com',
                isLocal: true
            });

            console.log('Sesión de video iniciada:', this.session.id);

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('No se pudo acceder a la cámara/micrófono. Verifica los permisos.');
        }
    }

    /**
     * Inicializar medios (cámara y micrófono)
     */
    async initializeMedia() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            const localVideo = document.getElementById('vc-local-video');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }

            this.config.audioEnabled = true;
            this.config.videoEnabled = true;

        } catch (error) {
            console.error('Error al acceder a medios:', error);
            throw error;
        }
    }

    /**
     * Alternar audio
     */
    toggleAudio() {
        if (!this.localStream) return;

        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            this.config.audioEnabled = audioTrack.enabled;

            const btn = document.getElementById('vc-toggle-audio');
            const icon = btn.querySelector('i');

            if (audioTrack.enabled) {
                icon.className = 'fas fa-microphone';
                btn.classList.remove('vc-muted');
            } else {
                icon.className = 'fas fa-microphone-slash';
                btn.classList.add('vc-muted');
            }
        }
    }

    /**
     * Alternar video
     */
    toggleVideo() {
        if (!this.localStream) return;

        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            this.config.videoEnabled = videoTrack.enabled;

            const btn = document.getElementById('vc-toggle-video');
            const icon = btn.querySelector('i');

            if (videoTrack.enabled) {
                icon.className = 'fas fa-video';
                btn.classList.remove('vc-muted');
            } else {
                icon.className = 'fas fa-video-slash';
                btn.classList.add('vc-muted');
            }
        }
    }

    /**
     * Compartir pantalla
     */
    async toggleScreenShare() {
        try {
            if (this.config.screenShareEnabled) {
                // Detener compartir pantalla
                if (this.screenStream) {
                    this.screenStream.getTracks().forEach(track => track.stop());
                    this.screenStream = null;
                }
                this.config.screenShareEnabled = false;

                const btn = document.getElementById('vc-share-screen');
                btn.classList.remove('vc-active');

                // Volver a video de cámara
                const localVideo = document.getElementById('vc-local-video');
                if (localVideo && this.localStream) {
                    localVideo.srcObject = this.localStream;
                }

            } else {
                // Iniciar compartir pantalla
                this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'always'
                    },
                    audio: false
                });

                const localVideo = document.getElementById('vc-local-video');
                if (localVideo) {
                    localVideo.srcObject = this.screenStream;
                }

                this.config.screenShareEnabled = true;

                const btn = document.getElementById('vc-share-screen');
                btn.classList.add('vc-active');

                // Detectar cuando el usuario detenga compartir desde el navegador
                this.screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                    this.toggleScreenShare();
                });
            }

        } catch (error) {
            console.error('Error al compartir pantalla:', error);
        }
    }

    // Continúa en la siguiente parte...

    /**
     * Iniciar grabación
     */
    async startRecording() {
        try {
            this.recordedChunks = [];

            // Determinar qué stream grabar
            const streamToRecord = this.config.screenShareEnabled ? this.screenStream : this.localStream;

            if (!streamToRecord) {
                alert('No hay stream disponible para grabar');
                return;
            }

            // Combinar con audio si está disponible
            let tracks = [...streamToRecord.getTracks()];

            if (this.localStream && !this.config.screenShareEnabled) {
                const audioTrack = this.localStream.getAudioTracks()[0];
                if (audioTrack && !tracks.includes(audioTrack)) {
                    tracks.push(audioTrack);
                }
            }

            const combinedStream = new MediaStream(tracks);

            // Configurar MediaRecorder
            const options = {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: 2500000
            };

            this.mediaRecorder = new MediaRecorder(combinedStream, options);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };

            this.mediaRecorder.start(1000); // Capturar cada segundo

            this.isRecording = true;
            this.startTime = Date.now();

            // Actualizar UI
            document.getElementById('vc-start-recording').classList.add('hidden');
            document.getElementById('vc-pause-recording').classList.remove('hidden');
            document.getElementById('vc-stop-recording').classList.remove('hidden');
            document.getElementById('vc-recording-indicator').classList.remove('hidden');

            console.log('Grabación iniciada');

        } catch (error) {
            console.error('Error al iniciar grabación:', error);
            alert('Error al iniciar la grabación');
        }
    }

    /**
     * Pausar grabación
     */
    pauseRecording() {
        if (this.mediaRecorder && this.isRecording) {
            if (this.isPaused) {
                this.mediaRecorder.resume();
                this.isPaused = false;
                document.getElementById('vc-pause-recording').querySelector('i').className = 'fas fa-pause';
            } else {
                this.mediaRecorder.pause();
                this.isPaused = true;
                document.getElementById('vc-pause-recording').querySelector('i').className = 'fas fa-play';
            }
        }
    }

    /**
     * Detener grabación
     */
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.isPaused = false;

            // Actualizar UI
            document.getElementById('vc-start-recording').classList.remove('hidden');
            document.getElementById('vc-pause-recording').classList.add('hidden');
            document.getElementById('vc-stop-recording').classList.add('hidden');
            document.getElementById('vc-recording-indicator').classList.add('hidden');

            console.log('Grabación detenida');
        }
    }

    /**
     * Guardar grabación
     */
    async saveRecording() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `recording_${timestamp}.webm`;

        // Agregar a la sesión
        this.session.recordings.push({
            filename,
            blob,
            timestamp: new Date(),
            duration: this.getRecordingDuration()
        });

        // Descargar automáticamente
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        // Guardar en el servidor
        await this.uploadRecording(blob, filename);
    }

    /**
     * Subir grabación al servidor
     */
    async uploadRecording(blob, filename) {
        try {
            const formData = new FormData();
            formData.append('video', blob, filename);
            formData.append('workflowId', this.currentWorkflow || 'general');
            formData.append('sessionId', this.session.id);

            const response = await fetch('/api/video-conference/upload-recording', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Grabación subida:', result);

        } catch (error) {
            console.error('Error al subir grabación:', error);
        }
    }

    /**
     * Obtener duración de grabación
     */
    getRecordingDuration() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    // CONTINUARÁ EN EL SIGUIENTE ARCHIVO...

    /**
     * Generar ID de sesión
     */
    generateSessionId() {
        return `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generar enlace de sesión
     */
    generateSessionLink() {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/video-conference/${this.session.id}`;
        document.getElementById('vc-session-link').value = link;
        return link;
    }

    /**
     * Copiar enlace de sesión
     */
    copySessionLink() {
        const linkInput = document.getElementById('vc-session-link');
        linkInput.select();
        document.execCommand('copy');

        // Feedback visual
        const btn = document.getElementById('vc-copy-link-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }

    /**
     * Mostrar interfaz
     */
    showVideoConference() {
        document.getElementById('video-conference-container').classList.remove('hidden');
    }

    /**
     * Cerrar interfaz
     */
    closeVideoConference() {
        if (confirm('¿Estás seguro de que deseas cerrar la videoconferencia?')) {
            this.cleanup();
            document.getElementById('video-conference-container').classList.add('hidden');
        }
    }

    /**
     * Limpieza de recursos
     */
    cleanup() {
        // Detener streams
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
        }

        // Detener grabación si está activa
        if (this.isRecording) {
            this.stopRecording();
        }

        // Detener timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    /**
     * Iniciar timer
     */
    startTimer() {
        const timerElement = document.getElementById('vc-timer');
        let seconds = 0;

        this.timerInterval = setInterval(() => {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            timerElement.textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Cambiar tab del sidebar
     */
    switchTab(tabName) {
        // Actualizar tabs
        document.querySelectorAll('.vc-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Actualizar paneles
        document.querySelectorAll('.vc-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`vc-panel-${tabName}`).classList.add('active');
    }

    /**
     * Agregar participante
     */
    addParticipant(participant) {
        this.participants.push(participant);
        this.session.participants.push(participant);
        this.updateParticipantsList();
        this.updateParticipantsCount();
    }

    /**
     * Actualizar lista de participantes
     */
    updateParticipantsList() {
        const list = document.getElementById('vc-participants-list');
        list.innerHTML = '';

        this.participants.forEach(p => {
            const item = document.createElement('div');
            item.className = 'vc-participant-item';

            // Generar avatar
            const avatarHTML = p.avatar
                ? `<img src="${p.avatar}" alt="${p.name}">`
                : `<div class="vc-avatar-initials" style="background: ${this.getAvatarColor(p.name)}">${this.getInitials(p.name)}</div>`;

            item.innerHTML = `
                <div class="vc-participant-avatar">
                    ${avatarHTML}
                </div>
                <div class="vc-participant-info">
                    <div class="vc-participant-name">${p.name}</div>
                    <div class="vc-participant-email">${p.email}</div>
                </div>
                <div class="vc-participant-status">
                    ${p.isLocal ? '<span class="vc-badge-success">Tú</span>' : '<span class="vc-badge">En línea</span>'}
                </div>
            `;
            list.appendChild(item);
        });
    }

    /**
     * Obtener iniciales del nombre
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    /**
     * Obtener color de avatar basado en el nombre
     */
    getAvatarColor(name) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    /**
     * Actualizar contador de participantes
     */
    updateParticipantsCount() {
        document.getElementById('vc-participants-count').textContent = this.participants.length;
    }

    /**
     * Enviar mensaje de chat
     */
    sendMessage() {
        const input = document.getElementById('vc-chat-input');
        const message = input.value.trim();

        if (!message) return;

        const messageData = {
            id: Date.now(),
            user: 'Tú',
            message,
            timestamp: new Date()
        };

        this.session.messages.push(messageData);
        this.displayMessage(messageData);

        input.value = '';
    }

    /**
     * Insertar emoji en el chat
     */
    insertEmoji(emoji) {
        const input = document.getElementById('vc-chat-input');
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(cursorPos);

        input.value = textBefore + emoji + textAfter;
        input.focus();

        // Colocar cursor después del emoji
        const newPos = cursorPos + emoji.length;
        input.setSelectionRange(newPos, newPos);
    }

    /**
     * Insertar sticker en el chat (como imagen)
     */
    insertSticker(url, name) {
        const input = document.getElementById('vc-chat-input');
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(cursorPos);

        // Insertar marcador de sticker en el texto
        const stickerMarker = `[STICKER:${url}|${name}]`;
        input.value = textBefore + stickerMarker + textAfter;
        input.focus();

        // Colocar cursor después del sticker
        const newPos = cursorPos + stickerMarker.length;
        input.setSelectionRange(newPos, newPos);

        // Cerrar el picker de emojis
        this.toggleEmojiPicker();
    }

    /**
     * Aplicar filtro de video
     */
    applyVideoFilter(filter) {
        const videoElement = document.getElementById('vc-local-video');
        if (!videoElement) return;

        // Remover filtros anteriores
        videoElement.style.filter = '';

        // Aplicar nuevo filtro
        switch (filter) {
            case 'blur':
                videoElement.style.filter = 'blur(5px)';
                break;
            case 'sepia':
                videoElement.style.filter = 'sepia(100%)';
                break;
            case 'grayscale':
                videoElement.style.filter = 'grayscale(100%)';
                break;
            case 'vintage':
                videoElement.style.filter = 'sepia(50%) contrast(120%) brightness(90%)';
                break;
            case 'none':
            default:
                videoElement.style.filter = 'none';
                break;
        }

        this.config.videoFilter = filter;

        // Ocultar menú de filtros
        this.toggleFilterMenu();
    }

    /**
     * Toggle menú de filtros
     */
    toggleFilterMenu() {
        const menu = document.getElementById('vc-filter-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }

    /**
     * Cargar stickers en el picker (reemplazando emojis)
     */
    loadEmojis() {
        const emojiGrid = document.getElementById('vc-emoji-grid');
        if (!emojiGrid) return;

        emojiGrid.innerHTML = this.stickers.map(sticker => `
            <button class="vc-emoji-item"
                    onclick="VideoConference.insertSticker('${sticker.url}', '${sticker.name}')"
                    title="${sticker.name}">
                <img src="${sticker.url}"
                     alt="${sticker.name}"
                     class="vc-sticker-img"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><text y=%2224%22 font-size=%2224%22>${sticker.emoji}</text></svg>'">
            </button>
        `).join('');
    }

    /**
     * Toggle emoji picker
     */
    toggleEmojiPicker() {
        const picker = document.getElementById('vc-emoji-picker');
        if (picker) {
            picker.classList.toggle('hidden');
        }
    }

    /**
     * Mostrar mensaje en el chat
     */
    displayMessage(messageData) {
        const messagesContainer = document.getElementById('vc-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'vc-chat-message';

        // Procesar mensaje para reemplazar marcadores de stickers con imágenes
        const processedMessage = this.processStickerMarkers(messageData.message);

        messageDiv.innerHTML = `
            <div class="vc-message-header">
                <strong>${messageData.user}</strong>
                <span class="vc-message-time">${this.formatTime(messageData.timestamp)}</span>
            </div>
            <div class="vc-message-content">${processedMessage}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Procesar marcadores de stickers y convertirlos a imágenes
     */
    processStickerMarkers(message) {
        // Escapar HTML primero
        let processed = this.escapeHtml(message);

        // Reemplazar marcadores [STICKER:url|name] con imágenes
        processed = processed.replace(/\[STICKER:([^\|]+)\|([^\]]+)\]/g, (match, url, name) => {
            return `<img src="${url}" alt="${name}" class="vc-sticker-message" title="${name}">`;
        });

        return processed;
    }

    /**
     * Formatear tiempo
     */
    formatTime(date) {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Pantalla completa
     */
    toggleFullscreen() {
        const container = document.getElementById('video-conference-container');

        if (!document.fullscreenElement) {
            container.requestFullscreen();
            document.getElementById('vc-fullscreen-btn').innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            document.getElementById('vc-fullscreen-btn').innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Métodos adicionales que se implementarán en el archivo de estilos y complementos...
}

// Instancia global
window.VideoConference = new VideoConference();
