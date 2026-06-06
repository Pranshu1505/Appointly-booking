import api from './axios';

// Register
export const registerUser = (data) => api.post('/auth/register', data);

// Login
export const loginUser = (data) => api.post('/auth/login', data);

// Get current logged in user
export const getMe = () => api.get('/auth/me');