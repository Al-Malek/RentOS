import { useState } from 'react';
import { api } from '@/lib/api';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  vehiculoId?: number;
}

export interface IngresosReport {
  totalIngresos: number;
  totalReservas: number;
  promedioIngreso: number;
  ingresosPorMes: Array<{
    mes: string;
    ingresos: number;
    reservas: number;
  }>;
  reservas: any[];
}

export interface VehiculosReport {
  totalVehiculos: number;
  disponibles: number;
  rentados: number;
  enMantenimiento: number;
  vehiculos: Array<{
    id: number;
    marca: string;
    modelo: string;
    estadisticas: {
      totalReservas: number;
      totalIngresos: number;
      reservasActivas: number;
      promedioIngreso: number;
    };
  }>;
}

export interface ClientesReport {
  totalClientes: number;
  clientes: Array<{
    id: string;
    nombre: string;
    estadisticas: {
      totalReservas: number;
      totalGastado: number;
      cancelaciones: number;
      promedioGasto: number;
    };
  }>;
  topClientes: any[];
}

export interface OcupacionReport {
  diasDisponibles: number;
  diasOcupados: number;
  tasaOcupacion: number;
  vehiculosTotales: number;
  reservasTotales: number;
}

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getIngresosReport = async (filters?: ReportFilters): Promise<IngresosReport | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReporteIngresos(filters);
      return data;
    } catch (err: any) {
      console.error('Error loading ingresos report:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getVehiculosReport = async (): Promise<VehiculosReport | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReporteVehiculos();
      return data;
    } catch (err: any) {
      console.error('Error loading vehiculos report:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getClientesReport = async (): Promise<ClientesReport | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReporteClientes();
      return data;
    } catch (err: any) {
      console.error('Error loading clientes report:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOcupacionReport = async (filters?: Omit<ReportFilters, 'vehiculoId'>): Promise<OcupacionReport | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReporteOcupacion(filters);
      return data;
    } catch (err: any) {
      console.error('Error loading ocupacion report:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getIngresosReport,
    getVehiculosReport,
    getClientesReport,
    getOcupacionReport,
  };
};
