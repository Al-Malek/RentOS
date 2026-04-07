// API Configuration and Client for RentOS Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rentos_token');
};

// API Client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Vehículos
  async getVehiculos() {
    return this.request('/vehiculos');
  }

  async createVehiculo(data: any) {
    return this.request('/vehiculos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVehiculo(id: number, data: any) {
    return this.request(`/vehiculos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteVehiculo(id: number) {
    return this.request(`/vehiculos/${id}`, {
      method: 'DELETE',
    });
  }

  // Clientes
  async getClientes() {
    return this.request('/clientes');
  }

  async createCliente(data: any) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async searchClientes(query: string) {
    return this.request(`/clientes/search?q=${encodeURIComponent(query)}`);
  }

  async updateCliente(id: string, data: any) {
    return this.request(`/clientes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCliente(id: string) {
    return this.request(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservas
  async getReservas() {
    return this.request('/reservas');
  }

  async createReserva(data: any) {
    return this.request('/reservas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verificarDisponibilidad(data: any) {
    return this.request('/reservas/verificar-disponibilidad', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelarReserva(id: string) {
    return this.request(`/reservas/${id}/cancelar`, {
      method: 'PATCH',
    });
  }

  async finalizarReserva(id: string) {
    return this.request(`/reservas/${id}/finalizar`, {
      method: 'PATCH',
    });
  }

  // Tarifas
  async getTarifas() {
    return this.request('/tarifas');
  }

  async createTarifa(data: any) {
    return this.request('/tarifas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calcularPrecio(data: any) {
    return this.request('/tarifas/calcular-precio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTarifa(id: string, data: any) {
    return this.request(`/tarifas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTarifa(id: string) {
    return this.request(`/tarifas/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboardMetricas() {
    return this.request('/dashboard/metricas');
  }

  async getDashboardIngresos() {
    return this.request('/dashboard/ingresos');
  }

  async getTopVehiculos() {
    return this.request('/dashboard/top-vehiculos');
  }

  // RAG / IA
  async chatWithAssistant(message: string) {
    return this.request('/rag/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getConversations() {
    return this.request('/rag/conversations');
  }

  async clearConversations() {
    return this.request('/rag/conversations', {
      method: 'DELETE',
    });
  }

  // Notificaciones
  async getNotificaciones() {
    return this.request('/notificaciones');
  }

  async enviarNotificacion(data: any) {
    return this.request('/notificaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tenants
  async getTenants() {
    return this.request('/tenants');
  }

  async createTenant(data: any) {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleTenantEstado(id: string) {
    return this.request(`/tenants/${id}/toggle-estado`, {
      method: 'PATCH',
    });
  }

  // Mantenimiento
  async getMantenimientoPendiente() {
    return this.request('/mantenimiento/pendientes');
  }
}

export const api = new ApiClient(API_URL);
export default api;
