import api from './axiosInstance';

export const getTareas = () => api.get('/tareas');
export const getTarea = (id) => api.get(`/tareas/${id}`);
export const createTarea = (data) => api.post('/tareas', data);
export const updateTarea = (id, data) => api.put(`/tareas/${id}`, data);
export const deleteTarea = (id) => api.delete(`/tareas/${id}`);
export const completarTarea = (id) => api.patch(`/tareas/${id}/completar`);
export const getTareasPendientes = () => api.get('/tareas/estado/pendientes');
export const getTareasVencidas = () => api.get('/tareas/estado/vencidas');
export const getTareasCompletadas = () => api.get('/tareas/estado/completadas');
