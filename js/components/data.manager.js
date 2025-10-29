export const DataManager = {
    init(apiService, movementsList, obstaclesList, obstaclesDeviceLabel) {
        this.api = apiService;
        this.movementsList = movementsList;
        this.obstaclesList = obstaclesList;
        this.obstaclesDeviceLabel = obstaclesDeviceLabel;
    },

    async loadData(dispositivoNombre) {
        this.renderLoading(this.movementsList);
        this.renderLoading(this.obstaclesList);
        this.obstaclesDeviceLabel.textContent = dispositivoNombre;

        try {
            const [movements, obstacles] = await Promise.all([
                this.api.getUltimosMovimientos(dispositivoNombre),
                this.api.getUltimosObstaculos(dispositivoNombre)
            ]);
            
            this.renderMovements(movements);
            this.renderObstacles(obstacles);

        } catch (error) {
            this.renderError(this.movementsList, error);
            this.renderError(this.obstaclesList, error);
        }
    },

    renderLoading(listElement) {
        listElement.innerHTML = '<li class="list-group-item text-muted">Cargando datos...</li>';
    },

    renderError(listElement, error) {
        listElement.innerHTML = `<li class="list-group-item text-danger">Error al cargar: ${error.message}</li>`;
    },

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: 'short'
        });
    },

    renderMovements(movements) {
        if (!movements || movements.length === 0) {
            this.movementsList.innerHTML = '<li class="list-group-item text-muted">No hay movimientos registrados.</li>';
            return;
        }

        this.movementsList.innerHTML = movements.map(mov => `
            <li class="list-group-item">
                <strong>${mov.movimiento}</strong>
                <span class="data-list-time">${this.formatDate(mov.fecha_evento)}</span>
                <span class="text-muted small">${mov.ip_cliente}</span>
            </li>
        `).join('');
    },

    renderObstacles(obstacles) {
        if (!obstacles || obstacles.length === 0) {
            this.obstaclesList.innerHTML = '<li class="list-group-item text-muted">No hay obstáculos registrados.</li>';
            return;
        }

        this.obstaclesList.innerHTML = obstacles.map(obs => `
            <li class="list-group-item">
                <strong>${obs.obstaculo_detectado}</strong>
                <span class="data-list-time">${this.formatDate(obs.fecha_evento)}</span>
                <span class="text-muted small">${obs.ip_cliente}</span>
            </li>
        `).join('');
    }
};