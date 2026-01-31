# 🍎 Dashboard de Frutería - Sistema de Gestión de Inventario

Dashboard web profesional para la gestión integral de productos de frutería, con control de inventario, entradas, salidas y caducidad.

## 📋 Descripción

Sistema completo de gestión de inventario desarrollado con las últimas tecnologías web, enfocado en usabilidad y accesibilidad. Permite gestionar el stock de productos, registrar entradas y salidas, y controlar las fechas de caducidad de manera eficiente.

## ✨ Características Principales

### 📊 Dashboard General
- **Visualización de estadísticas clave**: Stock total, productos por caducar, entradas y salidas recientes
- **Tablas interactivas**: Últimas 5 entradas y salidas del inventario
- **Indicadores visuales**: Gráficas y estadísticas en tiempo real

### 🛒 Gestión de Productos
- **CRUD completo**: Crear, leer, actualizar y eliminar productos
- **Mínimo 15 productos** en la base de datos inicial
- **Filtros y ordenamiento**: Por categoría, precio, stock, fecha de caducidad
- **Validaciones**: Campos obligatorios, formatos correctos
- **Indicadores de estado**: Tags visuales según estado de caducidad

### 📥 Registro de Entradas
- **Registro de nuevas entradas** al inventario
- **Actualización automática de stock**: El stock se incrementa automáticamente
- **Información completa**: Producto, cantidad, fecha, proveedor, precio de compra
- **Eliminación con reversión**: Al eliminar una entrada, se revierte el stock

### 📤 Registro de Salidas
- **Registro de salidas** del inventario (ventas, mermas, donaciones)
- **Validación de stock**: Previene stock negativo
- **Alertas de disponibilidad**: Muestra stock disponible al seleccionar producto
- **Motivos clasificados**: Venta, Merma, Uso Interno, Donación
- **Eliminación con reversión**: Al eliminar una salida, se revierte el stock

### ⏰ Control de Caducidad
- **Tres categorías visuales**:
  - ✅ **Vigentes**: Productos con más de 7 días
  - ⚠️ **Por Caducar**: Productos con 7 días o menos
  - ❌ **Caducados**: Productos ya vencidos
- **Indicadores visuales**: Progress bars, tags de colores, iconos
- **Alertas contextuales**: Mensajes según la categoría
- **Contadores**: Estadísticas por categoría

### ♿ Accesibilidad
- **Labels semánticos** en todos los formularios
- **ARIA attributes** en elementos interactivos
- **Navegación por teclado** completa
- **Contraste adecuado** (WCAG AA)
- **Mensajes descriptivos** de éxito, error y advertencia
- **Validaciones claras** con mensajes específicos

### 🎨 Usabilidad
- **Interfaz intuitiva** con menú lateral colapsable
- **Diseño responsive** para dispositivos móviles y escritorio
- **Flujos simples** y directos
- **Feedback visual** en todas las acciones
- **Tablas paginadas** con opciones de tamaño de página
- **Búsqueda y filtros** en selects y tablas

## 🛠 Tecnologías Utilizadas

- **React 18.2.0** - Biblioteca de interfaz de usuario
- **TypeScript 5.2.2** - Tipado estricto
- **Vite 5.1.0** - Build tool y dev server
- **Ant Design 5.29.2** - Biblioteca de componentes UI
- **React Router DOM 6.22.0** - Enrutamiento
- **Axios 1.6.7** - Cliente HTTP
- **Day.js 1.11.10** - Manejo de fechas
- **JSON Server 0.17.4** - API REST simulada

## 📁 Estructura del Proyecto

```
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
└── README.md                       # Este archivo
```

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** versión 9 o superior

Puedes verificar las versiones instaladas con:

```bash
node --version
npm --version
```

## 🚀 Instalación

### Paso 1: Clonar o descargar el proyecto

Si tienes el proyecto en GitHub:
```bash
git clone <URL_DEL_REPOSITORIO>
cd fruteria-dashboard
```

Si descargaste el ZIP:
```bash
# Descomprime el archivo y navega a la carpeta
cd fruteria-dashboard
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias del proyecto.

## ▶️ Ejecución del Proyecto

**IMPORTANTE**: El proyecto requiere ejecutar DOS comandos en terminales separadas.

### Terminal 1: Iniciar el servidor JSON Server (Backend)

En la primera terminal, ejecuta:

```bash
npm run server
```

Este comando iniciará el servidor JSON Server en `http://localhost:3001`

