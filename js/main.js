import { ApiService } from './services/api.service.js';
import { WebSocketService } from './services/websocket.service.js';
import { NotificationPanel } from './components/notification.panel.js';
import { DataManager } from './components/data.manager.js';

document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'https://100.29.134.125:5500';

    const elements = {
        connectBtn: document.getElementById('btn-connect'),
        disconnectBtn: document.getElementById('btn-disconnect'),
        refreshBtn: document.getElementById('btn-refresh'),
        clearLogBtn: document.getElementById('btn-clear-log'),
        wsUrlInput: document.getElementById('websocket-url-input'),
        deviceSelector: document.getElementById('device-selector'),
        notificationPanel: document.getElementById('notification-panel'),
        movementsList: document.getElementById('movements-list'),
        obstaclesList: document.getElementById('obstacles-list'),
        obstaclesDeviceLabel: document.getElementById('obstacles-device-label'),
        statusText: document.getElementById('connection-status-text'),
        dotGreen: document.getElementById('status-dot-green'),
        dotRed: document.getElementById('status-dot-red'),
        dotYellow: document.getElementById('status-dot-yellow')
    };

    const api = new ApiService(API_BASE_URL);
    const ws = new WebSocketService();
    
    NotificationPanel.init(elements.notificationPanel);
    DataManager.init(api, elements.movementsList, elements.obstaclesList, elements.obstaclesDeviceLabel);

    function updateConnectionStatus(isConnected, isConnecting = false) {
        elements.connectBtn.disabled = isConnected || isConnecting;
        elements.disconnectBtn.disabled = !isConnected;
        elements.wsUrlInput.disabled = isConnected || isConnecting;

        elements.dotGreen.classList.toggle('active', isConnected);
        elements.dotRed.classList.toggle('active', !isConnected && !isConnecting);
        elements.dotYellow.classList.toggle('active', isConnecting);

        if (isConnecting) {
            elements.statusText.textContent = 'Conectando...';
        } else if (isConnected) {
            elements.statusText.textContent = 'Conectado';
        } else {
            elements.statusText.textContent = 'Desconectado';
        }
    }

    function onWsOpen(event) {
        updateConnectionStatus(true);
        NotificationPanel.logConnectionOpen();
    }

    function onWsMessage(event) {
        NotificationPanel.logData(event);
        if (event.data.includes('NUEVO_MOVIMIENTO') || event.data.includes('NUEVO_OBSTACULO')) {
            DataManager.loadData(elements.deviceSelector.value);
        }
    }

    function onWsClose(event) {
        updateConnectionStatus(false);
        NotificationPanel.logConnectionClose(event);
    }

    function onWsError(event) {
        NotificationPanel.logError('La conexión WebSocket falló.');
    }

    elements.connectBtn.addEventListener('click', () => {
        const url = elements.wsUrlInput.value;
        if (!url) {
            NotificationPanel.logError('La URL del WebSocket no puede estar vacía.');
            return;
        }
        updateConnectionStatus(false, true);
        NotificationPanel.logStatus(`Intentando conectar a ${url}...`);
        ws.connect(url, onWsOpen, onWsMessage, onWsClose, onWsError);
    });

    elements.disconnectBtn.addEventListener('click', () => {
        ws.disconnect();
    });

    elements.refreshBtn.addEventListener('click', () => {
        DataManager.loadData(elements.deviceSelector.value);
    });

    elements.clearLogBtn.addEventListener('click', () => {
        NotificationPanel.clear();
    });

    elements.deviceSelector.addEventListener('change', (e) => {
        DataManager.loadData(e.target.value);
    });

    updateConnectionStatus(false);
    DataManager.loadData(elements.deviceSelector.value);
});