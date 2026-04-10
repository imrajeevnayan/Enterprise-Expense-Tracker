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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's a 401 error and not a refresh attempt already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');
        
        // Use a clean axios instance to avoid interceptor loops
        const { data } = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken });

        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        if (data.email) {
          localStorage.setItem('user', JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email
          }));
        }
        
        // Update both the original request and the global instance
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Session expired, logging out...');
        localStorage.clear();
        window.location.href = '/login?expired=true';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
  delete: (id) => api.delete(`/budgets/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const reportService = {
  getMonthlyReport: (startDate, endDate) => api.get(`/reports/monthly?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'blob'
  }),
};

export default api;
