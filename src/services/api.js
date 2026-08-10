const API_BASE = '/api';

/**
 * Universal Fetch wrapper with automatic JWT authorization header injection
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('ecom_crm_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

// API Service Endpoints
export const api = {
  // Health
  checkHealth: () => fetchApi('/health'),

  // Authentication
  auth: {
    login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => fetchApi('/auth/me'),
    demoLogin: (role) => fetchApi(`/auth/demo/${role}`, { method: 'POST' })
  },

  // Products & Catalog
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchApi(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id) => fetchApi(`/products/${id}`),
    getCategories: () => fetchApi('/products/categories'),
    create: (product) => fetchApi('/products', { method: 'POST', body: JSON.stringify(product) }),
    update: (id, product) => fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    delete: (id) => fetchApi(`/products/${id}`, { method: 'DELETE' })
  },

  // Orders & Checkout
  orders: {
    checkout: (orderData) => fetchApi('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),
    getMyOrders: () => fetchApi('/orders/my-orders'),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchApi(`/orders/all${query ? `?${query}` : ''}`);
    },
    updateStatus: (id, status) => fetchApi(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },

  // CRM Portal (Admin)
  crm: {
    getCustomers: () => fetchApi('/crm/customers'),
    getCustomerById: (id) => fetchApi(`/crm/customers/${id}`),
    getAnalytics: () => fetchApi('/crm/analytics')
  },

  // Support Desk
  support: {
    createTicket: (ticketData) => fetchApi('/support/tickets', { method: 'POST', body: JSON.stringify(ticketData) }),
    getMyTickets: () => fetchApi('/support/my-tickets'),
    getAllTickets: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchApi(`/support/tickets/all${query ? `?${query}` : ''}`);
    },
    getTicketDetails: (id) => fetchApi(`/support/tickets/${id}`),
    addMessage: (id, message) => fetchApi(`/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
    updateStatus: (id, status) => fetchApi(`/support/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  }
};

export default api;
