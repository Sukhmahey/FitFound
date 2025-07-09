import {api} from './api';

export const notificationApi = {
  create: (data) => api.post('/notifications', data),
  getByUser: (userId) => api.get(`/notifications/${userId}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};
