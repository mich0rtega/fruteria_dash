import axios from 'axios';
import type { Producto, Entrada, Salida } from '../types';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Productos
export const productosAPI = {
  getAll: () => api.get<Producto[]>('/productos'),
  getById: (id: number) => api.get<Producto>(`/productos/${id}`),
  create: (producto: Omit<Producto, 'id'>) => api.post<Producto>('/productos', producto),
  update: (id: number, producto: Partial<Producto>) => api.patch<Producto>(`/productos/${id}`, producto),
  delete: (id: number) => api.delete(`/productos/${id}`),
};

// Entradas
export const entradasAPI = {
  getAll: () => api.get<Entrada[]>('/entradas'),
  getById: (id: number) => api.get<Entrada>(`/entradas/${id}`),
  create: (entrada: Omit<Entrada, 'id'>) => api.post<Entrada>('/entradas', entrada),
  delete: (id: number) => api.delete(`/entradas/${id}`),
};

// Salidas
export const salidasAPI = {
  getAll: () => api.get<Salida[]>('/salidas'),
  getById: (id: number) => api.get<Salida>(`/salidas/${id}`),
  create: (salida: Omit<Salida, 'id'>) => api.post<Salida>('/salidas', salida),
  delete: (id: number) => api.delete(`/salidas/${id}`),
};

export default api;
