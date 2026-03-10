const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/tareas.controller');

/*
Endpoints:
http://localhost:3000/api/tareas/ METODO POST Nueva tarea 
http://localhost:3000/api/tareas/ metodo GET Listar todas las tareas
http://localhost:3000/api/tareas/id metodo GET listar 1 tarea 
http://localhost:3000/api/tareas/id metodo PUT actualizar tarea
http://localhost:3000/api/tareas/id/completar metodo PATCH cambiar estado
http://localhost:3000/api/tareas/id metodo DELETE borrar tarea 
http://localhost:3000/api/tareas/estado/pendiente GET
http://localhost:3000/api/tareas/estado/vencidas GET
http://localhost:3000/api/tareas/estado/completadas GET
*/
// Crear una nueva tarea
router.post('/', verificarToken, controller.crearTarea);

// Consultar todas las tareas
router.get('/', verificarToken, controller.obtenerTodasLasTareas);

// Consultar una tarea segun su id 
router.get('/:id', verificarToken, controller.obtenerTareaPorId);

// Actualizar una tarea
router.put('/:id', verificarToken, controller.actualizarTarea);

// Marcar como comletada una tarea
router.patch('/:id/completar', verificarToken, controller.marcarComoCompletada);

// Eliminar la tarea por id
router.delete('/:id', verificarToken, controller.eliminarTarea);

// Endpoints adicionales 
// Tareas pendientes 
router.get('/estado/pendientes', verificarToken, controller.tareasPendientes);

// Tareas vencidas
router.get('/estado/vencidas', verificarToken, controller.tareasVencidas);

// Tareas completadas
router.get('/estado/completadas', verificarToken, controller.tareasCompletadas);


module.exports = router;
