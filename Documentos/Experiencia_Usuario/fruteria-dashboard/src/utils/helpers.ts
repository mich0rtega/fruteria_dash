import dayjs from 'dayjs';
import type { EstadoCaducidad } from '../types';

export const calcularEstadoCaducidad = (fechaCaducidad: string): EstadoCaducidad => {
  const hoy = dayjs();
  const caducidad = dayjs(fechaCaducidad);
  const diasRestantes = caducidad.diff(hoy, 'day');

  if (diasRestantes < 0) {
    return 'caducado';
  } else if (diasRestantes <= 7) {
    return 'porCaducar';
  }
  return 'vigente';
};

export const getDiasRestantes = (fechaCaducidad: string): number => {
  const hoy = dayjs();
  const caducidad = dayjs(fechaCaducidad);
  return caducidad.diff(hoy, 'day');
};

export const formatearFecha = (fecha: string): string => {
  return dayjs(fecha).format('DD/MM/YYYY');
};

export const formatearMoneda = (cantidad: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cantidad);
};
