// Sistema de Grabación Manual - Para cuando CORS bloquea la inyección
const ManualRecorder = {
    active: false,
    recordingInterval: null,

    init() {
        // Agregar botón de ayuda para grabación manual
        this.createManualRecordingPanel();
    },

    createManualRecordingPanel() {
        const panel = document.createElement('div');
        panel.id = 'manual-recording-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            display: none;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 14px;">📹 Grabación Manual</h3>
                <button id="close-manual-panel" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">&times;</button>
            </div>
            <p style="font-size: 12px; margin-bottom: 15px;">
                Usa estos atajos de teclado en la ventana de grabación:
            </p>
            <div style="font-size: 12px; line-height: 1.8;">
                <div><kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">Ctrl+Shift+C</kbd> Capturar Click</div>
                <div><kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">Ctrl+Shift+I</kbd> Capturar Imagen</div>
                <div><kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">Ctrl+Shift+T</kbd> Capturar Texto</div>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('close-manual-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    },

    showPanel() {
        const panel = document.getElementById('manual-recording-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    },

    hidePanel() {
        const panel = document.getElementById('manual-recording-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    },

    startMonitoring(recordingWindow) {
        this.active = true;

        // Monitorear la ventana cada 100ms
        this.recordingInterval = setInterval(() => {
            if (!recordingWindow || recordingWindow.closed) {
                this.stopMonitoring();
                return;
            }

            // Intentar capturar información de la ventana
            try {
                const currentUrl = recordingWindow.location.href;
                // Si llegamos aquí, tenemos acceso
            } catch (e) {
                // CORS bloqueado - mostrar panel manual
                this.showPanel();
            }
        }, 100);
    },

    stopMonitoring() {
        this.active = false;
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
            this.recordingInterval = null;
        }
        this.hidePanel();
    }
};

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ManualRecorder.init());
} else {
    ManualRecorder.init();
}
