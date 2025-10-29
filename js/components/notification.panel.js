export const NotificationPanel = {
    init(panelElement) {
        this.panel = panelElement;
    },

    log(message, type = 'log-system') {
        const entry = document.createElement('div');
        entry.classList.add('log-entry', type);
        entry.textContent = message;
        this.panel.appendChild(entry);
        this.panel.scrollTop = this.panel.scrollHeight;
    },

    logStatus(message) {
        this.log(message, 'log-system');
    },

    logError(message) {
        this.log(`Error: ${message}`, 'log-error');
    },

    logConnectionOpen() {
        this.log('Conexión establecida.', 'log-open');
    },

    logConnectionClose(event) {
        this.log(`Conexión cerrada. Código: ${event.code}, Razón: ${event.reason || 'N/A'}`, 'log-close');
    },

    logData(messageEvent) {
        try {
            const data = JSON.parse(messageEvent.data);
            const eventType = data.eventType || 'UNKNOWN';
            const payload = JSON.stringify(data.payload, null, 2);
            
            const message = `[${eventType}]\n${payload}`;
            this.log(message, `log-data-${eventType}`);

        } catch (e) {
            this.logError(`Mensaje JSON malformado: ${messageEvent.data}`);
        }
    },

    clear() {
        this.panel.innerHTML = '';
        this.logStatus('Log limpiado.');
    }
};