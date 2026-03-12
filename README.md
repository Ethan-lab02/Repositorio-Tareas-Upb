# Proyecto Tareas Escolares
## Realizado con Servicios (APIs)

### Usando como backend : node.js, express, dotenv
**Descripcion** : Este proyecto, es un protecto universitario para practicar la creación
de APIs usando la tecnolía de Node.js, y express.

### Herramientas

| Herramienta | Versión | Descripción |
| :--- | :---: | :--- |
| **Express** | `^5.2.1` | Framework web minimalista para Node.js, utilizado para crear las rutas y manejar peticiones HTTP. |
| **PostgreSQL (pg)** | `^8.19.0` | Cliente de Node.js para interactuar con bases de datos PostgreSQL. |
| **JSON Web Token** | `^9.0.3` | Implementación de JWT para el manejo de sesiones y seguridad basada en tokens. |
| **Bcrypt** | `^6.0.0` | Librería para el hashing de contraseñas, asegurando que no se guarden en texto plano. |
| **Dotenv** | `^17.3.1` | Carga variables de entorno desde un archivo `.env` para proteger datos sensibles (claves, URIs). |
| **CORS** | `^2.8.6` | Middleware para permitir o restringir el acceso a la API desde dominios externos. |
| **Nodemon** | `^3.1.14` | Herramienta de desarrollo que reinicia automáticamente el servidor al detectar cambios en el código. |

### Endpoints principales 
| Recurso | Ruta Base | Archivo de Ruta |
| :--- | :--- | :--- |
| **Autenticación** | `/api/auth` | `auth.routes.js` |
| **Periodos** | `/api/periodos` | `periodos.routes.js` |
| **Materias** | `/api/materias` | `materias.routes.js` |
| **Horarios** | `/api/horarios` | `horarios.routes.js` |
| **Tareas** | `/api/tareas` | `tareas.routes.js` |

# Backend Project - API Node.js

Este es el repositorio del backend para el proyecto **"backend"**. Está construido utilizando Node.js y un conjunto de librerías modernas para garantizar seguridad, escalabilidad y una conexión eficiente a bases de datos relacionales.

## 🛠️ Herramientas y Dependencias

A continuación se detallan las tecnologías principales utilizadas en el desarrollo de este servidor:

| Herramienta | Versión | Descripción |
| :--- | :---: | :--- |
| **Express** | `^5.2.1` | Framework web para manejar rutas y peticiones HTTP. |
| **PostgreSQL (pg)** | `^8.19.0` | Cliente para interactuar con la base de datos PostgreSQL. |
| **JSON Web Token** | `^9.0.3` | Manejo de autenticación basada en tokens. |
| **Bcrypt** | `^6.0.0` | Hashing de contraseñas para seguridad de usuarios. |
| **Dotenv** | `^17.3.1` | Gestión de variables de entorno (.env). |
| **CORS** | `^2.8.6` | Configuración de acceso desde dominios externos. |
| **Nodemon** | `^3.1.14` | Reinicio automático del servidor en desarrollo. |

---

## Guía de Endpoints (API Reference)

Todos los endpoints (excepto Autenticación) requieren el encabezado:  
`Authorization: Bearer <tu_token_jwt>`

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/register` | Registrar un nuevo usuario. |
| **POST** | `/login` | Iniciar sesión y obtener el token. |

### Periodos (`/api/periodos`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/` | Crear un nuevo periodo escolar. |
| **GET** | `/` | Listar todos los periodos del usuario. |
| **GET** | `/:id` | Obtener detalles de un periodo específico. |
| **PUT** | `/:id` | Actualizar la información de un periodo. |
| **DELETE** | `/:id` | Eliminar un periodo. |

### Materias (`/api/materias`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/` | Crear una nueva materia. |
| **GET** | `/` | Listar todas las materias. |
| **GET** | `/:id_periodo` | Listar materias de un periodo específico. |
| **GET** | `/detalle/:id` | Obtener el detalle de una materia. |
| **PUT** | `/:id` | Actualizar una materia. |
| **DELETE** | `/:id` | Eliminar una materia. |

### Horarios (`/api/horarios`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/` | Crear un nuevo horario. |
| **GET** | `/` | Obtener el horario completo. |
| **GET** | `/materia/:id_materia` | Listar horarios de una materia específica. |
| **PUT** | `/:id` | Actualizar un horario. |
| **DELETE** | `/:id` | Eliminar un horario. |

### Tareas (`/api/tareas`)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/` | Crear una nueva tarea. |
| **GET** | `/` | Listar todas las tareas. |
| **GET** | `/:id` | Obtener una tarea por ID. |
| **PUT** | `/:id` | Actualizar una tarea. |
| **PATCH** | `/:id/completar` | Marcar una tarea como completada. |
| **DELETE** | `/:id` | Eliminar una tarea. |
| **GET** | `/estado/pendientes` | Listar solo tareas pendientes. |
| **GET** | `/estado/vencidas` | Listar solo tareas vencidas. |
| **GET** | `/estado/completadas` | Listar solo tareas completadas. |

---

**Fecha**: 09-feb-2026
**Autor**: Itamar Abdi May Avila

*Universidad Politecnica de Bacalar*
