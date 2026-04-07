import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export const useDashboard = () => {
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMetricas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardMetricas();
      setMetricas(data);
    } catch (err: any) {
      console.error('Error loading dashboard metrics:', err);
      setError(err.message);
      // Fallback to empty metrics
      setMetricas({
        ingresosMesActual: 0,
        cambioIngresos: 0,
        flotaTotal: 0,
        disponibles: 0,
        enTaller: 0,
        alquilados: 0,
        reservasActivasHoy: 0,
        clientesTotales: 0,
        tasaOcupacion: 0,
        topVehiculos: [],
        ultimasReservas: [],
        ingresosPorSemana: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetricas();
  }, []);

  return { ...metricas, loading, error, refresh: loadMetricas };
};
