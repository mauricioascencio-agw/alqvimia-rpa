/**
 * 🎥 RUTAS DE VIDEOCONFERENCIA - Backend
 *
 * API para manejar sesiones de videoconferencia, grabaciones, transcripciones y minutas
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const workflowId = req.body.workflowId || 'general';
        const sessionId = req.body.sessionId;
        const uploadPath = path.join(__dirname, '..', 'workflows', workflowId, 'Video', sessionId);

        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}_${sanitizedName}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB máximo
    }
});

/**
 * ==========================================
 * RUTAS PRINCIPALES
 * ==========================================
 */

/**
 * POST /api/video-conference/upload-recording
 * Subir grabación de video
 */
router.post('/upload-recording', upload.single('video'), async (req, res) => {
    try {
        const { workflowId, sessionId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se recibió archivo de video'
            });
        }

        const filePath = req.file.path;
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);

        console.log('Grabación subida:', relativePath);

        res.json({
            success: true,
            path: relativePath,
            filename: req.file.filename,
            size: req.file.size
        });

    } catch (error) {
        console.error('Error al subir grabación:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/video-conference/upload-file
 * Subir archivo compartido en la sesión
 */
router.post('/upload-file', upload.single('file'), async (req, res) => {
    try {
        const { workflowId, sessionId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se recibió archivo'
            });
        }

        const filePath = req.file.path;
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);

        res.json({
            success: true,
            url: `/files/${relativePath}`,
            filename: req.file.filename,
            size: req.file.size,
            type: req.file.mimetype
        });

    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/video-conference/save-session
 * Guardar datos completos de la sesión
 */
router.post('/save-session', async (req, res) => {
    try {
        const sessionData = req.body;
        const workflowId = sessionData.workflowId || 'general';
        const sessionId = sessionData.id;

        // Crear estructura de carpetas
        const basePath = path.join(__dirname, '..', 'workflows', workflowId, 'Video', sessionId);

        // Crear carpetas AS-IS y TO-BE
        const asIsPath = path.join(basePath, 'AS-IS');
        const toBePath = path.join(basePath, 'TO-BE');

        await fs.mkdir(asIsPath, { recursive: true });
        await fs.mkdir(toBePath, { recursive: true });

        // Guardar datos de la sesión
        const sessionFile = path.join(basePath, 'session-data.json');
        await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2));

        // Guardar transcripción
        if (sessionData.transcript && sessionData.transcript.length > 0) {
            const transcriptContent = generateTranscriptDocument(sessionData);
            const transcriptFile = path.join(basePath, 'transcript.txt');
            await fs.writeFile(transcriptFile, transcriptContent);
        }

        // Guardar notas
        if (sessionData.notes && sessionData.notes.length > 0) {
            const notesContent = generateNotesDocument(sessionData);
            const notesFile = path.join(basePath, 'notes.txt');
            await fs.writeFile(notesFile, notesContent);
        }

        // Guardar chat
        if (sessionData.messages && sessionData.messages.length > 0) {
            const chatContent = generateChatDocument(sessionData);
            const chatFile = path.join(basePath, 'chat.txt');
            await fs.writeFile(chatFile, chatContent);
        }

        // Guardar análisis de proceso
        if (sessionData.processAnalysis) {
            // AS-IS
            if (sessionData.processAnalysis.asIs) {
                const asIsFile = path.join(asIsPath, 'proceso-actual.md');
                await fs.writeFile(asIsFile, sessionData.processAnalysis.asIs);
            }

            // TO-BE
            if (sessionData.processAnalysis.toBe) {
                const toBeFile = path.join(toBePath, 'proceso-mejorado.md');
                await fs.writeFile(toBeFile, sessionData.processAnalysis.toBe);
            }

            // Requerimientos
            if (sessionData.processAnalysis.requirements) {
                const requirementsContent = generateRequirementsDocument(sessionData.processAnalysis.requirements);
                const requirementsFile = path.join(basePath, 'requerimientos.md');
                await fs.writeFile(requirementsFile, requirementsContent);
            }
        }

        // Generar README del proyecto
        const readmeContent = generateProjectReadme(sessionData);
        const readmeFile = path.join(basePath, 'README.md');
        await fs.writeFile(readmeFile, readmeContent);

        console.log('Sesión guardada en:', basePath);

        res.json({
            success: true,
            path: basePath,
            sessionId
        });

    } catch (error) {
        console.error('Error al guardar sesión:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/video-conference/save-minutes
 * Guardar minutas generadas
 */
router.post('/save-minutes', async (req, res) => {
    try {
        const { sessionId, workflowId, minutes } = req.body;

        const basePath = path.join(__dirname, '..', 'workflows', workflowId || 'general', 'Video', sessionId);
        await fs.mkdir(basePath, { recursive: true });

        const minutesFile = path.join(basePath, 'minutas.md');
        await fs.writeFile(minutesFile, minutes);

        // También guardar en formato JSON para procesamiento
        const minutesJsonFile = path.join(basePath, 'minutas.json');
        await fs.writeFile(minutesJsonFile, JSON.stringify({
            timestamp: new Date().toISOString(),
            content: minutes
        }, null, 2));

        console.log('Minutas guardadas:', minutesFile);

        res.json({
            success: true,
            path: minutesFile
        });

    } catch (error) {
        console.error('Error al guardar minutas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/video-conference/send-invite
 * Enviar invitación por email
 */
router.post('/send-invite', async (req, res) => {
    try {
        const { sessionId, email, name, link, title } = req.body;

        // Configurar transporter de email (requiere configuración SMTP)
        // TODO: Configurar credenciales SMTP desde variables de entorno

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `Invitación a Sesión de Video: ${title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Invitación a Sesión de Videoconferencia</h2>

                    <p>Hola${name ? ` ${name}` : ''},</p>

                    <p>Has sido invitado a la siguiente sesión de videoconferencia:</p>

                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Sesión:</strong> ${title}<br>
                        <strong>ID de Sesión:</strong> ${sessionId}
                    </div>

                    <p>Para unirte a la sesión, haz clic en el siguiente enlace:</p>

                    <a href="${link}" style="display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                        Unirse a la Sesión
                    </a>

                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Este es un correo automático del sistema Alqvimia RPA.
                    </p>
                </div>
            `
        };

        // Enviar email solo si hay configuración SMTP
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn('Configuración SMTP no disponible. Email no enviado.');
        }

        res.json({
            success: true,
            email,
            message: 'Invitación enviada'
        });

    } catch (error) {
        console.error('Error al enviar invitación:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/video-conference/ai-process
 * Procesar con IA (GPT, Claude, Gemini)
 */
router.post('/ai-process', async (req, res) => {
    try {
        const { provider, apiKey, prompt, maxTokens } = req.body;

        let content = '';

        switch (provider) {
            case 'gpt':
                content = await processWithGPT(apiKey, prompt, maxTokens);
                break;
            case 'claude':
                content = await processWithClaude(apiKey, prompt, maxTokens);
                break;
            case 'gemini':
                content = await processWithGemini(apiKey, prompt, maxTokens);
                break;
            default:
                throw new Error('Proveedor de IA no soportado');
        }

        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.error('Error al procesar con IA:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * ==========================================
 * FUNCIONES AUXILIARES
 * ==========================================
 */

/**
 * Generar documento de transcripción
 */
function generateTranscriptDocument(sessionData) {
    let content = `# TRANSCRIPCIÓN - ${sessionData.id}\n\n`;
    content += `**Fecha:** ${new Date(sessionData.startTime).toLocaleString('es-ES')}\n`;
    content += `**Duración:** ${calculateDuration(sessionData.startTime, sessionData.endTime)}\n\n`;
    content += `---\n\n`;

    sessionData.transcript.forEach((entry, index) => {
        content += `## [${formatTime(entry.timestamp)}] ${entry.speaker}\n\n`;
        content += `${entry.text}\n\n`;
    });

    return content;
}

/**
 * Generar documento de notas
 */
function generateNotesDocument(sessionData) {
    let content = `# NOTAS - ${sessionData.id}\n\n`;
    content += `**Fecha:** ${new Date(sessionData.startTime).toLocaleString('es-ES')}\n\n`;
    content += `---\n\n`;

    sessionData.notes.forEach((note, index) => {
        content += `## Nota ${index + 1}\n\n`;
        content += `**Autor:** ${note.author}\n`;
        content += `**Hora:** ${formatTime(note.timestamp)}\n\n`;
        content += `${note.content}\n\n`;
        content += `---\n\n`;
    });

    return content;
}

/**
 * Generar documento de chat
 */
function generateChatDocument(sessionData) {
    let content = `# CHAT - ${sessionData.id}\n\n`;
    content += `**Fecha:** ${new Date(sessionData.startTime).toLocaleString('es-ES')}\n\n`;
    content += `---\n\n`;

    sessionData.messages.forEach(msg => {
        content += `[${formatTime(msg.timestamp)}] **${msg.user}:** ${msg.message}\n\n`;
    });

    return content;
}

/**
 * Generar documento de requerimientos
 */
function generateRequirementsDocument(requirements) {
    let content = `# REQUERIMIENTOS\n\n`;

    const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    const sorted = requirements.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    const grouped = {
        critical: [],
        high: [],
        medium: [],
        low: []
    };

    sorted.forEach(req => {
        if (req.description && req.description.trim()) {
            grouped[req.priority].push(req);
        }
    });

    const priorityLabels = {
        critical: '🔴 Crítica',
        high: '🟠 Alta',
        medium: '🟡 Media',
        low: '🟢 Baja'
    };

    Object.keys(grouped).forEach(priority => {
        if (grouped[priority].length > 0) {
            content += `## ${priorityLabels[priority]}\n\n`;
            grouped[priority].forEach((req, index) => {
                content += `${index + 1}. ${req.description}\n`;
            });
            content += `\n`;
        }
    });

    return content;
}

/**
 * Generar README del proyecto
 */
function generateProjectReadme(sessionData) {
    let content = `# Sesión de Videoconferencia\n\n`;
    content += `## Información General\n\n`;
    content += `- **ID de Sesión:** ${sessionData.id}\n`;
    content += `- **Fecha de Inicio:** ${new Date(sessionData.startTime).toLocaleString('es-ES')}\n`;
    content += `- **Fecha de Fin:** ${sessionData.endTime ? new Date(sessionData.endTime).toLocaleString('es-ES') : 'En curso'}\n`;
    content += `- **Duración:** ${sessionData.endTime ? calculateDuration(sessionData.startTime, sessionData.endTime) : 'N/A'}\n\n`;

    content += `## Participantes\n\n`;
    sessionData.participants.forEach(p => {
        content += `- **${p.name}** (${p.email})\n`;
    });
    content += `\n`;

    content += `## Estructura de Archivos\n\n`;
    content += `\`\`\`\n`;
    content += `.\n`;
    content += `├── README.md           # Este archivo\n`;
    content += `├── session-data.json   # Datos completos de la sesión\n`;
    content += `├── transcript.txt      # Transcripción completa\n`;
    content += `├── notes.txt           # Notas tomadas durante la sesión\n`;
    content += `├── chat.txt            # Historial de chat\n`;
    content += `├── minutas.md          # Minutas generadas automáticamente\n`;
    content += `├── requerimientos.md   # Lista de requerimientos\n`;
    content += `├── AS-IS/              # Proceso actual\n`;
    content += `│   └── proceso-actual.md\n`;
    content += `├── TO-BE/              # Proceso mejorado\n`;
    content += `│   └── proceso-mejorado.md\n`;
    content += `└── [archivos de grabación y compartidos]\n`;
    content += `\`\`\`\n\n`;

    content += `## Resumen\n\n`;

    if (sessionData.processAnalysis) {
        if (sessionData.processAnalysis.asIs) {
            content += `### Proceso AS-IS (Actual)\n\n`;
            content += `Ver detalles en: [AS-IS/proceso-actual.md](AS-IS/proceso-actual.md)\n\n`;
        }

        if (sessionData.processAnalysis.toBe) {
            content += `### Proceso TO-BE (Mejorado)\n\n`;
            content += `Ver detalles en: [TO-BE/proceso-mejorado.md](TO-BE/proceso-mejorado.md)\n\n`;
        }

        if (sessionData.processAnalysis.requirements && sessionData.processAnalysis.requirements.length > 0) {
            content += `### Requerimientos\n\n`;
            content += `Total de requerimientos: ${sessionData.processAnalysis.requirements.filter(r => r.description).length}\n\n`;
            content += `Ver detalles en: [requerimientos.md](requerimientos.md)\n\n`;
        }
    }

    content += `## Archivos Generados\n\n`;
    content += `- **Transcripción:** ${sessionData.transcript ? `${sessionData.transcript.length} entradas` : 'No disponible'}\n`;
    content += `- **Notas:** ${sessionData.notes ? `${sessionData.notes.length} notas` : 'No disponible'}\n`;
    content += `- **Mensajes de Chat:** ${sessionData.messages ? `${sessionData.messages.length} mensajes` : 'No disponible'}\n`;
    content += `- **Archivos Compartidos:** ${sessionData.files ? `${sessionData.files.length} archivos` : 'No disponible'}\n`;
    content += `- **Grabaciones:** ${sessionData.recordings ? `${sessionData.recordings.length} grabaciones` : 'No disponible'}\n\n`;

    content += `---\n\n`;
    content += `*Generado automáticamente por Alqvimia RPA - Sistema de Videoconferencia*\n`;

    return content;
}

/**
 * Calcular duración
 */
function calculateDuration(start, end) {
    const duration = new Date(end) - new Date(start);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formatear hora
 */
function formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Procesar con GPT
 */
async function processWithGPT(apiKey, prompt, maxTokens) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error al procesar con GPT');
    }

    return data.choices[0].message.content;
}

/**
 * Procesar con Claude
 */
async function processWithClaude(apiKey, prompt, maxTokens) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: maxTokens,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error al procesar con Claude');
    }

    return data.content[0].text;
}

/**
 * Procesar con Gemini
 */
async function processWithGemini(apiKey, prompt, maxTokens) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                maxOutputTokens: maxTokens
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error al procesar con Gemini');
    }

    return data.candidates[0].content.parts[0].text;
}

/**
 * ==========================================
 * RUTAS DE CONFIGURACIÓN Y SMTP
 * ==========================================
 */

/**
 * POST /api/videoconference/test-smtp
 * Probar conexión SMTP y enviar email de prueba
 */
router.post('/test-smtp', async (req, res) => {
    try {
        const { smtp } = req.body;

        if (!smtp || !smtp.host || !smtp.user || !smtp.password) {
            return res.status(400).json({
                success: false,
                error: 'Faltan datos de configuración SMTP requeridos'
            });
        }

        // Crear transporter
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port || 587,
            secure: smtp.secure || false,
            auth: {
                user: smtp.user,
                pass: smtp.password
            }
        });

        // Verificar conexión
        await transporter.verify();

        // Enviar email de prueba
        const testEmail = {
            from: smtp.fromEmail || smtp.user,
            to: smtp.user,
            subject: '✅ Prueba de Configuración SMTP - Alqvimia Videoconferencia',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🎥 Alqvimia Videoconferencia</h1>
                        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Sistema de Videoconferencia Empresarial</p>
                    </div>

                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                            <h2 style="color: #10b981; margin-top: 0;">✅ Conexión SMTP Exitosa</h2>
                            <p style="color: #6b7280; line-height: 1.6;">
                                ¡Felicitaciones! Tu configuración SMTP ha sido probada exitosamente y está lista para enviar invitaciones de videoconferencia.
                            </p>
                        </div>

                        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #374151; font-size: 16px;">📋 Detalles de Configuración:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; color: #6b7280;"><strong>Servidor:</strong></td>
                                    <td style="padding: 8px; color: #374151;">${smtp.host}:${smtp.port}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; color: #6b7280;"><strong>Usuario:</strong></td>
                                    <td style="padding: 8px; color: #374151;">${smtp.user}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; color: #6b7280;"><strong>Seguridad:</strong></td>
                                    <td style="padding: 8px; color: #374151;">${smtp.secure ? 'SSL/TLS' : 'STARTTLS'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; color: #6b7280;"><strong>Fecha de prueba:</strong></td>
                                    <td style="padding: 8px; color: #374151;">${new Date().toLocaleString('es-ES')}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border-left: 3px solid #10b981;">
                            <h3 style="margin-top: 0; color: #065f46; font-size: 14px;">💡 Próximos pasos:</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #047857; line-height: 1.8;">
                                <li>El sistema ahora puede enviar invitaciones automáticas</li>
                                <li>Los participantes recibirán un link único para unirse</li>
                                <li>Las invitaciones incluyen detalles de la sesión y horario</li>
                            </ul>
                        </div>

                        <div style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 12px;">
                            <p style="margin: 0;">
                                Este es un email automático de prueba generado por Alqvimia RPA<br>
                                No es necesario responder a este mensaje
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(testEmail);

        res.json({
            success: true,
            message: 'Conexión SMTP exitosa. Email de prueba enviado.'
        });

    } catch (error) {
        console.error('❌ Error en prueba SMTP:', error);
        res.json({
            success: false,
            error: error.message || 'Error al probar conexión SMTP'
        });
    }
});

/**
 * POST /api/videoconference/send-invitation
 * Enviar invitación de videoconferencia por email
 */
router.post('/send-invitation', async (req, res) => {
    try {
        const { smtp, invitation } = req.body;

        if (!smtp || !invitation || !invitation.participants || invitation.participants.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Faltan datos de SMTP o participantes'
            });
        }

        // Crear transporter
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port || 587,
            secure: smtp.secure || false,
            auth: {
                user: smtp.user,
                pass: smtp.password
            }
        });

        const { sessionTitle, sessionUrl, sessionDate, sessionTime, hostName, participants } = invitation;

        // Enviar emails a todos los participantes
        const emailPromises = participants.map(participant => {
            const emailData = {
                from: `"${smtp.fromName || 'Alqvimia Videoconferencia'}" <${smtp.fromEmail || smtp.user}>`,
                to: participant.email,
                subject: `📹 Invitación a Videoconferencia: ${sessionTitle}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px;">🎥 Invitación a Videoconferencia</h1>
                            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Alqvimia RPA - Sistema de Videoconferencia</p>
                        </div>

                        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 style="color: #374151; margin-top: 0; font-size: 20px;">Hola ${participant.name},</h2>
                                <p style="color: #6b7280; line-height: 1.6; font-size: 15px;">
                                    Has sido invitado(a) a una sesión de videoconferencia por <strong>${hostName}</strong>.
                                </p>
                            </div>

                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                                <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">📋 Detalles de la Sesión</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280;"><strong>📌 Tema:</strong></td>
                                        <td style="padding: 10px 0; color: #374151; font-weight: 600;">${sessionTitle}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280;"><strong>📅 Fecha:</strong></td>
                                        <td style="padding: 10px 0; color: #374151;">${sessionDate || 'Por definir'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280;"><strong>🕐 Hora:</strong></td>
                                        <td style="padding: 10px 0; color: #374151;">${sessionTime || 'Por definir'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280;"><strong>👤 Anfitrión:</strong></td>
                                        <td style="padding: 10px 0; color: #374151;">${hostName}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${sessionUrl}"
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    🎥 Unirse a la Videoconferencia
                                </a>
                            </div>

                            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                                <h3 style="margin-top: 0; color: #1e40af; font-size: 14px;">💡 Instrucciones:</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; line-height: 1.8;">
                                    <li>Haz clic en el botón de arriba para unirte</li>
                                    <li>Permite el acceso a tu cámara y micrófono</li>
                                    <li>Puedes usar chat, compartir pantalla y emojis</li>
                                    <li>La sesión se grabará para minutas automáticas</li>
                                </ul>
                            </div>

                            <div style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 12px;">
                                <p style="margin: 0;">
                                    Si tienes problemas para unirte, contacta al anfitrión<br>
                                    Email generado automáticamente por Alqvimia RPA
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            return transporter.sendMail(emailData);
        });

        await Promise.all(emailPromises);

        res.json({
            success: true,
            message: `Invitaciones enviadas a ${participants.length} participante(s)`
        });

    } catch (error) {
        console.error('❌ Error enviando invitaciones:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al enviar invitaciones'
        });
    }
});

module.exports = router;
