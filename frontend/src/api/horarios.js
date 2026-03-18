import api from './axiosInstance';

export const getHorarios = () => api.get('/horarios');
export const getHorariosByMateria = (id_materia) => api.get(`/horarios/materia/${id_materia}`);
export const createHorario = (data) => api.post('/horarios', data);
export const updateHorario = (id, data) => api.put(`/horarios/${id}`, data);
export const deleteHorario = (id) => api.delete(`/horarios/${id}`);
