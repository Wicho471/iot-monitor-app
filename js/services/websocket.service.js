export class WebSocketService {
    constructor() {
        this.socket = null;
    }

    connect(url, onOpen, onMessage, onClose, onError) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn("WebSocket ya está conectado.");
            return;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = (event) => {
            onOpen(event);
        };

        this.socket.onmessage = (event) => {
            onMessage(event);
        };

        this.socket.onclose = (event) => {
            this.socket = null;
            onClose(event);
        };

        this.socket.onerror = (event) => {
            onError(event);
        };
    }

    disconnect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close(1000, "Cierre voluntario del cliente");
        } else {
            console.warn("WebSocket no está conectado o ya está cerrándose.");
        }
    }

    getConnectionState() {
        if (!this.socket) {
            return WebSocket.CLOSED;
        }
        return this.socket.readyState;
    }
}