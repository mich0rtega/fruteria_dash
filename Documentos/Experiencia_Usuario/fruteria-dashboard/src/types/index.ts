export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  fechaCaducidad: string;
  proveedor: string;
}

export interface Entrada {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  fecha: string;
  proveedor: string;
  precioCompra: number;
}

export interface Salida {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  fecha: string;
  motivo: string;
  cliente: string;
}

export interface DashboardStats {
  stockTotal: number;
  productosPorCaducar: number;
  entradasRecientes: number;
  salidasRecientes: number;
}

export type EstadoCaducidad = 'vigente' | 'porCaducar' | 'caducado';
