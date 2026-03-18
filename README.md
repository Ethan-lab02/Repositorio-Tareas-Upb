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

## Frontend (Cliente)
Este proyecto cuenta con una interfaz moderna y responsiva construida con **React** y **Vite**, diseñada para gestionar tareas y horarios de manera eficiente.

### Tecnologías Utama
| Herramienta | Versión | Descripción |
| :--- | :---: | :--- |
| **React** | `^18.3.1` | Biblioteca para construir la interfaz de usuario. |
| **Vite** | `^5.3.4` | Herramienta de construcción rápida para el frontend. |
| **React Router** | `^6.24.1` | Manejo de rutas y navegación protegida. |
| **Axios** | `^1.7.2` | Cliente HTTP para consumir los servicios de la API. |
| **Lucide React** | `^0.400.0` | Set de iconos vectoriales para mejorar la estética visual. |
| **React Big Calendar** | `^1.13.1` | Componente para la visualización de tareas en formato calendario. |
| **Date-fns** | `^3.6.0` | Manipulación y formateo de fechas. |

### Arquitectura y Estructura
La aplicación está organizada siguiendo las mejores prácticas de React:
- **API Layer (`src/api/`)**: Centraliza todas las peticiones al backend (Materias, Tareas, Auth, etc.).
- **Context API (`src/context/`)**: Gestiona el estado global de autenticación y persistencia del token JWT.
- **Componentes (`src/components/`)**: Elementos reutilizables como el sistema de Layout, Modales y rutas protegidas (`ProtectedRoute`).
- **Páginas (`src/pages/`)**: Contiene las vistas principales como Login, Registro, Gestión de Materias, Tareas, Periodos y Calendario.

### Funcionalidades Clave
1.  **Autenticación**: Registro e inicio de sesión seguro con manejo de tokens.
2.  **Gestión de Periodos y Materias**: CRUD completo para organizar el ciclo escolar.
3.  **Sistema de Tareas**: Seguimiento de tareas pendientes, completadas y vencidas.
4.  **Horario Semanal**: Visualización dinámica de clases con colores personalizados por materia.
5.  **Calendario Interactivo**: Vista mensual de compromisos y entregas de tareas.

### Instalación y Ejecución
Para ejecutar el frontend localmente:
1. Navega a la carpeta del frontend: `cd frontend`
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

---

**Fecha**: 18-mar-2026
**Autor**: Itamar Abdi May Avila

*Universidad Politecnica de Bacalar*
