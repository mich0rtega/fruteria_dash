# Dashboard de Fruteria

Sistema web para la gestión de productos de una frutería, controlando inventario, entradas, salidas y caducidad, con enfoque en usabilidad y accesibilidad.

# Tecnologías utilizadas

React 18.2.0

Vite 5.1.0

TypeScript 5.2.2

Ant Design 5.29.2

JSON Server 0.17.4

React Router DOM 6.22.0

Axios 1.6.7

Day.js 1.11.10

# Objetivo

Desarrollar un dashboard web para la gestión de productos de una frutería, controlando inventario, entradas, salidas y caducidad, aplicando principios de usabilidad y accesibilidad.

# Vistas del proyecto
Dashboard: Muestra estadísticas generales como stock total, productos por caducar, y las últimas entradas y salidas.

Gestión de productos: Listado de productos (mínimo 15) con funciones de alta, edición y eliminación.

Entradas: Registro de nuevas entradas al inventario con actualización automática del stock.

Salidas: Registro de salidas del inventario con validación para evitar stock negativo.

Caducidad: Visualización de productos en tres categorías: vigentes, por caducar y caducados, con indicadores visuales.

Base de datos
El sistema utiliza JSON Server como backend simulado, con las siguientes entidades:

Productos: Información completa de cada producto (nombre, categoría, precio, stock, unidad, fecha de caducidad, proveedor)

Entradas: Registro de ingresos al inventario

Salidas: Registro de egresos del inventario

Accesibilidad y usabilidad
Labels y validaciones correctas en todos los formularios

Buen contraste de colores (cumple WCAG AA)

Navegación por teclado completa

Mensajes claros de éxito, error y advertencia

Menú de navegación claro e intuitivo

Flujo sencillo entre las diferentes secciones

Diseño responsive para diferentes dispositivos

# Requisitos previos
Node.js versión 18 o superior

npm versión 9 o superior

# Para verificar las versiones instaladas:

bash
node --version
npm --version

# Instalación
Paso 1: Clonar o descargar el proyecto
Si tienes el proyecto en GitHub:

bash
git clone (https://github.com/mich0rtega/fruteria_dash.git)
cd fruteria-dashboard
Si descargaste el archivo ZIP:

bash
# Descomprime el archivo y navega a la carpeta
cd fruteria-dashboard
Paso 2: Instalar dependencias
bash
npm install
Este comando instalará todas las dependencias necesarias para el proyecto.

Comando para correr el proyecto
IMPORTANTE: El proyecto requiere ejecutar dos comandos en terminales separadas.

Terminal 1: Iniciar el servidor JSON Server (Backend)
bash
npm run server
Este comando iniciará el servidor JSON Server en http://localhost:3001

Terminal 2: Iniciar la aplicación React (Frontend)
bash
npm run dev
Este comando iniciará el servidor de desarrollo de Vite en http://localhost:5173

Acceder a la aplicación
Abre tu navegador y visita: http://localhost:5173

# Estructura del proyecto
text
fruteria-dashboard/
├── src/
│   ├── components/
│   │   └── MainLayout.tsx          # Layout principal con navegación
│   ├── pages/
│   │   ├── Dashboard.tsx           # Página principal con estadísticas
│   │   ├── Productos.tsx           # Gestión de productos (CRUD)
│   │   ├── Entradas.tsx            # Registro de entradas
│   │   ├── Salidas.tsx             # Registro de salidas
│   │   └── Caducidad.tsx           # Control de caducidad
│   ├── services/
│   │   └── api.ts                  # Servicios de API
│   ├── types/
│   │   └── index.ts                # Definiciones de TypeScript
│   ├── utils/
│   │   └── helpers.ts              # Funciones auxiliares
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Punto de entrada
│   ├── index.css                   # Estilos globales
│   └── vite-env.d.ts              # Tipos de Vite
├── db.json                         # Base de datos JSON Server
├── index.html                      # HTML principal
├── package.json                    # Dependencias
├── tsconfig.json                   # Configuración TypeScript
├── vite.config.ts                  # Configuración Vite
└── README.md                       # Documentación

# Notas importantes
Siempre debes tener dos terminales abiertas: una para el frontend y otra para el backend.

JSON Server corre en el puerto 3001 y Vite en el puerto 5173.

Los datos se guardan automáticamente en el archivo db.json.

El proyecto utiliza TypeScript con configuraciones estrictas para mayor robustez.

Enlace a GitHub
(https://github.com/mich0rtega/fruteria_dash/tree/main/Documentos/Experiencia_Usuario)

Trabajo individual desarrollado por Michelle Ortega - Experiencia de usuario
