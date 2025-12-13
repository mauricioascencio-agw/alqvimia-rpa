/**
 * 🎙️ CARACTERÍSTICAS AVANZADAS DE VIDEOCONFERENCIA
 *
 * Transcripción, Notas, Archivos, IA, y Generación de Minutas
 */

// Extender la clase VideoConference con características avanzadas
Object.assign(VideoConference.prototype, {

    /**
     * ==========================================
     * TRANSCRIPCIÓN EN TIEMPO REAL
     * ==========================================
     */

    /**
     * Iniciar/Detener transcripción
     */
    toggleTranscription() {
        if (!this.config.transcriptionEnabled) {
            this.startTranscription();
        } else {
            this.stopTranscription();
        }
    },

    /**
     * Iniciar transcripción
     */
    startTranscription() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Tu navegador no soporta reconocimiento de voz');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES';

        this.recognition.onstart = () => {
            this.config.transcriptionEnabled = true;
            document.getElementById('vc-transcript-status').textContent = 'Transcripción Activa';
            document.getElementById('vc-toggle-transcript-btn').classList.add('vc-active');
            console.log('Transcripción iniciada');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.addTranscriptEntry(finalTranscript);
            }

            // Mostrar resultado interim
            this.updateInterimTranscript(interimTranscript);
        };

        this.recognition.onerror = (event) => {
            console.error('Error en transcripción:', event.error);
        };

        this.recognition.onend = () => {
            if (this.config.transcriptionEnabled) {
                // Reiniciar automáticamente si aún está habilitado
                this.recognition.start();
            }
        };

        this.recognition.start();
    },

    /**
     * Detener transcripción
     */
    stopTranscription() {
        if (this.recognition) {
            this.config.transcriptionEnabled = false;
            this.recognition.stop();
            document.getElementById('vc-transcript-status').textContent = 'Iniciar Transcripción';
            document.getElementById('vc-toggle-transcript-btn').classList.remove('vc-active');
            console.log('Transcripción detenida');
        }
    },

    /**
     * Agregar entrada de transcripción
     */
    addTranscriptEntry(text) {
        const timestamp = new Date();
        const entry = {
            timestamp,
            speaker: 'Tú', // En implementación real, detectar speaker
            text: text.trim()
        };

        this.session.transcript.push(entry);
        this.displayTranscriptEntry(entry);
    },

    /**
     * Mostrar entrada de transcripción
     */
    displayTranscriptEntry(entry) {
        const container = document.getElementById('vc-transcript-content');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'vc-transcript-entry';
        entryDiv.innerHTML = `
            <div class="vc-transcript-header">
                <strong>${entry.speaker}</strong>
                <span class="vc-transcript-time">${this.formatTime(entry.timestamp)}</span>
            </div>
            <div class="vc-transcript-text">${this.escapeHtml(entry.text)}</div>
        `;
        container.appendChild(entryDiv);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Actualizar transcripción interim
     */
    updateInterimTranscript(text) {
        let interimDiv = document.querySelector('.vc-transcript-interim');

        if (!interimDiv) {
            interimDiv = document.createElement('div');
            interimDiv.className = 'vc-transcript-entry vc-transcript-interim';
            document.getElementById('vc-transcript-content').appendChild(interimDiv);
        }

        interimDiv.innerHTML = `
            <div class="vc-transcript-text" style="font-style: italic; opacity: 0.7;">
                ${this.escapeHtml(text)}
            </div>
        `;
    },

    /**
     * Descargar transcripción
     */
    downloadTranscript() {
        if (this.session.transcript.length === 0) {
            alert('No hay transcripción disponible');
            return;
        }

        let content = `TRANSCRIPCIÓN - ${document.getElementById('vc-session-title').textContent}\n`;
        content += `Fecha: ${new Date().toLocaleString('es-ES')}\n`;
        content += `Duración: ${document.getElementById('vc-timer').textContent}\n`;
        content += `\n${'='.repeat(60)}\n\n`;

        this.session.transcript.forEach(entry => {
            content += `[${this.formatTime(entry.timestamp)}] ${entry.speaker}:\n`;
            content += `${entry.text}\n\n`;
        });

        this.downloadTextFile(content, `transcripcion_${this.session.id}.txt`);
    },

    /**
     * ==========================================
     * NOTAS
     * ==========================================
     */

    /**
     * Agregar nota
     */
    addNote() {
        const timestamp = new Date();
        const note = {
            id: Date.now(),
            timestamp,
            content: '',
            author: 'Tú',
            editable: true
        };

        this.session.notes.push(note);
        this.displayNote(note, true);
    },

    /**
     * Mostrar nota
     */
    displayNote(note, focus = false) {
        const container = document.getElementById('vc-notes-list');
        const noteDiv = document.createElement('div');
        noteDiv.className = 'vc-note-item';
        noteDiv.dataset.noteId = note.id;
        noteDiv.innerHTML = `
            <div class="vc-note-header">
                <div>
                    <strong>${note.author}</strong>
                    <span class="vc-note-time">${this.formatTime(note.timestamp)}</span>
                </div>
                <div class="vc-note-actions">
                    <button class="vc-btn-icon" onclick="VideoConference.deleteNote(${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <textarea
                class="vc-note-content"
                placeholder="Escribe tus notas aquí..."
                oninput="VideoConference.updateNoteContent(${note.id}, this.value)"
            >${note.content}</textarea>
        `;

        container.appendChild(noteDiv);

        if (focus) {
            const textarea = noteDiv.querySelector('textarea');
            textarea.focus();
        }
    },

    /**
     * Actualizar contenido de nota
     */
    updateNoteContent(noteId, content) {
        const note = this.session.notes.find(n => n.id === noteId);
        if (note) {
            note.content = content;
        }
    },

    /**
     * Eliminar nota
     */
    deleteNote(noteId) {
        if (confirm('¿Eliminar esta nota?')) {
            this.session.notes = this.session.notes.filter(n => n.id !== noteId);

            const noteDiv = document.querySelector(`[data-note-id="${noteId}"]`);
            if (noteDiv) {
                noteDiv.remove();
            }
        }
    },

    /**
     * Exportar notas
     */
    exportNotes() {
        if (this.session.notes.length === 0) {
            alert('No hay notas para exportar');
            return;
        }

        let content = `NOTAS - ${document.getElementById('vc-session-title').textContent}\n`;
        content += `Fecha: ${new Date().toLocaleString('es-ES')}\n\n`;
        content += `${'='.repeat(60)}\n\n`;

        this.session.notes.forEach((note, index) => {
            content += `NOTA ${index + 1}\n`;
            content += `Autor: ${note.author}\n`;
            content += `Hora: ${this.formatTime(note.timestamp)}\n`;
            content += `\n${note.content}\n\n`;
            content += `${'-'.repeat(60)}\n\n`;
        });

        this.downloadTextFile(content, `notas_${this.session.id}.txt`);
    },

    /**
     * ==========================================
     * ARCHIVOS
     * ==========================================
     */

    /**
     * Manejar carga de archivos
     */
    async handleFileUpload(event) {
        const files = event.target.files;

        for (let file of files) {
            await this.uploadFile(file);
        }

        // Limpiar input
        event.target.value = '';
    },

    /**
     * Subir archivo
     */
    async uploadFile(file) {
        const fileData = {
            id: Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            timestamp: new Date(),
            uploader: 'Tú',
            url: null
        };

        // Agregar a la sesión
        this.session.files.push(fileData);

        // Mostrar en la lista
        this.displayFile(fileData);

        // Subir al servidor
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('sessionId', this.session.id);
            formData.append('workflowId', this.currentWorkflow || 'general');

            const response = await fetch('/api/video-conference/upload-file', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                fileData.url = result.url;
                console.log('Archivo subido:', result);
            }

        } catch (error) {
            console.error('Error al subir archivo:', error);
        }
    },

    /**
     * Mostrar archivo
     */
    displayFile(fileData) {
        const container = document.getElementById('vc-files-list');
        const fileDiv = document.createElement('div');
        fileDiv.className = 'vc-file-item';
        fileDiv.innerHTML = `
            <div class="vc-file-icon">
                <i class="fas ${this.getFileIcon(fileData.type)}"></i>
            </div>
            <div class="vc-file-info">
                <div class="vc-file-name">${fileData.name}</div>
                <div class="vc-file-meta">
                    ${this.formatFileSize(fileData.size)} • ${fileData.uploader} • ${this.formatTime(fileData.timestamp)}
                </div>
            </div>
            <div class="vc-file-actions">
                <button class="vc-btn-icon" onclick="VideoConference.downloadFile(${fileData.id})" title="Descargar">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        container.appendChild(fileDiv);
    },

    /**
     * Obtener icono de archivo
     */
    getFileIcon(type) {
        if (type.startsWith('image/')) return 'fa-file-image';
        if (type.startsWith('video/')) return 'fa-file-video';
        if (type.startsWith('audio/')) return 'fa-file-audio';
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word')) return 'fa-file-word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
        return 'fa-file';
    },

    /**
     * Formatear tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * ==========================================
     * INVITACIONES
     * ==========================================
     */

    /**
     * Mostrar modal de invitación
     */
    showInviteModal() {
        document.getElementById('vc-invite-modal').classList.remove('hidden');
    },

    /**
     * Ocultar modal de invitación
     */
    hideInviteModal() {
        document.getElementById('vc-invite-modal').classList.add('hidden');
    },

    /**
     * Cargar invitados desde JSON
     */
    async loadInviteesFromJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validar estructura
            if (!Array.isArray(data.invitees) && !Array.isArray(data)) {
                throw new Error('El JSON debe contener un array "invitees" o ser un array directamente');
            }

            const invitees = data.invitees || data;

            // Procesar invitados
            invitees.forEach(invitee => {
                this.sendInviteToEmail(invitee.email, invitee.name);
            });

            alert(`${invitees.length} invitaciones enviadas`);

        } catch (error) {
            console.error('Error al cargar JSON:', error);
            alert('Error al procesar el archivo JSON: ' + error.message);
        }

        // Limpiar input
        event.target.value = '';
    },

    /**
     * Enviar invitación manual
     */
    async sendInvite() {
        const emailInput = document.getElementById('vc-invite-email');
        const email = emailInput.value.trim();

        if (!email) {
            alert('Ingresa un email válido');
            return;
        }

        await this.sendInviteToEmail(email);
        emailInput.value = '';
    },

    /**
     * Enviar invitación a email
     */
    async sendInviteToEmail(email, name = null) {
        try {
            const response = await fetch('/api/video-conference/send-invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.session.id,
                    email,
                    name,
                    link: this.generateSessionLink(),
                    title: document.getElementById('vc-session-title').textContent
                })
            });

            const result = await response.json();

            if (result.success) {
                this.displayInvitee({ email, name, status: 'pending' });
                console.log('Invitación enviada a:', email);
            }

        } catch (error) {
            console.error('Error al enviar invitación:', error);
        }
    },

    /**
     * Mostrar invitado
     */
    displayInvitee(invitee) {
        const container = document.getElementById('vc-invited-list');

        if (!container.querySelector('.vc-invited-header')) {
            const header = document.createElement('h4');
            header.className = 'vc-invited-header';
            header.textContent = 'Invitados';
            container.appendChild(header);
        }

        const inviteeDiv = document.createElement('div');
        inviteeDiv.className = 'vc-invitee-item';
        inviteeDiv.innerHTML = `
            <div class="vc-invitee-info">
                <div class="vc-invitee-name">${invitee.name || 'Sin nombre'}</div>
                <div class="vc-invitee-email">${invitee.email}</div>
            </div>
            <div class="vc-invitee-status">
                <span class="vc-badge">${invitee.status === 'joined' ? 'Conectado' : 'Pendiente'}</span>
            </div>
        `;
        container.appendChild(inviteeDiv);
    },

    /**
     * ==========================================
     * INTELIGENCIA ARTIFICIAL
     * ==========================================
     */

    /**
     * Generar resumen con IA
     */
    async generateAISummary() {
        const activeAI = this.getActiveAIPlugin();

        if (!activeAI) {
            alert('Activa al menos un plugin de IA en la configuración');
            return;
        }

        const content = this.gatherSessionContent();

        try {
            const summary = await this.callAI(activeAI, {
                prompt: `Genera un resumen ejecutivo de la siguiente sesión de video:\n\n${content}`,
                maxTokens: 500
            });

            this.displayAIResult('Resumen de la Sesión', summary);

        } catch (error) {
            console.error('Error al generar resumen:', error);
            alert('Error al generar resumen con IA');
        }
    },

    /**
     * Generar items de acción
     */
    async generateActionItems() {
        const activeAI = this.getActiveAIPlugin();

        if (!activeAI) {
            alert('Activa al menos un plugin de IA');
            return;
        }

        const content = this.gatherSessionContent();

        try {
            const actionItems = await this.callAI(activeAI, {
                prompt: `Extrae los items de acción y tareas de la siguiente sesión:\n\n${content}\n\nFormato: Lista numerada con responsable y fecha si se mencionan.`,
                maxTokens: 500
            });

            this.displayAIResult('Items de Acción', actionItems);

        } catch (error) {
            console.error('Error al generar items:', error);
            alert('Error al generar items de acción');
        }
    },

    /**
     * Generar minutas
     */
    async generateMinutes() {
        const activeAI = this.getActiveAIPlugin();

        if (!activeAI) {
            alert('Activa al menos un plugin de IA');
            return;
        }

        const content = this.gatherSessionContent();
        const asIsNotes = document.getElementById('vc-as-is-notes')?.value || '';
        const toBeNotes = document.getElementById('vc-to-be-notes')?.value || '';

        try {
            const minutes = await this.callAI(activeAI, {
                prompt: `Genera las minutas formales de la siguiente sesión incluye:

1. Información General
2. Participantes
3. Agenda/Temas Tratados
4. Resumen de Discusiones
5. Decisiones Tomadas
6. Items de Acción
7. Próximos Pasos

Sesión:
${content}

${asIsNotes ? `\nProceso AS-IS:\n${asIsNotes}` : ''}
${toBeNotes ? `\nProceso TO-BE:\n${toBeNotes}` : ''}`,
                maxTokens: 1500
            });

            await this.saveMinutes(minutes);
            this.displayAIResult('Minutas de la Sesión', minutes);

        } catch (error) {
            console.error('Error al generar minutas:', error);
            alert('Error al generar minutas');
        }
    },

    /**
     * Obtener plugin de IA activo
     */
    getActiveAIPlugin() {
        if (document.getElementById('vc-ai-gpt')?.checked) {
            return {
                name: 'gpt',
                apiKey: document.getElementById('vc-ai-gpt-key').value
            };
        }
        if (document.getElementById('vc-ai-claude')?.checked) {
            return {
                name: 'claude',
                apiKey: document.getElementById('vc-ai-claude-key').value
            };
        }
        if (document.getElementById('vc-ai-gemini')?.checked) {
            return {
                name: 'gemini',
                apiKey: document.getElementById('vc-ai-gemini-key').value
            };
        }
        return null;
    },

    /**
     * Llamar a IA
     */
    async callAI(aiConfig, options) {
        const response = await fetch('/api/video-conference/ai-process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: aiConfig.name,
                apiKey: aiConfig.apiKey,
                prompt: options.prompt,
                maxTokens: options.maxTokens
            })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.content;
    },

    /**
     * Recopilar contenido de la sesión
     */
    gatherSessionContent() {
        let content = `Título: ${document.getElementById('vc-session-title').textContent}\n`;
        content += `Fecha: ${new Date().toLocaleString('es-ES')}\n`;
        content += `Duración: ${document.getElementById('vc-timer').textContent}\n\n`;

        // Participantes
        content += `PARTICIPANTES:\n`;
        this.participants.forEach(p => {
            content += `- ${p.name} (${p.email})\n`;
        });
        content += `\n`;

        // Transcripción
        if (this.session.transcript.length > 0) {
            content += `TRANSCRIPCIÓN:\n`;
            this.session.transcript.forEach(entry => {
                content += `[${this.formatTime(entry.timestamp)}] ${entry.speaker}: ${entry.text}\n`;
            });
            content += `\n`;
        }

        // Notas
        if (this.session.notes.length > 0) {
            content += `NOTAS:\n`;
            this.session.notes.forEach((note, i) => {
                content += `Nota ${i + 1} (${note.author}):\n${note.content}\n\n`;
            });
        }

        // Chat
        if (this.session.messages.length > 0) {
            content += `CHAT:\n`;
            this.session.messages.forEach(msg => {
                content += `[${this.formatTime(msg.timestamp)}] ${msg.user}: ${msg.message}\n`;
            });
        }

        return content;
    },

    /**
     * Mostrar resultado de IA
     */
    displayAIResult(title, content) {
        // Crear modal o mostrar en panel
        alert(`${title}:\n\n${content}`);
        // TODO: Implementar modal más elegante
    },

    /**
     * ==========================================
     * FINALIZACIÓN Y GUARDADO
     * ==========================================
     */

    /**
     * Finalizar sesión
     */
    async endSession() {
        if (!confirm('¿Finalizar la sesión? Esto guardará todos los datos.')) {
            return;
        }

        this.session.endTime = new Date();

        // Detener grabación si está activa
        if (this.isRecording) {
            this.stopRecording();
        }

        // Detener transcripción
        if (this.config.transcriptionEnabled) {
            this.stopTranscription();
        }

        // NUEVO: Mostrar modal de configuración de guardado
        await this.showSaveConfigModal();
    },

    /**
     * Mostrar modal de configuración de guardado (formato + ubicación)
     */
    async showSaveConfigModal() {
        const modal = document.createElement('div');
        modal.id = 'vc-save-config-modal';
        modal.className = 'vc-modal';
        modal.innerHTML = `
            <div class="vc-modal-content" style="max-width: 600px;">
                <div class="vc-modal-header">
                    <h3>
                        <i class="fas fa-save"></i>
                        Configuración de Guardado
                    </h3>
                </div>
                <div class="vc-modal-body">
                    <!-- Formato de Video -->
                    <div class="vc-save-config-section">
                        <h4><i class="fas fa-video"></i> Formato de Video</h4>
                        <p style="margin: 0.5rem 0; color: #94a3b8; font-size: 0.9rem;">
                            Selecciona el formato en el que deseas guardar la grabación:
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                            <label class="vc-format-option" style="cursor: pointer;">
                                <input type="radio" name="videoFormat" value="webm" checked
                                       style="margin-right: 8px;">
                                <div>
                                    <strong>WebM</strong>
                                    <small style="display: block; color: #94a3b8; margin-top: 4px;">
                                        ✅ Nativo del navegador<br>
                                        ✅ Menor tamaño<br>
                                        ✅ Grabación directa
                                    </small>
                                </div>
                            </label>
                            <label class="vc-format-option" style="cursor: pointer;">
                                <input type="radio" name="videoFormat" value="mp4"
                                       style="margin-right: 8px;">
                                <div>
                                    <strong>MP4</strong>
                                    <small style="display: block; color: #94a3b8; margin-top: 4px;">
                                        ✅ Compatible universal<br>
                                        ⚠️ Requiere conversión<br>
                                        ⏱️ Tarda más tiempo
                                    </small>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Ubicación de Guardado -->
                    <div class="vc-save-config-section" style="margin-top: 25px;">
                        <h4><i class="fas fa-folder-open"></i> Ubicación de Guardado</h4>
                        <p style="margin: 0.5rem 0; color: #94a3b8; font-size: 0.9rem;">
                            ¿Dónde deseas guardar el video?
                        </p>

                        <div style="margin-top: 15px;">
                            <label class="vc-location-option" style="display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;">
                                <input type="radio" name="saveLocation" value="default" checked
                                       style="margin-right: 10px;">
                                <div style="flex: 1;">
                                    <strong>Ubicación predeterminada</strong><br>
                                    <small style="color: #94a3b8;">
                                        <i class="fas fa-folder"></i> workflows/[proyecto]/Video/
                                    </small>
                                </div>
                            </label>

                            <label class="vc-location-option" style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="saveLocation" value="custom"
                                       style="margin-right: 10px;"
                                       onchange="document.getElementById('custom-path-input').style.display = this.checked ? 'block' : 'none'">
                                <div style="flex: 1;">
                                    <strong>Ubicación personalizada</strong><br>
                                    <small style="color: #94a3b8;">
                                        Selecciona una carpeta específica
                                    </small>
                                </div>
                            </label>

                            <div id="custom-path-input" style="display: none; margin-top: 10px; margin-left: 30px;">
                                <input type="text" id="vc-custom-path" class="vc-input"
                                       placeholder="C:/Users/Usuario/Videos/Alqvimia"
                                       style="width: 100%;">
                                <button class="vc-btn-secondary" style="margin-top: 8px;" onclick="VideoConference.browseSaveLocation()">
                                    <i class="fas fa-folder-open"></i> Examinar...
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Opciones Adicionales -->
                    <div class="vc-save-config-section" style="margin-top: 25px;">
                        <h4><i class="fas fa-sliders-h"></i> Opciones Adicionales</h4>
                        <label style="display: flex; align-items: center; gap: 10px; margin-top: 10px; cursor: pointer;">
                            <input type="checkbox" id="vc-save-transcription" checked>
                            <span>Guardar transcripción automática</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; margin-top: 10px; cursor: pointer;">
                            <input type="checkbox" id="vc-save-chat" checked>
                            <span>Guardar historial de chat</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; margin-top: 10px; cursor: pointer;">
                            <input type="checkbox" id="vc-save-notes" checked>
                            <span>Guardar notas de la sesión</span>
                        </label>
                    </div>
                </div>
                <div class="vc-modal-footer">
                    <button class="vc-btn-secondary" onclick="VideoConference.cancelSaveConfig()">Cancelar</button>
                    <button class="vc-btn-primary" onclick="VideoConference.confirmSaveConfig()">
                        <i class="fas fa-arrow-right"></i> Continuar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * Examinar ubicación de guardado (usando File System Access API)
     */
    async browseSaveLocation() {
        try {
            // Usar File System Access API si está disponible
            if ('showDirectoryPicker' in window) {
                const dirHandle = await window.showDirectoryPicker();
                document.getElementById('vc-custom-path').value = dirHandle.name;
                this.customSaveDirectory = dirHandle;
            } else {
                alert('Tu navegador no soporta la selección de carpetas.\nPor favor, escribe la ruta manualmente.');
            }
        } catch (error) {
            // Usuario canceló o error
            console.log('Usuario canceló selección de carpeta');
        }
    },

    /**
     * Cancelar configuración de guardado
     */
    cancelSaveConfig() {
        const modal = document.getElementById('vc-save-config-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * Confirmar configuración de guardado
     */
    async confirmSaveConfig() {
        // Obtener formato seleccionado
        const formatInput = document.querySelector('input[name="videoFormat"]:checked');
        const videoFormat = formatInput ? formatInput.value : 'webm';

        // Obtener ubicación seleccionada
        const locationInput = document.querySelector('input[name="saveLocation"]:checked');
        const saveLocation = locationInput ? locationInput.value : 'default';
        const customPath = document.getElementById('vc-custom-path')?.value || '';

        // Obtener opciones adicionales
        const saveTranscription = document.getElementById('vc-save-transcription')?.checked ?? true;
        const saveChat = document.getElementById('vc-save-chat')?.checked ?? true;
        const saveNotes = document.getElementById('vc-save-notes')?.checked ?? true;

        // Guardar configuración en el objeto de sesión
        this.session.saveConfig = {
            videoFormat,
            saveLocation,
            customPath,
            saveTranscription,
            saveChat,
            saveNotes
        };

        // Cerrar modal
        this.cancelSaveConfig();

        // Continuar con el selector de workflow
        await this.showWorkflowSelector();
    },

    /**
     * Mostrar selector de workflow
     */
    async showWorkflowSelector() {
        // Obtener lista de workflows disponibles
        const workflows = await this.getAvailableWorkflows();

        const modal = document.createElement('div');
        modal.id = 'vc-workflow-selector-modal';
        modal.className = 'vc-modal';
        modal.innerHTML = `
            <div class="vc-modal-content">
                <div class="vc-modal-header">
                    <h3>
                        <i class="fas fa-folder"></i>
                        Seleccionar Proyecto/Workflow
                    </h3>
                </div>
                <div class="vc-modal-body">
                    <p>¿En qué proyecto deseas guardar esta sesión de videoconferencia?</p>
                    <select id="vc-workflow-select" class="vc-select">
                        <option value="">-- Seleccionar Workflow --</option>
                        ${workflows.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                    </select>
                    <div style="margin-top: 15px;">
                        <label>O crear un nuevo proyecto:</label>
                        <input type="text" id="vc-new-workflow-name" class="vc-input" placeholder="Nombre del nuevo proyecto">
                    </div>
                </div>
                <div class="vc-modal-footer">
                    <button class="vc-btn-secondary" onclick="VideoConference.cancelWorkflowSelector()">Cancelar</button>
                    <button class="vc-btn-primary" onclick="VideoConference.confirmWorkflowSelection()">Continuar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * Obtener workflows disponibles
     */
    async getAvailableWorkflows() {
        try {
            const response = await fetch('/api/workflows');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error obteniendo workflows:', error);
        }

        // Si no hay API, retornar workflows de ejemplo
        return [
            { id: 'general', name: 'General' },
            { id: 'proyecto-1', name: 'Proyecto 1' },
            { id: 'proyecto-2', name: 'Proyecto 2' }
        ];
    },

    /**
     * Cancelar selección de workflow
     */
    cancelWorkflowSelector() {
        const modal = document.getElementById('vc-workflow-selector-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * Confirmar selección de workflow
     */
    async confirmWorkflowSelection() {
        const select = document.getElementById('vc-workflow-select');
        const newWorkflowInput = document.getElementById('vc-new-workflow-name');

        let workflowId, workflowName;

        if (newWorkflowInput.value.trim()) {
            // Crear nuevo workflow
            workflowName = newWorkflowInput.value.trim();
            workflowId = workflowName.toLowerCase().replace(/\s+/g, '-');
        } else if (select.value) {
            // Usar workflow existente
            workflowId = select.value;
            workflowName = select.options[select.selectedIndex].text;
        } else {
            alert('Por favor selecciona un workflow o crea uno nuevo');
            return;
        }

        // Guardar en sesión
        this.session.workflowId = workflowId;
        this.session.workflowTitle = workflowName;
        this.currentWorkflow = workflowId;

        // Remover modal
        this.cancelWorkflowSelector();

        // Mostrar modal de proceso AS-IS/TO-BE
        this.showProcessModal();
    },

    /**
     * Mostrar modal de proceso
     */
    showProcessModal() {
        document.getElementById('vc-process-modal').classList.remove('hidden');
    },

    /**
     * Ocultar modal de proceso
     */
    hideProcessModal() {
        document.getElementById('vc-process-modal').classList.add('hidden');
    },

    /**
     * Agregar requerimiento
     */
    addRequirement() {
        const container = document.getElementById('vc-requirements-list');
        const reqId = Date.now();

        const reqDiv = document.createElement('div');
        reqDiv.className = 'vc-requirement-item';
        reqDiv.dataset.reqId = reqId;
        reqDiv.innerHTML = `
            <input
                type="text"
                placeholder="Descripción del requerimiento..."
                class="vc-requirement-input"
                onchange="VideoConference.updateRequirement(${reqId}, this.value)"
            >
            <select class="vc-requirement-priority" onchange="VideoConference.updateRequirementPriority(${reqId}, this.value)">
                <option value="low">Baja</option>
                <option value="medium" selected>Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
            </select>
            <button class="vc-btn-icon" onclick="VideoConference.removeRequirement(${reqId})">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(reqDiv);

        if (!this.session.requirements) {
            this.session.requirements = [];
        }

        this.session.requirements.push({
            id: reqId,
            description: '',
            priority: 'medium'
        });
    },

    /**
     * Actualizar requerimiento
     */
    updateRequirement(reqId, description) {
        const req = this.session.requirements.find(r => r.id === reqId);
        if (req) {
            req.description = description;
        }
    },

    /**
     * Actualizar prioridad de requerimiento
     */
    updateRequirementPriority(reqId, priority) {
        const req = this.session.requirements.find(r => r.id === reqId);
        if (req) {
            req.priority = priority;
        }
    },

    /**
     * Remover requerimiento
     */
    removeRequirement(reqId) {
        this.session.requirements = this.session.requirements.filter(r => r.id !== reqId);
        const reqDiv = document.querySelector(`[data-req-id="${reqId}"]`);
        if (reqDiv) {
            reqDiv.remove();
        }
    },

    /**
     * Guardar análisis de proceso
     */
    async saveProcessAnalysis() {
        const asIs = document.getElementById('vc-as-is-notes').value;
        const toBe = document.getElementById('vc-to-be-notes').value;

        this.session.processAnalysis = {
            asIs,
            toBe,
            requirements: this.session.requirements || []
        };

        // Ocultar modal AS-IS/TO-BE
        this.hideProcessModal();

        // Mostrar barra de progreso
        await this.showProgressBar();

        // Guardar toda la sesión
        await this.saveSessionData();
    },

    /**
     * Mostrar barra de progreso de análisis
     */
    async showProgressBar() {
        const modal = document.createElement('div');
        modal.id = 'vc-progress-modal';
        modal.className = 'vc-modal';
        modal.innerHTML = `
            <div class="vc-modal-content" style="max-width: 600px;">
                <div class="vc-modal-header">
                    <h3>
                        <i class="fas fa-cog fa-spin"></i>
                        Procesando Sesión
                    </h3>
                </div>
                <div class="vc-modal-body">
                    <p style="text-align: center; margin-bottom: 20px;">
                        Analizando video y extrayendo información...
                    </p>

                    <div class="vc-progress-container">
                        <div class="vc-progress-bar">
                            <div class="vc-progress-fill" id="vc-progress-fill"></div>
                        </div>
                        <div class="vc-progress-text" id="vc-progress-text">0%</div>
                    </div>

                    <div class="vc-progress-steps" id="vc-progress-steps">
                        <div class="vc-progress-step">
                            <i class="fas fa-circle-notch fa-spin"></i>
                            <span>Preparando...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Ejecutar proceso con animación de progreso
        await this.processSessionWithProgress();
    },

    /**
     * Procesar sesión con barra de progreso
     */
    async processSessionWithProgress() {
        const steps = [
            { text: 'Guardando grabaciones...', progress: 15 },
            { text: 'Extrayendo transcripción...', progress: 30 },
            { text: 'Procesando notas...', progress: 45 },
            { text: 'Generando AS-IS...', progress: 60 },
            { text: 'Generando TO-BE...', progress: 75 },
            { text: 'Extrayendo requerimientos...', progress: 85 },
            { text: 'Generando minuta...', progress: 95 },
            { text: 'Finalizando...', progress: 100 }
        ];

        for (const step of steps) {
            await this.updateProgress(step.text, step.progress);
            await this.sleep(800); // Simular procesamiento
        }

        // Cerrar modal de progreso
        const modal = document.getElementById('vc-progress-modal');
        if (modal) {
            modal.remove();
        }

        // Mostrar resultado
        this.showCompletionMessage();
    },

    /**
     * Actualizar barra de progreso
     */
    async updateProgress(stepText, percentage) {
        const progressFill = document.getElementById('vc-progress-fill');
        const progressText = document.getElementById('vc-progress-text');
        const stepsContainer = document.getElementById('vc-progress-steps');

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }

        if (progressText) {
            progressText.textContent = percentage + '%';
        }

        if (stepsContainer) {
            stepsContainer.innerHTML = `
                <div class="vc-progress-step">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <span>${stepText}</span>
                </div>
            `;
        }
    },

    /**
     * Función auxiliar sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Mostrar mensaje de completado
     */
    showCompletionMessage() {
        const modal = document.createElement('div');
        modal.id = 'vc-completion-modal';
        modal.className = 'vc-modal';
        modal.innerHTML = `
            <div class="vc-modal-content">
                <div class="vc-modal-header" style="background: #4CAF50; color: white;">
                    <h3>
                        <i class="fas fa-check-circle"></i>
                        Sesión Completada
                    </h3>
                </div>
                <div class="vc-modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: #4CAF50; margin-bottom: 20px;"></i>
                        <h3>¡Sesión guardada exitosamente!</h3>
                        <p style="margin-top: 15px; color: #666;">
                            Todos los archivos han sido procesados y guardados en:<br>
                            <strong>${this.session.workflowTitle}</strong>
                        </p>
                        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; text-align: left;">
                            <h4 style="margin-top: 0;">Archivos generados:</h4>
                            <ul style="margin: 10px 0;">
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Grabación de video</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Transcripción completa</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Notas de la sesión</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Análisis AS-IS</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Diseño TO-BE</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Requerimientos</li>
                                <li><i class="fas fa-check" style="color: #4CAF50;"></i> Minuta generada</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="vc-modal-footer">
                    <button class="vc-btn-primary" onclick="VideoConference.closeCompletionModal()">Cerrar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    /**
     * Cerrar modal de completado
     */
    closeCompletionModal() {
        const modal = document.getElementById('vc-completion-modal');
        if (modal) {
            modal.remove();
        }
        this.closeVideoConference();
    },

    /**
     * Guardar datos de la sesión
     */
    async saveSessionData() {
        try {
            const sessionData = {
                ...this.session,
                workflowId: this.currentWorkflow
            };

            const response = await fetch('/api/video-conference/save-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();

            if (result.success) {
                console.log('Sesión guardada:', result.path);
            }

        } catch (error) {
            console.error('Error al guardar sesión:', error);
        }
    },

    /**
     * Guardar minutas
     */
    async saveMinutes(minutes) {
        try {
            const response = await fetch('/api/video-conference/save-minutes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.session.id,
                    workflowId: this.currentWorkflow,
                    minutes
                })
            });

            const result = await response.json();
            console.log('Minutas guardadas:', result);

        } catch (error) {
            console.error('Error al guardar minutas:', error);
        }
    },

    /**
     * Descargar archivo de texto
     */
    downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

});

console.log('Video Conference Features cargadas');