Deberías ver un mensaje similar a:
```
JSON Server is running
Resources:
http://localhost:3001/productos
http://localhost:3001/entradas
http://localhost:3001/salidas
```

### Terminal 2: Iniciar la aplicación React (Frontend)

En una **segunda terminal** (sin cerrar la primera), ejecuta:

```bash
npm run dev
```

Este comando iniciará el servidor de desarrollo de Vite en `http://localhost:5173`

Deberías ver un mensaje similar a:
```
VITE v5.1.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Acceder a la aplicación

Abre tu navegador y visita: **http://localhost:5173**

## 🎯 Uso de la Aplicación

### 1. Dashboard
- Visualiza el stock total, productos por caducar y movimientos recientes
- Accede desde el menú lateral con el icono de Dashboard

### 2. Gestión de Productos
- **Crear**: Haz clic en "Nuevo Producto" y completa el formulario
- **Editar**: Haz clic en "Editar" en la fila del producto
- **Eliminar**: Haz clic en "Eliminar" y confirma la acción
- **Filtrar**: Usa los filtros de la tabla para buscar productos

### 3. Entradas
- Haz clic en "Nueva Entrada"
- Selecciona el producto (verás el stock actual)
- Ingresa cantidad, fecha, proveedor y precio
- El stock se actualizará automáticamente

### 4. Salidas
- Haz clic en "Nueva Salida"
- Selecciona el producto (se mostrará el stock disponible)
- Ingresa cantidad (no puede exceder el stock)
- Selecciona motivo y cliente/destino
- El sistema valida que no haya stock negativo

### 5. Control de Caducidad
- Visualiza productos en tres pestañas:
  - **Vigentes**: Más de 7 días
  - **Por Caducar**: 7 días o menos
  - **Caducados**: Fecha vencida
- Cada producto muestra una barra de progreso visual

## 📊 Base de Datos

El archivo `db.json` contiene:
- **15 productos** de ejemplo (frutas diversas)
- **2 entradas** de muestra
- **2 salidas** de muestra

Todos los datos se pueden modificar desde la aplicación y los cambios se persisten en el archivo.

## 🔧 Scripts Disponibles

```bash
# Desarrollo del frontend
npm run dev

# Backend (JSON Server)
npm run server

# Compilar para producción
npm run build

# Vista previa de la build de producción
npm run preview

# Linting
npm run lint
```

## ✅ Checklist de Funcionalidades

- ✅ React + Vite + TypeScript configurado
- ✅ Ant Design 5.29.2 implementado
- ✅ JSON Server como backend
- ✅ Base de datos con 15+ productos
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de productos
- ✅ Registro de entradas con actualización de stock
- ✅ Registro de salidas con validación
- ✅ Control de caducidad con indicadores visuales
- ✅ Labels y validaciones en formularios
- ✅ ARIA attributes
- ✅ Navegación por teclado
- ✅ Buen contraste de colores
- ✅ Mensajes claros de éxito/error
- ✅ Menú de navegación intuitivo
- ✅ Diseño responsive
- ✅ README completo

## 🐛 Solución de Problemas

### Error: "Cannot GET /"
**Solución**: Asegúrate de que ambos servidores estén corriendo (frontend y backend)

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"
**Solución**: Verifica que JSON Server esté corriendo en el puerto 3001

### Los cambios no se guardan
**Solución**: Verifica que el archivo `db.json` no esté protegido contra escritura

### El proyecto no inicia
**Solución**: 
1. Elimina la carpeta `node_modules`
2. Ejecuta `npm install` nuevamente
3. Intenta iniciar el proyecto

## 📝 Notas Importantes

1. **Dos terminales**: Siempre debes tener dos terminales abiertas (frontend + backend)
2. **Puerto 3001**: JSON Server debe correr en el puerto 3001
3. **Puerto 5173**: Vite corre por defecto en el puerto 5173
4. **Persistencia**: Los datos se guardan en `db.json` automáticamente
5. **TypeScript estricto**: Todos los tipos están definidos y validados

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como práctica de:
- Gestión de estado con React
- Tipado estricto con TypeScript
- Integración con APIs REST
- Diseño accesible y usable
- Componentes reutilizables
- Validaciones de formularios

## 📄 Licencia

Proyecto académico - 2026

---

**Desarrollado con ❤️ para la gestión eficiente de fruterías**

Para cualquier duda o problema, revisa la documentación de:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [JSON Server](https://github.com/typicode/json-server)
