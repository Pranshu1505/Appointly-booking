import api from './axios';

// Saari services fetch karo
export const getServices = (params) => api.get('/services', { params });

// Single service fetch karo
export const getService = (id) => api.get(`/services/${id}`);

// Categories fetch karo
export const getCategories = () => api.get('/services/categories');

// Service banao (provider only)
export const createService = (data) => api.post('/services', data);

// Service update karo (provider only)
export const updateService = (id, data) => api.put(`/services/${id}`, data);

// Service delete karo (provider only)
export const deleteService = (id) => api.delete(`/services/${id}`);