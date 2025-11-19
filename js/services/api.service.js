export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async _fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }

            const jsonResponse = await response.json();

            // Manejo de la nueva estructura ApiResponse { success, data, error }
            if (jsonResponse.success === false) {
                throw new Error(jsonResponse.error || 'Error reportado por la API');
            }

            // Retornamos directamente los datos (el arreglo)
            return jsonResponse.data;

        } catch (error) {
            console.error(`Fallo en API: ${endpoint}`, error.message);
            throw error;
        }
    }

    getUltimosMovimientos(dispositivoNombre, limite = 10) {
        return this._fetch(`/api/v1/iot/query/movimiento/${dispositivoNombre}?limite=${limite}`, {
            method: 'GET',
        });
    }

    getUltimosObstaculos(dispositivoNombre, limite = 10) {
        return this._fetch(`/api/v1/iot/query/obstaculo/${dispositivoNombre}?limite=${limite}`, {
            method: 'GET',
        });
    }
}