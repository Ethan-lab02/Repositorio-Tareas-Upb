import api from './axiosInstance';

export const getMaterias = () => api.get('/materias');
export const getMateriasByPeriodo = (id_periodo) => api.get(`/materias/${id_periodo}`);
export const getMateria = (id) => api.get(`/materias/detalle/${id}`);
export const createMateria = (data) => api.post('/materias', data);
export const updateMateria = (id, data) => api.put(`/materias/${id}`, data);
export const deleteMateria = (id) => api.delete(`/materias/${id}`);
