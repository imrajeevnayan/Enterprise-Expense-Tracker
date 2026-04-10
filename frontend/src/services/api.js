import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refreshToken: (token) => api.post('/auth/refresh-token', token),
};

export const transactionService = {
  getAll: (page = 0, size = 10) => api.get(`/transactions?page=${page}&size=${size}`),
  create: (data) => api.post('/transactions', data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const budgetService = {
  getAll: (month, year) => api.get(`/budgets?month=${month}&year=${year}`),
  create: (data) => api.post('/budgets', data),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
};

export default api;
