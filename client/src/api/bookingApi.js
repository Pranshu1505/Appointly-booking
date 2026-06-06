import api from './axios';

// Slot fetch karo by serviceId
export const getSlots = (serviceId, date) =>
  api.get(`/slots/${serviceId}`, { params: { date } });

// Slot banao (provider only)
export const createSlot = (data) => api.post('/slots', data);

// Bulk slots banao (provider only)
export const createBulkSlots = (data) => api.post('/slots/bulk', data);

// Slot delete karo (provider only)
export const deleteSlot = (id) => api.delete(`/slots/${id}`);

// Appointment book karo (customer only)
export const createBooking = (data) => api.post('/bookings', data);

// Meri bookings fetch karo (customer)
export const getMyBookings = (status) =>
  api.get('/bookings/my', { params: { status } });

// Provider ki bookings fetch karo
export const getProviderBookings = (params) =>
  api.get('/bookings/provider', { params });

// Single booking fetch karo
export const getBooking = (id) => api.get(`/bookings/${id}`);

// Booking status update karo
export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status });

// Provider dashboard stats
export const getStats = () => api.get('/bookings/stats');